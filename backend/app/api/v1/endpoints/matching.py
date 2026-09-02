from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import date
from app.db.session import get_db
from app.models.entities import DemandPost, ExpectedSupply, AvailableStock, SupplyStatus, StockStatus, DemandStatus, Crop
from app.services.matching_engine import matching_engine
from app.services.proposal_service import proposal_service
from app.services.ranking_service import ranking_service
from app.services.aggregation_service import aggregation_service

router = APIRouter()

class DemandFirstRequest(BaseModel):
    demand_id: str
    max_radius_km: float = 150.0

class SupplyFirstRequest(BaseModel):
    supply_id: str
    is_expected_supply: bool = True
    max_radius_km: float = 150.0

class CustomAggregationRequest(BaseModel):
    required_quantity_kg: float
    candidate_ids: List[str]

@router.post("/demand-first")
def run_demand_first_matching(payload: DemandFirstRequest, db: Session = Depends(get_db)):
    """
    MODE 1: DEMAND-FIRST COORDINATION
    Ranks compatible pre-harvest declarations and current stocks, creating multi-farmer aggregated supply proposals.
    """
    demand = db.query(DemandPost).filter(DemandPost.id == payload.demand_id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand post not found")

    crop = db.query(Crop).filter(Crop.id == demand.crop_id).first()
    crop_name = crop.name if crop else "Crop"

    supplies = db.query(ExpectedSupply).filter(
        (ExpectedSupply.crop_id == demand.crop_id) & (ExpectedSupply.status == SupplyStatus.DECLARED)
    ).all()

    stocks = db.query(AvailableStock).filter(
        (AvailableStock.crop_id == demand.crop_id) & (AvailableStock.status == StockStatus.AVAILABLE)
    ).all()

    demand_dict = {
        "id": demand.id,
        "crop_id": demand.crop_id,
        "crop_name": crop_name,
        "required_quantity_kg": demand.required_quantity_kg,
        "max_price_per_kg": demand.max_price_per_kg,
        "delivery_latitude": demand.delivery_latitude,
        "delivery_longitude": demand.delivery_longitude,
        "target_delivery_date": demand.target_delivery_date,
        "quality_requirement": demand.quality_requirement.value if hasattr(demand.quality_requirement, 'value') else str(demand.quality_requirement)
    }

    supplies_list = [
        {
            "id": s.id,
            "farmer_id": s.farmer_id,
            "expected_quantity_kg": s.expected_quantity_kg,
            "expected_harvest_date": s.expected_harvest_date,
            "min_price_per_kg": s.min_price_per_kg,
            "farm_latitude": s.farm_latitude,
            "farm_longitude": s.farm_longitude,
            "quality_grade": s.quality_grade.value if hasattr(s.quality_grade, 'value') else str(s.quality_grade),
            "status": s.status.value if hasattr(s.status, 'value') else str(s.status)
        }
        for s in supplies
    ]

    stocks_list = [
        {
            "id": st.id,
            "farmer_id": st.farmer_id,
            "available_quantity_kg": st.available_quantity_kg,
            "harvest_date": st.harvest_date,
            "price_per_kg": st.price_per_kg,
            "location_latitude": st.location_latitude,
            "location_longitude": st.location_longitude,
            "quality_grade": st.quality_grade.value if hasattr(st.quality_grade, 'value') else str(st.quality_grade),
            "status": st.status.value if hasattr(st.status, 'value') else str(st.status)
        }
        for st in stocks
    ]

    return matching_engine.run_demand_first_coordination(
        demand=demand_dict,
        candidate_supplies=supplies_list,
        candidate_stocks=stocks_list,
        max_radius_km=payload.max_radius_km
    )

@router.post("/supply-first")
def run_supply_first_matching(payload: SupplyFirstRequest, db: Session = Depends(get_db)):
    """
    MODE 2: SUPPLY-FIRST COORDINATION
    Given a farmer harvest declaration or current stock item, finds and ranks compatible bulk buyer & consumer demands.
    """
    supply_dict = {}
    if payload.is_expected_supply:
        sup = db.query(ExpectedSupply).filter(ExpectedSupply.id == payload.supply_id).first()
        if not sup:
            raise HTTPException(status_code=404, detail="Expected supply declaration not found")
        crop_id = sup.crop_id
        supply_dict = {
            "id": sup.id,
            "farmer_id": sup.farmer_id,
            "expected_quantity_kg": sup.expected_quantity_kg,
            "expected_harvest_date": sup.expected_harvest_date,
            "min_price_per_kg": sup.min_price_per_kg,
            "farm_latitude": sup.farm_latitude,
            "farm_longitude": sup.farm_longitude,
            "quality_grade": sup.quality_grade.value if hasattr(sup.quality_grade, 'value') else str(sup.quality_grade),
            "status": sup.status.value if hasattr(sup.status, 'value') else str(sup.status)
        }
    else:
        stk = db.query(AvailableStock).filter(AvailableStock.id == payload.supply_id).first()
        if not stk:
            raise HTTPException(status_code=404, detail="Available stock item not found")
        crop_id = stk.crop_id
        supply_dict = {
            "id": stk.id,
            "farmer_id": stk.farmer_id,
            "available_quantity_kg": stk.available_quantity_kg,
            "harvest_date": stk.harvest_date,
            "price_per_kg": stk.price_per_kg,
            "location_latitude": stk.location_latitude,
            "location_longitude": stk.location_longitude,
            "quality_grade": stk.quality_grade.value if hasattr(stk.quality_grade, 'value') else str(stk.quality_grade),
            "status": stk.status.value if hasattr(stk.status, 'value') else str(stk.status)
        }

    demands = db.query(DemandPost).filter(
        (DemandPost.crop_id == crop_id) & (DemandPost.status == DemandStatus.OPEN)
    ).all()

    demands_list = [
        {
            "id": d.id,
            "posted_by_user_id": d.posted_by_user_id,
            "is_bulk_demand": d.is_bulk_demand,
            "required_quantity_kg": d.required_quantity_kg,
            "max_price_per_kg": d.max_price_per_kg,
            "delivery_latitude": d.delivery_latitude,
            "delivery_longitude": d.delivery_longitude,
            "target_delivery_date": d.target_delivery_date,
            "quality_requirement": d.quality_requirement.value if hasattr(d.quality_requirement, 'value') else str(d.quality_requirement),
            "status": d.status.value if hasattr(d.status, 'value') else str(d.status)
        }
        for d in demands
    ]

    return matching_engine.run_supply_first_coordination(
        supply=supply_dict,
        candidate_demands=demands_list,
        max_radius_km=payload.max_radius_km
    )

@router.get("/explain")
def get_match_explanation(
    required_qty: float = 1000.0,
    aggregated_qty: float = 1000.0,
    farmers_count: int = 4,
    avg_distance_km: float = 18.2,
    avg_price: float = 24.50,
    budget_price: float = 28.00,
    days_diff: int = 0,
    quality: str = "GRADE_A"
):
    """
    Exposes Natural Language Explanation Generator and audited scoring sub-metrics.
    """
    explanation = proposal_service.generate_explanation(
        required_qty=required_qty,
        aggregated_qty=aggregated_qty,
        farmers_count=farmers_count,
        avg_distance_km=avg_distance_km,
        avg_price_per_kg=avg_price,
        budget_max_price=budget_price,
        days_diff=days_diff,
        quality_grade=quality
    )

    return {
        "explanation": explanation,
        "scoring_weights": ranking_service.WEIGHTS,
        "metrics_evaluated": {
            "required_quantity_kg": required_qty,
            "aggregated_quantity_kg": aggregated_qty,
            "participating_farmers_count": farmers_count,
            "avg_distance_km": avg_distance_km,
            "avg_price_per_kg": avg_price,
            "budget_max_price": budget_price,
            "days_diff": days_diff,
            "quality_grade": quality
        }
    }
