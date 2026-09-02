from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import math
from app.db.session import get_db
from app.models.entities import OrderMatch, DemandPost, Crop, User, UserRole, MatchStatus, Notification, NotificationType
from app.schemas.schemas import OrderCreate, OrderStatusUpdate, OrderResponse, PaginatedResponse
from app.api.deps import get_current_user, require_roles

router = APIRouter()

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.BULK_BUYER, UserRole.CONSUMER]))
):
    """
    Create a new OrderMatch / Purchase Order from pre-market demand matching or direct stock purchase.
    """
    crop = db.query(Crop).filter(Crop.id == order_in.matched_crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    total_amount = round(order_in.total_quantity_kg * order_in.agreed_price_per_kg, 2)

    db_order = OrderMatch(
        demand_id=order_in.demand_id,
        buyer_id=current_user.id,
        matched_crop_id=order_in.matched_crop_id,
        total_matched_quantity_kg=order_in.total_quantity_kg,
        agreed_farmer_price_per_kg=order_in.agreed_price_per_kg,
        total_amount_inr=total_amount,
        participating_farmer_ids=order_in.participating_farmer_ids,
        match_score=order_in.match_score,
        status=MatchStatus.CONFIRMED
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Notify participating farmers/FPOs
    for item in order_in.participating_farmer_ids:
        farmer_id = item.get("farmer_id")
        if farmer_id:
            notif = Notification(
                user_id=farmer_id,
                title="New Order Match Confirmed",
                message=f"Buyer {current_user.full_name} confirmed order for {item.get('allocated_quantity_kg', 0)} kg {crop.name} at Rs.{order_in.agreed_price_per_kg}/kg.",
                notification_type=NotificationType.ORDER_UPDATE,
                related_entity_id=db_order.id
            )
            db.add(notif)
    db.commit()

    return db_order

@router.get("/", response_model=PaginatedResponse[OrderResponse])
def list_user_orders(
    db: Session = Depends(get_db),
    status: Optional[MatchStatus] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user)
):
    """
    List orders scoped to current user role (Buyer purchases, Farmer supply orders, Logistics jobs, or Admin view).
    """
    query = db.query(OrderMatch)

    if current_user.role in [UserRole.BULK_BUYER, UserRole.CONSUMER]:
        query = query.filter(OrderMatch.buyer_id == current_user.id)
    elif current_user.role in [UserRole.FARMER, UserRole.FPO]:
        # JSON field query for farmer_id
        query = query.filter(OrderMatch.participating_farmer_ids.cast(String).contains(current_user.id))
    elif current_user.role == UserRole.LOGISTICS_PARTNER:
        # All confirmed or in-transit orders available for logistics
        pass
    
    if status:
        query = query.filter(OrderMatch.status == status)

    total = query.count()
    query = query.order_by(OrderMatch.created_at.desc())

    skip = (page - 1) * page_size
    items = query.offset(skip).limit(page_size).all()
    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "items": items
    }

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_details(order_id: str, db: Session = Depends(get_db)):
    """
    Get detailed order match summary.
    """
    order = db.query(OrderMatch).filter(OrderMatch.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update order status transitions (CONFIRMED -> IN_TRANSIT -> DELIVERED -> CANCELLED).
    """
    order = db.query(OrderMatch).filter(OrderMatch.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    old_status = order.status
    order.status = status_update.status
    db.commit()
    db.refresh(order)

    # Notify buyer and farmers
    buyer_notif = Notification(
        user_id=order.buyer_id,
        title=f"Order Status Updated to {status_update.status.value}",
        message=f"Order #{order.id[:8]} status changed from {old_status.value} to {status_update.status.value}.",
        notification_type=NotificationType.ORDER_UPDATE,
        related_entity_id=order.id
    )
    db.add(buyer_notif)
    db.commit()

    return order
