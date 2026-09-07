from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    crops,
    demands,
    supplies,
    matching,
    orders,
    farmers,
    consumers,
    bulk_buyers,
    logistics,
    notifications,
    ai_analytics,
    price_transparency,
    feeds,
    voice_assistant_endpoint,
    voice_command_endpoint,
    voice_transcription_endpoint,
    tracking_endpoint,
    users
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & RBAC"])
api_router.include_router(crops.router, prefix="/crops", tags=["Crop Catalog"])
api_router.include_router(demands.router, prefix="/demands", tags=["Demand Posts (Buyer & Consumer)"])
api_router.include_router(supplies.router, prefix="/supplies", tags=["Expected Supply & Stock"])
api_router.include_router(matching.router, prefix="/matching", tags=["Pre-Market Matching Engine"])
api_router.include_router(orders.router, prefix="/orders", tags=["Order Management"])
api_router.include_router(farmers.router, prefix="/farmers", tags=["Farmer & FPO Workflows"])
api_router.include_router(consumers.router, prefix="/consumers", tags=["Consumer Direct Workflows"])
api_router.include_router(bulk_buyers.router, prefix="/bulk-buyers", tags=["Bulk Buyer Procurement"])
api_router.include_router(logistics.router, prefix="/logistics", tags=["Logistics & Delivery Jobs"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["In-App Notifications"])
api_router.include_router(ai_analytics.router, prefix="/ai", tags=["AI Forecasting"])
api_router.include_router(price_transparency.router, prefix="/price-transparency", tags=["Price Breakdown"])
api_router.include_router(feeds.router, prefix="/feeds", tags=["Unified Demand & Supply Feeds"])
api_router.include_router(voice_assistant_endpoint.router, prefix="/voice", tags=["Voice Assistance"])
api_router.include_router(voice_command_endpoint.router, prefix="/voice", tags=["Voice Command Processing"])
api_router.include_router(voice_transcription_endpoint.router, prefix="/voice", tags=["Voice Transcription Engine"])
api_router.include_router(tracking_endpoint.router, prefix="/tracking", tags=["Order & Shipment Live Tracking"])
api_router.include_router(users.router, prefix="/users", tags=["Users Directory"])
