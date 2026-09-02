from typing import Dict, Any

class PriceTransparencyService:
    """
    AGRIFlow Urban & Rural Price Transparency Engine.
    Implements mandatory SIH26033 price breakdown transparency logic:
    Farmer Price + Handling + Transport + Intermediary Margin + Platform Fee = Final Consumer Price.
    """

    def calculate_price_breakdown(
        self,
        farmer_price_per_kg: float,
        perishability: str = "HIGH",
        distance_km: float = 50.0,
        is_urban: bool = True
    ) -> Dict[str, Any]:
        
        # 1. Collection & Handling fee (grading, sorting, packaging)
        handling_map = {"HIGH": 2.50, "MEDIUM": 1.50, "LOW": 0.80}
        handling_fee = handling_map.get(perishability, 1.50)

        # 2. Transport fee (per km/kg rate based on refrigerated/freight vehicle)
        transport_rate = 0.04 if perishability == "HIGH" else 0.025
        transport_fee = round(distance_km * transport_rate, 2)

        # 3. Intermediary / Market Margin (Audited market markup where applicable, 0 in direct rural model)
        intermediary_margin = round(farmer_price_per_kg * 0.08, 2) if is_urban else 0.0

        # 4. Platform coordination fee (1.5% fixed)
        platform_fee = round(farmer_price_per_kg * 0.015, 2)

        # 5. Final Consumer Price
        final_consumer_price = round(
            farmer_price_per_kg + handling_fee + transport_fee + intermediary_margin + platform_fee,
            2
        )

        # Farmer net realization
        farmer_net_realization = farmer_price_per_kg # Direct payout

        percentages = {
            "farmer_share": round((farmer_price_per_kg / final_consumer_price) * 100, 1),
            "handling_share": round((handling_fee / final_consumer_price) * 100, 1),
            "transport_share": round((transport_fee / final_consumer_price) * 100, 1),
            "intermediary_share": round((intermediary_margin / final_consumer_price) * 100, 1),
            "platform_share": round((platform_fee / final_consumer_price) * 100, 1),
        }

        return {
            "farmer_price_per_kg": farmer_price_per_kg,
            "collection_handling_fee": handling_fee,
            "transport_fee_per_kg": transport_fee,
            "market_intermediary_margin": intermediary_margin,
            "platform_coordination_fee": platform_fee,
            "final_consumer_price_per_kg": final_consumer_price,
            "farmer_net_realization_per_kg": farmer_net_realization,
            "breakdown_percentages": percentages
        }

price_transparency_service = PriceTransparencyService()
