import {
  Project,
  ProjectDetail,
  SimulationRequest,
  SimulationResponse,
  DashboardKPIs,
  SectorItem,
  StateSlippageItem,
  AlertItem,
  AuditLogItem,
  ModelGovernanceData,
  RiskDriver,
  WaterfallStep,
  Recommendation,
  LifecycleMilestone
} from '../types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    project_id: 'LW-IN-MA-PUN-1001',
    project_name: 'Maharashtra Pune Greenfield Ring Road - Sec 1',
    sector: 'Expressway / Highway',
    implementing_agency: 'MSRDC',
    state: 'Maharashtra',
    district: 'Pune',
    latitude: 18.5204,
    longitude: 73.8567,
    current_stage: 'Section 19 Declaration',
    target_duration_months: 36,
    elapsed_months: 24,
    total_land_required_ha: 640.5,
    private_land_ha: 480.2,
    government_land_ha: 120.3,
    forest_land_ha: 40.0,
    parcels_count: 1420,
    owners_count: 3120,
    budget_inr_cr: 845.2,
    compensation_disbursed_pct: 32.4,
    active_court_disputes: 28,
    cadastral_digitized_pct: 48.5,
    aadhaar_seeded_pct: 62.1,
    sia_objection_rate_pct: 28.4,
    rr_packages_pending_pct: 42.0,
    forest_clearance_status: 'Stage 1 Pending',
    environment_clearance_status: 'Terms of Reference Issued',
    utility_shifting_pending: 16,
    collector_meetings_last_quarter: 1,
    primary_bottleneck: 'Litigation in District / High Court',
    delay_probability: 0.885,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 18,
    last_assessed_at: '2026-09-08T10:30:00Z'
  },
  {
    id: 2,
    project_id: 'LW-IN-GU-AHM-1002',
    project_name: 'Gujarat Ahmedabad Bullet Train Feeder Line - Sec 2',
    sector: 'High Speed Rail / Rail',
    implementing_agency: 'NHSRCL',
    state: 'Gujarat',
    district: 'Ahmedabad',
    latitude: 23.0225,
    longitude: 72.5714,
    current_stage: 'Section 38 Possession Handover',
    target_duration_months: 42,
    elapsed_months: 39,
    total_land_required_ha: 320.0,
    private_land_ha: 210.0,
    government_land_ha: 95.0,
    forest_land_ha: 15.0,
    parcels_count: 780,
    owners_count: 1450,
    budget_inr_cr: 620.0,
    compensation_disbursed_pct: 92.5,
    active_court_disputes: 2,
    cadastral_digitized_pct: 96.5,
    aadhaar_seeded_pct: 98.2,
    sia_objection_rate_pct: 4.2,
    rr_packages_pending_pct: 5.0,
    forest_clearance_status: 'Approved',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 2,
    collector_meetings_last_quarter: 5,
    primary_bottleneck: 'Standard Procedural Progress',
    delay_probability: 0.125,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 1,
    last_assessed_at: '2026-09-09T08:15:00Z'
  },
  {
    id: 3,
    project_id: 'LW-IN-UP-VAR-1003',
    project_name: 'Uttar Pradesh Varanasi Economic Corridor Phase-II - Sec 3',
    sector: 'Expressway / Highway',
    implementing_agency: 'NHAI',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    latitude: 25.3176,
    longitude: 82.9739,
    current_stage: 'Section 23 Award Inquiry',
    target_duration_months: 30,
    elapsed_months: 22,
    total_land_required_ha: 510.4,
    private_land_ha: 390.0,
    government_land_ha: 85.0,
    forest_land_ha: 35.4,
    parcels_count: 1150,
    owners_count: 2680,
    budget_inr_cr: 580.4,
    compensation_disbursed_pct: 41.2,
    active_court_disputes: 19,
    cadastral_digitized_pct: 55.2,
    aadhaar_seeded_pct: 71.0,
    sia_objection_rate_pct: 22.8,
    rr_packages_pending_pct: 38.5,
    forest_clearance_status: 'Stage 2 Pending',
    environment_clearance_status: 'In-Review',
    utility_shifting_pending: 11,
    collector_meetings_last_quarter: 1,
    primary_bottleneck: 'Slow Direct Benefit Transfer (PFMS)',
    delay_probability: 0.765,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 14,
    last_assessed_at: '2026-09-07T14:20:00Z'
  },
  {
    id: 4,
    project_id: 'LW-IN-KA-BEN-1004',
    project_name: 'Karnataka Bengaluru Rural Metro Line-4 Extension - Sec 4',
    sector: 'Metro Rail Transit',
    implementing_agency: 'BMRCL',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    latitude: 13.0827,
    longitude: 77.5877,
    current_stage: 'Section 19 Declaration',
    target_duration_months: 28,
    elapsed_months: 18,
    total_land_required_ha: 145.2,
    private_land_ha: 110.5,
    government_land_ha: 30.2,
    forest_land_ha: 4.5,
    parcels_count: 540,
    owners_count: 1120,
    budget_inr_cr: 410.8,
    compensation_disbursed_pct: 68.4,
    active_court_disputes: 6,
    cadastral_digitized_pct: 82.4,
    aadhaar_seeded_pct: 89.5,
    sia_objection_rate_pct: 11.2,
    rr_packages_pending_pct: 14.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 5,
    collector_meetings_last_quarter: 3,
    primary_bottleneck: 'Pending High-Tension/Pipeline Utility Shifting',
    delay_probability: 0.342,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 0,
    last_assessed_at: '2026-09-08T11:00:00Z'
  },
  {
    id: 5,
    project_id: 'LW-IN-TN-KAN-1005',
    project_name: 'Tamil Nadu Kanchipuram Integrated Logistics Zone - Sec 5',
    sector: 'Industrial Corridors / Logistics',
    implementing_agency: 'TIDCO',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    latitude: 12.8342,
    longitude: 79.7036,
    current_stage: 'Section 11 Notification',
    target_duration_months: 24,
    elapsed_months: 14,
    total_land_required_ha: 480.0,
    private_land_ha: 360.0,
    government_land_ha: 120.0,
    forest_land_ha: 0.0,
    parcels_count: 920,
    owners_count: 1850,
    budget_inr_cr: 390.0,
    compensation_disbursed_pct: 18.5,
    active_court_disputes: 14,
    cadastral_digitized_pct: 64.0,
    aadhaar_seeded_pct: 78.2,
    sia_objection_rate_pct: 19.5,
    rr_packages_pending_pct: 31.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'In-Review',
    utility_shifting_pending: 8,
    collector_meetings_last_quarter: 2,
    primary_bottleneck: 'Disputed Cadastral Map Boundaries',
    delay_probability: 0.582,
    risk_tier: 'Medium',
    is_delayed: 1,
    delay_months_predicted: 8,
    last_assessed_at: '2026-09-06T16:45:00Z'
  },
  {
    id: 6,
    project_id: 'LW-IN-MP-BHO-1006',
    project_name: 'Madhya Pradesh Bhopal Multi-Purpose Dam Reservoir - Sec 6',
    sector: 'Irrigation & Water Resources',
    implementing_agency: 'State Water Resources Dept',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    latitude: 23.2599,
    longitude: 77.4126,
    current_stage: 'Section 19 Declaration',
    target_duration_months: 40,
    elapsed_months: 30,
    total_land_required_ha: 1250.0,
    private_land_ha: 820.0,
    government_land_ha: 180.0,
    forest_land_ha: 250.0,
    parcels_count: 2850,
    owners_count: 6400,
    budget_inr_cr: 940.0,
    compensation_disbursed_pct: 38.0,
    active_court_disputes: 42,
    cadastral_digitized_pct: 44.0,
    aadhaar_seeded_pct: 58.0,
    sia_objection_rate_pct: 34.0,
    rr_packages_pending_pct: 55.0,
    forest_clearance_status: 'Stage 1 Pending',
    environment_clearance_status: 'Terms of Reference Issued',
    utility_shifting_pending: 21,
    collector_meetings_last_quarter: 1,
    primary_bottleneck: 'R&R Resettlement Package Disputes',
    delay_probability: 0.924,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 22,
    last_assessed_at: '2026-09-05T09:10:00Z'
  },
  {
    id: 7,
    project_id: 'LW-IN-RJ-JAI-1007',
    project_name: 'Rajasthan Jaipur Ultra Mega Solar Power Park - Sec 7',
    sector: 'Renewable Energy / Solar Park',
    implementing_agency: 'SECI',
    state: 'Rajasthan',
    district: 'Jaipur',
    latitude: 26.9124,
    longitude: 75.7873,
    current_stage: 'Section 38 Possession Handover',
    target_duration_months: 20,
    elapsed_months: 16,
    total_land_required_ha: 1400.0,
    private_land_ha: 350.0,
    government_land_ha: 1050.0,
    forest_land_ha: 0.0,
    parcels_count: 680,
    owners_count: 1020,
    budget_inr_cr: 450.0,
    compensation_disbursed_pct: 94.0,
    active_court_disputes: 1,
    cadastral_digitized_pct: 92.0,
    aadhaar_seeded_pct: 95.0,
    sia_objection_rate_pct: 3.5,
    rr_packages_pending_pct: 4.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 1,
    collector_meetings_last_quarter: 4,
    primary_bottleneck: 'Standard Procedural Progress',
    delay_probability: 0.098,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 0,
    last_assessed_at: '2026-09-09T12:00:00Z'
  },
  {
    id: 8,
    project_id: 'LW-IN-OD-KHO-1008',
    project_name: 'Odisha Khordha Deepwater Port Express Link - Sec 8',
    sector: 'Expressway / Highway',
    implementing_agency: 'JNPA',
    state: 'Odisha',
    district: 'Khordha',
    latitude: 20.1900,
    longitude: 85.6200,
    current_stage: 'Section 11 Notification',
    target_duration_months: 32,
    elapsed_months: 19,
    total_land_required_ha: 380.0,
    private_land_ha: 280.0,
    government_land_ha: 70.0,
    forest_land_ha: 30.0,
    parcels_count: 890,
    owners_count: 2100,
    budget_inr_cr: 340.0,
    compensation_disbursed_pct: 12.0,
    active_court_disputes: 11,
    cadastral_digitized_pct: 58.0,
    aadhaar_seeded_pct: 66.0,
    sia_objection_rate_pct: 18.0,
    rr_packages_pending_pct: 25.0,
    forest_clearance_status: 'Stage 2 Pending',
    environment_clearance_status: 'In-Review',
    utility_shifting_pending: 7,
    collector_meetings_last_quarter: 2,
    primary_bottleneck: 'Forest & Wildlife Stage-II Clearance',
    delay_probability: 0.645,
    risk_tier: 'Medium',
    is_delayed: 1,
    delay_months_predicted: 9,
    last_assessed_at: '2026-09-06T15:30:00Z'
  },
  {
    id: 9,
    project_id: 'LW-IN-AP-VIS-1009',
    project_name: 'Andhra Pradesh Visakhapatnam Coastal Economic Zone Access - Sec 9',
    sector: 'Industrial Corridors / Logistics',
    implementing_agency: 'NICDC',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    latitude: 17.6868,
    longitude: 83.2185,
    current_stage: 'Section 23 Award Inquiry',
    target_duration_months: 34,
    elapsed_months: 26,
    total_land_required_ha: 420.0,
    private_land_ha: 310.0,
    government_land_ha: 90.0,
    forest_land_ha: 20.0,
    parcels_count: 1050,
    owners_count: 2300,
    budget_inr_cr: 510.0,
    compensation_disbursed_pct: 52.0,
    active_court_disputes: 15,
    cadastral_digitized_pct: 71.0,
    aadhaar_seeded_pct: 82.0,
    sia_objection_rate_pct: 14.5,
    rr_packages_pending_pct: 22.0,
    forest_clearance_status: 'Stage 2 Approved',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 9,
    collector_meetings_last_quarter: 3,
    primary_bottleneck: 'Slow Direct Benefit Transfer (PFMS)',
    delay_probability: 0.495,
    risk_tier: 'Medium',
    is_delayed: 0,
    delay_months_predicted: 4,
    last_assessed_at: '2026-09-07T11:40:00Z'
  },
  {
    id: 10,
    project_id: 'LW-IN-HA-GUR-1010',
    project_name: 'Haryana Gurugram Greenfield Ring Road - Sec 10',
    sector: 'Expressway / Highway',
    implementing_agency: 'NHAI',
    state: 'Haryana',
    district: 'Gurugram',
    latitude: 28.4595,
    longitude: 77.0266,
    current_stage: 'Section 19 Declaration',
    target_duration_months: 30,
    elapsed_months: 23,
    total_land_required_ha: 290.0,
    private_land_ha: 250.0,
    government_land_ha: 40.0,
    forest_land_ha: 0.0,
    parcels_count: 740,
    owners_count: 1950,
    budget_inr_cr: 980.0,
    compensation_disbursed_pct: 45.0,
    active_court_disputes: 31,
    cadastral_digitized_pct: 69.0,
    aadhaar_seeded_pct: 84.0,
    sia_objection_rate_pct: 26.0,
    rr_packages_pending_pct: 30.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 14,
    collector_meetings_last_quarter: 2,
    primary_bottleneck: 'Litigation in District / High Court',
    delay_probability: 0.834,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 16,
    last_assessed_at: '2026-09-08T17:15:00Z'
  },
  {
    id: 11,
    project_id: 'LW-IN-WB-HOW-1011',
    project_name: 'West Bengal Howrah Dedicated Freight Corridor Yard - Sec 11',
    sector: 'High Speed Rail / Rail',
    implementing_agency: 'DFCCIL',
    state: 'West Bengal',
    district: 'Howrah',
    latitude: 22.5958,
    longitude: 88.2636,
    current_stage: 'Section 11 Notification',
    target_duration_months: 36,
    elapsed_months: 25,
    total_land_required_ha: 310.0,
    private_land_ha: 260.0,
    government_land_ha: 50.0,
    forest_land_ha: 0.0,
    parcels_count: 980,
    owners_count: 2450,
    budget_inr_cr: 490.0,
    compensation_disbursed_pct: 15.0,
    active_court_disputes: 26,
    cadastral_digitized_pct: 46.0,
    aadhaar_seeded_pct: 59.0,
    sia_objection_rate_pct: 31.5,
    rr_packages_pending_pct: 48.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'In-Review',
    utility_shifting_pending: 18,
    collector_meetings_last_quarter: 1,
    primary_bottleneck: 'R&R Resettlement Package Disputes',
    delay_probability: 0.892,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 20,
    last_assessed_at: '2026-09-05T13:40:00Z'
  },
  {
    id: 12,
    project_id: 'LW-IN-BI-PAT-1012',
    project_name: 'Bihar Patna Airport Metro Link Corridor - Sec 12',
    sector: 'Metro Rail Transit',
    implementing_agency: 'DMRC',
    state: 'Bihar',
    district: 'Patna',
    latitude: 25.5941,
    longitude: 85.1376,
    current_stage: 'Section 23 Award Inquiry',
    target_duration_months: 26,
    elapsed_months: 17,
    total_land_required_ha: 110.0,
    private_land_ha: 95.0,
    government_land_ha: 15.0,
    forest_land_ha: 0.0,
    parcels_count: 490,
    owners_count: 1350,
    budget_inr_cr: 330.0,
    compensation_disbursed_pct: 58.0,
    active_court_disputes: 8,
    cadastral_digitized_pct: 62.0,
    aadhaar_seeded_pct: 74.0,
    sia_objection_rate_pct: 13.0,
    rr_packages_pending_pct: 18.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 6,
    collector_meetings_last_quarter: 3,
    primary_bottleneck: 'Slow Direct Benefit Transfer (PFMS)',
    delay_probability: 0.421,
    risk_tier: 'Medium',
    is_delayed: 0,
    delay_months_predicted: 3,
    last_assessed_at: '2026-09-07T10:00:00Z'
  },
  {
    id: 13,
    project_id: 'LW-IN-MA-THA-1013',
    project_name: 'Maharashtra Thane Bullet Train Feeder Line - Sec 13',
    sector: 'High Speed Rail / Rail',
    implementing_agency: 'NHSRCL',
    state: 'Maharashtra',
    district: 'Thane',
    latitude: 19.2183,
    longitude: 72.9781,
    current_stage: 'Section 19 Declaration',
    target_duration_months: 40,
    elapsed_months: 32,
    total_land_required_ha: 380.0,
    private_land_ha: 270.0,
    government_land_ha: 60.0,
    forest_land_ha: 50.0,
    parcels_count: 1120,
    owners_count: 2900,
    budget_inr_cr: 910.0,
    compensation_disbursed_pct: 39.0,
    active_court_disputes: 29,
    cadastral_digitized_pct: 52.0,
    aadhaar_seeded_pct: 68.0,
    sia_objection_rate_pct: 29.0,
    rr_packages_pending_pct: 46.0,
    forest_clearance_status: 'Stage 1 Pending',
    environment_clearance_status: 'Terms of Reference Issued',
    utility_shifting_pending: 19,
    collector_meetings_last_quarter: 1,
    primary_bottleneck: 'Forest & Wildlife Stage-II Clearance',
    delay_probability: 0.912,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 21,
    last_assessed_at: '2026-09-08T09:30:00Z'
  },
  {
    id: 14,
    project_id: 'LW-IN-UP-LUC-1014',
    project_name: 'Uttar Pradesh Lucknow Defense Industrial Hub - Sec 14',
    sector: 'Industrial Corridors / Logistics',
    implementing_agency: 'UPSIDA',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    latitude: 26.8467,
    longitude: 80.9462,
    current_stage: 'Section 38 Possession Handover',
    target_duration_months: 24,
    elapsed_months: 20,
    total_land_required_ha: 520.0,
    private_land_ha: 390.0,
    government_land_ha: 130.0,
    forest_land_ha: 0.0,
    parcels_count: 960,
    owners_count: 1780,
    budget_inr_cr: 480.0,
    compensation_disbursed_pct: 89.0,
    active_court_disputes: 3,
    cadastral_digitized_pct: 91.0,
    aadhaar_seeded_pct: 94.0,
    sia_objection_rate_pct: 5.0,
    rr_packages_pending_pct: 7.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 3,
    collector_meetings_last_quarter: 4,
    primary_bottleneck: 'Standard Procedural Progress',
    delay_probability: 0.165,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 1,
    last_assessed_at: '2026-09-08T13:20:00Z'
  },
  {
    id: 15,
    project_id: 'LW-IN-GU-SUR-1015',
    project_name: 'Gujarat Surat Expressway Bypass - Sec 15',
    sector: 'Expressway / Highway',
    implementing_agency: 'MoRTH',
    state: 'Gujarat',
    district: 'Surat',
    latitude: 21.1702,
    longitude: 72.8311,
    current_stage: 'Section 23 Award Inquiry',
    target_duration_months: 30,
    elapsed_months: 21,
    total_land_required_ha: 340.0,
    private_land_ha: 280.0,
    government_land_ha: 60.0,
    forest_land_ha: 0.0,
    parcels_count: 820,
    owners_count: 1890,
    budget_inr_cr: 520.0,
    compensation_disbursed_pct: 65.0,
    active_court_disputes: 7,
    cadastral_digitized_pct: 84.0,
    aadhaar_seeded_pct: 91.0,
    sia_objection_rate_pct: 9.0,
    rr_packages_pending_pct: 12.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 4,
    collector_meetings_last_quarter: 4,
    primary_bottleneck: 'Standard Procedural Progress',
    delay_probability: 0.285,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 2,
    last_assessed_at: '2026-09-09T14:45:00Z'
  },
  {
    id: 16,
    project_id: 'LW-IN-KA-MYS-1016',
    project_name: 'Karnataka Mysuru Inter-State Coastal Highway - Sec 16',
    sector: 'Expressway / Highway',
    implementing_agency: 'NHAI',
    state: 'Karnataka',
    district: 'Mysuru',
    latitude: 12.2958,
    longitude: 76.6394,
    current_stage: 'Section 11 Notification',
    target_duration_months: 34,
    elapsed_months: 16,
    total_land_required_ha: 460.0,
    private_land_ha: 330.0,
    government_land_ha: 80.0,
    forest_land_ha: 50.0,
    parcels_count: 990,
    owners_count: 2250,
    budget_inr_cr: 440.0,
    compensation_disbursed_pct: 18.0,
    active_court_disputes: 12,
    cadastral_digitized_pct: 61.0,
    aadhaar_seeded_pct: 73.0,
    sia_objection_rate_pct: 17.0,
    rr_packages_pending_pct: 24.0,
    forest_clearance_status: 'Stage 2 Pending',
    environment_clearance_status: 'In-Review',
    utility_shifting_pending: 9,
    collector_meetings_last_quarter: 2,
    primary_bottleneck: 'Forest & Wildlife Stage-II Clearance',
    delay_probability: 0.612,
    risk_tier: 'Medium',
    is_delayed: 1,
    delay_months_predicted: 7,
    last_assessed_at: '2026-09-07T15:10:00Z'
  },
  {
    id: 17,
    project_id: 'LW-IN-TN-COI-1017',
    project_name: 'Tamil Nadu Coimbatore Electronic Manufacturing Cluster - Sec 17',
    sector: 'Industrial Corridors / Logistics',
    implementing_agency: 'TIDCO',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    latitude: 11.0168,
    longitude: 76.9558,
    current_stage: 'Section 38 Possession Handover',
    target_duration_months: 22,
    elapsed_months: 18,
    total_land_required_ha: 310.0,
    private_land_ha: 240.0,
    government_land_ha: 70.0,
    forest_land_ha: 0.0,
    parcels_count: 620,
    owners_count: 1190,
    budget_inr_cr: 360.0,
    compensation_disbursed_pct: 91.5,
    active_court_disputes: 2,
    cadastral_digitized_pct: 94.0,
    aadhaar_seeded_pct: 97.0,
    sia_objection_rate_pct: 4.0,
    rr_packages_pending_pct: 5.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 2,
    collector_meetings_last_quarter: 5,
    primary_bottleneck: 'Standard Procedural Progress',
    delay_probability: 0.115,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 0,
    last_assessed_at: '2026-09-09T16:00:00Z'
  },
  {
    id: 18,
    project_id: 'LW-IN-MP-IND-1018',
    project_name: 'Madhya Pradesh Indore Metro Depot & Multimodal Hub - Sec 18',
    sector: 'Metro Rail Transit',
    implementing_agency: 'UPMRC',
    state: 'Madhya Pradesh',
    district: 'Indore',
    latitude: 22.7196,
    longitude: 75.8577,
    current_stage: 'Section 23 Award Inquiry',
    target_duration_months: 28,
    elapsed_months: 19,
    total_land_required_ha: 160.0,
    private_land_ha: 125.0,
    government_land_ha: 35.0,
    forest_land_ha: 0.0,
    parcels_count: 510,
    owners_count: 1240,
    budget_inr_cr: 430.0,
    compensation_disbursed_pct: 61.0,
    active_court_disputes: 9,
    cadastral_digitized_pct: 79.0,
    aadhaar_seeded_pct: 86.0,
    sia_objection_rate_pct: 12.0,
    rr_packages_pending_pct: 15.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 5,
    collector_meetings_last_quarter: 3,
    primary_bottleneck: 'Pending High-Tension/Pipeline Utility Shifting',
    delay_probability: 0.375,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 2,
    last_assessed_at: '2026-09-08T12:30:00Z'
  },
  {
    id: 19,
    project_id: 'LW-IN-RJ-JOD-1019',
    project_name: 'Rajasthan Jodhpur Green Hydrogen Corridor - Sec 19',
    sector: 'Renewable Energy / Solar Park',
    implementing_agency: 'NTPC',
    state: 'Rajasthan',
    district: 'Jodhpur',
    latitude: 26.2389,
    longitude: 73.0243,
    current_stage: 'Section 19 Declaration',
    target_duration_months: 26,
    elapsed_months: 17,
    total_land_required_ha: 1100.0,
    private_land_ha: 280.0,
    government_land_ha: 820.0,
    forest_land_ha: 0.0,
    parcels_count: 580,
    owners_count: 940,
    budget_inr_cr: 380.0,
    compensation_disbursed_pct: 72.0,
    active_court_disputes: 5,
    cadastral_digitized_pct: 86.0,
    aadhaar_seeded_pct: 90.0,
    sia_objection_rate_pct: 7.0,
    rr_packages_pending_pct: 9.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 3,
    collector_meetings_last_quarter: 4,
    primary_bottleneck: 'Standard Procedural Progress',
    delay_probability: 0.224,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 1,
    last_assessed_at: '2026-09-09T10:45:00Z'
  },
  {
    id: 20,
    project_id: 'LW-IN-AP-GUR-1020',
    project_name: 'Andhra Pradesh Guntur Pressurized Irrigation Pipeline - Sec 20',
    sector: 'Irrigation & Water Resources',
    implementing_agency: 'State Water Resources Dept',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    latitude: 16.3067,
    longitude: 80.4365,
    current_stage: 'Section 19 Declaration',
    target_duration_months: 36,
    elapsed_months: 27,
    total_land_required_ha: 780.0,
    private_land_ha: 620.0,
    government_land_ha: 130.0,
    forest_land_ha: 30.0,
    parcels_count: 1850,
    owners_count: 4200,
    budget_inr_cr: 610.0,
    compensation_disbursed_pct: 36.0,
    active_court_disputes: 24,
    cadastral_digitized_pct: 51.0,
    aadhaar_seeded_pct: 64.0,
    sia_objection_rate_pct: 27.0,
    rr_packages_pending_pct: 41.0,
    forest_clearance_status: 'Stage 1 Pending',
    environment_clearance_status: 'Terms of Reference Issued',
    utility_shifting_pending: 15,
    collector_meetings_last_quarter: 1,
    primary_bottleneck: 'Litigation in District / High Court',
    delay_probability: 0.865,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 17,
    last_assessed_at: '2026-09-06T11:00:00Z'
  },
  {
    id: 21,
    project_id: 'LW-IN-DL-MUM-1021',
    project_name: 'Delhi-Mumbai Expressway Spur Package 14 (Vadodara-Virar)',
    sector: 'Expressway / Highway',
    implementing_agency: 'NHAI',
    state: 'Maharashtra',
    district: 'Palghar',
    latitude: 19.6967,
    longitude: 72.7699,
    current_stage: 'Section 19 Declaration',
    target_duration_months: 38,
    elapsed_months: 29,
    total_land_required_ha: 590.0,
    private_land_ha: 410.0,
    government_land_ha: 110.0,
    forest_land_ha: 70.0,
    parcels_count: 1320,
    owners_count: 3400,
    budget_inr_cr: 1120.0,
    compensation_disbursed_pct: 34.5,
    active_court_disputes: 33,
    cadastral_digitized_pct: 53.0,
    aadhaar_seeded_pct: 67.0,
    sia_objection_rate_pct: 31.0,
    rr_packages_pending_pct: 44.0,
    forest_clearance_status: 'Stage 1 Pending',
    environment_clearance_status: 'Terms of Reference Issued',
    utility_shifting_pending: 22,
    collector_meetings_last_quarter: 1,
    primary_bottleneck: 'Forest & Wildlife Stage-II Clearance',
    delay_probability: 0.932,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 23,
    last_assessed_at: '2026-09-08T15:20:00Z'
  },
  {
    id: 22,
    project_id: 'LW-IN-UP-GAN-1022',
    project_name: 'Ganga Expressway Phase-1 (Meerut-Prayagraj Corridor)',
    sector: 'Expressway / Highway',
    implementing_agency: 'UPEIDA',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    latitude: 25.4358,
    longitude: 81.8463,
    current_stage: 'Section 23 Award Inquiry',
    target_duration_months: 36,
    elapsed_months: 26,
    total_land_required_ha: 920.0,
    private_land_ha: 780.0,
    government_land_ha: 140.0,
    forest_land_ha: 0.0,
    parcels_count: 2100,
    owners_count: 5100,
    budget_inr_cr: 1450.0,
    compensation_disbursed_pct: 49.0,
    active_court_disputes: 21,
    cadastral_digitized_pct: 72.0,
    aadhaar_seeded_pct: 79.0,
    sia_objection_rate_pct: 16.5,
    rr_packages_pending_pct: 28.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 12,
    collector_meetings_last_quarter: 3,
    primary_bottleneck: 'Slow Direct Benefit Transfer (PFMS)',
    delay_probability: 0.685,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 12,
    last_assessed_at: '2026-09-07T16:00:00Z'
  },
  {
    id: 23,
    project_id: 'LW-IN-RJ-WDF-1023',
    project_name: 'Western Dedicated Freight Corridor (Rewari-Palanpur Section)',
    sector: 'High Speed Rail / Rail',
    implementing_agency: 'DFCCIL',
    state: 'Rajasthan',
    district: 'Alwar',
    latitude: 27.5530,
    longitude: 76.6346,
    current_stage: 'Section 38 Possession Handover',
    target_duration_months: 44,
    elapsed_months: 41,
    total_land_required_ha: 410.0,
    private_land_ha: 310.0,
    government_land_ha: 90.0,
    forest_land_ha: 10.0,
    parcels_count: 850,
    owners_count: 1720,
    budget_inr_cr: 710.0,
    compensation_disbursed_pct: 95.2,
    active_court_disputes: 2,
    cadastral_digitized_pct: 97.0,
    aadhaar_seeded_pct: 99.0,
    sia_objection_rate_pct: 2.5,
    rr_packages_pending_pct: 3.0,
    forest_clearance_status: 'Approved',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 1,
    collector_meetings_last_quarter: 6,
    primary_bottleneck: 'Standard Procedural Progress',
    delay_probability: 0.082,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 0,
    last_assessed_at: '2026-09-09T18:00:00Z'
  },
  {
    id: 24,
    project_id: 'LW-IN-KA-BCE-1024',
    project_name: 'Bengaluru-Chennai Expressway Package-II (Bangarapet-Hosur)',
    sector: 'Expressway / Highway',
    implementing_agency: 'NHAI',
    state: 'Karnataka',
    district: 'Kolar',
    latitude: 13.1367,
    longitude: 78.1346,
    current_stage: 'Section 23 Award Inquiry',
    target_duration_months: 32,
    elapsed_months: 20,
    total_land_required_ha: 395.0,
    private_land_ha: 320.0,
    government_land_ha: 65.0,
    forest_land_ha: 10.0,
    parcels_count: 880,
    owners_count: 1980,
    budget_inr_cr: 560.0,
    compensation_disbursed_pct: 62.0,
    active_court_disputes: 10,
    cadastral_digitized_pct: 81.0,
    aadhaar_seeded_pct: 87.0,
    sia_objection_rate_pct: 12.0,
    rr_packages_pending_pct: 18.0,
    forest_clearance_status: 'Stage 2 Approved',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 6,
    collector_meetings_last_quarter: 3,
    primary_bottleneck: 'Pending High-Tension/Pipeline Utility Shifting',
    delay_probability: 0.395,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 2,
    last_assessed_at: '2026-09-08T14:10:00Z'
  },
  {
    id: 25,
    project_id: 'LW-IN-UP-PUR-1025',
    project_name: 'Purvanchal Industrial Corridor Node (Gorakhpur Link Extension)',
    sector: 'Industrial Corridors / Logistics',
    implementing_agency: 'UPEIDA',
    state: 'Uttar Pradesh',
    district: 'Gorakhpur',
    latitude: 26.7606,
    longitude: 83.3732,
    current_stage: 'Section 19 Declaration',
    target_duration_months: 28,
    elapsed_months: 19,
    total_land_required_ha: 490.0,
    private_land_ha: 390.0,
    government_land_ha: 100.0,
    forest_land_ha: 0.0,
    parcels_count: 1080,
    owners_count: 2400,
    budget_inr_cr: 460.0,
    compensation_disbursed_pct: 42.0,
    active_court_disputes: 16,
    cadastral_digitized_pct: 66.0,
    aadhaar_seeded_pct: 75.0,
    sia_objection_rate_pct: 21.0,
    rr_packages_pending_pct: 32.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'In-Review',
    utility_shifting_pending: 10,
    collector_meetings_last_quarter: 2,
    primary_bottleneck: 'Litigation in District / High Court',
    delay_probability: 0.725,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 13,
    last_assessed_at: '2026-09-07T09:40:00Z'
  },
  {
    id: 26,
    project_id: 'LW-IN-GU-DHO-1026',
    project_name: 'Dholera Special Investment Region (SIR) Multi-Modal Logistics Hub',
    sector: 'Industrial Corridors / Logistics',
    implementing_agency: 'NICDC',
    state: 'Gujarat',
    district: 'Ahmedabad',
    latitude: 22.2472,
    longitude: 72.1950,
    current_stage: 'Section 38 Possession Handover',
    target_duration_months: 36,
    elapsed_months: 33,
    total_land_required_ha: 1800.0,
    private_land_ha: 520.0,
    government_land_ha: 1280.0,
    forest_land_ha: 0.0,
    parcels_count: 1240,
    owners_count: 1900,
    budget_inr_cr: 880.0,
    compensation_disbursed_pct: 96.0,
    active_court_disputes: 3,
    cadastral_digitized_pct: 98.0,
    aadhaar_seeded_pct: 99.0,
    sia_objection_rate_pct: 3.0,
    rr_packages_pending_pct: 4.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 2,
    collector_meetings_last_quarter: 5,
    primary_bottleneck: 'Standard Procedural Progress',
    delay_probability: 0.089,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 0,
    last_assessed_at: '2026-09-09T17:15:00Z'
  },
  {
    id: 27,
    project_id: 'LW-IN-AP-AMA-1027',
    project_name: 'Amaravati Capital City Outer Ring Road - Sector 4',
    sector: 'Expressway / Highway',
    implementing_agency: 'APCRDA',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    latitude: 16.5417,
    longitude: 80.5158,
    current_stage: 'Section 23 Award Inquiry',
    target_duration_months: 32,
    elapsed_months: 24,
    total_land_required_ha: 610.0,
    private_land_ha: 510.0,
    government_land_ha: 100.0,
    forest_land_ha: 0.0,
    parcels_count: 1450,
    owners_count: 3200,
    budget_inr_cr: 670.0,
    compensation_disbursed_pct: 48.0,
    active_court_disputes: 22,
    cadastral_digitized_pct: 68.0,
    aadhaar_seeded_pct: 81.0,
    sia_objection_rate_pct: 24.0,
    rr_packages_pending_pct: 34.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 12,
    collector_meetings_last_quarter: 2,
    primary_bottleneck: 'Litigation in District / High Court',
    delay_probability: 0.778,
    risk_tier: 'High',
    is_delayed: 1,
    delay_months_predicted: 15,
    last_assessed_at: '2026-09-07T12:00:00Z'
  },
  {
    id: 28,
    project_id: 'LW-IN-MA-PUN-1028',
    project_name: 'Maharashtra Pune Metro Line-3 Hinjawadi IT Corridor - Sec 2',
    sector: 'Metro Rail Transit',
    implementing_agency: 'PMRDA',
    state: 'Maharashtra',
    district: 'Pune',
    latitude: 18.5913,
    longitude: 73.7389,
    current_stage: 'Section 23 Award Inquiry',
    target_duration_months: 30,
    elapsed_months: 20,
    total_land_required_ha: 165.0,
    private_land_ha: 120.0,
    government_land_ha: 45.0,
    forest_land_ha: 0.0,
    parcels_count: 510,
    owners_count: 1180,
    budget_inr_cr: 610.0,
    compensation_disbursed_pct: 64.0,
    active_court_disputes: 7,
    cadastral_digitized_pct: 82.0,
    aadhaar_seeded_pct: 88.0,
    sia_objection_rate_pct: 12.0,
    rr_packages_pending_pct: 16.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 4,
    collector_meetings_last_quarter: 4,
    primary_bottleneck: 'Pending High-Tension/Pipeline Utility Shifting',
    delay_probability: 0.412,
    risk_tier: 'Medium',
    is_delayed: 0,
    delay_months_predicted: 3,
    last_assessed_at: '2026-09-09T14:10:00Z'
  },
  {
    id: 29,
    project_id: 'LW-IN-MA-PUN-1029',
    project_name: 'Pune-Nashik Semi High-Speed Rail Corridor - Sec 3 (Pune Node)',
    sector: 'High Speed Rail / Rail',
    implementing_agency: 'MRIDC',
    state: 'Maharashtra',
    district: 'Pune',
    latitude: 18.7214,
    longitude: 73.8824,
    current_stage: 'Section 38 Possession Handover',
    target_duration_months: 36,
    elapsed_months: 32,
    total_land_required_ha: 440.0,
    private_land_ha: 310.0,
    government_land_ha: 110.0,
    forest_land_ha: 20.0,
    parcels_count: 890,
    owners_count: 1850,
    budget_inr_cr: 780.0,
    compensation_disbursed_pct: 91.5,
    active_court_disputes: 3,
    cadastral_digitized_pct: 94.0,
    aadhaar_seeded_pct: 96.0,
    sia_objection_rate_pct: 4.5,
    rr_packages_pending_pct: 5.0,
    forest_clearance_status: 'Stage 2 Approved',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 2,
    collector_meetings_last_quarter: 5,
    primary_bottleneck: 'Standard Procedural Progress',
    delay_probability: 0.145,
    risk_tier: 'Low',
    is_delayed: 0,
    delay_months_predicted: 0,
    last_assessed_at: '2026-09-09T16:00:00Z'
  },
  {
    id: 30,
    project_id: 'LW-IN-MA-NAG-1030',
    project_name: 'Maharashtra Nagpur MIHAN Multimodal Cargo Hub Expansion',
    sector: 'Industrial Corridors / Logistics',
    implementing_agency: 'MADC',
    state: 'Maharashtra',
    district: 'Nagpur',
    latitude: 21.0667,
    longitude: 79.0528,
    current_stage: 'Section 19 Declaration',
    target_duration_months: 34,
    elapsed_months: 25,
    total_land_required_ha: 580.0,
    private_land_ha: 420.0,
    government_land_ha: 160.0,
    forest_land_ha: 0.0,
    parcels_count: 1120,
    owners_count: 2450,
    budget_inr_cr: 540.0,
    compensation_disbursed_pct: 58.0,
    active_court_disputes: 14,
    cadastral_digitized_pct: 74.0,
    aadhaar_seeded_pct: 82.0,
    sia_objection_rate_pct: 19.0,
    rr_packages_pending_pct: 26.0,
    forest_clearance_status: 'Not Applicable',
    environment_clearance_status: 'Approved',
    utility_shifting_pending: 8,
    collector_meetings_last_quarter: 2,
    primary_bottleneck: 'Disputed Cadastral Map Boundaries',
    delay_probability: 0.598,
    risk_tier: 'Medium',
    is_delayed: 1,
    delay_months_predicted: 7,
    last_assessed_at: '2026-09-08T11:20:00Z'
  }
];

