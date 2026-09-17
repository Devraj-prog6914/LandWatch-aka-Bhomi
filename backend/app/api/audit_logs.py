from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.audit import AuditLogOut
from app.auth.dependencies import get_current_user, require_role
from app.services.audit_service import AuditService

router = APIRouter(prefix="/audit-logs", tags=["Audit & Governance"])


@router.get("", response_model=List[AuditLogOut])
def get_audit_logs(
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.STATE_OFFICER]))
):
    return AuditService.get_logs(db, limit=limit)
