from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, User)

    async def get_by_email(self, email: str) -> User | None:
        return await self._session.scalar(
            select(User).where(
                User.email == email,
                User.is_deleted.is_(False),
            )
        )

    async def list_for_tenant(
        self,
        tenant_id: str,
        *,
        query: str | None = None,
        page: int = 1,
        page_size: int = 50,
    ) -> tuple[list[User], int]:
        filters = [
            User.tenant_id == tenant_id,
            User.is_deleted.is_(False),
        ]
        if query:
            pattern = f"%{query.strip()}%"
            filters.append(User.email.ilike(pattern))

        total = await self._session.scalar(
            select(func.count()).select_from(User).where(*filters)
        ) or 0
        stmt = (
            select(User)
            .where(*filters)
            .order_by(User.email)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        rows = await self._session.scalars(stmt)
        return list(rows.all()), total

    async def list_all(
        self,
        *,
        query: str | None = None,
        page: int = 1,
        page_size: int = 50,
    ) -> tuple[list[User], int]:
        filters = [User.is_deleted.is_(False)]
        if query:
            pattern = f"%{query.strip()}%"
            filters.append(User.email.ilike(pattern))

        total = await self._session.scalar(
            select(func.count()).select_from(User).where(*filters)
        ) or 0
        stmt = (
            select(User)
            .where(*filters)
            .order_by(User.email)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        rows = await self._session.scalars(stmt)
        return list(rows.all()), total

    async def count_for_tenant(self, tenant_id: str) -> int:
        result = await self._session.scalar(
            select(func.count()).select_from(User).where(
                User.tenant_id == tenant_id,
                User.is_deleted.is_(False),
            )
        )
        return result or 0
