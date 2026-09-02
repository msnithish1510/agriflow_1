from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import math
from app.db.session import get_db
from app.models.entities import DemandPost, Crop, User, UserRole, DemandStatus, QualityGrade
from app.schemas.schemas import DemandPostCreate, DemandPostUpdate, DemandPostResponse, PaginatedResponse
from app.api.deps import get_current_user, require_roles

router = APIRouter()

@router.post("/", response_model=DemandPostResponse, status_code=status.HTTP_201_CREATED)
def create_demand_post(
    demand_in: DemandPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.BULK_BUYER, UserRole.CONSUMER]))
):
    """
    Post Future Crop Requirements (Bulk Buyer or Consumer).
    """
    crop = db.query(Crop).filter(Crop.id == demand_in.crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Specified Crop ID not found")

    is_bulk = (current_user.role == UserRole.BULK_BUYER)

    db_demand = DemandPost(
        **demand_in.model_dump(exclude={"is_bulk_demand"}),
        posted_by_user_id=current_user.id,
        is_bulk_demand=is_bulk,
        status=DemandStatus.OPEN
    )
    db.add(db_demand)
    db.commit()
    db.refresh(db_demand)
    return db_demand

@router.get("/", response_model=PaginatedResponse[DemandPostResponse])
def list_demands(
    db: Session = Depends(get_db),
    crop_id: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    is_bulk: Optional[bool] = Query(None, description="Filter bulk buyer vs normal consumer demand"),
    quality_requirement: Optional[QualityGrade] = Query(None),
    status: Optional[DemandStatus] = Query(None),
    max_price: Optional[float] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    sort_by: str = Query("target_delivery_date", description="Field to sort by: target_delivery_date, max_price_per_kg, required_quantity_kg"),
    order: str = Query("asc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    """
    List pre-market future demand posts with filtering, sorting, and pagination.
    """
    query = db.query(DemandPost).join(User, DemandPost.posted_by_user_id == User.id)

    if crop_id:
        query = query.filter(DemandPost.crop_id == crop_id)
    if district:
        query = query.filter(User.district.ilike(f"%{district}%"))
    if is_bulk is not None:
        query = query.filter(DemandPost.is_bulk_demand == is_bulk)
    if quality_requirement:
        query = query.filter(DemandPost.quality_requirement == quality_requirement)
    if status:
        query = query.filter(DemandPost.status == status)
    if max_price is not None:
        query = query.filter(DemandPost.max_price_per_kg <= max_price)
    if start_date:
        query = query.filter(DemandPost.target_delivery_date >= start_date)
    if end_date:
        query = query.filter(DemandPost.target_delivery_date <= end_date)

    total = query.count()

    sort_attr = getattr(DemandPost, sort_by, DemandPost.target_delivery_date)
    query = query.order_by(sort_attr.desc() if order.lower() == "desc" else sort_attr.asc())

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

@router.get("/{demand_id}", response_model=DemandPostResponse)
def get_demand(demand_id: str, db: Session = Depends(get_db)):
    """
    Get demand post details.
    """
    demand = db.query(DemandPost).filter(DemandPost.id == demand_id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand post not found")
    return demand

@router.put("/{demand_id}", response_model=DemandPostResponse)
def update_demand(
    demand_id: str,
    demand_in: DemandPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.BULK_BUYER, UserRole.CONSUMER]))
):
    """
    Update demand post (Owner or Admin).
    """
    demand = db.query(DemandPost).filter(DemandPost.id == demand_id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand post not found")

    if demand.posted_by_user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="You can only update your own demand posts")

    update_data = demand_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(demand, field, value)

    db.commit()
    db.refresh(demand)
    return demand

@router.delete("/{demand_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_demand(
    demand_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.BULK_BUYER, UserRole.CONSUMER]))
):
    """
    Cancel demand post.
    """
    demand = db.query(DemandPost).filter(DemandPost.id == demand_id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand post not found")

    if demand.posted_by_user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="You can only cancel your own demand posts")

    demand.status = DemandStatus.CANCELLED
    db.commit()
    return None
