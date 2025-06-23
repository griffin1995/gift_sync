# GiftSync API Documentation

## Overview

The GiftSync API is a RESTful service built with FastAPI that powers the AI-driven gift recommendation platform. It provides secure authentication, product management, recommendation algorithms, and affiliate revenue tracking.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://api.giftsync.com`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Lifecycle
- **Access Token**: 30 minutes expiry
- **Refresh Token**: 30 days expiry
- **Algorithm**: HS256 JWT

## API Endpoints

### Authentication Endpoints

#### POST /api/v1/auth/register
Register a new user account.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john@example.com",
  "password": "SecurePass123",
  "marketing_consent": true
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Smith",
    "subscription_tier": "free",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/v1/auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** Same as registration

#### GET /api/v1/auth/me
Get current user profile (requires authentication).

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Smith",
  "subscription_tier": "free",
  "created_at": "2024-01-01T00:00:00Z",
  "last_login": "2024-01-01T00:00:00Z"
}
```

#### POST /api/v1/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### POST /api/v1/auth/logout
End user session.

### Product Endpoints

#### GET /api/v1/products/
Search and filter products.

**Query Parameters:**
- `q` (string, optional): Search query
- `category` (string, optional): Filter by category
- `limit` (integer, default: 20): Number of products to return
- `exclude_seen` (boolean, default: false): Exclude previously seen products

**Response:**
```json
[
  {
    "id": "prod_123",
    "title": "Wireless Bluetooth Headphones",
    "description": "Premium noise-cancelling headphones...",
    "price": 79.99,
    "currency": "GBP",
    "category": "Electronics",
    "brand": "AudioTech",
    "retailer": "Amazon",
    "image_url": "https://example.com/image.jpg",
    "affiliate_url": "https://amazon.co.uk/dp/B08GYKNCCP/?tag=giftsync-21",
    "asin": "B08GYKNCCP",
    "rating": 4.5,
    "review_count": 1250,
    "features": ["Noise Cancelling", "30hr Battery", "Quick Charge"]
  }
]
```

#### GET /api/v1/products/{product_id}
Get specific product by ID or ASIN.

#### GET /api/v1/products/trending/
Get trending/popular products.

### Analytics Endpoints

#### POST /api/v1/analytics/track
Track user events for analytics.

**Request Body:**
```json
{
  "event_name": "product_swiped",
  "properties": {
    "direction": "right",
    "product_id": "prod_123",
    "session_id": "sess_456"
  }
}
```

#### POST /api/v1/analytics/affiliate/click
Track affiliate link clicks.

#### POST /api/v1/analytics/affiliate/conversion
Track affiliate conversions.

### Health Check Endpoints

#### GET /
Root endpoint with basic API information.

#### GET /health
Health check for monitoring.

#### GET /ready
Readiness check for Kubernetes.

## Error Responses

All errors follow a consistent format:

```json
{
  "detail": "Error message description"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## Rate Limiting

- **Default**: 60 requests per minute per user
- **Burst**: 100 requests allowed in short bursts
- **Headers**: Rate limit information included in response headers

## Data Models

### User Model
```json
{
  "id": "string (UUID)",
  "email": "string (email format)",
  "first_name": "string",
  "last_name": "string",
  "subscription_tier": "free | premium | enterprise",
  "created_at": "string (ISO datetime)",
  "last_login": "string (ISO datetime)"
}
```

### Product Model
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "currency": "string (ISO currency code)",
  "category": "string",
  "brand": "string",
  "retailer": "string",
  "image_url": "string (URL)",
  "affiliate_url": "string (URL)",
  "asin": "string (Amazon ASIN)",
  "rating": "number (1-5)",
  "review_count": "integer",
  "features": "array of strings"
}
```

## SDK Examples

### Python
```python
import requests

# Authentication
response = requests.post('http://localhost:8000/api/v1/auth/login', json={
    'email': 'user@example.com',
    'password': 'password123'
})
token = response.json()['access_token']

# Get products
headers = {'Authorization': f'Bearer {token}'}
products = requests.get('http://localhost:8000/api/v1/products/', headers=headers)
```

### JavaScript
```javascript
// Authentication
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { access_token } = await loginResponse.json();

// Get products
const productsResponse = await fetch('/api/v1/products/', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const products = await productsResponse.json();
```

## Environment Variables

### Required
- `SECRET_KEY`: JWT signing secret
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_KEY`: Supabase service role key

### Optional
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `AMAZON_ASSOCIATE_TAG`: Amazon affiliate tag
- `MIXPANEL_TOKEN`: Analytics token
- `SENTRY_DSN`: Error tracking DSN

## Deployment

The API can be deployed using:
- **Docker**: `docker run -p 8000:8000 giftsync-api`
- **Uvicorn**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **Gunicorn**: `gunicorn app.main:app -k uvicorn.workers.UvicornWorker`

## Security Features

- JWT authentication with automatic refresh
- bcrypt password hashing with salt
- CORS protection
- Rate limiting
- Input validation with Pydantic
- SQL injection prevention
- XSS protection headers

## Performance

- Connection pooling for database
- Redis caching layer
- Async/await for non-blocking operations
- Request compression
- Optimized database queries

## Monitoring

- Structured JSON logging
- Health check endpoints
- Prometheus metrics (when enabled)
- Sentry error tracking
- Request tracing with correlation IDs