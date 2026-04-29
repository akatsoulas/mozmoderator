FROM python:3.14 AS base

ENV POETRY_VERSION=2.0.1 \
  POETRY_VIRTUALENVS_IN_PROJECT=true \
  POETRY_HOME=/opt/poetry \
  PYSETUP_PATH=/opt/pysetup

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
  && rm -rf /var/lib/apt/lists/*

RUN python -m venv $POETRY_HOME; \
  $POETRY_HOME/bin/pip install poetry==$POETRY_VERSION

WORKDIR $PYSETUP_PATH

COPY pyproject.toml poetry.lock ./

RUN $POETRY_HOME/bin/poetry install --no-root

FROM base AS dev

WORKDIR /app

ARG UID=10001
ARG GID=10001


RUN apt-get update; \
  apt-get install -y \
  curl \
  default-mysql-client \
  zip \
  zsh; \
  rm -rf /var/lib/apt/lists/*

ENV PORT=8000 \
  PATH=/opt/pysetup/.venv/bin:$PATH \
  VENV_PATH=/opt/pysetup/.venv

RUN groupadd -g $GID app; \
  useradd -d /app -g $GID -u $UID -M -s /usr/bin/zsh app; \
  chown -R app:app /app
USER app

COPY --chown=app:app . .

EXPOSE $PORT

CMD ["./bin/run-dev.sh"]

# Frontend build stage — produces moderator/moderate/static/dist/
FROM node:22-bookworm-slim AS frontend
WORKDIR /frontend
COPY package.json package-lock.json* ./
RUN npm ci
COPY frontend ./frontend
COPY vite.config.js ./
RUN npm run build

# Production image
FROM python:3.14-slim AS prod

ARG UID=10001
ARG GID=10001

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    default-mysql-client \
    pkg-config \
  && rm -rf /var/lib/apt/lists/*

ENV PORT=8000 \
  PATH=/opt/pysetup/.venv/bin:$PATH \
  POETRY_HOME=/opt/poetry \
  VENV_PATH=/opt/pysetup/.venv

COPY --from=base $POETRY_HOME $POETRY_HOME
COPY --from=base $VENV_PATH $VENV_PATH
COPY pyproject.toml poetry.lock ./

RUN $POETRY_HOME/bin/poetry install --without dev --no-root

RUN groupadd -g $GID app; \
  useradd -g $GID -u $UID -M -s /bin/bash app; \
  mkdir -p /app; \
  chown -R app:app /app

USER app
WORKDIR /app

COPY --chown=app:app . .
COPY --from=frontend --chown=app:app /frontend/dist /app/dist

EXPOSE $PORT

CMD ["./bin/run-prod.sh"]
