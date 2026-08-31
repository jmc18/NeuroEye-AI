from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.test_preset import TestPreset
from app.repositories.base import BaseRepository


class TestPresetRepository(BaseRepository[TestPreset]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, TestPreset)

    async def list_for_tenant(self, tenant_id: str) -> list[TestPreset]:
        result = await self._session.scalars(
            select(TestPreset)
            .where(
                TestPreset.tenant_id == tenant_id,
                TestPreset.is_deleted.is_(False),
            )
            .order_by(TestPreset.name)
        )
        return list(result.all())

    async def get_by_code(self, tenant_id: str, code: str) -> TestPreset | None:
        return await self._session.scalar(
            select(TestPreset).where(
                TestPreset.tenant_id == tenant_id,
                TestPreset.code == code,
                TestPreset.is_deleted.is_(False),
            )
        )

    async def get_for_tenant(self, preset_id: str, tenant_id: str) -> TestPreset | None:
        return await self._session.scalar(
            select(TestPreset).where(
                TestPreset.id == preset_id,
                TestPreset.tenant_id == tenant_id,
                TestPreset.is_deleted.is_(False),
            )
        )
