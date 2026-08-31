"""Authenticated WebSocket handler for live gaze streaming."""

from __future__ import annotations

import asyncio
import json
import time
from datetime import UTC, datetime
from typing import Any

import structlog
from fastapi import WebSocket, WebSocketDisconnect

from app.core.container import container
from app.dependencies.auth import get_user_from_token
from app.models.gaze_sample import GazeSample
from app.models.screening_session import ScreeningSession
from app.repositories.unit_of_work import UnitOfWork
from app.services.metrics_service import metrics_service
from app.vision.gaze import gaze_from_landmarks

logger = structlog.get_logger(__name__)

FLUSH_EVERY = 25

STIMULUS_BY_CODE: dict[str, list[dict[str, Any]]] = {
    "saccades": [
        {"phase": "saccade", "x": 0.15, "y": 0.5},
        {"phase": "saccade", "x": 0.85, "y": 0.5},
        {"phase": "saccade", "x": 0.15, "y": 0.5},
        {"phase": "saccade", "x": 0.85, "y": 0.5},
    ],
    "fixation": [
        {"phase": "fixation", "x": 0.5, "y": 0.5},
    ],
    "calibration": [
        {"phase": "calibration", "x": x, "y": y}
        for y in (0.15, 0.5, 0.85)
        for x in (0.15, 0.5, 0.85)
    ],
}


async def _compute_metrics_job(session_id: str) -> None:
    uow = container.unit_of_work()
    try:
        await metrics_service.compute_for_session(uow, session_id)
        await uow.commit()
        logger.info("session_metrics_computed", session_id=session_id)
    except Exception:
        await uow.rollback()
        logger.exception("session_metrics_failed", session_id=session_id)
    finally:
        await uow.close()


class EyeTrackConnection:
    def __init__(self, websocket: WebSocket, uow: UnitOfWork) -> None:
        self.websocket = websocket
        self.uow = uow
        self.session: ScreeningSession | None = None
        self.buffer: list[GazeSample] = []
        self.stimulus_index = 0
        self.preset_code = "fixation"

    async def send(self, payload: dict[str, Any]) -> None:
        await self.websocket.send_json(payload)

    async def flush(self) -> None:
        if not self.buffer:
            return
        await self.uow.gaze_samples.add_many(self.buffer)
        await self.uow.session.flush()
        self.buffer.clear()

    def _next_stimulus(self) -> dict[str, Any]:
        sequence = STIMULUS_BY_CODE.get(self.preset_code, STIMULUS_BY_CODE["fixation"])
        target = sequence[self.stimulus_index % len(sequence)]
        self.stimulus_index += 1
        return {"type": "stimulus", **target}

    async def start_session(self, user_id: str, tenant_id: str, data: dict[str, Any]) -> None:
        patient_id = str(data.get("patient_id", ""))
        preset_id = str(data.get("preset_id", ""))
        patient = await self.uow.patients.get_for_tenant(patient_id, tenant_id)
        preset = await self.uow.test_presets.get_for_tenant(preset_id, tenant_id)
        if patient is None or preset is None:
            await self.send({"type": "error", "detail": "Invalid patient or preset"})
            return

        session = ScreeningSession(
            tenant_id=tenant_id,
            patient_id=patient.id,
            clinician_id=user_id,
            preset_id=preset.id,
            status="running",
            started_at=datetime.now(UTC),
        )
        await self.uow.screening_sessions.add(session)
        await self.uow.session.flush()
        self.session = session
        self.preset_code = preset.code
        self.stimulus_index = 0
        await self.send(
            {
                "type": "session.started",
                "session_id": session.id,
                "preset_code": preset.code,
            }
        )
        await self.send(self._next_stimulus())

    async def ingest_landmarks(self, data: dict[str, Any]) -> None:
        if self.session is None:
            await self.send({"type": "error", "detail": "No active session"})
            return

        client_ts = data.get("client_ts")
        latency_ms = 0.0
        if isinstance(client_ts, (int, float)):
            latency_ms = max(0.0, time.time() * 1000 - float(client_ts))

        x_norm, y_norm, eye_detected, quality = gaze_from_landmarks(
            face_detected=bool(data.get("face_detected")),
            iris_l=data.get("iris_l"),
            iris_r=data.get("iris_r"),
            eye_corners=data.get("eye_corners"),
        )
        fps = float(data.get("fps") or 0.0)
        t_ms = int(data.get("t_ms") or 0)

        sample = GazeSample(
            session_id=self.session.id,
            t_ms=t_ms,
            x_norm=x_norm,
            y_norm=y_norm,
            eye_detected=eye_detected,
            fps=fps,
            quality=quality,
        )
        self.buffer.append(sample)
        if len(self.buffer) >= FLUSH_EVERY:
            await self.flush()

        await self.send(
            {
                "type": "gaze",
                "x_norm": x_norm,
                "y_norm": y_norm,
                "eye_detected": eye_detected,
                "fps": fps,
                "quality": quality,
                "latency_ms": round(latency_ms, 2),
            }
        )

        if t_ms > 0 and t_ms % 4000 < 80:
            await self.send(self._next_stimulus())

    async def finish(self, *, aborted: bool, reason: str | None = None) -> None:
        await self.flush()
        if self.session is None:
            return
        self.session.status = "aborted" if aborted else "completed"
        self.session.ended_at = datetime.now(UTC)
        self.session.abort_reason = reason
        await self.uow.session.flush()
        session_id = self.session.id
        await self.uow.commit()
        asyncio.create_task(_compute_metrics_job(session_id))
        await self.send({"type": "session.ended", "session_id": session_id, "aborted": aborted})


async def handle_eyetrack_socket(websocket: WebSocket, token: str) -> None:
    await websocket.accept()
    uow = container.unit_of_work()
    try:
        user = await get_user_from_token(uow, token)
    except Exception as exc:
        await websocket.close(code=4401, reason=str(getattr(exc, "detail", "Unauthorized")))
        await uow.close()
        return

    connection = EyeTrackConnection(websocket, uow)
    try:
        await connection.send({"type": "ready", "user_id": user.id})
        while True:
            raw = await websocket.receive_text()
            try:
                message = json.loads(raw)
            except json.JSONDecodeError:
                await connection.send({"type": "error", "detail": "Invalid JSON"})
                continue

            msg_type = message.get("type")
            if msg_type == "session.start":
                await connection.start_session(user.id, user.tenant_id, message)
            elif msg_type == "landmarks":
                await connection.ingest_landmarks(message)
            elif msg_type == "session.end":
                await connection.finish(aborted=False)
            elif msg_type == "session.abort":
                await connection.finish(aborted=True, reason=str(message.get("reason") or "aborted"))
            else:
                await connection.send({"type": "error", "detail": f"Unknown type: {msg_type}"})
    except WebSocketDisconnect:
        logger.info("eyetrack_disconnected", user_id=user.id)
        if connection.session and connection.session.status == "running":
            await connection.finish(aborted=True, reason="disconnect")
    except Exception:
        logger.exception("eyetrack_socket_error")
        try:
            await websocket.close(code=1011)
        except Exception:
            pass
    finally:
        await uow.close()
