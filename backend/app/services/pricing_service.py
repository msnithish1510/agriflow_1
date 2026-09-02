import math
from typing import Dict, Any, List, Optional

class PricingService:
    """
    AGRIFlow Price Guidance & Farmer Net Realization Engine.
    Provides advisory crop price guidance, farmer net realization breakdown, buyer offer comparisons,
    and urban consumer price transparency with clear ESTIMATED vs ACTUAL labels.
    """

    HISTORICAL_BASE_PRICES = {
        "Tomato": 25.0,
        "Onion": 22.0,
        "Potato": 18.0,
        "Wheat": 22.5,
        "Paddy (Rice)": 26.0,
        "Moong (Green Gram)": 75.0,
        "Cotton": 62.0,
        "Soybean": 48.0
    }

    SEASONAL_MULTIPLIERS = {
        1: 1.12, 2: 1.08, 3: 0.95, 4: 0.90, 5: 0.85, 6: 0.95,
        7: 1.20, 8: 1.25, 9: 1.15, 10: 1.05, 11: 0.95, 12: 1.00
    }

    def get_advisory_price_guidance(
        self,
        crop_name: str,
        district: str = "Nashik",
        season_month: int = 9,
        demand_level: str = "HIGH",
        supply_level: str = "BALANCED"
    ) -> Dict[str, Any]:
        """
        Advisory Price Guidance Generator.
        IMPORTANT: Price guidance is strictly advisory. AGRIFlow does NOT force farmer listing prices.
        """
        base_price = self.HISTORICAL_BASE_PRICES.get(crop_name, 25.0)
        s_factor = self.SEASONAL_MULTIPLIERS.get(season_month, 1.0)
        
        d_factor = 1.12 if demand_level == "HIGH" else (0.92 if demand_level == "LOW" else 1.0)
        sp_factor = 0.90 if supply_level == "SURPLUS" else (1.10 if supply_level == "DEFICIT" else 1.0)

        target_recommended = round(base_price * s_factor * d_factor * sp_factor, 2)
        min_range = round(target_recommended * 0.90, 2)
        max_range = round(target_recommended * 1.12, 2)

        return {
            "crop_name": crop_name,
            "district": district,
            "advisory_notice": "Price guidance is strictly advisory to help farmers negotiate fair returns. Farmers retain full pricing autonomy.",
            "suggested_price_range": {
                "min_price_per_kg": min_range,
                "max_price_per_kg": max_range,
                "recommended_target_price_per_kg": target_recommended
            },
            "market_indicators": {
                "historical_base_price": base_price,
                "seasonality_factor": s_factor,
                "demand_level": demand_level,
                "supply_level": supply_level
            }
        }

    def calculate_farmer_net_realization(
        self,
        gross_buyer_price_per_kg: float = 30.0,
        distance_km: float = 50.0,
        perishability: str = "HIGH",
        transport_override: Optional[float] = None,
        handling_override: Optional[float] = None,
        spoilage_override: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Farmer Net Realization Calculator.
        Formula: Gross Buyer Price - Transport - Handling - Expected Spoilage - Platform Fee = Net Realization.
        Example: ₹30/kg Gross - ₹2 Transport - ₹1 Handling - ₹0.80 Spoilage - ₹0.50 Platform = ₹25.70/kg Net.
        """
        # 1. Transport Estimate
        if transport_override is not None:
            transport_cost = round(transport_override, 2)
        else:
            rate = 0.04 if perishability == "HIGH" else 0.025
            transport_cost = round(distance_km * rate, 2)

        # 2. Handling Cost
        if handling_override is not None:
            handling_cost = round(handling_override, 2)
        else:
            handling_map = {"HIGH": 1.50, "MEDIUM": 1.00, "LOW": 0.50}
            handling_cost = handling_map.get(perishability, 1.00)

        # 3. Expected Spoilage Cost
        if spoilage_override is not None:
            spoilage_cost = round(spoilage_override, 2)
        else:
            spoilage_rate = 0.03 if perishability == "HIGH" else (0.015 if perishability == "MEDIUM" else 0.005)
            spoilage_cost = round(gross_buyer_price_per_kg * spoilage_rate, 2)

        # 4. Other / Platform Fee (1.5%)
        platform_fee = round(gross_buyer_price_per_kg * 0.015, 2)

        # Total Deductions
        total_deductions = round(transport_cost + handling_cost + spoilage_cost + platform_fee, 2)

        # Estimated Farmer Net Realization
        estimated_net_realization = round(max(0.0, gross_buyer_price_per_kg - total_deductions), 2)
        net_percentage = round((estimated_net_realization / max(0.01, gross_buyer_price_per_kg)) * 100, 1)

        return {
            "gross_buyer_price_per_kg": gross_buyer_price_per_kg,
            "deductions": {
                "transport_cost": transport_cost,
                "handling_cost": handling_cost,
                "expected_spoilage_cost": spoilage_cost,
                "platform_fee": platform_fee,
                "total_deductions_per_kg": total_deductions
            },
            "estimated_farmer_net_realization_per_kg": estimated_net_realization,
            "net_realization_percentage": net_percentage,
            "itemized_example_str": f"Gross buyer price (Rs. {gross_buyer_price_per_kg:.2f}/kg) - Transport (Rs. {transport_cost:.2f}) - Handling (Rs. {handling_cost:.2f}) - Spoilage (Rs. {spoilage_cost:.2f}) - Other (Rs. {platform_fee:.2f}) = Estimated Net Realization Rs. {estimated_net_realization:.2f}/kg ({net_percentage}%)"
        }

    def compare_buyer_offers(
        self,
        farmer_ask_price: float = 24.0,
        buyer_offers: List[Dict[str, Any]] = []
    ) -> Dict[str, Any]:
        """
        Buyer Offers Comparison Engine.
        Compares multiple buyer procurement offers for a farmer's crop.
        """
        if not buyer_offers:
            # Default sample comparison matrix
            buyer_offers = [
                {"buyer_name": "Reliance Retail DC", "offered_price_per_kg": 30.0, "distance_km": 45.0, "delivery_date": "2026-09-20", "payment_terms": "Immediate UPI"},
                {"buyer_name": "DeHaat Direct Hub", "offered_price_per_kg": 29.5, "distance_km": 20.0, "delivery_date": "2026-09-18", "payment_terms": "24h Bank Transfer"},
                {"buyer_name": "Local Trader APMC", "offered_price_per_kg": 26.0, "distance_km": 12.0, "delivery_date": "2026-09-15", "payment_terms": "7 Days Credit"}
            ]

        compared_results = []
        for b in buyer_offers:
            gross = b["offered_price_per_kg"]
            dist = b["distance_km"]
            
            calc = self.calculate_farmer_net_realization(
                gross_buyer_price_per_kg=gross,
                distance_km=dist
            )

            compared_results.append({
                "buyer_name": b["buyer_name"],
                "offered_price_per_kg": gross,
                "distance_km": dist,
                "delivery_date": b["delivery_date"],
                "payment_terms": b["payment_terms"],
                "estimated_net_realization_per_kg": calc["estimated_farmer_net_realization_per_kg"],
                "net_percentage": calc["net_realization_percentage"],
                "total_deductions_per_kg": calc["deductions"]["total_deductions_per_kg"]
            })

        # Sort buyers by net realization payout descending
        compared_results.sort(key=lambda x: x["estimated_net_realization_per_kg"], reverse=True)

        return {
            "farmer_ask_price_per_kg": farmer_ask_price,
            "compared_buyer_offers_count": len(compared_results),
            "top_recommended_buyer": compared_results[0] if compared_results else None,
            "comparison_matrix": compared_results
        }

    def get_urban_price_transparency(
        self,
        farmer_price_per_kg: float = 24.0,
        perishability: str = "HIGH",
        distance_km: float = 50.0,
        is_urban: bool = True
    ) -> Dict[str, Any]:
        """
        Urban Price Transparency Model with explicit ESTIMATED vs ACTUAL labels.
        Formula: Farmer Price (ACTUAL) + Collection (ESTIMATED) + Handling (ESTIMATED) + Transport (ESTIMATED) + Market Margin (ESTIMATED) + Platform Fee (ACTUAL) = Final Consumer Price.
        """
        collection_fee = 1.00
        handling_fee = 1.50 if perishability == "HIGH" else 0.80
        transport_fee = round(distance_km * (0.04 if perishability == "HIGH" else 0.025), 2)
        intermediary_margin = round(farmer_price_per_kg * 0.08, 2) if is_urban else 0.0
        platform_fee = round(farmer_price_per_kg * 0.015, 2)

        final_price = round(farmer_price_per_kg + collection_fee + handling_fee + transport_fee + intermediary_margin + platform_fee, 2)

        breakdown_items = [
            {"component": "Farmer/FPO Price", "amount": farmer_price_per_kg, "type": "ACTUAL", "description": "Direct payout guaranteed to smallholder farmer"},
            {"component": "Collection", "amount": collection_fee, "type": "ESTIMATED", "description": "Local aggregation hub collection cost"},
            {"component": "Handling & Grading", "amount": handling_fee, "type": "ESTIMATED", "description": "Sorting, washing, and protective packaging"},
            {"component": "Transport Logistics", "amount": transport_fee, "type": "ESTIMATED", "description": "Refrigerated/freight transit cost for distance"},
            {"component": "Intermediary / Market Margin", "amount": intermediary_margin, "type": "ESTIMATED" if is_urban else "ACTUAL", "description": "Local urban wholesale distribution markup"},
            {"component": "Platform Coordination Fee", "amount": platform_fee, "type": "ACTUAL", "description": "AGRIFlow platform coordination fee (1.5%)"}
        ]

        return {
            "farmer_price_per_kg": farmer_price_per_kg,
            "final_consumer_price_per_kg": final_price,
            "is_urban_model": is_urban,
            "breakdown_items": breakdown_items,
            "percentages": {
                "farmer_share": round((farmer_price_per_kg / final_price) * 100, 1),
                "logistics_handling_share": round(((collection_fee + handling_fee + transport_fee) / final_price) * 100, 1),
                "margin_share": round((intermediary_margin / final_price) * 100, 1),
                "platform_share": round((platform_fee / final_price) * 100, 1)
            }
        }

pricing_service = PricingService()
