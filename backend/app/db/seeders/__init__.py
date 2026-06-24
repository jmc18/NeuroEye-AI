import structlog

from app.core.async_runtime import run_async
from app.core.container import container
from app.db.seeders.tenant_seeder import seed_tenants

logger = structlog.get_logger(__name__)


async def run_seeders() -> None:
    uow = container.unit_of_work()
    try:
        await seed_tenants(uow)
        await uow.commit()
        logger.info("seeders_completed")
    except Exception:
        await uow.rollback()
        raise
    finally:
        await uow.close()


def main() -> None:
    structlog.configure(
        processors=[
            structlog.processors.add_log_level,
            structlog.dev.ConsoleRenderer(),
        ],
    )
    run_async(run_seeders())


if __name__ == "__main__":
    main()
