from typing import List, Dict, Any

class MultiFarmerAggregationService:
    """
    AGRIFlow Multi-Farmer Yield Aggregator.
    Pools yield across multiple smallholder farmers to fulfill large bulk buyer orders.
    Example: 1000 kg demand pooled from Farmer A (300kg) + Farmer B (250kg) + Farmer C (200kg) + Farmer D (250kg).
    """

    def aggregate_supply_candidates(
        self,
        required_quantity_kg: float,
        ranked_candidates: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Pools top ranked farmer candidate yields until required bulk quantity is satisfied.
        """
        allocated_farmers = []
        accumulated_qty = 0.0
        weighted_price_sum = 0.0
        weighted_distance_sum = 0.0
        weighted_score_sum = 0.0

        for cand in ranked_candidates:
            if accumulated_qty >= required_quantity_kg:
                break
            
            avail = cand.get("available_quantity_kg", 0.0)
            if avail <= 0:
                continue

            needed = required_quantity_kg - accumulated_qty
            take_qty = min(avail, needed)

            price = cand.get("price_per_kg", 0.0)
            dist = cand.get("distance_km", 0.0)
            score = cand.get("total_score", 0.0)

            accumulated_qty += take_qty
            weighted_price_sum += take_qty * price
            weighted_distance_sum += take_qty * dist
            weighted_score_sum += take_qty * score

            allocated_farmers.append({
                "farmer_id": cand.get("farmer_id"),
                "farmer_name": cand.get("farmer_name", f"Farmer #{cand.get('farmer_id')}"),
                "supply_id": cand.get("id"),
                "allocated_quantity_kg": take_qty,
                "price_per_kg": price,
                "distance_km": dist,
                "match_score": score
            })

        avg_price = round(weighted_price_sum / accumulated_qty, 2) if accumulated_qty > 0 else 0.0
        avg_dist = round(weighted_distance_sum / accumulated_qty, 1) if accumulated_qty > 0 else 0.0
        avg_score = round(weighted_score_sum / accumulated_qty, 2) if accumulated_qty > 0 else 0.0

        is_fully_satisfied = accumulated_qty >= required_quantity_kg

        return {
            "required_quantity_kg": required_quantity_kg,
            "total_aggregated_quantity_kg": accumulated_qty,
            "is_fully_satisfied": is_fully_satisfied,
            "participating_farmers_count": len(allocated_farmers),
            "weighted_avg_price_per_kg": avg_price,
            "weighted_avg_distance_km": avg_dist,
            "aggregate_match_score": avg_score,
            "allocated_farmers": allocated_farmers
        }

aggregation_service = MultiFarmerAggregationService()
