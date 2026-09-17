from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.alert import AlertSeverity, AlertStatus


class AlertBase(BaseModel):
    project_id: str
    project_name: str
    state: str
    district: str
    severity: AlertSeverity
    title: str
    description: str
    trigger_rule: Optional[str] = None
    recommended_action: Optional[str] = None


class AlertOut(AlertBase):
    id: int
    status: AlertStatus
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AlertActionRequest(BaseModel):
    action: str  # "ACKNOWLEDGE" or "RESOLVE"
    notes: Optional[str] = None
