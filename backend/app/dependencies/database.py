from collections.abc import AsyncGenerator

from dependency_injector.wiring import Provide, inject
from fastapi import Depends

from app.core.container import Container
from app.repositories.unit_of_work import UnitOfWork


@inject
async def get_unit_of_work(
    uow: UnitOfWork = Depends(Provide[Container.unit_of_work]),
) -> AsyncGenerator[UnitOfWork, None]:
    try:
        yield uow
        await uow.commit()
    except Exception:
        await uow.rollback()
        raise
    finally:
        await uow.close()
