from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import Layout, SearchHotKey, get_scalar_api_reference

import app.core.async_runtime  # noqa: F401 — Windows SelectorEventLoop before uvicorn starts
from app.api.v1.router import router as v1_router
from app.core.config import settings
from app.core.container import container
from app.core.openapi import API_VERSION, custom_openapi
from app.db.startup import prepare_database_on_startup


@asynccontextmanager
async def lifespan(_app: FastAPI):
    await prepare_database_on_startup()
    yield


def create_app() -> FastAPI:
    container.wire(modules=["app.dependencies.database"])

    app = FastAPI(
        title=settings.app_name,
        version=API_VERSION,
        lifespan=lifespan,
        docs_url=None,
        redoc_url=None,
        openapi_url="/openapi.json",
    )
    app.openapi = lambda: custom_openapi(app)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(v1_router, prefix="/api/v1")

    @app.get("/scalar", include_in_schema=False)
    async def scalar_docs():
        return get_scalar_api_reference(
            openapi_url=app.openapi_url,
            title=settings.app_name,
            layout=Layout.MODERN,
            show_sidebar=True,
            dark_mode=True,
            search_hot_key=SearchHotKey.K,
            default_open_all_tags=False,
            servers=[{"url": settings.public_api_url, "description": "API"}],
        )

    return app


app = create_app()
