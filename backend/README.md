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

# 4. Run migrations
uv run alembic upgrade head

# 5. Start the API
uv run uvicorn app.main:app --reload
```

API docs (with server running):

- **Scalar (recommended):** http://localhost:8000/scalar
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Documentation

See the [`docs/`](docs/README.md) folder:

- [Configuration](docs/configuration.md) — `.env` variables
- [Database](docs/database.md) — Docker, PostgreSQL, Redis, and Alembic
- [API documentation](docs/api.md) — OpenAPI, Swagger, ReDoc, and Scalar

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
