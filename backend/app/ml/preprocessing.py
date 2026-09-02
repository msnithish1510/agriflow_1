import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Tuple, Dict, Any

class DemandDataPreprocessor:
    """
    AGRIFlow Historical Agricultural Demand Preprocessor & Feature Engineer.
    Extracts temporal, market lag, festival, and seasonal features.
    """

    CROPS = ["Tomato", "Onion", "Potato", "Wheat", "Moong (Green Gram)", "Paddy (Rice)"]
    DISTRICTS = ["Nashik", "Pune", "Ahmednagar", "Solapur", "Nagpur", "Aurangabad"]

    FESTIVAL_MONTHS = [8, 9, 10, 11] # Ganesh Chaturthi, Navratri, Diwali, Harvest season

    def generate_historical_demand_dataset(self, num_days: int = 365) -> pd.DataFrame:
        """
        Generates structured historical daily agricultural market demand dataset for model training.
        """
        records = []
        start_date = datetime(2025, 1, 1)

        np.random.seed(42) # Reproducible benchmark dataset

        for crop in self.CROPS:
            base_demand = 20000.0 if crop in ["Tomato", "Onion"] else 35000.0
            base_price = 25.0 if crop == "Tomato" else (22.0 if crop == "Onion" else 18.0)

            for dist in self.DISTRICTS:
                district_mult = 1.2 if dist in ["Nashik", "Pune"] else 0.95

                current_demand = base_demand * district_mult

                for day_idx in range(num_days):
                    current_date = start_date + timedelta(days=day_idx)
                    month = current_date.month
                    day_of_week = current_date.weekday()
                    day_of_year = current_date.timetuple().tm_yday

                    season = "KHARIF" if month in [6, 7, 8, 9] else ("RABI" if month in [10, 11, 12, 1, 2] else "ZAID")
                    is_festival = 1 if (month in self.FESTIVAL_MONTHS and day_of_week in [4, 5, 6]) else 0

                    # Seasonal variation (sine wave peak)
                    seasonal_noise = np.sin((month / 12.0) * 2 * np.pi) * 0.18
                    festival_surge = 0.25 if is_festival else 0.0
                    random_noise = np.random.normal(0, 0.05)

                    # Dynamic market demand (kg)
                    demand_kg = current_demand * (1.0 + seasonal_noise + festival_surge + random_noise)
                    demand_kg = max(5000.0, round(demand_kg, 1))

                    # Lagged features calculation
                    lag_7 = demand_kg * (1.0 + np.random.normal(0, 0.03))
                    lag_14 = demand_kg * (1.0 + np.random.normal(0, 0.05))

                    historical_price = round(base_price * (1.0 + np.random.normal(0, 0.08)), 2)
                    supply_availability = round(demand_kg * np.random.uniform(0.85, 1.15), 1)

                    records.append({
                        "date": current_date.strftime("%Y-%m-%d"),
                        "crop_name": crop,
                        "district": dist,
                        "month": month,
                        "day_of_week": day_of_week,
                        "day_of_year": day_of_year,
                        "season": season,
                        "is_festival": is_festival,
                        "historical_price": historical_price,
                        "demand_lag_7": lag_7,
                        "demand_lag_14": lag_14,
                        "supply_availability_kg": supply_availability,
                        "target_demand_kg": demand_kg
                    })

        df = pd.DataFrame(records)
        return df

    def prepare_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series, Dict[str, Any]]:
        """
        Encodes categorical features and returns X, y vectors along with feature metadata.
        """
        df_encoded = pd.get_dummies(df, columns=["crop_name", "district", "season"], drop_first=False)

        feature_cols = [c for c in df_encoded.columns if c not in ["date", "target_demand_kg"]]
        X = df_encoded[feature_cols]
        y = df_encoded["target_demand_kg"]

        meta = {
            "feature_columns": feature_cols,
            "num_samples": len(df),
            "num_features": len(feature_cols)
        }

        return X, y, meta

preprocessor = DemandDataPreprocessor()
