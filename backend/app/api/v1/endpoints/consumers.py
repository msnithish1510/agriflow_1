from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.entities import User, UserRole, DemandPost, OrderMatch, Crop, MatchStatus
from app.schemas.schemas import DemandPostResponse, OrderResponse, OrderCreate
from app.api.deps import require_roles

router = APIRouter()

@router.get("/me/demands", response_model=List[DemandPostResponse])
def get_consumer_demands(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.CONSUMER]))
):
    """
    Get direct requirement posts declared by normal household consumer.
    """
    return db.query(DemandPost).filter(
        (DemandPost.posted_by_user_id == current_user.id) & (DemandPost.is_bulk_demand == False)
    ).all()

@router.get("/me/orders", response_model=List[OrderResponse])
def get_consumer_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.CONSUMER]))
):
    """
    Get direct orders placed by consumer to local farmers.
    """
    return db.query(OrderMatch).filter(OrderMatch.buyer_id == current_user.id).all()

@router.post("/direct-order", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_direct_consumer_order(
    farmer_id: str,
    crop_id: str,
    quantity_kg: float,
    agreed_price_per_kg: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.CONSUMER]))
):
    """
    Rural Model: Consumer places direct purchase order from nearby farmer.
    """
    farmer = db.query(User).filter((User.id == farmer_id) & (User.role.in_([UserRole.FARMER, UserRole.FPO]))).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    total_amount = round(quantity_kg * agreed_price_per_kg, 2)

    db_order = OrderMatch(
        buyer_id=current_user.id,
        matched_crop_id=crop_id,
        total_matched_quantity_kg=quantity_kg,
        agreed_farmer_price_per_kg=agreed_price_per_kg,
        total_amount_inr=total_amount,
        participating_farmer_ids=[{
            "farmer_id": farmer.id,
            "farmer_name": farmer.full_name,
            "allocated_quantity_kg": quantity_kg,
            "price_per_kg": agreed_price_per_kg
        }],
        match_score=100.0,
        status=MatchStatus.CONFIRMED
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order
