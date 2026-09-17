from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class SimulationRequest(BaseModel):
    compensation_disbursed_pct: Optional[float] = Field(None, ge=0.0, le=100.0)
    active_court_disputes: Optional[int] = Field(None, ge=0)
    cadastral_digitized_pct: Optional[float] = Field(None, ge=0.0, le=100.0)
    aadhaar_seeded_pct: Optional[float] = Field(None, ge=0.0, le=100.0)
    forest_clearance_status: Optional[str] = None
    environment_clearance_status: Optional[str] = None
    collector_meetings_last_quarter: Optional[int] = Field(None, ge=0, le=24)
    utility_shifting_pending: Optional[int] = Field(None, ge=0)


class SimulationMetricDelta(BaseModel):
    baseline_value: float
    simulated_value: float
    net_change: float
    percentage_improvement: float


class SimulationResponse(BaseModel):
    project_id: str
    project_name: str
    baseline: Dict[str, Any]
    simulated: Dict[str, Any]
    delay_probability_reduction_pct: float
    delay_months_saved: int
    risk_tier_transition: str
    shap_deltas: List[Dict[str, Any]]
    simulated_recommendations: List[Dict[str, Any]]
    narrative_summary: str
