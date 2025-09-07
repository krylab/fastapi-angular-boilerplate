# Configuration

This application uses environment variables for configuration, following the [12-factor app methodology](https://12factor.net/config). All configuration is managed through Pydantic Settings for type safety and validation.

## Environment Variables

### Core Application Settings

| Variable      | Default   | Description                                                        |
| ------------- | --------- | ------------------------------------------------------------------ |
| `ENVIRONMENT` | `dev`     | Application environment (`dev`, `prod`, `test`)                    |
| `RELOAD`      | `False`   | Enable auto-reload in development                                  |
| `PORT`        | `8000`    | Port for the FastAPI server (exposed by default in Docker Compose) |
| `HOST`        | `0.0.0.0` | Host address to bind the server                                    |

### Database Configuration

| Variable      | Default        | Description                     |
| ------------- | -------------- | ------------------------------- |
| `DB_HOST`     | `localhost`    | PostgreSQL host                 |
| `DB_PORT`     | `5432`         | PostgreSQL port                 |
| `DB_USER`     | `rest_angular` | Database username               |
| `DB_PASSWORD` | `rest_angular` | Database password               |
| `DB_NAME`     | `rest_angular` | Database name                   |
| `DB_ECHO`     | `False`        | Enable SQLAlchemy query logging |

### Redis Configuration

| Variable         | Default     | Description               |
| ---------------- | ----------- | ------------------------- |
| `REDIS_HOST`     | `localhost` | Redis host                |
| `REDIS_PORT`     | `6379`      | Redis port                |
| `REDIS_PASSWORD` | `None`      | Redis password (optional) |
| `REDIS_DB`       | `0`         | Redis database number     |

### Kafka Configuration

| Variable                  | Default          | Description             |
| ------------------------- | ---------------- | ----------------------- |
| `KAFKA_BOOTSTRAP_SERVERS` | `localhost:9092` | Kafka bootstrap servers |
| `KAFKA_GROUP_ID`          | `rest_angular`   | Consumer group ID       |

### Authentication Settings

| Variable         | Default           | Description                    |
| ---------------- | ----------------- | ------------------------------ |
| `JWT_SECRET`     | `your-secret-key` | JWT signing secret             |
| `JWT_ALGORITHM`  | `HS256`           | JWT signing algorithm          |
| `JWT_EXPIRATION` | `3600`            | JWT expiration time in seconds |

### OpenTelemetry Configuration

| Variable                      | Default                     | Description              |
| ----------------------------- | --------------------------- | ------------------------ |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `http://localhost:4317`     | OTLP exporter endpoint   |
| `OTEL_SERVICE_NAME`           | `rest_angular`              | Service name for tracing |
| `OTEL_RESOURCE_ATTRIBUTES`    | `service.name=rest_angular` | Resource attributes      |

## Configuration Files

### .env File

Create a `.env` file in the project root for local development:

```bash
# .env
ENVIRONMENT=dev
RELOAD=True
PORT=8000

# Database
DB_HOST=localhost
DB_USER=rest_angular
DB_PASSWORD=rest_angular
DB_NAME=rest_angular

# Redis
REDIS_HOST=localhost

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production
```

### Environment-Specific Configuration

=== "Development (.env.dev)"

    ```bash
    ENVIRONMENT=dev
    RELOAD=True
    DB_ECHO=True

    # Development-specific settings
    CORS_ORIGINS=["http://localhost:4200", "http://localhost:3000"]
    LOG_LEVEL=DEBUG
    ```

=== "Production (.env.prod)"

    ```bash
    ENVIRONMENT=prod
    RELOAD=False
    DB_ECHO=False

    # Production settings
    DB_HOST=your-production-db-host
    DB_PASSWORD=your-secure-password
    JWT_SECRET=your-production-secret

    # Security settings
    CORS_ORIGINS=["https://yourdomain.com"]
    LOG_LEVEL=INFO
    ```

=== "Testing (.env.test)"

    ```bash
    ENVIRONMENT=test
    DB_NAME=rest_angular_test

    # Test-specific settings
    JWT_SECRET=test-secret
    REDIS_DB=1
    ```

## Configuration Loading

The application loads configuration in the following order (later sources override earlier ones):

1. Default values in `rest_angular/config.py`
2. Environment variables
3. `.env` file (if present)
4. Environment-specific `.env.{environment}` file

## Validation

All configuration is validated using Pydantic models. Invalid configuration will cause the application to fail at startup with descriptive error messages.

### Example Configuration Class

```python
from pydantic import BaseSettings, validator
from typing import List, Optional

class Settings(BaseSettings):
    environment: str = "dev"
    port: int = 8000
    db_host: str = "localhost"
    db_port: int = 5432
    cors_origins: List[str] = ["http://localhost:4200"]

    @validator("port")
    def validate_port(cls, v):
        if not 1 <= v <= 65535:
            raise ValueError("Port must be between 1 and 65535")
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
```

## Docker Configuration

When running with Docker, you can:

### 1. Use Environment Variables

```bash
docker run -e DB_HOST=postgres -e REDIS_HOST=redis your-app
```

### 2. Use an Environment File

```bash
docker run --env-file .env.prod your-app
```

### 3. Docker Compose

```yaml
# docker-compose.yml
services:
    api:
        build: .
        environment:
            - DB_HOST=postgres
            - REDIS_HOST=redis
        # Or use env_file
        env_file:
            - .env.prod
```

## Security Considerations

!!! warning "Security Best Practices" - Never commit `.env` files with sensitive data to version control - Use strong, unique secrets in production - Rotate JWT secrets regularly - Use encrypted connections in production - Limit CORS origins to your actual domains

### Secrets Management

For production deployments, consider using:

-   **Docker Secrets**
-   **Kubernetes Secrets**
-   **HashiCorp Vault**
-   **AWS Secrets Manager**
-   **Azure Key Vault**

## Monitoring Configuration

### Health Checks

The application provides health check endpoints that can be configured:

```bash
# Health check configuration
HEALTH_CHECK_TIMEOUT=30
HEALTH_CHECK_INTERVAL=10
```

### Logging

Configure logging levels and formats:

```bash
LOG_LEVEL=INFO
LOG_FORMAT=json
LOG_FILE=/var/log/app.log
```

## Advanced Configuration

### Custom Configuration Providers

You can extend the configuration system to load from additional sources:

```python
from rest_angular.config import Settings

class CustomSettings(Settings):
    @classmethod
    def from_consul(cls, consul_url: str):
        # Load configuration from Consul
        pass

    @classmethod
    def from_vault(cls, vault_url: str):
        # Load secrets from Vault
        pass
```

### Runtime Configuration Updates

Some settings can be updated at runtime through the admin API:

```bash
# Update log level
curl -X POST http://localhost:8000/admin/config \
  -H "Content-Type: application/json" \
  -d '{"log_level": "DEBUG"}'
```

## Next Steps

-   [Running the Application](running.md) - Learn how to start the application
-   [Backend Architecture](../backend/architecture.md) - Understand the backend structure
-   [Deployment Guide](../deployment/docker.md) - Deploy to production
