from fastapi import APIRouter, Query, WebSocket

from app.services.eyetrack_ws import handle_eyetrack_socket

router = APIRouter(tags=["Vision"])


@router.websocket("/ws/eyetrack")
async def eyetrack_socket(
    websocket: WebSocket,
    token: str = Query(..., description="JWT access token"),
) -> None:
    """Live gaze stream. Client sends compact MediaPipe landmarks; server returns gaze JSON."""
    await handle_eyetrack_socket(websocket, token)
