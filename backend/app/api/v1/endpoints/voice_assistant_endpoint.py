from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.db.session import get_db
from app.services.voice_assistant import voice_assistant_service

router = APIRouter()

class SpokenListingRequest(BaseModel):
    spoken_text: str = "I have 500 kg tomato available tomorrow at ₹28 per kg."
    language: str = "en"

class VoiceQueryRequest(BaseModel):
    query_text: str = "What demand is available near me?"
    district: str = "Nashik"
    crop_name: str = "Tomato"
    language: str = "en"

@router.post("/parse-spoken-listing")
def parse_spoken_listing(payload: SpokenListingRequest):
    """
    Parses spoken voice input (e.g. "I have 500 kg tomato available tomorrow at ₹28 per kg") into structured entities.
    Returns pre-submit confirmation screen payload.
    """
    return voice_assistant_service.parse_spoken_listing(
        spoken_text=payload.spoken_text,
        lang=payload.language
    )

@router.post("/query")
def process_voice_query(payload: VoiceQueryRequest, db: Session = Depends(get_db)):
    """
    Processes voice & text questions grounded in live backend database records (demands, buyers, forecasts, net realization).
    Never hallucinates data.
    """
    return voice_assistant_service.process_farmer_query(
        query_text=payload.query_text,
        farmer_district=payload.district,
        farmer_crop=payload.crop_name,
        lang=payload.language,
        db=db
    )

@router.get("/locales")
def get_supported_locales():
    """
    Returns supported regional languages and prompt localization dictionaries.
    """
    return {
        "supported_languages": [
            {"code": "en", "label": "English"},
            {"code": "ta", "label": "Tamil (தமிழ்)"}
        ],
        "locale_dictionaries": voice_assistant_service.LOCALES
    }
