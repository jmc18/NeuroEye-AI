from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    operation_id="health_check",
    summary="Health check",
    description="Returns service status. Use for load balancers and uptime monitoring.",
)
def health_check() -> dict[str, str]:
    return {"status": "ok"}
