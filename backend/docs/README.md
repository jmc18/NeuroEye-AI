# Backend documentation

Guides for running and developing the NeuroEyeAI backend.

| Guide | Description |
|-------|-------------|
| [Configuration](configuration.md) | Environment variables (`.env`) |
| [Database](database.md) | PostgreSQL, Redis, and Alembic migrations |
| [API documentation](api.md) | OpenAPI, Swagger, ReDoc, and Scalar |

## Quick start

```powershell
cd backend
copy .env.example .env
docker compose up -d
uv run python run.py --reload
```
