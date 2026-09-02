import unittest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.db.session import Base, get_db
from app.models.entities import User, Crop, UserRole, PerishabilityTier, QualityGrade
from app.core.security import get_password_hash
from app.seeds.seed_runner import run_seed

class TestAGRIFlowBackendAPIs(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n[TEST] Running AGRIFlow Phase 2 API Test Suite...")
        # Run database seed to initialize tables and sample data
        run_seed()
        cls.client = TestClient(app)

    def test_01_health_check(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ONLINE")

    def test_02_crop_catalog_crud_and_pagination(self):
        # List crops with pagination
        res = self.client.get("/api/v1/crops/?page=1&page_size=5")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("items", data)
        self.assertGreaterEqual(data["total"], 8)
        self.assertEqual(len(data["items"]), 5)

        # Filter by category
        res_filter = self.client.get("/api/v1/crops/?category=Vegetable")
        self.assertEqual(res_filter.status_code, 200)
        items = res_filter.json()["items"]
        for c in items:
            self.assertEqual(c["category"], "Vegetable")

    def test_03_auth_login_and_me(self):
        # Login using seed farmer
        login_res = self.client.post("/api/v1/auth/login", data={"username": "+91-9823011101", "password": "demo123"})
        self.assertEqual(login_res.status_code, 200)
        token_data = login_res.json()
        self.assertIn("access_token", token_data)
        self.assertEqual(token_data["role"], "FARMER")

        # Access /me endpoint using JWT token
        headers = {"Authorization": f"Bearer {token_data['access_token']}"}
        me_res = self.client.get("/api/v1/auth/me", headers=headers)
        self.assertEqual(me_res.status_code, 200)
        user_info = me_res.json()
        self.assertEqual(user_info["phone_number"], "+91-9823011101")
        self.assertEqual(user_info["role"], "FARMER")

    def test_04_expected_supply_and_stock_apis(self):
        # Login as farmer
        token = self.client.post("/api/v1/auth/login", data={"username": "+91-9823011101", "password": "demo123"}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Fetch crops to get valid ID
        crop_id = self.client.get("/api/v1/crops/").json()["items"][0]["id"]

        # Declare expected harvest
        supply_payload = {
            "crop_id": crop_id,
            "expected_quantity_kg": 15000.0,
            "expected_harvest_date": "2026-09-25",
            "min_price_per_kg": 24.50,
            "quality_grade": "GRADE_A",
            "farm_latitude": 20.1741,
            "farm_longitude": 73.9871
        }
        sup_res = self.client.post("/api/v1/supplies/expected", json=supply_payload, headers=headers)
        self.assertEqual(sup_res.status_code, 201)
        sup_data = sup_res.json()
        self.assertEqual(sup_data["expected_quantity_kg"], 15000.0)

        # Query expected supplies with filtering
        list_res = self.client.get(f"/api/v1/supplies/expected?crop_id={crop_id}&district=Nashik")
        self.assertEqual(list_res.status_code, 200)
        self.assertGreater(list_res.json()["total"], 0)

    def test_05_demand_post_apis(self):
        # Login as bulk buyer
        token = self.client.post("/api/v1/auth/login", data={"username": "+91-9800033001", "password": "demo123"}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        crop_id = self.client.get("/api/v1/crops/").json()["items"][0]["id"]

        demand_payload = {
            "crop_id": crop_id,
            "required_quantity_kg": 30000.0,
            "max_price_per_kg": 28.0,
            "target_delivery_date": "2026-09-30",
            "quality_requirement": "GRADE_A",
            "is_bulk_demand": True,
            "delivery_address": "Reliance DC, Bhosari, Pune",
            "delivery_latitude": 18.6298,
            "delivery_longitude": 73.8477
        }
        dem_res = self.client.post("/api/v1/demands/", json=demand_payload, headers=headers)
        self.assertEqual(dem_res.status_code, 201)
        dem_data = dem_res.json()
        self.assertEqual(dem_data["required_quantity_kg"], 30000.0)

    def test_06_order_and_notifications_apis(self):
        # Login as bulk buyer
        buyer_token = self.client.post("/api/v1/auth/login", data={"username": "+91-9800033001", "password": "demo123"}).json()["access_token"]
        buyer_headers = {"Authorization": f"Bearer {buyer_token}"}

        crop_id = self.client.get("/api/v1/crops/").json()["items"][0]["id"]

        order_payload = {
            "matched_crop_id": crop_id,
            "total_quantity_kg": 10000.0,
            "agreed_price_per_kg": 25.0,
            "participating_farmer_ids": [
                {"farmer_id": "usr-farm-01", "allocated_quantity_kg": 10000.0}
            ],
            "match_score": 98.5
        }
        ord_res = self.client.post("/api/v1/orders/", json=order_payload, headers=buyer_headers)
        self.assertEqual(ord_res.status_code, 201)
        ord_data = ord_res.json()
        self.assertEqual(ord_data["status"], "CONFIRMED")

        # Test Farmer received notification
        farmer_token = self.client.post("/api/v1/auth/login", data={"username": "+91-9823011101", "password": "demo123"}).json()["access_token"]
        farmer_headers = {"Authorization": f"Bearer {farmer_token}"}
        notif_res = self.client.get("/api/v1/notifications/", headers=farmer_headers)
        self.assertEqual(notif_res.status_code, 200)
        self.assertGreater(len(notif_res.json()), 0)

    def test_07_rbac_access_control(self):
        # Login as consumer
        consumer_token = self.client.post("/api/v1/auth/login", data={"username": "+91-987604401", "password": "demo123"}).json()["access_token"]
        consumer_headers = {"Authorization": f"Bearer {consumer_token}"}

        # Consumer attempting to declare expected harvest (Farmer/FPO role required)
        crop_id = self.client.get("/api/v1/crops/").json()["items"][0]["id"]
        res = self.client.post("/api/v1/supplies/expected", json={"crop_id": crop_id, "expected_quantity_kg": 100, "expected_harvest_date": "2026-09-20", "min_price_per_kg": 20, "farm_latitude": 18.5, "farm_longitude": 73.8}, headers=consumer_headers)
        self.assertEqual(res.status_code, 403) # Forbidden for Consumer role

if __name__ == "__main__":
    unittest.main()
