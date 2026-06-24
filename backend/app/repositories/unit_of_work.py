from collections.abc import Callable
from types import TracebackType

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.repositories.role_repository import RoleRepository
from app.repositories.tenant_repository import TenantRepository
from app.repositories.user_profile_repository import UserProfileRepository
from app.repositories.user_repository import UserRepository
from app.repositories.user_role_repository import UserRoleRepository


class UnitOfWork:
    def __init__(
        self,
        session_factory: Callable[[], AsyncSession],
    ) -> None:
        self._session_factory = session_factory
        self._session: AsyncSession | None = None

    @property
    def session(self) -> AsyncSession:
        if self._session is None:
            self._session = self._session_factory()
        return self._session

    @property
    def tenants(self) -> TenantRepository:
        return TenantRepository(self.session)

    @property
    def users(self) -> UserRepository:
        return UserRepository(self.session)

    @property
    def roles(self) -> RoleRepository:
        return RoleRepository(self.session)

    @property
    def user_profiles(self) -> UserProfileRepository:
        return UserProfileRepository(self.session)

    @property
    def user_roles(self) -> UserRoleRepository:
        return UserRoleRepository(self.session)

    async def commit(self) -> None:
        await self.session.commit()

    async def rollback(self) -> None:
        await self.session.rollback()

    async def close(self) -> None:
        if self._session is not None:
            await self._session.close()
            self._session = None

    async def __aenter__(self) -> "UnitOfWork":
        return self

    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: TracebackType | None,
    ) -> None:
        if exc_type is not None:
            await self.rollback()
        else:
            await self.commit()
        await self.close()
