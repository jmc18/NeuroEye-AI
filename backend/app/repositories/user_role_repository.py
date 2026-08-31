from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_role import UserRole


class UserRoleRepository:
    """Association repository — UserRole is a junction table, not an EntityBase."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_user_and_role(
        self,
        user_id: str,
        role_id: str,
    ) -> UserRole | None:
        return await self._session.get(UserRole, (user_id, role_id))

    async def add(self, entity: UserRole) -> UserRole:
        self._session.add(entity)
        await self._session.flush()
        return entity

    async def delete_for_user(self, user_id: str) -> None:
        from sqlalchemy import delete

        await self._session.execute(
            delete(UserRole).where(UserRole.user_id == user_id)
        )

    async def flush(self) -> None:
        await self._session.flush()
