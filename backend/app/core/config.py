from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from urllib import parse

class Settings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    debug: bool = True

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[2] / ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def _dsn_tail(self) -> str:
        """"""
        return (
            f"{self.POSTGRES_USER}:{parse.quote(self.POSTGRES_PASSWORD)}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def database_url(self):
        return f"postgresql://{self._dsn_tail}"

    @property
    def sqlalchemy_url(self) -> str:
        return f"postgresql+psycopg://{self._dsn_tail}"

settings = Settings()   # type: ignore[call-arg]