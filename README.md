# NeuroEyeAI

Monorepo: FastAPI backend + React frontend.

**IDE:** [VS Code](docs/vscode.md) (tareas, debug y Docker en `.vscode/`).

## Desarrollo local

```bash
# 1. Infra (o todo el stack Docker)
docker compose up --build -d

# 2. Backend local (alternativa al contenedor api)
cd backend
uv run python run.py --reload

# 3. Frontend (otra terminal)
cd frontend
pnpm dev
```

En VS Code: **`Ctrl+Shift+B`** → `dev:all` o `dev:all:docker`.

## Producción (Linux)

```bash
cp .env.production.example .env.production
node scripts/docker-prod-up.mjs
```

Guía: [docker/README.md](docker/README.md)