export const MOCK_DASHBOARD_KPIS: DashboardKPIs = {
  total_projects: 2750,
  delayed_projects: 1130,
  delayed_pct: 41.1,
  total_budget_cr: 285000,
  budget_at_risk_cr: 142500,
  avg_delay_months: 14.2,
  high_risk_count: 540,
  medium_risk_count: 590,
  low_risk_count: 1620,
  open_critical_alerts: 6
};

export const MOCK_SECTOR_BREAKDOWN: SectorItem[] = [
  {
    sector: 'Expressway / Highway',
    total_projects: 820,
    high_risk: 475,
    medium_risk: 180,
    low_risk: 165,
    total_budget_cr: 112000,
    delay_rate_pct: 58.0
  },
  {
    sector: 'High Speed Rail / Rail',
    total_projects: 540,
    high_risk: 260,
    medium_risk: 140,
    low_risk: 140,
    total_budget_cr: 78000,
    delay_rate_pct: 48.0
  },
  {
    sector: 'Metro Rail Transit',
    total_projects: 380,
    high_risk: 160,
    medium_risk: 110,
    low_risk: 110,
    total_budget_cr: 44000,
    delay_rate_pct: 42.0
  },
  {
    sector: 'Irrigation & Water Resources',
    total_projects: 410,
    high_risk: 155,
    medium_risk: 125,
    low_risk: 130,
    total_budget_cr: 32000,
    delay_rate_pct: 38.0
  },
  {
    sector: 'Industrial Corridors / Logistics',
    total_projects: 360,
    high_risk: 115,
    medium_risk: 95,
    low_risk: 150,
    total_budget_cr: 28000,
    delay_rate_pct: 32.0
  },
  {
    sector: 'Renewable Energy / Solar Park',
    total_projects: 240,
    high_risk: 58,
    medium_risk: 62,
    low_risk: 120,
    total_budget_cr: 16000,
    delay_rate_pct: 24.0
  }
];

