from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from typing import Optional, List, Dict, Any
from app.db.session import get_db
from app.models.entities import DemandForecast, Crop
from app.services.ai_forecasting import ai_forecasting_service
from app.ml.train_demand_forecast import train_demand_forecast_models

router = APIRouter()

@router.post("/train-model")
def trigger_ml_model_training():
    """
    Triggers AI Demand Forecasting ML Training Pipeline.
    Trains Baseline (Moving Average, Linear Regression) vs XGBoost/Gradient Boosting models,
    evaluates MAE, RMSE, and MAPE on validation split, selects best model, and serializes artifact.
    """
    try:
        artifact = train_demand_forecast_models()
        # Reload service artifact
        ai_forecasting_service._load_model_artifact()
        return {
            "status": "SUCCESS",
            "message": "ML training pipeline completed successfully.",
            "selected_best_model": artifact["model_name"],
            "model_version": artifact["version"],
            "validation_metrics": artifact["metrics"],
            "all_compared_models": artifact["comparison_metrics"],
            "disclaimer": artifact["disclaimer"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML training failed: {str(e)}")

@router.get("/demand-forecast")
def get_crop_demand_forecast(
    crop_name: str = Query("Tomato"),
    district: str = Query("Nashik"),
    forecast_days_ahead: int = Query(15, ge=1, le=90),
    db: Session = Depends(get_db)
):
    """
    Generates AI Demand Forecast with confidence interval bounds, trend direction, model version, and evaluation metrics.
    """
    target_date = date.today() + timedelta(days=forecast_days_ahead)
    return ai_forecasting_service.get_forecast_for_crop_district(
        crop_name=crop_name,
        district=district,
        target_date=target_date,
        db=db
    )

@router.get("/forecast-history")
def get_forecast_history(
    crop_name: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Retrieves history of persisted AI demand forecasts.
    """
    query = db.query(DemandForecast)
    if crop_name:
        crop = db.query(Crop).filter(Crop.name == crop_name).first()
        if crop:
            query = query.filter(DemandForecast.crop_id == crop.id)
    if district:
        query = query.filter(DemandForecast.district == district)

    records = query.order_by(DemandForecast.created_at.desc()).limit(limit).all()

    return [
        {
            "id": r.id,
            "crop_id": r.crop_id,
            "district": r.district,
            "forecast_date": str(r.forecast_date),
            "predicted_demand_kg": r.predicted_demand_kg,
            "confidence_min_kg": r.confidence_min_kg,
            "confidence_max_kg": r.confidence_max_kg,
            "model_version": r.model_version,
            "evaluation_metrics": {
                "MAE": r.evaluation_mae,
                "RMSE": r.evaluation_rmse,
                "MAPE": r.evaluation_mape
            },
            "created_at": str(r.created_at)
        }
        for r in records
    ]
