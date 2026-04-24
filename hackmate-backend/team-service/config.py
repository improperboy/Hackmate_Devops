from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    max_team_size: int = 4

    class Config:
        env_file = ".env"


settings = Settings()
