from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import math
from app.db.session import get_db
from app.models.entities import Crop, User, UserRole, PerishabilityTier
from app.schemas.schemas import CropCreate, CropUpdate, CropResponse, PaginatedResponse
from app.api.deps import get_current_user, require_roles

router = APIRouter()

@router.get("/", response_model=PaginatedResponse[CropResponse])
def list_crops(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None, description="Filter by crop category (e.g. Vegetable, Grains)"),
    perishability: Optional[PerishabilityTier] = Query(None, description="Filter by perishability tier"),
    search: Optional[str] = Query(None, description="Search crop name"),
    sort_by: str = Query("name", description="Field to sort by: name, indicative_base_price_per_kg, shelf_life_days"),
    order: str = Query("asc", description="Sort order: asc or desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    """
    List supported agricultural crops with filtering, sorting, and pagination.
    """
    query = db.query(Crop)
    
    if category:
        query = query.filter(Crop.category.ilike(f"%{category}%"))
    if perishability:
        query = query.filter(Crop.perishability == perishability)
    if search:
        query = query.filter(
            (Crop.name.ilike(f"%{search}%")) | (Crop.local_name_hindi.ilike(f"%{search}%"))
        )

    total = query.count()

    # Sorting
    sort_attr = getattr(Crop, sort_by, Crop.name)
    if order.lower() == "desc":
        query = query.order_by(sort_attr.desc())
    else:
        query = query.order_by(sort_attr.asc())

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

@router.get("/{crop_id}", response_model=CropResponse)
def get_crop(crop_id: str, db: Session = Depends(get_db)):
    """
    Get crop details by ID.
    """
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

@router.post("/", response_model=CropResponse, status_code=status.HTTP_201_CREATED)
def create_crop(
    crop_in: CropCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles([UserRole.ADMIN]))
):
    """
    Create a new Crop in system catalog (Admin only).
    """
    existing = db.query(Crop).filter(Crop.name == crop_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Crop with this name already exists")
    
    db_crop = Crop(**crop_in.model_dump())
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.put("/{crop_id}", response_model=CropResponse)
def update_crop(
    crop_id: str,
    crop_in: CropUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles([UserRole.ADMIN]))
):
    """
    Update Crop details (Admin only).
    """
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    update_data = crop_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(crop, field, value)

    db.commit()
    db.refresh(crop)
    return crop
