from pydantic import EmailStr, Field

from app.schemas.base import APIModel


class LoginRequest(APIModel):
    email: EmailStr
    password: str = Field(min_length=1)


class AuthUserResponse(APIModel):
    id: str
    email: EmailStr
    name: str
    role: str
    tenant: str
    tenant_id: str


class LoginResponse(APIModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUserResponse
