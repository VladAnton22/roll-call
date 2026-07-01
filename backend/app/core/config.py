from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from urllib import parse

class Settings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[2] / ".env",
        env_file_encoding="utf-8",
    )

    @property
    def database_url(self):
        return f"postgresql://{self.POSTGRES_USER}:{parse.quote(self.POSTGRES_PASSWORD)}@{self.POSTGRES_HOST}/{self.POSTGRES_DB}"

settings = Settings()   # type: ignore[call-arg]