import unittest
from datetime import date, timedelta
from fastapi.testclient import TestClient
import os
import sys

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.ml.preprocessing import preprocessor
from app.ml.train_demand_forecast import train_demand_forecast_models
from app.services.ai_forecasting import ai_forecasting_service
from app.seeds.seed_runner import run_seed

class TestAIDemandForecastingModule(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n[TEST] Running AGRIFlow Phase 6 AI Demand Forecasting Test Suite...")
        run_seed()
        cls.client = TestClient(app)

    def test_01_dataset_preprocessing_and_features(self):
        df = preprocessor.generate_historical_demand_dataset(num_days=100)
        self.assertGreater(len(df), 500)
        self.assertIn("target_demand_kg", df.columns)

        X, y, meta = preprocessor.prepare_features(df)
        self.assertEqual(len(X), len(y))
        self.assertGreater(meta["num_features"], 5)

    def test_02_ml_training_pipeline_metrics(self):
        artifact = train_demand_forecast_models()
        self.assertIn("model_name", artifact)
        self.assertIn("version", artifact)
        self.assertIn("metrics", artifact)
        
        metrics = artifact["metrics"]
        self.assertIn("MAE", metrics)
        self.assertIn("RMSE", metrics)
        self.assertIn("MAPE", metrics)
        self.assertGreater(metrics["MAE"], 0.0)
        self.assertGreater(metrics["RMSE"], 0.0)
        self.assertIn("validation split", artifact["disclaimer"])

    def test_03_ai_forecasting_service_inference_and_confidence(self):
        target_date = date.today() + timedelta(days=15)
        forecast = ai_forecasting_service.get_forecast_for_crop_district(
            crop_name="Tomato",
            district="Nashik",
            target_date=target_date
        )

        self.assertEqual(forecast["crop_name"], "Tomato")
        self.assertEqual(forecast["district"], "Nashik")
        self.assertGreater(forecast["predicted_demand_kg"], 1000.0)
        self.assertIn("confidence_interval", forecast)
        self.assertLessEqual(
            forecast["confidence_interval"]["min_demand_kg"],
            forecast["predicted_demand_kg"]
        )
        self.assertGreaterEqual(
            forecast["confidence_interval"]["max_demand_kg"],
            forecast["predicted_demand_kg"]
        )
        self.assertIn("model_metadata", forecast)

    def test_04_prediction_and_history_api(self):
        # 1. Train Model API
        res_train = self.client.post("/api/v1/ai/train-model")
        self.assertEqual(res_train.status_code, 200)
        self.assertEqual(res_train.json()["status"], "SUCCESS")

        # 2. Demand Forecast API
        res_fc = self.client.get("/api/v1/ai/demand-forecast?crop_name=Tomato&district=Nashik&forecast_days_ahead=15")
        self.assertEqual(res_fc.status_code, 200)
        fc_data = res_fc.json()
        self.assertIn("predicted_demand_kg", fc_data)
        self.assertIn("confidence_interval", fc_data)

        # 3. Forecast History API
        res_hist = self.client.get("/api/v1/ai/forecast-history?crop_name=Tomato")
        self.assertEqual(res_hist.status_code, 200)
        self.assertIsInstance(res_hist.json(), list)

if __name__ == "__main__":
    unittest.main()
