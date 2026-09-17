"""
Feature Engineering Pipeline for Land Acquisition Delay Risk Prediction
Guarantees zero target leakage by fitting transformers strictly on the training partition.
"""

import numpy as np
import pandas as pd
from typing import Tuple, List, Dict, Any

NUMERICAL_FEATURES = [
    "total_land_required_ha",
    "private_land_ha",
    "government_land_ha",
    "forest_land_ha",
    "parcels_count",
    "owners_count",
    "budget_inr_cr",
    "compensation_disbursed_pct",
    "active_court_disputes",
    "cadastral_digitized_pct",
    "aadhaar_seeded_pct",
    "sia_objection_rate_pct",
    "rr_packages_pending_pct",
    "utility_shifting_pending",
    "collector_meetings_last_quarter",
    "target_duration_months",
    "elapsed_months",
    # Engineered features
    "dispute_density",
    "fragmentation_ratio",
    "progress_velocity",
    "forest_ratio",
    "digitization_gap"
]

CATEGORICAL_FEATURES = [
    "sector",
    "current_stage",
    "forest_clearance_status",
    "environment_clearance_status"
]

TARGET_COLUMN = "is_delayed"
AUX_REGRESSION_TARGET = "delay_months_predicted"


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute domain-specific risk indicators from raw features without leakage.
    """
    df_copy = df.copy()
    
    # Avoid division by zero
    parcels = df_copy["parcels_count"].replace(0, 1)
    total_land = df_copy["total_land_required_ha"].replace(0, 0.01)
    target_months = df_copy["target_duration_months"].replace(0, 1)
    
    # 1. Dispute density: Ratio of contested land parcels
    df_copy["dispute_density"] = (df_copy["active_court_disputes"] / parcels).clip(0.0, 2.0)
    
    # 2. Fragmentation ratio: Landowners per parcel
    df_copy["fragmentation_ratio"] = (df_copy["owners_count"] / parcels).clip(0.5, 10.0)
    
    # 3. Progress velocity: Ratio of elapsed timeline to total target duration
    df_copy["progress_velocity"] = (df_copy["elapsed_months"] / target_months).clip(0.05, 3.0)
    
    # 4. Forest ratio: Percentage of parcel requiring MoEFCC forest clearance
    df_copy["forest_ratio"] = (df_copy["forest_land_ha"] / total_land).clip(0.0, 1.0)
    
    # 5. Digitization gap: Untracked paper cadastral records
    df_copy["digitization_gap"] = (100.0 - df_copy["cadastral_digitized_pct"]).clip(0.0, 100.0)
    
    return df_copy


class TabularFeaturePreprocessor:
    """
    Lightweight, self-contained preprocessor that handles one-hot encoding,
    min-max scaling / z-score normalization, and can transform single project records for simulation.
    """
    def __init__(self):
        self.cat_categories: Dict[str, List[str]] = {}
        self.num_means: Dict[str, float] = {}
        self.num_stds: Dict[str, float] = {}
        self.all_feature_names: List[str] = []
        self.is_fitted = False

    def fit(self, df: pd.DataFrame):
        df_eng = engineer_features(df)
        
        # Fit numerical stats
        for col in NUMERICAL_FEATURES:
            self.num_means[col] = float(df_eng[col].mean())
            std = float(df_eng[col].std())
            self.num_stds[col] = std if std > 1e-6 else 1.0
            
        # Fit categorical categories
        for col in CATEGORICAL_FEATURES:
            cats = sorted(df_eng[col].dropna().unique().tolist())
            self.cat_categories[col] = cats
            
        # Build full feature list
        self.all_feature_names = list(NUMERICAL_FEATURES)
        for col in CATEGORICAL_FEATURES:
            for cat in self.cat_categories[col]:
                self.all_feature_names.append(f"{col}__{cat}")
                
        self.is_fitted = True
        return self

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        if not self.is_fitted:
            raise ValueError("Preprocessor has not been fitted.")
            
        df_eng = engineer_features(df)
        num_rows = len(df_eng)
        
        # Process numerical
        num_matrix = np.zeros((num_rows, len(NUMERICAL_FEATURES)), dtype=np.float32)
        for i, col in enumerate(NUMERICAL_FEATURES):
            val = df_eng[col].values if col in df_eng.columns else np.zeros(num_rows)
            mean = self.num_means[col]
            std = self.num_stds[col]
            num_matrix[:, i] = (val - mean) / std
            
        # Process categoricals (one-hot)
        cat_lists = []
        for col in CATEGORICAL_FEATURES:
            series = df_eng[col].fillna("Unknown")
            for cat in self.cat_categories[col]:
                cat_col = (series == cat).astype(np.float32).values.reshape(-1, 1)
                cat_lists.append(cat_col)
                
        if cat_lists:
            cat_matrix = np.hstack(cat_lists)
            return np.hstack([num_matrix, cat_matrix])
        return num_matrix

    def transform_dict(self, record: Dict[str, Any]) -> np.ndarray:
        df = pd.DataFrame([record])
        return self.transform(df)
