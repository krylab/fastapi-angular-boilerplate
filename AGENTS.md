# AGENTS.md

REST Angular is a full-stack app: a FastAPI backend (Python 3.12, managed by `uv`) in `rest_angular/`, and an Angular 21 SPA in `web-angular/`. It uses PostgreSQL (required), plus Redis and Kafka (used by the test suite and optional infra helpers). See `README.md` for the authoritative setup/run/test commands.

## Cursor Cloud specific instructions

The startup update script already runs `uv sync` and installs the Angular deps (`web-angular/npm install`). `uv`, Node, and Docker are preinstalled in the environment snapshot. What's left is to start the backing services and the dev servers.

### Backing services (Postgres required; Redis + Kafka needed for the full test suite)

The Docker daemon is available but is NOT auto-started. Start it first, then the services:

```bash
sudo dockerd    # run in a background terminal (e.g. tmux); leave it running
```

Important: `docker-compose.yml` does NOT publish the db/redis/kafka ports to the host (only the `api` container's 8000). When running the backend/tests on the host (the normal dev flow), start the services with published ports instead, exactly as in `README.md` "Option 1: Local Setup" (`docker run ... -p 5432:5432` for Postgres, `-p 6379:6379` for Redis, and the Kafka `docker run` block — use `localhost` in Kafka's advertised listeners, not `rest_angular-kafka`). All `docker` commands need `sudo`.

Copy env defaults once: `cp .env.example .env` (points the app at `localhost` for db/redis/kafka).

### Run / migrate / test / build

- Migrate DB: `uv run alembic upgrade head` (also auto-run by the pytest session fixture against `rest_angular_test`).
- Backend dev server: `uv run -m rest_angular` → http://localhost:8000 (Swagger at `/api/docs`, health at `/api/health`). `.env` sets `RELOAD=True` for hot reload.
- Frontend dev server: `cd web-angular && npm start` → http://localhost:4200 (proxies API calls to the backend on 8000).
- Tests: `uv run pytest -vv .` — requires Postgres, Redis, AND Kafka all reachable on localhost (the Redis/Kafka tests hit real brokers; there is no fakeredis override wired into the app fixtures).
- Lint: `uv run ruff check rest_angular tests` and `uv run pyright` (both are the pre-commit hooks).
- Angular build: `cd web-angular && npm run build` (prod: `npm run build:prod`).

### Notes / gotchas

- The Angular frontend is on Angular 22, which requires Node.js >= 24.15 (or >= 22.22.3); the environment ships Node 24 on `PATH` (`/usr/local/bin/node`). Older Node makes `ng`/`@angular/cli` refuse to run. The auth forms use stable Signal Forms (`@angular/forms/signals`, `form()` + `[formField]`), not `ReactiveFormsModule`.

- The Angular UI is based on the Notus template. Registration through the UI works and persists a real user in the backend, but the login form's submit button is not wired up and a transient `NG0100` (ExpressionChangedAfterItHasBeenChecked) dev-mode toast can appear on the login page. These are pre-existing template quirks, not environment problems. Exercise auth end-to-end via the API (`POST /api/auth/register`, `POST /api/auth/jwt/login`) when you need a token.
- Redis and Kafka are not currently wired into any production route, so the backend and Angular UI run fine without them; they are only required to run the full `pytest` suite.
