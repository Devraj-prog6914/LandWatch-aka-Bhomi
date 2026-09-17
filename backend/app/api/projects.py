from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.project import ProjectOut, ProjectDetailOut, ProjectFilter
from app.schemas.simulation import SimulationRequest, SimulationResponse
from app.auth.dependencies import get_current_user
from app.services.project_service import ProjectService
from app.services.simulation_service import SimulationService
from app.services.ml_service import MLService
from app.services.audit_service import AuditService
from app.services.gov_connector_service import GovConnectorService

router = APIRouter(prefix="/projects", tags=["Infrastructure Projects"])


@router.get("", response_model=List[ProjectOut])
def list_projects(
    state: Optional[str] = None,
    district: Optional[str] = None,
    sector: Optional[str] = None,
    implementing_agency: Optional[str] = None,
    risk_tier: Optional[str] = None,
    min_disputes: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    filters = ProjectFilter(
        state=state,
        district=district,
        sector=sector,
        implementing_agency=implementing_agency,
        risk_tier=risk_tier,
        min_disputes=min_disputes,
        search=search
    )
    return ProjectService.list_projects(db, current_user, filters=filters, skip=skip, limit=limit)


@router.get("/{project_id}", response_model=ProjectDetailOut)
def get_project_detail(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = ProjectService.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")
        
    p_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
    analysis = MLService.get_full_analysis(p_dict)
    milestones = ProjectService.build_lifecycle_timeline(project)
    
    out_dict = dict(p_dict)
    out_dict.update({
        "top_risk_drivers": analysis["top_risk_drivers"],
        "top_mitigating_factors": analysis["top_mitigating_factors"],
        "waterfall_steps": analysis["waterfall_steps"],
        "recommendations": analysis["recommendations"],
        "timeline_milestones": milestones
    })
    return out_dict


@router.post("/{project_id}/simulate", response_model=SimulationResponse)
def simulate_project_interventions(
    project_id: str,
    simulation_inputs: SimulationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = ProjectService.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")

    sim_result = SimulationService.simulate_intervention(project, simulation_inputs)
    
    # Audit log entry
    AuditService.log_action(
        db=db,
        user=current_user,
        action="SIMULATION_EXECUTED",
        resource_type="PROJECT",
        resource_id=project.project_id,
        details=f"Simulated intervention: {simulation_inputs.dict(exclude_none=True)}. Result: {sim_result.risk_tier_transition}, saved {sim_result.delay_months_saved} months."
    )
    
    return sim_result


@router.get("/{project_id}/gov-integrations")
def get_gov_integrations(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = ProjectService.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")
        
    pfms = GovConnectorService.query_pfms_dbt_status(project.project_id, project.budget_inr_cr, project.compensation_disbursed_pct)
    ecourts = GovConnectorService.query_ecourts_litigation(project.project_id, project.district, project.active_court_disputes)
    bhoomi = GovConnectorService.query_dilrmp_bhoomi(project.project_id, project.state, project.cadastral_digitized_pct)
    parivesh = GovConnectorService.query_parivesh_clearance(project.project_id, project.forest_clearance_status, project.environment_clearance_status)
    
    return {
        "project_id": project.project_id,
        "project_name": project.project_name,
        "integrations": {
            "pfms_dbt": pfms,
            "ecourts_njdg": ecourts,
            "dilrmp_bhoomi": bhoomi,
            "parivesh_moefcc": parivesh
        }
    }
