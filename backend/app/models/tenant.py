from sqlalchemy import String

from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.orm import mapped_column

from app.models.entity_base import EntityBase

class Tenant(EntityBase):
    __tablename__ = "tenants"

    name: Mapped[str] = mapped_column(
        String(255), 
        unique=True, 
        nullable=False
    )

    is_system: Mapped[bool] = mapped_column(
        default=False
    )

    ## Navigation properties
    users: Mapped[list["User"]] = relationship(
        back_populates="tenant",
        cascade="all, delete-orphan",
        lazy="raise"
    )
    patients: Mapped[list["Patient"]] = relationship(
        back_populates="tenant",
        cascade="all, delete-orphan",
        lazy="raise"
    )

    roles: Mapped[list["Role"]] = relationship(
        back_populates="tenant",
        cascade="all, delete-orphan",
        lazy="raise"
    )