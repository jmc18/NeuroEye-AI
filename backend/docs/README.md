# Backend documentation

Guides for running and developing the NeuroEyeAI backend.

| Guide | Description |
|-------|-------------|
| [Configuration](configuration.md) | Environment variables (`.env`) |
| [Database](database.md) | PostgreSQL, Redis, and Alembic migrations |
| [API documentation](api.md) | OpenAPI, Scalar, and REST/WS endpoints |
| [Gaze pipeline](gaze.md) | Hybrid MediaPipe + WebSocket gaze contract |

## Quick start

```powershell
cd backend
copy .env.example .env
docker compose up -d
uv run python run.py --reload
```
