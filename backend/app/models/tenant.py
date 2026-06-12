from sqlalchemy import String

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.entity_base import EntityBase

class Tenant(EntityBase):
    __tablename__ = "tenants"

    name: Mapped[str] = mapped_column(
        String(255), 
        unique=True, 
        nullable=False
    )