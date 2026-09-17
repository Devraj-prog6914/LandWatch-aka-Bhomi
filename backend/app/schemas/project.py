from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class ProjectBase(BaseModel):
    project_id: str
    project_name: str
    sector: str
    implementing_agency: str
    state: str
    district: str
    latitude: float
    longitude: float
    current_stage: str
    target_duration_months: int
    elapsed_months: int
    total_land_required_ha: float
    private_land_ha: float
    government_land_ha: float
    forest_land_ha: float
    parcels_count: int
    owners_count: int
    budget_inr_cr: float
    compensation_disbursed_pct: float
    active_court_disputes: int
    cadastral_digitized_pct: float
    aadhaar_seeded_pct: float
    sia_objection_rate_pct: float
    rr_packages_pending_pct: float
    forest_clearance_status: str
    environment_clearance_status: str
    utility_shifting_pending: int
    collector_meetings_last_quarter: int
    primary_bottleneck: str


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    current_stage: Optional[str] = None
    compensation_disbursed_pct: Optional[float] = None
    active_court_disputes: Optional[int] = None
    cadastral_digitized_pct: Optional[float] = None
    aadhaar_seeded_pct: Optional[float] = None
    sia_objection_rate_pct: Optional[float] = None
    rr_packages_pending_pct: Optional[float] = None
    forest_clearance_status: Optional[str] = None
    environment_clearance_status: Optional[str] = None
    utility_shifting_pending: Optional[int] = None
    collector_meetings_last_quarter: Optional[int] = None


class ProjectOut(ProjectBase):
    id: int
    delay_probability: float
    risk_tier: str
    is_delayed: int
    delay_months_predicted: int
    last_assessed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProjectDetailOut(ProjectOut):
    top_risk_drivers: List[Any] = []
    top_mitigating_factors: List[Any] = []
    waterfall_steps: List[Any] = []
    recommendations: List[Any] = []
    timeline_milestones: List[Any] = []


class ProjectFilter(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    sector: Optional[str] = None
    implementing_agency: Optional[str] = None
    risk_tier: Optional[str] = None
    min_disputes: Optional[int] = None
    search: Optional[str] = None
