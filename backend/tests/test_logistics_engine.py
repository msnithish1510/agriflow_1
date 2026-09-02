import unittest
from fastapi.testclient import TestClient
import os
import sys

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.services.route_optimizer import route_optimizer_service
from app.seeds.seed_runner import run_seed

class TestAGRIFlowLogisticsOptimizationEngine(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n[TEST] Running AGRIFlow Phase 7 Logistics Optimization Test Suite...")
        run_seed()
        cls.client = TestClient(app)

    def test_01_ortools_route_creation_and_waypoints(self):
        depot = {"lat": 20.0, "lng": 73.8, "name": "Nashik Fleet Depot"}
        farms = [
            {"farmer_id": "usr-farm-01", "lat": 20.1741, "lng": 73.9871, "qty_kg": 3000.0, "window_start_h": 6, "window_end_h": 12},
            {"farmer_id": "usr-farm-02", "lat": 20.0768, "lng": 74.1082, "qty_kg": 2500.0, "window_start_h": 8, "window_end_h": 14}
        ]
        drop = {"lat": 18.6298, "lng": 73.8477, "name": "Pune DC", "deadline_h": 20}

        route = route_optimizer_service.optimize_logistics_route(
            depot_location=depot,
            pickup_farm_locations=farms,
            drop_location=drop,
            vehicle_capacity_kg=10000.0,
            perishability="HIGH"
        )

        self.assertIn("total_distance_km", route)
        self.assertGreater(route["total_distance_km"], 50.0)
        self.assertIn("ordered_route_waypoints", route)
        self.assertGreaterEqual(len(route["ordered_route_waypoints"]), 4)
        self.assertIn("disclaimer", route)
        self.assertIn("Google OR-Tools static distance solver", route["disclaimer"])

    def test_02_vehicle_capacity_and_utilization(self):
        depot = {"lat": 20.0, "lng": 73.8}
        farms = [
            {"farmer_id": "f-1", "lat": 20.1, "lng": 73.9, "qty_kg": 4000.0},
            {"farmer_id": "f-2", "lat": 20.0, "lng": 74.0, "qty_kg": 3500.0}
        ]
        drop = {"lat": 18.6, "lng": 73.8}

        # Capacity 10,000 kg -> (7500 / 10000) = 75.0%
        route = route_optimizer_service.optimize_logistics_route(
            depot_location=depot,
            pickup_farm_locations=farms,
            drop_location=drop,
            vehicle_capacity_kg=10000.0
        )

        util = route["vehicle_utilization"]
        self.assertEqual(util["total_picked_qty_kg"], 7500.0)
        self.assertEqual(util["utilization_percentage"], 75.0)

    def test_03_perishability_priority_and_transit_limit(self):
        depot = {"lat": 20.0, "lng": 73.8}
        farms = [{"farmer_id": "f-1", "lat": 20.1, "lng": 73.9, "qty_kg": 1000.0}]
        drop = {"lat": 18.6, "lng": 73.8}

        route_high = route_optimizer_service.optimize_logistics_route(
            depot_location=depot,
            pickup_farm_locations=farms,
            drop_location=drop,
            perishability="HIGH"
        )

        self.assertEqual(route_high["max_allowed_transit_hours"], 6.0)
        self.assertTrue(route_high["is_perishability_compliant"])

    def test_04_fallback_router_execution(self):
        # Force fallback routing execution
        nodes = [
            {"id": "depot", "lat": 20.0, "lng": 73.8, "qty_kg": 0},
            {"id": "f1", "lat": 20.1, "lng": 73.9, "qty_kg": 500},
            {"id": "dest", "lat": 18.6, "lng": 73.8, "qty_kg": 0}
        ]
        dist_matrix = [[0, 20000, 150000], [20000, 0, 160000], [150000, 160000, 0]]
        
        fallback_res = route_optimizer_service._fallback_nearest_neighbor(nodes, dist_matrix)
        self.assertIn("total_distance_km", fallback_res)
        self.assertEqual(len(fallback_res["waypoints"]), 3)

    def test_05_logistics_optimize_route_api(self):
        payload = {
            "depot_location": {"lat": 20.0, "lng": 73.8},
            "pickup_farm_locations": [
                {"farmer_id": "f-1", "lat": 20.1, "lng": 73.9, "qty_kg": 1000.0}
            ],
            "drop_location": {"lat": 18.6, "lng": 73.8},
            "vehicle_capacity_kg": 5000.0,
            "perishability": "HIGH"
        }

        res = self.client.post("/api/v1/logistics/optimize-route", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total_distance_km", data)
        self.assertIn("vehicle_utilization", data)
        self.assertIn("freight_cost_breakdown", data)

if __name__ == "__main__":
    unittest.main()
