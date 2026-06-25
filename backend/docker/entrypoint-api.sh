#!/bin/sh
set -eu

# Optional: run once before workers (lifespan also runs when RUN_DB_STARTUP_IN_LIFESPAN=true).
if [ "${RUN_DB_STARTUP_BEFORE_UVICORN:-false}" = "true" ]; then
  echo "Running database startup (migrations + seeders)..."
  python -m app.db.startup
fi

WORKERS="${UVICORN_WORKERS:-2}"

echo "Starting API (workers=${WORKERS})..."
exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers "${WORKERS}" \
  --proxy-headers \
  --forwarded-allow-ips="*"
