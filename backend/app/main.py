"""
GiftSync API - Main Application Entry Point

This module serves as the primary entry point for the GiftSync API application.
It configures the FastAPI application with all necessary middleware, routing,
logging, and lifecycle management for a production-ready gift recommendation platform.

Key Features:
- Structured JSON logging with correlation IDs
- Production-ready middleware stack (CORS, security headers, rate limiting)
- Database connection management with connection pooling
- Health check endpoints for monitoring and orchestration
- Environment-specific configuration (dev/staging/production)
- Graceful startup and shutdown handling

Architecture:
- FastAPI as the ASGI web framework
- Supabase as the primary database (PostgreSQL)
- Redis for caching and session management
- Structured logging for observability
- Rate limiting and security middleware

Dependencies:
- FastAPI: Modern, fast web framework for building APIs
- Structlog: Structured logging with JSON output
- Uvicorn: ASGI server for production deployment
- Supabase: Backend-as-a-service with PostgreSQL
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import structlog

# Internal imports - organized by category
from app.core.config import settings          # Application configuration
from app.core.database import create_tables   # Database initialization
from app.api.v1.api import api_router         # API route definitions
from app.core.middleware import setup_middleware  # Custom middleware setup


# ================================
# LOGGING CONFIGURATION
# ================================

# Configure structured logging for production observability
# Uses JSON output format for easy parsing by log aggregation tools
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,           # Filter by log level (DEBUG, INFO, etc.)
        structlog.stdlib.add_logger_name,           # Add logger name to each log entry
        structlog.stdlib.add_log_level,             # Add log level to each entry
        structlog.stdlib.PositionalArgumentsFormatter(),  # Format positional args
        structlog.processors.TimeStamper(fmt="iso"), # Add ISO timestamp
        structlog.processors.StackInfoRenderer(),    # Include stack traces when needed
        structlog.processors.format_exc_info,       # Format exception information
        structlog.processors.UnicodeDecoder(),      # Handle unicode properly
        structlog.processors.JSONRenderer()         # Output as JSON for log aggregation
    ],
    context_class=dict,                             # Use dict for log context
    logger_factory=structlog.stdlib.LoggerFactory(), # Use stdlib logging backend
    wrapper_class=structlog.stdlib.BoundLogger,    # Wrap stdlib logger
    cache_logger_on_first_use=True,               # Cache logger instances for performance
)

# Initialize application logger
logger = structlog.get_logger(__name__)


# ================================
# APPLICATION LIFECYCLE MANAGEMENT
# ================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager for startup and shutdown events.
    
    This function handles the complete lifecycle of the FastAPI application,
    including resource initialization, health checks, and graceful cleanup.
    
    Startup Process:
    1. Initialize database connections and verify connectivity
    2. Load and initialize ML recommendation models
    3. Establish Redis connection for caching
    4. Verify external service dependencies (Supabase, external APIs)
    5. Load configuration and feature flags
    
    Shutdown Process:
    1. Gracefully close all database connections
    2. Clean up ML model resources and memory
    3. Close Redis connections
    4. Flush any pending logs or analytics
    
    Args:
        app: FastAPI application instance
        
    Yields:
        None: Control back to FastAPI for request handling
        
    Note:
        Currently using Supabase which handles database lifecycle automatically,
        so manual table creation is commented out. ML models and Redis are
        prepared for future implementation.
    """
    # ============================
    # STARTUP SEQUENCE
    # ============================
    
    logger.info(
        "Starting up GiftSync API", 
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        debug=settings.DEBUG
    )
    
    try:
        # Database initialization (disabled for Supabase)
        # Supabase manages database lifecycle automatically
        # await create_tables()
        
        # Machine Learning model initialization (prepared for future)
        # Load recommendation models, collaborative filtering, etc.
        # await initialize_ml_models()
        
        # Cache layer initialization (prepared for future)
        # Connect to Redis for session storage and API caching
        # await initialize_redis()
        
        # External service health checks
        # Verify Supabase connectivity, Amazon Associates API, etc.
        # await verify_external_services()
        
        logger.info("GiftSync API startup complete - ready to serve requests")
        
    except Exception as e:
        logger.error("Failed to start GiftSync API", error=str(e), exc_info=True)
        raise
    
    # Application is now running and serving requests
    yield
    
    # ============================
    # SHUTDOWN SEQUENCE
    # ============================
    
    logger.info("Shutting down GiftSync API - beginning graceful shutdown")
    
    try:
        # Clean up ML models and release memory
        # await cleanup_ml_models()
        
        # Close Redis connections gracefully
        # await cleanup_redis()
        
        # Flush any pending analytics or logs
        # await flush_pending_data()
        
        logger.info("GiftSync API shutdown complete - all resources cleaned up")
        
    except Exception as e:
        logger.error("Error during shutdown", error=str(e), exc_info=True)
        # Continue shutdown even if cleanup fails


# ================================
# FASTAPI APPLICATION SETUP
# ================================

