# API Documentation

The FastAPI backend provides a comprehensive REST API with automatic OpenAPI documentation. This page covers the main API endpoints and their usage.

## Interactive Documentation

The API includes automatically generated interactive documentation:

-   **Swagger UI**: http://localhost:8000/api/docs
-   **ReDoc**: http://localhost:8000/api/redoc
-   **OpenAPI Schema**: http://localhost:8000/api/openapi.json

**Note**: When using Docker Compose, the API is now accessible on port 8000 by default.

## Authentication

Most API endpoints require authentication using JWT tokens.

### Login

```http
POST /api/auth/jwt/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=yourpassword
```

**Response:**

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer"
}
```

### Using the Token

Include the token in the Authorization header:

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## Core Endpoints

### Health Check

```http
GET /api/health
```

**Response:**

```json
{
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "0.1.0",
    "environment": "dev"
}
```

### User Management

#### Get Current User

```http
GET /api/users/me
Authorization: Bearer <token>
```

**Response:**

```json
{
    "id": 1,
    "email": "user@example.com",
    "is_active": true,
    "is_superuser": false,
    "is_verified": true,
    "created_at": "2024-01-01T00:00:00Z"
}
```

#### Update User Profile

```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

#### Register New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword"
}
```

## Error Responses

The API uses standard HTTP status codes and returns errors in a consistent format:

```json
{
    "error": "Error description",
    "status_code": 400,
    "path": "/api/endpoint",
    "timestamp": "2024-01-01T00:00:00Z"
}
```

### Common Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 422  | Validation Error      |
| 500  | Internal Server Error |

## Request/Response Examples

### Creating a Resource

```bash
curl -X POST "http://localhost:8000/api/items" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example Item",
    "description": "This is an example item",
    "price": 29.99
  }'
```

### Filtering and Pagination

```bash
# Get items with pagination
curl "http://localhost:8000/api/items?page=1&size=10" \
  -H "Authorization: Bearer <token>"

# Filter items
curl "http://localhost:8000/api/items?name=example&min_price=10" \
  -H "Authorization: Bearer <token>"
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

-   **Anonymous requests**: 100 requests per hour
-   **Authenticated requests**: 1000 requests per hour

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

The API supports webhooks for real-time notifications:

### Registering a Webhook

```http
POST /api/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["user.created", "user.updated"],
  "secret": "your-webhook-secret"
}
```

### Webhook Payload

```json
{
    "event": "user.created",
    "data": {
        "id": 123,
        "email": "user@example.com"
    },
    "timestamp": "2024-01-01T00:00:00Z"
}
```

## WebSocket Support

Real-time features are available through WebSocket connections:

```javascript
const ws = new WebSocket("ws://localhost:8000/ws");

ws.onopen = function (event) {
    console.log("Connected to WebSocket");

    // Send authentication
    ws.send(
        JSON.stringify({
            type: "auth",
            token: "your-jwt-token",
        })
    );
};

ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Received:", data);
};
```

## API Versioning

The API supports versioning through URL path:

```http
# Version 1 (current)
GET /api/v1/users

# Version 2 (future)
GET /api/v2/users
```

Version headers are also supported:

```http
GET /api/users
Accept: application/vnd.api+json;version=1
```

## Client SDKs

### Python SDK

```python
from rest_angular_client import Client

client = Client(base_url="http://localhost:8000")

# Authenticate
token = client.auth.login("user@example.com", "password")
client.set_token(token)

# Use API
users = client.users.list()
user = client.users.get(user_id=1)
```

### JavaScript SDK

```javascript
import { RestAngularClient } from "rest-angular-client";

const client = new RestAngularClient("http://localhost:8000");

// Authenticate
const token = await client.auth.login("user@example.com", "password");
client.setToken(token);

// Use API
const users = await client.users.list();
const user = await client.users.get(1);
```

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:8000/api/health

# Login
curl -X POST "http://localhost:8000/api/auth/jwt/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password"

# Use authenticated endpoint
curl "http://localhost:8000/api/users/me" \
  -H "Authorization: Bearer <token>"
```

### Using HTTPie

```bash
# Health check
http GET localhost:8000/api/health

# Login
http --form POST localhost:8000/api/auth/jwt/login \
  username=user@example.com password=password

# Use authenticated endpoint
http GET localhost:8000/api/users/me \
  Authorization:"Bearer <token>"
```

### Using Postman

1. Import the OpenAPI schema from http://localhost:8000/api/openapi.json
2. Set up authentication with JWT Bearer token
3. Use the generated collection to test endpoints

## Performance Tips

1. **Use pagination** for large datasets
2. **Cache responses** when appropriate
3. **Use compression** with `Accept-Encoding: gzip`
4. **Batch requests** when possible
5. **Use field selection** to limit response size

## Next Steps

-   [Database Guide](database.md) - Learn about data models
-   [Authentication](auth.md) - Understand security features
-   [Frontend Integration](../frontend/api-integration.md) - Connect with Angular
