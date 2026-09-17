from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255), index=True, nullable=False)
    user_role = Column(String(64), nullable=False)
    action = Column(String(100), index=True, nullable=False)  # e.g., "SIMULATION_EXECUTED", "ALERT_RESOLVED", "PROJECT_OVERRIDE"
    resource_type = Column(String(64), nullable=False)       # "PROJECT", "ALERT", "MODEL"
    resource_id = Column(String(128), nullable=False)
    details = Column(Text, nullable=False)
    ip_address = Column(String(64), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
