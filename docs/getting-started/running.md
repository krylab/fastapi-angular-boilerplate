# Running the Application

This guide covers different ways to run the FastAPI Angular Boilerplate application, from development to production environments.

## Development Mode

### Backend Development

Start the FastAPI backend with hot-reload enabled:

```bash
# Using UV (recommended)
uv run -m rest_angular

# Or with environment variables
RELOAD=True PORT=8000 uv run -m rest_angular

# Or using uvicorn directly
uv run uvicorn rest_angular.app:app --reload --port 8000
```

The backend will be available at:

-   **API**: http://localhost:8000
-   **Interactive Docs**: http://localhost:8000/api/docs
-   **ReDoc**: http://localhost:8000/api/redoc
-   **OpenAPI Schema**: http://localhost:8000/api/openapi.json

### Frontend Development

Start the Angular development server:

```bash
cd web-angular

# Start with hot-reload
npm start

# Or with custom configuration
npm run start -- --port 4200 --host 0.0.0.0
```

The frontend will be available at:

-   **Application**: http://localhost:4200

### Full Stack Development

Run both backend and frontend simultaneously:

=== "Terminal 1 (Backend)"

    ```bash
    uv run -m rest_angular
    ```

=== "Terminal 2 (Frontend)"

    ```bash
    cd web-angular
    npm start
    ```

=== "Using Docker Compose"

    ```bash
    # Start with port 8000 exposed (default behavior)
    docker compose up --build
    ```

    The application will be available at http://localhost:8000.

    For development with additional features (hot-reload, volume mounts):

    ```bash
    docker compose -f docker-compose.yml -f deploy/docker-compose.dev.yml up --build
    ```

## Production Mode

### Backend Production

```bash
# Set production environment
export ENVIRONMENT=prod
export RELOAD=False

# Run with production settings
uv run -m rest_angular

# Or with specific worker configuration
uv run uvicorn rest_angular.app:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Production

For production, Angular is built and served by the FastAPI backend:

```bash
cd web-angular

# Build for production (outputs to ../publish/browser/)
npm run build:prod

# The built files will be served by FastAPI at runtime
# No separate web server needed
```

### Docker Production

For production deployment with integrated Angular frontend:

**Option 1: Using the build script (recommended)**

```bash
# Build Angular and Docker image
./scripts/build-production.sh

# Start production containers
docker compose up -d
```

**Option 2: Manual build**

```bash
# Step 1: Build Angular for production
cd web-angular
npm install
npm run build:prod
cd ..

# Step 2: Build and start Docker containers
docker compose up --build -d
```

The production setup serves both the Angular frontend and FastAPI backend from a single container at http://localhost:8000.

**Note**: Docker Compose now exposes port 8000 by default, making the application directly accessible without additional configuration.

## Testing Mode

### Backend Testing

```bash
# Run tests with pytest
uv run pytest

# Run with coverage
uv run pytest --cov=rest_angular

# Run specific test files
uv run pytest tests/test_api.py

# Run with verbose output
uv run pytest -vv
```

### Frontend Testing

```bash
cd web-angular

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run e2e
```

### Integration Testing

```bash
# Run full test suite with Docker
docker compose -f docker-compose.yml -f docker-compose.test.yml run --build --rm api
```

## Docker Configurations

### Development with Docker

```bash
# Start development environment (port 8000 exposed by default)
docker compose up --build

# For enhanced development features:
docker compose -f docker-compose.yml -f deploy/docker-compose.dev.yml up --build

# Enhanced development configuration includes:
# - Hot-reload for backend
# - Volume mounts for source code
# - Debug ports exposed
# - Development databases
```

### Production with Docker

```bash
# Start production environment
docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml up -d

# This configuration includes:
# - Optimized builds
# - Health checks
# - Resource limits
# - Production databases
```

### With Observability

```bash
# Start with OpenTelemetry and Jaeger
docker compose -f docker-compose.yml -f deploy/docker-compose.otlp.yml up

# Access Jaeger UI at: http://localhost:16686
```

## Environment-Specific Configurations

### Development Environment

```bash
# .env.dev
ENVIRONMENT=dev
RELOAD=True
DB_ECHO=True
LOG_LEVEL=DEBUG
CORS_ORIGINS=["http://localhost:4200"]
```

### Staging Environment

```bash
# .env.staging
ENVIRONMENT=staging
RELOAD=False
DB_ECHO=False
LOG_LEVEL=INFO
CORS_ORIGINS=["https://staging.yourdomain.com"]
```

### Production Environment

```bash
# .env.prod
ENVIRONMENT=prod
RELOAD=False
DB_ECHO=False
LOG_LEVEL=WARNING
CORS_ORIGINS=["https://yourdomain.com"]
```

## Service Management

### Using systemd (Linux)

Create a systemd service file:

```ini
# /etc/systemd/system/rest-angular.service
[Unit]
Description=REST Angular API
After=network.target

[Service]
Type=exec
User=www-data
WorkingDirectory=/opt/rest-angular
Environment=PATH=/opt/rest-angular/.venv/bin
ExecStart=/opt/rest-angular/.venv/bin/uvicorn rest_angular.app:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start the service
sudo systemctl enable rest-angular
sudo systemctl start rest-angular

# Check status
sudo systemctl status rest-angular
```

### Using PM2 (Node.js Process Manager)

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'rest-angular-api',
    script: 'uv',
    args: 'run -m rest_angular',
    cwd: '/path/to/your/app',
    env: {
      ENVIRONMENT: 'prod'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Health Checks

### Backend Health Check

```bash
# Check API health
curl http://localhost:8000/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "0.1.0",
  "environment": "dev"
}
```

### Database Health Check

```bash
# Check database connectivity
curl http://localhost:8000/api/health/db

# Expected response
{
  "database": "connected",
  "migrations": "up-to-date"
}
```

### Full System Health Check

```bash
# Check all services
curl http://localhost:8000/api/health/full

# Expected response
{
  "api": "healthy",
  "database": "connected",
  "redis": "connected",
  "kafka": "connected"
}
```

## Monitoring and Logs

### Application Logs

```bash
# View backend logs
uv run python -c "
import logging
logging.basicConfig(level=logging.INFO)
# Your app logs will appear here
"

# With Docker
docker compose logs -f api

# With systemd
journalctl -u rest-angular -f
```

### Performance Monitoring

```bash
# Enable OpenTelemetry tracing
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
export OTEL_SERVICE_NAME=rest_angular

# Start with tracing
uv run -m rest_angular
```

### Resource Monitoring

```bash
# Monitor Docker containers
docker stats

# Monitor system resources
htop

# Monitor specific processes
ps aux | grep rest_angular
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**

    ```bash
    # Find process using port
    lsof -i :8000

    # Kill process
    kill -9 <PID>
    ```

2. **Database Connection Issues**

    ```bash
    # Check database status
    docker compose ps postgres

    # View database logs
    docker compose logs postgres
    ```

3. **Memory Issues**

    ```bash
    # Check memory usage
    free -h

    # Adjust worker count
    uv run uvicorn rest_angular.app:app --workers 2
    ```

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=DEBUG

# Run with debugger
uv run python -m debugpy --listen 5678 --wait-for-client -m rest_angular
```

## Next Steps

-   [Backend Architecture](../backend/architecture.md) - Understand the backend structure
-   [Frontend Overview](../frontend/overview.md) - Learn about the Angular frontend
-   [Deployment Guide](../deployment/docker.md) - Deploy to production
-   [Testing Guide](../development/testing.md) - Learn about testing strategies
