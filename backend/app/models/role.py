from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String

from app.models.entity_base import EntityBase
from app.models.tenant import Tenant


class Role(EntityBase):
    __tablename__ = "roles"

    tenant_id: Mapped[str] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    tenant: Mapped["Tenant"] = relationship(
        back_populates="roles",
        lazy="raise"
    )

    user_roles: Mapped[list["UserRole"]] = relationship(
        back_populates="role",
        cascade="all, delete-orphan",
        lazy="raise"
    )