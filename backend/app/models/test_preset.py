from typing import Any

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.entity_base import EntityBase
from app.models.tenant import Tenant


class TestPreset(EntityBase):
    """Oculomotor test protocol (saccades, fixation, calibration)."""

    __tablename__ = "test_presets"

    tenant_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("tenants.id"),
        nullable=False,
        index=True,
    )

    code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    config: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)

    tenant: Mapped["Tenant"] = relationship(lazy="raise")
