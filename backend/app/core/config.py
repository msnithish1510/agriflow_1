import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AGRIFlow AI Pre-Market Agricultural Coordination"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "agriflow_secret_key_sih2026_dev_mode"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # DB URL - defaults to local SQLite demo db if Postgres not configured
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agriflow_demo.db")

    class Config:
        case_sensitive = True

settings = Settings()
