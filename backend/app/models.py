"""
GiftSync API Data Models

This module defines all Pydantic models used throughout the GiftSync application.
These models serve as the primary data validation and serialisation layer between
the API endpoints and the database, ensuring type safety and data integrity.

The models follow a consistent pattern:
- Base models define shared fields and validation rules
- Full models extend base models with database-specific fields (id, timestamps)
- Create models define fields required for resource creation
- Response models define the structure of API responses

Type Safety:
- All models use Python type hints and Pydantic validation
- Enums ensure controlled vocabularies for status fields
- Field constraints prevent invalid data (e.g., confidence scores 0.0-1.0)
- Optional fields use Union types for flexibility

Usage:
- Import specific models in API endpoints: `from app.models import UserCreate`
- Use for request/response validation: `@app.post("/users", response_model=User)`
- Leverage for data transformation: `user_data = UserCreate(**request_data)`
"""
# ==============================================================================
# IMPORTS AND DEPENDENCIES
# ==============================================================================
# Standard library imports for type safety and data validation

from typing import Optional, List, Dict, Any  # Type hints for better IDE support and runtime validation
from datetime import datetime                  # Timestamp handling for database fields
from pydantic import BaseModel, Field         # Data validation and serialisation framework
from enum import Enum                         # Controlled vocabularies for status fields

# ==============================================================================
# ENUMERATION TYPES
# ==============================================================================
# Controlled vocabularies for consistent data values across the application

class SubscriptionTier(str, Enum):
    """
    User subscription tier enumeration.
    
    Defines the available subscription levels with associated features:
    - FREE: Basic features, limited swipes (10/day), basic recommendations
    - PREMIUM: Enhanced features, unlimited swipes, advanced analytics
    - ENTERPRISE: Full feature set, priority support, custom integrations
    
    Used in User model for access control and feature gating.
    """
    FREE = "free"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

class SwipeDirection(str, Enum):
    """
    Swipe gesture direction enumeration.
    
    Defines the possible swipe directions and their semantic meaning:
    - LEFT: Dislike/reject (negative preference signal)
    - RIGHT: Like/accept (positive preference signal)
    - UP: Super like/bookmark (strong positive signal)
    - DOWN: Skip/neutral (no preference signal, used for complex products)
    
    These values are captured in SwipeInteraction models for ML training
    and preference analysis algorithms.
    """
    LEFT = "left"
    RIGHT = "right"
    UP = "up"
    DOWN = "down"

# ==============================================================================
# CATEGORY MODELS
# ==============================================================================
# Categories represent hierarchical product classifications (e.g., Electronics > Phones)
# Used for product organisation, filtering, and preference-based recommendations
class CategoryBase(BaseModel):
    """
    Base category model containing all user-modifiable fields.
    
    Categories form a hierarchical tree structure where each category can have:
    - A parent category (parent_id)
    - Multiple child categories
    - Associated products
    
    Fields:
        name: Human-readable category name (e.g., "Smartphones")
        slug: URL-friendly identifier (e.g., "smartphones")
        description: Optional detailed description for category
        icon_url: Optional icon for UI display
        parent_id: Optional parent category for hierarchy
        sort_order: Display order within parent category (0 = first)
    
    Validation:
        - name: Required, max 100 characters
        - slug: Required, lowercase, alphanumeric + hyphens only
        - parent_id: Must reference existing category if provided
    """
    name: str
    slug: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    parent_id: Optional[str] = None
    sort_order: int = 0

class Category(CategoryBase):
    """
    Complete category model with database fields.
    
    Extends CategoryBase with system-managed fields populated by the database.
    Used for API responses and internal category operations.
    
    Additional Fields:
        id: Unique category identifier (UUID)
        is_active: Soft delete flag (False = hidden from users)
        created_at: Category creation timestamp
    
    Usage:
        - API responses: GET /api/v1/categories/
        - Internal lookups: Category.objects.get(id=category_id)
        - Hierarchy traversal: Category.objects.filter(parent_id=category.id)
    """
    id: str
    is_active: bool = True
    created_at: datetime

