from typing import Dict, Any

class MatchProposalService:
    """
    AGRIFlow Match Explanation & Order Proposal Service.
    Generates audited natural language explanations detailing why a match or multi-farmer pool was selected.
    """

    def generate_explanation(
        self,
        required_qty: float,
        aggregated_qty: float,
        farmers_count: int,
        avg_distance_km: float,
        avg_price_per_kg: float,
        budget_max_price: float,
        days_diff: int,
        quality_grade: str
    ) -> str:
        
        # 1. Quantity fit text
        pct_fit = round((aggregated_qty / max(1.0, required_qty)) * 100.0, 1)
        if farmers_count > 1:
            qty_text = f"{pct_fit}% quantity fit ({aggregated_qty:,.0f} kg aggregated across {farmers_count} farmers)"
        else:
            qty_text = f"{pct_fit}% quantity fit ({aggregated_qty:,.0f} kg from single farm)"

        # 2. Distance text
        dist_text = f"{avg_distance_km} km average distance"

        # 3. Price text
        if avg_price_per_kg <= budget_max_price:
            price_text = f"acceptable price (Rs. {avg_price_per_kg:.2f}/kg vs budget Rs. {budget_max_price:.2f}/kg)"
        else:
            price_text = f"price Rs. {avg_price_per_kg:.2f}/kg"

        # 4. Date timing text
        if days_diff == 0:
            time_text = "exact delivery date alignment"
        else:
            time_text = f"{days_diff} day date alignment"

        explanation = (
            f"Selected because {qty_text}, {dist_text}, {price_text}, and {time_text} ({quality_grade} quality)."
        )

        return explanation

    def build_full_proposal(
        self,
        demand_id: str,
        crop_name: str,
        aggregation_result: Dict[str, Any],
        ranking_metrics: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Builds a complete order proposal package containing score, farmer breakdown, and natural language explanation.
        """
        farmers_count = aggregation_result["participating_farmers_count"]
        req_qty = aggregation_result["required_quantity_kg"]
        agg_qty = aggregation_result["total_aggregated_quantity_kg"]
        avg_dist = aggregation_result["weighted_avg_distance_km"]
        avg_price = aggregation_result["weighted_avg_price_per_kg"]
        budget_price = ranking_metrics.get("budget_max_price", avg_price)
        days_diff = ranking_metrics.get("days_date_diff", 0)
        quality = ranking_metrics.get("quality_grade", "GRADE_A")

        explanation = self.generate_explanation(
            required_qty=req_qty,
            aggregated_qty=agg_qty,
            farmers_count=farmers_count,
            avg_distance_km=avg_dist,
            avg_price_per_kg=avg_price,
            budget_max_price=budget_price,
            days_diff=days_diff,
            quality_grade=quality
        )

        return {
            "proposal_id": f"prop-{demand_id[:8]}",
            "demand_id": demand_id,
            "crop_name": crop_name,
            "required_quantity_kg": req_qty,
            "total_aggregated_quantity_kg": agg_qty,
            "is_fully_satisfied": aggregation_result["is_fully_satisfied"],
            "participating_farmers_count": farmers_count,
            "weighted_avg_price_per_kg": avg_price,
            "weighted_avg_distance_km": avg_dist,
            "total_amount_inr": round(agg_qty * avg_price, 2),
            "match_score": aggregation_result["aggregate_match_score"],
            "explanation": explanation,
            "allocated_farmers": aggregation_result["allocated_farmers"]
        }

proposal_service = MatchProposalService()
