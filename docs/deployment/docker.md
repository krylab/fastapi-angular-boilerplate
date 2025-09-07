# Docker Deployment

This guide covers deploying the FastAPI Angular Boilerplate using Docker and Docker Compose for both development and production environments.

## Overview

The application provides multiple Docker configurations:

-   **Development**: Hot-reload, debugging, volume mounts
-   **Production**: Optimized builds, health checks, security
-   **Testing**: Isolated test environment
-   **Observability**: With OpenTelemetry and Jaeger

## Quick Start

### Development Environment

```bash
# Start all services with hot-reload
docker compose -f docker-compose.yml -f deploy/docker-compose.dev.yml up --build

# Services will be available at:
# - Frontend: http://localhost:4200
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/api/docs
```

### Production Environment

```bash
# Build and start production containers
docker compose up --build -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

## Docker Compose Configurations

### Base Configuration (`docker-compose.yml`)

```yaml
version: "3.8"

services:
    postgres:
        image: postgres:17-alpine
        environment:
            POSTGRES_DB: ${DB_NAME:-rest_angular}
            POSTGRES_USER: ${DB_USER:-rest_angular}
            POSTGRES_PASSWORD: ${DB_PASSWORD:-rest_angular}
        volumes:
            - postgres_data:/var/lib/postgresql/data
        ports:
            - "5432:5432"
        healthcheck:
            test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-rest_angular}"]
            interval: 10s
            timeout: 5s
            retries: 5

    redis:
        image: redis:alpine
        ports:
            - "6379:6379"
        volumes:
            - redis_data:/data
        healthcheck:
            test: ["CMD", "redis-cli", "ping"]
            interval: 10s
            timeout: 5s
            retries: 5

    kafka:
        image: confluentinc/cp-kafka:latest
        environment:
            KAFKA_NODE_ID: 1
            KAFKA_PROCESS_ROLES: broker,controller
            KAFKA_CONTROLLER_QUORUM_VOTERS: 1@localhost:9093
            KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
            KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094
            KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,EXTERNAL://localhost:9094
            KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT
            KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
            CLUSTER_ID: 5L6g3nShT-eMCtK--X86sw
            KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
            KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
            KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
            KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
            KAFKA_LOG_DIRS: /var/lib/kafka/data
            KAFKA_HEAP_OPTS: -Xmx512m -Xms512m
        ports:
            - "9092:9092"
            - "9094:9094"
        volumes:
            - kafka_data:/var/lib/kafka/data

    api:
        build: .
        environment:
            - DB_HOST=postgres
            - REDIS_HOST=redis
            - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
        depends_on:
            postgres:
                condition: service_healthy
            redis:
                condition: service_healthy
        ports:
            - "8000:8000"
        healthcheck:
            test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
            interval: 30s
            timeout: 10s
            retries: 3

volumes:
    postgres_data:
    redis_data:
    kafka_data:
```

### Development Override (`deploy/docker-compose.dev.yml`)

```yaml
version: "3.8"

services:
    api:
        environment:
            - RELOAD=True
            - ENVIRONMENT=dev
            - LOG_LEVEL=DEBUG
        volumes:
            - .:/app
            - /app/.venv # Exclude virtual environment
        ports:
            - "5678:5678" # Debug port

    frontend:
        build:
            context: ./web-angular
            dockerfile: Dockerfile.dev
        volumes:
            - ./web-angular:/app
            - /app/node_modules
        ports:
            - "4200:4200"
        environment:
            - NODE_ENV=development
        command: npm start
```

### Production Override (`deploy/docker-compose.prod.yml`)

```yaml
version: "3.8"

services:
    api:
        environment:
            - ENVIRONMENT=prod
            - RELOAD=False
            - LOG_LEVEL=INFO
        restart: unless-stopped
        deploy:
            resources:
                limits:
                    memory: 512M
                    cpus: "0.5"
                reservations:
                    memory: 256M
                    cpus: "0.25"

    frontend:
        build:
            context: ./web-angular
            dockerfile: Dockerfile.prod
        ports:
            - "80:80"
            - "443:443"
        restart: unless-stopped
        volumes:
            - ./nginx/nginx.conf:/etc/nginx/nginx.conf
            - ./nginx/ssl:/etc/nginx/ssl
