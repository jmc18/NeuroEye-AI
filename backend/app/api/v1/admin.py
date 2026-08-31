from fastapi import APIRouter, Depends, Query, status

from app.dependencies.auth import require_super_admin
from app.dependencies.database import get_unit_of_work
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
from app.services.admin_service import admin_service

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get(
    "/tenants",
    operation_id="get_admin_tenants",
    response_model=TenantListResponse,
)
async def get_admin_tenants(
    _admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> TenantListResponse:
    return await admin_service.list_tenants(uow)


@router.post(
    "/tenants",
    operation_id="create_admin_tenant",
    response_model=TenantResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_admin_tenant(
    body: TenantCreate,
    _admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> TenantResponse:
    return await admin_service.create_tenant(uow, body)


@router.get(
    "/tenants/{tenant_id}",
    operation_id="get_admin_tenant_by_id",
    response_model=TenantResponse,
)
async def get_admin_tenant_by_id(
    tenant_id: str,
    _admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> TenantResponse:
    return await admin_service.get_tenant(uow, tenant_id)


@router.patch(
    "/tenants/{tenant_id}",
    operation_id="update_admin_tenant",
    response_model=TenantResponse,
)
async def update_admin_tenant(
    tenant_id: str,
    body: TenantUpdate,
    _admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> TenantResponse:
    return await admin_service.update_tenant(uow, tenant_id, body)


@router.get(
    "/tenants/{tenant_id}/users",
    operation_id="get_admin_tenant_users",
    response_model=AdminUserListResponse,
)
async def get_admin_tenant_users(
    tenant_id: str,
    query: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    _admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> AdminUserListResponse:
    return await admin_service.list_users(
        uow,
        tenant_id=tenant_id,
        query=query,
        page=page,
        page_size=page_size,
    )


@router.post(
    "/tenants/{tenant_id}/users",
    operation_id="create_admin_tenant_user",
    response_model=AdminUserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_admin_tenant_user(
    tenant_id: str,
    body: AdminUserCreate,
    _admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> AdminUserResponse:
    return await admin_service.create_user(uow, tenant_id, body)


@router.get(
    "/users",
    operation_id="get_admin_users",
    response_model=AdminUserListResponse,
)
async def get_admin_users(
    query: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    _admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> AdminUserListResponse:
    return await admin_service.list_users(
        uow,
        query=query,
        page=page,
        page_size=page_size,
    )


@router.patch(
    "/users/{user_id}",
    operation_id="update_admin_user",
    response_model=AdminUserResponse,
)
async def update_admin_user(
    user_id: str,
    body: AdminUserUpdate,
    admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> AdminUserResponse:
    return await admin_service.update_user(uow, admin, user_id, body)


@router.post(
    "/users/{user_id}/impersonate",
    operation_id="impersonate_admin_user",
    response_model=LoginResponse,
)
async def impersonate_admin_user(
    user_id: str,
    admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> LoginResponse:
    return await admin_service.impersonate(uow, admin, user_id)


@router.post(
    "/users/{user_id}/set-password",
    operation_id="set_admin_user_password",
    response_model=MessageResponse,
)
async def set_admin_user_password(
    user_id: str,
    body: AdminSetPasswordRequest,
    _admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> MessageResponse:
    return await admin_service.set_password(uow, user_id, body)


@router.post(
    "/users/{user_id}/send-reset",
    operation_id="send_admin_user_reset",
    response_model=ResetTokenResponse,
)
async def send_admin_user_reset(
    user_id: str,
    _admin: AuthUserResponse = Depends(require_super_admin),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> ResetTokenResponse:
    return await admin_service.send_reset(uow, user_id)