export const MOCK_STATE_SLIPPAGE: StateSlippageItem[] = [
  {
    state: 'Maharashtra',
    total_projects: 480,
    high_risk_projects: 142,
    total_disputes: 380,
    avg_slippage_months: 16.4,
    avg_compensation_pct: 48.2
  },
  {
    state: 'Uttar Pradesh',
    total_projects: 420,
    high_risk_projects: 128,
    total_disputes: 340,
    avg_slippage_months: 15.8,
    avg_compensation_pct: 52.6
  },
  {
    state: 'Madhya Pradesh',
    total_projects: 280,
    high_risk_projects: 92,
    total_disputes: 250,
    avg_slippage_months: 14.9,
    avg_compensation_pct: 46.8
  },
  {
    state: 'West Bengal',
    total_projects: 190,
    high_risk_projects: 68,
    total_disputes: 210,
    avg_slippage_months: 17.2,
    avg_compensation_pct: 41.5
  },
  {
    state: 'Andhra Pradesh',
    total_projects: 180,
    high_risk_projects: 52,
    total_disputes: 130,
    avg_slippage_months: 13.1,
    avg_compensation_pct: 55.8
  },
  {
    state: 'Odisha',
    total_projects: 210,
    high_risk_projects: 56,
    total_disputes: 135,
    avg_slippage_months: 12.8,
    avg_compensation_pct: 58.5
  },
  {
    state: 'Karnataka',
    total_projects: 310,
    high_risk_projects: 74,
    total_disputes: 190,
    avg_slippage_months: 11.6,
    avg_compensation_pct: 64.5
  },
  {
    state: 'Tamil Nadu',
    total_projects: 290,
    high_risk_projects: 58,
    total_disputes: 160,
    avg_slippage_months: 10.4,
    avg_compensation_pct: 69.2
  },
  {
    state: 'Rajasthan',
    total_projects: 250,
    high_risk_projects: 48,
    total_disputes: 110,
    avg_slippage_months: 9.1,
    avg_compensation_pct: 74.0
  },
  {
    state: 'Gujarat',
    total_projects: 360,
    high_risk_projects: 62,
    total_disputes: 145,
    avg_slippage_months: 8.2,
    avg_compensation_pct: 81.4
  }
];

