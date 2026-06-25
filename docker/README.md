# Despliegue en Linux (producción)

Stack Docker optimizado para servidor Linux. Imágenes base **Alpine** / **bookworm-slim**.

## Arquitectura

```
Internet :80
    │
    ▼
┌─────────────┐     /api/*  ┌──────────┐
│ web (nginx) │ ───────────►│   api    │
│  + static   │             └────┬─────┘
└─────────────┘                  │
                          ┌──────┴──────┐
                          ▼             ▼
                     postgres       redis
                     (interno)     (interno)
```

| Servicio | Imagen | Expuesto |
|----------|--------|----------|
| `web` | `nginx:1.27-alpine` + build Vite | Puerto 80 (configurable) |
| `api` | `python:3.13-slim` multi-stage | Solo red interna |
| `postgres` | `postgres:17-alpine` | Solo red interna |
| `redis` | `redis:8-alpine` | Solo red interna |

El frontend llama a la API en el **mismo dominio** (`/api/v1/...`); no hace falta CORS cross-origin si usas un solo host.

## Requisitos en el servidor

- Linux (Ubuntu/Debian recomendado)
- Docker Engine 24+
- Docker Compose v2
- 2 GB RAM mínimo (más si usas ML/visión)

## Despliegue rápido

```bash
# En el servidor, clonar repo
git clone <repo-url> neuroeye && cd neuroeye

# Configurar secrets
cp .env.production.example .env.production
nano .env.production   # DB_PASSWORD, JWT_SECRET_KEY, dominio, seeder

# Levantar stack (Linux/macOS)
chmod +x docker/deploy.sh
./docker/deploy.sh

# Alternativa multiplataforma (Windows / Mac / Linux)
node scripts/docker-prod-up.mjs
```

Abre `http://<tu-servidor>/` (frontend) y `http://<tu-servidor>/scalar` (docs API).

Migraciones y seeders se ejecutan automáticamente al arrancar el contenedor `api` (ver `RUN_MIGRATIONS_ON_STARTUP`, `RUN_SEEDERS_ON_STARTUP` en `.env.production`).

## Variables importantes (`.env.production`)

| Variable | Descripción |
|----------|-------------|
| `DB_PASSWORD` | Password PostgreSQL |
| `JWT_SECRET_KEY` | Secreto JWT (generar: `openssl rand -hex 32`) |
| `PUBLIC_API_URL` | URL pública, p. ej. `https://app.tudominio.com` |
| `CORS_ORIGINS` | Mismo dominio si nginx sirve todo |
| `HTTP_PORT` | Puerto host (default `80`) |
| `UVICORN_WORKERS` | Workers API (default `2`) |
| `RUN_MIGRATIONS_ON_STARTUP` | `true` aplica Alembic al arrancar |
| `RUN_SEEDERS_ON_STARTUP` | `true` crea tenant/super admin idempotente al arrancar |

## HTTPS (recomendado)

Opciones ligeras:

1. **Caddy** o **Traefik** delante del puerto 80 con Let's Encrypt
2. **Certbot** + nginx en el host que hace proxy a `127.0.0.1:80`

Ejemplo Caddyfile:

```caddy
app.tudominio.com {
    reverse_proxy localhost:80
}
```

Actualiza `PUBLIC_API_URL` y `CORS_ORIGINS` a `https://app.tudominio.com`.

## Comandos útiles

```bash
# Logs
docker compose -f docker/compose.prod.yml --env-file .env.production logs -f api

# Reiniciar API tras cambio de código (rebuild)
docker compose -f docker/compose.prod.yml --env-file .env.production up -d --build api web

# Parar todo
docker compose -f docker/compose.prod.yml --env-file .env.production down

# Backup Postgres
docker compose -f docker/compose.prod.yml --env-file .env.production \
  exec postgres pg_dump -U postgres neuroeye > backup.sql
```

## Desarrollo vs producción

| | Desarrollo | Producción Linux |
|--|------------|------------------|
| Compose | `backend/docker-compose.yml` | `docker/compose.prod.yml` |
| API Dockerfile | `backend/Dockerfile.dev` | `backend/Dockerfile` |
| Frontend | `pnpm dev` local | Build estático en `web` |
| Reload | Sí | No |
| Postgres expuesto | `:5432` | Red interna |

Ver también [backend/docs/docker.md](../backend/docs/docker.md) para desarrollo local.
