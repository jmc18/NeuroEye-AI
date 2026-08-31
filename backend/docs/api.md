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
- `register` — `POST /api/v1/auth/register`
- `get_me` — `GET /api/v1/auth/me`
- `update_me` — `PATCH /api/v1/auth/me`
- `change_my_email` — `PATCH /api/v1/auth/me/email`
- `change_my_password` — `PATCH /api/v1/auth/me/password`
- `logout` — `POST /api/v1/auth/logout`
- `forgot_password` — `POST /api/v1/auth/forgot-password`
- `reset_password` — `POST /api/v1/auth/reset-password`
- `get_admin_tenants` / `create_admin_tenant` / `get_admin_tenant_by_id` / `update_admin_tenant`
- `get_admin_tenant_users` / `create_admin_tenant_user`
- `get_admin_users` / `update_admin_user`
- `impersonate_admin_user` — `POST /api/v1/admin/users/{id}/impersonate`
- `set_admin_user_password` / `send_admin_user_reset`
- `get_patients` / `create_patient` / `get_patient_by_id` / `update_patient` / `delete_patient`
- `get_dashboard_summary` — `GET /api/v1/dashboard/summary`
- `get_test_presets` — `GET /api/v1/presets`
- `get_sessions` / `create_session` / `get_session_by_id` / `get_session_report`
- WebSocket `WS /api/v1/ws/eyetrack?token=<jwt>` — live gaze stream (not in OpenAPI)

Protected REST routes require `Authorization: Bearer <jwt>`. Super-admin routes under `/api/v1/admin` require `role=super_admin` and reject impersonated sessions.

Password recovery does not send email in this release. In `APP_ENV=development` the reset token is written to the API log (and returned on `send_admin_user_reset`). Impersonation issues a JWT whose `sub` is the target user and whose `impersonator_id` claim is the super admin. Stopping impersonation is a client-side restore of the original session.

## Gaze WebSocket

See [gaze.md](gaze.md) for the hybrid MediaPipe (browser) + gaze math (API) contract.

## OpenAPI follow-up

| Item | Status | Notes |
|------|--------|-------|
| Explicit `operation_id` on all routes | Done | Required for Orval function names |
| Domain tags (`Auth`, `Health`, …) | Done | Orval `tags-split` → one file per tag |
| `tenant_id` on `AuthUserResponse` | Done | Frontend sends `X-Tenant-Id` after login |
| Paginated `Page[T]` schema | Planned | Typed list params for `get_{resource}` |
| `security=[{"BearerAuth": []}]` on protected routes | Planned | Scalar + Orval auth docs |
| Pydantic model for health response | Planned | Replace generic `dict` in schema |

## Example endpoint

```
GET /api/v1/health
```

Returns `{"status": "ok"}`.
