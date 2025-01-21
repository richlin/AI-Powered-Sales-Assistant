import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .dev file
load_dotenv(".dev")


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AI-Powered Sales Assistant"

    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4o-mini"
    MAX_TOKENS: int = 1000

    # File Upload Configuration
    UPLOAD_DIR: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"
    )
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png"]

    class Config:
        case_sensitive = True


# Create global settings object
settings = Settings()

# Ensure upload directory exists with proper permissions
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.chmod(settings.UPLOAD_DIR, 0o755)  # rwxr-xr-x permissions
