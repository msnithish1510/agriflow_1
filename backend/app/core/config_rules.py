from typing import Dict, Any

class SystemConfigRules:
    """
    AGRIFlow Business Model & Geographic Rules Configuration Engine.
    Configurable parameters avoiding hardcoded assumptions.
    """

    RURAL_RULES = {
        "mode_name": "RURAL",
        "max_search_radius_km": 50.0,
        "intermediary_margin_pct": 0.0, # 0% middleman cut in direct rural model
        "platform_fee_pct": 1.5,
        "price_transparency_mode": "DIRECT_FARM_PAYOUT",
        "allowed_order_types": ["DEMAND_FIRST_BULK", "DEMAND_FIRST_HOUSEHOLD", "SUPPLY_FIRST_BULK", "SUPPLY_FIRST_HOUSEHOLD"]
    }

    URBAN_RULES = {
        "mode_name": "URBAN",
        "max_search_radius_km": 150.0,
        "intermediary_margin_pct": 8.0, # 8% wholesale urban distribution margin
        "platform_fee_pct": 1.5,
        "price_transparency_mode": "FULL_PRICE_BUILDING_TRANSPARENCY",
        "allowed_order_types": ["DEMAND_FIRST_BULK", "SUPPLY_FIRST_BULK", "URBAN_RETAIL"]
    }

    PERISHABILITY_SPEED_THRESHOLDS = {
        "HIGH": {"max_transit_hours": 6.0, "refrigeration_required": True},
        "MEDIUM": {"max_transit_hours": 12.0, "refrigeration_required": False},
        "LOW": {"max_transit_hours": 24.0, "refrigeration_required": False}
    }

    def get_rules_for_mode(self, is_urban: bool = False) -> Dict[str, Any]:
        return self.URBAN_RULES if is_urban else self.RURAL_RULES

config_rules = SystemConfigRules()
