import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, Integer, Numeric, Boolean, DateTime, Date, ForeignKey, Enum as SQLEnum, JSON, Text
from sqlalchemy.orm import relationship
import enum
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class UserRole(str, enum.Enum):
    FARMER = "FARMER"
    FPO = "FPO"
    BULK_BUYER = "BULK_BUYER"
    CONSUMER = "CONSUMER"
    LOGISTICS_PARTNER = "LOGISTICS_PARTNER"
    ADMIN = "ADMIN"

class PerishabilityTier(str, enum.Enum):
    HIGH = "HIGH"      # 1-5 days (e.g. Tomato)
    MEDIUM = "MEDIUM"  # 7-15 days (e.g. Onion, Potato)
    LOW = "LOW"        # 30+ days (e.g. Wheat, Grains)

class QualityGrade(str, enum.Enum):
    GRADE_A = "GRADE_A"
    GRADE_B = "GRADE_B"
    ORGANIC = "ORGANIC"
    EXPORT = "EXPORT"

class DemandStatus(str, enum.Enum):
    OPEN = "OPEN"
    PARTIALLY_MATCHED = "PARTIALLY_MATCHED"
    MATCHED = "MATCHED"
    FULFILLED = "FULFILLED"
    CANCELLED = "CANCELLED"

class SupplyStatus(str, enum.Enum):
    DECLARED = "DECLARED"
    MATCHED = "MATCHED"
    HARVESTED = "HARVESTED"
    CANCELLED = "CANCELLED"

class StockStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    SOLD = "SOLD"

class MatchStatus(str, enum.Enum):
    PROPOSED = "PROPOSED"
    CONFIRMED = "CONFIRMED"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class TrackingStatus(str, enum.Enum):
    ORDER_PLACED = "ORDER_PLACED"
    ORDER_CONFIRMED = "ORDER_CONFIRMED"
    FARMER_PREPARING = "FARMER_PREPARING"
    READY_FOR_PICKUP = "READY_FOR_PICKUP"
    PICKED_UP = "PICKED_UP"
    AT_COLLECTION_CENTER = "AT_COLLECTION_CENTER"
    IN_TRANSIT = "IN_TRANSIT"
    NEAR_DESTINATION = "NEAR_DESTINATION"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    DELIVERY_FAILED = "DELIVERY_FAILED"
    CANCELLED = "CANCELLED"

