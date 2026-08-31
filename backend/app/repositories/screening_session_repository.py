from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.screening_session import ScreeningSession
from app.repositories.base import BaseRepository


class ScreeningSessionRepository(BaseRepository[ScreeningSession]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ScreeningSession)

    async def list_for_tenant(
        self,
        tenant_id: str,
        *,
        patient_id: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[ScreeningSession], int]:
        filters = [
            ScreeningSession.tenant_id == tenant_id,
            ScreeningSession.is_deleted.is_(False),
        ]
        if patient_id:
            filters.append(ScreeningSession.patient_id == patient_id)

        total = await self._session.scalar(
            select(func.count()).select_from(ScreeningSession).where(*filters)
        ) or 0

        stmt = (
            select(ScreeningSession)
            .where(*filters)
            .order_by(ScreeningSession.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        rows = await self._session.scalars(stmt)
        return list(rows.all()), total

    async def get_for_tenant(
        self,
        session_id: str,
        tenant_id: str,
    ) -> ScreeningSession | None:
        return await self._session.scalar(
            select(ScreeningSession).where(
                ScreeningSession.id == session_id,
                ScreeningSession.tenant_id == tenant_id,
                ScreeningSession.is_deleted.is_(False),
            )
        )

    async def count_for_tenant(self, tenant_id: str, *, status: str | None = None) -> int:
        filters = [
            ScreeningSession.tenant_id == tenant_id,
            ScreeningSession.is_deleted.is_(False),
        ]
        if status:
            filters.append(ScreeningSession.status == status)
        result = await self._session.scalar(
            select(func.count()).select_from(ScreeningSession).where(*filters)
        )
        return result or 0

    async def count_for_patient(self, patient_id: str) -> int:
        result = await self._session.scalar(
            select(func.count()).select_from(ScreeningSession).where(
                ScreeningSession.patient_id == patient_id,
                ScreeningSession.is_deleted.is_(False),
            )
        )
        return result or 0
