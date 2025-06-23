# GiftSync Development Guide

## Overview

This guide provides comprehensive instructions for setting up a development environment and contributing to the GiftSync platform. It covers everything from initial setup to advanced development workflows.

## Prerequisites

### Required Software

- **Node.js 18+**: Frontend development and package management
- **Python 3.11+**: Backend development
- **Docker & Docker Compose**: Containerized development
- **Git**: Version control
- **VS Code**: Recommended IDE with extensions

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.pylint",
    "ms-python.black-formatter",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode-remote.remote-containers",
    "ms-azuretools.vscode-docker",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-json"
  ]
}
```

## Quick Start

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/your-org/giftsync.git
cd giftsync

# Install development tools
npm install -g @vercel/cli
pip install pre-commit
```

### 2. Environment Configuration

Create environment files from templates:

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp web/.env.example web/.env.local

# Docker environment
cp .env.example .env
```

### 3. Docker Development (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Manual Setup (Alternative)

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Install pre-commit hooks
pre-commit install

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Workflow

### Git Workflow

We use **Git Flow** with the following branches:

- `main`: Production-ready code
- `develop`: Development integration branch
- `feature/*`: New features
- `hotfix/*`: Critical bug fixes
- `release/*`: Release preparation

#### Feature Development
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature description"

# Push and create PR
git push origin feature/your-feature-name
```

#### Commit Convention

We follow **Conventional Commits**:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semi-colons, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**
```bash
git commit -m "feat: add product search functionality"
git commit -m "fix: resolve authentication token refresh issue"
git commit -m "docs: update API documentation for new endpoints"
```

### Code Quality

#### Pre-commit Hooks

Configure pre-commit hooks for code quality:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files

  - repo: https://github.com/psf/black
    rev: 22.3.0
    hooks:
      - id: black
        language_version: python3

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v2.7.1
    hooks:
      - id: prettier
        files: \.(js|jsx|ts|tsx|json|css|md)$
```

#### Python Code Quality

```bash
# Format code
black backend/

# Lint code
pylint backend/app/

# Type checking
mypy backend/app/

# Sort imports
isort backend/

# Security checks
bandit -r backend/app/
```

#### TypeScript/React Code Quality

```bash
cd web

# Lint and fix
npm run lint
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check

# Build check
npm run build
```

## Project Structure Deep Dive

### Backend Structure
```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── core/                   # Core functionality
│   │   ├── config.py          # Configuration management
│   │   ├── database.py        # Database connection
│   │   ├── middleware.py      # Custom middleware
│   │   └── security.py        # Security utilities
│   ├── api/                    # API routes
│   │   └── v1/
│   │       ├── api.py         # Router aggregation
│   │       └── endpoints/     # Individual endpoints
│   │           ├── auth.py    # Authentication
│   │           ├── products.py # Product management
│   │           └── analytics.py # Analytics tracking
│   ├── models/                 # Data models
│   │   ├── __init__.py        # Pydantic models
│   │   └── sqlalchemy/        # SQLAlchemy models
│   ├── services/               # Business logic
│   │   ├── amazon_products.py # Amazon integration
│   │   ├── recommendations.py # ML recommendations
│   │   └── analytics.py       # Analytics service
│   ├── utils/                  # Utility functions
│   │   ├── __init__.py
│   │   ├── helpers.py
│   │   └── validators.py
│   └── tests/                  # Test suite
│       ├── conftest.py        # Test configuration
│       ├── unit/              # Unit tests
│       ├── integration/       # Integration tests
│       └── fixtures/          # Test data
├── migrations/                 # Database migrations
├── scripts/                    # Deployment scripts
├── requirements.txt            # Production dependencies
├── requirements-dev.txt        # Development dependencies
├── Dockerfile                  # Container configuration
└── docker-compose.yml         # Development services
```

### Frontend Structure
```
web/
├── public/                     # Static assets
│   ├── icons/                 # App icons
│   ├── images/                # Images
│   └── favicon.ico            # Site favicon
├── src/
│   ├── components/            # React components
│   │   ├── common/           # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── swipe/            # Swipe interface
│   │   │   ├── WorkingSwipeInterface.tsx
│   │   │   ├── SwipeCard.tsx
│   │   │   └── SwipeControls.tsx
│   │   └── ui/               # Base UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   ├── context/              # React context
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── ThemeContext.tsx  # Theme management
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useLocalStorage.ts
│   ├── lib/                  # Utility libraries
│   │   ├── api.ts           # API client
│   │   ├── analytics.ts     # Analytics service
│   │   ├── affiliate.ts     # Affiliate tracking
│   │   └── utils.ts         # Helper functions
│   ├── pages/               # Next.js pages
│   │   ├── index.tsx        # Homepage
│   │   ├── discover.tsx     # Product discovery
│   │   ├── auth/           # Authentication pages
│   │   └── api/            # API routes
│   ├── styles/             # Styling
│   │   ├── globals.css     # Global styles
│   │   └── components.css  # Component styles
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Type definitions
│   └── config/             # Configuration
│       └── index.ts        # App configuration
├── docs/                   # Documentation
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies and scripts
```

## Development Best Practices

### Backend Development

#### API Endpoint Development
```python
# Example endpoint structure
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ProductResponse(BaseModel):
    """
    Product response model with comprehensive documentation.
    
    Fields:
        id: Unique product identifier
        title: Product name for display
        price: Current price in specified currency
        # ... detailed field documentation
    """
    id: str
    title: str
    price: float
    currency: str = "GBP"

@router.get("/products/", response_model=List[ProductResponse])
async def get_products(
    limit: int = 20,
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve products with filtering and pagination.
    
    Args:
        limit: Maximum number of products to return
        category: Optional category filter
        current_user: Authenticated user (from dependency injection)
    
    Returns:
        List[ProductResponse]: Filtered product list
    
    Raises:
        HTTPException: 400 if invalid parameters
        HTTPException: 401 if authentication required
    """
    try:
        # Implementation with proper error handling
        products = await product_service.get_products(
            limit=limit,
            category=category,
            user_id=current_user.id
        )
        return products
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
```

#### Database Models
```python
# SQLAlchemy model example
from sqlalchemy import Column, String, DateTime, Boolean, Text, UUID
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    """
    User account model for authentication and profile management.
    
    Relationships:
        - swipe_sessions: User's product interaction sessions
        - affiliate_clicks: Revenue tracking for user clicks
        - preferences: User recommendation preferences
    
    Indexes:
        - email: Unique index for fast authentication lookups
        - created_at: Index for user analytics and reporting
    """
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    subscription_tier = Column(String, default="free")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

#### Testing Patterns
```python
# Test example with fixtures
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.fixture
async def test_user():
    """Create test user for authentication tests."""
    return {
        "email": "test@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User"
    }

@pytest.mark.asyncio
async def test_user_registration(test_user):
    """Test user registration endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/register", json=test_user)
    
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_user["email"]

@pytest.mark.asyncio
async def test_protected_endpoint():
    """Test endpoint that requires authentication."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Test without authentication
        response = await client.get("/api/v1/products/")
        assert response.status_code == 401
        
        # Test with authentication
        # ... login flow to get token
        headers = {"Authorization": f"Bearer {token}"}
        response = await client.get("/api/v1/products/", headers=headers)
        assert response.status_code == 200
```

### Frontend Development

#### Component Development
```typescript
// Example React component with TypeScript
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { trackEvent } from '@/lib/analytics';

interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Callback when product is selected */
  onSelect: (product: Product) => void;
  /** Whether the card is in loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ProductCard component for displaying product information.
 * 
 * Features:
 * - Responsive design with image optimization
 * - Analytics tracking for user interactions
 * - Accessibility support with ARIA labels
 * - Loading states and error handling
 * 
 * @param props - Component props
 * @returns Rendered product card component
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isLoading = false,
  className = ''
}) => {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);

  /**
   * Handle product selection with analytics tracking.
   */
  const handleSelect = () => {
    // Track user interaction
    trackEvent('product_selected', {
      product_id: product.id,
      product_category: product.category,
      user_id: user?.id,
      source: 'product_card'
    });

    onSelect(product);
  };

  /**
   * Handle image load errors with fallback.
   */
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className={`product-card ${className}`}
      role="button"
      tabIndex={0}
      aria-label={`Product: ${product.title}`}
      onClick={handleSelect}
      onKeyPress={(e) => e.key === 'Enter' && handleSelect()}
    >
      {/* Product Image */}
      <div className="product-image">
        {!imageError ? (
          <img
            src={product.image_url}
            alt={product.title}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="image-placeholder">
            <span>No Image Available</span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">£{product.price.toFixed(2)}</p>
        
        {product.rating && (
          <div className="product-rating">
            <span className="rating-stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={i < Math.floor(product.rating!) ? 'star-filled' : 'star-empty'}
                >
                  ⭐
                </span>
              ))}
            </span>
            <span className="rating-count">({product.review_count})</span>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
```

#### Custom Hooks
```typescript
// Custom hook for API calls with error handling
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface UseApiOptions<T> {
  /** Initial data value */
  initialData?: T;
  /** Whether to fetch data immediately */
  immediate?: boolean;
  /** Dependencies for refetching */
  deps?: React.DependencyList;
}

interface UseApiReturn<T> {
  /** Current data state */
  data: T | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Manual refetch function */
  refetch: () => Promise<void>;
}

/**
 * Custom hook for API calls with loading and error states.
 * 
 * Features:
 * - Automatic loading state management
 * - Error handling with user-friendly messages
 * - Manual refetch capability
 * - Dependency-based refetching
 * 
 * @param apiCall - Function that returns a Promise with data
 * @param options - Hook configuration options
 * @returns API state and control functions
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { initialData = null, immediate = true, deps = [] } = options;
  
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute API call with error handling.
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, ...deps]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Usage example
export function ProductList() {
  const { data: products, loading, error, refetch } = useApi(
    () => api.getProducts({ limit: 20 }),
    { immediate: true }
  );

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!products) return <div>No products found</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Testing Strategy

### Backend Testing

#### Test Structure
```
tests/
├── conftest.py              # Test configuration and fixtures
├── unit/                    # Unit tests
│   ├── test_auth.py        # Authentication logic
│   ├── test_products.py    # Product services
│   └── test_utils.py       # Utility functions
├── integration/            # API integration tests
│   ├── test_auth_api.py    # Authentication endpoints
│   ├── test_products_api.py # Product endpoints
│   └── test_analytics_api.py # Analytics endpoints
├── e2e/                    # End-to-end tests
│   └── test_user_journey.py # Complete user workflows
└── fixtures/               # Test data
    ├── users.json          # User test data
    └── products.json       # Product test data
```

#### Test Commands
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/unit/test_auth.py

# Run with verbose output
pytest -v

# Run tests in parallel
pytest -n auto
```

### Frontend Testing

#### Test Structure
```
tests/
├── __tests__/              # Jest tests
│   ├── components/         # Component tests
│   ├── hooks/             # Custom hook tests
│   ├── utils/             # Utility tests
│   └── pages/             # Page tests
├── e2e/                   # Cypress tests
│   ├── auth.cy.ts         # Authentication flow
│   ├── discover.cy.ts     # Product discovery
│   └── dashboard.cy.ts    # User dashboard
└── fixtures/              # Test data
    └── products.json      # Mock product data
```

#### Test Commands
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests in browser
npm run test:e2e:open
```

## Database Development

### Schema Design

```sql
-- Users table with comprehensive fields
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    full_name VARCHAR GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    password_hash VARCHAR NOT NULL,
    subscription_tier subscription_tier_enum DEFAULT 'free',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    gdpr_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);

-- Row Level Security (Supabase)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);
```

### Migration Management

```python
# Alembic migration example
"""Add user preferences table

Revision ID: 001_add_user_preferences
Revises: 000_initial_migration
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '001_add_user_preferences'
down_revision = '000_initial_migration'
branch_labels = None
depends_on = None

def upgrade():
    """Add user preferences table for recommendation personalization."""
    op.create_table(
        'user_preferences',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), 
                 sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('preferred_categories', postgresql.ARRAY(sa.String), nullable=True),
        sa.Column('price_range_min', sa.Numeric(10, 2), nullable=True),
        sa.Column('price_range_max', sa.Numeric(10, 2), nullable=True),
        sa.Column('excluded_brands', postgresql.ARRAY(sa.String), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now())
    )
    
    # Create indexes
    op.create_index('idx_user_preferences_user_id', 'user_preferences', ['user_id'])

def downgrade():
    """Remove user preferences table."""
    op.drop_table('user_preferences')
```

## Performance Optimization

### Backend Performance

#### Database Optimization
```python
# Efficient database queries with SQLAlchemy
from sqlalchemy.orm import selectinload, joinedload

async def get_user_with_preferences(user_id: str):
    """
    Efficiently load user with related data using eager loading.
    
    Prevents N+1 query problems by loading related data in single query.
    """
    query = (
        select(User)
        .options(
            selectinload(User.preferences),
            joinedload(User.subscription)
        )
        .where(User.id == user_id)
    )
    
    result = await session.execute(query)
    return result.scalar_one_or_none()

# Use database indexes for fast queries
@router.get("/products/search/")
async def search_products(
    query: str,
    category: Optional[str] = None,
    limit: int = 20
):
    """Search products with optimized database queries."""
    # Use full-text search index
    search_vector = func.to_tsvector('english', Product.title + ' ' + Product.description)
    search_query = func.plainto_tsquery('english', query)
    
    stmt = (
        select(Product)
        .where(search_vector.match(search_query))
        .order_by(func.ts_rank(search_vector, search_query).desc())
        .limit(limit)
    )
    
    if category:
        stmt = stmt.where(Product.category == category)
    
    result = await session.execute(stmt)
    return result.scalars().all()
```

#### Caching Strategy
```python
from functools import lru_cache
import redis
import json

# Redis client setup
redis_client = redis.Redis.from_url(settings.REDIS_URL)

def cache_key(prefix: str, **kwargs) -> str:
    """Generate consistent cache keys."""
    key_parts = [prefix]
    for k, v in sorted(kwargs.items()):
        key_parts.append(f"{k}:{v}")
    return ":".join(key_parts)

async def cached_api_call(cache_key: str, ttl: int = 3600):
    """Decorator for caching API responses."""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Try to get from cache
            cached_data = redis_client.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(result, default=str))
            return result
        return wrapper
    return decorator

@cached_api_call("products:trending", ttl=1800)  # 30 minutes
async def get_trending_products(limit: int = 10):
    """Get trending products with caching."""
    # Expensive computation here
    return await amazon_service.get_trending_products(limit)
```

### Frontend Performance

#### React Optimization
```typescript
// Memoization for expensive calculations
import React, { useMemo, useCallback } from 'react';

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onProductSelect 
}) => {
  // Memoize expensive calculations
  const sortedProducts = useMemo(() => {
    return products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 50); // Limit to 50 items for performance
  }, [products]);

  // Memoize callback to prevent unnecessary re-renders
  const handleProductSelect = useCallback((product: Product) => {
    onProductSelect(product);
  }, [onProductSelect]);

  return (
    <div className="product-list">
      {sortedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={handleProductSelect}
        />
      ))}
    </div>
  );
};

// Lazy loading for large components
const RecommendationEngine = React.lazy(() => import('./RecommendationEngine'));

export function App() {
  return (
    <Suspense fallback={<div>Loading recommendations...</div>}>
      <RecommendationEngine />
    </Suspense>
  );
}
```

#### Bundle Optimization
```javascript
// next.config.js optimizations
const nextConfig = {
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Analyze bundle size
      config.plugins.push(
        new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    
    return config;
  },
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
};
```

## Debugging

### Backend Debugging

#### Debug Configuration
```python
# Debug logging setup
import structlog
import sys

# Configure debug logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.dev.ConsoleRenderer()  # Pretty console output for development
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

# Debug middleware
@app.middleware("http")
async def debug_middleware(request: Request, call_next):
    """Debug middleware for request/response logging."""
    start_time = time.time()
    
    logger.info(
        "Request started",
        method=request.method,
        url=str(request.url),
        headers=dict(request.headers)
    )
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(
        "Request completed",
        status_code=response.status_code,
        process_time=process_time
    )
    
    return response
```

#### Debug Tools
```bash
# Database query debugging
export SQLALCHEMY_ECHO=True

# API debugging with HTTPie
http GET localhost:8000/api/v1/products/ Authorization:"Bearer <token>"

# Python debugger
import pdb; pdb.set_trace()

# Or use ipdb for better interface
import ipdb; ipdb.set_trace()
```

### Frontend Debugging

#### React Developer Tools
```typescript
// Debug context in React DevTools
const AuthContext = React.createContext<AuthContextType>(undefined);
AuthContext.displayName = 'AuthContext';

// Debug hooks
function useDebugValue(value: any, label?: string) {
  React.useDebugValue(value, label);
  return value;
}

export function useAuth() {
  const context = useContext(AuthContext);
  useDebugValue(context, 'AuthContext');
  return context;
}
```

#### Debug Configuration
```javascript
// Debug API calls
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });
    }
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

## Contributing Guidelines

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following project conventions
   - Add comprehensive tests
   - Update documentation
   - Ensure all checks pass

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **PR Requirements**
   - [ ] All tests pass
   - [ ] Code coverage maintained
   - [ ] Documentation updated
   - [ ] No merge conflicts
   - [ ] Approved by reviewer

### Code Review Checklist

#### Backend Review
- [ ] API endpoints follow RESTful conventions
- [ ] Proper error handling and status codes
- [ ] Input validation with Pydantic models
- [ ] Authentication and authorization checks
- [ ] Database queries are optimized
- [ ] Tests cover happy path and edge cases
- [ ] Documentation strings are comprehensive
- [ ] Logging is appropriate and structured

#### Frontend Review
- [ ] Components follow React best practices
- [ ] TypeScript types are properly defined
- [ ] Accessibility standards are met
- [ ] Performance optimizations applied
- [ ] Error boundaries implemented
- [ ] Loading states handled gracefully
- [ ] Analytics tracking is comprehensive
- [ ] Responsive design works across devices

This comprehensive development guide should help you contribute effectively to the GiftSync platform. Remember to follow the established patterns and conventions to maintain code quality and consistency.