# ==============================================================================
# PRODUCT MODELS
# ==============================================================================
# Products represent individual gift items that users can swipe on and receive recommendations for
# Integrated with affiliate networks for revenue generation
class ProductBase(BaseModel):
    """
    Base product model containing all user-modifiable fields.
    
    Products are the core entities in the GiftSync recommendation system.
    Each product contains comprehensive metadata for ML algorithms and user display.
    
    Price Structure:
        - price_min/price_max: Support price ranges (e.g., £10-25 for size variants)
        - currency: ISO currency code (GBP, USD, EUR)
        - Prices stored in lowest denomination (pence, cents)
    
    Affiliate Integration:
        - affiliate_url: Direct purchase link with tracking parameters
        - affiliate_network: Partner network ("amazon", "commission_junction")
        - commission_rate: Expected commission percentage (0.0-1.0)
    
    ML Features:
        - tags: Searchable keywords for content-based filtering
        - features: Structured attributes (colour, size, material) for similarity
        - rating/review_count: Social proof signals for popularity algorithms
    
    Fields:
        title: Product name/title (required)
        description: Detailed product description
        price_min: Minimum price (for variants)
        price_max: Maximum price (for variants)
        currency: ISO currency code (default: USD)
        brand: Product brand/manufacturer
        image_url: Primary product image URL
        affiliate_url: Purchase link with affiliate tracking
        affiliate_network: Partner network identifier
        commission_rate: Expected commission (0.0-1.0)
        category_id: Associated category UUID
        tags: Searchable keyword list
        features: Structured product attributes
        rating: Average user rating (1.0-5.0)
        review_count: Number of reviews/ratings
        availability_status: Stock status ("available", "limited", "out_of_stock")
    """
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
    """
    Complete product model with database fields.
    
    Extends ProductBase with system-managed fields for database operations.
    Used in API responses and recommendation algorithms.
    
    Additional Fields:
        id: Unique product identifier (UUID)
        created_at: Product creation timestamp
        updated_at: Last modification timestamp
        is_active: Soft delete flag (False = hidden from users)
    
    Usage:
        - Swipe interface: Display products for user preference collection
        - Recommendations: Return personalised product suggestions
        - Search results: Filter and paginate product listings
        - Analytics: Track user interactions and conversion rates
    """
    id: str
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

class ProductCreate(ProductBase):
    """
    Product creation model for API requests.
    
    Inherits all fields from ProductBase without system-managed fields.
    Used when creating new products via admin endpoints.
    
    Validation:
        - title: Required, 1-200 characters
        - price_min/max: Must be positive if provided
        - commission_rate: Must be 0.0-1.0 if provided
        - category_id: Must reference existing category if provided
        - affiliate_url: Must be valid URL if provided
    
    Usage:
        POST /api/v1/products/
        Content-Type: application/json
        {
            "title": "Wireless Headphones",
            "price_min": 5999,  // £59.99 in pence
            "currency": "GBP",
            "category_id": "uuid-electronics",
            "affiliate_url": "https://amazon.co.uk/dp/B123?tag=giftsync-21"
        }
    """
    pass

