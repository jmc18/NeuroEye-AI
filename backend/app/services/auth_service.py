import asyncio

import structlog
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_purpose_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.seeders.constants import CLINICIAN_ROLE_NAME, SYSTEM_TENANT_ID
from app.models.role import Role
from app.models.user import User
from app.models.user_profile import UserProfile
from app.models.user_role import UserRole
from app.repositories.unit_of_work import UnitOfWork
from app.schemas.auth import (
    AuthUserResponse,
    ChangeEmailRequest,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    UpdateProfileRequest,
)

logger = structlog.get_logger(__name__)


def _slugify_role(role_name: str) -> str:
    return role_name.lower().replace(" ", "_")


def _build_display_name(profile: UserProfile | None, email: str) -> str:
    if profile is None:
        local_part = email.split("@", maxsplit=1)[0]
        return local_part.replace(".", " ").title()

    parts = [profile.first_name, profile.last_name]
    if profile.second_last_name:
        parts.append(profile.second_last_name)
    return " ".join(parts)


class AuthService:
    async def build_user_response(
        self,
        uow: UnitOfWork,
        user: User,
        *,
        impersonator_id: str | None = None,
    ) -> AuthUserResponse:
        profile, tenant, role_name = await asyncio.gather(
            uow.user_profiles.get_by_user_id(user.id),
            uow.tenants.get_by_id(user.tenant_id),
            uow.roles.get_primary_name_for_user(user.id),
        )
        if tenant is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User tenant not found",
            )
        return AuthUserResponse(
            id=user.id,
            email=user.email,
            name=_build_display_name(profile, user.email),
            role=_slugify_role(role_name) if role_name else "user",
            tenant=tenant.name,
            tenant_id=tenant.id,
            first_name=profile.first_name if profile else None,
            last_name=profile.last_name if profile else None,
            job_title=profile.job_title if profile else None,
            phone_number=profile.phone_number if profile else None,
            impersonated=bool(impersonator_id),
            impersonator_id=impersonator_id,
        )

    def _issue_login(
        self,
        user: User,
        auth_user: AuthUserResponse,
        *,
        extra_claims: dict[str, str] | None = None,
    ) -> LoginResponse:
        claims = {
            "email": user.email,
            "tenant_id": user.tenant_id,
            "role": auth_user.role,
            **(extra_claims or {}),
        }
        claims = {key: value for key, value in claims.items() if value is not None}
        access_token = create_access_token(user.id, extra_claims=claims)
        return LoginResponse(access_token=access_token, user=auth_user)

    async def login(self, uow: UnitOfWork, credentials: LoginRequest) -> LoginResponse:
        try:
            user = await uow.users.get_by_email(credentials.email)
        except Exception as exc:
            logger.error("login_user_lookup_failed", error=str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error occurred while fetching user",
            ) from exc

        if user is None or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        auth_user = await self.build_user_response(uow, user)
        return self._issue_login(user, auth_user)

    async def register(self, uow: UnitOfWork, body: RegisterRequest) -> LoginResponse:
        existing = await uow.users.get_by_email(body.email)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )

        tenant = await uow.tenants.get_by_id(SYSTEM_TENANT_ID)
        if tenant is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Platform tenant is not seeded",
            )

        role = await uow.roles.get_by_name_and_tenant(CLINICIAN_ROLE_NAME, tenant.id)
        if role is None:
            role = Role(
                tenant_id=tenant.id,
                name=CLINICIAN_ROLE_NAME,
                description="Clinical operator with patient and screening access.",
            )
            await uow.roles.add(role)

        user = User(
            tenant_id=tenant.id,
            email=body.email,
            hashed_password=hash_password(body.password),
            is_active=True,
        )
        await uow.users.add(user)

        profile = UserProfile(
            user_id=user.id,
            first_name=body.first_name,
            last_name=body.last_name,
            second_last_name=body.second_last_name,
            job_title="Clinician",
        )
        await uow.user_profiles.add(profile)
        await uow.user_roles.add(UserRole(user_id=user.id, role_id=role.id))

        auth_user = await self.build_user_response(uow, user)
        return self._issue_login(user, auth_user)

    async def get_me(self, uow: UnitOfWork, user_id: str) -> AuthUserResponse:
        user = await uow.users.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        return await self.build_user_response(uow, user)

    async def forgot_password(
        self,
        uow: UnitOfWork,
        body: ForgotPasswordRequest,
    ) -> MessageResponse:
        user = await uow.users.get_by_email(body.email)
        if user is not None and user.is_active:
            token = create_purpose_token(user.id, "password_reset")
            logger.info(
                "password_reset_token_issued",
                email=user.email,
                development=settings.app_env.lower() == "development",
                token=token if settings.app_env.lower() == "development" else None,
            )
        return MessageResponse(
            message="If an account exists for that email, a recovery link has been issued.",
        )

    async def reset_password(
        self,
        uow: UnitOfWork,
        body: ResetPasswordRequest,
    ) -> MessageResponse:
        try:
            payload = decode_token(body.token)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token",
            ) from None

        if payload.get("purpose") != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token",
            )

        user = await uow.users.get_by_id(str(payload.get("sub", "")))
        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token",
            )

        user.hashed_password = hash_password(body.password)
        await uow.users.flush()
        return MessageResponse(message="Password updated successfully.")

    async def update_profile(
        self,
        uow: UnitOfWork,
        user_id: str,
        body: UpdateProfileRequest,
        *,
        impersonator_id: str | None = None,
    ) -> AuthUserResponse:
        user = await uow.users.get_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        profile = await uow.user_profiles.get_by_user_id(user.id)
        if profile is None:
            profile = UserProfile(
                user_id=user.id,
                first_name=body.first_name or "User",
                last_name=body.last_name or "Account",
            )
            await uow.user_profiles.add(profile)
        data = body.model_dump(exclude_unset=True)
        for field, value in data.items():
            setattr(profile, field, value)
        await uow.user_profiles.flush()
        return await self.build_user_response(uow, user, impersonator_id=impersonator_id)

    async def change_email(
        self,
        uow: UnitOfWork,
        user_id: str,
        body: ChangeEmailRequest,
        *,
        impersonator_id: str | None = None,
    ) -> LoginResponse:
        user = await uow.users.get_by_id(user_id)
        if user is None or not verify_password(body.current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect",
            )
        existing = await uow.users.get_by_email(body.email)
        if existing is not None and existing.id != user.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )
        user.email = body.email
        await uow.users.flush()
        auth_user = await self.build_user_response(
            uow,
            user,
            impersonator_id=impersonator_id,
        )
        extra = {"impersonator_id": impersonator_id} if impersonator_id else None
        return self._issue_login(user, auth_user, extra_claims=extra)

    async def change_password(
        self,
        uow: UnitOfWork,
        user_id: str,
        body: ChangePasswordRequest,
    ) -> MessageResponse:
        user = await uow.users.get_by_id(user_id)
        if user is None or not verify_password(body.current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect",
            )
        user.hashed_password = hash_password(body.new_password)
        await uow.users.flush()
        return MessageResponse(message="Password updated successfully.")


auth_service = AuthService()
