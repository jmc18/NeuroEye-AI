"""Database startup — Alembic migrations + seeders (EF Core Migrate + Seed equivalent)."""

from __future__ import annotations

import asyncio
import re
from contextlib import contextmanager
from pathlib import Path

import structlog
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.db.seeders import run_seeders

logger = structlog.get_logger(__name__)

_BACKEND_DIR = Path(__file__).resolve().parents[2]
_ALEMBIC_INI = _BACKEND_DIR / "alembic.ini"
_ADVISORY_LOCK_ID = 0x4E45F4442  # "NE_DB"


def is_development() -> bool:
    return settings.app_env.lower() == "development"


def should_run_seeders() -> bool:
    if not settings.run_seeders_on_startup:
        return False
    if settings.seeders_development_only and not is_development():
        return False
    return True


_DB_NAME_PATTERN = re.compile(r"^[a-zA-Z_][a-zA-Z0-9_]*$")


def ensure_database_exists() -> None:
    """Create the application database if missing (PostgreSQL has no auto-create on connect)."""
    db_name = settings.db_name
    if not _DB_NAME_PATTERN.fullmatch(db_name):
        raise ValueError(f"Invalid database name: {db_name!r}")

    engine = create_engine(
        settings.maintenance_database_url,
        poolclass=NullPool,
        isolation_level="AUTOCOMMIT",
    )
    try:
        with engine.connect() as connection:
            exists = connection.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :name"),
                {"name": db_name},
            ).scalar()
            if exists:
                return

            logger.info("database_creating", name=db_name)
            connection.execute(text(f'CREATE DATABASE "{db_name}"'))
            logger.info("database_created", name=db_name)
    finally:
        engine.dispose()


def run_migrations() -> None:
    alembic_cfg = Config(str(_ALEMBIC_INI))
    alembic_cfg.set_main_option(
        "sqlalchemy.url",
        settings.database_url.replace("%", "%%"),
    )
    logger.info("database_migrations_started")
    command.upgrade(alembic_cfg, "head")
    logger.info("database_migrations_completed")


@contextmanager
def _postgres_advisory_lock():
    engine = create_engine(settings.database_url, poolclass=NullPool)
    connection = engine.connect()
    try:
        connection.execute(
            text("SELECT pg_advisory_lock(:lock_id)"),
            {"lock_id": _ADVISORY_LOCK_ID},
        )
        connection.commit()
        yield
    finally:
        connection.execute(
            text("SELECT pg_advisory_unlock(:lock_id)"),
            {"lock_id": _ADVISORY_LOCK_ID},
        )
        connection.commit()
        connection.close()
        engine.dispose()


def _run_sync_migrations() -> None:
    if not settings.run_migrations_on_startup:
        return

    with _postgres_advisory_lock():
        run_migrations()


def _ensure_database_if_needed() -> None:
    if settings.run_migrations_on_startup or should_run_seeders():
        ensure_database_exists()


def prepare_database_sync() -> None:
    """CLI / entrypoint — no uvicorn event loop running."""
    if not settings.run_migrations_on_startup and not should_run_seeders():
        return

    _ensure_database_if_needed()
    _run_sync_migrations()

    if should_run_seeders():
        from app.core.async_runtime import run_async

        run_async(run_seeders(development=is_development()))


async def prepare_database_on_startup() -> None:
    """FastAPI lifespan — seeders run on the app event loop (not asyncio.run in a thread)."""
    if not settings.run_db_startup_in_lifespan:
        return

    if not settings.run_migrations_on_startup and not should_run_seeders():
        return

    await asyncio.to_thread(_ensure_database_if_needed)
    await asyncio.to_thread(_run_sync_migrations)

    if should_run_seeders():
        await run_seeders(development=is_development())


def main() -> None:
    structlog.configure(
        processors=[
            structlog.processors.add_log_level,
            structlog.dev.ConsoleRenderer(),
        ],
    )
    from app.core.container import container

    container.wire(modules=["app.dependencies.database"])
    prepare_database_sync()


if __name__ == "__main__":
    main()
