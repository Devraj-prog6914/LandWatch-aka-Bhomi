from pydantic import BaseModel
from datetime import datetime


class AuditLogOut(BaseModel):
    id: int
    user_email: str
    user_role: str
    action: str
    resource_type: str
    resource_id: str
    details: str
    ip_address: str
    timestamp: datetime

    class Config:
        from_attributes = True
