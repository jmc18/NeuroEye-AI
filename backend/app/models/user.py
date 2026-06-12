from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import func

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.entity_base import EntityBase

class User(EntityBase):
    __tablename__ = "users"

    tenant_id: Mapped[str] = mapped_column(
        String(255), 
        ForeignKey("tenants.id"), 
        nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(255), 
        unique=True, 
        nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        default=True
    )

    deactivated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True
    )