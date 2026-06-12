from contextlib import asynccontextmanager

from fastapi import FastAPI
from scalar_fastapi import Layout, SearchHotKey, get_scalar_api_reference

from app.api.v1.router import router as v1_router
from app.core.config import settings
from app.core.openapi import API_VERSION, custom_openapi


@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=API_VERSION,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )
    app.openapi = lambda: custom_openapi(app)

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
            servers=[{"url": "http://localhost:8000", "description": "Local"}],
        )

    return app


app = create_app()
