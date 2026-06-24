from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserRole(Base):
    """Junction table (user ↔ role). Uses composite PK, not EntityBase."""
    __tablename__ = "user_roles"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        primary_key=True
    )

    role_id: Mapped[str] = mapped_column(
        ForeignKey("roles.id"),
        primary_key=True
    )

    user: Mapped["User"] = relationship(
        back_populates="user_roles",
        lazy="raise"
    )

    role: Mapped["Role"] = relationship(
        back_populates="user_roles",
        lazy="raise"
    )