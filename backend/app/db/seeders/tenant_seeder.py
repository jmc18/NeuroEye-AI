from app.db.seeders.platform_seeder import seed_platform
from app.repositories.unit_of_work import UnitOfWork


async def seed_tenants(uow: UnitOfWork, *, development: bool = False) -> None:
    await seed_platform(uow, development=development)
