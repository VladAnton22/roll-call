# syntax=docker/dockerfile:1

# ---- base: uv + dependency install, shared by dev and prod ----
FROM python:3.12-slim AS base
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PROJECT_ENVIRONMENT=/opt/venv
    
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
WORKDIR /code
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
ENV PATH="/opt/venv/bin:$PATH"

# ---- dev: used by Compose. Source is bind-mounted, not baked in ----
FROM base AS dev
ENV ENV=dev
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ---- prod: the Fargate deliverable. Source baked in, non-root, real workers ----
FROM base AS prod
ENV ENV=prod
COPY . .
RUN useradd --create-home --uid 1000 appuser && chown -R appuser /opt/venv
USER appuser
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]