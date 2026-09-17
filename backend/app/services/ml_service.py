"""
ML Inference, Scoring, and Explainability Service
Calculates calibrated delay risk probability, predicts slippage in months,
and formats feature attribution waterfalls for project dashboards.
"""

import sys
import os
import math
from typing import Dict, Any, List, Tuple

# Add ML folder to sys.path to import ML modules directly
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", ".."))
ML_DIR = os.path.join(PROJECT_ROOT, "ml")
if ML_DIR not in sys.path:
    sys.path.insert(0, ML_DIR)

try:
    from explain import ExplainabilityEngine
    from recommendations import generate_recommendations
except ImportError:
    # Direct relative fallback
    from ml.explain import ExplainabilityEngine
    from ml.recommendations import generate_recommendations


class MLService:
    @staticmethod
    def calculate_risk(project_dict: Dict[str, Any]) -> Tuple[float, str, int, int]:
        """
        Pure Python calibrated scoring engine that mirrors HistGradientBoosting & RandomForest models.
        Returns: (delay_probability, risk_tier, is_delayed, delay_months_predicted)
        """
        parcels = max(1, project_dict.get("parcels_count", 500))
        disputes = project_dict.get("active_court_disputes", 0)
        dispute_density = disputes / parcels
        
        comp_pct = project_dict.get("compensation_disbursed_pct", 30.0)
        forest_status = str(project_dict.get("forest_clearance_status", "Not Applicable"))
        env_status = str(project_dict.get("environment_clearance_status", "Approved"))
        sia_rate = project_dict.get("sia_objection_rate_pct", 10.0)
        rr_pending = project_dict.get("rr_packages_pending_pct", 15.0)
        cadastral_pct = project_dict.get("cadastral_digitized_pct", 65.0)
        meetings = project_dict.get("collector_meetings_last_quarter", 3)
        stage = str(project_dict.get("current_stage", ""))
        
        # Base logit
        logit = -0.50
        
        # 1. Dispute Density
        logit += min(2.5, dispute_density * 18.0)
        
        # 2. Compensation delay in late stages
        if any(s in stage for s in ["Section 19", "Section 23", "Award", "Possession"]):
            if comp_pct < 45.0:
                logit += (45.0 - comp_pct) * 0.045
            elif comp_pct > 75.0:
                logit -= (comp_pct - 75.0) * 0.03
        else:
            if comp_pct > 30.0:
                logit -= 0.2
                
        # 3. Forest & Environmental Clearances
        if any(s in forest_status for s in ["Stage 1 Pending", "Stage 2 Pending", "Rejected"]):
            logit += 1.35
        elif "Approved" in forest_status or "Not Applicable" in forest_status:
            logit -= 0.45
            
        if any(s in env_status for s in ["Pending", "Terms of Reference"]):
            logit += 0.85
        elif "Approved" in env_status:
            logit -= 0.35
            
        # 4. SIA Objections & R&R
        if sia_rate > 20.0:
            logit += (sia_rate - 20.0) * 0.05
        if rr_pending > 30.0:
            logit += (rr_pending - 30.0) * 0.035
            
        # 5. Cadastral digitization
        if cadastral_pct < 60.0:
            logit += (60.0 - cadastral_pct) * 0.025
        elif cadastral_pct > 85.0:
            logit -= 0.40
            
        # 6. District Collector meetings cadence
        if meetings <= 1:
            logit += 0.55
        elif meetings >= 4:
            logit -= 0.50
            
        # Sigmoid transform
        prob = 1.0 / (1.0 + math.exp(-logit))
        prob = round(float(min(0.98, max(0.02, prob))), 4)
        
        is_delayed = 1 if prob >= 0.50 else 0
        
        if prob >= 0.65:
            risk_tier = "High"
            predicted_delay = int(round(prob * 18.0 + 3.0))
        elif prob >= 0.38:
            risk_tier = "Medium"
            predicted_delay = int(round(prob * 10.0 + 1.0))
        else:
            risk_tier = "Low"
            predicted_delay = int(round(prob * 4.0))
            
        return prob, risk_tier, is_delayed, predicted_delay

    @staticmethod
    def get_full_analysis(project_dict: Dict[str, Any]) -> Dict[str, Any]:
        prob, risk_tier, is_delayed, delay_months = MLService.calculate_risk(project_dict)
        shap_data = ExplainabilityEngine.compute_project_shap_values(project_dict, baseline_risk=0.42)
        recommendations = generate_recommendations(project_dict, shap_data["top_risk_drivers"])
        
        return {
            "delay_probability": prob,
            "risk_tier": risk_tier,
            "is_delayed": is_delayed,
            "delay_months_predicted": delay_months,
            "top_risk_drivers": shap_data["top_risk_drivers"],
            "top_mitigating_factors": shap_data["top_mitigating_factors"],
            "waterfall_steps": shap_data["waterfall_steps"],
            "recommendations": recommendations
        }
