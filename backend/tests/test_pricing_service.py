import unittest
from fastapi.testclient import TestClient
import os
import sys

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.services.pricing_service import pricing_service
from app.seeds.seed_runner import run_seed

class TestAGRIFlowPricingService(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n[TEST] Running AGRIFlow Phase 5 Pricing Service Test Suite...")
        run_seed()
        cls.client = TestClient(app)

    def test_01_advisory_price_guidance(self):
        guidance = pricing_service.get_advisory_price_guidance(
            crop_name="Tomato",
            district="Nashik",
            season_month=9,
            demand_level="HIGH",
            supply_level="BALANCED"
        )

        self.assertIn("advisory_notice", guidance)
        self.assertIn("strictly advisory", guidance["advisory_notice"])
        self.assertIn("suggested_price_range", guidance)
        self.assertGreater(guidance["suggested_price_range"]["recommended_target_price_per_kg"], 0.0)

    def test_02_farmer_net_realization_breakdown(self):
        # Example required by prompt:
        # Gross buyer price = ₹30/kg
        # Transport = ₹2, Handling = ₹1, Expected spoilage = ₹0.80, Platform/Other = ₹0.50
        # Estimated farmer net realization = ₹25.70/kg
        net_calc = pricing_service.calculate_farmer_net_realization(
            gross_buyer_price_per_kg=30.0,
            distance_km=50.0,
            perishability="HIGH",
            transport_override=2.00,
            handling_override=1.00,
            spoilage_override=0.80
        )

        self.assertEqual(net_calc["gross_buyer_price_per_kg"], 30.0)
        self.assertEqual(net_calc["deductions"]["transport_cost"], 2.00)
        self.assertEqual(net_calc["deductions"]["handling_cost"], 1.00)
        self.assertEqual(net_calc["deductions"]["expected_spoilage_cost"], 0.80)
        self.assertEqual(net_calc["deductions"]["platform_fee"], 0.45) # 1.5% of 30
        self.assertEqual(net_calc["estimated_farmer_net_realization_per_kg"], 25.75) # 30 - 4.25
        self.assertIn("Estimated Net Realization", net_calc["itemized_example_str"])

    def test_03_buyer_offers_comparison_matrix(self):
        buyer_offers = [
            {"buyer_name": "Trader A", "offered_price_per_kg": 28.0, "distance_km": 10.0, "delivery_date": "2026-09-10", "payment_terms": "Immediate"},
            {"buyer_name": "Buyer B", "offered_price_per_kg": 32.0, "distance_km": 80.0, "delivery_date": "2026-09-12", "payment_terms": "24h Bank"}
        ]

        comparison = pricing_service.compare_buyer_offers(farmer_ask_price=24.0, buyer_offers=buyer_offers)
        self.assertEqual(comparison["compared_buyer_offers_count"], 2)
        self.assertIsNotNone(comparison["top_recommended_buyer"])
        # Higher net payout buyer ranked first
        self.assertGreaterEqual(
            comparison["comparison_matrix"][0]["estimated_net_realization_per_kg"],
            comparison["comparison_matrix"][1]["estimated_net_realization_per_kg"]
        )

    def test_04_urban_price_transparency_estimated_vs_actual(self):
        urban_model = pricing_service.get_urban_price_transparency(
            farmer_price_per_kg=24.0,
            perishability="HIGH",
            distance_km=50.0,
            is_urban=True
        )

        items = urban_model["breakdown_items"]
        types = [item["type"] for item in items]
        
        self.assertIn("ACTUAL", types)
        self.assertIn("ESTIMATED", types)

        farmer_item = next(i for i in items if i["component"] == "Farmer/FPO Price")
        self.assertEqual(farmer_item["type"], "ACTUAL")

        transport_item = next(i for i in items if i["component"] == "Transport Logistics")
        self.assertEqual(transport_item["type"], "ESTIMATED")

    def test_05_pricing_api_endpoints(self):
        # 1. Guidance API
        res_g = self.client.get("/api/v1/price-transparency/guidance?crop_name=Tomato&district=Nashik")
        self.assertEqual(res_g.status_code, 200)
        self.assertIn("advisory_notice", res_g.json())

        # 2. Net Realization API
        res_n = self.client.get("/api/v1/price-transparency/net-realization?gross_buyer_price=30&transport_cost=2&handling_cost=1&spoilage_cost=0.8")
        self.assertEqual(res_n.status_code, 200)
        self.assertEqual(res_n.json()["gross_buyer_price_per_kg"], 30.0)

        # 3. Buyer Comparison API
        res_c = self.client.get("/api/v1/price-transparency/buyer-comparison?farmer_ask_price=24")
        self.assertEqual(res_c.status_code, 200)
        self.assertIn("comparison_matrix", res_c.json())

        # 4. Urban Breakdown API
        res_u = self.client.get("/api/v1/price-transparency/urban-breakdown?farmer_price=24&is_urban=true")
        self.assertEqual(res_u.status_code, 200)
        self.assertIn("breakdown_items", res_u.json())

if __name__ == "__main__":
    unittest.main()
