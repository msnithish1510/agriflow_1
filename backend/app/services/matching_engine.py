from typing import List, Dict, Any
from datetime import date
from app.services.gis_service import calculate_haversine_distance
from app.services.ranking_service import ranking_service
from app.services.aggregation_service import aggregation_service
from app.services.proposal_service import proposal_service

class CoordinationEngine:
    """
    AGRIFlow Pre-Market Demand-Supply Coordination Engine.
    Implements Mode 1 (Demand-First) and Mode 2 (Supply-First) multi-farmer coordination.
    """

    def run_demand_first_coordination(
        self,
        demand: Dict[str, Any],
        candidate_supplies: List[Dict[str, Any]],
        candidate_stocks: List[Dict[str, Any]] = [],
        max_radius_km: float = 150.0
    ) -> Dict[str, Any]:
        """
        MODE 1: DEMAND-FIRST
        Buyer posts demand requirement -> Engine finds, ranks, pools, and proposes multi-farmer supply.
        """
        req_qty = demand["required_quantity_kg"]
        deliv_lat = demand["delivery_latitude"]
        deliv_lng = demand["delivery_longitude"]
        target_date = demand["target_delivery_date"]
        budget_price = demand["max_price_per_kg"]
        req_quality = demand.get("quality_requirement", "GRADE_A")

        ranked_candidates = []

        # Process expected pre-harvest harvest declarations
        for sup in candidate_supplies:
            dist = calculate_haversine_distance(
                deliv_lat, deliv_lng, sup["farm_latitude"], sup["farm_longitude"]
            )

            status_val = str(sup.get("status", "")).upper()
            if dist <= max_radius_km and ("DECLARED" in status_val or status_val == ""):
                harvest_date = sup["expected_harvest_date"]
                cand_price = sup["min_price_per_kg"]
                cand_qty = sup["expected_quantity_kg"]
                cand_quality = sup.get("quality_grade", "GRADE_A")

                score_info = ranking_service.compute_match_score(
                    required_qty=req_qty,
                    candidate_qty=cand_qty,
                    distance_km=dist,
                    target_date=target_date,
                    candidate_date=harvest_date,
                    budget_max_price=budget_price,
                    candidate_price=cand_price,
                    required_quality=req_quality,
                    candidate_quality=cand_quality,
                    max_radius_km=max_radius_km
                )

                ranked_candidates.append({
                    "id": sup["id"],
                    "farmer_id": sup["farmer_id"],
                    "farmer_name": sup.get("farmer_name", f"Farmer {sup['farmer_id']}"),
                    "available_quantity_kg": cand_qty,
                    "price_per_kg": cand_price,
                    "distance_km": dist,
                    "quality_grade": cand_quality,
                    "total_score": score_info["total_score"],
                    "sub_scores": score_info["sub_scores"],
                    "supply_type": "EXPECTED_HARVEST"
                })

        # Process post-harvest current stocks
        for stk in candidate_stocks:
            dist = calculate_haversine_distance(
                deliv_lat, deliv_lng, stk["location_latitude"], stk["location_longitude"]
            )

            status_val = str(stk.get("status", "")).upper()
            if dist <= max_radius_km and ("AVAILABLE" in status_val or status_val == ""):
                h_date = stk["harvest_date"]
                cand_price = stk["price_per_kg"]
                cand_qty = stk["available_quantity_kg"]
                cand_quality = stk.get("quality_grade", "GRADE_A")

                score_info = ranking_service.compute_match_score(
                    required_qty=req_qty,
                    candidate_qty=cand_qty,
                    distance_km=dist,
                    target_date=target_date,
                    candidate_date=h_date,
                    budget_max_price=budget_price,
                    candidate_price=cand_price,
                    required_quality=req_quality,
                    candidate_quality=cand_quality,
                    max_radius_km=max_radius_km
                )

                ranked_candidates.append({
                    "id": stk["id"],
                    "farmer_id": stk["farmer_id"],
                    "farmer_name": stk.get("farmer_name", f"Farmer {stk['farmer_id']}"),
                    "available_quantity_kg": cand_qty,
                    "price_per_kg": cand_price,
                    "distance_km": dist,
                    "quality_grade": cand_quality,
                    "total_score": score_info["total_score"],
                    "sub_scores": score_info["sub_scores"],
                    "supply_type": "CURRENT_STOCK"
                })

        # Sort candidates by overall score descending
        ranked_candidates.sort(key=lambda x: x["total_score"], reverse=True)

        # Multi-Farmer Aggregation
        aggregation = aggregation_service.aggregate_supply_candidates(
            required_quantity_kg=req_qty,
            ranked_candidates=ranked_candidates
        )

        top_cand = ranked_candidates[0] if ranked_candidates else {}
        days_diff = abs((target_date - top_cand.get("expected_harvest_date", target_date)).days) if top_cand else 0

        proposal = proposal_service.build_full_proposal(
            demand_id=demand["id"],
            crop_name=demand.get("crop_name", "Crop"),
            aggregation_result=aggregation,
            ranking_metrics={
                "budget_max_price": budget_price,
                "days_date_diff": days_diff,
                "quality_grade": req_quality
            }
        )

        return {
            "mode": "DEMAND_FIRST",
            "demand_id": demand["id"],
            "proposal": proposal,
            "all_ranked_candidates": ranked_candidates
        }

    def run_supply_first_coordination(
        self,
        supply: Dict[str, Any],
        candidate_demands: List[Dict[str, Any]],
        max_radius_km: float = 150.0
    ) -> Dict[str, Any]:
        """
        MODE 2: SUPPLY-FIRST
        Farmer posts available harvest/stock -> Engine finds compatible bulk buyers & consumer demands.
        """
        supply_qty = supply.get("expected_quantity_kg") or supply.get("available_quantity_kg", 1000.0)
        farm_lat = supply.get("farm_latitude") or supply.get("location_latitude", 20.0)
        farm_lng = supply.get("farm_longitude") or supply.get("location_longitude", 73.0)
        harvest_date = supply.get("expected_harvest_date") or supply.get("harvest_date", date.today())
        min_price = supply.get("min_price_per_kg") or supply.get("price_per_kg", 20.0)
        quality = supply.get("quality_grade", "GRADE_A")

        ranked_demands = []

        for dem in candidate_demands:
            dist = calculate_haversine_distance(
                farm_lat, farm_lng, dem["delivery_latitude"], dem["delivery_longitude"]
            )

            status_val = str(dem.get("status", "")).upper()
            if dist <= max_radius_km and ("OPEN" in status_val or status_val == ""):
                req_qty = dem["required_quantity_kg"]
                target_date = dem["target_delivery_date"]
                budget = dem["max_price_per_kg"]
                req_quality = dem.get("quality_requirement", "GRADE_A")

                score_info = ranking_service.compute_match_score(
                    required_qty=req_qty,
                    candidate_qty=supply_qty,
                    distance_km=dist,
                    target_date=target_date,
                    candidate_date=harvest_date,
                    budget_max_price=budget,
                    candidate_price=min_price,
                    required_quality=req_quality,
                    candidate_quality=quality,
                    max_radius_km=max_radius_km
                )

                days_diff = abs((target_date - harvest_date).days)
                explanation = f"Matched buyer demand with {dist} km transport distance, price budget fit (Rs {budget:.2f}/kg vs ask Rs {min_price:.2f}/kg), and {days_diff} day date alignment."

                ranked_demands.append({
                    "demand_id": dem["id"],
                    "buyer_id": dem["posted_by_user_id"],
                    "is_bulk_demand": dem.get("is_bulk_demand", True),
                    "required_quantity_kg": req_qty,
                    "max_price_per_kg": budget,
                    "distance_km": dist,
                    "total_score": score_info["total_score"],
                    "sub_scores": score_info["sub_scores"],
                    "explanation": explanation
                })

        ranked_demands.sort(key=lambda x: x["total_score"], reverse=True)

        return {
            "mode": "SUPPLY_FIRST",
            "supply_id": supply.get("id"),
            "farmer_id": supply.get("farmer_id"),
            "matched_demands_count": len(ranked_demands),
            "top_recommended_demands": ranked_demands[:10]
        }

matching_engine = CoordinationEngine()
