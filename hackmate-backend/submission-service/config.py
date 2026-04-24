from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    github_api_token: str = ""  # optional — increases rate limit from 60 to 5000 req/hr

    class Config:
        env_file = ".env"


settings = Settings()