# Create the main FastAPI application instance with comprehensive configuration
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="GiftSync API - AI-powered gift recommendation platform with affiliate monetization",
    version=settings.VERSION,
    # Conditional API documentation - only expose in non-production environments
    openapi_url="/api/v1/openapi.json" if settings.ENVIRONMENT != "production" else None,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,        # Swagger UI
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,     # ReDoc UI
    lifespan=lifespan,  # Attach lifecycle management
)

# ================================
# MIDDLEWARE CONFIGURATION
# ================================

# Apply custom middleware stack (rate limiting, security headers, request ID, etc.)
setup_middleware(app)

# Cross-Origin Resource Sharing (CORS) configuration
# Allows frontend applications to access the API from different origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,    # Allowed origin domains
    allow_credentials=True,                  # Allow cookies and auth headers
    allow_methods=["*"],                     # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],                     # Allow all headers
)

# Production security: Trusted Host Middleware
# Prevents Host header attacks by validating the Host header
if settings.ENVIRONMENT == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,  # Only accept requests from these hosts
    )

# ================================
# API ROUTING
# ================================

# Mount the main API router with versioning prefix
# All API endpoints will be available under /api/v1/
app.include_router(api_router, prefix="/api/v1")


# ================================
# HEALTH CHECK ENDPOINTS
# ================================

@app.get("/")
async def root():
    """
    Root endpoint providing basic API information.
    
    This endpoint serves as a simple health check and provides basic information
    about the API service. It's commonly used by load balancers and monitoring
    tools to verify the service is responding.
    
    Returns:
        dict: Basic API information including version and environment
        
    Example Response:
        {
            "message": "GiftSync API is running",
            "version": "1.0.0",
            "environment": "development"
        }
    """
    return {
        "message": "GiftSync API is running",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.
    
    This endpoint provides a quick health status of the API service.
    Used by monitoring systems, load balancers, and container orchestrators
    to determine if the service is healthy and should receive traffic.
    
    Returns:
        dict: Health status with timestamp and version information
        
    Example Response:
        {
            "status": "healthy",
            "timestamp": "2024-01-01T00:00:00Z",
            "version": "1.0.0"
        }
        
    HTTP Status Codes:
        200: Service is healthy and operational
        503: Service is unhealthy (would be returned if checks fail)
    """
    from datetime import datetime
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": settings.VERSION,
    }


@app.get("/ready")
async def readiness_check():
    """
    Readiness check endpoint for Kubernetes and container orchestrators.
    
    This endpoint performs comprehensive checks of all service dependencies
    to determine if the service is ready to handle requests. Unlike the health
    check, this validates external dependencies and may take longer to respond.
    
    Checks performed:
    - Database connectivity (Supabase)
    - Cache layer connectivity (Redis) 
    - External API availability (Amazon Associates)
    - ML model loading status
    - Configuration validation
    
    Returns:
        dict: Detailed readiness status with individual component checks
        
    Example Response:
        {
            "status": "ready",
            "checks": {
                "database": "healthy",
                "redis": "healthy", 
                "ml_models": "healthy",
                "external_apis": "healthy"
            }
        }
        
    HTTP Status Codes:
        200: Service is ready to handle requests
        503: Service is not ready (dependencies unavailable)
        
    Note:
        Individual checks are currently mocked and will be implemented
        when the respective services are integrated.
    """
    # TODO: Implement actual dependency checks
    # Database connectivity check
    # database_status = await check_database_connection()
    
    # Redis connectivity check  
    # redis_status = await check_redis_connection()
    
    # ML models availability check
    # ml_models_status = await check_ml_models()
    
    # External APIs check
    # external_apis_status = await check_external_apis()
    
    return {
        "status": "ready",
        "checks": {
            "database": "healthy",      # Supabase connection
            "redis": "healthy",         # Cache layer
            "ml_models": "healthy",     # Recommendation models
            "external_apis": "healthy", # Amazon Associates, etc.
        },
    }


# ================================
# DEVELOPMENT SERVER ENTRY POINT
# ================================

if __name__ == "__main__":
    """
    Development server entry point.
    
    This block only executes when the script is run directly (not imported).
    It starts a Uvicorn ASGI server with development-friendly settings.
    
    Configuration:
    - Host: 0.0.0.0 (accept connections from any IP)
    - Port: 8000 (standard development port)
    - Reload: Enabled in development for hot reloading
    - Log Config: Disabled to use structlog instead of uvicorn's logging
    
    For production deployment, use a proper ASGI server configuration
    with gunicorn or similar, rather than this development server.
    """
    import uvicorn
    
    uvicorn.run(
        "app.main:app",                                    # Application module path
        host="0.0.0.0",                                   # Listen on all interfaces
        port=8000,                                        # Development port
        reload=settings.ENVIRONMENT == "development",     # Hot reload in development
        log_config=None,                                  # Use structlog instead of uvicorn logging
    )