from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.session_metrics import SessionMetrics
from app.repositories.base import BaseRepository


class SessionMetricsRepository(BaseRepository[SessionMetrics]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, SessionMetrics)

    async def get_by_session_id(self, session_id: str) -> SessionMetrics | None:
        return await self._session.scalar(
            select(SessionMetrics).where(
                SessionMetrics.session_id == session_id,
                SessionMetrics.is_deleted.is_(False),
            )
        )
