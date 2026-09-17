"""
Administrative Action Recommendation Engine for Infrastructure Projects
Maps machine learning risk factors to concrete, actionable statutory remedies under RFCTLARR Act 2013,
PARIVESH portal, PM GatiShakti NMP, and State Land Revenue Codes.
"""

from typing import List, Dict, Any


def generate_recommendations(project_dict: Dict[str, Any], risk_drivers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generates actionable, prioritized administrative recommendations based on identified risk factors.
    """
    recommendations = []
    
    disputes = project_dict.get("active_court_disputes", 0)
    parcels = max(1, project_dict.get("parcels_count", 100))
    dispute_ratio = disputes / parcels
    comp_pct = project_dict.get("compensation_disbursed_pct", 0.0)
    forest_status = str(project_dict.get("forest_clearance_status", "Not Applicable"))
    sia_rate = project_dict.get("sia_objection_rate_pct", 0.0)
    rr_pending = project_dict.get("rr_packages_pending_pct", 0.0)
    cadastral_pct = project_dict.get("cadastral_digitized_pct", 50.0)
    utilities = project_dict.get("utility_shifting_pending", 0)
    meetings = project_dict.get("collector_meetings_last_quarter", 2)
    stage = project_dict.get("current_stage", "")
    
    # Recommendation 1: Lok Adalat for Title Disputes
    if disputes > 5 or dispute_ratio > 0.06:
        recommendations.append({
            "priority": "Critical Urgent",
            "action_title": "Convene Special Lok Adalat & Section 64 Reference Mediation",
            "statutory_reference": "Section 64 & Section 76, RFCTLARR Act 2013",
            "responsible_authority": "District Legal Services Authority (DLSA) & Special Land Acquisition Officer (SLAO)",
            "description": f"District has {disputes} pending title litigations. Order an immediate weekend Lok Adalat camp at Tehsil headquarters with state standing counsel to achieve pre-trial consent settlements with disputed landholders.",
            "target_mechanism": "DLSA Fast-Track Land Dispute Bench / Revenue Court Camp",
            "expected_risk_reduction_pct": 24.5,
            "estimated_delay_saved_days": 115
        })

    # Recommendation 2: PFMS Direct Benefit Transfer Blitz
    if comp_pct < 60.0 and ("Award" in stage or "Section 19" in stage or "Section 23" in stage or "Possession" in stage):
        recommendations.append({
            "priority": "High Priority",
            "action_title": "Initiate PFMS DBT Aadhaar-Seeded Disbursement Camp",
            "statutory_reference": "Section 77, RFCTLARR Act 2013 (Payment of Compensation)",
            "responsible_authority": "District Collector & Treasury Officer / Lead District Bank Manager (LDMB)",
            "description": f"Compensation disbursement is at {comp_pct}%. Mobilize CSC (Common Service Centre) operators across affected villages to complete 100% Aadhaar-NPCI bank mapping and expedite direct electronic award payouts.",
            "target_mechanism": "Public Financial Management System (PFMS) - SLAO Portal Integration",
            "expected_risk_reduction_pct": 19.0,
            "estimated_delay_saved_days": 85
        })

    # Recommendation 3: Forest Clearance Stage-II Inter-Ministerial Escalation
    if any(s in forest_status for s in ["Pending", "In-Review", "Rejected"]):
        recommendations.append({
            "priority": "High Priority",
            "action_title": "Trigger PM GatiShakti Nodal Forest Clearance Fast-Track",
            "statutory_reference": "Forest (Conservation) Act & PARIVESH 2.0 Unified Portal Guidelines",
            "responsible_authority": "State Principal Chief Conservator of Forests (PCCF) & Implementing Agency Nodal Officer",
            "description": f"Status is '{forest_status}'. Submit compensatory afforestation (CA) land mutation records via PARIVESH portal and schedule an inter-departmental review with Regional Empowered Committee (REC).",
            "target_mechanism": "PM GatiShakti Project Monitoring Group (PMG) / PARIVESH 2.0 Fast-Track",
            "expected_risk_reduction_pct": 18.0,
            "estimated_delay_saved_days": 90
        })

    # Recommendation 4: Gram Sabha SIA Consultation
    if sia_rate > 15.0 or rr_pending > 25.0:
        recommendations.append({
            "priority": "Medium Priority",
            "action_title": "Convene Gram Sabha Participatory R&R Review & Grievance Redressal",
            "statutory_reference": "Sections 15 & 16, RFCTLARR Act 2013 (Hearing of Objections & R&R Scheme)",
            "responsible_authority": "Sub-Divisional Magistrate (SDM) & Social Impact Management Cell",
            "description": f"SIA objection rate stands at {sia_rate}% with {rr_pending}% pending R&R packages. Deploy field revenue officers to address community infrastructural demands and publish revised village resettlement package.",
            "target_mechanism": "Village Public Consultation & Gram Panchayat Special Resolution",
            "expected_risk_reduction_pct": 12.0,
            "estimated_delay_saved_days": 60
        })

    # Recommendation 5: Drone Cadastral Resurvey and Geo-referencing
    if cadastral_pct < 70.0:
        recommendations.append({
            "priority": "Medium Priority",
            "action_title": "Deploy DILRMP Drone Survey & Geo-referenced Cadastral Layer Integration",
            "statutory_reference": "Digital India Land Records Modernization Programme (DILRMP)",
            "responsible_authority": "Director of Land Records & Survey Settlement Officer",
            "description": f"Cadastral digitization is lagging at {cadastral_pct}%. Conduct high-precision DGCA-approved drone orthomosaic mapping to establish parcel boundaries and reconcile discrepancy with Bhoomi records.",
            "target_mechanism": "DILRMP RoR & GIS Cadastral Matching Sprint",
            "expected_risk_reduction_pct": 10.5,
            "estimated_delay_saved_days": 45
        })

    # Recommendation 6: Inter-Agency Utility Relocation Coordination
    if utilities > 6:
        recommendations.append({
            "priority": "High Priority",
            "action_title": "Issue Joint Right-of-Way (RoW) Clearance Notice for Utility Relocation",
            "statutory_reference": "PM GatiShakti Inter-Ministerial Coordination Protocols",
            "responsible_authority": "State Electricity Board (DISCOM) / Gas Pipeline Authority / District Magistrate",
            "description": f"{utilities} public utility crossings remain unresolved. Establish joint inspection committee with state power transmission and water board for phased shutdown and relocation supervision.",
            "target_mechanism": "GatiShakti 3D RoW Coordination Committee",
            "expected_risk_reduction_pct": 14.0,
            "estimated_delay_saved_days": 55
        })

    # Recommendation 7: District Collector Weekly Review Cadence
    if meetings <= 1:
        recommendations.append({
            "priority": "Advisory",
            "action_title": "Institutionalize Bi-Weekly District Land Acquisition Taskforce Reviews",
            "statutory_reference": "State Infrastructure Coordination Act / District Monitoring Guidelines",
            "responsible_authority": "District Magistrate & Collector",
            "description": f"Only {meetings} administrative review held recently. Mandate bi-weekly progress review with SLAO, revenue tehsildars, and project agency directors.",
            "target_mechanism": "District Land Acquisition Task Force (DLATF) Standing Committee",
            "expected_risk_reduction_pct": 8.0,
            "estimated_delay_saved_days": 30
        })

    # Fallback if project is exceptionally smooth
    if not recommendations:
        recommendations.append({
            "priority": "Routine Monitoring",
            "action_title": "Maintain Continuous Real-Time Satellite & Bhoomi Cadastral Surveillance",
            "statutory_reference": "Standard Operating Procedure for Infrastructure Right of Way",
            "responsible_authority": "Project Implementing Agency & District Collector",
            "description": "Project parameters are within safe benchmarks. Continue bi-weekly digital monitoring through LandWatch and ensure timely disbursement milestone tracking.",
            "target_mechanism": "Automated Sentinel-2 / Landsat-9 Satellite Change Detection",
            "expected_risk_reduction_pct": 5.0,
            "estimated_delay_saved_days": 15
        })

    return recommendations
