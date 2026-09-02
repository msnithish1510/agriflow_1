from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.db.session import get_db
from app.models.entities import OrderMatch, MatchStatus
from app.services.route_optimizer import route_optimizer_service

router = APIRouter()

class RouteOptimizationRequest(BaseModel):
    depot_location: Dict[str, float] = {"lat": 20.0, "lng": 73.8}
    pickup_farm_locations: List[Dict[str, Any]] = [
        {"farmer_id": "usr-farm-01", "lat": 20.1741, "lng": 73.9871, "qty_kg": 300.0},
        {"farmer_id": "usr-farm-02", "lat": 20.0768, "lng": 74.1082, "qty_kg": 250.0}
    ]
    drop_location: Dict[str, float] = {"lat": 18.6298, "lng": 73.8477}
    vehicle_capacity_kg: float = 10000.0
    perishability: str = "HIGH"

@router.post("/optimize-route")
def optimize_logistics_route(payload: RouteOptimizationRequest):
    """
    Computes multi-farmer pickup sequence, route waypoints, vehicle utilization, and transport freight cost
    using Google OR-Tools VRPTW Solver.
    """
    return route_optimizer_service.optimize_logistics_route(
        depot_location=payload.depot_location,
        pickup_farm_locations=payload.pickup_farm_locations,
        drop_location=payload.drop_location,
        vehicle_capacity_kg=payload.vehicle_capacity_kg,
        perishability=payload.perishability
    )

@router.get("/available-jobs")
def get_available_logistics_jobs(db: Session = Depends(get_db)):
    """
    Lists confirmed orders requiring logistics transport pickup.
    """
    orders = db.query(OrderMatch).filter(
        OrderMatch.status.in_([MatchStatus.CONFIRMED, MatchStatus.IN_TRANSIT])
    ).all()

    return [
        {
            "id": o.id,
            "matched_crop_id": o.matched_crop_id,
            "total_matched_quantity_kg": o.total_matched_quantity_kg,
            "agreed_farmer_price_per_kg": o.agreed_farmer_price_per_kg,
            "total_amount_inr": o.total_amount_inr,
            "participating_farmer_ids": o.participating_farmer_ids,
            "status": o.status.value if hasattr(o.status, 'value') else str(o.status),
            "created_at": str(o.created_at)
        }
        for o in orders
    ]

@router.post("/accept-job/{order_id}")
def accept_logistics_job(order_id: str, db: Session = Depends(get_db)):
    """
    Assigns transport delivery job to logistics partner and updates order status to IN_TRANSIT.
    """
    order = db.query(OrderMatch).filter(OrderMatch.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order match not found")

    order.status = MatchStatus.IN_TRANSIT
    db.commit()

    return {
        "status": "SUCCESS",
        "message": f"Logistics job accepted for Order #{order_id[:8]}",
        "order_status": "IN_TRANSIT"
    }

@router.patch("/update-status/{order_id}")
def update_shipment_status(order_id: str, status_value: str = Query("DELIVERED"), db: Session = Depends(get_db)):
    """
    Updates shipment status (IN_TRANSIT -> DELIVERED).
    """
    order = db.query(OrderMatch).filter(OrderMatch.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order match not found")

    if status_value.upper() == "DELIVERED":
        order.status = MatchStatus.DELIVERED
    elif status_value.upper() == "IN_TRANSIT":
        order.status = MatchStatus.IN_TRANSIT

    db.commit()

    return {
        "status": "SUCCESS",
        "message": f"Shipment status updated to {status_value.upper()}",
        "order_id": order_id
    }
