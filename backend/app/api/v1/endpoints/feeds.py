from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from app.db.session import get_db
from app.models.entities import DemandPost, ExpectedSupply, AvailableStock, Crop, DemandStatus, SupplyStatus, StockStatus
from app.core.config_rules import config_rules

router = APIRouter()

@router.get("/demand-feed")
def get_demand_feed(
    is_urban: bool = Query(False),
    crop_id: Optional[str] = Query(None),
    is_bulk_only: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Unified Demand Feed (Bulk Buyer Demands & Household Consumer Requirements).
    Filtered by Rural/Urban mode rules.
    """
    rules = config_rules.get_rules_for_mode(is_urban=is_urban)
    query = db.query(DemandPost).filter(DemandPost.status == DemandStatus.OPEN)

    if crop_id:
        query = query.filter(DemandPost.crop_id == crop_id)
    if is_bulk_only is not None:
        query = query.filter(DemandPost.is_bulk_demand == is_bulk_only)

    demands = query.order_by(DemandPost.created_at.desc()).all()

    return {
        "mode": rules["mode_name"],
        "max_search_radius_km": rules["max_search_radius_km"],
        "total_active_demands": len(demands),
        "items": [
            {
                "id": d.id,
                "posted_by_user_id": d.posted_by_user_id,
                "crop_id": d.crop_id,
                "is_bulk_demand": d.is_bulk_demand,
                "required_quantity_kg": d.required_quantity_kg,
                "max_price_per_kg": d.max_price_per_kg,
                "delivery_address": d.delivery_address,
                "delivery_latitude": d.delivery_latitude,
                "delivery_longitude": d.delivery_longitude,
                "target_delivery_date": str(d.target_delivery_date),
                "quality_requirement": d.quality_requirement.value if hasattr(d.quality_requirement, 'value') else str(d.quality_requirement),
                "status": d.status.value if hasattr(d.status, 'value') else str(d.status)
            }
            for d in demands
        ]
    }

@router.get("/supply-feed")
def get_supply_feed(
    is_urban: bool = Query(False),
    crop_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Unified Supply Feed (Expected Pre-Harvest Declarations & Available Post-Harvest Stock).
    Filtered by Rural/Urban mode rules.
    """
    rules = config_rules.get_rules_for_mode(is_urban=is_urban)
    
    sup_query = db.query(ExpectedSupply).filter(ExpectedSupply.status == SupplyStatus.DECLARED)
    stk_query = db.query(AvailableStock).filter(AvailableStock.status == StockStatus.AVAILABLE)

    if crop_id:
        sup_query = sup_query.filter(ExpectedSupply.crop_id == crop_id)
        stk_query = stk_query.filter(AvailableStock.crop_id == crop_id)

    supplies = sup_query.order_by(ExpectedSupply.created_at.desc()).all()
    stocks = stk_query.order_by(AvailableStock.created_at.desc()).all()

    return {
        "mode": rules["mode_name"],
        "max_search_radius_km": rules["max_search_radius_km"],
        "total_expected_supplies": len(supplies),
        "total_available_stocks": len(stocks),
        "expected_supplies": [
            {
                "id": s.id,
                "farmer_id": s.farmer_id,
                "crop_id": s.crop_id,
                "expected_quantity_kg": s.expected_quantity_kg,
                "expected_harvest_date": str(s.expected_harvest_date),
                "min_price_per_kg": s.min_price_per_kg,
                "farm_latitude": s.farm_latitude,
                "farm_longitude": s.farm_longitude,
                "quality_grade": s.quality_grade.value if hasattr(s.quality_grade, 'value') else str(s.quality_grade),
                "status": s.status.value if hasattr(s.status, 'value') else str(s.status)
            }
            for s in supplies
        ],
        "available_stocks": [
            {
                "id": st.id,
                "farmer_id": st.farmer_id,
                "crop_id": st.crop_id,
                "available_quantity_kg": st.available_quantity_kg,
                "harvest_date": str(st.harvest_date),
                "price_per_kg": st.price_per_kg,
                "location_latitude": st.location_latitude,
                "location_longitude": st.location_longitude,
                "shelf_life_remaining_days": st.shelf_life_remaining_days,
                "quality_grade": st.quality_grade.value if hasattr(st.quality_grade, 'value') else str(st.quality_grade),
                "status": st.status.value if hasattr(st.status, 'value') else str(st.status)
            }
            for st in stocks
        ]
    }

@router.get("/map-overview")
def get_regional_map_overview(db: Session = Depends(get_db)):
    """
    Regional Supply & Demand Coordinate Density Map Data.
    """
    demands = db.query(DemandPost).filter(DemandPost.status == DemandStatus.OPEN).all()
    supplies = db.query(ExpectedSupply).filter(ExpectedSupply.status == SupplyStatus.DECLARED).all()
    stocks = db.query(AvailableStock).filter(AvailableStock.status == StockStatus.AVAILABLE).all()

    demand_points = [
        {"id": d.id, "lat": d.delivery_latitude, "lng": d.delivery_longitude, "type": "DEMAND", "is_bulk": d.is_bulk_demand, "qty_kg": d.required_quantity_kg}
        for d in demands
    ]
    supply_points = [
        {"id": s.id, "lat": s.farm_latitude, "lng": s.farm_longitude, "type": "EXPECTED_SUPPLY", "qty_kg": s.expected_quantity_kg}
        for s in supplies
    ]
    stock_points = [
        {"id": st.id, "lat": st.location_latitude, "lng": st.location_longitude, "type": "CURRENT_STOCK", "qty_kg": st.available_quantity_kg}
        for st in stocks
    ]

    return {
        "total_active_points": len(demand_points) + len(supply_points) + len(stock_points),
        "demand_points": demand_points,
        "supply_points": supply_points,
        "stock_points": stock_points
    }
