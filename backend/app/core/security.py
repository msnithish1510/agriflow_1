import hashlib
import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from jose import jwt
from app.core.config import settings

ALGORITHM = "HS256"

def get_password_hash(password: str) -> str:
    """
    Generates PBKDF2 SHA256 hashed password string.
    """
    salt = "agriflow_sih2026_salt"
    pwd_bytes = (password + salt).encode('utf-8')
    return hashlib.sha256(pwd_bytes).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies plain text password against SHA256 hash.
    """
    return get_password_hash(plain_password) == hashed_password

def create_access_token(subject: str | Any, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
