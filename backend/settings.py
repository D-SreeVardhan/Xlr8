from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")
    openai_default_model: str = Field(default="gpt-4o-mini", alias="OPENAI_DEFAULT_MODEL")
    openai_reasoning_model: str = Field(default="gpt-4o", alias="OPENAI_REASONING_MODEL")
    offline_mode: bool = Field(default=False, alias="XL8_OFFLINE_MODE")
    seed: int = Field(default=20260526, alias="XL8_SEED")
    database_url: str = Field(default="sqlite:///./data/cockpit.db", alias="DATABASE_URL")
    frontend_origin: str = Field(default="http://localhost:3000", alias="FRONTEND_ORIGIN")


@lru_cache
def get_settings() -> Settings:
    return Settings()
