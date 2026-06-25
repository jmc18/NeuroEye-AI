# API types (OpenAPI codegen)

The frontend uses two codegen paths during the Orval migration:

| Tool | Script | Output |
|------|--------|--------|
| **Orval** (primary) | `pnpm generate:api` | `src/api/generated/**` |
| **openapi-typescript** (legacy) | `pnpm api:generate` | `src/types/api.generated.ts` |

`openapi-typescript` is kept until all imports of `@/types/api.generated` are migrated to `@api/generated/models`. Remove it only when no active imports remain.

## Prerequisites

Backend running at `http://localhost:8000` (or set `VITE_API_URL`).

## Commands

```powershell
cd frontend

# Download openapi.json into src/api/openapi/
pnpm api:fetch:dev

# Generate Orval axios client (from local snapshot — CI-friendly)
pnpm generate:api

# Full dev sync: fetch + Orval
pnpm api:sync:dev

# CI sync: fetch (VITE_API_URL from env) + Orval
pnpm api:sync

# Legacy openapi-typescript types
pnpm api:generate
```

Snapshot path: `src/api/openapi/openapi.json`

Orval output: `src/api/generated/` (tags-split: `auth/auth.ts`, `health/health.ts`, `models/`)

See [orval-api-client.md](./orval-api-client.md) for architecture and usage examples.

## Legacy typed paths

`@lib/typed-api` has been removed. Use Orval functions instead:

```typescript
import { login } from '@api/generated/auth/auth'
```

## Legacy schema types

```typescript
import type { components, paths } from '@/types/api.generated'

type LoginResponse = components['schemas']['LoginResponse']
```

Prefer Orval models:

```typescript
import type { LoginResponse } from '@api/generated/models'
```

## API documentation

Interactive docs: http://localhost:8000/scalar

OpenAPI JSON: http://localhost:8000/openapi.json
