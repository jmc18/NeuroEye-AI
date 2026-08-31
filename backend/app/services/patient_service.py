from app.models.patient import Patient
from app.models.session_metrics import SessionMetrics
from app.repositories.unit_of_work import UnitOfWork
from app.schemas.auth import AuthUserResponse
from app.schemas.patient import (
    PatientCreate,
    PatientListResponse,
    PatientResponse,
    PatientUpdate,
)
from app.services.metrics_service import RISK_LOW, risk_from_metrics
from fastapi import HTTPException, status


def _risk_from_metrics_row(metrics: SessionMetrics | None) -> str:
    if metrics is None:
        return RISK_LOW
    stored = metrics.extras.get("risk_level") if metrics.extras else None
    if isinstance(stored, str):
        return stored
    return risk_from_metrics(
        detection_rate=metrics.detection_rate,
        fixation_stability=metrics.fixation_stability,
        saccade_amplitude=metrics.saccade_amplitude,
    )


class PatientService:
    async def _to_response(
        self,
        uow: UnitOfWork,
        patient: Patient,
        *,
        session_count: int | None = None,
        risk_level: str | None = None,
    ) -> PatientResponse:
        if session_count is None:
            session_count = await uow.screening_sessions.count_for_patient(patient.id)
        if risk_level is None:
            sessions, _ = await uow.screening_sessions.list_for_tenant(
                patient.tenant_id,
                patient_id=patient.id,
                page=1,
                page_size=1,
            )
            metrics = None
            if sessions:
                metrics = await uow.session_metrics.get_by_session_id(sessions[0].id)
            risk_level = _risk_from_metrics_row(metrics)

        return PatientResponse(
            id=patient.id,
            first_name=patient.first_name,
            last_name=patient.last_name,
            second_last_name=patient.second_last_name,
            display_name=patient.display_name,
            birth_date=patient.birth_date,
            email=patient.email,
            phone_number=patient.phone_number,
            sex=patient.sex,
            notes=patient.notes,
            risk_level=risk_level,
            session_count=session_count,
        )

    async def list_patients(
        self,
        uow: UnitOfWork,
        current_user: AuthUserResponse,
        *,
        query: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> PatientListResponse:
        items, total = await uow.patients.list_for_tenant(
            current_user.tenant_id,
            query=query,
            page=page,
            page_size=page_size,
        )
        responses = [await self._to_response(uow, patient) for patient in items]
        return PatientListResponse(
            items=responses,
            total=total,
            page=page,
            page_size=page_size,
        )

    async def get_patient(
        self,
        uow: UnitOfWork,
        current_user: AuthUserResponse,
        patient_id: str,
    ) -> PatientResponse:
        patient = await uow.patients.get_for_tenant(patient_id, current_user.tenant_id)
        if patient is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
        return await self._to_response(uow, patient)

    async def create_patient(
        self,
        uow: UnitOfWork,
        current_user: AuthUserResponse,
        body: PatientCreate,
    ) -> PatientResponse:
        patient = Patient(
            tenant_id=current_user.tenant_id,
            **body.model_dump(),
        )
        await uow.patients.add(patient)
        return await self._to_response(uow, patient, session_count=0, risk_level=RISK_LOW)

    async def update_patient(
        self,
        uow: UnitOfWork,
        current_user: AuthUserResponse,
        patient_id: str,
        body: PatientUpdate,
    ) -> PatientResponse:
        patient = await uow.patients.get_for_tenant(patient_id, current_user.tenant_id)
        if patient is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
        for field, value in body.model_dump(exclude_unset=True).items():
            setattr(patient, field, value)
        await uow.patients.flush()
        return await self._to_response(uow, patient)

    async def delete_patient(
        self,
        uow: UnitOfWork,
        current_user: AuthUserResponse,
        patient_id: str,
    ) -> None:
        patient = await uow.patients.get_for_tenant(patient_id, current_user.tenant_id)
        if patient is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
        await uow.patients.soft_delete(patient)


patient_service = PatientService()
