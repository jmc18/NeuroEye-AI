from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.entity_base import EntityBase

if TYPE_CHECKING:
    from app.models.screening_session import ScreeningSession
    from app.models.tenant import Tenant


class Patient(EntityBase):
    __tablename__ = "patients"

    tenant_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("tenants.id"),
        nullable=False,
        index=True,
    )

    first_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    last_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    second_last_name: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )

    birth_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )

    phone_number: Mapped[str] = mapped_column(
        String(20),
        nullable=True,
    )

    sex: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    tenant: Mapped["Tenant"] = relationship(
        back_populates="patients",
        lazy="raise",
    )

    sessions: Mapped[list["ScreeningSession"]] = relationship(
        back_populates="patient",
        lazy="raise",
    )

    @property
    def display_name(self) -> str:
        parts = [self.first_name, self.last_name]
        if self.second_last_name:
            parts.append(self.second_last_name)
        return " ".join(parts)
