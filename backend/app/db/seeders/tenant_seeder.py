from app.db.seeders.platform_seeder import seed_platform
from app.db.seeders.clinical_seeder import seed_clinical_domain, seed_demo_clinic
from app.repositories.unit_of_work import UnitOfWork


async def seed_tenants(uow: UnitOfWork, *, development: bool = False) -> None:
    await seed_platform(uow, development=development)
    await seed_clinical_domain(uow, development=development)
    await seed_demo_clinic(uow, development=development)

