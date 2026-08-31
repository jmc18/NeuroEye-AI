from fastapi import APIRouter, Depends, Query, status

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_unit_of_work
from app.repositories.unit_of_work import UnitOfWork
from app.schemas.auth import AuthUserResponse
from app.schemas.patient import (
    PatientCreate,
    PatientListResponse,
    PatientResponse,
    PatientUpdate,
)
from app.services.patient_service import patient_service

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get(
    "",
    operation_id="get_patients",
    response_model=PatientListResponse,
)
async def get_patients(
    query: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> PatientListResponse:
    return await patient_service.list_patients(
        uow,
        current_user,
        query=query,
        page=page,
        page_size=page_size,
    )


@router.post(
    "",
    operation_id="create_patient",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_patient(
    body: PatientCreate,
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> PatientResponse:
    return await patient_service.create_patient(uow, current_user, body)


@router.get(
    "/{patient_id}",
    operation_id="get_patient_by_id",
    response_model=PatientResponse,
)
async def get_patient_by_id(
    patient_id: str,
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> PatientResponse:
    return await patient_service.get_patient(uow, current_user, patient_id)


@router.patch(
    "/{patient_id}",
    operation_id="update_patient",
    response_model=PatientResponse,
)
async def update_patient(
    patient_id: str,
    body: PatientUpdate,
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> PatientResponse:
    return await patient_service.update_patient(uow, current_user, patient_id, body)


@router.delete(
    "/{patient_id}",
    operation_id="delete_patient",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_patient(
    patient_id: str,
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> None:
    await patient_service.delete_patient(uow, current_user, patient_id)
