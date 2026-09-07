import os
import logging
import requests
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".webm", ".ogg", ".wav", ".mp3", ".m4a", ".mp4", ".aac", ".flac"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB


class TranscriptionResponse(BaseModel):
    success: bool
    text: str
    language: Optional[str] = None
    error: Optional[str] = None


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Accepts recorded audio file (multipart/form-data) from browser MediaRecorder.
    Sends audio to Groq Whisper (whisper-large-v3-turbo) for speech-to-text transcription.
    Supports English, Tamil, and Tamil-English code-switching speech.
    """
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No audio file provided in request."
        )

    # Validate file extension if available
    filename_lower = file.filename.lower()
    ext = os.path.splitext(filename_lower)[1]
    if ext and ext not in ALLOWED_EXTENSIONS and "audio" not in (file.content_type or ""):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported audio format '{ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read audio bytes & validate size
    try:
        content = await file.read()
    except Exception as e:
        logger.error(f"Error reading uploaded audio file: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not read audio file payload."
        )

    if not content or len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded audio file is empty."
        )

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Audio file exceeds the maximum 25MB size limit."
        )

    # Determine Groq API Key
    groq_api_key = getattr(settings, "GROQ_API_KEY", None) or os.getenv("GROQ_API_KEY")

    if not groq_api_key or groq_api_key.strip() == "" or groq_api_key.startswith("your_"):
        logger.warning("GROQ_API_KEY is not configured in backend environment.")
        return TranscriptionResponse(
            success=False,
            text="",
            error="GROQ_API_KEY is not configured in backend environment. Please set GROQ_API_KEY in backend/.env."
        )

    # Call Groq Whisper API (whisper-large-v3-turbo)
    groq_url = "https://api.groq.com/openai/v1/audio/transcriptions"
    headers = {
        "Authorization": f"Bearer {groq_api_key.strip()}"
    }

    mime_type = file.content_type or "audio/webm"
    files = {
        "file": (file.filename or "recording.webm", content, mime_type)
    }
    data = {
        "model": "whisper-large-v3-turbo",
        "temperature": "0.0",
        "response_format": "verbose_json"
    }

    try:
        response = requests.post(
            groq_url,
            headers=headers,
            files=files,
            data=data,
            timeout=25.0
        )

        if response.status_code != 200:
            logger.error(f"Groq Whisper API returned error HTTP {response.status_code}: {response.text}")
            return TranscriptionResponse(
                success=False,
                text="",
                error=f"Groq API error (HTTP {response.status_code}): {response.text}"
            )

        resp_json = response.json()
        transcribed_text = resp_json.get("text", "").strip()
        detected_language = resp_json.get("language")

        return TranscriptionResponse(
            success=True,
            text=transcribed_text,
            language=detected_language
        )

    except requests.exceptions.Timeout:
        logger.error("Groq Whisper API request timed out after 25 seconds.")
        return TranscriptionResponse(
            success=False,
            text="",
            error="Transcription service timed out. Please try speaking again."
        )
    except Exception as e:
        logger.error(f"Failed to communicate with Groq Whisper API: {e}")
        return TranscriptionResponse(
            success=False,
            text="",
            error=f"Transcription error: {str(e)}"
        )
