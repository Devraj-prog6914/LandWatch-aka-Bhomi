import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database import Base


class RiskTier(str, enum.Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(64), unique=True, index=True, nullable=False)
    project_name = Column(String(255), nullable=False)
    sector = Column(String(120), index=True, nullable=False)
    implementing_agency = Column(String(120), index=True, nullable=False)
    state = Column(String(100), index=True, nullable=False)
    district = Column(String(100), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Lifecycle & Timeline
    current_stage = Column(String(150), nullable=False)
    target_duration_months = Column(Integer, default=24)
    elapsed_months = Column(Integer, default=6)
    
    # Land & Cadastral Metrics
    total_land_required_ha = Column(Float, default=100.0)
    private_land_ha = Column(Float, default=70.0)
    government_land_ha = Column(Float, default=20.0)
    forest_land_ha = Column(Float, default=10.0)
    parcels_count = Column(Integer, default=500)
    owners_count = Column(Integer, default=1200)
    
    # Financials & Clearances
    budget_inr_cr = Column(Float, default=250.0)
    compensation_disbursed_pct = Column(Float, default=30.0)
    active_court_disputes = Column(Integer, default=5)
    cadastral_digitized_pct = Column(Float, default=65.0)
    aadhaar_seeded_pct = Column(Float, default=75.0)
    sia_objection_rate_pct = Column(Float, default=10.0)
    rr_packages_pending_pct = Column(Float, default=20.0)
    forest_clearance_status = Column(String(100), default="Not Applicable")
    environment_clearance_status = Column(String(100), default="Approved")
    utility_shifting_pending = Column(Integer, default=2)
    collector_meetings_last_quarter = Column(Integer, default=3)
    primary_bottleneck = Column(String(255), default="Standard Procedural Progress")
    
    # ML Prediction Outputs
    delay_probability = Column(Float, default=0.25)
    risk_tier = Column(String(32), default="Low")
    is_delayed = Column(Integer, default=0)
    delay_months_predicted = Column(Integer, default=0)
    
    # Metadata
    last_assessed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
