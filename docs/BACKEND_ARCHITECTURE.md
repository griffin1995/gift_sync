# GiftSync Backend Architecture

## Overview

The GiftSync backend is a production-ready FastAPI application that provides AI-powered gift recommendations, secure user authentication, and affiliate revenue tracking. Built with modern Python practices, it emphasizes performance, security, and scalability.

## Technology Stack

### Core Framework
- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.11+**: Latest Python with performance improvements
- **Pydantic**: Data validation and serialization
- **SQLAlchemy**: ORM for database operations
- **Alembic**: Database migrations

### Database & Storage
- **Supabase**: PostgreSQL with built-in authentication
- **Redis**: Caching and session storage
- **AWS S3**: File storage and static assets
- **Amazon RDS**: Production PostgreSQL (alternative)

### Authentication & Security
- **JWT**: JSON Web Tokens for stateless authentication
- **bcrypt**: Password hashing with salt
- **OAuth2**: Social login integration
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API abuse prevention

### External Integrations
- **Amazon Associates**: Affiliate program integration
- **PostHog**: Analytics and feature flags
- **Sentry**: Error tracking and monitoring
- **Mixpanel**: User behavior analytics

### Infrastructure
- **Docker**: Containerization
- **Uvicorn**: ASGI server
- **Gunicorn**: Production WSGI server
- **Prometheus**: Metrics collection
- **Structlog**: Structured logging

## Project Structure

```
backend/
├── app/
│   ├── api/                # API routes and endpoints
│   │   └── v1/
│   │       ├── api.py      # API router aggregation
│   │       └── endpoints/  # Individual endpoint modules
│   ├── core/               # Core functionality
│   │   ├── config.py       # Configuration management
│   │   ├── database.py     # Database connection
│   │   ├── middleware.py   # Custom middleware
│   │   └── security.py     # Security utilities
│   ├── models/             # Data models
│   │   ├── __init__.py     # Pydantic models
│   │   └── sqlalchemy/     # SQLAlchemy models
│   ├── services/           # Business logic services
│   │   ├── amazon_products.py  # Amazon integration
│   │   ├── recommendations.py  # ML recommendations
│   │   └── analytics.py    # Analytics service
│   ├── utils/              # Utility functions
│   ├── tests/              # Test suite
│   └── main.py             # Application entry point
├── migrations/             # Database migrations
├── scripts/               # Deployment scripts
├── requirements.txt       # Python dependencies
└── Dockerfile            # Container configuration
```

## Core Components

### Application Entry Point (`app/main.py`)

The main FastAPI application with comprehensive configuration:

```python
app = FastAPI(
    title="GiftSync API",
    description="AI-powered gift recommendation platform",
    version="1.0.0",
    lifespan=lifespan  # Startup/shutdown management
)
```

**Key Features:**
- Structured JSON logging with correlation IDs
- Production-ready middleware stack
- Database connection management
- Health check endpoints
- Graceful startup and shutdown

### Configuration Management (`app/core/config.py`)

Environment-based configuration with validation:

```python
class Settings(BaseSettings):
    PROJECT_NAME: str = "GiftSync API"
    SECRET_KEY: str  # JWT signing secret
    DATABASE_URL: str  # PostgreSQL connection
    SUPABASE_URL: str  # Supabase project URL
    AMAZON_ASSOCIATE_TAG: str  # Affiliate tag
    # ... 50+ configuration options
```

**Configuration Categories:**
- **Security**: JWT secrets, CORS settings, rate limits
- **Database**: Connection strings, pool sizes
- **External APIs**: Amazon, Supabase, analytics
- **Feature Flags**: Enable/disable functionality
- **Business Logic**: Commission rates, limits

### Authentication System (`app/api/v1/endpoints/auth.py`)

Secure JWT-based authentication with comprehensive features:

**Registration Flow:**
1. Email uniqueness validation
2. bcrypt password hashing with salt
3. User record creation with UUID
4. JWT token generation (access + refresh)
5. User profile return with tokens

**Security Features:**
- Password complexity requirements
- Email verification (planned)
- Account lockout protection
- Session management
- Token refresh mechanism

**API Endpoints:**
- `POST /auth/register` - Create new account
- `POST /auth/login` - Authenticate user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user profile
- `POST /auth/logout` - End session

### Product Management (`app/api/v1/endpoints/simple_products.py`)

