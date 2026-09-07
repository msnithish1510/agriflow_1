from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from app.services.voice_assistant import voice_assistant_service

router = APIRouter()


class VoiceCommandRequest(BaseModel):
    text: str = "Show my tomato demand"
    language: str = "en"
    user_role: str = "FARMER"
    context: Dict[str, Any] = {}


class VoiceCommandResponse(BaseModel):
    intent: str
    response: str
    action: Dict[str, Any]
    requires_confirmation: bool
    suggestions: List[str]
    entities: Dict[str, Any]


@router.post("/command", response_model=VoiceCommandResponse)
def process_voice_command(payload: VoiceCommandRequest):
    """
    Process a voice/text command with intent detection, role-aware response,
    and navigation action mapping.
    """
    result = voice_assistant_service.process_voice_command(
        text=payload.text,
        language=payload.language,
        user_role=payload.user_role,
        context=payload.context
    )
    return result
