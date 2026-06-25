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
2. Start Docker services before running the API.

## Automatic migrations and seeders (recommended)

Like **EF Core** `Database.MigrateAsync()` + `SeedAsync()`, the API applies pending Alembic migrations and runs idempotent seeders **on startup** via the FastAPI lifespan hook (`app/db/startup.py`).

When you start the API (`uv run python run.py`, F5 debug, or Docker), you do **not** need to run `alembic upgrade head` or `python -m app.db.seeders` manually. If the PostgreSQL server is reachable but the database in `DB_NAME` does not exist yet, it is created automatically before migrations run.

| Variable | Default (dev) | Description |
|----------|---------------|-------------|
| `RUN_MIGRATIONS_ON_STARTUP` | `true` | Apply Alembic `upgrade head` |
| `RUN_SEEDERS_ON_STARTUP` | `true` | Run platform tenant + super admin seeders |
| `SEEDERS_DEVELOPMENT_ONLY` | `false` | If `true`, seed only when `APP_ENV=development` |
| `RUN_DB_STARTUP_IN_LIFESPAN` | `true` | Run startup hook when the app boots |
| `RUN_DB_STARTUP_BEFORE_UVICORN` | `false` | Docker entrypoint: run once before workers |

Production Docker sets `RUN_DB_STARTUP_BEFORE_UVICORN=true` and `RUN_DB_STARTUP_IN_LIFESPAN=false` so migrations/seed run once before multi-worker Uvicorn starts.

Manual CLI (optional):

```powershell
uv run python -m app.db.startup
uv run python -m app.db.seeders
```

## Alembic migrations

Alembic reads the database URL from your `.env` file through `app.core.config.Settings`. Run all commands from the `backend/` directory.

### Create a new migration (after model changes)

This is the **only** step you need to run manually when models change:

```powershell
uv run alembic revision --autogenerate -m "describe your change"
```

Review the generated file under `alembic/versions/` before restarting the API (migrations apply automatically on startup).

### Apply migrations manually (optional)

```powershell
uv run alembic upgrade head
```

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
py -m uv run alembic revision --autogenerate -m "describe your change"
```

### Seed platform super admin manually (optional)

Configure your credentials in `.env` (see [Configuration](configuration.md)), then run:

```powershell
uv run python -m app.db.seeders
```

This creates the system tenant **NeuroScan Platform** (`is_system=true`), the **Super Admin** role, and your platform administrator user. The seeder is idempotent: running it again will not duplicate records.

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
