from datetime import UTC, datetime
from typing import Generic, TypeVar

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.entity_base import EntityBase

EntityT = TypeVar("EntityT", bound=EntityBase)


class BaseRepository(Generic[EntityT]):
    def __init__(self, session: AsyncSession, model: type[EntityT]) -> None:
        self._session = session
        self._model = model

    def _base_select(self, *, include_deleted: bool = False):
        stmt = select(self._model)
        if not include_deleted:
            stmt = stmt.where(self._model.is_deleted.is_(False))
        return stmt

    async def get_by_id(self, entity_id: str, *, include_deleted: bool = False,) -> EntityT | None:
        entity = await self._session.get(self._model, entity_id)
        if entity is None:
            return None
        if not include_deleted and entity.is_deleted:
            return None
        return entity

    async def get_all(self, *, include_deleted: bool = False) -> list[EntityT]:
        result = await self._session.scalars(
            self._base_select(include_deleted=include_deleted)
        )
        return list(result.all())

    async def add(self, entity: EntityT) -> EntityT:
        self._session.add(entity)
        await self._session.flush()
        return entity

    async def soft_delete(self, entity: EntityT) -> EntityT:
        entity.is_deleted = True
        entity.deleted_at = datetime.now(UTC)
        await self._session.flush()
        return entity

    async def exists(
        self,
        entity_id: str,
        *,
        include_deleted: bool = False,
    ) -> bool:
        entity = await self.get_by_id(entity_id, include_deleted=include_deleted)
        return entity is not None

    async def count(self, *, include_deleted: bool = False) -> int:
        stmt = select(func.count()).select_from(self._model)
        if not include_deleted:
            stmt = stmt.where(self._model.is_deleted.is_(False))
        result = await self._session.scalar(stmt)
        return result or 0

    async def get_page(
        self,
        page: int,
        page_size: int,
        *,
        include_deleted: bool = False,
    ) -> tuple[list[EntityT], int]:
        total_count = await self.count(include_deleted=include_deleted)
        offset = (page - 1) * page_size
        stmt = (
            self._base_select(include_deleted=include_deleted)
            .offset(offset)
            .limit(page_size)
        )
        result = await self._session.scalars(stmt)
        return list(result.all()), total_count

    async def flush(self) -> None:
        await self._session.flush()
