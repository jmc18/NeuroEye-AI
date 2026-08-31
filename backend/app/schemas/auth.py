from pydantic import EmailStr, Field

from app.schemas.base import APIModel


class LoginRequest(APIModel):
    email: EmailStr
    password: str = Field(min_length=1)


class RegisterRequest(APIModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=255)
    last_name: str = Field(min_length=1, max_length=255)
    second_last_name: str | None = Field(default=None, max_length=255)


class ForgotPasswordRequest(APIModel):
    email: EmailStr


class ResetPasswordRequest(APIModel):
    token: str = Field(min_length=1)
    password: str = Field(min_length=8)


class MessageResponse(APIModel):
    message: str


class ChangeEmailRequest(APIModel):
    current_password: str = Field(min_length=1)
    email: EmailStr


class ChangePasswordRequest(APIModel):
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8)


class UpdateProfileRequest(APIModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=255)
    last_name: str | None = Field(default=None, min_length=1, max_length=255)
    second_last_name: str | None = Field(default=None, max_length=255)
    job_title: str | None = Field(default=None, max_length=255)
    phone_number: str | None = Field(default=None, max_length=20)


class AuthUserResponse(APIModel):
    id: str
    email: EmailStr
    name: str
    role: str
    tenant: str
    tenant_id: str
    first_name: str | None = None
    last_name: str | None = None
    job_title: str | None = None
    phone_number: str | None = None
    impersonated: bool = False
    impersonator_id: str | None = None


class LoginResponse(APIModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUserResponse
