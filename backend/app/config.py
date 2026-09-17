import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "LandWatch - National Land Acquisition Risk Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "landwatch-sih2026-super-secure-production-secret-key-99881122")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # SQLite default with absolute/relative path fallback
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./landwatch.db")
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "*"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
