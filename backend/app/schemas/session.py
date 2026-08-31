from datetime import datetime
from typing import Any

from app.schemas.base import APIModel


class TestPresetResponse(APIModel):
    id: str
    code: str
    name: str
    description: str | None
    config: dict[str, Any]


class SessionCreate(APIModel):
    patient_id: str
    preset_id: str


class SessionMetricsResponse(APIModel):
    session_id: str
    sample_count: int
    mean_fps: float
    detection_rate: float
    mean_latency_ms: float
    fixation_stability: float
    saccade_amplitude: float
    extras: dict[str, Any]
    risk_level: str


class SessionResponse(APIModel):
    id: str
    patient_id: str
    patient_name: str
    clinician_id: str
    preset_id: str
    preset_code: str
    preset_name: str
    status: str
    started_at: datetime | None
    ended_at: datetime | None
    abort_reason: str | None
    metrics: SessionMetricsResponse | None = None


class SessionListResponse(APIModel):
    items: list[SessionResponse]
    total: int
    page: int
    page_size: int


class SessionReportResponse(APIModel):
    session: SessionResponse
    metrics: SessionMetricsResponse | None
    disclaimer: str


class DashboardSummaryResponse(APIModel):
    patient_count: int
    session_count: int
    completed_session_count: int
    at_risk_count: int
