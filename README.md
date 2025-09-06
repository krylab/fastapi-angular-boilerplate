# REST Angular

A full-stack application with FastAPI backend and Angular frontend, featuring modern dependency management with `uv` and comprehensive infrastructure components.

## Installation

First, install `uv` if you haven't already:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

You can read more about uv here: https://docs.astral.sh/uv/

### Node.js Requirements

For the Angular frontend, you need Node.js version:

-   `^20.19.0` || `^22.12.0` || `^24.0.0` (for Angular 20+)

Download Node.js from: https://nodejs.org/

You can check your Node.js version with:

```bash
node --version
```

## Environment Setup

Before running the application, you need to set up the required services. You have two options:

### Option 1: Local Setup

Start the required services locally:

```bash
# Set environment variables
export DB_USER="rest_angular"
export DB_PASSWORD="rest_angular"
export DB_NAME="rest_angular"
export REDIS_HOST="localhost"
export KAFKA_BOOTSTRAP_SERVERS="localhost:9092"

# Start PostgreSQL
docker run --name postgres -d -p "5432:5432" \
  -e "POSTGRES_PASSWORD=${DB_PASSWORD}" \
  -e "POSTGRES_USER=${DB_USER}" \
  -e "POSTGRES_DB=${DB_NAME}" \
  postgres:17-alpine

# Start Redis
docker run --name redis -d -p "6379:6379" \
  -e "ALLOW_EMPTY_PASSWORD=yes" \
  redis:alpine

# Start Kafka
docker run -d \
  --name kafka \
  --hostname kafka \
  -p "9092:9092" \
  -p "9094:9094" \
  -e "KAFKA_NODE_ID=1" \
  -e "KAFKA_PROCESS_ROLES=broker,controller" \
  -e "KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093" \
  -e "KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER" \
  -e "KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094" \
  -e "KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092,EXTERNAL://localhost:9094" \
  -e "KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT" \
  -e "KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT" \
  -e "CLUSTER_ID=5L6g3nShT-eMCtK--X86sw" \
  -e "KAFKA_AUTO_CREATE_TOPICS_ENABLE=true" \
  -e "KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1" \
  -e "KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=1" \
  -e "KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1" \
  -e "KAFKA_LOG_DIRS=/var/lib/kafka/data" \
  -e "KAFKA_HEAP_OPTS=-Xmx512m -Xms512m" \
  confluentinc/cp-kafka:latest
```

### Option 2: Docker Setup

Use Docker Compose to start all services together. See the [Docker](#docker) section below for details.

## Configuration

This application can be configured with environment variables.

You can create `.env` file in the root directory and place all
environment variables here.

For example if you see in your `rest_angular/config.py` a variable named like
`random_parameter`, you should provide the "RANDOM_PARAMETER"
variable to configure the value.

An example of .env file:

```bash
RELOAD="True"
PORT="8000"
ENVIRONMENT="dev"
DB_HOST="localhost"
DB_USER="rest_angular"
DB_PASSWORD="rest_angular"
DB_NAME="rest_angular"
REDIS_HOST="localhost"
KAFKA_BOOTSTRAP_SERVERS="localhost:9092"
```

You can read more about BaseSettings class here: https://docs.pydantic.dev/latest/concepts/pydantic_settings/

## Running the Backend

To install dependencies and run the backend:

```bash
# Create virtual environment and install dependencies
uv sync

# Run the backend server
uv run -m rest_angular
```

This will start the FastAPI server on the configured host (default: http://localhost:8000).

Visit `http://localhost:8000/api/docs` for complete API documentation with interactive Swagger UI.

## Running the Angular Frontend

To set up and run the Angular frontend:

```bash
cd web-angular

# Install dependencies
npm install

# Start development server
npm start
```

The Angular frontend will be available at http://localhost:4200.

## API Generation

The Angular frontend includes an automated API client generation system that creates TypeScript interfaces and HTTP client methods from the backend's OpenAPI specification.

To regenerate the API client:

```bash
cd web-angular
npm run generate:api
```

This will update the files in `src/app/api-generated/` based on the current backend API.

## Database Migrations

If you want to migrate your database, you should run following commands:

```bash
# To run all migrations until the migration with revision_id.
uv run alembic upgrade "<revision_id>"

# To perform all pending migrations.
uv run alembic upgrade "head"
```

### Reverting migrations

If you want to revert migrations, you should run:

```bash
# revert all migrations up to: revision_id.
uv run alembic downgrade <revision_id>

# Revert everything.
uv run alembic downgrade base
```

### Migration generation

To generate migrations you should add import of a new models to the `rest_angular/db/models.py` file and run:

```bash
# For automatic change detection.
uv run alembic revision --autogenerate

# For empty file generation.
uv run alembic revision
```

## Pre-commit Hooks

Set up pre-commit hooks to ensure code quality before each commit after running `uv sync`:

```bash
# Install the git hook scripts
uv run pre-commit install
```

## Running Tests

### Backend Tests

If you want to run it in docker, simply run:

```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml run --build --rm api
```

For running tests on your local machine:

Make sure you have the required services running (see [Environment Setup](#environment-setup) section above), then run:

```bash
uv run pytest -vv .
```

### Frontend Tests

To run Angular tests:

```bash
cd web-angular
npm test
```

## Docker

You can start the entire stack with docker using this command:

```bash
docker compose up --build
```

If you want to develop in docker with autoreload and exposed ports add `-f deploy/docker compose.dev.yml` to your docker command:

```bash
docker compose -f docker compose.yml -f deploy/docker compose.dev.yml --project-directory . up --build
```

This command exposes the web application on port 8000, mounts current directory and enables autoreload.

But you have to rebuild image every time you modify `uv.lock` or `pyproject.toml` with this command:

```bash
docker compose build
```

If you want to start your project with OpenTelemetry collector
you can add `-f ./deploy/docker compose.otlp.yml` to your docker command:

```bash
docker compose -f docker compose.yml -f deploy/docker compose.otlp.yml --project-directory . up
```

This command will start OpenTelemetry collector and jaeger.
After sending requests you can see traces in jaeger's UI
at http://localhost:16686/.

This docker configuration is not supposed to be used in production.
It's only for demo purpose.

You can read more about OpenTelemetry here: https://opentelemetry.io/
