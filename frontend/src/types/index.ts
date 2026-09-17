export type UserRole = 'ADMIN' | 'STATE_OFFICER' | 'DISTRICT_COLLECTOR' | 'SLAO' | 'VIEWER';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  state?: string;
  district?: string;
  designation?: string;
  cadre?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  email: string;
  full_name: string;
  state?: string;
  district?: string;
}

export interface Project {
  id: number;
  project_id: string;
  project_name: string;
  sector: string;
  implementing_agency: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  current_stage: string;
  target_duration_months: number;
  elapsed_months: number;
  total_land_required_ha: number;
  private_land_ha: number;
  government_land_ha: number;
  forest_land_ha: number;
  parcels_count: number;
  owners_count: number;
  budget_inr_cr: number;
  compensation_disbursed_pct: number;
  active_court_disputes: number;
  cadastral_digitized_pct: number;
  aadhaar_seeded_pct: number;
  sia_objection_rate_pct: number;
  rr_packages_pending_pct: number;
  forest_clearance_status: string;
  environment_clearance_status: string;
  utility_shifting_pending: number;
  collector_meetings_last_quarter: number;
  primary_bottleneck: string;
  delay_probability: number;
  risk_tier: 'High' | 'Medium' | 'Low';
  is_delayed: number;
  delay_months_predicted: number;
  last_assessed_at?: string;
}

export interface RiskDriver {
  feature: string;
  name: string;
  impact: number;
  direction: 'risk_increase' | 'risk_decrease';
  value_text: string;
}

export interface WaterfallStep {
  step: string;
  base_value: number;
  delta: number;
  final_value: number;
  type: 'baseline' | 'risk_increase' | 'risk_decrease' | 'total';
}

export interface Recommendation {
  priority: string;
  action_title: string;
  statutory_reference: string;
  responsible_authority: string;
  description: string;
  target_mechanism: string;
  expected_risk_reduction_pct: number;
  estimated_delay_saved_days: number;
}

export interface LifecycleMilestone {
  stage_name: string;
  scheduled_date: string;
  projected_date: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  is_current: boolean;
  delay_variance_days: number;
}

export interface ProjectDetail extends Project {
  top_risk_drivers: RiskDriver[];
  top_mitigating_factors: RiskDriver[];
  waterfall_steps: WaterfallStep[];
  recommendations: Recommendation[];
  timeline_milestones: LifecycleMilestone[];
}

export interface SimulationRequest {
  compensation_disbursed_pct?: number;
  active_court_disputes?: number;
  cadastral_digitized_pct?: number;
  aadhaar_seeded_pct?: number;
  forest_clearance_status?: string;
  environment_clearance_status?: string;
  collector_meetings_last_quarter?: number;
  utility_shifting_pending?: number;
}

export interface SimulationResponse {
  project_id: string;
  project_name: string;
  baseline: {
    delay_probability: number;
    risk_tier: string;
    delay_months_predicted: number;
    compensation_disbursed_pct: number;
    active_court_disputes: number;
    forest_clearance_status: string;
  };
  simulated: {
    delay_probability: number;
    risk_tier: string;
    delay_months_predicted: number;
    compensation_disbursed_pct: number;
    active_court_disputes: number;
    forest_clearance_status: string;
  };
  delay_probability_reduction_pct: number;
  delay_months_saved: number;
  risk_tier_transition: string;
  shap_deltas: Array<{
    feature: string;
    baseline_impact: number;
    simulated_impact: number;
    net_impact_reduction: number;
  }>;
  simulated_recommendations: Recommendation[];
  narrative_summary: string;
}

export interface DashboardKPIs {
  total_projects: number;
  delayed_projects: number;
  delayed_pct: number;
  total_budget_cr: number;
  budget_at_risk_cr: number;
  avg_delay_months: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  open_critical_alerts: number;
}

export interface SectorItem {
  sector: string;
  total_projects: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
  total_budget_cr: number;
  delay_rate_pct: number;
}

export interface StateSlippageItem {
  state: string;
  total_projects: number;
  high_risk_projects: number;
  total_disputes: number;
  avg_slippage_months: number;
  avg_compensation_pct: number;
}

export interface AlertItem {
  id: number;
  project_id: string;
  project_name: string;
  state: string;
  district: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  title: string;
  description: string;
  trigger_rule?: string;
  recommended_action?: string;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
}

export interface AuditLogItem {
  id: number;
  user_email: string;
  user_role: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

export interface ModelGovernanceData {
  best_model: string;
  primary_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
    brier_score: number;
    confusion_matrix: number[][];
    test_sample_size: number;
  };
  models_evaluated: Record<string, any>;
  feature_importances: Array<{
    feature: string;
    display_name?: string;
    importance: number;
  }>;
  training_metadata: Record<string, any>;
}
