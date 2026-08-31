from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.entity_base import EntityBase

if TYPE_CHECKING:
    from app.models.gaze_sample import GazeSample
    from app.models.patient import Patient
    from app.models.session_metrics import SessionMetrics
    from app.models.tenant import Tenant
    from app.models.test_preset import TestPreset
    from app.models.user import User


class ScreeningSession(EntityBase):
    """Clinical eye-tracking screening session."""

    __tablename__ = "screening_sessions"

    tenant_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("tenants.id"),
        nullable=False,
        index=True,
    )
    patient_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("patients.id"),
        nullable=False,
        index=True,
    )
    clinician_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    preset_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("test_presets.id"),
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="pending",
        index=True,
    )
    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    ended_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    abort_reason: Mapped[str | None] = mapped_column(String(255), nullable=True)

    tenant: Mapped["Tenant"] = relationship(lazy="raise")
    patient: Mapped["Patient"] = relationship(back_populates="sessions", lazy="raise")
    clinician: Mapped["User"] = relationship(back_populates="clinician_sessions", lazy="raise")
    preset: Mapped["TestPreset"] = relationship(lazy="raise")
    samples: Mapped[list["GazeSample"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        lazy="raise",
    )
    metrics: Mapped["SessionMetrics | None"] = relationship(
        back_populates="session",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="raise",
    )
