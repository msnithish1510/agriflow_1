from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Generic, TypeVar
from datetime import date, datetime
from app.models.entities import UserRole, PerishabilityTier, QualityGrade, DemandStatus, SupplyStatus, StockStatus, MatchStatus, NotificationType

# Generic Pagination Wrapper
T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    total: int
    page: int
    page_size: int
    total_pages: int
    items: List[T]

# User Schemas
class UserBase(BaseModel):
    full_name: str
    phone_number: str
    email: Optional[str] = None
    role: UserRole
    organization_name: Optional[str] = None
    state: str
    district: str
    sub_district: Optional[str] = None
    village_or_area: str
    pincode: str
    latitude: float
    longitude: float

class UserCreate(UserBase):
    password: Optional[str] = "demo123"

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Auth Schemas
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    full_name: str
    user_id: str

# Crop Schemas
class CropBase(BaseModel):
    name: str
    local_name_hindi: Optional[str] = None
    category: str
    perishability: PerishabilityTier
    shelf_life_days: int
    standard_unit: str = "kg"
    indicative_base_price_per_kg: float

class CropCreate(CropBase):
    pass

class CropUpdate(BaseModel):
    name: Optional[str] = None
    local_name_hindi: Optional[str] = None
    category: Optional[str] = None
    perishability: Optional[PerishabilityTier] = None
    shelf_life_days: Optional[int] = None
    indicative_base_price_per_kg: Optional[float] = None

class CropResponse(CropBase):
    id: str
    class Config:
        from_attributes = True

# Demand Post Schemas
class DemandPostCreate(BaseModel):
    crop_id: str
    required_quantity_kg: float
    max_price_per_kg: float
    target_delivery_date: date
    quality_requirement: QualityGrade = QualityGrade.GRADE_A
    is_bulk_demand: bool = True
    delivery_address: str
    delivery_latitude: float
    delivery_longitude: float

class DemandPostUpdate(BaseModel):
    required_quantity_kg: Optional[float] = None
    max_price_per_kg: Optional[float] = None
    target_delivery_date: Optional[date] = None
    quality_requirement: Optional[QualityGrade] = None
    status: Optional[DemandStatus] = None

class DemandPostResponse(DemandPostCreate):
    id: str
    posted_by_user_id: str
    status: DemandStatus
    created_at: datetime
    class Config:
        from_attributes = True

# Expected Supply Schemas
class ExpectedSupplyCreate(BaseModel):
    crop_id: str
    expected_quantity_kg: float
    expected_harvest_date: date
    min_price_per_kg: float
    quality_grade: QualityGrade = QualityGrade.GRADE_A
    farm_latitude: float
    farm_longitude: float

class ExpectedSupplyUpdate(BaseModel):
    expected_quantity_kg: Optional[float] = None
    expected_harvest_date: Optional[date] = None
    min_price_per_kg: Optional[float] = None
    quality_grade: Optional[QualityGrade] = None
    status: Optional[SupplyStatus] = None

class ExpectedSupplyResponse(ExpectedSupplyCreate):
    id: str
    farmer_id: str
    status: SupplyStatus
    created_at: datetime
    class Config:
        from_attributes = True

# Available Stock Schemas
class AvailableStockCreate(BaseModel):
    crop_id: str
    available_quantity_kg: float
    price_per_kg: float
    harvest_date: date
    shelf_life_remaining_days: int
    quality_grade: QualityGrade = QualityGrade.GRADE_A
    location_latitude: float
    location_longitude: float

class AvailableStockUpdate(BaseModel):
    available_quantity_kg: Optional[float] = None
    price_per_kg: Optional[float] = None
    quality_grade: Optional[QualityGrade] = None
    status: Optional[StockStatus] = None

class AvailableStockResponse(AvailableStockCreate):
    id: str
    farmer_id: str
    status: StockStatus
    created_at: datetime
    class Config:
        from_attributes = True

# Order Schemas
class OrderCreate(BaseModel):
    demand_id: Optional[str] = None
    matched_crop_id: str
    total_quantity_kg: float
    agreed_price_per_kg: float
    participating_farmer_ids: List[Dict[str, Any]]
    match_score: float = 100.0

class OrderStatusUpdate(BaseModel):
    status: MatchStatus

class OrderResponse(BaseModel):
    id: str
    demand_id: Optional[str] = None
    buyer_id: str
    matched_crop_id: str
    total_matched_quantity_kg: float
    agreed_farmer_price_per_kg: float
    total_amount_inr: float
    participating_farmer_ids: List[Dict[str, Any]]
    match_score: float
    status: MatchStatus
    created_at: datetime
    class Config:
        from_attributes = True

# Notification Schemas
class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    notification_type: NotificationType = NotificationType.DEMAND_ALERT
    related_entity_id: Optional[str] = None

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    notification_type: NotificationType
    is_read: bool
    related_entity_id: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True
