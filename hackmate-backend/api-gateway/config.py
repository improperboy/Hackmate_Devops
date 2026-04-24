from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    jwt_secret: str
    jwt_algorithm: str = "HS256"

    auth_service_url: str
    user_service_url: str
    team_service_url: str
    scoring_service_url: str
    submission_service_url: str
    notification_service_url: Optional[str] = ""
    chatbot_service_url: Optional[str] = ""
    admin_service_url: str

    # Rate limiting
    rate_limit_requests: int = 100   # requests per window
    rate_limit_window: int = 60      # seconds

    # Upstash Redis (HTTP REST — used by rate limiter)
    upstash_redis_rest_url: str = ""
    upstash_redis_rest_token: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
