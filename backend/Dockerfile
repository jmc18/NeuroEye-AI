# Production API — multi-stage, slim, non-root
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS builder

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY app ./app
COPY alembic ./alembic
COPY alembic.ini ./

# ---------------------------------------------------------------------------
FROM python:3.13-slim-bookworm AS runtime

RUN groupadd --system neuro && useradd --system --gid neuro --home /app neuro

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH"

COPY --from=builder --chown=neuro:neuro /app/.venv /app/.venv
COPY --from=builder --chown=neuro:neuro /app/app /app/app
COPY --from=builder --chown=neuro:neuro /app/alembic /app/alembic
COPY --from=builder --chown=neuro:neuro /app/alembic.ini /app/alembic.ini
COPY --chown=neuro:neuro docker/entrypoint-api.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

USER neuro

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/v1/health')"

ENTRYPOINT ["/entrypoint.sh"]
