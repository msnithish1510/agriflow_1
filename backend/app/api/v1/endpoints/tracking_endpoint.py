from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.db.session import get_db
from app.services.tracking_service import tracking_service

router = APIRouter()


class LocationUpdateRequest(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = None


class StatusUpdateRequest(BaseModel):
    status: str  # IN_TRANSIT, PICKED_UP, DELIVERED, etc.


@router.get("/shipments/active")
def get_active_shipments(db: Session = Depends(get_db)):
    """
    Get all active logistics shipments for Logistics & Admin tracking dashboards.
    """
    return tracking_service.get_all_active_shipments(db)


@router.get("/{tracking_id}")
def get_tracking_details(tracking_id: str, db: Session = Depends(get_db)):
    """
    Get complete order tracking details, route waypoints, ETA, delay info, and status history.
    """
    data = tracking_service.get_tracking(tracking_id, db)
    if not data:
        raise HTTPException(status_code=404, detail=f"Tracking shipment '{tracking_id}' not found.")
    return data


@router.get("/{tracking_id}/location")
def get_tracking_location(tracking_id: str, db: Session = Depends(get_db)):
    """
    Real-time polling endpoint returning latest vehicle lat/lng coordinates and status.
    """
    return tracking_service.get_location(tracking_id, db)


@router.post("/{tracking_id}/location")
def update_tracking_location(
    tracking_id: str,
    payload: LocationUpdateRequest,
    db: Session = Depends(get_db)
):
    """
    Update vehicle location (latitude, longitude, location_name) from delivery device or simulator.
    """
    return tracking_service.update_location(
        tracking_id=tracking_id,
        lat=payload.latitude,
        lng=payload.longitude,
        location_name=payload.location_name or "Updated Location",
        db=db
    )


@router.post("/{tracking_id}/status")
def update_tracking_status(
    tracking_id: str,
    payload: StatusUpdateRequest,
    db: Session = Depends(get_db)
):
    """
    Update shipment delivery status (e.g. READY_FOR_PICKUP -> PICKED_UP -> IN_TRANSIT -> DELIVERED).
    """
    return tracking_service.update_status(
        tracking_id=tracking_id,
        status_str=payload.status,
        db=db
    )
