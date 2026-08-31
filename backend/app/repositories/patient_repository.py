from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.patient import Patient
from app.repositories.base import BaseRepository


class PatientRepository(BaseRepository[Patient]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Patient)

    async def list_for_tenant(
        self,
        tenant_id: str,
        *,
        query: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[Patient], int]:
        filters = [
            Patient.tenant_id == tenant_id,
            Patient.is_deleted.is_(False),
        ]
        if query:
            pattern = f"%{query.strip()}%"
            filters.append(
                or_(
                    Patient.first_name.ilike(pattern),
                    Patient.last_name.ilike(pattern),
                    Patient.second_last_name.ilike(pattern),
                    Patient.email.ilike(pattern),
                )
            )

        count_stmt = select(func.count()).select_from(Patient).where(*filters)
        total = await self._session.scalar(count_stmt) or 0

        stmt = (
            self._base_select()
            .where(*filters)
            .order_by(Patient.last_name, Patient.first_name)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        rows = await self._session.scalars(stmt)
        return list(rows.all()), total

    async def get_for_tenant(self, patient_id: str, tenant_id: str) -> Patient | None:
        return await self._session.scalar(
            select(Patient).where(
                Patient.id == patient_id,
                Patient.tenant_id == tenant_id,
                Patient.is_deleted.is_(False),
            )
        )

    async def count_for_tenant(self, tenant_id: str) -> int:
        result = await self._session.scalar(
            select(func.count()).select_from(Patient).where(
                Patient.tenant_id == tenant_id,
                Patient.is_deleted.is_(False),
            )
        )
        return result or 0
