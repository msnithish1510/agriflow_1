import unittest
from datetime import date, timedelta
from fastapi.testclient import TestClient
import os
import sys

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.seeds.seed_runner import run_seed

class TestMasterSIHScenarios(unittest.TestCase):
    """
    AGRIFlow SIH 2026 Problem Statement SIH26033
    Master Integration Test Suite verifying all 6 core demonstration scenarios.
    """

    @classmethod
    def setUpClass(cls):
        print("\n[TEST] Running AGRIFlow Master SIH Scenarios Integration Test Suite...")
        run_seed()
        cls.client = TestClient(app)

    def test_scenario_1_demand_first_coimbatore_bulk_buyer(self):
        print("  [SCENARIO 1] Verifying Demand-First Coimbatore Bulk Buyer Flow...")
        # Login bulk buyer
        buyer_login = self.client.post("/api/v1/auth/login", data={"username": "+91-9800033001", "password": "demo123"}).json()
        buyer_headers = {"Authorization": f"Bearer {buyer_login['access_token']}"}

        crops_res = self.client.get("/api/v1/crops/").json()
        tomato_id = next(c["id"] for c in crops_res["items"] if c["name"] == "Tomato")

        # 1. Read / Post Demand
        tomorrow = str(date.today() + timedelta(days=1))
        demand_payload = {
            "crop_id": tomato_id,
            "required_quantity_kg": 1000.0,
            "max_price_per_kg": 30.0,
            "target_delivery_date": tomorrow,
            "quality_requirement": "GRADE_A",
            "is_bulk_demand": True,
            "delivery_address": "Coimbatore Wholesale Hub, Tamil Nadu",
            "delivery_latitude": 11.0168,
            "delivery_longitude": 76.9558
        }
        dem_res = self.client.post("/api/v1/demands/", json=demand_payload, headers=buyer_headers)
        self.assertEqual(dem_res.status_code, 201)
        demand_id = dem_res.json()["id"]

        # 2 & 3. Find Expected Supply & Multi-Farmer Aggregation
        match_res = self.client.post("/api/v1/matching/demand-first", json={"demand_id": demand_id, "max_radius_km": 250.0})
        self.assertEqual(match_res.status_code, 200)
        match_data = match_res.json()
        self.assertIn("proposal", match_data)
        proposal = match_data["proposal"]
        self.assertTrue(proposal["is_fully_satisfied"])

        # 4 & 5. Price Guidance & Farmer Net Realization
        net_calc = self.client.get("/api/v1/price-transparency/net-realization?gross_buyer_price=30.0&distance_km=120.0&perishability=HIGH").json()
        self.assertIn("estimated_farmer_net_realization_per_kg", net_calc)

        # 6 & 7. Perishability Priority & VRPTW Logistics Route
        route_res = self.client.post("/api/v1/logistics/optimize-route", json={
            "depot_location": {"lat": 11.1, "lng": 76.9},
            "pickup_farm_locations": [
                {"farmer_id": "usr-farm-01", "lat": 11.2, "lng": 77.0, "qty_kg": 600.0},
                {"farmer_id": "usr-farm-02", "lat": 11.15, "lng": 76.95, "qty_kg": 400.0}
            ],
            "drop_location": {"lat": 11.0168, "lng": 76.9558},
            "vehicle_capacity_kg": 5000.0,
            "perishability": "HIGH"
        }).json()

        self.assertTrue(route_res["is_perishability_compliant"])

        # 8 & 9. Order Confirmation & Delivery Tracking
        order_payload = {
            "demand_id": demand_id,
            "matched_crop_id": tomato_id,
            "total_quantity_kg": 1000.0,
            "agreed_price_per_kg": 24.50,
            "participating_farmer_ids": [
                {"farmer_id": "usr-farm-01", "allocated_quantity_kg": 600.0},
                {"farmer_id": "usr-farm-02", "allocated_quantity_kg": 400.0}
            ]
        }
        ord_res = self.client.post("/api/v1/orders/", json=order_payload, headers=buyer_headers)
        self.assertEqual(ord_res.status_code, 201)

    def test_scenario_2_supply_first_farmer_discovery(self):
        print("  [SCENARIO 2] Verifying Supply-First Farmer Stock Listing Flow...")
        farmer_login = self.client.post("/api/v1/auth/login", data={"username": "+91-9823011101", "password": "demo123"}).json()
        farmer_headers = {"Authorization": f"Bearer {farmer_login['access_token']}"}

        crops_res = self.client.get("/api/v1/crops/").json()
        tomato_id = next(c["id"] for c in crops_res["items"] if c["name"] == "Tomato")

        # 1. Create Stock Listing
        today = str(date.today())
        stock_payload = {
            "crop_id": tomato_id,
            "available_quantity_kg": 500.0,
            "price_per_kg": 28.0,
            "harvest_date": today,
            "shelf_life_remaining_days": 5,
            "quality_grade": "GRADE_A",
            "location_latitude": 20.1741,
            "location_longitude": 73.9871
        }
        stk_res = self.client.post("/api/v1/supplies/stock", json=stock_payload, headers=farmer_headers)
        self.assertEqual(stk_res.status_code, 201)
        stock_id = stk_res.json()["id"]

        # 2, 3 & 4. Find Nearby Demands, Rank Matches, & Propose Order
        match_res = self.client.post("/api/v1/matching/supply-first", json={"supply_id": stock_id, "is_expected_supply": False, "max_radius_km": 250.0})
        self.assertEqual(match_res.status_code, 200)
        match_data = match_res.json()
        self.assertEqual(match_data["mode"], "SUPPLY_FIRST")

    def test_scenario_3_urban_price_transparency(self):
        print("  [SCENARIO 3] Verifying Urban Price Transparency Breakdown...")
        res = self.client.get("/api/v1/price-transparency/urban-breakdown?farmer_price=24.0&is_urban=true")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["is_urban_model"])
        
        items = data["breakdown_items"]
        types = [i["type"] for i in items]
        self.assertIn("ACTUAL", types)
        self.assertIn("ESTIMATED", types)

    def test_scenario_4_ai_demand_forecasting(self):
        print("  [SCENARIO 4] Verifying AI Demand Forecasting Pipeline...")
        res = self.client.get("/api/v1/ai/demand-forecast?crop_name=Tomato&district=Nashik&forecast_days_ahead=15")
        self.assertEqual(res.status_code, 200)
        fc_data = res.json()
        self.assertIn("predicted_demand_kg", fc_data)
        self.assertIn("confidence_interval", fc_data)
        self.assertIn("model_metadata", fc_data)
        self.assertIn("validation_metrics", fc_data["model_metadata"])

    def test_scenario_5_logistics_optimization(self):
        print("  [SCENARIO 5] Verifying VRPTW Logistics Route Optimization...")
        res = self.client.post("/api/v1/logistics/optimize-route", json={
            "depot_location": {"lat": 20.0, "lng": 73.8},
            "pickup_farm_locations": [
                {"farmer_id": "f-1", "lat": 20.1, "lng": 73.9, "qty_kg": 300.0}
            ],
            "drop_location": {"lat": 18.6, "lng": 73.8},
            "vehicle_capacity_kg": 10000.0,
            "perishability": "HIGH"
        })
        self.assertEqual(res.status_code, 200)
        route_data = res.json()
        self.assertIn("total_distance_km", route_data)
        self.assertIn("vehicle_utilization", route_data)
        self.assertIn("freight_cost_breakdown", route_data)

    def test_scenario_6_farmer_voice_assistance(self):
        print("  [SCENARIO 6] Verifying Multilingual Voice Assistance Flow...")
        # 1. Parse Spoken Input
        spoken = "I have 500 kg tomato available tomorrow at ₹28 per kg."
        parse_res = self.client.post("/api/v1/voice/parse-spoken-listing", json={"spoken_text": spoken, "language": "en"})
        self.assertEqual(parse_res.status_code, 200)
        parse_data = parse_res.json()
        self.assertEqual(parse_data["status"], "REQUIRES_CONFIRMATION")
        self.assertEqual(parse_data["extracted_entities"]["crop_name"], "Tomato")

        # 2. Grounded Query
        query_res = self.client.post("/api/v1/voice/query", json={"query_text": "What demand is available near me?", "district": "Nashik", "crop_name": "Tomato", "language": "en"})
        self.assertEqual(query_res.status_code, 200)
        self.assertEqual(query_res.json()["detected_intent"], "NEARBY_DEMAND")

if __name__ == "__main__":
    unittest.main()