export const MOCK_BOTTLENECKS = [
  { bottleneck: 'Litigation in District / High Court (Section 64 Claims)', share_pct: 34.2 },
  { bottleneck: 'MoEFCC Forest & Wildlife Stage-II Clearances', share_pct: 24.8 },
  { bottleneck: 'Slow Direct Benefit Transfer (PFMS & Aadhaar Invalidation)', share_pct: 18.6 },
  { bottleneck: 'Resettlement & Rehabilitation (R&R) Package Disputes', share_pct: 12.4 },
  { bottleneck: 'High-Tension Line & Gas Pipeline Shifting Delays', share_pct: 6.5 },
  { bottleneck: 'Disputed Cadastral Map Georeferencing / Boundary Overlaps', share_pct: 3.5 }
];

export let MOCK_ALERTS: AlertItem[] = [
  {
    id: 101,
    project_id: 'LW-IN-MA-PUN-1001',
    project_name: 'Maharashtra Pune Greenfield Ring Road - Sec 1',
    state: 'Maharashtra',
    district: 'Pune',
    severity: 'CRITICAL',
    status: 'OPEN',
    title: 'Statutory Sunset Warning: Section 19(1) Declaration Lapse in 42 Days',
    description: 'Under Section 19(7) of RFCTLARR Act 2013, if no declaration is published within 12 months from preliminary notification, entire acquisition proceedings lapse automatically. 28 pending title suits threaten mandatory publication window.',
    trigger_rule: 'Statutory deadline delta < 60 days AND active disputes > 15',
    recommended_action: 'Invoke Section 23 consent award mechanism with DLSA Lok Adalat bench to clear injunction stays before statutory forfeiture date.',
    created_at: '2026-09-08T06:15:00Z'
  },
  {
    id: 102,
    project_id: 'LW-IN-MA-THA-1013',
    project_name: 'Maharashtra Thane Bullet Train Feeder Line - Sec 13',
    state: 'Maharashtra',
    district: 'Thane',
    severity: 'CRITICAL',
    status: 'OPEN',
    title: 'High Court Interim Injunction on 50 Hectares Mangrove / Forest Land',
    description: 'Bombay High Court Division Bench granted interim stay on tree felling and preliminary works pending compensatory afforestation compliance certificate from MoEFCC Regional Empowered Committee.',
    trigger_rule: 'e-Courts NJDG stay order detected on critical path forest corridor',
    recommended_action: 'File urgent civil application for vacation of stay accompanied by geo-tagged drone photography of identified compensatory afforestation site in Palghar.',
    created_at: '2026-09-07T14:30:00Z'
  },
  {
    id: 103,
    project_id: 'LW-IN-MP-BHO-1006',
    project_name: 'Madhya Pradesh Bhopal Multi-Purpose Dam Reservoir - Sec 6',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    severity: 'CRITICAL',
    status: 'OPEN',
    title: 'Gram Sabha Rejection & Social Impact Assessment Stall (SIA 34%)',
    description: 'Submerged villages Gram Sabha passed resolution opposing proposed R&R compensation matrix. 55% of resettlement packages remain unsigned, breaching Section 15 statutory consultation guidelines.',
    trigger_rule: 'SIA objection rate > 30% AND R&R packages pending > 50%',
    recommended_action: 'Convene Special Tripartite District Collector Round with Gram Panchayat Pradhans and Water Resources Dept to revise commercial package allocations.',
    created_at: '2026-09-06T11:20:00Z'
  },
  {
    id: 104,
    project_id: 'LW-IN-UP-VAR-1003',
    project_name: 'Uttar Pradesh Varanasi Economic Corridor Phase-II - Sec 3',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    severity: 'WARNING',
    status: 'OPEN',
    title: 'PFMS Direct Benefit Transfer Failure Spike (41.2% Disbursed)',
    description: 'Over 340 electronic PFMS compensation transactions rejected due to NPCI Aadhaar bank mapping mismatches and deceased title holder succession gaps in revenue records.',
    trigger_rule: 'PFMS disbursement rate < 50% during Section 23 Award stage',
    recommended_action: 'Deploy Common Service Centre (CSC) mobile vans in 18 affected villages for immediate biometric KYC updating and legal heir succession documentation.',
    created_at: '2026-09-07T09:00:00Z'
  },
  {
    id: 105,
    project_id: 'LW-IN-HA-GUR-1010',
    project_name: 'Haryana Gurugram Greenfield Ring Road - Sec 10',
    state: 'Haryana',
    district: 'Gurugram',
    severity: 'WARNING',
    status: 'OPEN',
    title: 'Section 64 Land Acquisition Reference Arbitrations Mount to 31 Suits',
    description: 'Commercial circle rate disputes filed by agricultural landholders demanding Gurgaon urban development authority parity rates. Stay risk on 4.2 km corridor.',
    trigger_rule: 'Dispute count > 25 in urban per-hectare high valuation zone',
    recommended_action: 'District Collector to exercise Section 30(2) powers and deposit disputed compensation in District Court Escrow, enabling physical possession under Section 38.',
    created_at: '2026-09-08T16:00:00Z'
  },
  {
    id: 106,
    project_id: 'LW-IN-WB-HOW-1011',
    project_name: 'West Bengal Howrah Dedicated Freight Corridor Yard - Sec 11',
    state: 'West Bengal',
    district: 'Howrah',
    severity: 'CRITICAL',
    status: 'OPEN',
    title: 'High-Tension Transmission Grid & Gas Pipeline Crossing Impasse',
    description: '18 high-voltage transmission towers and GAIL main gas line requiring joint relocation estimate. WBSEDCL power shutdown permissions pending for 4 months.',
    trigger_rule: 'Utility shifting pending > 15 with zero progress over 90 days',
    recommended_action: 'Escalate to State Level Single Window Committee chaired by Chief Secretary under PM GatiShakti framework for compulsory shutdown schedule.',
    created_at: '2026-09-05T08:30:00Z'
  },
  {
    id: 107,
    project_id: 'LW-IN-TN-KAN-1005',
    project_name: 'Tamil Nadu Kanchipuram Integrated Logistics Zone - Sec 5',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    severity: 'WARNING',
    status: 'ACKNOWLEDGED',
    title: 'Cadastral Map Boundary Discrepancy on 80 Hectares Wetland Fringe',
    description: 'Bhoomi / Tamil Nilam digital parcel boundary vectors deviate by 12.5 meters from survey settlement manual field measurement books (FMB).',
    trigger_rule: 'Cadastral vector spatial deviation > 10m on private boundary',
    recommended_action: 'Execute DGCA-approved drone orthomosaic resurvey with Survey of India ground control points to reconcile FMB maps.',
    acknowledged_by: 'Vikramaditya Shinde, IAS',
    acknowledged_at: '2026-09-08T11:15:00Z',
    created_at: '2026-09-06T10:00:00Z'
  },
  {
    id: 108,
    project_id: 'LW-IN-KA-BEN-1004',
    project_name: 'Karnataka Bengaluru Rural Metro Line-4 Extension - Sec 4',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    severity: 'INFO',
    status: 'RESOLVED',
    title: 'Special SLAO Consent Award Completed for Hebbal Interchange Parcels',
    description: 'Mutually agreed consent awards executed with 42 commercial landholders under Section 23A. All compensation released through PFMS within 48 hours.',
    trigger_rule: '100% consent award execution on critical alignment bottleneck',
    recommended_action: 'Proceed with physical RoW fencing and handover to BMRCL engineering contractors.',
    acknowledged_by: 'Dr. Suhas Diwase, IAS',
    acknowledged_at: '2026-09-07T14:00:00Z',
    resolved_by: 'Dr. Rajeshwari Sen, IAS',
    resolved_at: '2026-09-08T17:30:00Z',
    resolution_notes: 'Section 23A consent awards executed at 1.8x multiplier. Full DBT verified via PFMS. Physical possession handed over on 08-Sep-2026.',
    created_at: '2026-09-04T12:00:00Z'
  }
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 901,
    user_email: 'admin@landwatch.gov.in',
    user_role: 'ADMIN',
    action: 'POLICY_INTERVENTION_SIMULATED',
    resource_type: 'PROJECT',
    resource_id: 'LW-IN-MA-PUN-1001',
    details: 'Simulated Section 64 Lok Adalat consent award settlement reducing active disputes from 28 to 4, accelerating PFMS DBT to 85%. Projected risk dropped by 64.2%.',
    ip_address: '10.24.1.42',
    timestamp: '2026-09-09T18:42:10Z'
  },
  {
    id: 902,
    user_email: 'district.pune@landwatch.gov.in',
    user_role: 'DISTRICT_COLLECTOR',
    action: 'STATUTORY_DIRECTIVE_ISSUED',
    resource_type: 'PROJECT',
    resource_id: 'LW-IN-MA-PUN-1001',
    details: 'Dispatched administrative order convening Special Land Acquisition Lok Adalat bench for Haveli Tehsil parcels under Section 76 of RFCTLARR Act 2013.',
    ip_address: '10.14.88.19',
    timestamp: '2026-09-09T14:15:32Z'
  },
  {
    id: 903,
    user_email: 'state.mh@landwatch.gov.in',
    user_role: 'STATE_OFFICER',
    action: 'ALERT_ACKNOWLEDGED',
    resource_type: 'ALERT',
    resource_id: 'ALERT-107',
    details: 'Acknowledged Cadastral Map Boundary discrepancy notice for Kanchipuram Logistics Zone. Initiated DILRMP drone survey resurvey protocol.',
    ip_address: '10.18.22.4',
    timestamp: '2026-09-08T11:15:00Z'
  },
  {
    id: 904,
    user_email: 'admin@landwatch.gov.in',
    user_role: 'ADMIN',
    action: 'NOTICE_RESOLVED',
    resource_type: 'ALERT',
    resource_id: 'ALERT-108',
    details: 'Logged successful Section 23A consent awards execution for Bengaluru Rural Metro Line-4 Hebbal Interchange parcels. Handover cleared.',
    ip_address: '10.24.1.42',
    timestamp: '2026-09-08T17:30:00Z'
  },
  {
    id: 905,
    user_email: 'system@landwatch.gov.in',
    user_role: 'SYSTEM_DAEMON',
    action: 'PARIVESH_GATEWAY_SYNC',
    resource_type: 'ENVIRONMENT_CLEARANCE',
    resource_id: 'MOEFCC-PARIVESH-2.0',
    details: 'Automated telemetry poll from MoEFCC PARIVESH 2.0 portal: 42 proposals synced. Stage-II clearance granted for Visakhapatnam Coastal Zone.',
    ip_address: '127.0.0.1',
    timestamp: '2026-09-08T08:00:00Z'
  },
  {
    id: 906,
    user_email: 'system@landwatch.gov.in',
    user_role: 'SYSTEM_DAEMON',
    action: 'PFMS_DBT_LEDGER_RECONCILED',
    resource_type: 'FINANCE',
    resource_id: 'PFMS-SLAO-GATEWAY',
    details: 'Reconciled electronic treasury release transactions across 2,750 projects. Total DBT disbursements matched at ₹1,42,500 Cr across 28 states.',
    ip_address: '127.0.0.1',
    timestamp: '2026-09-07T23:59:00Z'
  },
  {
    id: 907,
    user_email: 'district.pune@landwatch.gov.in',
    user_role: 'DISTRICT_COLLECTOR',
    action: 'CADASTRE_LAYER_EXPORTED',
    resource_type: 'GIS_DATA',
    resource_id: 'CADASTRE-PUNE-RING-ROAD',
    details: 'Exported georeferenced GeoJSON cadastral layer for 1,420 land parcels in Pune district for PM GatiShakti multi-modal alignment review.',
    ip_address: '10.14.88.19',
    timestamp: '2026-09-07T16:20:00Z'
  },
  {
    id: 908,
    user_email: 'viewer@landwatch.gov.in',
    user_role: 'VIEWER',
    action: 'REGISTRY_EXPORTED',
    resource_type: 'PROJECTS',
    resource_id: 'HIGH_RISK_QUEUE',
    details: 'Exported JSON registry of 540 high-risk national infrastructure requisitions for NITI Aayog Infrastructure Review Committee quarterly meeting.',
    ip_address: '10.32.4.15',
    timestamp: '2026-09-06T11:05:00Z'
  }
];

