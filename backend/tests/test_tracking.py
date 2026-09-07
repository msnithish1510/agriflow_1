import unittest
import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.seeds.seed_runner import run_seed

class TestAGRIFlowTrackingModule(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n[TEST] Running AGRIFlow Live Order Tracking Test Suite...")
        run_seed()
        cls.client = TestClient(app)

    def test_01_get_tracking_details(self):
        res = self.client.get("/api/v1/tracking/AGR-2026-00125")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["tracking_id"], "AGR-2026-00125")
        self.assertIn("pickup_location", data)
        self.assertIn("destination_location", data)
        self.assertIn("route", data)
        self.assertIn("history", data)

    def test_02_get_tracking_location_polling(self):
        res = self.client.get("/api/v1/tracking/AGR-2026-00125/location")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("latitude", data)
        self.assertIn("longitude", data)

    def test_03_update_tracking_location(self):
        res = self.client.post("/api/v1/tracking/AGR-2026-00125/location", json={
            "latitude": 11.0180,
            "longitude": 77.0420,
            "location_name": "Sulur Highway Checkpoint"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["current_latitude"], 11.0180)
        self.assertEqual(data["current_longitude"], 77.0420)

    def test_04_update_tracking_status(self):
        res = self.client.post("/api/v1/tracking/AGR-2026-00125/status", json={
            "status": "IN_TRANSIT"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["current_status"], "IN_TRANSIT")

    def test_05_get_active_shipments(self):
        res = self.client.get("/api/v1/tracking/shipments/active")
        self.assertEqual(res.status_code, 200)
        items = res.json()
        self.assertGreaterEqual(len(items), 1)

if __name__ == "__main__":
    unittest.main()
