from datetime import date

from pydantic import EmailStr, Field

from app.schemas.base import APIModel


class PatientCreate(APIModel):
    first_name: str = Field(min_length=1, max_length=255)
    last_name: str = Field(min_length=1, max_length=255)
    second_last_name: str | None = None
    birth_date: date | None = None
    email: EmailStr | None = None
    phone_number: str | None = Field(default=None, max_length=20)
    sex: str | None = Field(default=None, max_length=20)
    notes: str | None = None


class PatientUpdate(APIModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=255)
    last_name: str | None = Field(default=None, min_length=1, max_length=255)
    second_last_name: str | None = None
    birth_date: date | None = None
    email: EmailStr | None = None
    phone_number: str | None = Field(default=None, max_length=20)
    sex: str | None = Field(default=None, max_length=20)
    notes: str | None = None


class PatientResponse(APIModel):
    id: str
    first_name: str
    last_name: str
    second_last_name: str | None
    display_name: str
    birth_date: date | None
    email: str | None
    phone_number: str | None
    sex: str | None
    notes: str | None
    risk_level: str
    session_count: int = 0


class PatientListResponse(APIModel):
    items: list[PatientResponse]
    total: int
    page: int
    page_size: int
