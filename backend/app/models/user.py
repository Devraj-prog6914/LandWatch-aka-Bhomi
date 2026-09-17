import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum
from app.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    STATE_OFFICER = "STATE_OFFICER"
    DISTRICT_COLLECTOR = "DISTRICT_COLLECTOR"
    SLAO = "SLAO"
    VIEWER = "VIEWER"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.VIEWER, nullable=False)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    designation = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
