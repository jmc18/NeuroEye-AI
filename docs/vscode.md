# VS Code — NeuroEyeAI

Abre la **carpeta raíz** `NeuroEyeAI/` en VS Code.

Extensiones: **Python**, **debugpy**, **Docker**, ESLint, Prettier.

## Debug backend (F5) — paso a paso

1. **`Ctrl+Shift+P`** → **Python: Select Interpreter** → `backend\.venv`
2. Si no existe el venv:
   ```bash
   cd backend
   uv sync
   ```
3. Copia `backend/.env.example` → `backend/.env`
4. Panel **Run and Debug** → elige **`Debug Backend (FastAPI)`**
5. Pon un breakpoint (ej. `backend/app/services/auth_service.py`)
6. **F5**

Al pulsar F5, VS Code **automáticamente**:
- Para el contenedor `api` (libera puerto 8000)
- Levanta **Postgres + Redis** en Docker
- Espera a que estén healthy
- Arranca la API en **modo debug** (local, no en contenedor)

> Los breakpoints de Python **no funcionan** si la API corre dentro del contenedor Docker. Para debug backend usa siempre **Debug Backend (FastAPI)**.

## Configuraciones de debug

| Config | Backend breakpoints | Frontend | Docker |
|--------|--------------------|----------|--------|
| **Debug Backend (FastAPI)** | Sí | No | Solo DB/Redis |
| **Debug Full Stack** | Sí | Sí | Solo DB/Redis |
| **Docker: API + Frontend** | No | Sí | Todo en Docker |

## Problemas frecuentes

**Puerto 8000 ocupado**
```bash
docker compose stop api
```

**Docker no arranca**
- Abre Docker Desktop
- `docker compose ps` en la raíz del repo

**Breakpoint no para**
- Usa **Debug Backend (FastAPI)** (sin reload primero)
- Verifica intérprete `backend/.venv`
- El breakpoint debe estar en código que se ejecute (ej. login)

**Error psycopg / asyncio (Windows)**
- El `preLaunchTask` ya levanta DB en Docker
- La API debuguea en local con `PYTHONSTARTUP` configurado

## Tareas útiles

| Tarea | Uso |
|-------|-----|
| `dev:infra:wait` | Solo levantar DB (mismo que F5 backend) |
| `dev:docker` | Todo en Docker (sin debug Python) |
| `dev:all:docker` | Docker + Vite |

## URLs

- API debug local: http://localhost:8000
- Scalar: http://localhost:8000/scalar
- Frontend: http://localhost:5173
