from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, ForeignKey, String

from app.models.entity_base import EntityBase
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

    tenant: Mapped["Tenant"] = relationship(
        back_populates="patients",
        lazy="raise"
    )