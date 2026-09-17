from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.project import Project
from app.models.user import User, UserRole
from app.schemas.project import ProjectFilter
from app.services.ml_service import MLService


class ProjectService:
    STAGES_ORDER = [
        ("Section 4 Preliminary Survey", 4),
        ("Section 11 Notification", 8),
        ("Social Impact Assessment (SIA)", 14),
        ("Section 19 Declaration", 20),
        ("Section 23 Award Inquiry", 28),
        ("Section 38 Possession Handover", 36)
    ]

    @staticmethod
    def get_scoped_projects_query(db: Session, current_user: User):
        query = db.query(Project)
        if current_user.role == UserRole.STATE_OFFICER and current_user.state:
            query = query.filter(Project.state == current_user.state)
        elif current_user.role in [UserRole.DISTRICT_COLLECTOR, UserRole.SLAO]:
            if current_user.district:
                target_dist = current_user.district.replace(" Corridor Division", "").replace(" District", "").strip()
                query = query.filter(Project.district.ilike(f"%{target_dist}%"))
            elif current_user.state:
                query = query.filter(Project.state.ilike(f"%{current_user.state}%"))
        return query

    @staticmethod
    def list_projects(db: Session, current_user: User, filters: Optional[ProjectFilter] = None, skip: int = 0, limit: int = 100) -> List[Project]:
        query = ProjectService.get_scoped_projects_query(db, current_user)
        
        if filters:
            if filters.state:
                query = query.filter(Project.state.ilike(f"%{filters.state}%"))
            if filters.district:
                query = query.filter(Project.district.ilike(f"%{filters.district}%"))
            if filters.sector:
                query = query.filter(Project.sector == filters.sector)
            if filters.implementing_agency:
                query = query.filter(Project.implementing_agency == filters.implementing_agency)
            if filters.risk_tier:
                query = query.filter(Project.risk_tier == filters.risk_tier)
            if filters.min_disputes is not None:
                query = query.filter(Project.active_court_disputes >= filters.min_disputes)
            if filters.search:
                search_term = f"%{filters.search}%"
                query = query.filter(
                    or_(
                        Project.project_name.ilike(search_term),
                        Project.project_id.ilike(search_term),
                        Project.district.ilike(search_term),
                        Project.state.ilike(search_term)
                    )
                )
                
        return query.order_by(Project.delay_probability.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_project_by_id(db: Session, project_id: str) -> Optional[Project]:
        return db.query(Project).filter(
            or_(Project.project_id == project_id, Project.id == (int(project_id) if project_id.isdigit() else -1))
        ).first()

    @staticmethod
    def build_lifecycle_timeline(project: Project) -> List[Dict[str, Any]]:
        current_stage = project.current_stage
        milestones = []
        
        stage_names = [s[0] for s in ProjectService.STAGES_ORDER]
        current_idx = 0
        for i, s_name in enumerate(stage_names):
            if s_name.lower() in current_stage.lower() or current_stage.lower() in s_name.lower():
                current_idx = i
                break

        base_start = datetime.utcnow() - timedelta(days=project.elapsed_months * 30)

        for i, (stage_name, target_m) in enumerate(ProjectService.STAGES_ORDER):
            sched_date = base_start + timedelta(days=target_m * 30)
            
            if i < current_idx:
                status = "Completed"
                proj_date = sched_date
            elif i == current_idx:
                status = "In Progress"
                slippage_days = project.delay_months_predicted * 30
                proj_date = sched_date + timedelta(days=slippage_days)
            else:
                status = "Pending"
                slippage_days = project.delay_months_predicted * 30
                proj_date = sched_date + timedelta(days=slippage_days)

            milestones.append({
                "stage_name": stage_name,
                "scheduled_date": sched_date.strftime("%Y-%m-%d"),
                "projected_date": proj_date.strftime("%Y-%m-%d"),
                "status": status,
                "is_current": (i == current_idx),
                "delay_variance_days": 0 if i < current_idx else (project.delay_months_predicted * 30)
            })

        return milestones
