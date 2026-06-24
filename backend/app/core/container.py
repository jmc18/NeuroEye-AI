from dependency_injector import containers, providers
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core.config import settings
from app.repositories.unit_of_work import UnitOfWork


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=[
            "app.dependencies.database",
        ],
    )

    async_engine = providers.Singleton(
        create_async_engine,
        settings.database_url,
        pool_pre_ping=True,
    )

    async_session_factory = providers.Singleton(
        async_sessionmaker,
        bind=async_engine,
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
    )

    unit_of_work = providers.Factory(
        UnitOfWork,
        session_factory=async_session_factory,
    )


container = Container()