# ==============================================================================
# USER MODELS
# ==============================================================================
# Users represent registered individuals who interact with the GiftSync platform
# Includes authentication, preferences, and subscription management
class UserBase(BaseModel):
    """
    Base user model containing all user-modifiable profile fields.
    
    Users are the central entity in the GiftSync platform, storing both
    authentication credentials and personalisation data for recommendations.
    
    Privacy & GDPR:
        - email: Required for authentication and communication
        - username: Optional display name (can be pseudonymous)
        - location: Used for localised recommendations (optional)
        - date_of_birth: Age-appropriate filtering (optional)
        - All personal data can be exported/deleted per GDPR requirements
    
    Personalisation:
        - preferences: JSON object storing user settings and ML features
        - subscription_tier: Controls feature access and usage limits
        - avatar_url: Profile image for social features
    
    Fields:
        email: Unique email address (authentication + notifications)
        username: Optional display name (public in social features)
        full_name: User's real name (private, used in gift links)
        avatar_url: Profile image URL
        date_of_birth: Birth date for age-appropriate filtering
        gender: Gender preference for targeted recommendations
        location_country: Country code (GB, US) for localisation
        location_city: City name for local business recommendations
        subscription_tier: Feature access level (FREE/PREMIUM/ENTERPRISE)
        preferences: Flexible JSON for user settings and ML features
    
    Preferences Structure:
        {
            "budget_range": {"min": 1000, "max": 5000},  // Budget in pence
            "favourite_categories": ["electronics", "books"],
            "excluded_brands": ["brand-a", "brand-b"],
            "gift_occasions": ["birthday", "christmas"],
            "style_preferences": {"modern": 0.8, "vintage": 0.2}
        }
    """
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
    """
    Complete user model with authentication and system fields.
    
    Extends UserBase with database-managed fields for authentication,
    compliance, and system administration.
    
    Authentication:
        - id: Unique user identifier (used in JWT tokens)
        - email_verified: Email verification status (required for full access)
        - last_login_at: Session tracking for security
    
    Compliance:
        - gdpr_consent: Required for EU users (GDPR Article 6)
        - gdpr_consent_date: Audit trail for consent management
        - is_active: Account status (False = suspended/deleted)
    
    Additional Fields:
        id: Unique user identifier (UUID)
        created_at: Account creation timestamp
        updated_at: Last profile modification timestamp
        last_login_at: Most recent login timestamp
        is_active: Account status flag
        email_verified: Email verification status
        gdpr_consent: GDPR consent flag (EU compliance)
        gdpr_consent_date: Consent timestamp for audit trail
    
    Usage:
        - JWT token subject: User.id encoded in access tokens
        - API responses: GET /api/v1/auth/me
        - Recommendation targeting: User.preferences for ML algorithms
        - Analytics: User.created_at for cohort analysis
    """
    id: str
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None
    is_active: bool = True
    email_verified: bool = False
    gdpr_consent: bool = False
    gdpr_consent_date: Optional[datetime] = None

class UserCreate(UserBase):
    """
    User creation model for registration API.
    
    Inherits all fields from UserBase without system-managed fields.
    Used for user registration endpoint with additional validation.
    
    Registration Flow:
        1. Validate email uniqueness
        2. Hash password with bcrypt
        3. Create user record with default preferences
        4. Send email verification (if enabled)
        5. Return JWT tokens for immediate access
    
    Validation:
        - email: Must be valid email format and unique
        - username: Optional, unique if provided
        - date_of_birth: Must be 13+ years old (COPPA compliance)
        - subscription_tier: Defaults to FREE
    
    Usage:
        POST /api/v1/auth/register
        Content-Type: application/json
        {
            "email": "user@example.com",
            "full_name": "John Smith",
            "date_of_birth": "1990-01-01",
            "location_country": "GB"
        }
    """
    pass

# ==============================================================================
# SWIPE SESSION MODELS
# ==============================================================================
# Swipe sessions represent individual product discovery/preference collection sessions
# Each session contains multiple swipe interactions for ML training

class SwipeSessionBase(BaseModel):
    """
    Base swipe session model for preference collection contexts.
    
    Swipe sessions group related product interactions for specific use cases:
    - Onboarding: Initial preference discovery for new users
    - Discovery: General product exploration
    - Gift Selection: Targeted gift finding for specific occasions
    
    Context Data:
        - Sessions capture intent (occasion, budget, recipient)
        - Used to filter products and personalise recommendations
        - Enables session-specific analytics and conversion tracking
    
    Session Types:
        - "discovery": General product exploration
        - "onboarding": Initial user preference collection
        - "gift_selection": Specific gift-finding session
        - "category_exploration": Deep-dive into specific category
    
    Fields:
        session_type: Session purpose (discovery, onboarding, gift_selection)
        occasion: Gift occasion context ("birthday", "christmas", "anniversary")
        budget_min: Minimum budget constraint (in pence/cents)
        budget_max: Maximum budget constraint (in pence/cents)
        recipient_age_range: Target age group ("18-25", "26-35", "36-50", "50+")
        recipient_gender: Target gender ("male", "female", "unisex")
        recipient_relationship: Relationship to recipient ("partner", "friend", "family")
        preferences_data: Additional session context and filters
    
    Preferences Data Structure:
        {
            "excluded_categories": ["adult", "dangerous"],
            "preferred_brands": ["apple", "nike"],
            "style_preferences": {"modern": 0.8, "vintage": 0.2},
            "urgency": "next_week",
            "wrapping_required": true
        }
    """
    session_type: str = "discovery"
    occasion: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    recipient_age_range: Optional[str] = None
    recipient_gender: Optional[str] = None
    recipient_relationship: Optional[str] = None
    preferences_data: Dict[str, Any] = {}

