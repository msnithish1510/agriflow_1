from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from app.services.pricing_service import pricing_service

router = APIRouter()

@router.get("/guidance")
def get_advisory_price_guidance(
    crop_name: str = Query("Tomato"),
    district: str = Query("Nashik"),
    season_month: int = Query(9, ge=1, le=12),
    demand_level: str = Query("HIGH"),
    supply_level: str = Query("BALANCED")
):
    """
    Advisory Crop Price Guidance & Market Indicators.
    IMPORTANT: Guidance is strictly advisory. AGRIFlow does NOT force farmer listing prices.
    """
    return pricing_service.get_advisory_price_guidance(
        crop_name=crop_name,
        district=district,
        season_month=season_month,
        demand_level=demand_level,
        supply_level=supply_level
    )

@router.get("/net-realization")
def get_farmer_net_realization_calculator(
    gross_buyer_price: float = Query(30.0),
    distance_km: float = Query(50.0),
    perishability: str = Query("HIGH"),
    transport_cost: Optional[float] = Query(None),
    handling_cost: Optional[float] = Query(None),
    spoilage_cost: Optional[float] = Query(None)
):
    """
    Farmer Net Realization Calculator.
    Calculates itemized deductions (transport, handling, expected spoilage, platform fee) to yield net payout per kg.
    Example: Gross Rs 30 - Transport Rs 2 - Handling Rs 1 - Spoilage Rs 0.80 - Other Rs 0.50 = Net Rs 25.70/kg.
    """
    return pricing_service.calculate_farmer_net_realization(
        gross_buyer_price_per_kg=gross_buyer_price,
        distance_km=distance_km,
        perishability=perishability,
        transport_override=transport_cost,
        handling_override=handling_cost,
        spoilage_override=spoilage_cost
    )

@router.get("/buyer-comparison")
def compare_competing_buyer_offers(farmer_ask_price: float = Query(24.0)):
    """
    Buyer Offers Comparison Engine.
    Generates comparison matrix across competing buyer procurement offers for a crop.
    """
    return pricing_service.compare_buyer_offers(farmer_ask_price=farmer_ask_price)

@router.get("/urban-breakdown")
def get_urban_price_transparency_model(
    farmer_price: float = Query(24.0),
    perishability: str = Query("HIGH"),
    distance_km: float = Query(50.0),
    is_urban: bool = Query(True)
):
    """
    SIH26033 Urban Price Transparency Model with explicit ESTIMATED vs ACTUAL labels.
    Formula: Farmer Price (ACTUAL) + Collection (ESTIMATED) + Handling (ESTIMATED) + Transport (ESTIMATED) + Intermediary Margin (ESTIMATED) + Platform Fee (ACTUAL) = Final Consumer Price.
    """
    return pricing_service.get_urban_price_transparency(
        farmer_price_per_kg=farmer_price,
        perishability=perishability,
        distance_km=distance_km,
        is_urban=is_urban
    )

# Maintain backward compatibility
@router.get("/breakdown")
def legacy_breakdown(
    farmer_price: float = Query(24.0),
    perishability: str = Query("HIGH"),
    distance_km: float = Query(50.0),
    is_urban: bool = Query(True)
):
    return pricing_service.get_urban_price_transparency(
        farmer_price_per_kg=farmer_price,
        perishability=perishability,
        distance_km=distance_km,
        is_urban=is_urban
    )