Real Amazon product integration with affiliate revenue:

**Features:**
- Amazon Product Advertising API integration
- Search and category filtering
- Affiliate URL generation with tracking
- Product metadata enrichment
- Caching for performance

**API Endpoints:**
- `GET /products/` - Search and filter products
- `GET /products/{id}` - Get specific product
- `GET /products/trending/` - Get popular products

**Data Flow:**
1. Frontend requests products with criteria
2. Backend queries Amazon API via service
3. Products converted to standardized format
4. Affiliate URLs generated with tracking
5. Response cached for performance

### Amazon Product Service (`app/services/amazon_products.py`)

Comprehensive Amazon integration for affiliate revenue:

**Core Functionality:**
- Real Amazon product data with valid ASINs
- Affiliate URL generation with commission tracking
- Product search and categorization
- Revenue analytics and reporting
- ASIN extraction and validation

**Revenue Features:**
- Amazon Associates program integration (giftsync-21)
- Commission-eligible URL generation
- Click tracking for attribution
- Conversion rate optimization
- Category-based commission rates

**Product Catalog:**
- Electronics (smart devices, audio)
- Kitchen & Home (appliances, gadgets)
- Beauty & Personal Care (skincare, wellness)
- Toys & Games (LEGO, collectibles)
- Food & Drink (gourmet, gift sets)
- Garden & Outdoors (plants, decor)

### Data Models (`app/models.py`)

Pydantic models for data validation and serialization:

**User Models:**
```python
class User(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    subscription_tier: SubscriptionTier
    created_at: datetime
```

**Product Models:**
```python
class Product(BaseModel):
    id: str
    title: str
    price: float
    category: str
    affiliate_url: str
    asin: str
    rating: float
    review_count: int
```

**API Response Models:**
```python
class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: User
```

## Database Architecture

### Supabase Integration

**Advantages:**
- Built-in authentication and authorization
- Real-time subscriptions
- Automatic API generation
- Row Level Security (RLS)
- Managed PostgreSQL with backups

**Database Tables:**
- `users` - User accounts and profiles
- `products` - Product catalog cache
- `swipe_sessions` - User interaction sessions
- `affiliate_clicks` - Revenue tracking
- `user_preferences` - Recommendation data

### Connection Management

```python
# Supabase client initialization
supabase = SupabaseClient(
    url=settings.SUPABASE_URL,
    key=settings.SUPABASE_SERVICE_KEY
)

# Connection pooling for performance
DATABASE_POOL_SIZE: int = 10
DATABASE_MAX_OVERFLOW: int = 20
```

## Security Architecture

### Authentication Flow

1. **Registration/Login**: User provides credentials
2. **Validation**: Email/password validation with bcrypt
3. **Token Generation**: JWT access + refresh tokens
4. **Token Storage**: Secure client-side storage
5. **API Requests**: Bearer token in Authorization header
6. **Token Refresh**: Automatic renewal before expiry

### Security Headers

```python
# CORS Configuration
CORSMiddleware(
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Security Headers
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Data Protection

- **Password Security**: bcrypt with salt, complexity requirements
- **Token Security**: Short-lived access tokens, secure refresh
- **Input Validation**: Pydantic models with type checking
- **SQL Injection**: SQLAlchemy ORM with parameterized queries
- **Rate Limiting**: Request throttling per user/IP
- **Audit Logging**: All security events logged

## API Design

### RESTful Principles

- **Resource-based URLs**: `/api/v1/products/`, `/api/v1/users/`
- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH
- **Status Codes**: Proper HTTP status code usage
- **JSON Format**: Consistent request/response format
- **Versioning**: URL-based API versioning

### Error Handling

```python
# Consistent error format
{
    "detail": "User with this email already exists",
    "error_code": "USER_EXISTS",
    "timestamp": "2024-01-01T00:00:00Z"
}

# HTTP Status Codes
200: Success
201: Created
400: Bad Request (validation error)
401: Unauthorized (authentication required)
403: Forbidden (insufficient permissions)
404: Not Found
422: Unprocessable Entity (validation failed)
500: Internal Server Error
```

### Request/Response Patterns

**Pagination:**
```python
{
    "items": [...],
    "total": 100,
    "page": 1,
    "per_page": 20,
    "pages": 5
}
```

**Filtering:**
```
GET /api/v1/products/?category=electronics&price_min=10&price_max=100
```

**Sorting:**
```
GET /api/v1/products/?sort=price&order=desc
```

## Performance Optimization

### Async Programming

```python
# Async endpoint handlers
@router.get("/products/")
async def get_products():
    products = await amazon_service.get_products_async()
    return products

