from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

API_VERSION = "0.1.0"
API_DESCRIPTION = """
NeuroEyeAI REST API for eye-tracking analysis and multi-tenant user management.

## Authentication

Most endpoints require a JWT bearer token. Use the **Authorize** button in the
documentation UI to set your token, or send:

```
Authorization: Bearer <your-token>
```
"""

OPENAPI_TAGS = [
    {
        "name": "Health",
        "description": "Service health and readiness checks.",
    },
    {
        "name": "Auth",
        "description": "Authentication and session management.",
    },
    {
        "name": "Tenants",
        "description": "Tenant (organization) management.",
    },
    {
        "name": "Users",
        "description": "User accounts and authentication.",
    },
    {
        "name": "Vision",
        "description": "Eye-tracking and vision analysis endpoints.",
    },
]


def custom_openapi(app: FastAPI) -> dict:
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=API_DESCRIPTION,
        routes=app.routes,
        tags=OPENAPI_TAGS,
    )

    openapi_schema.setdefault("components", {}).setdefault(
        "securitySchemes",
        {},
    )["BearerAuth"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Enter a JWT access token.",
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema
