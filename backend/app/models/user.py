from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import func

from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.orm import mapped_column

from app.models.entity_base import EntityBase
from app.models.tenant import Tenant

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

    ## Navigation properties

    tenant: Mapped["Tenant"] = relationship(
        back_populates="users",
        lazy="raise"
    )

    profile: Mapped["UserProfile"] = relationship(
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="raise"
    )

    user_roles: Mapped[list["UserRole"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="raise"
    )