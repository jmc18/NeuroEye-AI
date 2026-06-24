from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.role import Role
from app.models.user_role import UserRole
from app.repositories.base import BaseRepository


class RoleRepository(BaseRepository[Role]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Role)

    async def get_by_name_and_tenant(self, name: str, tenant_id: str) -> Role | None:
        return await self._session.scalar(
            select(Role).where(
                Role.tenant_id == tenant_id,
                Role.name == name,
                Role.is_deleted.is_(False),
            )
        )

    async def get_primary_name_for_user(self, user_id: str) -> str | None:
        return await self._session.scalar(
            select(Role.name)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(
                UserRole.user_id == user_id,
                Role.is_deleted.is_(False),
            )
            .order_by(Role.name)
            .limit(1)
        )
