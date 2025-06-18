from sqlalchemy import Column, String, DateTime, Boolean, Text, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class UserGender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    NON_BINARY = "non_binary"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    PLUS = "plus"
    PRO = "pro"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone_number = Column(String(20), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile information
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(DateTime, nullable=True)
    gender = Column(Enum(UserGender), nullable=True)
    
    # Location (stored as JSON for flexibility)
    location = Column(JSON, nullable=True)  # {country, region, city, lat, lng}
    
    # User preferences and settings
    preferences = Column(JSON, nullable=True)  # User-defined preferences
    privacy_settings = Column(JSON, nullable=True)  # Privacy configuration
    notification_settings = Column(JSON, nullable=True)  # Notification preferences
    
    # Account status
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)
    phone_verified = Column(Boolean, default=False, nullable=False)
    
    # Subscription
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE, nullable=False)
    subscription_expires_at = Column(DateTime, nullable=True)
    
    # Authentication
    last_login_at = Column(DateTime, nullable=True)
    password_reset_token = Column(String(255), nullable=True)
    password_reset_expires_at = Column(DateTime, nullable=True)
    email_verification_token = Column(String(255), nullable=True)
    
    # Analytics
    referral_code = Column(String(50), unique=True, nullable=True)
    referred_by = Column(UUID(as_uuid=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime, nullable=True)  # Soft delete
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_premium(self):
        return self.subscription_tier in [SubscriptionTier.PLUS, SubscriptionTier.PRO]
    
    def to_dict(self):
        """Convert user to dictionary (excluding sensitive data)."""
        return {
            "id": str(self.id),
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": self.full_name,
            "gender": self.gender.value if self.gender else None,
            "location": self.location,
            "subscription_tier": self.subscription_tier.value,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }