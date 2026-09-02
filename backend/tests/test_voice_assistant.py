import unittest
from datetime import date, timedelta
from fastapi.testclient import TestClient
import os
import sys

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.services.voice_assistant import voice_assistant_service
from app.seeds.seed_runner import run_seed

class TestAGRIFlowVoiceAssistantModule(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n[TEST] Running AGRIFlow Phase 9 Voice Assistant Test Suite...")
        run_seed()
        cls.client = TestClient(app)

    def test_01_parse_spoken_listing_entities(self):
        spoken_text = "I have 500 kg tomato available tomorrow at ₹28 per kg."
        result = voice_assistant_service.parse_spoken_listing(spoken_text, lang="en")

        self.assertEqual(result["status"], "REQUIRES_CONFIRMATION")
        entities = result["extracted_entities"]
        self.assertEqual(entities["crop_name"], "Tomato")
        self.assertEqual(entities["available_quantity_kg"], 500.0)
        self.assertEqual(entities["price_per_kg"], 28.0)
        self.assertEqual(entities["availability_date"], str(date.today() + timedelta(days=1)))

        # Confirmation screen payload
        self.assertIn("confirmation_screen_data", result)
        self.assertEqual(result["confirmation_screen_data"]["title"], "Confirm Harvest Stock Listing")

    def test_02_tamil_spoken_listing_entities(self):
        spoken_text = "thakkali 1000 kg available naalai price rs 25 per kg"
        result = voice_assistant_service.parse_spoken_listing(spoken_text, lang="ta")

        entities = result["extracted_entities"]
        self.assertEqual(entities["crop_name"], "Tomato")
        self.assertEqual(entities["available_quantity_kg"], 1000.0)
        self.assertEqual(entities["price_per_kg"], 25.0)

    def test_03_grounded_query_intents_no_hallucinations(self):
        # 1. NEARBY_DEMAND
        q1 = voice_assistant_service.process_farmer_query("What demand is available near me?", farmer_district="Nashik")
        self.assertEqual(q1["detected_intent"], "NEARBY_DEMAND")
        self.assertTrue(q1["is_grounded_in_live_data"])

        # 2. BUYERS_FOR_CROP
        q2 = voice_assistant_service.process_farmer_query("Who is looking for my crop?", farmer_crop="Tomato")
        self.assertEqual(q2["detected_intent"], "BUYERS_FOR_CROP")

        # 3. DEMAND_FORECAST
        q3 = voice_assistant_service.process_farmer_query("What is the expected demand?", farmer_crop="Tomato", farmer_district="Nashik")
        self.assertEqual(q3["detected_intent"], "DEMAND_FORECAST")
        self.assertIn("predicted_demand_kg", q3["grounded_data"])

        # 4. BEST_NET_REALIZATION
        q4 = voice_assistant_service.process_farmer_query("Which buyer gives better estimated net realization?")
        self.assertEqual(q4["detected_intent"], "BEST_NET_REALIZATION")

    def test_04_voice_assistant_api_endpoints(self):
        # 1. Parse Spoken Listing API
        res_parse = self.client.post("/api/v1/voice/parse-spoken-listing", json={
            "spoken_text": "I have 500 kg tomato available tomorrow at ₹28 per kg.",
            "language": "en"
        })
        self.assertEqual(res_parse.status_code, 200)
        self.assertIn("extracted_entities", res_parse.json())

        # 2. Voice Query API
        res_q = self.client.post("/api/v1/voice/query", json={
            "query_text": "What demand is available near me?",
            "district": "Nashik",
            "crop_name": "Tomato",
            "language": "en"
        })
        self.assertEqual(res_q.status_code, 200)
        self.assertEqual(res_q.json()["detected_intent"], "NEARBY_DEMAND")

        # 3. Locales API
        res_loc = self.client.get("/api/v1/voice/locales")
        self.assertEqual(res_loc.status_code, 200)
        self.assertIn("supported_languages", res_loc.json())

if __name__ == "__main__":
    unittest.main()
