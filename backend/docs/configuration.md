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
