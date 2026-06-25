# Orval API client

Production-ready HTTP layer: **Orval** generates typed axios functions; **custom mutator** centralizes auth and multi-tenant headers.

## Directory layout

```
src/api/
├── openapi/
│   └── openapi.json          # snapshot (CI)
├── http/
│   ├── session.ts            # in-memory token + tenantId
│   ├── axios.ts              # AXIOS_INSTANCE + customInstance (Orval mutator)
│   └── errors.ts             # getApiErrorMessage
├── generated/                # Orval — do not edit
│   ├── auth.ts
│   ├── health.ts
│   └── models/
└── index.ts
```

## Layer rule

```
Page → hook/store → service (logic) → login() Orval → customInstance → Axios
```

- **Services** (`features/*/services/`): mapping, persistence, composition.
- **No passthrough wrappers** (`authApi.login()` → use `login()` from Orval).
- **No localStorage in axios** — `httpSession` is synced from `authService` / store hydration.

## Multi-tenant headers

After login, `authService` sets:

```typescript
httpSession.setAccessToken(response.access_token)
httpSession.setTenantId(response.user.tenant_id)
```

Every request automatically includes:

- `Authorization: Bearer <token>` when a token exists
- `X-Tenant-Id: <tenant_id>` when tenant is set

## Examples

### Login

```typescript
import { login } from '@api/generated/auth/auth'
import { getApiErrorMessage } from '@api/http/errors'

try {
  const session = await login({ email, password })
} catch (error) {
  setError(getApiErrorMessage(error))
}
```

### Health check

```typescript
import { health_check } from '@api/generated/health/health'

const status = await health_check()
```

### Future list endpoint

When the backend exposes `operation_id="get_users"`:

```typescript
import { get_users } from '@api/generated/users/users'

const page = await get_users({ page: 1, page_size: 20 })
```

## Regeneration

| Path | Editable? | Command |
|------|-----------|---------|
| `src/api/generated/**` | No | `pnpm generate:api` (`clean: true`) |
| `src/api/http/**` | Yes | manual |
| `src/api/openapi/openapi.json` | snapshot | `pnpm api:fetch` / `api:fetch:dev` |
| `src/types/api.generated.ts` | No | `pnpm api:generate` (legacy) |

Commit snapshot + generated output so CI can run `pnpm generate:api` without a running backend.

## Backend conventions

See [backend/docs/api.md](../../backend/docs/api.md) for `operation_id` naming (`login`, `health_check`, `get_users`, …).

FastAPI tags drive Orval file names (`tags-split`): tag `Auth` → `auth/auth.ts`, `Health` → `health/health.ts`.
