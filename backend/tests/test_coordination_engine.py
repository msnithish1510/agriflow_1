import unittest
from datetime import date, timedelta
from fastapi.testclient import TestClient
import os
import sys

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.services.ranking_service import ranking_service
from app.services.aggregation_service import aggregation_service
from app.services.proposal_service import proposal_service
from app.services.matching_engine import matching_engine
from app.seeds.seed_runner import run_seed

class TestDemandSupplyCoordinationEngine(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n[TEST] Running AGRIFlow Phase 4 Coordination Engine Test Suite...")
        run_seed()
        cls.client = TestClient(app)

    def test_01_deterministic_ranking_math_and_weights(self):
        # Assert audited weights sum to 1.0
        total_weight = sum(ranking_service.WEIGHTS.values())
        self.assertAlmostEqual(total_weight, 1.0, places=2)

        # Evaluate score math for ideal match
        today = date.today()
        score_data = ranking_service.compute_match_score(
            required_qty=1000.0,
            candidate_qty=1000.0,
            distance_km=10.0,
            target_date=today,
            candidate_date=today,
            budget_max_price=28.0,
            candidate_price=24.0,
            required_quality="GRADE_A",
            candidate_quality="GRADE_A"
        )

        self.assertGreater(score_data["total_score"], 90.0)
        self.assertEqual(score_data["sub_scores"]["quantity_fit"], 100.0)
        self.assertEqual(score_data["sub_scores"]["timing_alignment"], 100.0)
        self.assertEqual(score_data["sub_scores"]["quality_match"], 100.0)

    def test_02_multi_farmer_yield_aggregation(self):
        # User requirement: 1,000 kg demand aggregated across 4 farmers (300, 250, 200, 250)
        required_qty = 1000.0
        candidates = [
            {"id": "s-01", "farmer_id": "f-01", "farmer_name": "Farmer A", "available_quantity_kg": 300.0, "price_per_kg": 24.0, "distance_km": 12.0, "total_score": 95.0},
            {"id": "s-02", "farmer_id": "f-02", "farmer_name": "Farmer B", "available_quantity_kg": 250.0, "price_per_kg": 24.5, "distance_km": 15.0, "total_score": 92.0},
            {"id": "s-03", "farmer_id": "f-03", "farmer_name": "Farmer C", "available_quantity_kg": 200.0, "price_per_kg": 25.0, "distance_km": 18.0, "total_score": 90.0},
            {"id": "s-04", "farmer_id": "f-04", "farmer_name": "Farmer D", "available_quantity_kg": 250.0, "price_per_kg": 24.0, "distance_km": 20.0, "total_score": 88.0}
        ]

        result = aggregation_service.aggregate_supply_candidates(
            required_quantity_kg=required_qty,
            ranked_candidates=candidates
        )

        self.assertTrue(result["is_fully_satisfied"])
        self.assertEqual(result["total_aggregated_quantity_kg"], 1000.0)
        self.assertEqual(result["participating_farmers_count"], 4)
        self.assertAlmostEqual(result["weighted_avg_price_per_kg"], 24.35, places=1)
        self.assertEqual(len(result["allocated_farmers"]), 4)

    def test_03_natural_language_explanation_generator(self):
        explanation = proposal_service.generate_explanation(
            required_qty=1000.0,
            aggregated_qty=1000.0,
            farmers_count=4,
            avg_distance_km=18.0,
            avg_price_per_kg=24.50,
            budget_max_price=28.00,
            days_diff=0,
            quality_grade="GRADE_A"
        )

        self.assertIn("100.0% quantity fit", explanation)
        self.assertIn("1,000 kg aggregated across 4 farmers", explanation)
        self.assertIn("18.0 km average distance", explanation)
        self.assertIn("acceptable price", explanation)
        self.assertIn("exact delivery date alignment", explanation)

    def test_04_mode_1_demand_first_coordination(self):
        today = date.today()
        demand = {
            "id": "dem-test-01",
            "crop_id": "crop-tomato",
            "crop_name": "Tomato",
            "required_quantity_kg": 25000.0,
            "max_price_per_kg": 28.0,
            "delivery_latitude": 18.6298,
            "delivery_longitude": 73.8477,
            "target_delivery_date": today + timedelta(days=15),
            "quality_requirement": "GRADE_A"
        }

        candidate_supplies = [
            {
                "id": "sup-01", "farmer_id": "usr-farm-01", "farmer_name": "Ramesh Patil",
                "expected_quantity_kg": 15000.0, "expected_harvest_date": today + timedelta(days=15),
                "min_price_per_kg": 24.0, "farm_latitude": 20.1741, "farm_longitude": 73.9871,
                "quality_grade": "GRADE_A", "status": "DECLARED"
            },
            {
                "id": "sup-02", "farmer_id": "usr-farm-02", "farmer_name": "Suresh Deshmukh",
                "expected_quantity_kg": 15000.0, "expected_harvest_date": today + timedelta(days=16),
                "min_price_per_kg": 24.5, "farm_latitude": 20.0768, "farm_longitude": 74.1082,
                "quality_grade": "GRADE_A", "status": "DECLARED"
            }
        ]

        res = matching_engine.run_demand_first_coordination(demand=demand, candidate_supplies=candidate_supplies, max_radius_km=250.0)
        self.assertEqual(res["mode"], "DEMAND_FIRST")
        self.assertTrue(res["proposal"]["is_fully_satisfied"])
        self.assertEqual(res["proposal"]["participating_farmers_count"], 2)

    def test_05_mode_2_supply_first_coordination(self):
        today = date.today()
        supply = {
            "id": "sup-test-01",
            "farmer_id": "usr-farm-01",
            "expected_quantity_kg": 10000.0,
            "expected_harvest_date": today + timedelta(days=10),
            "min_price_per_kg": 24.0,
            "farm_latitude": 20.1741,
            "farm_longitude": 73.9871,
            "quality_grade": "GRADE_A"
        }

        candidate_demands = [
            {
                "id": "dem-01", "posted_by_user_id": "usr-buy-01", "required_quantity_kg": 25000.0,
                "max_price_per_kg": 28.0, "delivery_latitude": 18.6298, "delivery_longitude": 73.8477,
                "target_delivery_date": today + timedelta(days=10), "quality_requirement": "GRADE_A", "status": "OPEN"
            }
        ]

        res = matching_engine.run_supply_first_coordination(supply=supply, candidate_demands=candidate_demands, max_radius_km=250.0)
        self.assertEqual(res["mode"], "SUPPLY_FIRST")
        self.assertEqual(res["matched_demands_count"], 1)

    def test_06_matching_explain_api(self):
        res = self.client.get("/api/v1/matching/explain?required_qty=1000&aggregated_qty=1000&farmers_count=4&avg_distance_km=18&avg_price=24.5&budget_price=28.0&days_diff=0")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("explanation", data)
        self.assertIn("scoring_weights", data)
        self.assertIn("18.0 km average distance", data["explanation"])

if __name__ == "__main__":
    unittest.main()
