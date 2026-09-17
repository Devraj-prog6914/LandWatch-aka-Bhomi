from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class FeatureImportanceItem(BaseModel):
    feature: str
    display_name: Optional[str] = None
    importance: float


class ModelEvaluationMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    brier_score: float
    confusion_matrix: List[List[int]]
    test_sample_size: int


class ModelGovernanceOut(BaseModel):
    best_model: str
    primary_metrics: ModelEvaluationMetrics
    models_evaluated: Dict[str, Any]
    feature_importances: List[FeatureImportanceItem]
    training_metadata: Dict[str, Any]


class RetrainResponse(BaseModel):
    status: str
    message: str
    new_metrics: Dict[str, Any]
    retrained_at: str