# Database async operations
async with AsyncSession(engine) as session:
    result = await session.execute(query)
```

### Caching Strategy

- **Redis**: API response caching, session storage
- **Memory**: Frequently accessed data
- **CDN**: Static assets and images
- **Database**: Query result caching

### Database Optimization

- **Connection Pooling**: Reuse database connections
- **Query Optimization**: Efficient SQL queries
- **Indexing**: Database indexes for fast lookups
- **Pagination**: Limit result set sizes

## Monitoring & Observability

### Structured Logging

```python
import structlog

logger = structlog.get_logger(__name__)

logger.info(
    "User login attempt",
    user_id=user.id,
    email=user.email,
    ip_address=request.client.host,
    user_agent=request.headers.get("user-agent")
)
```

### Health Checks

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION
    }

@app.get("/ready")
async def readiness_check():
    # Check database connectivity
    # Check external service availability
    # Check ML model status
    return {"status": "ready", "checks": {...}}
```

### Metrics Collection

- **Request Metrics**: Response times, error rates
- **Business Metrics**: User registrations, product views
- **System Metrics**: CPU, memory, database connections
- **Custom Metrics**: Recommendation accuracy, conversion rates

## Deployment Architecture

### Docker Configuration

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Deployment

**ASGI Server:**
```bash
gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  -w 4 \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

**Environment Variables:**
```bash
SECRET_KEY=production-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://project.supabase.co
ENVIRONMENT=production
DEBUG=false
```

### Infrastructure Options

- **AWS**: ECS, Lambda, RDS, ElastiCache
- **Google Cloud**: Cloud Run, Cloud SQL, Memorystore
- **Azure**: Container Instances, PostgreSQL, Redis Cache
- **DigitalOcean**: App Platform, Managed Databases
- **Heroku**: Dynos with PostgreSQL and Redis add-ons

## Testing Strategy

### Test Structure

```
tests/
├── unit/              # Unit tests for individual functions
├── integration/       # API endpoint testing
├── e2e/              # End-to-end user scenarios
├── load/             # Performance and load testing
└── fixtures/         # Test data and mocks
```

### Testing Tools

- **pytest**: Test framework with fixtures
- **httpx**: Async HTTP client for API testing
- **pytest-asyncio**: Async test support
- **pytest-cov**: Code coverage reporting
- **factory-boy**: Test data generation

### Test Categories

**Unit Tests:**
```python
def test_password_hashing():
    password = "test123"
    hashed = hash_password(password)
    assert verify_password(password, hashed)
```

**Integration Tests:**
```python
async def test_user_registration(client):
    response = await client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "test123",
        "first_name": "Test",
        "last_name": "User"
    })
    assert response.status_code == 201
```

**Load Tests:**
```python
# Locust performance testing
class APIUser(HttpUser):
    def on_start(self):
        self.login()
    
    @task
    def get_products(self):
        self.client.get("/api/v1/products/")
```

## Error Handling & Recovery

### Exception Handling

```python
@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": exc.errors()}
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
```

### Graceful Degradation

- **Database Failures**: Fallback to cached data
- **External API Failures**: Default responses
- **Service Unavailable**: Maintenance mode
- **Rate Limiting**: Queue requests

## Future Enhancements

### Planned Features

- **Machine Learning**: Real-time recommendation engine
- **Microservices**: Service decomposition
- **Event Streaming**: Kafka/RabbitMQ integration
- **GraphQL**: Alternative API interface
- **Websockets**: Real-time updates

### Scalability Improvements

- **Load Balancing**: Multiple API instances
- **Database Sharding**: Horizontal scaling
- **Caching Layers**: Multi-tier caching
- **CDN Integration**: Global content delivery
- **Auto-scaling**: Dynamic resource allocation

### Security Enhancements

- **OAuth2 Providers**: Google, Facebook, Apple login
- **Two-Factor Authentication**: SMS/TOTP support
- **API Key Management**: Client authentication
- **Audit Logging**: Comprehensive security logs
- **Encryption**: End-to-end data encryption