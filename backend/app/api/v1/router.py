from fastapi import APIRouter

from app.api.v1.admin import router as admin_router
from app.api.v1.auth import router as auth_router
from app.api.v1.eyetrack import router as eyetrack_router
from app.api.v1.health import router as health_router
from app.api.v1.patients import router as patients_router
from app.api.v1.sessions import router as sessions_router

router = APIRouter()
router.include_router(health_router)
router.include_router(auth_router)
router.include_router(admin_router)
router.include_router(patients_router)
router.include_router(sessions_router)
router.include_router(eyetrack_router)
