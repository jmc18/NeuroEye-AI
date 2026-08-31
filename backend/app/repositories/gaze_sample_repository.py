from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.gaze_sample import GazeSample
from app.repositories.base import BaseRepository


class GazeSampleRepository(BaseRepository[GazeSample]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, GazeSample)

    async def list_for_session(self, session_id: str) -> list[GazeSample]:
        result = await self._session.scalars(
            select(GazeSample)
            .where(
                GazeSample.session_id == session_id,
                GazeSample.is_deleted.is_(False),
            )
            .order_by(GazeSample.t_ms)
        )
        return list(result.all())

    async def add_many(self, samples: list[GazeSample]) -> None:
        self._session.add_all(samples)
        await self._session.flush()
