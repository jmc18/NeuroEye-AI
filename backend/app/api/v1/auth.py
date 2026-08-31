from fastapi import APIRouter, Depends, status

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_unit_of_work
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
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/login",
    operation_id="login",
    response_model=LoginResponse,
)
async def login(
    body: LoginRequest,
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> LoginResponse:
    return await auth_service.login(uow, body)


@router.post(
    "/register",
    operation_id="register",
    response_model=LoginResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    body: RegisterRequest,
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> LoginResponse:
    return await auth_service.register(uow, body)


@router.get(
    "/me",
    operation_id="get_me",
    response_model=AuthUserResponse,
)
async def get_me(
    current_user: AuthUserResponse = Depends(get_current_user),
) -> AuthUserResponse:
    return current_user


@router.post(
    "/logout",
    operation_id="logout",
    response_model=MessageResponse,
)
async def logout(
    _current_user: AuthUserResponse = Depends(get_current_user),
) -> MessageResponse:
    return MessageResponse(message="Signed out.")


@router.post(
    "/forgot-password",
    operation_id="forgot_password",
    response_model=MessageResponse,
)
async def forgot_password(
    body: ForgotPasswordRequest,
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> MessageResponse:
    return await auth_service.forgot_password(uow, body)


@router.post(
    "/reset-password",
    operation_id="reset_password",
    response_model=MessageResponse,
)
async def reset_password(
    body: ResetPasswordRequest,
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> MessageResponse:
    return await auth_service.reset_password(uow, body)


@router.patch(
    "/me",
    operation_id="update_me",
    response_model=AuthUserResponse,
)
async def update_me(
    body: UpdateProfileRequest,
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> AuthUserResponse:
    return await auth_service.update_profile(
        uow,
        current_user.id,
        body,
        impersonator_id=current_user.impersonator_id,
    )


@router.patch(
    "/me/email",
    operation_id="change_my_email",
    response_model=LoginResponse,
)
async def change_my_email(
    body: ChangeEmailRequest,
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> LoginResponse:
    return await auth_service.change_email(
        uow,
        current_user.id,
        body,
        impersonator_id=current_user.impersonator_id,
    )


@router.patch(
    "/me/password",
    operation_id="change_my_password",
    response_model=MessageResponse,
)
async def change_my_password(
    body: ChangePasswordRequest,
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> MessageResponse:
    return await auth_service.change_password(uow, current_user.id, body)
