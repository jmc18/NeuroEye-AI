from pydantic import EmailStr, Field

from app.schemas.base import APIModel


class TenantCreate(APIModel):
    name: str = Field(min_length=1, max_length=255)


class TenantUpdate(APIModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)


class TenantResponse(APIModel):
    id: str
    name: str
    is_system: bool
    user_count: int = 0


class TenantListResponse(APIModel):
    items: list[TenantResponse]
    total: int


class AdminUserCreate(APIModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=255)
    last_name: str = Field(min_length=1, max_length=255)
    role_name: str = Field(default="Clinician", max_length=100)
    job_title: str | None = Field(default=None, max_length=255)


class AdminUserUpdate(APIModel):
    email: EmailStr | None = None
    first_name: str | None = Field(default=None, min_length=1, max_length=255)
    last_name: str | None = Field(default=None, min_length=1, max_length=255)
    is_active: bool | None = None
    role_name: str | None = Field(default=None, max_length=100)


class AdminSetPasswordRequest(APIModel):
    password: str = Field(min_length=8)


class AdminUserResponse(APIModel):
    id: str
    email: EmailStr
    name: str
    role: str
    tenant_id: str
    tenant_name: str
    is_active: bool
    job_title: str | None = None


class AdminUserListResponse(APIModel):
    items: list[AdminUserResponse]
    total: int
    page: int
    page_size: int


class ResetTokenResponse(APIModel):
    message: str
    reset_token: str | None = None
