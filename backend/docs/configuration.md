# Configuration

The backend reads settings from a `.env` file in the `backend/` directory.

## Setup

```powershell
cd backend
copy .env.example .env
```

Edit `.env` with your local values. Never commit `.env` to version control.

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_NAME` | Application display name | `NeuroEyeAI` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `neuroeye` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET_KEY` | Secret for signing JWT tokens | Change in production |
| `JWT_ALGORITHM` | JWT signing algorithm | `HS256` |
| `SEED_PLATFORM_EMAIL` | Super admin email for DB seeders | `admin@neuroscan.platform` |
| `SEED_PLATFORM_PASSWORD` | Super admin password for DB seeders | Change before seeding |
| `SEED_PLATFORM_FIRST_NAME` | Super admin first name | `Javier` |
| `SEED_PLATFORM_LAST_NAME` | Super admin last name | `Martínez` |
| `SEED_PLATFORM_SECOND_LAST_NAME` | Super admin second last name | `Cornejo` |
| `SEED_CLINICIAN_EMAIL` | Demo clinician email | `clinician@neuroeye.ai` |
| `SEED_CLINICIAN_PASSWORD` | Demo clinician password | `Clinician123!` |
| `SEED_CLINICIAN_FIRST_NAME` | Demo clinician first name | `Aris` |
| `SEED_CLINICIAN_LAST_NAME` | Demo clinician last name | `Thorne` |
| `APP_ENV` | Environment (`development`, `production`, `staging`) | `development` |
| `RUN_MIGRATIONS_ON_STARTUP` | Apply Alembic on API startup | `true` |
| `RUN_SEEDERS_ON_STARTUP` | Run idempotent seeders on startup | `true` |
| `SEEDERS_DEVELOPMENT_ONLY` | Seed only when `APP_ENV=development` | `false` |
| `RUN_DB_STARTUP_IN_LIFESPAN` | Startup hook in FastAPI lifespan | `true` |
| `RUN_DB_STARTUP_BEFORE_UVICORN` | Run startup once in Docker entrypoint | `false` (dev) |

## How settings are loaded

Settings are defined in `app/core/config.py` using Pydantic Settings. The same values are used by:

- The FastAPI application (`app/db/database.py`)
- Alembic migrations (`alembic/env.py`)

The database connection URL is built automatically from `DB_*` variables:

```
postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}
```

You do not need to set a separate `DATABASE_URL` in `.env`.

## Docker Compose alignment

`docker-compose.yml` creates PostgreSQL and Redis with defaults that match `.env.example`. If you change ports or credentials in `.env`, update `docker-compose.yml` accordingly.