class SwipeSession(SwipeSessionBase):
    """
    Complete swipe session model with tracking fields.
    
    Extends SwipeSessionBase with system-managed fields for session tracking,
    analytics, and recommendation generation.
    
    Session Lifecycle:
        1. Created when user starts swiping
        2. Updated with each swipe interaction
        3. Marked completed when user finishes or reaches limit
        4. Used to generate personalised recommendations
    
    Analytics:
        - total_swipes: Session engagement metric
        - Duration: completed_at - started_at for session length
        - Completion rate: is_completed for funnel analysis
    
    Additional Fields:
        id: Unique session identifier (UUID)
        user_id: Associated user UUID
        started_at: Session start timestamp
        completed_at: Session completion timestamp (null if ongoing)
        total_swipes: Number of swipe interactions in session
        is_completed: Session completion status
    
    Usage:
        - Track user engagement: Session duration and swipe count
        - Generate recommendations: Use session context and interactions
        - Analytics: Conversion funnels and user behaviour patterns
        - Resume sessions: Allow users to continue incomplete sessions
    """
    id: str
    user_id: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    total_swipes: int = 0
    is_completed: bool = False

class SwipeSessionCreate(SwipeSessionBase):
    """
    Swipe session creation model for API requests.
    
    Used when starting a new swipe session, inheriting context fields
    from SwipeSessionBase with required user association.
    
    API Flow:
        1. POST /api/v1/swipes/sessions with session context
        2. System creates session and returns session ID
        3. Frontend uses session ID for subsequent swipe interactions
        4. Session tracks all interactions until marked complete
    
    Required Fields:
        user_id: Associated user UUID (from JWT token)
    
    Usage:
        POST /api/v1/swipes/sessions
        Content-Type: application/json
        {
            "session_type": "gift_selection",
            "occasion": "birthday",
            "budget_min": 2000,  // £20.00
            "budget_max": 5000,  // £50.00
            "recipient_gender": "female",
            "user_id": "uuid-from-token"
        }
    """
    user_id: str

# ==============================================================================
# SWIPE INTERACTION MODELS
# ==============================================================================
# Individual swipe gestures within sessions, core data for ML recommendation algorithms
# Each interaction represents a preference signal for machine learning

class SwipeInteractionBase(BaseModel):
    """
    Base swipe interaction model for individual preference signals.
    
    Swipe interactions are the atomic units of user preference data.
    Each interaction captures a user's reaction to a specific product,
    providing training data for recommendation algorithms.
    
    Preference Signal Interpretation:
        - RIGHT (like): Strong positive signal (weight: +1.0)
        - LEFT (dislike): Strong negative signal (weight: -1.0)
        - UP (super_like): Very strong positive signal (weight: +1.5)
        - DOWN (skip): Neutral signal (weight: 0.0)
    
    ML Features:
        - swipe_direction: Primary preference signal
        - time_spent_seconds: Engagement indicator (longer = more considered)
        - preference_strength: Calculated confidence score (0.0-1.0)
        - interaction_context: Additional signals (scroll depth, zoom, etc.)
    
    Content Association:
        - product_id: Specific product being evaluated
        - category_id: Category-level preference (for broad signals)
        - One of product_id or category_id must be provided
    
    Fields:
        swipe_direction: User gesture (LEFT/RIGHT/UP/DOWN)
        product_id: UUID of specific product (optional)
        category_id: UUID of category for broad preferences (optional)
        time_spent_seconds: Time viewing product before swipe
        interaction_context: Additional interaction metadata
        preference_strength: Calculated preference confidence (0.0-1.0)
    
    Interaction Context Structure:
        {
            "viewport_size": {"width": 1920, "height": 1080},
            "scroll_depth": 0.75,  // How much of product details viewed
            "zoom_interactions": 3,  // Number of image zoom actions
            "comparison_products": ["uuid1", "uuid2"],  // Previously viewed
            "session_position": 15  // Position in session (fatigue factor)
        }
    """
    swipe_direction: SwipeDirection
    product_id: Optional[str] = None
    category_id: Optional[str] = None
    time_spent_seconds: Optional[int] = None
    interaction_context: Dict[str, Any] = {}
    preference_strength: float = 0.5

