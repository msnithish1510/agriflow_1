import os
import sys
import pickle
import numpy as np
import pandas as pd
from typing import Dict, Any

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), "..", "..")))

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error

try:
    import xgboost as xgb
    HAS_XGBOOST = True
except ImportError:
    from sklearn.ensemble import GradientBoostingRegressor
    HAS_XGBOOST = False

from app.ml.preprocessing import preprocessor

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "demand_forecast_model.pkl")

def calculate_mape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Calculates Mean Absolute Percentage Error (MAPE %)."""
    mask = y_true != 0
    return round(float(np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100.0), 2)

def train_demand_forecast_models() -> Dict[str, Any]:
    """
    Executes ML training pipeline comparing Baseline vs XGBoost models.
    Evaluates MAE, RMSE, and MAPE on validation split.
    """
    os.makedirs(MODEL_DIR, exist_ok=True)

    print("[ML] Generating historical agricultural demand dataset...")
    df = preprocessor.generate_historical_demand_dataset(num_days=365)
    X, y, meta = preprocessor.prepare_features(df)

    # Train / Validation Split (80% train, 20% validation)
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.20, random_state=42, shuffle=True)

    model_metrics = {}

    # 1. BASELINE MODEL 1: MOVING AVERAGE (7-day lag average)
    if "demand_lag_7" in X_val.columns:
        y_pred_ma = X_val["demand_lag_7"].values
    else:
        y_pred_ma = np.full_like(y_val.values, y_train.mean())

    mae_ma = round(float(mean_absolute_error(y_val, y_pred_ma)), 2)
    rmse_ma = round(float(np.sqrt(mean_squared_error(y_val, y_pred_ma))), 2)
    mape_ma = calculate_mape(y_val.values, y_pred_ma)

    model_metrics["Moving Average Baseline"] = {
        "model_type": "MOVING_AVERAGE",
        "MAE": mae_ma,
        "RMSE": rmse_ma,
        "MAPE": mape_ma
    }

    # 2. BASELINE MODEL 2: LINEAR REGRESSION
    lr_model = LinearRegression()
    lr_model.fit(X_train, y_train)
    y_pred_lr = lr_model.predict(X_val)

    mae_lr = round(float(mean_absolute_error(y_val, y_pred_lr)), 2)
    rmse_lr = round(float(np.sqrt(mean_squared_error(y_val, y_pred_lr))), 2)
    mape_lr = calculate_mape(y_val.values, y_pred_lr)

    model_metrics["Linear Regression"] = {
        "model_type": "LINEAR_REGRESSION",
        "MAE": mae_lr,
        "RMSE": rmse_lr,
        "MAPE": mape_lr
    }

    # 3. ADVANCED MODEL: XGBOOST / GRADIENT BOOSTING REGRESSOR
    if HAS_XGBOOST:
        xgb_model = xgb.XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42)
        xgb_model.fit(X_train, y_train)
        y_pred_xgb = xgb_model.predict(X_val)
        model_name = "XGBoost Regressor"
        best_regressor = xgb_model
        version_tag = "v1.0-xgb-demo"
    else:
        gb_model = GradientBoostingRegressor(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42)
        gb_model.fit(X_train, y_train)
        y_pred_xgb = gb_model.predict(X_val)
        model_name = "Gradient Boosting Regressor"
        best_regressor = gb_model
        version_tag = "v1.0-gb-demo"

    mae_xgb = round(float(mean_absolute_error(y_val, y_pred_xgb)), 2)
    rmse_xgb = round(float(np.sqrt(mean_squared_error(y_val, y_pred_xgb))), 2)
    mape_xgb = calculate_mape(y_val.values, y_pred_xgb)

    model_metrics[model_name] = {
        "model_type": "XGBOOST" if HAS_XGBOOST else "GRADIENT_BOOSTING",
        "MAE": mae_xgb,
        "RMSE": rmse_xgb,
        "MAPE": mape_xgb
    }

    # Model Selection Logic: Select best model by lowest RMSE
    best_model_name = min(model_metrics.keys(), key=lambda k: model_metrics[k]["RMSE"])
    best_metrics = model_metrics[best_model_name]

    print(f"[ML] Best Model Selected: {best_model_name} (RMSE: {best_metrics['RMSE']}, MAE: {best_metrics['MAE']}, MAPE: {best_metrics['MAPE']}%)")

    # Serialize Best Model Artifact
    artifact = {
        "model_name": best_model_name,
        "version": version_tag,
        "model_object": best_regressor if best_model_name != "Linear Regression" else lr_model,
        "feature_columns": meta["feature_columns"],
        "metrics": best_metrics,
        "comparison_metrics": model_metrics,
        "disclaimer": "Metrics evaluated on validation split. Synthetic/demo evaluation metrics -- production deployment requires live mandi market feeds."
    }

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(artifact, f)

    print(f"[ML] Serialized model artifact saved to {MODEL_PATH}")

    return artifact

if __name__ == "__main__":
    train_demand_forecast_models()