export const MOCK_MODEL_GOVERNANCE: ModelGovernanceData = {
  best_model: 'HistGradientBoostingClassifier + TreeSHAP (v2.6.0-prod)',
  primary_metrics: {
    accuracy: 0.8945,
    precision: 0.8782,
    recall: 0.9015,
    f1_score: 0.8897,
    roc_auc: 0.9412,
    brier_score: 0.0824,
    confusion_matrix: [
      [288, 36],
      [22, 204]
    ],
    test_sample_size: 550
  },
  models_evaluated: {
    HistGradientBoosting: {
      accuracy: 0.8945,
      precision: 0.8782,
      recall: 0.9015,
      f1_score: 0.8897,
      roc_auc: 0.9412,
      status: 'PRODUCTION_ACTIVE'
    },
    RandomForest_150Trees: {
      accuracy: 0.8818,
      precision: 0.8655,
      recall: 0.8850,
      f1_score: 0.8751,
      roc_auc: 0.9328,
      status: 'CANDIDATE_BENCHMARK'
    },
    LogisticRegression_Baseline: {
      accuracy: 0.8145,
      precision: 0.7932,
      recall: 0.8053,
      f1_score: 0.7992,
      roc_auc: 0.8765,
      status: 'BASELINE_REFERENCE'
    }
  },
  feature_importances: [
    { feature: 'active_court_disputes', display_name: 'Judicial Disputes & Stay Orders (NJDG)', importance: 0.284 },
    { feature: 'compensation_disbursed_pct', display_name: 'PFMS Direct Benefit Transfer %', importance: 0.226 },
    { feature: 'forest_clearance_status', display_name: 'Forest Stage-II Clearances (PARIVESH)', importance: 0.185 },
    { feature: 'sia_objection_rate_pct', display_name: 'Social Impact Assessment Objection Rate', importance: 0.118 },
    { feature: 'cadastral_digitized_pct', display_name: 'Cadastral Georeferencing (DILRMP)', importance: 0.092 },
    { feature: 'collector_meetings_last_quarter', display_name: 'District Collector Oversight Cadence', importance: 0.054 },
    { feature: 'utility_shifting_pending', display_name: 'Pending Utility Line Clearances', importance: 0.041 }
  ],
  training_metadata: {
    framework: 'scikit-learn 1.4 & TreeSHAP Attribution Engine',
    training_sample_size: 2200,
    test_sample_size: 550,
    target_leakage_audit: 'PASSED - Sterile stratified temporal holdout',
    last_calibration: '2026-09-08T04:00:00Z',
    statutory_authorities: [
      'RFCTLARR Act 2013',
      'PM GatiShakti National Master Plan',
      'PARIVESH 2.0 MoEFCC',
      'Digital India Land Records Modernization Programme (DILRMP)',
      'Public Financial Management System (PFMS)'
    ]
  }
};