```

## Dockerfiles

### Backend Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install UV
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./
COPY lelab-common ./lelab-common/

# Install dependencies
RUN uv sync --frozen

# Copy application code
COPY rest_angular ./rest_angular/
COPY alembic.ini ./

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Run the application
CMD ["uv", "run", "-m", "rest_angular"]
```

### Frontend Dockerfile (Development)

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 4200

# Start development server
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
```

### Frontend Dockerfile (Production)

```dockerfile
# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist/web-angular /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

## Environment Variables

### Development Environment

```bash
# .env.dev
ENVIRONMENT=dev
RELOAD=True
DB_HOST=postgres
DB_USER=rest_angular
DB_PASSWORD=rest_angular
DB_NAME=rest_angular
REDIS_HOST=redis
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
LOG_LEVEL=DEBUG
```

### Production Environment

```bash
# .env.prod
ENVIRONMENT=prod
RELOAD=False
DB_HOST=postgres
DB_USER=rest_angular
DB_PASSWORD=your_secure_password
DB_NAME=rest_angular
REDIS_HOST=redis
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
LOG_LEVEL=INFO
JWT_SECRET=your_super_secret_key
```

## Nginx Configuration

### Production Nginx Config

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Upstream backend
    upstream backend {
        server api:8000;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
        }

        # API proxy
        location /api/ {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Timeouts
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## SSL/HTTPS Configuration

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx HTTPS Config

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Your application configuration...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring and Observability

### With OpenTelemetry and Jaeger

```bash
# Start with observability stack
docker compose -f docker-compose.yml -f deploy/docker-compose.otlp.yml up

# Access Jaeger UI
open http://localhost:16686
```

### Docker Compose OTLP Override

```yaml
version: "3.8"

services:
    jaeger:
        image: jaegertracing/all-in-one:latest
        ports:
            - "16686:16686"
            - "14268:14268"
        environment:
            - COLLECTOR_OTLP_ENABLED=true

    otel-collector:
        image: otel/opentelemetry-collector:latest
        command: ["--config=/etc/otel-collector-config.yaml"]
        volumes:
            - ./deploy/otel-collector-config.yaml:/etc/otel-collector-config.yaml
        ports:
            - "4317:4317"
            - "4318:4318"
        depends_on:
            - jaeger

    api:
        environment:
            - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
            - OTEL_SERVICE_NAME=rest_angular
        depends_on:
            - otel-collector
```

## Deployment Commands

### Development

```bash
# Start development environment
make dev-up

# Or manually
docker compose -f docker-compose.yml -f deploy/docker-compose.dev.yml up --build

# Run database migrations
docker compose exec api uv run alembic upgrade head

# View logs
docker compose logs -f api
```

### Production

```bash
# Deploy to production
make prod-deploy

# Or manually
docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml up -d --build

# Check health
curl http://localhost/health
curl http://localhost:8000/api/health
```

### Maintenance

```bash
# Update containers
docker compose pull
docker compose up -d

# Backup database
docker compose exec postgres pg_dump -U rest_angular rest_angular > backup.sql

# Restore database
cat backup.sql | docker compose exec -T postgres psql -U rest_angular rest_angular

# Clean up
docker system prune -a
docker volume prune
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Deploy

on:
    push:
        branches: [main]

jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3

            - name: Deploy to production
              run: |
                  docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml pull
                  docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml up -d

            - name: Run health check
              run: |
                  sleep 30
                  curl -f http://localhost/health
```

## Troubleshooting

### Common Issues

1. **Port conflicts**

    ```bash
    # Check what's using the port
    lsof -i :8000

    # Stop conflicting services
    docker compose down
    ```

2. **Database connection issues**

    ```bash
    # Check database logs
    docker compose logs postgres

    # Connect to database
    docker compose exec postgres psql -U rest_angular
    ```

3. **Memory issues**

    ```bash
    # Check container resource usage
    docker stats

    # Adjust memory limits in compose file
    deploy:
      resources:
        limits:
          memory: 1G
    ```

### Debug Mode

```bash
# Enable debug logging
COMPOSE_LOG_LEVEL=DEBUG docker compose up

# Access container shell
docker compose exec api bash

# View container logs
docker compose logs -f --tail=100 api
```

## Next Steps

-   [Production Deployment](production.md) - Deploy to cloud providers
-   [Monitoring Guide](../development/monitoring.md) - Set up monitoring and alerting
-   [Backup Strategy](../development/backup.md) - Implement backup procedures
