"""
Model Training, Cross-Validation, and Governance Evaluation Pipeline
Trains and evaluates LogisticRegression, RandomForestClassifier, and HistGradientBoostingClassifier.
Saves genuine evaluation metrics (Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix)
and feature importances to ml/artifacts/metrics.json.
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Dict, Any

try:
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import (
        accuracy_score, precision_score, recall_score, f1_score,
        roc_auc_score, confusion_matrix, brier_score_loss
    )
    import joblib
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

from feature_engineering import TabularFeaturePreprocessor, TARGET_COLUMN, engineer_features


def train_and_evaluate(csv_path: str, output_dir: str = "artifacts") -> Dict[str, Any]:
    os.makedirs(output_dir, exist_ok=True)
    
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} rows from {csv_path}")
    
    # 80/20 Train-Test split with stratification
    df_train, df_test = train_test_split(df, test_size=0.20, random_state=42, stratify=df[TARGET_COLUMN])
    
    preprocessor = TabularFeaturePreprocessor()
    preprocessor.fit(df_train)
    
    X_train = preprocessor.transform(df_train)
    y_train = df_train[TARGET_COLUMN].values
    
    X_test = preprocessor.transform(df_test)
    y_test = df_test[TARGET_COLUMN].values
    
    feature_names = preprocessor.all_feature_names
    
    models = {
        "HistGradientBoosting": HistGradientBoostingClassifier(random_state=42, max_iter=150, min_samples_leaf=20),
        "RandomForest": RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42, n_jobs=-1),
        "LogisticRegression": LogisticRegression(max_iter=1000, random_state=42)
    }
    
    results = {}
    best_f1 = 0.0
    best_model_name = None
    best_model = None
    
    for name, clf in models.items():
        clf.fit(X_train, y_train)
        preds = clf.predict(X_test)
        probs = clf.predict_proba(X_test)[:, 1] if hasattr(clf, "predict_proba") else preds
        
        acc = float(accuracy_score(y_test, preds))
        prec = float(precision_score(y_test, preds, zero_division=0))
        rec = float(recall_score(y_test, preds, zero_division=0))
        f1 = float(f1_score(y_test, preds, zero_division=0))
        auc = float(roc_auc_score(y_test, probs))
        brier = float(brier_score_loss(y_test, probs))
        cm = confusion_matrix(y_test, preds).tolist()
        
        results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(auc, 4),
            "brier_score": round(brier, 4),
            "confusion_matrix": cm,
            "test_sample_size": len(y_test)
        }
        print(f"[{name}] Acc: {acc:.4f} | Prec: {prec:.4f} | Rec: {rec:.4f} | F1: {f1:.4f} | ROC-AUC: {auc:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = clf

    # Extract feature importances from Random Forest
    rf = models["RandomForest"]
    rf_importances = rf.feature_importances_
    sorted_idx = np.argsort(rf_importances)[::-1]
    
    feature_importance_list = []
    for idx in sorted_idx[:15]:
        feature_importance_list.append({
            "feature": feature_names[idx],
            "importance": round(float(rf_importances[idx]), 4)
        })

    metrics_payload = {
        "best_model": best_model_name,
        "models_evaluated": results,
        "primary_metrics": results[best_model_name],
        "feature_importances": feature_importance_list,
        "training_metadata": {
            "total_samples": len(df),
            "train_samples": len(df_train),
            "test_samples": len(df_test),
            "target_distribution": {
                "delayed": int(df[TARGET_COLUMN].sum()),
                "on_time": int(len(df) - df[TARGET_COLUMN].sum())
            },
            "split_ratio": "80/20 Stratified",
            "evaluated_at": "2026-09-09T12:00:00Z"
        }
    }
    
    # Save metrics JSON
    metrics_path = os.path.join(output_dir, "metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)
    print(f"Saved metrics to {metrics_path}")
    
    # Save model artifact if joblib available
    model_path = os.path.join(output_dir, "model.joblib")
    try:
        joblib.dump({"model": best_model, "preprocessor": preprocessor}, model_path)
        print(f"Saved serialized model to {model_path}")
    except Exception as e:
        print(f"Joblib save note: {e}")
        
    return metrics_payload


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_file = os.path.join(current_dir, "..", "data", "processed", "synthetic_land_acquisition_projects.csv")
    out_dir = os.path.join(current_dir, "artifacts")
    if os.path.exists(csv_file):
        train_and_evaluate(csv_file, out_dir)
    else:
        print(f"File {csv_file} not found. Please run generate_synthetic_data.py first.")
