from fastapi import APIRouter, Depends, Query

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_unit_of_work
from app.repositories.unit_of_work import UnitOfWork
from app.schemas.auth import AuthUserResponse
from app.schemas.session import (
    DashboardSummaryResponse,
    SessionCreate,
    SessionListResponse,
    SessionReportResponse,
    SessionResponse,
    TestPresetResponse,
)
from app.services.session_service import session_service

router = APIRouter(tags=["Sessions"])


@router.get(
    "/dashboard/summary",
    operation_id="get_dashboard_summary",
    response_model=DashboardSummaryResponse,
    tags=["Dashboard"],
)
async def get_dashboard_summary(
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> DashboardSummaryResponse:
    return await session_service.dashboard_summary(uow, current_user)


@router.get(
    "/presets",
    operation_id="get_test_presets",
    response_model=list[TestPresetResponse],
    tags=["Vision"],
)
async def get_test_presets(
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> list[TestPresetResponse]:
    return await session_service.list_presets(uow, current_user)


@router.get(
    "/sessions",
    operation_id="get_sessions",
    response_model=SessionListResponse,
)
async def get_sessions(
    patient_id: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> SessionListResponse:
    return await session_service.list_sessions(
        uow,
        current_user,
        patient_id=patient_id,
        page=page,
        page_size=page_size,
    )


@router.post(
    "/sessions",
    operation_id="create_session",
    response_model=SessionResponse,
)
async def create_session(
    body: SessionCreate,
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> SessionResponse:
    return await session_service.create_session(uow, current_user, body)


@router.get(
    "/sessions/{session_id}",
    operation_id="get_session_by_id",
    response_model=SessionResponse,
)
async def get_session_by_id(
    session_id: str,
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> SessionResponse:
    return await session_service.get_session(uow, current_user, session_id)


@router.get(
    "/sessions/{session_id}/report",
    operation_id="get_session_report",
    response_model=SessionReportResponse,
    tags=["Reports"],
)
async def get_session_report(
    session_id: str,
    current_user: AuthUserResponse = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> SessionReportResponse:
    return await session_service.get_report(uow, current_user, session_id)
