# NeuroEyeAI Backend

FastAPI backend for NeuroEyeAI.

## Requirements

- Python 3.13+
- [uv](https://docs.astral.sh/uv/)
- Docker (for PostgreSQL and Redis)

## Quick start

```powershell
cd backend

# 1. Environment
copy .env.example .env

# 2. Install dependencies
uv sync

# 3. Start database and Redis
docker compose up -d

# Optional: run API in Docker too (skips Windows asyncio issues)
# docker compose up --build -d

# 4. Run migrations
uv run alembic upgrade head

# 5. Start the API (Windows: use run.py — psycopg async needs SelectorEventLoop)
uv run python run.py --reload
```

API docs (with server running):

- **Scalar:** http://localhost:8000/scalar
- **OpenAPI JSON:** http://localhost:8000/openapi.json

Generate frontend types: `cd ../frontend && pnpm api:sync`

## Documentation

See the [`docs/`](docs/README.md) folder:

- [Configuration](docs/configuration.md) — `.env` variables
- [Database](docs/database.md) — Docker, PostgreSQL, Redis, and Alembic
- [Docker](docs/docker.md) — infra vs API en contenedor (Alpine / slim)
- [API documentation](docs/api.md) — Scalar, OpenAPI, and frontend codegen

## Project layout

```
backend/
├── app/              # Application code
│   ├── api/          # API routes
│   ├── core/         # Settings and config
│   ├── db/           # Database session and base
│   └── models/       # SQLAlchemy models
├── alembic/          # Database migrations
├── docs/             # Documentation
├── docker-compose.yml
└── .env              # Local config (not committed)
```
