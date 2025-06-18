"""
Pydantic models for GiftSync API
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum

class SubscriptionTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

class SwipeDirection(str, Enum):
    LEFT = "left"
    RIGHT = "right"
    UP = "up"
    DOWN = "down"

# Category models
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    parent_id: Optional[str] = None
    sort_order: int = 0

class Category(CategoryBase):
    id: str
    is_active: bool = True
    created_at: datetime

# Product models
class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    currency: str = "USD"
    brand: Optional[str] = None
    image_url: Optional[str] = None
    affiliate_url: Optional[str] = None
    affiliate_network: Optional[str] = None
    commission_rate: Optional[float] = None
    category_id: Optional[str] = None
    tags: List[str] = []
    features: Dict[str, Any] = {}
    rating: Optional[float] = None
    review_count: int = 0
    availability_status: str = "available"

class Product(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

# User models
class UserBase(BaseModel):
    email: str
    username: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    location_country: Optional[str] = None
    location_city: Optional[str] = None
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE
    preferences: Dict[str, Any] = {}

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None
    is_active: bool = True
    email_verified: bool = False
    gdpr_consent: bool = False
    gdpr_consent_date: Optional[datetime] = None

class UserCreate(UserBase):
    pass

# Swipe session models
class SwipeSessionBase(BaseModel):
    session_type: str = "discovery"
    occasion: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    recipient_age_range: Optional[str] = None
    recipient_gender: Optional[str] = None
    recipient_relationship: Optional[str] = None
    preferences_data: Dict[str, Any] = {}

class SwipeSession(SwipeSessionBase):
    id: str
    user_id: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    total_swipes: int = 0
    is_completed: bool = False

class SwipeSessionCreate(SwipeSessionBase):
    user_id: str

# Swipe interaction models
class SwipeInteractionBase(BaseModel):
    swipe_direction: SwipeDirection
    product_id: Optional[str] = None
    category_id: Optional[str] = None
    time_spent_seconds: Optional[int] = None
    interaction_context: Dict[str, Any] = {}
    preference_strength: float = 0.5

class SwipeInteraction(SwipeInteractionBase):
    id: str
    session_id: str
    user_id: str
    swipe_timestamp: datetime

class SwipeInteractionCreate(SwipeInteractionBase):
    session_id: str
    user_id: str

# Recommendation models
class RecommendationBase(BaseModel):
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    algorithm_version: Optional[str] = None
    reasoning: Optional[str] = None
    rank_position: Optional[int] = None

class Recommendation(RecommendationBase):
    id: str
    user_id: str
    product_id: str
    session_id: Optional[str] = None
    created_at: datetime
    expires_at: Optional[datetime] = None
    is_clicked: bool = False
    clicked_at: Optional[datetime] = None
    is_purchased: bool = False
    purchased_at: Optional[datetime] = None

class RecommendationCreate(RecommendationBase):
    user_id: str
    product_id: str
    session_id: Optional[str] = None

# Gift link models
class GiftLinkBase(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    recipient_name: Optional[str] = None
    occasion: Optional[str] = None
    expires_at: Optional[datetime] = None

class GiftLink(GiftLinkBase):
    id: str
    user_id: str
    session_id: Optional[str] = None
    link_token: str
    qr_code_url: Optional[str] = None
    created_at: datetime
    is_active: bool = True
    view_count: int = 0
    share_count: int = 0

class GiftLinkCreate(GiftLinkBase):
    user_id: str
    session_id: Optional[str] = None

# Response models
class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str

class PaginatedResponse(BaseModel):
    data: List[Any]
    total: int
    page: int
    limit: int
    has_next: bool

# API Error responses
class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None