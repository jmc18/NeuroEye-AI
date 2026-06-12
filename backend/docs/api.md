# API documentation

The backend exposes interactive API documentation via OpenAPI 3.

## URLs

| UI | URL | Best for |
|----|-----|----------|
| **Scalar** (recommended) | http://localhost:8000/scalar | Modern UI, search, try-it-out |
| Swagger UI | http://localhost:8000/docs | Classic OpenAPI explorer |
| ReDoc | http://localhost:8000/redoc | Readable reference docs |
| OpenAPI JSON | http://localhost:8000/openapi.json | Codegen, Postman, CI |

Start the server first:

```powershell
cd backend
uv run uvicorn app.main:app --reload
```

## Scalar (recommended)

[Scalar](https://scalar.com/) provides a polished API reference with dark mode, keyboard search (`K`), and built-in request testing. It is mounted at `/scalar` and reads the same OpenAPI schema as Swagger and ReDoc.

Configuration lives in `app/main.py` (`get_scalar_api_reference`).

## OpenAPI customization

Metadata, tags, and the JWT bearer scheme are defined in `app/core/openapi.py`:

- API title comes from `APP_NAME` in `.env`
- Version is set in `API_VERSION`
- Tags group endpoints (`Health`, `Tenants`, `Users`, `Vision`)
- `BearerAuth` is documented for future protected routes

When you add authenticated endpoints, attach FastAPI security dependencies; they will appear automatically in the schema.

## Example endpoint

```
GET /api/v1/health
```

Returns `{"status": "ok"}` — useful for health checks and to verify docs are working.
