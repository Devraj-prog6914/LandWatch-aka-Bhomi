from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.alert import Alert, AlertSeverity, AlertStatus
from app.models.project import Project
from app.models.user import User, UserRole


class AlertService:
    @staticmethod
    def evaluate_and_generate_alerts(db: Session, project: Project) -> List[Alert]:
        created_alerts = []
        
        # Rule 1: High title disputes
        if project.active_court_disputes >= 20:
            existing = db.query(Alert).filter(
                Alert.project_id == project.project_id,
                Alert.trigger_rule == "RULE_HIGH_LITIGATION",
                Alert.status.in_([AlertStatus.OPEN, AlertStatus.ACKNOWLEDGED])
            ).first()
            if not existing:
                alert = Alert(
                    project_id=project.project_id,
                    project_name=project.project_name,
                    state=project.state,
                    district=project.district,
                    severity=AlertSeverity.CRITICAL,
                    status=AlertStatus.OPEN,
                    title="Critical Title Litigation Volume",
                    description=f"{project.active_court_disputes} contested land parcels pending in District / High Court. Risk of stay order impeding possession.",
                    trigger_rule="RULE_HIGH_LITIGATION",
                    recommended_action="Convene emergency Lok Adalat mediation camp with SLAO and District Standing Counsel."
                )
                db.add(alert)
                created_alerts.append(alert)

        # Rule 2: Compensation disbursement lag in advanced stages
        if ("Section 19" in project.current_stage or "Section 23" in project.current_stage) and project.compensation_disbursed_pct < 45.0:
            existing = db.query(Alert).filter(
                Alert.project_id == project.project_id,
                Alert.trigger_rule == "RULE_COMPENSATION_LAG",
                Alert.status.in_([AlertStatus.OPEN, AlertStatus.ACKNOWLEDGED])
            ).first()
            if not existing:
                alert = Alert(
                    project_id=project.project_id,
                    project_name=project.project_name,
                    state=project.state,
                    district=project.district,
                    severity=AlertSeverity.WARNING,
                    status=AlertStatus.OPEN,
                    title="Severely Delayed Compensation Disbursement",
                    description=f"Only {project.compensation_disbursed_pct}% compensation disbursed in {project.current_stage}. Section 25 lapsing risk if award unpaid.",
                    trigger_rule="RULE_COMPENSATION_LAG",
                    recommended_action="Activate CSC bank seeding sprint and release PFMS bulk electronic DBT batches."
                )
                db.add(alert)
                created_alerts.append(alert)

        # Rule 3: Forest clearance bottleneck
        if any(s in str(project.forest_clearance_status) for s in ["Stage 1 Pending", "Stage 2 Pending", "Clearance Rejected"]):
            existing = db.query(Alert).filter(
                Alert.project_id == project.project_id,
                Alert.trigger_rule == "RULE_FOREST_STALLED",
                Alert.status.in_([AlertStatus.OPEN, AlertStatus.ACKNOWLEDGED])
            ).first()
            if not existing:
                alert = Alert(
                    project_id=project.project_id,
                    project_name=project.project_name,
                    state=project.state,
                    district=project.district,
                    severity=AlertSeverity.CRITICAL,
                    status=AlertStatus.OPEN,
                    title="Forest Clearance Stage-II Bottleneck",
                    description=f"Forest land requirement of {project.forest_land_ha} ha stalled at '{project.forest_clearance_status}'.",
                    trigger_rule="RULE_FOREST_STALLED",
                    recommended_action="Submit Compensatory Afforestation mutation certificate to PARIVESH portal and schedule PCCF review."
                )
                db.add(alert)
                created_alerts.append(alert)

        if created_alerts:
            db.commit()
        return created_alerts

    @staticmethod
    def get_scoped_alerts(db: Session, current_user: User, status: Optional[AlertStatus] = None) -> List[Alert]:
        query = db.query(Alert)
        if current_user.role == UserRole.STATE_OFFICER and current_user.state:
            query = query.filter(Alert.state == current_user.state)
        elif current_user.role in [UserRole.DISTRICT_COLLECTOR, UserRole.SLAO]:
            if current_user.district:
                target_dist = current_user.district.replace(" Corridor Division", "").replace(" District", "").strip()
                query = query.filter(Alert.district.ilike(f"%{target_dist}%"))
            elif current_user.state:
                query = query.filter(Alert.state.ilike(f"%{current_user.state}%"))
        if status:
            query = query.filter(Alert.status == status)
        return query.order_by(Alert.created_at.desc()).all()

    @staticmethod
    def acknowledge_alert(db: Session, alert_id: int, user_email: str) -> Optional[Alert]:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if alert:
            alert.status = AlertStatus.ACKNOWLEDGED
            alert.acknowledged_by = user_email
            alert.acknowledged_at = datetime.utcnow()
            db.commit()
            db.refresh(alert)
        return alert

    @staticmethod
    def resolve_alert(db: Session, alert_id: int, user_email: str, notes: Optional[str] = None) -> Optional[Alert]:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if alert:
            alert.status = AlertStatus.RESOLVED
            alert.resolved_by = user_email
            alert.resolved_at = datetime.utcnow()
            alert.resolution_notes = notes or "Administrative resolution recorded by officer."
            db.commit()
            db.refresh(alert)
        return alert
