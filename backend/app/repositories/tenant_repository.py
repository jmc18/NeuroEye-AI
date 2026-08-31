from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tenant import Tenant
from app.repositories.base import BaseRepository


class TenantRepository(BaseRepository[Tenant]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Tenant)

    async def get_by_name(self, name: str) -> Tenant | None:
        return await self._session.scalar(
            select(Tenant).where(
                Tenant.name == name,
                Tenant.is_deleted.is_(False),
            )
        )

    async def list_all(self) -> list[Tenant]:
        result = await self._session.scalars(
            select(Tenant)
            .where(Tenant.is_deleted.is_(False))
            .order_by(Tenant.name)
        )
        return list(result.all())
