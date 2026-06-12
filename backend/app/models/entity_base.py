from uuid import uuid4

from sqlalchemy import DateTime
from sqlalchemy import func

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base

class EntityBase(Base):
    __abstract__ = True

    id: Mapped[str] = mapped_column(
            primary_key=True, 
            default=lambda: str(uuid4())
        )
    created_at: Mapped[DateTime] = mapped_column(
            DateTime(timezone=True), 
            server_default=func.now()
        )
    updated_at: Mapped[DateTime] = mapped_column(
            DateTime(timezone=True), 
            onupdate=func.now()
        )
    is_deleted: Mapped[bool] = mapped_column(
            default=False
        )
    deleted_at: Mapped[DateTime] = mapped_column(
            DateTime(timezone=True),
            onupdate=func.now(),
            nullable=True
        )