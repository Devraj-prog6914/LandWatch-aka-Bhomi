from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.alert import Alert, AlertStatus
from app.schemas.alert import AlertOut, AlertActionRequest
from app.auth.dependencies import get_current_user, require_role
from app.services.alert_service import AlertService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/alerts", tags=["Statutory Alerts"])


@router.get("", response_model=List[AlertOut])
def get_alerts(
    status: Optional[AlertStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AlertService.get_scoped_alerts(db, current_user, status=status)


@router.post("/{alert_id}/action", response_model=AlertOut)
def act_on_alert(
    alert_id: int,
    payload: AlertActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.STATE_OFFICER, UserRole.DISTRICT_COLLECTOR]))
):
    action = payload.action.upper()
    if action == "ACKNOWLEDGE":
        alert = AlertService.acknowledge_alert(db, alert_id, current_user.email)
        action_verb = "ACKNOWLEDGED"
    elif action == "RESOLVE":
        alert = AlertService.resolve_alert(db, alert_id, current_user.email, payload.notes)
        action_verb = "RESOLVED"
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'ACKNOWLEDGE' or 'RESOLVE'")

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    AuditService.log_action(
        db=db,
        user=current_user,
        action=f"ALERT_{action_verb}",
        resource_type="ALERT",
        resource_id=str(alert.id),
        details=f"Alert #{alert.id} ({alert.title}) was {action_verb.lower()} by {current_user.email}. Notes: {payload.notes or 'None'}"
    )

    return alert