class SwipeInteraction(SwipeInteractionBase):
    """
    Complete swipe interaction model with tracking fields.
    
    Extends SwipeInteractionBase with system-managed fields for data integrity,
    analytics, and ML model training pipelines.
    
    Data Pipeline:
        1. Captured in real-time during user sessions
        2. Stored with full context for ML feature engineering
        3. Aggregated for user preference profiles
        4. Used to train collaborative filtering models
    
    Analytics Applications:
        - User engagement: Time spent, interaction patterns
        - Product performance: Like/dislike ratios by product
        - Category preferences: Aggregate signals by category
        - Temporal patterns: Time-of-day and seasonal preferences
    
    Additional Fields:
        id: Unique interaction identifier (UUID)
        session_id: Parent session UUID
        user_id: User UUID (denormalised for query performance)
        swipe_timestamp: Exact interaction time (UTC)
    
    Usage:
        - ML training: Feature engineering for recommendation models
        - Analytics: User behaviour analysis and product performance
        - Real-time updates: Immediate preference profile updates
        - Audit trail: Complete interaction history for debugging
    """
    id: str
    session_id: str
    user_id: str
    swipe_timestamp: datetime

class SwipeInteractionCreate(SwipeInteractionBase):
    """
    Swipe interaction creation model for real-time API requests.
    
    Used when recording individual swipe gestures during active sessions.
    Inherits preference fields from SwipeInteractionBase with required associations.
    
    Real-time Flow:
        1. User swipes on product in frontend
        2. POST /api/v1/swipes/interactions with interaction data
        3. Backend records interaction and updates session counters
        4. Preference profiles updated for immediate recommendation impact
    
    Required Fields:
        session_id: Active session UUID
        user_id: User UUID (from JWT token)
    
    Usage:
        POST /api/v1/swipes/interactions
        Content-Type: application/json
        {
            "swipe_direction": "right",
            "product_id": "uuid-wireless-headphones",
            "time_spent_seconds": 12,
            "preference_strength": 0.8,
            "session_id": "uuid-session",
            "user_id": "uuid-user",
            "interaction_context": {
                "scroll_depth": 0.9,
                "session_position": 8
            }
        }
    """
    session_id: str
    user_id: str

# ==============================================================================
# RECOMMENDATION MODELS
# ==============================================================================
# AI-generated product recommendations based on user preferences and ML algorithms
# Core output of the GiftSync recommendation engine

class RecommendationBase(BaseModel):
    """
    Base recommendation model for AI-generated product suggestions.
    
    Recommendations are the primary output of the GiftSync ML system,
    combining user preferences, product features, and collaborative signals
    to suggest relevant products.
    
    Algorithm Confidence:
        - confidence_score: ML model confidence (0.0-1.0)
        - Higher scores indicate stronger algorithmic certainty
        - Used for ranking and filtering low-quality suggestions
    
    Explainability:
        - reasoning: Human-readable explanation for recommendation
        - algorithm_version: Model version for A/B testing and debugging
        - rank_position: Position in recommendation list
    
    Confidence Score Interpretation:
        - 0.9-1.0: Very high confidence (strong user-product match)
        - 0.7-0.9: High confidence (good match with some uncertainty)
        - 0.5-0.7: Medium confidence (reasonable match)
        - 0.3-0.5: Low confidence (weak signals, fallback recommendations)
        - 0.0-0.3: Very low confidence (random/popularity-based)
    
    Fields:
        confidence_score: ML algorithm confidence (0.0-1.0, required)
        algorithm_version: Model version identifier ("v1.2.3")
        reasoning: Explanation text for user ("Based on your likes in Electronics")
        rank_position: Position in sorted recommendation list (1-based)
    
    Reasoning Examples:
        - "Based on your likes in Electronics and Gaming categories"
        - "Similar to products you liked, especially wireless features"
        - "Popular choice for your age group and budget range"
        - "Trending item in your favourite brands"
    """
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    algorithm_version: Optional[str] = None
    reasoning: Optional[str] = None
    rank_position: Optional[int] = None