class NotificationType(str, enum.Enum):
    DEMAND_ALERT = "DEMAND_ALERT"
    HARVEST_MATCH = "HARVEST_MATCH"
    ORDER_UPDATE = "ORDER_UPDATE"
    PRICE_ALERT = "PRICE_ALERT"
    LOGISTICS_DISPATCH = "LOGISTICS_DISPATCH"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    full_name = Column(String(120), nullable=False)
    phone_number = Column(String(15), unique=True, nullable=False)
    email = Column(String(120), nullable=True)
    hashed_password = Column(String(255), nullable=True)
    role = Column(SQLEnum(UserRole), nullable=False)
    organization_name = Column(String(150), nullable=True)
    state = Column(String(80), nullable=False)
    district = Column(String(80), nullable=False)
    sub_district = Column(String(80), nullable=True)
    village_or_area = Column(String(120), nullable=False)
    pincode = Column(String(10), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    expected_supplies = relationship("ExpectedSupply", back_populates="farmer", cascade="all, delete-orphan")
    available_stocks = relationship("AvailableStock", back_populates="farmer", cascade="all, delete-orphan")
    demand_posts = relationship("DemandPost", back_populates="posted_by", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Crop(Base):
    __tablename__ = "crops"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(80), unique=True, nullable=False)
    local_name_hindi = Column(String(80), nullable=True)
    category = Column(String(60), nullable=False)
    perishability = Column(SQLEnum(PerishabilityTier), nullable=False)
    shelf_life_days = Column(Integer, nullable=False)
    standard_unit = Column(String(20), default="kg")
    indicative_base_price_per_kg = Column(Float, nullable=False)

    expected_supplies = relationship("ExpectedSupply", back_populates="crop")
    available_stocks = relationship("AvailableStock", back_populates="crop")
    demand_posts = relationship("DemandPost", back_populates="crop")

class DemandPost(Base):
    __tablename__ = "demand_posts"
    id = Column(String, primary_key=True, default=generate_uuid)
    posted_by_user_id = Column(String, ForeignKey("users.id"), nullable=False)
    crop_id = Column(String, ForeignKey("crops.id"), nullable=False)
    required_quantity_kg = Column(Float, nullable=False)
    max_price_per_kg = Column(Float, nullable=False)
    target_delivery_date = Column(Date, nullable=False)
    quality_requirement = Column(SQLEnum(QualityGrade), default=QualityGrade.GRADE_A)
    is_bulk_demand = Column(Boolean, default=True)
    delivery_address = Column(Text, nullable=False)
    delivery_latitude = Column(Float, nullable=False)
    delivery_longitude = Column(Float, nullable=False)
    status = Column(SQLEnum(DemandStatus), default=DemandStatus.OPEN)
    created_at = Column(DateTime, default=datetime.utcnow)

    posted_by = relationship("User", back_populates="demand_posts")
    crop = relationship("Crop", back_populates="demand_posts")
    matches = relationship("OrderMatch", back_populates="demand")

class ExpectedSupply(Base):
    __tablename__ = "expected_supplies"
    id = Column(String, primary_key=True, default=generate_uuid)
    farmer_id = Column(String, ForeignKey("users.id"), nullable=False)
    crop_id = Column(String, ForeignKey("crops.id"), nullable=False)
    expected_quantity_kg = Column(Float, nullable=False)
    expected_harvest_date = Column(Date, nullable=False)
    min_price_per_kg = Column(Float, nullable=False)
    quality_grade = Column(SQLEnum(QualityGrade), default=QualityGrade.GRADE_A)
    farm_latitude = Column(Float, nullable=False)
    farm_longitude = Column(Float, nullable=False)
    status = Column(SQLEnum(SupplyStatus), default=SupplyStatus.DECLARED)
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("User", back_populates="expected_supplies")
    crop = relationship("Crop", back_populates="expected_supplies")

class AvailableStock(Base):
    __tablename__ = "available_stocks"
    id = Column(String, primary_key=True, default=generate_uuid)
    farmer_id = Column(String, ForeignKey("users.id"), nullable=False)
    crop_id = Column(String, ForeignKey("crops.id"), nullable=False)
    available_quantity_kg = Column(Float, nullable=False)
    price_per_kg = Column(Float, nullable=False)
    harvest_date = Column(Date, nullable=False)
    shelf_life_remaining_days = Column(Integer, nullable=False)
    quality_grade = Column(SQLEnum(QualityGrade), default=QualityGrade.GRADE_A)
    location_latitude = Column(Float, nullable=False)
    location_longitude = Column(Float, nullable=False)
    status = Column(SQLEnum(StockStatus), default=StockStatus.AVAILABLE)
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("User", back_populates="available_stocks")
    crop = relationship("Crop", back_populates="available_stocks")

class OrderMatch(Base):
    __tablename__ = "order_matches"
    id = Column(String, primary_key=True, default=generate_uuid)
    demand_id = Column(String, ForeignKey("demand_posts.id"), nullable=True)
    buyer_id = Column(String, ForeignKey("users.id"), nullable=False)
    matched_crop_id = Column(String, ForeignKey("crops.id"), nullable=False)
    total_matched_quantity_kg = Column(Float, nullable=False)
    agreed_farmer_price_per_kg = Column(Float, nullable=False)
    total_amount_inr = Column(Float, nullable=False)
    participating_farmer_ids = Column(JSON, nullable=False) # List of dicts {farmer_id, allocated_kg, supply_id/stock_id}
    match_score = Column(Float, default=100.0)
    status = Column(SQLEnum(MatchStatus), default=MatchStatus.PROPOSED)
    created_at = Column(DateTime, default=datetime.utcnow)

    demand = relationship("DemandPost", back_populates="matches")
    crop = relationship("Crop")
    buyer = relationship("User", foreign_keys=[buyer_id])

class PriceBreakdown(Base):
    __tablename__ = "price_breakdowns"
    id = Column(String, primary_key=True, default=generate_uuid)
    match_id = Column(String, ForeignKey("order_matches.id"), nullable=True)
    crop_id = Column(String, ForeignKey("crops.id"), nullable=False)
    farmer_price_per_kg = Column(Float, nullable=False)
    collection_handling_fee = Column(Float, nullable=False)
    transport_fee_per_kg = Column(Float, nullable=False)
    market_intermediary_margin = Column(Float, default=0.0)
    platform_coordination_fee = Column(Float, nullable=False)
    final_consumer_price_per_kg = Column(Float, nullable=False)
    farmer_net_realization_per_kg = Column(Float, nullable=False)

class ShipmentRoute(Base):
    __tablename__ = "shipment_routes"
    id = Column(String, primary_key=True, default=generate_uuid)
    match_id = Column(String, ForeignKey("order_matches.id"), nullable=False)
    logistics_partner_id = Column(String, ForeignKey("users.id"), nullable=True)
    pickup_waypoints = Column(JSON, nullable=False)
    drop_waypoint = Column(JSON, nullable=False)
    total_distance_km = Column(Float, nullable=False)
    estimated_transit_hours = Column(Float, nullable=False)
    route_status = Column(String, default="SCHEDULED")
    created_at = Column(DateTime, default=datetime.utcnow)

class ShipmentTracking(Base):
    __tablename__ = "shipment_trackings"
    id = Column(String, primary_key=True, default=generate_uuid)
    tracking_id = Column(String(50), unique=True, nullable=False)
    order_id = Column(String, ForeignKey("order_matches.id"), nullable=True)
    farmer_id = Column(String, ForeignKey("users.id"), nullable=True)
    buyer_id = Column(String, ForeignKey("users.id"), nullable=True)
    logistics_partner_id = Column(String, ForeignKey("users.id"), nullable=True)

    farmer_name = Column(String(120), nullable=True)
    buyer_name = Column(String(120), nullable=True)
    crop_name = Column(String(80), nullable=True)
    quantity_kg = Column(Float, default=500.0)

    pickup_location = Column(JSON, nullable=False)
    destination_location = Column(JSON, nullable=False)
    current_latitude = Column(Float, nullable=False)
    current_longitude = Column(Float, nullable=False)
    current_location_name = Column(String(150), nullable=False)

    route = Column(JSON, nullable=False)
    distance_remaining_km = Column(Float, default=45.0)
    estimated_transit_minutes = Column(Integer, default=55)
    expected_delivery_time = Column(DateTime, nullable=True)

    current_status = Column(SQLEnum(TrackingStatus), default=TrackingStatus.IN_TRANSIT)
    driver_name = Column(String(100), default="Murugan Logistics (TN-37-AZ-4421)")
    vehicle_number = Column(String(50), default="TN-37-AZ-4421")

    history = Column(JSON, default=list)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    notification_type = Column(SQLEnum(NotificationType), default=NotificationType.ORDER_UPDATE)
    is_read = Column(Boolean, default=False)
    related_entity_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class DemandForecast(Base):
    __tablename__ = "demand_forecasts"
    id = Column(String, primary_key=True, default=generate_uuid)
    crop_id = Column(String, ForeignKey("crops.id"), nullable=False)
    district = Column(String, nullable=False)
    forecast_date = Column(Date, nullable=False)
    predicted_demand_kg = Column(Float, nullable=False)
    confidence_min_kg = Column(Float, nullable=False)
    confidence_max_kg = Column(Float, nullable=False)
    model_version = Column(String, default="v1.0-xgb-demo")
    evaluation_mae = Column(Float, nullable=True)
    evaluation_rmse = Column(Float, nullable=True)
    evaluation_mape = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    crop = relationship("Crop")
