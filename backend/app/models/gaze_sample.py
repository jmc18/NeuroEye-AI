from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.entity_base import EntityBase
from app.models.screening_session import ScreeningSession


class GazeSample(EntityBase):
    """Single gaze sample captured during a screening session."""

    __tablename__ = "gaze_samples"

    session_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("screening_sessions.id"),
        nullable=False,
        index=True,
    )
    t_ms: Mapped[int] = mapped_column(Integer, nullable=False)
    x_norm: Mapped[float] = mapped_column(Float, nullable=False)
    y_norm: Mapped[float] = mapped_column(Float, nullable=False)
    eye_detected: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    fps: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    quality: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    session: Mapped["ScreeningSession"] = relationship(
        back_populates="samples",
        lazy="raise",
    )