class Recommendation(RecommendationBase):
    """
    Complete recommendation model with tracking and conversion fields.
    
    Extends RecommendationBase with system-managed fields for analytics,
    performance tracking, and revenue attribution.
    
    Lifecycle Tracking:
        - created_at: Recommendation generation time
        - expires_at: Recommendation freshness limit
        - is_clicked: User engagement tracking
        - is_purchased: Conversion tracking for revenue attribution
    
    Session Association:
        - session_id: Optional link to generating swipe session
        - Enables session-based recommendation performance analysis
    
    Analytics Applications:
        - Click-through rate: is_clicked / total_recommendations
        - Conversion rate: is_purchased / is_clicked
        - Revenue attribution: Commission from purchased recommendations
        - Algorithm performance: Accuracy by algorithm_version
    
    Additional Fields:
        id: Unique recommendation identifier (UUID)
        user_id: Target user UUID
        product_id: Recommended product UUID
        session_id: Generating session UUID (optional)
        created_at: Recommendation generation timestamp
        expires_at: Recommendation expiry time (for freshness)
        is_clicked: User click tracking flag
        clicked_at: Click timestamp for conversion funnel
        is_purchased: Purchase tracking flag
        purchased_at: Purchase timestamp for revenue attribution
    
    Usage:
        - Display recommendations: GET /api/v1/recommendations/
        - Track engagement: POST /api/v1/recommendations/{id}/click
        - Revenue tracking: Track affiliate purchases to recommendation
        - A/B testing: Compare algorithm performance by version
    """
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
    """
    Recommendation creation model for ML algorithm output.
    
    Used internally by recommendation algorithms to create new recommendations.
    Inherits scoring fields from RecommendationBase with required associations.
    
    Algorithm Integration:
        1. ML algorithms generate recommendations with confidence scores
        2. Create RecommendationCreate instances for bulk insertion
        3. Database assigns UUIDs and timestamps
        4. API returns formatted recommendations to users
    
    Required Fields:
        user_id: Target user UUID
        product_id: Recommended product UUID
        session_id: Generating session UUID (optional)
    
    Usage (Internal):
        # In recommendation algorithm
        recommendations = [
            RecommendationCreate(
                user_id=user.id,
                product_id=product.id,
                confidence_score=0.85,
                algorithm_version="collaborative_v2.1",
                reasoning="Similar taste to users who liked this product",
                rank_position=1
            )
            for product in top_products
        ]
    """
    user_id: str
    product_id: str
    session_id: Optional[str] = None

# ==============================================================================
# GIFT LINK MODELS
# ==============================================================================
# Shareable gift recommendation collections for social gifting features
# Enables users to share curated product lists via URLs and QR codes

class GiftLinkBase(BaseModel):
    """
    Base gift link model for shareable recommendation collections.
    
    Gift links enable users to share personalised product recommendations
    with friends, family, or gift recipients. Links can be customised
    with messages and occasion context.
    
    Social Gifting Features:
        - Shareable URLs for easy distribution
        - QR codes for mobile sharing
        - Custom messages for personalisation
        - Occasion context for targeted suggestions
    
    Privacy Controls:
        - Links can be public or private
        - Expiration dates for temporary sharing
        - View/interaction tracking for analytics
    
    Fields:
        title: Display title for gift link ("Sarah's Birthday Ideas")
        message: Personal message from creator ("Hope you find something you love!")
        recipient_name: Gift recipient name ("Sarah")
        occasion: Gift occasion context ("birthday", "christmas")
        expires_at: Link expiration timestamp (optional)
    
    Use Cases:
        - Wishlist sharing: "Here are some things I'd like"
        - Gift suggestions: "Ideas for John's wedding"
        - Group gifting: "Let's all chip in for this"
        - Social discovery: "Products I'm loving right now"
    """
    title: Optional[str] = None
    message: Optional[str] = None
    recipient_name: Optional[str] = None
    occasion: Optional[str] = None
    expires_at: Optional[datetime] = None

