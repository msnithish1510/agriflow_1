import unittest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import os
import sys

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.db.session import SessionLocal
from app.seeds.seed_runner import run_seed

class TestAGRIFlowEndToEndWorkflows(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n[TEST] Running AGRIFlow End-to-End Workflow Test Suite...")
        run_seed()
        cls.client = TestClient(app)

    def test_e2e_full_workflow(self):
        # 1. FARMER -> POST EXPECTED HARVEST DECLARATION
        farmer_login = self.client.post("/api/v1/auth/login", data={"username": "+91-9823011101", "password": "demo123"}).json()
        farmer_token = farmer_login["access_token"]
        farmer_headers = {"Authorization": f"Bearer {farmer_token}"}

        crops_res = self.client.get("/api/v1/crops/").json()
        crop_id = crops_res["items"][0]["id"]

        supply_payload = {
            "crop_id": crop_id,
            "expected_quantity_kg": 20000.0,
            "expected_harvest_date": "2026-09-28",
            "min_price_per_kg": 24.50,
            "quality_grade": "GRADE_A",
            "farm_latitude": 20.1741,
            "farm_longitude": 73.9871
        }
        sup_res = self.client.post("/api/v1/supplies/expected", json=supply_payload, headers=farmer_headers)
        self.assertEqual(sup_res.status_code, 201)
        supply_data = sup_res.json()
        print(f"  [1] Farmer expected harvest declared: {supply_data['id']}")

        # 2. BUYER -> POST FUTURE CROP DEMAND REQUIREMENT
        buyer_login = self.client.post("/api/v1/auth/login", data={"username": "+91-9800033001", "password": "demo123"}).json()
        buyer_token = buyer_login["access_token"]
        buyer_headers = {"Authorization": f"Bearer {buyer_token}"}

        demand_payload = {
            "crop_id": crop_id,
            "required_quantity_kg": 20000.0,
            "max_price_per_kg": 28.0,
            "target_delivery_date": "2026-09-30",
            "quality_requirement": "GRADE_A",
            "is_bulk_demand": True,
            "delivery_address": "Reliance DC, Bhosari, Pune",
            "delivery_latitude": 18.6298,
            "delivery_longitude": 73.8477
        }
        dem_res = self.client.post("/api/v1/demands/", json=demand_payload, headers=buyer_headers)
        self.assertEqual(dem_res.status_code, 201)
        demand_data = dem_res.json()
        print(f"  [2] Buyer demand requirement posted: {demand_data['id']}")

        # 3. BUYER -> MATCHING ENGINE EXECUTION
        match_res = self.client.post("/api/v1/matching/demand-first", json={"demand_id": demand_data["id"], "max_radius_km": 250.0})
        self.assertEqual(match_res.status_code, 200)
        match_data = match_res.json()
        self.assertIn("proposal", match_data)
        print(f"  [3] Pre-market matching engine executed: Score {match_data['proposal']['match_score']}%")

        # 4. BUYER -> CREATE CONFIRMED ORDER & TRIGGER FARMER NOTIFICATION
        order_payload = {
            "demand_id": demand_data["id"],
            "matched_crop_id": crop_id,
            "total_quantity_kg": 20000.0,
            "agreed_price_per_kg": 24.50,
            "participating_farmer_ids": [
                {"farmer_id": "usr-farm-01", "allocated_quantity_kg": 20000.0}
            ],
            "match_score": 96.4
        }
        ord_res = self.client.post("/api/v1/orders/", json=order_payload, headers=buyer_headers)
        self.assertEqual(ord_res.status_code, 201)
        order_data = ord_res.json()
        print(f"  [4] Confirmed order created: {order_data['id']}")

        # FARMER -> VERIFY IN-APP NOTIFICATION RECEIVED
        notif_res = self.client.get("/api/v1/notifications/", headers=farmer_headers)
        self.assertEqual(notif_res.status_code, 200)
        notifs = notif_res.json()
        self.assertGreater(len(notifs), 0)
        print(f"  [5] Farmer received in-app notification: '{notifs[0]['title']}'")

        # 5. LOGISTICS -> ACCEPT JOB & TRANSITION STATUS TO IN_TRANSIT AND DELIVERED
        logistics_login = self.client.post("/api/v1/auth/login", data={"username": "+91-989905501", "password": "demo123"}).json()
        logistics_token = logistics_login["access_token"]
        logistics_headers = {"Authorization": f"Bearer {logistics_token}"}

        accept_res = self.client.post(f"/api/v1/logistics/accept-job/{order_data['id']}", headers=logistics_headers)
        self.assertEqual(accept_res.status_code, 200)
        print(f"  [6] Logistics partner accepted job: Status set to IN_TRANSIT")

        status_res = self.client.patch(f"/api/v1/logistics/update-status/{order_data['id']}?status_value=DELIVERED", headers=logistics_headers)
        self.assertEqual(status_res.status_code, 200)
        print(f"  [7] Logistics completed delivery: Status set to DELIVERED")

if __name__ == "__main__":
    unittest.main()
