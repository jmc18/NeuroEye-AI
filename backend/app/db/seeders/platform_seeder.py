import structlog

from app.core.config import settings
from app.core.security import hash_password
from app.db.seeders.constants import (
    SUPER_ADMIN_PROFILE_ID,
    SUPER_ADMIN_ROLE_DESCRIPTION,
    SUPER_ADMIN_ROLE_ID,
    SUPER_ADMIN_ROLE_NAME,
    SUPER_ADMIN_USER_ID,
    SYSTEM_TENANT_ID,
    SYSTEM_TENANT_NAME,
)
from app.models.role import Role
from app.models.tenant import Tenant
from app.models.user import User
from app.models.user_profile import UserProfile
from app.models.user_role import UserRole
from app.repositories.unit_of_work import UnitOfWork

logger = structlog.get_logger(__name__)


async def seed_platform(uow: UnitOfWork) -> None:
    tenant = await _get_or_create_system_tenant(uow)
    role = await _get_or_create_super_admin_role(uow, tenant.id)
    user = await _get_or_create_super_admin_user(uow, tenant.id)
    await _get_or_create_super_admin_profile(uow, user.id)
    await _get_or_create_user_role(uow, user.id, role.id)

    logger.info(
        "platform_seed_completed",
        tenant_id=tenant.id,
        tenant_name=tenant.name,
        user_email=user.email,
    )


async def _get_or_create_system_tenant(uow: UnitOfWork) -> Tenant:
    tenants = uow.tenants

    tenant = await tenants.get_by_id(SYSTEM_TENANT_ID)
    if tenant is not None:
        return tenant

    tenant = await tenants.get_by_name(SYSTEM_TENANT_NAME)
    if tenant is not None:
        return tenant

    tenant = Tenant(
        id=SYSTEM_TENANT_ID,
        name=SYSTEM_TENANT_NAME,
        is_system=True,
    )
    await tenants.add(tenant)
    logger.info("system_tenant_created", tenant_id=tenant.id, name=tenant.name)
    return tenant


async def _get_or_create_super_admin_role(uow: UnitOfWork, tenant_id: str) -> Role:
    roles = uow.roles

    role = await roles.get_by_id(SUPER_ADMIN_ROLE_ID)
    if role is not None:
        return role

    role = await roles.get_by_name_and_tenant(SUPER_ADMIN_ROLE_NAME, tenant_id)
    if role is not None:
        return role

    role = Role(
        id=SUPER_ADMIN_ROLE_ID,
        tenant_id=tenant_id,
        name=SUPER_ADMIN_ROLE_NAME,
        description=SUPER_ADMIN_ROLE_DESCRIPTION,
    )
    await roles.add(role)
    logger.info("super_admin_role_created", role_id=role.id)
    return role


async def _get_or_create_super_admin_user(uow: UnitOfWork, tenant_id: str) -> User:
    users = uow.users

    user = await users.get_by_id(SUPER_ADMIN_USER_ID)
    if user is not None:
        return user

    user = await users.get_by_email(settings.seed_platform_email)
    if user is not None:
        return user

    user = User(
        id=SUPER_ADMIN_USER_ID,
        tenant_id=tenant_id,
        email=settings.seed_platform_email,
        hashed_password=hash_password(settings.seed_platform_password),
        is_active=True,
    )
    await users.add(user)
    logger.info("super_admin_user_created", user_id=user.id, email=user.email)
    return user


async def _get_or_create_super_admin_profile(
    uow: UnitOfWork,
    user_id: str,
) -> UserProfile:
    profiles = uow.user_profiles

    profile = await profiles.get_by_id(SUPER_ADMIN_PROFILE_ID)
    if profile is not None:
        return profile

    profile = await profiles.get_by_user_id(user_id)
    if profile is not None:
        return profile

    profile = UserProfile(
        id=SUPER_ADMIN_PROFILE_ID,
        user_id=user_id,
        first_name=settings.seed_platform_first_name,
        last_name=settings.seed_platform_last_name,
        second_last_name=settings.seed_platform_second_last_name or None,
        job_title="Platform Super Admin",
    )
    await profiles.add(profile)
    logger.info("super_admin_profile_created", profile_id=profile.id)
    return profile


async def _get_or_create_user_role(
    uow: UnitOfWork,
    user_id: str,
    role_id: str,
) -> UserRole:
    user_roles = uow.user_roles

    user_role = await user_roles.get_by_user_and_role(user_id, role_id)
    if user_role is not None:
        return user_role

    user_role = UserRole(user_id=user_id, role_id=role_id)
    await user_roles.add(user_role)
    logger.info("super_admin_user_role_created", user_id=user_id, role_id=role_id)
    return user_role
