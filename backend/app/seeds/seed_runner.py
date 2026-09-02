import os
import sys
from datetime import date, timedelta
from app.db.session import engine, SessionLocal, Base
from app.models.entities import (
    User, Crop, DemandPost, ExpectedSupply, AvailableStock, OrderMatch, Notification,
    UserRole, QualityGrade, DemandStatus, SupplyStatus, StockStatus, MatchStatus, NotificationType
)
from app.core.security import get_password_hash
from app.seeds.seed_data import (
    CROPS_SEED, ADMIN_SEED, FARMERS_SEED, FPOS_SEED, BUYERS_SEED, CONSUMERS_SEED, LOGISTICS_SEED
)

def run_seed():
    print("[INIT] Initializing AGRIFlow Database Tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Crops
        print("[INFO] Seeding 8 Crops...")
        for c in CROPS_SEED:
            existing = db.query(Crop).filter(Crop.id == c["id"]).first()
            if not existing:
                crop = Crop(**c)
                db.add(crop)

        # 2. Seed Users (Admin, 20 Farmers, 5 FPOs, 10 Bulk Buyers, 30 Consumers, 10 Logistics)
        print("[INFO] Seeding Users (Admin, 20 Farmers, 5 FPOs, 10 Buyers, 30 Consumers, 10 Logistics)...")
        all_users = [ADMIN_SEED] + FARMERS_SEED + FPOS_SEED + BUYERS_SEED + CONSUMERS_SEED + LOGISTICS_SEED
        default_hash = get_password_hash("demo123")

        for u in all_users:
            existing = db.query(User).filter(User.id == u["id"]).first()
            if not existing:
                db_user = User(**u, hashed_password=default_hash)
                db.add(db_user)
        db.commit()

        # 3. Seed Expected Supplies (Farmer Pre-Harvest Declarations)
        print("[INFO] Seeding Expected Harvest Declarations...")
        farmers = db.query(User).filter(User.role.in_([UserRole.FARMER, UserRole.FPO])).all()
        crops = db.query(Crop).all()

        for idx, farmer in enumerate(farmers[:15]):
            crop = crops[idx % len(crops)]
            exp_date = date.today() + timedelta(days=15 + (idx * 2))
            
            existing_sup = db.query(ExpectedSupply).filter(
                (ExpectedSupply.farmer_id == farmer.id) & (ExpectedSupply.crop_id == crop.id)
            ).first()

            if not existing_sup:
                sup = ExpectedSupply(
                    farmer_id=farmer.id,
                    crop_id=crop.id,
                    expected_quantity_kg=10000.0 + (idx * 1500.0),
                    expected_harvest_date=exp_date,
                    min_price_per_kg=crop.indicative_base_price_per_kg * 0.95,
                    quality_grade=QualityGrade.GRADE_A,
                    farm_latitude=farmer.latitude,
                    farm_longitude=farmer.longitude,
                    status=SupplyStatus.DECLARED
                )
                db.add(sup)
        db.commit()

        # 4. Seed Available Current Stock
        print("[INFO] Seeding Available Post-Harvest Stock...")
        for idx, farmer in enumerate(farmers[5:18]):
            crop = crops[(idx + 2) % len(crops)]
            h_date = date.today() - timedelta(days=3 + idx)

            existing_stk = db.query(AvailableStock).filter(
                (AvailableStock.farmer_id == farmer.id) & (AvailableStock.crop_id == crop.id)
            ).first()

            if not existing_stk:
                stk = AvailableStock(
                    farmer_id=farmer.id,
                    crop_id=crop.id,
                    available_quantity_kg=5000.0 + (idx * 800.0),
                    price_per_kg=crop.indicative_base_price_per_kg,
                    harvest_date=h_date,
                    shelf_life_remaining_days=max(2, crop.shelf_life_days - (3 + idx)),
                    quality_grade=QualityGrade.GRADE_A if idx % 2 == 0 else QualityGrade.GRADE_B,
                    location_latitude=farmer.latitude,
                    location_longitude=farmer.longitude,
                    status=StockStatus.AVAILABLE
                )
                db.add(stk)
        db.commit()

        # 5. Seed Pre-Market Demands (Bulk Buyers & Consumers)
        print("[INFO] Seeding Future Demand Posts...")
        buyers = db.query(User).filter(User.role == UserRole.BULK_BUYER).all()
        consumers = db.query(User).filter(User.role == UserRole.CONSUMER).all()

        for idx, buyer in enumerate(buyers):
            crop = crops[idx % len(crops)]
            t_date = date.today() + timedelta(days=20 + idx)

            dem = DemandPost(
                posted_by_user_id=buyer.id,
                crop_id=crop.id,
                required_quantity_kg=25000.0 + (idx * 5000.0),
                max_price_per_kg=crop.indicative_base_price_per_kg * 1.10,
                target_delivery_date=t_date,
                quality_requirement=QualityGrade.GRADE_A,
                is_bulk_demand=True,
                delivery_address=f"{buyer.organization_name} Hub, {buyer.district}, {buyer.state}",
                delivery_latitude=buyer.latitude,
                delivery_longitude=buyer.longitude,
                status=DemandStatus.OPEN
            )
            db.add(dem)

        for idx, consumer in enumerate(consumers[:5]):
            crop = crops[idx % len(crops)]
            t_date = date.today() + timedelta(days=7 + idx)

            dem = DemandPost(
                posted_by_user_id=consumer.id,
                crop_id=crop.id,
                required_quantity_kg=50.0 + (idx * 20.0),
                max_price_per_kg=crop.indicative_base_price_per_kg * 1.15,
                target_delivery_date=t_date,
                quality_requirement=QualityGrade.GRADE_A,
                is_bulk_demand=False,
                delivery_address=f"Household #{idx+1}, {consumer.village_or_area}, {consumer.district}",
                delivery_latitude=consumer.latitude,
                delivery_longitude=consumer.longitude,
                status=DemandStatus.OPEN
            )
            db.add(dem)

        db.commit()

        # 6. Seed Sample Confirmed Orders & Notifications
        print("[INFO] Seeding Orders & In-App Notifications...")
        sample_buyer = buyers[0]
        sample_farmer = farmers[0]
        sample_crop = crops[0]

        order = OrderMatch(
            buyer_id=sample_buyer.id,
            matched_crop_id=sample_crop.id,
            total_matched_quantity_kg=25000.0,
            agreed_farmer_price_per_kg=24.50,
            total_amount_inr=25000.0 * 24.50,
            participating_farmer_ids=[
                {"farmer_id": sample_farmer.id, "farmer_name": sample_farmer.full_name, "allocated_quantity_kg": 10000.0, "price_per_kg": 24.0},
                {"farmer_id": farmers[1].id, "farmer_name": farmers[1].full_name, "allocated_quantity_kg": 15000.0, "price_per_kg": 24.5}
            ],
            match_score=96.4,
            status=MatchStatus.CONFIRMED
        )
        db.add(order)
        db.commit()
        db.refresh(order)

        notif = Notification(
            user_id=sample_farmer.id,
            title="Pre-Market Harvest Match Confirmed!",
            message=f"Buyer {sample_buyer.full_name} confirmed order for 10,000 kg Tomato at ₹24.00/kg.",
            notification_type=NotificationType.HARVEST_MATCH,
            related_entity_id=order.id
        )
        db.add(notif)
        db.commit()

        print("[SUCCESS] All Phase 2 Database Seeds Populated Successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Database seeding failed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
