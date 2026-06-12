from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str

    db_host: str
    db_port: int
    db_name: str
    db_user: str
    db_password: str

    redis_host: str
    redis_port: int

    jwt_secret_key: str
    jwt_algorithm: str

    model_config = SettingsConfigDict(
        env_file=_BACKEND_DIR / ".env",
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://"
            f"{self.db_user}:{self.db_password}@"
            f"{self.db_host}:{self.db_port}/"
            f"{self.db_name}"
        )


settings = Settings()
