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
    jwt_access_token_expire_minutes: int = 60 * 24

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    public_api_url: str = "http://localhost:8000"

    app_env: str = "development"
    run_migrations_on_startup: bool = True
    run_seeders_on_startup: bool = True
    seeders_development_only: bool = False
    run_db_startup_in_lifespan: bool = True

    seed_platform_email: str
    seed_platform_password: str
    seed_platform_first_name: str
    seed_platform_last_name: str = ""
    seed_platform_second_last_name: str = ""

    model_config = SettingsConfigDict(
        env_file=_BACKEND_DIR / ".env",
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        return self._database_url(self.db_name)

    @property
    def maintenance_database_url(self) -> str:
        """Connect to the default `postgres` database (for CREATE DATABASE)."""
        return self._database_url("postgres")

    def _database_url(self, database_name: str) -> str:
        return (
            f"postgresql+psycopg://"
            f"{self.db_user}:{self.db_password}@"
            f"{self.db_host}:{self.db_port}/"
            f"{database_name}"
        )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
