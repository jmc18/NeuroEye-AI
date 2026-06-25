from fastapi import HTTPException, status

from app.core.security import create_access_token, verify_password
from app.models.user_profile import UserProfile
from app.repositories.unit_of_work import UnitOfWork
from app.schemas.auth import AuthUserResponse, LoginRequest, LoginResponse


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
    async def login(self, uow: UnitOfWork, credentials: LoginRequest) -> LoginResponse:
        user = await uow.users.get_by_email(credentials.email)

        if user is None or not verify_password(
            credentials.password,
            user.hashed_password,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        profile = await uow.user_profiles.get_by_user_id(user.id)
        tenant = await uow.tenants.get_by_id(user.tenant_id)
        role_name = await uow.roles.get_primary_name_for_user(user.id)

        if tenant is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User tenant not found",
            )

        role = _slugify_role(role_name) if role_name else "user"
        display_name = _build_display_name(profile, user.email)
        access_token = create_access_token(
            user.id,
            extra_claims={
                "email": user.email,
                "tenant_id": user.tenant_id,
                "role": role,
            },
        )

        return LoginResponse(
            access_token=access_token,
            user=AuthUserResponse(
                id=user.id,
                email=user.email,
                name=display_name,
                role=role,
                tenant=tenant.name,
                tenant_id=tenant.id,
            ),
        )


auth_service = AuthService()