export const generateProjectDetail = (projectId: string): ProjectDetail => {
  const p = MOCK_PROJECTS.find(item => item.project_id === projectId) || MOCK_PROJECTS[0];

  const top_risk_drivers: RiskDriver[] = [];
  const top_mitigating_factors: RiskDriver[] = [];

  if (p.active_court_disputes > 5) {
    top_risk_drivers.push({
      feature: 'active_court_disputes',
      name: 'High Court / Revenue Title Litigation',
      impact: Math.min(0.35, p.active_court_disputes * 0.012 + 0.05),
      direction: 'risk_increase',
      value_text: `${p.active_court_disputes} active suits filed by landholders`
    });
  } else {
    top_mitigating_factors.push({
      feature: 'active_court_disputes',
      name: 'Clean Legal Title Registry',
      impact: -0.09,
      direction: 'risk_decrease',
      value_text: `${p.active_court_disputes} dispute suits recorded`
    });
  }

  if (p.compensation_disbursed_pct < 50) {
    top_risk_drivers.push({
      feature: 'compensation_disbursed_pct',
      name: 'Lag in PFMS Compensation Disbursement',
      impact: Math.min(0.28, (50 - p.compensation_disbursed_pct) * 0.005 + 0.06),
      direction: 'risk_increase',
      value_text: `Only ${p.compensation_disbursed_pct}% compensation disbursed`
    });
  } else {
    top_mitigating_factors.push({
      feature: 'compensation_disbursed_pct',
      name: 'Prompt PFMS DBT Compensation Credit',
      impact: -Math.min(0.22, (p.compensation_disbursed_pct - 50) * 0.004 + 0.05),
      direction: 'risk_decrease',
      value_text: `${p.compensation_disbursed_pct}% disbursed directly into Aadhaar accounts`
    });
  }

  if (p.forest_clearance_status.includes('Pending') || p.forest_clearance_status.includes('In-Review')) {
    top_risk_drivers.push({
      feature: 'forest_clearance_status',
      name: 'MoEFCC Forest Stage-II Clearance Pending',
      impact: 0.165,
      direction: 'risk_increase',
      value_text: `Status: ${p.forest_clearance_status} on ${p.forest_land_ha} ha forest land`
    });
  } else {
    top_mitigating_factors.push({
      feature: 'forest_clearance_status',
      name: 'Forest & Environmental Clearances Secured',
      impact: -0.12,
      direction: 'risk_decrease',
      value_text: `Status: ${p.forest_clearance_status}`
    });
  }

  if (p.cadastral_digitized_pct > 80) {
    top_mitigating_factors.push({
      feature: 'cadastral_digitized_pct',
      name: 'DILRMP Georeferenced Cadastral Layer Complete',
      impact: -0.08,
      direction: 'risk_decrease',
      value_text: `${p.cadastral_digitized_pct}% cadastral boundaries georeferenced with RoR`
    });
  } else if (p.cadastral_digitized_pct < 60) {
    top_risk_drivers.push({
      feature: 'cadastral_digitized_pct',
      name: 'Lagging DILRMP Cadastral Georeferencing',
      impact: 0.09,
      direction: 'risk_increase',
      value_text: `Only ${p.cadastral_digitized_pct}% parcels digitized`
    });
  }

  if (p.collector_meetings_last_quarter <= 1) {
    top_risk_drivers.push({
      feature: 'collector_meetings_last_quarter',
      name: 'Infrequent District Land Acquisition Review',
      impact: 0.075,
      direction: 'risk_increase',
      value_text: `Only ${p.collector_meetings_last_quarter} meeting in last quarter`
    });
  } else if (p.collector_meetings_last_quarter >= 4) {
    top_mitigating_factors.push({
      feature: 'collector_meetings_last_quarter',
      name: 'Active District Collector Review Cadence',
      impact: -0.07,
      direction: 'risk_decrease',
      value_text: `${p.collector_meetings_last_quarter} formal reviews convened in past 90 days`
    });
  }

  // Waterfall steps
  const waterfall_steps: WaterfallStep[] = [
    {
      step: 'National Baseline Risk',
      base_value: 0.0,
      delta: 0.42,
      final_value: 0.42,
      type: 'baseline'
    }
  ];

  let running = 0.42;
  const combinedDrivers = [...top_risk_drivers, ...top_mitigating_factors];
  for (const drv of combinedDrivers.slice(0, 5)) {
    const start = running;
    running = Math.min(0.98, Math.max(0.05, running + drv.impact));
    waterfall_steps.push({
      step: drv.name,
      base_value: Math.round(start * 1000) / 1000,
      delta: Math.round(drv.impact * 1000) / 1000,
      final_value: Math.round(running * 1000) / 1000,
      type: drv.direction
    });
  }

  waterfall_steps.push({
    step: 'Calibrated Delay Risk',
    base_value: 0.0,
    delta: p.delay_probability,
    final_value: p.delay_probability,
    type: 'total'
  });

  // Statutory Recommendations with legal sections 11, 15, 19, 23, 38, 64, 76, 77
  const recommendations: Recommendation[] = [];

  if (p.active_court_disputes > 5) {
    recommendations.push({
      priority: 'Critical Urgent',
      action_title: 'Convene Special Lok Adalat & Section 64 Reference Mediation',
      statutory_reference: 'Section 64 & Section 76, RFCTLARR Act 2013',
      responsible_authority: 'District Legal Services Authority (DLSA) & SLAO',
      description: `District has ${p.active_court_disputes} active title disputes. Convene weekend Lok Adalat camp at Tehsil headquarters with state standing counsel to execute pre-trial consent awards with affected landholders.`,
      target_mechanism: 'DLSA Fast-Track Land Dispute Bench / Revenue Court Camp',
      expected_risk_reduction_pct: 24.5,
      estimated_delay_saved_days: 115
    });
  }

  if (p.compensation_disbursed_pct < 60) {
    recommendations.push({
      priority: 'High Priority',
      action_title: 'Initiate PFMS Direct Benefit Transfer (DBT) Disbursement Camp',
      statutory_reference: 'Section 77, RFCTLARR Act 2013 (Payment of Compensation)',
      responsible_authority: 'District Collector & Treasury Officer / Lead District Bank Manager',
      description: `PFMS DBT disbursement is currently at ${p.compensation_disbursed_pct}%. Mobilize CSC Common Service Centre operators across affected villages to complete 100% Aadhaar-NPCI bank mapping.`,
      target_mechanism: 'Public Financial Management System (PFMS) - SLAO Portal Integration',
      expected_risk_reduction_pct: 19.0,
      estimated_delay_saved_days: 85
    });
  }

  if (p.forest_clearance_status.includes('Pending') || p.forest_clearance_status.includes('In-Review')) {
    recommendations.push({
      priority: 'High Priority',
      action_title: 'Trigger PM GatiShakti Nodal Forest Clearance Fast-Track',
      statutory_reference: 'Forest (Conservation) Act & PARIVESH 2.0 Unified Portal Guidelines',
      responsible_authority: 'Principal Chief Conservator of Forests (PCCF) & Nodal Officer',
      description: `Status is '${p.forest_clearance_status}' on ${p.forest_land_ha} ha forest land. Upload compensatory afforestation mutation records via PARIVESH 2.0 and schedule Regional Empowered Committee review.`,
      target_mechanism: 'PM GatiShakti Project Monitoring Group (PMG) / PARIVESH 2.0',
      expected_risk_reduction_pct: 18.0,
      estimated_delay_saved_days: 90
    });
  }

  if (p.sia_objection_rate_pct > 15 || p.rr_packages_pending_pct > 25) {
    recommendations.push({
      priority: 'Medium Priority',
      action_title: 'Convene Gram Sabha Participatory R&R Review & Grievance Redressal',
      statutory_reference: 'Sections 15 & 16, RFCTLARR Act 2013 (Hearing of Objections & R&R Scheme)',
      responsible_authority: 'Sub-Divisional Magistrate (SDM) & Social Impact Management Cell',
      description: `SIA objection rate is ${p.sia_objection_rate_pct}% with ${p.rr_packages_pending_pct}% pending R&R packages. Deploy field revenue teams to resolve community infrastructure demands and publish revised village rehabilitation matrix.`,
      target_mechanism: 'Village Public Consultation & Gram Panchayat Special Resolution',
      expected_risk_reduction_pct: 12.0,
      estimated_delay_saved_days: 60
    });
  }

  if (p.cadastral_digitized_pct < 70) {
    recommendations.push({
      priority: 'Medium Priority',
      action_title: 'Deploy DILRMP Drone Survey & Geo-referenced Cadastral Layer Integration',
      statutory_reference: 'Digital India Land Records Modernization Programme (DILRMP)',
      responsible_authority: 'Director of Land Records & Survey Settlement Officer',
      description: `Cadastral digitization is lagging at ${p.cadastral_digitized_pct}%. Conduct high-precision DGCA-approved drone orthomosaic mapping to establish parcel boundaries and reconcile discrepancy with Bhoomi records.`,
      target_mechanism: 'DILRMP RoR & GIS Cadastral Matching Sprint',
      expected_risk_reduction_pct: 10.5,
      estimated_delay_saved_days: 45
    });
  }

  if (p.utility_shifting_pending > 6) {
    recommendations.push({
      priority: 'High Priority',
      action_title: 'Issue Joint Right-of-Way (RoW) Notice for Utility Relocation',
      statutory_reference: 'PM GatiShakti Inter-Ministerial Coordination Protocols',
      responsible_authority: 'State Electricity Board (DISCOM) / Gas Pipeline Authority / District Magistrate',
      description: `${p.utility_shifting_pending} public utility crossings remain unresolved. Establish joint inspection committee with state power transmission and water board for phased shutdown and relocation supervision.`,
      target_mechanism: 'GatiShakti District Utility Taskforce Resolution',
      expected_risk_reduction_pct: 8.5,
      estimated_delay_saved_days: 35
    });
  }

  // Ensure at least 3 recommendations always
  if (recommendations.length < 3) {
    recommendations.push({
      priority: 'Standard Directives',
      action_title: 'Exercise Section 38 Possession Handover Notification',
      statutory_reference: 'Section 38, RFCTLARR Act 2013 (Power to Take Possession)',
      responsible_authority: 'District Collector / SLAO',
      description: 'Upon confirmation of compensation deposit in treasury escrow, Collector may take possession of land after full payment of award.',
      target_mechanism: 'Statutory Possession Certificate & Revenue Entry',
      expected_risk_reduction_pct: 6.0,
      estimated_delay_saved_days: 20
    });
  }

  // Lifecycle Milestones
  const stages = [
    { name: 'Section 4 Preliminary Survey', targetM: 4 },
    { name: 'Section 11 Notification', targetM: 8 },
    { name: 'Social Impact Assessment (SIA)', targetM: 14 },
    { name: 'Section 19 Declaration', targetM: 20 },
    { name: 'Section 23 Award Inquiry', targetM: 28 },
    { name: 'Section 38 Possession Handover', targetM: 36 }
  ];

  let currentIdx = 0;
  for (let i = 0; i < stages.length; i++) {
    if (p.current_stage.toLowerCase().includes(stages[i].name.toLowerCase()) ||
        stages[i].name.toLowerCase().includes(p.current_stage.toLowerCase())) {
      currentIdx = i;
      break;
    }
  }

  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() - p.elapsed_months);

  const timeline_milestones: LifecycleMilestone[] = stages.map((st, idx) => {
    const sched = new Date(baseDate);
    sched.setMonth(sched.getMonth() + st.targetM);

    let status: 'Completed' | 'In Progress' | 'Pending' = 'Pending';
    let delayDays = 0;
    if (idx < currentIdx) {
      status = 'Completed';
    } else if (idx === currentIdx) {
      status = 'In Progress';
      delayDays = p.delay_months_predicted * 30;
    } else {
      status = 'Pending';
      delayDays = p.delay_months_predicted * 30;
    }

    const proj = new Date(sched);
    proj.setDate(proj.getDate() + delayDays);

    return {
      stage_name: st.name,
      scheduled_date: sched.toISOString().split('T')[0],
      projected_date: proj.toISOString().split('T')[0],
      status,
      is_current: idx === currentIdx,
      delay_variance_days: delayDays
    };
  });

  return {
    ...p,
    top_risk_drivers,
    top_mitigating_factors,
    waterfall_steps,
    recommendations,
    timeline_milestones
  };
};

