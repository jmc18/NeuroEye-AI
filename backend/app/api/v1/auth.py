from fastapi import APIRouter, Depends

from app.dependencies.database import get_unit_of_work
from app.repositories.unit_of_work import UnitOfWork
from app.schemas.auth import LoginRequest, LoginResponse
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
