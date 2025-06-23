"""
GiftSync Backend Configuration

Centralised configuration management for the GiftSync API backend.
Handles environment variables, feature flags, and application settings
for all backend services including authentication, recommendations,
affiliate tracking, and external integrations.

Key Features:
  - Environment-based configuration with validation
  - Feature flags for controlled rollouts
  - External service integration (AWS, Supabase, Analytics)
  - Security settings with production defaults
  - Comprehensive business logic configuration

Configuration Sources:
  - Environment variables (.env file)
  - Default values for development
  - Runtime overrides for testing

Security:
  - All sensitive data loaded from environment variables
  - No secrets committed to code
  - Production-ready defaults

Usage:
  from app.core.config import settings
  
  # Access configuration
  api_url = settings.DATABASE_URL
  debug_mode = settings.DEBUG
  
  # Feature flags
  if settings.ENABLE_ML_RECOMMENDATIONS:
      generate_recommendations()
"""

import os
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application configuration with environment variable validation.
    
    Centralises all backend configuration including:
      - Core application settings (name, version, environment)
      - Security configuration (JWT, CORS, rate limiting)
      - Database and cache configuration
      - External service integration (AWS, Supabase, analytics)
      - Feature flags for controlled feature rollouts
      - Business logic constants
    
    Environment Variables:
      - All settings can be overridden via environment variables
      - Uses Pydantic validation for type safety
      - Supports .env file for development
    
    Validation:
      - Type checking for all configuration values
      - Custom validators for complex formats
      - Required fields validated at startup
    """
    # ===========================================================================
    # PROJECT CONFIGURATION
    # ===========================================================================
    # Core application metadata and environment settings
    
    PROJECT_NAME: str = "GiftSync API"           # Application name for logging/docs
    VERSION: str = "1.0.0"                       # API version for client compatibility
    ENVIRONMENT: str = "development"              # Runtime environment (dev/staging/prod)
    DEBUG: bool = True                            # Debug mode (disable in production)
    
    # ===========================================================================
    # SERVER CONFIGURATION
    # ===========================================================================
    # HTTP server settings for FastAPI application
    
    HOST: str = "0.0.0.0"                        # Bind address (0.0.0.0 = all interfaces)
    PORT: int = 8000                              # HTTP port for API server
    WORKERS: int = 1                              # Gunicorn worker processes (scale for production)
    
    # ===========================================================================
    # SECURITY CONFIGURATION
    # ===========================================================================
    # JWT authentication and cryptographic settings
    
    SECRET_KEY: str = "your-secret-key-change-in-production"  # JWT signing secret (MUST change in production)
    ALGORITHM: str = "HS256"                      # JWT algorithm (HMAC SHA-256)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30         # Access token lifetime (30 minutes)
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30           # Refresh token lifetime (30 days)
    
    # ===========================================================================
    # CORS CONFIGURATION
    # ===========================================================================
    # Cross-Origin Resource Sharing settings
    
    ALLOWED_HOSTS: List[str] = ["*"]              # Allowed origins (restrict in production)
    
    # ===========================================================================
    # DATABASE CONFIGURATION
    # ===========================================================================
    # PostgreSQL connection settings and pool configuration
    
    DATABASE_URL: str = "postgresql://giftsync:giftsync_dev_password@localhost:5432/giftsync_dev"  # Full connection string
    DATABASE_POOL_SIZE: int = 10                  # Connection pool base size
    DATABASE_MAX_OVERFLOW: int = 20               # Maximum additional connections
    
    # ===========================================================================
    # USER REGISTRATION
    # ===========================================================================
    # User account creation settings
    
    ENABLE_REGISTRATION: bool = True              # Allow new user registration
    
    # ===========================================================================
    # REDIS CACHE CONFIGURATION
    # ===========================================================================
    # Redis caching and session storage settings
    
    REDIS_URL: str = "redis://localhost:6379"     # Redis connection string
    REDIS_CACHE_TTL: int = 3600                   # Default cache TTL (1 hour)
    
    # ===========================================================================
    # AWS CONFIGURATION
    # ===========================================================================
    # Amazon Web Services integration settings
    
    AWS_REGION: str = "eu-west-2"                 # AWS region (London for UK business)
    AWS_ACCESS_KEY_ID: Optional[str] = None       # AWS access key (from environment)
    AWS_SECRET_ACCESS_KEY: Optional[str] = None   # AWS secret key (from environment)
    AWS_ENDPOINT_URL: Optional[str] = None        # Custom endpoint (for LocalStack testing)
    
    # ===========================================================================
    # S3 STORAGE CONFIGURATION
    # ===========================================================================
    # Amazon S3 file storage settings
    
    S3_BUCKET_NAME: str = "giftsync-assets"       # S3 bucket for file uploads
    S3_BUCKET_REGION: str = "eu-west-2"           # S3 bucket region
    
    # ===========================================================================
    # DYNAMODB CONFIGURATION
    # ===========================================================================
    # Amazon DynamoDB NoSQL database settings
    
    DYNAMODB_TABLE_PREFIX: str = "giftsync"       # Table name prefix for multi-environment
    
    # ===========================================================================
    # SAGEMAKER ML CONFIGURATION
    # ===========================================================================
    # Amazon SageMaker machine learning model settings
    
    SAGEMAKER_ENDPOINT_NAME: str = "giftsync-recommendations"  # ML model endpoint for recommendations
    
    # ===========================================================================
    # MACHINE LEARNING CONFIGURATION
    # ===========================================================================
    # Local ML model and recommendation engine settings
    
    ML_MODEL_PATH: str = "./models"               # Local model storage directory
    ML_BATCH_SIZE: int = 32                       # Batch size for ML inference
    ML_UPDATE_INTERVAL_MINUTES: int = 5           # Model update frequency
    
    # ===========================================================================
    # ANALYTICS CONFIGURATION
    # ===========================================================================
    # User behavior tracking and analytics integration
    
    MIXPANEL_TOKEN: Optional[str] = None          # Mixpanel analytics token
    GOOGLE_ANALYTICS_ID: Optional[str] = None     # Google Analytics tracking ID
    
    # ===========================================================================
    # EMAIL CONFIGURATION
    # ===========================================================================
    # SMTP email service settings for notifications
    
    SMTP_HOST: Optional[str] = None               # SMTP server hostname
    SMTP_PORT: int = 587                          # SMTP server port (587 for TLS)
    SMTP_USERNAME: Optional[str] = None           # SMTP authentication username
    SMTP_PASSWORD: Optional[str] = None           # SMTP authentication password
    SMTP_USE_TLS: bool = True                     # Enable TLS encryption
    
    # ===========================================================================
    # EXTERNAL API CONFIGURATION
    # ===========================================================================
    # Third-party service integration settings
    
    AMAZON_ASSOCIATE_TAG: Optional[str] = None    # Amazon Associates affiliate tag (giftsync-21)
    AMAZON_ACCESS_KEY: Optional[str] = None       # Amazon Product Advertising API key
    AMAZON_SECRET_KEY: Optional[str] = None       # Amazon Product Advertising API secret
    
    # ===========================================================================
    # RATE LIMITING CONFIGURATION
    # ===========================================================================
    # API request rate limiting for abuse protection
    
    RATE_LIMIT_PER_MINUTE: int = 60               # Requests per minute per user
    RATE_LIMIT_BURST: int = 100                   # Burst allowance for sudden traffic
    
    # ===========================================================================
    # MONITORING CONFIGURATION
    # ===========================================================================
    # Error tracking and performance monitoring
    
    SENTRY_DSN: Optional[str] = None              # Sentry error tracking DSN
    PROMETHEUS_ENABLED: bool = True               # Enable Prometheus metrics
    
    # ===========================================================================
    # SUPABASE CONFIGURATION
    # ===========================================================================
    # Supabase backend-as-a-service integration
    
    SUPABASE_URL: Optional[str] = None            # Supabase project URL
    SUPABASE_ANON_KEY: Optional[str] = None       # Supabase anonymous access key
    SUPABASE_SERVICE_KEY: Optional[str] = None    # Supabase service role key (full access)
    
    # ===========================================================================
    # FEATURE FLAGS
    # ===========================================================================
    # Feature toggles for controlled rollouts and A/B testing
    
    ENABLE_REGISTRATION: bool = True              # Allow new user registration
    ENABLE_SOCIAL_LOGIN: bool = True              # Enable OAuth social login
    ENABLE_ML_RECOMMENDATIONS: bool = True        # Enable AI-powered recommendations
    ENABLE_AFFILIATE_TRACKING: bool = True        # Enable affiliate revenue tracking
    
    # ===========================================================================
    # BUSINESS LOGIC CONFIGURATION
    # ===========================================================================
    # Application-specific business rules and limits
    
    MAX_RECOMMENDATIONS_PER_USER: int = 50        # Maximum recommendations to generate per user
    MAX_SWIPES_PER_SESSION: int = 50              # Maximum swipes allowed per session
    COMMISSION_RATE_DEFAULT: float = 0.075        # Default affiliate commission rate (7.5%)
    
    # ===========================================================================
    # FILE UPLOAD CONFIGURATION
    # ===========================================================================
    # File upload restrictions and validation
    
    MAX_FILE_SIZE_MB: int = 10                    # Maximum file size in megabytes
    ALLOWED_FILE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]  # Permitted MIME types
    
    # ===========================================================================
    # CONFIGURATION VALIDATORS
    # ===========================================================================
    # Custom validation logic for complex configuration values
    
    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def parse_allowed_hosts(cls, v):
        """
        Parse ALLOWED_HOSTS from comma-separated string or list.
        
        Supports both environment variable format ("host1,host2,host3")
        and direct list format for programmatic configuration.
        
        Parameters:
            v: Input value (string or list)
        
        Returns:
            List[str]: Parsed list of allowed hosts
        """
        if isinstance(v, str):
            return [host.strip() for host in v.split(",")]  # Split and trim whitespace
        return v
    
    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, v):
        """
        Parse DEBUG flag from various string formats.
        
        Supports multiple common boolean representations from
        environment variables for developer convenience.
        
        Accepted True Values: "true", "1", "yes", "on" (case-insensitive)
        All other string values are treated as False.
        
        Parameters:
            v: Input value (string or boolean)
        
        Returns:
            bool: Parsed boolean value
        """
        if isinstance(v, str):
            return v.lower() in ("true", "1", "yes", "on")  # Common truthy strings
        return v
    
    # Pydantic model configuration
    model_config = {
        "env_file": ".env",            # Load environment variables from .env file
        "case_sensitive": True         # Environment variable names must match exactly
    }


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached application settings instance.
    
    Uses LRU cache to ensure settings are loaded only once during
    application startup. This improves performance and ensures
    consistent configuration throughout the application lifecycle.
    
    Caching Benefits:
      - Single settings instance per application run
      - Prevents repeated environment variable parsing
      - Consistent configuration across all modules
    
    Returns:
        Settings: Validated configuration instance
    
    Usage:
        settings = get_settings()
        database_url = settings.DATABASE_URL
    """
    return Settings()


# ==============================================================================
# GLOBAL CONFIGURATION INSTANCE
# ==============================================================================
# Application-wide settings instance for dependency injection

# Global cached settings instance
# Used throughout the application for configuration access
settings = get_settings()

# Export configuration for easy importing
__all__ = ['Settings', 'get_settings', 'settings']