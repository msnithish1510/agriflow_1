import math
from datetime import date
from typing import Dict, Any

class RankingService:
    """
    AGRIFlow Deterministic Weighted Ranking Engine.
    Evaluates demand-supply compatibility using audited weights:
    - w_qty = 0.25 (Quantity fit)
    - w_dist = 0.20 (Geodesic distance proximity)
    - w_time = 0.20 (Harvest/delivery date alignment)
    - w_price = 0.15 (Price budget fit)
    - w_quality = 0.10 (Quality grade match)
    - w_net_realization = 0.10 (Farmer net realization score)
    """

    WEIGHTS = {
        "quantity": 0.25,
        "distance": 0.20,
        "timing": 0.20,
        "price": 0.15,
        "quality": 0.10,
        "net_realization": 0.10
    }

    def compute_match_score(
        self,
        required_qty: float,
        candidate_qty: float,
        distance_km: float,
        target_date: date,
        candidate_date: date,
        budget_max_price: float,
        candidate_price: float,
        required_quality: str,
        candidate_quality: str,
        max_radius_km: float = 150.0
    ) -> Dict[str, Any]:
        
        # 1. Quantity Fit Sub-score (0 - 100)
        if candidate_qty >= required_qty:
            score_qty = 100.0
        else:
            score_qty = round((candidate_qty / max(1.0, required_qty)) * 100.0, 2)

        # 2. Distance Proximity Sub-score (0 - 100)
        if distance_km <= 0:
            score_dist = 100.0
        elif distance_km >= max_radius_km:
            score_dist = 0.0
        else:
            score_dist = round(max(0.0, 100.0 * (1.0 - (distance_km / max_radius_km))), 2)

        # 3. Harvest / Delivery Date Timing Alignment Sub-score (0 - 100)
        days_diff = abs((target_date - candidate_date).days)
        score_time = max(0.0, round(100.0 - (days_diff * 10.0), 2))

        # 4. Price Alignment Sub-score (0 - 100)
        if candidate_price <= budget_max_price:
            # Full score if under or equal to budget
            price_saving = budget_max_price - candidate_price
            score_price = min(100.0, 90.0 + (price_saving * 2.0))
        else:
            # Penalty for exceeding budget
            over_budget = candidate_price - budget_max_price
            score_price = max(0.0, 90.0 - (over_budget * 15.0))

        # 5. Quality Grade Match Sub-score (0 - 100)
        if required_quality == candidate_quality:
            score_quality = 100.0
        elif candidate_quality in ["GRADE_A", "EXPORT", "ORGANIC"]:
            score_quality = 90.0
        else:
            score_quality = 70.0

        # 6. Farmer Net Realization Factor Sub-score (0 - 100)
        # Higher score when distance is low and price is fair
        net_realization_factor = max(0.80, 1.0 - (distance_km * 0.001))
        score_net_realization = round(net_realization_factor * 100.0, 2)

        # Weighted Final Score (0 - 100)
        total_score = round(
            (score_qty * self.WEIGHTS["quantity"]) +
            (score_dist * self.WEIGHTS["distance"]) +
            (score_time * self.WEIGHTS["timing"]) +
            (score_price * self.WEIGHTS["price"]) +
            (score_quality * self.WEIGHTS["quality"]) +
            (score_net_realization * self.WEIGHTS["net_realization"]),
            2
        )

        return {
            "total_score": total_score,
            "sub_scores": {
                "quantity_fit": score_qty,
                "distance_proximity": score_dist,
                "timing_alignment": score_time,
                "price_alignment": score_price,
                "quality_match": score_quality,
                "net_realization": score_net_realization
            },
            "weights": self.WEIGHTS,
            "metrics": {
                "distance_km": distance_km,
                "days_date_diff": days_diff,
                "candidate_price": candidate_price,
                "budget_max_price": budget_max_price
            }
        }

ranking_service = RankingService()
