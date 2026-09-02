import unittest
from datetime import date, timedelta
from fastapi.testclient import TestClient
import os
import sys

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.core.config_rules import config_rules
from app.seeds.seed_runner import run_seed

class TestAGRIFlowBusinessModelsAndFeeds(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n[TEST] Running AGRIFlow Phase 8 Business Models & Feeds Test Suite...")
        run_seed()
        cls.client = TestClient(app)

    def test_01_configurable_geographic_and_business_rules(self):
        rural = config_rules.get_rules_for_mode(is_urban=False)
        urban = config_rules.get_rules_for_mode(is_urban=True)

        self.assertEqual(rural["max_search_radius_km"], 50.0)
        self.assertEqual(rural["intermediary_margin_pct"], 0.0)

        self.assertEqual(urban["max_search_radius_km"], 150.0)
        self.assertEqual(urban["intermediary_margin_pct"], 8.0)

    def test_02_rural_model_workflows_a_b_c(self):
        # A. Bulk Buyer Demand (Demand-First)
        res_feed = self.client.get("/api/v1/feeds/demand-feed?is_urban=false&is_bulk_only=true")
        self.assertEqual(res_feed.status_code, 200)
        self.assertEqual(res_feed.json()["mode"], "RURAL")

        # B. Household Consumer Demand
        res_h = self.client.get("/api/v1/feeds/demand-feed?is_urban=false&is_bulk_only=false")
        self.assertEqual(res_h.status_code, 200)

        # C. Supply-First Available Stock
        res_sup = self.client.get("/api/v1/feeds/supply-feed?is_urban=false")
        self.assertEqual(res_sup.status_code, 200)

    def test_03_urban_model_workflows_a_b(self):
        # A. Normal Consumer Urban Price Transparency Breakdown
        res_urban_bd = self.client.get("/api/v1/price-transparency/urban-breakdown?farmer_price=24&is_urban=true")
        self.assertEqual(res_urban_bd.status_code, 200)
        data = res_urban_bd.json()
        self.assertTrue(data["is_urban_model"])

        # B. Bulk Buyer Direct Procurement
        res_bulk_feed = self.client.get("/api/v1/feeds/demand-feed?is_urban=true&is_bulk_only=true")
        self.assertEqual(res_bulk_feed.status_code, 200)
        self.assertEqual(res_bulk_feed.json()["mode"], "URBAN")

    def test_04_regional_map_overview_api(self):
        res_map = self.client.get("/api/v1/feeds/map-overview")
        self.assertEqual(res_map.status_code, 200)
        map_data = res_map.json()
        self.assertIn("total_active_points", map_data)
        self.assertIn("demand_points", map_data)
        self.assertIn("supply_points", map_data)

    def test_05_unified_order_state_machine_transitions(self):
        # Login buyer
        buyer_login = self.client.post("/api/v1/auth/login", data={"username": "+91-9800033001", "password": "demo123"}).json()
        buyer_token = buyer_login["access_token"]
        buyer_headers = {"Authorization": f"Bearer {buyer_token}"}

        crops_res = self.client.get("/api/v1/crops/").json()
        crop_id = crops_res["items"][0]["id"]

        # Create Order (PROPOSED)
        order_payload = {
            "matched_crop_id": crop_id,
            "total_quantity_kg": 5000.0,
            "agreed_price_per_kg": 24.50,
            "participating_farmer_ids": [{"farmer_id": "usr-farm-01", "allocated_quantity_kg": 5000.0}]
        }
        ord_res = self.client.post("/api/v1/orders/", json=order_payload, headers=buyer_headers)
        self.assertEqual(ord_res.status_code, 201)
        order_id = ord_res.json()["id"]

        # Login logistics partner
        log_login = self.client.post("/api/v1/auth/login", data={"username": "+91-989905501", "password": "demo123"}).json()
        log_token = log_login["access_token"]
        log_headers = {"Authorization": f"Bearer {log_token}"}

        # Transition: PROPOSED -> IN_TRANSIT
        accept_res = self.client.post(f"/api/v1/logistics/accept-job/{order_id}", headers=log_headers)
        self.assertEqual(accept_res.status_code, 200)

        # Transition: IN_TRANSIT -> DELIVERED
        deliv_res = self.client.patch(f"/api/v1/logistics/update-status/{order_id}?status_value=DELIVERED", headers=log_headers)
        self.assertEqual(deliv_res.status_code, 200)

if __name__ == "__main__":
    unittest.main()
