#!/bin/sh
set -eu

if [ "${RUN_MIGRATIONS_ON_STARTUP:-true}" = "true" ]; then
  echo "Running Alembic migrations..."
  alembic upgrade head
fi

WORKERS="${UVICORN_WORKERS:-2}"

echo "Starting API (workers=${WORKERS})..."
exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers "${WORKERS}" \
  --proxy-headers \
  --forwarded-allow-ips="*"
