# Database

The backend uses **PostgreSQL** for persistent storage and **Redis** for caching. Both are provided via Docker Compose.

## Start services

From the `backend/` directory:

```powershell
docker compose up -d
```

Check that containers are running:

```powershell
docker compose ps
```

Expected services:

| Service | Container | Port |
|---------|-----------|------|
| PostgreSQL | `neuro-postgres` | `5432` |
| Redis | `neuro-redis` | `6379` |

Stop services:

```powershell
docker compose down
```

To remove data volumes as well:

```powershell
docker compose down -v
```

## Prerequisites

1. Copy and configure `.env` (see [Configuration](configuration.md)).
2. Start Docker services before running migrations or the API.

## Alembic migrations

Alembic reads the database URL from your `.env` file through `app.core.config.Settings`. Run all commands from the `backend/` directory.

### Apply migrations

```powershell
uv run alembic upgrade head
```

### Create a new migration (after model changes)

```powershell
uv run alembic revision --autogenerate -m "describe your change"
```

Review the generated file under `alembic/versions/` before applying it.

### Other useful commands

```powershell
# Show current revision
uv run alembic current

# Show migration history
uv run alembic history

# Roll back one revision
uv run alembic downgrade -1
```

On Windows, if `uv` is not on your PATH:

```powershell
py -m uv run alembic upgrade head
```

## Initial schema

The first migration (`initial`) creates:

- `tenants` — multi-tenant organizations
- `users` — users linked to a tenant

Models live in `app/models/`. Alembic autogenerate imports them via `alembic/env.py`.

## Troubleshooting

### `NameError` or import errors when running Alembic

Ensure all SQLAlchemy types used in models are imported (e.g. `DateTime`, `func` from `sqlalchemy`).

### Connection refused

PostgreSQL is not running. Start it with `docker compose up -d` and confirm with `docker compose ps`.

### Authentication failed

`DB_USER` / `DB_PASSWORD` in `.env` must match `POSTGRES_USER` / `POSTGRES_PASSWORD` in `docker-compose.yml`.

### Empty autogenerate revision

No model changes were detected, or models are not imported in `app/models/__init__.py`.
