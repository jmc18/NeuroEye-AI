# API documentation

The backend exposes interactive API documentation via OpenAPI 3.

## URLs

| Resource | URL |
|----------|-----|
| **Scalar** (API reference) | http://localhost:8000/scalar |
| **OpenAPI JSON** (codegen) | http://localhost:8000/openapi.json |

Swagger UI (`/docs`) and ReDoc (`/redoc`) are disabled. Scalar is the single docs UI.

Start the server first:

```powershell
cd backend
uv run python run.py --reload
```

## Frontend type generation

From the `frontend/` directory:

```powershell
pnpm api:sync
```

See [frontend/docs/api-codegen.md](../frontend/docs/api-codegen.md) for `@/types/api.generated` usage.

## Scalar

[Scalar](https://scalar.com/) provides a polished API reference with dark mode, keyboard search (`K`), and built-in request testing. Configuration lives in `app/main.py` (`get_scalar_api_reference`).

## OpenAPI customization

Metadata, tags, and the JWT bearer scheme are defined in `app/core/openapi.py`:

- API title comes from `APP_NAME` in `.env`
- Version is set in `API_VERSION`
- Tags group endpoints (`Health`, `Auth`, …)
- `BearerAuth` is documented for protected routes

## `operation_id` convention

Every endpoint must declare an explicit `operation_id` (unique, snake_case). Orval uses these IDs as generated client function names.

| HTTP verb | Pattern | Example |
|-----------|---------|---------|
| GET list | `get_{resource}` | `get_users` |
| GET by id | `get_{resource}_by_id` | `get_user_by_id` |
| POST create | `create_{resource}` | `create_patient` |
| PUT/PATCH update | `update_{resource}` | `update_patient` |
| DELETE | `delete_{resource}` | `delete_patient` |

Current endpoints:

- `health_check` — `GET /api/v1/health`
- `login` — `POST /api/v1/auth/login`

## Example endpoint

```
GET /api/v1/health
```

Returns `{"status": "ok"}`.
