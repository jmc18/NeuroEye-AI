from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from app.models.entity_base import EntityBase


class UserProfile(EntityBase):
    __tablename__ = "user_profiles"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False
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

    phone_number: Mapped[str] = mapped_column(
        String(20),
        nullable=True,
    )

    avatar_url: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )

    job_title: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )

    user: Mapped["User"] = relationship(
        back_populates="profile",
        lazy="raise"
    )