export const generateGovIntegrations = (projectId: string) => {
  const p = MOCK_PROJECTS.find(item => item.project_id === projectId) || MOCK_PROJECTS[0];

  const totalInr = p.budget_inr_cr * 10000000;
  const disbursedInr = Math.round(totalInr * (p.compensation_disbursed_pct / 100));
  const pendingInr = totalInr - disbursedInr;

  return {
    project_id: p.project_id,
    project_name: p.project_name,
    integrations: {
      pfms_dbt: {
        system: 'PFMS-SLAO DBT Gateway',
        connected: true,
        status: 'ACTIVE_SYNC',
        last_sync_timestamp: new Date().toISOString(),
        scheme_code: '0912-INFRA-LAND-ACQ',
        treasury_account_active: true,
        total_sanctioned_inr: totalInr,
        electronic_disbursed_inr: disbursedInr,
        pending_treasury_release_inr: pendingInr,
        npci_aadhaar_match_rate_pct: Math.min(99.4, p.compensation_disbursed_pct + 12.0),
        rejected_transactions_count: p.compensation_disbursed_pct < 50 ? 14 : 2,
        action_required: p.compensation_disbursed_pct < 50
          ? 'Initiate NPCI Aadhaar bank reconciliation camp'
          : 'None - Payment pipeline healthy'
      },
      ecourts_njdg: {
        system: 'e-Courts NJDG / Revenue Court Management System (RCMS)',
        connected: true,
        district_jurisdiction: p.district,
        total_active_suits: p.active_court_disputes,
        breakdown: {
          section_64_reference_claims: Math.round(p.active_court_disputes * 0.55),
          writ_petitions_high_court: Math.round(p.active_court_disputes * 0.25),
          revenue_tehsil_title_mutations: Math.round(p.active_court_disputes * 0.20)
        },
        injunction_stay_orders_active: p.active_court_disputes > 15 ? 1 : 0,
        next_lok_adalat_schedule: 'Third Saturday of Month (Fast-Track Land Bench)',
        recommended_counsel_action: 'File counter-affidavit with SLAO valuation award copy'
      },
      dilrmp_bhoomi: {
        system: 'DILRMP / State Cadastral GIS Engine',
        state_portal: `${p.state} Land Records Bhulekh/Bhoomi Gateway`,
        georeferenced_vector_layer_available: p.cadastral_digitized_pct >= 60.0,
        cadastral_digitization_pct: p.cadastral_digitized_pct,
        spatial_reference_system: 'EPSG:4326 (WGS84) & EPSG:3857',
        drone_orthomosaic_status: p.cadastral_digitized_pct >= 75 ? 'Completed' : 'Partially Surveyed',
        integrated_ror_712_linkage: p.cadastral_digitized_pct >= 70.0
      },
      parivesh_moefcc: {
        system: 'PARIVESH 2.0 (MoEFCC Unified Clearances)',
        proposal_tracking_no: `FP/${p.state.slice(0, 2).toUpperCase()}/INFRA/${p.id + 1040}/2026`,
        forest_status: p.forest_clearance_status,
        environment_status: p.environment_clearance_status,
        compensatory_afforestation_land_identified: p.forest_land_ha > 0 ? `${(p.forest_land_ha * 2).toFixed(1)} ha identified` : 'N/A (Zero Forest)',
        regional_empowered_committee_meeting_status: p.forest_clearance_status.includes('Pending')
          ? 'Scheduled in upcoming REC agenda'
          : 'Clearance Granted'
      }
    }
  };
};

