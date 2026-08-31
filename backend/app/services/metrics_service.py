"""Post-session oculomotor metrics computed from stored gaze samples."""

from __future__ import annotations

import math
import statistics

from app.models.gaze_sample import GazeSample
from app.models.session_metrics import SessionMetrics
from app.repositories.unit_of_work import UnitOfWork

RISK_LOW = "low"
RISK_MODERATE = "moderate"
RISK_HIGH = "high"
RISK_CRITICAL = "critical"


def risk_from_metrics(
    *,
    detection_rate: float,
    fixation_stability: float,
    saccade_amplitude: float,
) -> str:
    if detection_rate < 0.55 or fixation_stability > 0.18:
        return RISK_CRITICAL
    if detection_rate < 0.7 or fixation_stability > 0.12 or saccade_amplitude > 0.55:
        return RISK_HIGH
    if fixation_stability > 0.07 or saccade_amplitude > 0.4:
        return RISK_MODERATE
    return RISK_LOW


def _compute(samples: list[GazeSample]) -> dict[str, float | int | dict]:
    if not samples:
        return {
            "sample_count": 0,
            "mean_fps": 0.0,
            "detection_rate": 0.0,
            "mean_latency_ms": 0.0,
            "fixation_stability": 0.0,
            "saccade_amplitude": 0.0,
            "extras": {},
        }

    detected = [s for s in samples if s.eye_detected]
    xs = [s.x_norm for s in detected]
    ys = [s.y_norm for s in detected]
    fps_values = [s.fps for s in samples if s.fps > 0]

    fixation_stability = 0.0
    if len(xs) >= 2:
        fixation_stability = math.sqrt(
            statistics.pstdev(xs) ** 2 + statistics.pstdev(ys) ** 2
        )

    saccade_amplitude = 0.0
    if len(detected) >= 2:
        distances = [
            math.hypot(
                detected[i].x_norm - detected[i - 1].x_norm,
                detected[i].y_norm - detected[i - 1].y_norm,
            )
            for i in range(1, len(detected))
        ]
        saccade_amplitude = max(distances) if distances else 0.0

    return {
        "sample_count": len(samples),
        "mean_fps": statistics.fmean(fps_values) if fps_values else 0.0,
        "detection_rate": len(detected) / len(samples),
        "mean_latency_ms": 0.0,
        "fixation_stability": fixation_stability,
        "saccade_amplitude": saccade_amplitude,
        "extras": {
            "detected_samples": len(detected),
            "duration_ms": samples[-1].t_ms - samples[0].t_ms if len(samples) > 1 else 0,
        },
    }


class MetricsService:
    async def compute_for_session(self, uow: UnitOfWork, session_id: str) -> SessionMetrics:
        existing = await uow.session_metrics.get_by_session_id(session_id)
        samples = await uow.gaze_samples.list_for_session(session_id)
        values = _compute(samples)

        extras = dict(values["extras"])  # type: ignore[arg-type]
        extras["risk_level"] = risk_from_metrics(
            detection_rate=float(values["detection_rate"]),
            fixation_stability=float(values["fixation_stability"]),
            saccade_amplitude=float(values["saccade_amplitude"]),
        )

        if existing is None:
            existing = SessionMetrics(session_id=session_id)
            await uow.session_metrics.add(existing)

        existing.sample_count = int(values["sample_count"])
        existing.mean_fps = float(values["mean_fps"])
        existing.detection_rate = float(values["detection_rate"])
        existing.mean_latency_ms = float(values["mean_latency_ms"])
        existing.fixation_stability = float(values["fixation_stability"])
        existing.saccade_amplitude = float(values["saccade_amplitude"])
        existing.extras = extras
        await uow.session_metrics.flush()
        return existing


metrics_service = MetricsService()
