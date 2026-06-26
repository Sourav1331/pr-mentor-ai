from functools import lru_cache
from typing import List

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings


load_dotenv()


class Settings(BaseSettings):
    github_token: str | None = Field(default=None, alias="GITHUB_TOKEN")
    groq_api_key: str | None = Field(default=None, alias="GROQ_API_KEY")
    allowed_origins: str = Field(
        default="http://localhost:5173", alias="ALLOWED_ORIGINS"
    )
    github_api_base_url: str = "https://api.github.com"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
