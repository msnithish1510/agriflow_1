from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import math
from app.db.session import get_db
from app.models.entities import ExpectedSupply, AvailableStock, Crop, User, UserRole, SupplyStatus, StockStatus, QualityGrade
from app.schemas.schemas import (
    ExpectedSupplyCreate, ExpectedSupplyUpdate, ExpectedSupplyResponse,
    AvailableStockCreate, AvailableStockUpdate, AvailableStockResponse,
    PaginatedResponse
)
from app.api.deps import get_current_user, require_roles
from app.services.gis_service import calculate_haversine_distance

router = APIRouter()

# ----------------------------------------------------
# 1. EXPECTED SUPPLY APIs (Pre-Market Declarations)
# ----------------------------------------------------

@router.post("/expected", response_model=ExpectedSupplyResponse, status_code=status.HTTP_201_CREATED)
def declare_expected_harvest(
    supply_in: ExpectedSupplyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.FARMER, UserRole.FPO]))
):
    """
    Farmer or FPO Pre-Market Expected Harvest Declaration.
    """
    crop = db.query(Crop).filter(Crop.id == supply_in.crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Specified Crop ID not found")

    db_supply = ExpectedSupply(
        **supply_in.model_dump(),
        farmer_id=current_user.id,
        status=SupplyStatus.DECLARED
    )
    db.add(db_supply)
    db.commit()
    db.refresh(db_supply)
    return db_supply

@router.get("/expected", response_model=PaginatedResponse[ExpectedSupplyResponse])
def list_expected_supplies(
    db: Session = Depends(get_db),
    crop_id: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    quality_grade: Optional[QualityGrade] = Query(None),
    status: Optional[SupplyStatus] = Query(None),
    harvest_start_date: Optional[date] = Query(None),
    harvest_end_date: Optional[date] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    sort_by: str = Query("expected_harvest_date", description="Field to sort by: expected_harvest_date, min_price_per_kg, expected_quantity_kg"),
    order: str = Query("asc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    """
    Query expected supply harvest declarations with filtering, sorting, and pagination.
    """
    query = db.query(ExpectedSupply).join(User, ExpectedSupply.farmer_id == User.id)

    if crop_id:
        query = query.filter(ExpectedSupply.crop_id == crop_id)
    if district:
        query = query.filter(User.district.ilike(f"%{district}%"))
    if state:
        query = query.filter(User.state.ilike(f"%{state}%"))
    if quality_grade:
        query = query.filter(ExpectedSupply.quality_grade == quality_grade)
    if status:
        query = query.filter(ExpectedSupply.status == status)
    if harvest_start_date:
        query = query.filter(ExpectedSupply.expected_harvest_date >= harvest_start_date)
    if harvest_end_date:
        query = query.filter(ExpectedSupply.expected_harvest_date <= harvest_end_date)
    if min_price is not None:
        query = query.filter(ExpectedSupply.min_price_per_kg >= min_price)
    if max_price is not None:
        query = query.filter(ExpectedSupply.min_price_per_kg <= max_price)

    total = query.count()

    sort_attr = getattr(ExpectedSupply, sort_by, ExpectedSupply.expected_harvest_date)
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

@router.get("/expected/{supply_id}", response_model=ExpectedSupplyResponse)
def get_expected_supply(supply_id: str, db: Session = Depends(get_db)):
    """
    Get expected supply declaration details.
    """
    supply = db.query(ExpectedSupply).filter(ExpectedSupply.id == supply_id).first()
    if not supply:
        raise HTTPException(status_code=404, detail="Expected supply record not found")
    return supply

@router.put("/expected/{supply_id}", response_model=ExpectedSupplyResponse)
def update_expected_supply(
    supply_id: str,
    supply_in: ExpectedSupplyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.FARMER, UserRole.FPO]))
):
    """
    Update expected supply declaration (Owner Farmer/FPO or Admin).
    """
    supply = db.query(ExpectedSupply).filter(ExpectedSupply.id == supply_id).first()
    if not supply:
        raise HTTPException(status_code=404, detail="Expected supply declaration not found")
    
    if supply.farmer_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="You can only update your own harvest declarations")

    update_data = supply_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(supply, field, value)

    db.commit()
    db.refresh(supply)
    return supply

@router.delete("/expected/{supply_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_expected_supply(
    supply_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.FARMER, UserRole.FPO]))
):
    """
    Cancel expected supply declaration.
    """
    supply = db.query(ExpectedSupply).filter(ExpectedSupply.id == supply_id).first()
    if not supply:
        raise HTTPException(status_code=404, detail="Expected supply declaration not found")
    
    if supply.farmer_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="You can only cancel your own harvest declarations")

    supply.status = SupplyStatus.CANCELLED
    db.commit()
    return None

# ----------------------------------------------------
# 2. AVAILABLE STOCK APIs (Current Harvest Fallback)
# ----------------------------------------------------

@router.post("/stock", response_model=AvailableStockResponse, status_code=status.HTTP_201_CREATED)
def list_available_stock(
    stock_in: AvailableStockCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.FARMER, UserRole.FPO]))
):
    """
    Farmer or FPO lists currently available post-harvest stock.
    """
    crop = db.query(Crop).filter(Crop.id == stock_in.crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Specified Crop ID not found")

    db_stock = AvailableStock(
        **stock_in.model_dump(),
        farmer_id=current_user.id,
        status=StockStatus.AVAILABLE
    )
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

@router.get("/stock", response_model=PaginatedResponse[AvailableStockResponse])
def list_available_stocks(
    db: Session = Depends(get_db),
    crop_id: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    quality_grade: Optional[QualityGrade] = Query(None),
    status: Optional[StockStatus] = Query(None),
    max_price: Optional[float] = Query(None),
    min_shelf_life_days: Optional[int] = Query(None),
    sort_by: str = Query("created_at", description="Field to sort by: price_per_kg, available_quantity_kg, shelf_life_remaining_days"),
    order: str = Query("desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    """
    Discover available post-harvest current stock with filtering, sorting, and pagination.
    """
    query = db.query(AvailableStock).join(User, AvailableStock.farmer_id == User.id)

    if crop_id:
        query = query.filter(AvailableStock.crop_id == crop_id)
    if district:
        query = query.filter(User.district.ilike(f"%{district}%"))
    if quality_grade:
        query = query.filter(AvailableStock.quality_grade == quality_grade)
    if status:
        query = query.filter(AvailableStock.status == status)
    if max_price is not None:
        query = query.filter(AvailableStock.price_per_kg <= max_price)
    if min_shelf_life_days is not None:
        query = query.filter(AvailableStock.shelf_life_remaining_days >= min_shelf_life_days)

    total = query.count()

    sort_attr = getattr(AvailableStock, sort_by, AvailableStock.created_at)
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

@router.get("/stock/{stock_id}", response_model=AvailableStockResponse)
def get_stock(stock_id: str, db: Session = Depends(get_db)):
    """
    Get stock item details.
    """
    stock = db.query(AvailableStock).filter(AvailableStock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock item not found")
    return stock

@router.put("/stock/{stock_id}", response_model=AvailableStockResponse)
def update_stock(
    stock_id: str,
    stock_in: AvailableStockUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.FARMER, UserRole.FPO]))
):
    """
    Update stock listing (Owner Farmer/FPO or Admin).
    """
    stock = db.query(AvailableStock).filter(AvailableStock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock item not found")

    if stock.farmer_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="You can only update your own stock listings")

    update_data = stock_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(stock, field, value)

    db.commit()
    db.refresh(stock)
    return stock
