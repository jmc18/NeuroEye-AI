import structlog
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.security import create_purpose_token, hash_password
from app.db.seeders.constants import CLINICIAN_ROLE_NAME, SUPER_ADMIN_ROLE_NAME, SYSTEM_TENANT_ID
from app.models.role import Role
from app.models.tenant import Tenant
from app.models.user import User
from app.models.user_profile import UserProfile
from app.models.user_role import UserRole
from app.repositories.unit_of_work import UnitOfWork
from app.schemas.admin import (
    AdminSetPasswordRequest,
    AdminUserCreate,
    AdminUserListResponse,
    AdminUserResponse,
    AdminUserUpdate,
    ResetTokenResponse,
    TenantCreate,
    TenantListResponse,
    TenantResponse,
    TenantUpdate,
)
from app.schemas.auth import AuthUserResponse, LoginResponse, MessageResponse
from app.services.auth_service import _build_display_name, _slugify_role, auth_service

logger = structlog.get_logger(__name__)


class AdminService:
    async def list_tenants(self, uow: UnitOfWork) -> TenantListResponse:
        tenants = await uow.tenants.list_all()
        items: list[TenantResponse] = []
        for tenant in tenants:
            items.append(await self._to_tenant_response(uow, tenant))
        return TenantListResponse(items=items, total=len(items))

    async def get_tenant(self, uow: UnitOfWork, tenant_id: str) -> TenantResponse:
        tenant = await self._require_tenant(uow, tenant_id)
        return await self._to_tenant_response(uow, tenant)

    async def create_tenant(self, uow: UnitOfWork, body: TenantCreate) -> TenantResponse:
        existing = await uow.tenants.get_by_name(body.name)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A tenant with this name already exists",
            )
        tenant = Tenant(name=body.name, is_system=False)
        await uow.tenants.add(tenant)
        await self._get_or_create_role(uow, tenant.id, CLINICIAN_ROLE_NAME)
        return await self._to_tenant_response(uow, tenant)

    async def update_tenant(
        self,
        uow: UnitOfWork,
        tenant_id: str,
        body: TenantUpdate,
    ) -> TenantResponse:
        tenant = await self._require_tenant(uow, tenant_id)
        if body.name is not None:
            clash = await uow.tenants.get_by_name(body.name)
            if clash is not None and clash.id != tenant.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A tenant with this name already exists",
                )
            tenant.name = body.name
            await uow.tenants.flush()
        return await self._to_tenant_response(uow, tenant)

    async def list_users(
        self,
        uow: UnitOfWork,
        *,
        tenant_id: str | None = None,
        query: str | None = None,
        page: int = 1,
        page_size: int = 50,
    ) -> AdminUserListResponse:
        if tenant_id is not None:
            await self._require_tenant(uow, tenant_id)
            users, total = await uow.users.list_for_tenant(
                tenant_id,
                query=query,
                page=page,
                page_size=page_size,
            )
        else:
            users, total = await uow.users.list_all(
                query=query,
                page=page,
                page_size=page_size,
            )
        items = [await self._to_user_response(uow, user) for user in users]
        return AdminUserListResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
        )

    async def create_user(
        self,
        uow: UnitOfWork,
        tenant_id: str,
        body: AdminUserCreate,
    ) -> AdminUserResponse:
        await self._require_tenant(uow, tenant_id)
        existing = await uow.users.get_by_email(body.email)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )
        role = await self._resolve_role(uow, tenant_id, body.role_name)
        user = User(
            tenant_id=tenant_id,
            email=body.email,
            hashed_password=hash_password(body.password),
            is_active=True,
        )
        await uow.users.add(user)
        await uow.user_profiles.add(
            UserProfile(
                user_id=user.id,
                first_name=body.first_name,
                last_name=body.last_name,
                job_title=body.job_title,
            )
        )
        await uow.user_roles.add(UserRole(user_id=user.id, role_id=role.id))
        return await self._to_user_response(uow, user)

    async def update_user(
        self,
        uow: UnitOfWork,
        actor: AuthUserResponse,
        user_id: str,
        body: AdminUserUpdate,
    ) -> AdminUserResponse:
        user = await self._require_user(uow, user_id)
        data = body.model_dump(exclude_unset=True)

        if "email" in data and data["email"] is not None:
            clash = await uow.users.get_by_email(data["email"])
            if clash is not None and clash.id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="An account with this email already exists",
                )
            user.email = data["email"]

        if "is_active" in data and data["is_active"] is not None:
            if user.id == actor.id and data["is_active"] is False:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="You cannot deactivate your own account",
                )
            user.is_active = data["is_active"]

        profile = await uow.user_profiles.get_by_user_id(user.id)
        if profile is None:
            profile = UserProfile(
                user_id=user.id,
                first_name=body.first_name or "User",
                last_name=body.last_name or "Account",
            )
            await uow.user_profiles.add(profile)
        if body.first_name is not None:
            profile.first_name = body.first_name
        if body.last_name is not None:
            profile.last_name = body.last_name

        if body.role_name is not None:
            role = await self._resolve_role(uow, user.tenant_id, body.role_name)
            await uow.user_roles.delete_for_user(user.id)
            await uow.user_roles.add(UserRole(user_id=user.id, role_id=role.id))

        await uow.users.flush()
        await uow.user_profiles.flush()
        return await self._to_user_response(uow, user)

    async def impersonate(
        self,
        uow: UnitOfWork,
        actor: AuthUserResponse,
        user_id: str,
    ) -> LoginResponse:
        if user_id == actor.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot impersonate yourself",
            )
        user = await self._require_user(uow, user_id)
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot impersonate an inactive account",
            )
        auth_user = await auth_service.build_user_response(
            uow,
            user,
            impersonator_id=actor.id,
        )
        return auth_service._issue_login(
            user,
            auth_user,
            extra_claims={"impersonator_id": actor.id},
        )

    async def set_password(
        self,
        uow: UnitOfWork,
        user_id: str,
        body: AdminSetPasswordRequest,
    ) -> MessageResponse:
        user = await self._require_user(uow, user_id)
        user.hashed_password = hash_password(body.password)
        await uow.users.flush()
        return MessageResponse(message="Password updated successfully.")

    async def send_reset(self, uow: UnitOfWork, user_id: str) -> ResetTokenResponse:
        user = await self._require_user(uow, user_id)
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot reset password for an inactive account",
            )
        token = create_purpose_token(user.id, "password_reset")
        development = settings.app_env.lower() == "development"
        logger.info(
            "admin_password_reset_token_issued",
            email=user.email,
            development=development,
            token=token if development else None,
        )
        return ResetTokenResponse(
            message="A recovery token has been issued.",
            reset_token=token if development else None,
        )

    async def _to_tenant_response(self, uow: UnitOfWork, tenant: Tenant) -> TenantResponse:
        return TenantResponse(
            id=tenant.id,
            name=tenant.name,
            is_system=tenant.is_system,
            user_count=await uow.users.count_for_tenant(tenant.id),
        )

    async def _to_user_response(self, uow: UnitOfWork, user: User) -> AdminUserResponse:
        profile = await uow.user_profiles.get_by_user_id(user.id)
        tenant = await uow.tenants.get_by_id(user.tenant_id)
        role_name = await uow.roles.get_primary_name_for_user(user.id)
        return AdminUserResponse(
            id=user.id,
            email=user.email,
            name=_build_display_name(profile, user.email),
            role=_slugify_role(role_name) if role_name else "user",
            tenant_id=user.tenant_id,
            tenant_name=tenant.name if tenant else "",
            is_active=user.is_active,
            job_title=profile.job_title if profile else None,
        )

    async def _require_tenant(self, uow: UnitOfWork, tenant_id: str) -> Tenant:
        tenant = await uow.tenants.get_by_id(tenant_id)
        if tenant is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant not found")
        return tenant

    async def _require_user(self, uow: UnitOfWork, user_id: str) -> User:
        user = await uow.users.get_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    async def _resolve_role(self, uow: UnitOfWork, tenant_id: str, role_name: str) -> Role:
        name = role_name.strip() or CLINICIAN_ROLE_NAME
        slug = _slugify_role(name)
        if slug == "super_admin" and tenant_id != SYSTEM_TENANT_ID:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Super admin accounts can only belong to the platform tenant",
            )
        if slug == "super_admin":
            name = SUPER_ADMIN_ROLE_NAME
        elif slug == "clinician":
            name = CLINICIAN_ROLE_NAME
        return await self._get_or_create_role(uow, tenant_id, name)

    async def _get_or_create_role(self, uow: UnitOfWork, tenant_id: str, name: str) -> Role:
        role = await uow.roles.get_by_name_and_tenant(name, tenant_id)
        if role is not None:
            return role
        role = Role(
            tenant_id=tenant_id,
            name=name,
            description=f"{name} access for this tenant.",
        )
        await uow.roles.add(role)
        return role


admin_service = AdminService()
