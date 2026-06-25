# Docker (desarrollo)

Imágenes ligeras: **Alpine** para datos, **bookworm-slim + uv** para la API.

## Qué va en Docker y qué no

| Servicio | Docker | Imagen | Motivo |
|----------|--------|--------|--------|
| PostgreSQL | Sí | `postgres:17-alpine` | Infra estable, ~80 MB |
| Redis | Sí | `redis:8-alpine` | Cache, ~30 MB |
| API (FastAPI) | Opcional | `python3.13-bookworm-slim` | Evita bugs de asyncio/psycopg en Windows |
| Frontend (Vite) | No (recomendado) | — | HMR más rápido en local |

## Solo infra (por defecto)

Equivalente a lo que ya usabas:

```powershell
cd backend
docker compose up -d
uv run python run.py --reload
```

## API en Docker (dev)

Útil en Windows (evita bug asyncio/psycopg) o desde **VS Code** (`dev:docker` / extensión Docker):

```bash
# Desde la raíz del repo
docker compose up --build -d

# O solo infra + script con logs
node scripts/docker-infra-up.mjs
node scripts/docker-dev-api.mjs
```

- API: http://localhost:8000  
- Scalar: http://localhost:8000/scalar  
- Frontend local: `cd ../frontend && pnpm dev` (apunta a `localhost:8000`)

Dentro del contenedor, `DB_HOST=postgres` y `REDIS_HOST=redis` se inyectan en `docker-compose.yml`; tu `.env` local puede seguir con `localhost` para Alembic/seeders.

## Comandos útiles

```powershell
# Logs de la API
docker compose logs -f api

# Parar todo (incl. API)
docker compose down

# Rebuild API tras cambiar pyproject.toml / uv.lock
docker compose up --build -d api
```

## Tamaño de la imagen API

La base es slim (~150 MB), pero dependencias ML (`opencv`, `mediapipe`, `xgboost`, etc.) aumentan la imagen final. Para desarrollo de auth/CRUD es aceptable; visión pesada puede ser más cómoda en nativo con GPU.

## Producción (Linux)

Stack completo documentado en **[docker/README.md](../../docker/README.md)**.

```bash
cp .env.production.example .env.production
./docker/deploy.sh
```

Incluye `backend/Dockerfile` multi-stage (non-root), nginx Alpine y red interna para Postgres/Redis.
