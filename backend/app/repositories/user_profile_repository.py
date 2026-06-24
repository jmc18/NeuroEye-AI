from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_profile import UserProfile
from app.repositories.base import BaseRepository


class UserProfileRepository(BaseRepository[UserProfile]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, UserProfile)

    async def get_by_user_id(self, user_id: str) -> UserProfile | None:
        return await self._session.scalar(
            select(UserProfile).where(
                UserProfile.user_id == user_id,
                UserProfile.is_deleted.is_(False),
            )
        )
