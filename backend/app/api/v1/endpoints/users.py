from fastapi import APIRouter
from typing import List, Optional

router = APIRouter()

@router.get("/")
def list_users(role: Optional[str] = None):
    """
    List registered platform users (Farmers, FPOs, Buyers, Consumers, Logistics).
    """
    return {
        "status": "SUCCESS",
        "message": "User query endpoint structure. Seed data loaded in demo mode.",
        "filter_role": role
    }