// Pure client-side simulation engine (What-If calculator)
export const computeClientSimulation = (
  projectId: string,
  payload: SimulationRequest
): SimulationResponse => {
  const p = MOCK_PROJECTS.find(item => item.project_id === projectId) || MOCK_PROJECTS[0];

  const baseProb = p.delay_probability;
  const baseMonths = p.delay_months_predicted;
  const baseTier = p.risk_tier;

  const simDisputes = payload.active_court_disputes !== undefined ? payload.active_court_disputes : p.active_court_disputes;
  const simComp = payload.compensation_disbursed_pct !== undefined ? payload.compensation_disbursed_pct : p.compensation_disbursed_pct;
  const simCad = payload.cadastral_digitized_pct !== undefined ? payload.cadastral_digitized_pct : p.cadastral_digitized_pct;
  const simAadhaar = payload.aadhaar_seeded_pct !== undefined ? payload.aadhaar_seeded_pct : p.aadhaar_seeded_pct;
  const simForest = payload.forest_clearance_status !== undefined ? payload.forest_clearance_status : p.forest_clearance_status;
  const simDcMeets = payload.collector_meetings_last_quarter !== undefined ? payload.collector_meetings_last_quarter : p.collector_meetings_last_quarter;

  // Calibrated logit scoring
  let logit = -0.50;
  const disputeDensity = simDisputes / Math.max(1, p.parcels_count);
  logit += Math.min(2.5, disputeDensity * 18.0);

  if (simComp < 45.0) {
    logit += (45.0 - simComp) * 0.045;
  } else if (simComp > 75.0) {
    logit -= (simComp - 75.0) * 0.03;
  }

  if (simForest.includes('Pending') || simForest.includes('Rejected')) {
    logit += 1.35;
  } else if (simForest.includes('Approved') || simForest.includes('Not Applicable')) {
    logit -= 0.45;
  }

  if (simCad < 60.0) {
    logit += (60.0 - simCad) * 0.025;
  } else if (simCad > 85.0) {
    logit -= 0.40;
  }

  if (simDcMeets <= 1) {
    logit += 0.55;
  } else if (simDcMeets >= 4) {
    logit -= 0.50;
  }

  const rawSimProb = 1.0 / (1.0 + Math.exp(-logit));
  const simProb = Math.round(Math.min(0.98, Math.max(0.04, rawSimProb)) * 1000) / 1000;

  let simTier: 'High' | 'Medium' | 'Low' = 'Low';
  if (simProb >= 0.65) simTier = 'High';
  else if (simProb >= 0.40) simTier = 'Medium';

  const probReductionPct = Math.max(0, Math.round(((baseProb - simProb) / Math.max(0.01, baseProb)) * 1000) / 10);
  const monthsSaved = Math.max(0, Math.round((probReductionPct / 100) * baseMonths));
  const simMonths = Math.max(0, baseMonths - monthsSaved);

  const shap_deltas = [
    {
      feature: 'active_court_disputes',
      baseline_impact: Math.round(Math.min(0.35, p.active_court_disputes * 0.012) * 1000) / 1000,
      simulated_impact: Math.round(Math.min(0.35, simDisputes * 0.012) * 1000) / 1000,
      net_impact_reduction: Math.round(Math.max(0, (p.active_court_disputes - simDisputes) * 0.012) * 1000) / 1000
    },
    {
      feature: 'compensation_disbursed_pct',
      baseline_impact: Math.round(Math.max(-0.2, (50 - p.compensation_disbursed_pct) * 0.005) * 1000) / 1000,
      simulated_impact: Math.round(Math.max(-0.2, (50 - simComp) * 0.005) * 1000) / 1000,
      net_impact_reduction: Math.round(Math.max(0, (simComp - p.compensation_disbursed_pct) * 0.005) * 1000) / 1000
    },
    {
      feature: 'forest_clearance_status',
      baseline_impact: p.forest_clearance_status.includes('Pending') ? 0.165 : -0.12,
      simulated_impact: simForest.includes('Pending') ? 0.165 : -0.12,
      net_impact_reduction: (p.forest_clearance_status.includes('Pending') && !simForest.includes('Pending')) ? 0.285 : 0.0
    },
    {
      feature: 'cadastral_digitized_pct',
      baseline_impact: Math.round(((65 - p.cadastral_digitized_pct) * 0.003) * 1000) / 1000,
      simulated_impact: Math.round(((65 - simCad) * 0.003) * 1000) / 1000,
      net_impact_reduction: Math.round(Math.max(0, (simCad - p.cadastral_digitized_pct) * 0.003) * 1000) / 1000
    }
  ];

  const narrative = `Targeted administrative interventions (PFMS DBT compensation at ${simComp}%, Lok Adalat court mediation to ${simDisputes} suits, and Stage-II status '${simForest}') reduce projected statutory delay risk by ${probReductionPct}% (from ${(baseProb * 100).toFixed(1)}% to ${(simProb * 100).toFixed(1)}%). Anticipated timeline slippage is curtailed by ~${monthsSaved} months (~${monthsSaved * 30} calendar days), transitioning the project classification from ${baseTier} ➔ ${simTier}.`;

  const updatedDetail = generateProjectDetail(projectId);

  return {
    project_id: p.project_id,
    project_name: p.project_name,
    baseline: {
      delay_probability: baseProb,
      risk_tier: baseTier,
      delay_months_predicted: baseMonths,
      compensation_disbursed_pct: p.compensation_disbursed_pct,
      active_court_disputes: p.active_court_disputes,
      forest_clearance_status: p.forest_clearance_status
    },
    simulated: {
      delay_probability: simProb,
      risk_tier: simTier,
      delay_months_predicted: simMonths,
      compensation_disbursed_pct: simComp,
      active_court_disputes: simDisputes,
      forest_clearance_status: simForest
    },
    delay_probability_reduction_pct: probReductionPct,
    delay_months_saved: monthsSaved,
    risk_tier_transition: `${baseTier} ➔ ${simTier}`,
    shap_deltas,
    simulated_recommendations: updatedDetail.recommendations,
    narrative_summary: narrative
  };
};
