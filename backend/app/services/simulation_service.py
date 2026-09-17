"""
What-If Simulation Engine for Administrative Interventions
Executes counterfactual evaluations on project parameters, calculating risk reduction deltas,
saved months/days, and modified feature attributions.
"""

from typing import Dict, Any
from app.services.ml_service import MLService
from app.schemas.simulation import SimulationRequest, SimulationResponse


class SimulationService:
    @staticmethod
    def simulate_intervention(project_obj: Any, overrides: SimulationRequest) -> SimulationResponse:
        # Build baseline dictionary from project attributes
        baseline_dict = {
            "project_id": project_obj.project_id,
            "project_name": project_obj.project_name,
            "sector": project_obj.sector,
            "implementing_agency": project_obj.implementing_agency,
            "state": project_obj.state,
            "district": project_obj.district,
            "current_stage": project_obj.current_stage,
            "target_duration_months": project_obj.target_duration_months,
            "elapsed_months": project_obj.elapsed_months,
            "total_land_required_ha": project_obj.total_land_required_ha,
            "parcels_count": project_obj.parcels_count,
            "owners_count": project_obj.owners_count,
            "budget_inr_cr": project_obj.budget_inr_cr,
            "compensation_disbursed_pct": project_obj.compensation_disbursed_pct,
            "active_court_disputes": project_obj.active_court_disputes,
            "cadastral_digitized_pct": project_obj.cadastral_digitized_pct,
            "aadhaar_seeded_pct": project_obj.aadhaar_seeded_pct,
            "sia_objection_rate_pct": project_obj.sia_objection_rate_pct,
            "rr_packages_pending_pct": project_obj.rr_packages_pending_pct,
            "forest_clearance_status": project_obj.forest_clearance_status,
            "environment_clearance_status": project_obj.environment_clearance_status,
            "utility_shifting_pending": project_obj.utility_shifting_pending,
            "collector_meetings_last_quarter": project_obj.collector_meetings_last_quarter,
            "delay_probability": project_obj.delay_probability,
            "risk_tier": project_obj.risk_tier,
            "delay_months_predicted": project_obj.delay_months_predicted
        }

        # Clone and apply counterfactual overrides
        simulated_dict = baseline_dict.copy()
        applied_interventions = []

        if overrides.compensation_disbursed_pct is not None:
            simulated_dict["compensation_disbursed_pct"] = overrides.compensation_disbursed_pct
            applied_interventions.append(f"PFMS DBT compensation increased to {overrides.compensation_disbursed_pct}%")

        if overrides.active_court_disputes is not None:
            old_disputes = simulated_dict["active_court_disputes"]
            simulated_dict["active_court_disputes"] = overrides.active_court_disputes
            applied_interventions.append(f"Court disputes mediated down from {old_disputes} to {overrides.active_court_disputes}")

        if overrides.cadastral_digitized_pct is not None:
            simulated_dict["cadastral_digitized_pct"] = overrides.cadastral_digitized_pct
            applied_interventions.append(f"Cadastral digitization accelerated to {overrides.cadastral_digitized_pct}%")

        if overrides.aadhaar_seeded_pct is not None:
            simulated_dict["aadhaar_seeded_pct"] = overrides.aadhaar_seeded_pct
            applied_interventions.append(f"Aadhaar seeding expanded to {overrides.aadhaar_seeded_pct}%")

        if overrides.forest_clearance_status is not None:
            simulated_dict["forest_clearance_status"] = overrides.forest_clearance_status
            applied_interventions.append(f"Forest clearance updated to '{overrides.forest_clearance_status}'")

        if overrides.environment_clearance_status is not None:
            simulated_dict["environment_clearance_status"] = overrides.environment_clearance_status
            applied_interventions.append(f"Environmental clearance updated to '{overrides.environment_clearance_status}'")

        if overrides.collector_meetings_last_quarter is not None:
            simulated_dict["collector_meetings_last_quarter"] = overrides.collector_meetings_last_quarter
            applied_interventions.append(f"Collector review meetings increased to {overrides.collector_meetings_last_quarter}")

        if overrides.utility_shifting_pending is not None:
            simulated_dict["utility_shifting_pending"] = overrides.utility_shifting_pending
            applied_interventions.append(f"Pending utility clearances reduced to {overrides.utility_shifting_pending}")

        # Re-evaluate with ML service
        baseline_analysis = MLService.get_full_analysis(baseline_dict)
        simulated_analysis = MLService.get_full_analysis(simulated_dict)

        base_prob = baseline_analysis["delay_probability"]
        sim_prob = simulated_analysis["delay_probability"]
        prob_reduction_pct = round(((base_prob - sim_prob) / max(0.01, base_prob)) * 100.0, 1)

        base_delay_months = baseline_analysis["delay_months_predicted"]
        sim_delay_months = simulated_analysis["delay_months_predicted"]
        months_saved = max(0, base_delay_months - sim_delay_months)

        # Calculate SHAP deltas
        base_drivers = {d["feature"]: d["impact"] for d in baseline_analysis["top_risk_drivers"]}
        sim_drivers = {d["feature"]: d["impact"] for d in simulated_analysis["top_risk_drivers"]}
        
        shap_deltas = []
        all_features = set(base_drivers.keys()).union(set(sim_drivers.keys()))
        for feat in all_features:
            b_val = base_drivers.get(feat, 0.0)
            s_val = sim_drivers.get(feat, 0.0)
            delta = round(s_val - b_val, 4)
            if abs(delta) > 0.001:
                shap_deltas.append({
                    "feature": feat,
                    "baseline_impact": round(b_val, 4),
                    "simulated_impact": round(s_val, 4),
                    "net_impact_reduction": round(-delta, 4)
                })

        # Sort by impact reduction descending
        shap_deltas.sort(key=lambda x: x["net_impact_reduction"], reverse=True)

        risk_transition = f"{baseline_analysis['risk_tier']} ➔ {simulated_analysis['risk_tier']}"
        days_saved = months_saved * 30
        
        narrative = (
            f"Implementing targeted interventions ({', '.join(applied_interventions)}) reduces projected delay risk by "
            f"{prob_reduction_pct}% (from {round(base_prob*100, 1)}% to {round(sim_prob*100, 1)}%). "
            f"Expected timeline slippage is reduced by ~{months_saved} months (~{days_saved} days), moving the project risk classification "
            f"from {risk_transition}."
        )

        return SimulationResponse(
            project_id=project_obj.project_id,
            project_name=project_obj.project_name,
            baseline={
                "delay_probability": base_prob,
                "risk_tier": baseline_analysis["risk_tier"],
                "delay_months_predicted": base_delay_months,
                "compensation_disbursed_pct": baseline_dict["compensation_disbursed_pct"],
                "active_court_disputes": baseline_dict["active_court_disputes"],
                "forest_clearance_status": baseline_dict["forest_clearance_status"]
            },
            simulated={
                "delay_probability": sim_prob,
                "risk_tier": simulated_analysis["risk_tier"],
                "delay_months_predicted": sim_delay_months,
                "compensation_disbursed_pct": simulated_dict["compensation_disbursed_pct"],
                "active_court_disputes": simulated_dict["active_court_disputes"],
                "forest_clearance_status": simulated_dict["forest_clearance_status"]
            },
            delay_probability_reduction_pct=prob_reduction_pct,
            delay_months_saved=months_saved,
            risk_tier_transition=risk_transition,
            shap_deltas=shap_deltas,
            simulated_recommendations=simulated_analysis["recommendations"],
            narrative_summary=narrative
        )