class GiftLink(GiftLinkBase):
    """
    Complete gift link model with sharing and analytics fields.
    
    Extends GiftLinkBase with system-managed fields for link generation,
    tracking, and social analytics.
    
    Link Generation:
        - link_token: Unique sharing token for URL generation
        - URL format: https://giftsync.com/gifts/{link_token}
        - qr_code_url: Generated QR code image for mobile sharing
    
    Analytics Tracking:
        - view_count: Number of unique views
        - share_count: Number of times link was shared
        - Individual interactions tracked separately
    
    Session Association:
        - session_id: Optional link to generating swipe session
        - Enables "Create gift link from this session" feature
    
    Additional Fields:
        id: Unique gift link identifier (UUID)
        user_id: Creator user UUID
        session_id: Generating session UUID (optional)
        link_token: Unique sharing token (URL-safe)
        qr_code_url: Generated QR code image URL
        created_at: Link creation timestamp
        is_active: Link status (False = disabled/expired)
        view_count: Total unique views
        share_count: Total share actions
    
    Usage:
        - Create links: POST /api/v1/gift-links/
        - Share links: GET /gifts/{link_token}
        - Analytics: Track views, clicks, and social sharing
        - Mobile: Display QR codes for easy sharing
    """
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
    """
    Gift link creation model for API requests.
    
    Used when users create new shareable gift links, inheriting customisation
    fields from GiftLinkBase with required user association.
    
    Creation Flow:
        1. User selects products or session to share
        2. POST /api/v1/gift-links/ with customisation options
        3. System generates unique token and QR code
        4. Returns shareable URL and QR code image
    
    Required Fields:
        user_id: Creator user UUID (from JWT token)
        session_id: Source session UUID (optional)
    
    Usage:
        POST /api/v1/gift-links/
        Content-Type: application/json
        {
            "title": "Birthday Gift Ideas for Sarah",
            "message": "Here are some things I think you'd love!",
            "recipient_name": "Sarah",
            "occasion": "birthday",
            "expires_at": "2024-12-31T23:59:59Z",
            "user_id": "uuid-creator",
            "session_id": "uuid-session"
        }
    """
    user_id: str
    session_id: Optional[str] = None

# ==============================================================================
# API RESPONSE MODELS
# ==============================================================================
# Standardised response models for API endpoints
# Ensures consistent response formats across the application

class HealthResponse(BaseModel):
    """
    Health check response model for system monitoring.
    
    Provides basic system status information for load balancers,
    monitoring systems, and deployment health checks.
    
    Fields:
        status: System status ("healthy", "degraded", "unhealthy")
        timestamp: Current server timestamp (UTC)
        version: Application version for deployment tracking
    
    Usage:
        GET /health
        Response: {
            "status": "healthy",
            "timestamp": "2024-01-15T10:30:00Z",
            "version": "1.2.3"
        }
    """
    status: str
    timestamp: datetime
    version: str

class PaginatedResponse(BaseModel):
    """
    Paginated response model for list endpoints.
    
    Provides consistent pagination structure across all list APIs,
    enabling efficient data loading and UI pagination controls.
    
    Pagination Logic:
        - page: 1-based page number
        - limit: Items per page (max 100)
        - total: Total items across all pages
        - has_next: Boolean for pagination UI
    
    Fields:
        data: List of items for current page
        total: Total number of items across all pages
        page: Current page number (1-based)
        limit: Items per page
        has_next: True if more pages available
    
    Usage:
        GET /api/v1/products/?page=2&limit=20
        Response: {
            "data": [...],  // 20 products
            "total": 150,
            "page": 2,
            "limit": 20,
            "has_next": true
        }
    """
    data: List[Any]
    total: int
    page: int
    limit: int
    has_next: bool

# ==============================================================================
# ERROR RESPONSE MODELS
# ==============================================================================
# Standardised error response models for consistent error handling

class ErrorResponse(BaseModel):
    """
    Standardised error response model for API errors.
    
    Provides consistent error information across all API endpoints,
    enabling proper error handling in frontend applications.
    
    Error Categories:
        - Validation errors: Field-level validation failures
        - Authentication errors: Invalid/missing tokens
        - Authorization errors: Insufficient permissions
        - Business logic errors: Domain-specific failures
        - System errors: Database/network failures
    
    Fields:
        error: Error type/category ("VALIDATION_ERROR", "UNAUTHORIZED")
        message: Human-readable error description
        details: Additional error context (field validation, stack traces)
    
    Usage:
        HTTP 400 Bad Request
        {
            "error": "VALIDATION_ERROR",
            "message": "Email address is required",
            "details": {
                "field": "email",
                "code": "REQUIRED_FIELD"
            }
        }
    
    Error Codes:
        - VALIDATION_ERROR: Request data validation failed
        - UNAUTHORIZED: Invalid or missing authentication
        - FORBIDDEN: Insufficient permissions
        - NOT_FOUND: Requested resource doesn't exist
        - RATE_LIMITED: Too many requests
        - SERVER_ERROR: Internal system error
    """
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None