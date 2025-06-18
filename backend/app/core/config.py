import os
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Project
    PROJECT_NAME: str = "GiftSync API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: str = "postgresql://giftsync:giftsync_dev_password@localhost:5432/giftsync_dev"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 30
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_CACHE_TTL: int = 3600  # 1 hour
    
    # AWS
    AWS_REGION: str = "eu-west-2"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_ENDPOINT_URL: Optional[str] = None  # For LocalStack
    
    # S3
    S3_BUCKET_NAME: str = "giftsync-assets"
    S3_BUCKET_REGION: str = "eu-west-2"
    
    # DynamoDB
    DYNAMODB_TABLE_PREFIX: str = "giftsync"
    
    # SageMaker
    SAGEMAKER_ENDPOINT_NAME: str = "giftsync-recommendations"
    
    # Machine Learning
    ML_MODEL_PATH: str = "./models"
    ML_BATCH_SIZE: int = 32
    ML_UPDATE_INTERVAL_MINUTES: int = 5
    
    # Analytics
    MIXPANEL_TOKEN: Optional[str] = None
    GOOGLE_ANALYTICS_ID: Optional[str] = None
    
    # Email
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_USE_TLS: bool = True
    
    # External APIs
    AMAZON_ASSOCIATE_TAG: Optional[str] = None
    AMAZON_ACCESS_KEY: Optional[str] = None
    AMAZON_SECRET_KEY: Optional[str] = None
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_BURST: int = 100
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    PROMETHEUS_ENABLED: bool = True
    
    # Supabase
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None
    
    # Feature Flags
    ENABLE_REGISTRATION: bool = True
    ENABLE_SOCIAL_LOGIN: bool = True
    ENABLE_ML_RECOMMENDATIONS: bool = True
    ENABLE_AFFILIATE_TRACKING: bool = True
    
    # Business Logic
    MAX_RECOMMENDATIONS_PER_USER: int = 50
    MAX_SWIPES_PER_SESSION: int = 50
    COMMISSION_RATE_DEFAULT: float = 0.075
    
    # File Upload
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_FILE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    
    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def parse_allowed_hosts(cls, v):
        if isinstance(v, str):
            return [host.strip() for host in v.split(",")]
        return v
    
    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, v):
        if isinstance(v, str):
            return v.lower() in ("true", "1", "yes", "on")
        return v
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()