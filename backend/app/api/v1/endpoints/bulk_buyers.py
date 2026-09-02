from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.entities import User, UserRole, DemandPost, OrderMatch, ExpectedSupply, AvailableStock, SupplyStatus, StockStatus
from app.schemas.schemas import DemandPostResponse, OrderResponse, ExpectedSupplyResponse
from app.api.deps import require_roles

router = APIRouter()

@router.get("/me/demands", response_model=List[DemandPostResponse])
def get_buyer_demands(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.BULK_BUYER]))
):
    """
    Get all future bulk demand requirements posted by the bulk buyer.
    """
    return db.query(DemandPost).filter(
        (DemandPost.posted_by_user_id == current_user.id) & (DemandPost.is_bulk_demand == True)
    ).all()

@router.get("/me/orders", response_model=List[OrderResponse])
def get_buyer_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.BULK_BUYER]))
):
    """
    Get all confirmed bulk orders placed by buyer.
    """
    return db.query(OrderMatch).filter(OrderMatch.buyer_id == current_user.id).all()

@router.get("/discover-supplies", response_model=List[ExpectedSupplyResponse])
def discover_farmer_supplies_for_bulk(
    db: Session = Depends(get_db),
    crop_id: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    min_quantity_kg: Optional[float] = Query(None),
    current_user: User = Depends(require_roles([UserRole.BULK_BUYER, UserRole.ADMIN]))
):
    """
    Bulk Procurement Discovery: Search expected harvest declarations matching bulk volume requirements.
    """
    query = db.query(ExpectedSupply).filter(ExpectedSupply.status == SupplyStatus.DECLARED)
    if crop_id:
        query = query.filter(ExpectedSupply.crop_id == crop_id)
    if min_quantity_kg:
        query = query.filter(ExpectedSupply.expected_quantity_kg >= min_quantity_kg)
    if district:
        query = query.join(User, ExpectedSupply.farmer_id == User.id).filter(User.district.ilike(f"%{district}%"))

    return query.all()
