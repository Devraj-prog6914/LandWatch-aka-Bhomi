from datetime import datetime
from sqlalchemy.orm import Session
from app.models.audit import AuditLog
from app.models.user import User


class AuditService:
    @staticmethod
    def log_action(
        db: Session,
        user: User,
        action: str,
        resource_type: str,
        resource_id: str,
        details: str,
        ip_address: str = "127.0.0.1"
    ) -> AuditLog:
        audit_entry = AuditLog(
            user_email=user.email,
            user_role=user.role.value if hasattr(user.role, "value") else str(user.role),
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
            timestamp=datetime.utcnow()
        )
        db.add(audit_entry)
        db.commit()
        db.refresh(audit_entry)
        return audit_entry

    @staticmethod
    def get_logs(db: Session, limit: int = 100) -> list[AuditLog]:
        return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
