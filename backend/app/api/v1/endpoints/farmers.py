from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.session import get_db
from app.models.entities import User, UserRole, ExpectedSupply, AvailableStock, OrderMatch
from app.schemas.schemas import ExpectedSupplyResponse, AvailableStockResponse, OrderResponse
from app.api.deps import require_roles

router = APIRouter()

@router.get("/me/supplies", response_model=List[ExpectedSupplyResponse])
def get_farmer_supplies(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.FARMER, UserRole.FPO]))
):
    """
    Get all expected harvest declarations created by the logged-in Farmer/FPO.
    """
    return db.query(ExpectedSupply).filter(ExpectedSupply.farmer_id == current_user.id).all()

@router.get("/me/stocks", response_model=List[AvailableStockResponse])
def get_farmer_stocks(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.FARMER, UserRole.FPO]))
):
    """
    Get all available current stocks listed by the logged-in Farmer/FPO.
    """
    return db.query(AvailableStock).filter(AvailableStock.farmer_id == current_user.id).all()

@router.get("/me/orders", response_model=List[OrderResponse])
def get_farmer_matched_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.FARMER, UserRole.FPO]))
):
    """
    Get all orders where the current Farmer/FPO is a participating supplier.
    """
    orders = db.query(OrderMatch).filter(
        OrderMatch.participating_farmer_ids.cast(String).contains(current_user.id)
    ).all()
    return orders

@router.get("/me/dashboard")
def get_farmer_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.FARMER, UserRole.FPO]))
):
    """
    Farmer / FPO Dashboard Overview Metrics: Total declared harvest, active stock, matched orders, estimated net earnings.
    """
    supplies = db.query(ExpectedSupply).filter(ExpectedSupply.farmer_id == current_user.id).all()
    stocks = db.query(AvailableStock).filter(AvailableStock.farmer_id == current_user.id).all()
    
    total_declared_kg = sum(s.expected_quantity_kg for s in supplies)
    total_stock_kg = sum(st.available_quantity_kg for st in stocks)

    return {
        "farmer_name": current_user.full_name,
        "role": current_user.role,
        "district": current_user.district,
        "state": current_user.state,
        "total_expected_declarations_count": len(supplies),
        "total_expected_quantity_kg": total_declared_kg,
        "total_current_stock_count": len(stocks),
        "total_available_stock_kg": total_stock_kg,
        "status": "ACTIVE_FARMER"
    }
