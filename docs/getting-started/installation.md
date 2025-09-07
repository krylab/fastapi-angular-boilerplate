# Installation

This guide will help you set up the FastAPI Angular Boilerplate on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Python 3.12+**

    - Download from [python.org](https://www.python.org/downloads/)
    - Verify installation: `python --version`

2. **UV Package Manager**

    - Install with: `curl -LsSf https://astral.sh/uv/install.sh | sh`
    - Learn more: [UV Documentation](https://docs.astral.sh/uv/)

3. **Node.js**

    - Required versions: `^20.19.0` || `^22.12.0` || `^24.0.0`
    - Download from [nodejs.org](https://nodejs.org/)
    - Verify installation: `node --version`

4. **Docker & Docker Compose**
    - Download from [docker.com](https://www.docker.com/get-started)
    - Required for running databases and services

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd fastapi-angular-boilerplate
```

### 2. Backend Setup

```bash
# Install Python dependencies
uv sync

# Install documentation dependencies (optional)
uv sync --group docs
```

### 3. Frontend Setup

```bash
cd web-angular

# Install Node.js dependencies
npm install
```

### 4. Environment Configuration

Create a `.env` file in the project root:

```bash
# Development Configuration
RELOAD="True"
PORT="8000"
ENVIRONMENT="dev"

# Database Configuration
DB_HOST="localhost"
DB_USER="rest_angular"
DB_PASSWORD="rest_angular"
DB_NAME="rest_angular"

# Redis Configuration
REDIS_HOST="localhost"

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS="localhost:9092"
```

### 5. Start Required Services

Choose one of the following options:

=== "Docker Compose (Recommended)"

    ```bash
    # Start all services (now exposes port 8000 by default)
    docker compose up -d
    ```

    The application will be available at http://localhost:8000.

=== "Individual Docker Containers"

    ```bash
    # PostgreSQL
    docker run --name postgres -d -p "5432:5432" \
      -e "POSTGRES_PASSWORD=rest_angular" \
      -e "POSTGRES_USER=rest_angular" \
      -e "POSTGRES_DB=rest_angular" \
      postgres:17-alpine

    # Redis
    docker run --name redis -d -p "6379:6379" \
      -e "ALLOW_EMPTY_PASSWORD=yes" \
      redis:alpine

    # Kafka
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

### 6. Run Database Migrations

```bash
# Apply all pending migrations
uv run alembic upgrade head
```

### 7. Start the Applications

=== "Backend"

    ```bash
    # Start FastAPI development server
    uv run -m rest_angular
    ```

    The API will be available at:
    - **Application**: http://localhost:8000
    - **API Documentation**: http://localhost:8000/api/docs
    - **OpenAPI Schema**: http://localhost:8000/api/openapi.json

    **Note**: Docker Compose now exposes port 8000 by default, making the application directly accessible.

=== "Frontend"

    ```bash
    cd web-angular

    # Start Angular development server
    npm start
    ```

    The frontend will be available at:
    - **Application**: http://localhost:4200

## Verification

To verify your installation:

1. **Backend Health Check**

    ```bash
    curl http://localhost:8000/api/health
    ```

2. **Frontend Access**

    - Open http://localhost:4200 in your browser
    - You should see the Angular application

3. **API Documentation**
    - Visit http://localhost:8000/api/docs
    - Explore the interactive Swagger UI

## Next Steps

-   [Configuration Guide](configuration.md) - Learn about environment variables and settings
-   [Running the Application](running.md) - Detailed guide on running in different modes
-   [Development Workflow](../development/contributing.md) - Set up your development environment

## Troubleshooting

### Common Issues

1. **Port Already in Use**

    ```bash
    # Check what's using the port
    lsof -i :8000

    # Kill the process if needed
    kill -9 <PID>
    ```

2. **Database Connection Issues**

    ```bash
    # Check if PostgreSQL is running
    docker ps | grep postgres

    # View PostgreSQL logs
    docker logs postgres
    ```

3. **Node.js Version Issues**

    ```bash
    # Check Node.js version
    node --version

    # Use nvm to switch versions (if installed)
    nvm use 20
    ```

For more help, check our [GitHub Issues](https://github.com/your-username/fastapi-angular-boilerplate/issues) or create a new issue.
