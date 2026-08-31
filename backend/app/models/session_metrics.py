from typing import Any

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.entity_base import EntityBase
from app.models.screening_session import ScreeningSession


class SessionMetrics(EntityBase):
    """Aggregated oculomotor metrics computed after a session ends."""

    __tablename__ = "session_metrics"

    session_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("screening_sessions.id"),
        unique=True,
        nullable=False,
        index=True,
    )
    sample_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    mean_fps: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    detection_rate: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    mean_latency_ms: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    fixation_stability: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    saccade_amplitude: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    extras: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)

    session: Mapped["ScreeningSession"] = relationship(
        back_populates="metrics",
        lazy="raise",
    )
