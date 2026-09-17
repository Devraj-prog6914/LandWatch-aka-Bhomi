from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.project import Project
from app.models.alert import Alert, AlertStatus, AlertSeverity
from app.auth.dependencies import get_current_user
from app.services.project_service import ProjectService

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Analytics"])


@router.get("/kpis")
def get_dashboard_kpis(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    base_query = ProjectService.get_scoped_projects_query(db, current_user)
    
    total_projects = base_query.count()
    if total_projects == 0:
        return {
            "total_projects": 0,
            "delayed_projects": 0,
            "delayed_pct": 0.0,
            "total_budget_cr": 0.0,
            "budget_at_risk_cr": 0.0,
            "avg_delay_months": 0.0,
            "high_risk_count": 0,
            "medium_risk_count": 0,
            "low_risk_count": 0,
            "open_critical_alerts": 0
        }

    delayed_projects = base_query.filter(Project.is_delayed == 1).count()
    high_risk = base_query.filter(Project.risk_tier == "High").count()
    medium_risk = base_query.filter(Project.risk_tier == "Medium").count()
    low_risk = base_query.filter(Project.risk_tier == "Low").count()
    
    total_budget = db.query(func.sum(Project.budget_inr_cr)).filter(Project.id.in_(base_query.with_entities(Project.id))).scalar() or 0.0
    budget_at_risk = db.query(func.sum(Project.budget_inr_cr)).filter(
        Project.id.in_(base_query.with_entities(Project.id)),
        Project.risk_tier.in_(["High", "Medium"])
    ).scalar() or 0.0
    
    avg_delay = db.query(func.avg(Project.delay_months_predicted)).filter(
        Project.id.in_(base_query.with_entities(Project.id)),
        Project.is_delayed == 1
    ).scalar() or 0.0

    critical_alerts = db.query(Alert).filter(
        Alert.severity == AlertSeverity.CRITICAL,
        Alert.status == AlertStatus.OPEN
    ).count()

    return {
        "total_projects": total_projects,
        "delayed_projects": delayed_projects,
        "delayed_pct": round((delayed_projects / total_projects) * 100.0, 1),
        "total_budget_cr": round(float(total_budget), 2),
        "budget_at_risk_cr": round(float(budget_at_risk), 2),
        "avg_delay_months": round(float(avg_delay), 1),
        "high_risk_count": high_risk,
        "medium_risk_count": medium_risk,
        "low_risk_count": low_risk,
        "open_critical_alerts": critical_alerts
    }


@router.get("/sector-breakdown")
def get_sector_breakdown(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    base_query = ProjectService.get_scoped_projects_query(db, current_user)
    projects = base_query.all()
    
    sectors_map = {}
    for p in projects:
        sec = p.sector
        if sec not in sectors_map:
            sectors_map[sec] = {
                "sector": sec,
                "total_projects": 0,
                "high_risk": 0,
                "medium_risk": 0,
                "low_risk": 0,
                "total_budget_cr": 0.0,
                "delayed_count": 0
            }
        s_data = sectors_map[sec]
        s_data["total_projects"] += 1
        s_data["total_budget_cr"] += p.budget_inr_cr
        if p.risk_tier == "High":
            s_data["high_risk"] += 1
        elif p.risk_tier == "Medium":
            s_data["medium_risk"] += 1
        else:
            s_data["low_risk"] += 1
        if p.is_delayed == 1:
            s_data["delayed_count"] += 1

    result = list(sectors_map.values())
    for item in result:
        item["total_budget_cr"] = round(item["total_budget_cr"], 2)
        item["delay_rate_pct"] = round((item["delayed_count"] / max(1, item["total_projects"])) * 100.0, 1)

    result.sort(key=lambda x: x["total_projects"], reverse=True)
    return result


@router.get("/state-slippage")
def get_state_slippage(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    base_query = ProjectService.get_scoped_projects_query(db, current_user)
    projects = base_query.all()
    
    state_map = {}
    for p in projects:
        st = p.state
        if st not in state_map:
            state_map[st] = {
                "state": st,
                "total_projects": 0,
                "high_risk_projects": 0,
                "total_disputes": 0,
                "avg_slippage_months": 0.0,
                "slippage_sum": 0.0,
                "avg_compensation_pct": 0.0,
                "comp_sum": 0.0
            }
        sm = state_map[st]
        sm["total_projects"] += 1
        sm["total_disputes"] += p.active_court_disputes
        sm["slippage_sum"] += p.delay_months_predicted
        sm["comp_sum"] += p.compensation_disbursed_pct
        if p.risk_tier == "High":
            sm["high_risk_projects"] += 1

    output = []
    for sm in state_map.values():
        n = max(1, sm["total_projects"])
        output.append({
            "state": sm["state"],
            "total_projects": sm["total_projects"],
            "high_risk_projects": sm["high_risk_projects"],
            "total_disputes": sm["total_disputes"],
            "avg_slippage_months": round(sm["slippage_sum"] / n, 1),
            "avg_compensation_pct": round(sm["comp_sum"] / n, 1)
        })

    output.sort(key=lambda x: x["high_risk_projects"], reverse=True)
    return output


@router.get("/bottlenecks")
def get_bottlenecks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    base_query = ProjectService.get_scoped_projects_query(db, current_user)
    projects = base_query.all()
    
    b_map = {}
    for p in projects:
        b = p.primary_bottleneck or "Other Administrative Delays"
        b_map[b] = b_map.get(b, 0) + 1
        
    sorted_items = sorted(b_map.items(), key=lambda x: x[1], reverse=True)
    return [{"bottleneck": k, "count": v, "share_pct": round((v / max(1, len(projects))) * 100.0, 1)} for k, v in sorted_items]
