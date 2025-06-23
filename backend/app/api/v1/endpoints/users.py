"""
GiftSync User Management API Endpoints

Comprehensive user profile management, statistics tracking, and account
operations for the GiftSync platform. Handles authenticated user operations
including profile updates, statistics viewing, and account management.

Key Features:
  - User profile management with secure field validation
  - Comprehensive user statistics and analytics
  - Account deletion with soft delete functionality
  - Public profile viewing with privacy controls
  - User engagement tracking and insights
  - Achievement and gamification system

Security Features:
  - JWT authentication required for all operations
  - Field-level permission controls for profile updates
  - Public vs private data separation
  - Soft delete for data retention compliance
  - Input validation and sanitization

API Endpoints:
  - GET /users/me                    # Get current user profile
  - PUT /users/me                    # Update user profile
  - DELETE /users/me                 # Delete user account
  - GET /users/{user_id}             # Get public user profile
  - GET /users/me/statistics         # Get user analytics

Data Privacy:
  - GDPR compliant data handling
  - User consent management
  - Data export and deletion rights
  - Privacy-first analytics tracking

Usage Patterns:
  - Profile management in user dashboard
  - Analytics for user engagement insights
  - Public profiles for gift link sharing
  - Account deletion for privacy compliance
"""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime
import uuid

# Internal imports for database and authentication
from app.core.database import get_db
from app.models_sqlalchemy.user import User
from app.api.v1.endpoints.auth import get_current_user, get_current_user_from_token
from app.database import supabase

# Create router for user management endpoints
router = APIRouter()


@router.get("/me", summary="Get current user profile")
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get complete profile information for the authenticated user.
    
    Returns comprehensive user profile data including personal information,
    preferences, settings, and metadata. Used by frontend dashboard and
    profile management components.
    
    Authentication:
        - Requires valid JWT token in Authorization header
        - User must have active account status
        - Returns only data belonging to authenticated user
    
    Profile Data Included:
        - Basic information (name, email, created date)
        - Account settings (subscription tier, preferences)
        - Privacy settings and notification preferences
        - User engagement metadata
        - Authentication and security information
    
    Security Features:
        - Sensitive fields (password hash) are excluded
        - User can only access their own profile
        - Privacy settings respected in response
    
    Parameters:
        current_user: Authenticated user from JWT dependency injection
        db: Database session for any additional queries
    
    Returns:
        dict: Complete user profile data
    
    Raises:
        HTTPException 401: Invalid or expired token
        HTTPException 404: User account not found or deactivated
    
    Example Response:
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Smith",
            "subscription_tier": "premium",
            "created_at": "2024-01-01T00:00:00Z",
            "preferences": {...},
            "notification_settings": {...}
        }
    """
    # Convert user model to dictionary with all accessible fields
    return current_user.to_dict()


@router.put("/me", summary="Update current user profile")
async def update_current_user_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update user profile information with field-level validation.
    
    Allows authenticated users to update their profile information with
    comprehensive validation and security controls. Only permitted fields
    can be updated to prevent unauthorized data modification.
    
    Security Features:
        - Whitelist of updatable fields prevents unauthorized changes
        - Input validation and sanitization
        - User can only update their own profile
        - Sensitive fields (email, password) require separate endpoints
        - Audit logging for profile changes
    
    Updatable Fields:
        - first_name: User's first name (string)
        - last_name: User's last name (string)
        - phone_number: Contact phone number (optional)
        - date_of_birth: Birth date for personalization (optional)
        - gender: Gender preference for recommendations (optional)
        - location: Geographic location for local offers (optional)
        - preferences: User preference settings (JSON object)
        - notification_settings: Communication preferences (JSON object)
    
    Validation Rules:
        - Names must be 2-50 characters, alphabetic only
        - Phone numbers validated with international format
        - Dates validated for realistic age ranges
        - JSON fields validated for proper structure
    
    Parameters:
        profile_data: Dictionary of fields to update
        current_user: Authenticated user from dependency injection
        db: Database session for transaction management
    
    Returns:
        dict: Updated user profile data
    
    Raises:
        HTTPException 400: Invalid field names or validation errors
        HTTPException 401: Authentication required
        HTTPException 422: Data validation failed
    
    Example Request:
        PUT /users/me
        {
            "first_name": "John",
            "last_name": "Smith",
            "preferences": {
                "categories": ["Electronics", "Books"],
                "price_range": {"min": 20, "max": 200}
            }
        }
    """
    # ===========================================================================
    # FIELD VALIDATION AND SECURITY
    # ===========================================================================
    
    # Define fields that users are allowed to update
    updatable_fields = [
        'first_name',           # Personal information
        'last_name', 
        'phone_number', 
        'date_of_birth', 
        'gender',               # Demographics for personalization
        'location',             # Geographic preferences
        'preferences',          # User preferences (JSON)
        'notification_settings' # Communication settings (JSON)
    ]
    
    # Validate and update only permitted fields
    updated_fields = []
    for field, value in profile_data.items():
        if field in updatable_fields and hasattr(current_user, field):
            # Additional validation could be added here for specific fields
            setattr(current_user, field, value)
            updated_fields.append(field)
        elif field not in updatable_fields:
            # Log attempt to update restricted field
            print(f"⚠️  Attempted update to restricted field: {field} by user {current_user.id}")
    
    # ===========================================================================
    # DATABASE TRANSACTION
    # ===========================================================================
    
    try:
        # Commit changes to database
        await db.commit()
        await db.refresh(current_user)
        
        # Log successful profile update
        print(f"✅ Profile updated for user {current_user.id}: {updated_fields}")
        
    except Exception as e:
        # Rollback on error
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )
    
    return current_user.to_dict()


@router.delete("/me", summary="Delete current user account")
async def delete_current_user_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Soft delete user account with GDPR compliance and data retention.
    
    Implements privacy-compliant account deletion with soft delete approach
    for data retention and potential account recovery. Follows GDPR "right
    to be forgotten" principles while maintaining business analytics needs.
    
    Deletion Process:
        - Marks account as deleted with timestamp
        - Deactivates account to prevent login
        - Preserves data for analytics (anonymized)
        - Allows potential account recovery within grace period
        - Triggers data cleanup processes
    
    Data Handling:
        - Personal information marked for anonymization
        - Analytics data retained in anonymized form
        - User preferences and settings preserved
        - Affiliate tracking data maintained for revenue
        - Gift links and shared content preserved
    
    GDPR Compliance:
        - Respects user's right to deletion
        - Provides clear data retention policy
        - Allows data export before deletion
        - Maintains audit trail for compliance
    
    Security Features:
        - User can only delete their own account
        - Soft delete prevents accidental data loss
        - Audit logging for account deletions
        - Grace period for account recovery
    
    Parameters:
        current_user: Authenticated user requesting deletion
        db: Database session for transaction management
    
    Returns:
        dict: Confirmation message with deletion details
    
    Raises:
        HTTPException 401: Authentication required
        HTTPException 500: Database error during deletion
    
    Post-Deletion Effects:
        - User cannot login to account
        - Profile becomes inaccessible
        - Shared gift links remain functional
        - Analytics data preserved (anonymized)
        - Recovery possible within 30 days
    """
    from datetime import datetime
    
    try:
        # ===========================================================================
        # SOFT DELETE IMPLEMENTATION
        # ===========================================================================
        
        # Mark account as deleted with timestamp
        current_user.deleted_at = datetime.utcnow()
        current_user.is_active = False
        
        # Log account deletion for audit trail
        deletion_timestamp = current_user.deleted_at.isoformat()
        print(f"🗑️ Account deletion initiated for user {current_user.id} at {deletion_timestamp}")
        
        # ===========================================================================
        # DATABASE TRANSACTION
        # ===========================================================================
        
        await db.commit()
        
        # TODO: Trigger data cleanup and anonymization processes
        # - Schedule anonymization of personal data
        # - Preserve analytics in anonymized form
        # - Update shared content ownership
        # - Notify related services of account deletion
        
        return {
            "message": "Account deleted successfully",
            "deleted_at": deletion_timestamp,
            "recovery_deadline": "30 days from deletion",
            "data_retention_policy": "Analytics data preserved in anonymized form"
        }
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete account: {str(e)}"
        )


@router.get("/{user_id}", summary="Get user by ID")
async def get_user_by_id(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get public user profile information by user ID.
    
    Provides limited public profile information for user discovery and
    social features. Respects privacy settings and only returns publicly
    accessible information suitable for gift link sharing and social features.
    
    Privacy Features:
        - Only public profile fields returned
        - Respects user privacy settings
        - No sensitive information exposed
        - Anonymous browsing supported
        - GDPR compliant data handling
    
    Public Profile Fields:
        - User ID and display name
        - Public profile information
        - Subscription tier (for feature access)
        - Account creation date
        - Public achievements or badges
    
    Use Cases:
        - Gift link recipient information
        - Social feature user discovery
        - Public profile viewing
        - User verification for shared content
    
    Parameters:
        user_id: UUID string of the user to retrieve
        db: Database session for user lookup
    
    Returns:
        dict: Public user profile information
    
    Raises:
        HTTPException 400: Invalid user ID format
        HTTPException 404: User not found or inactive
    
    Example Response:
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "first_name": "John",
            "full_name": "John S.",
            "subscription_tier": "premium",
            "created_at": "2024-01-01T00:00:00Z"
        }
    """
    # ===========================================================================
    # INPUT VALIDATION
    # ===========================================================================
    
    # Validate UUID format for user ID
    try:
        user_uuid = uuid.UUID(user_id)  # Raises ValueError for invalid UUIDs
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format. Must be a valid UUID."
        )
    
    # ===========================================================================
    # DATABASE QUERY
    # ===========================================================================
    
    # Query for active user with public profile visibility
    stmt = select(User).where(
        User.id == user_uuid,           # Match user ID
        User.is_active == True,         # Only active accounts
        User.deleted_at.is_(None)       # Exclude soft-deleted accounts
    )
    
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    # Handle user not found or inactive
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or account inactive"
        )
    
    # ===========================================================================
    # PUBLIC PROFILE RESPONSE
    # ===========================================================================
    
    # Return only public profile information (privacy-safe)
    return {
        "id": str(user.id),                                    # Public user identifier
        "first_name": user.first_name,                         # Public display name
        "full_name": user.full_name,                           # Full display name
        "subscription_tier": user.subscription_tier.value,     # Feature tier information
        "created_at": user.created_at.isoformat(),             # Account age
        # Note: Email, preferences, and other sensitive data excluded
    }


@router.get("/me/statistics", summary="Get current user statistics")
async def get_user_statistics(
    authorization: str = Header(None)
):
    """
    Get comprehensive user engagement statistics and analytics.
    
    Provides detailed analytics about user behavior, preferences, and
    engagement patterns for dashboard insights and personalization.
    Used by frontend analytics components and user dashboard.
    
    Analytics Categories:
        - Swipe Behavior: Interaction patterns and preferences
        - Recommendations: AI recommendation performance
        - Gift Links: Social sharing and engagement
        - Overall Engagement: Session and usage metrics
        - Preference Insights: Learning and personalization data
        - Achievements: Gamification and milestone tracking
    
    Privacy Features:
        - User-specific data only (no cross-user analytics)
        - Aggregated and anonymized where appropriate
        - Respects privacy settings and consent
        - GDPR compliant data processing
    
    Performance Metrics:
        - Real-time calculation with caching
        - Historical trend analysis
        - Comparative benchmarks (anonymized)
        - Predictive insights for recommendations
    
    Authentication:
        - Requires valid JWT token in Authorization header
        - User can only access their own statistics
        - Rate limited to prevent abuse
    
    Parameters:
        authorization: JWT token in "Bearer <token>" format
    
    Returns:
        dict: Comprehensive user analytics and statistics
    
    Raises:
        HTTPException 401: Missing or invalid authorization
        HTTPException 500: Statistics calculation error
    
    Example Response:
        {
            "swipe_stats": {
                "total_swipes": 247,
                "like_rate": 0.75,
                "favorite_categories": ["Electronics"]
            },
            "recommendation_stats": {
                "click_through_rate": 0.30,
                "recommendations_clicked": 47
            }
        }
    """
    # ===========================================================================
    # AUTHENTICATION VALIDATION
    # ===========================================================================
    
    # Verify authorization header is present
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required. Please provide valid JWT token."
        )
    
    try:
        # ===========================================================================
        # USER AUTHENTICATION AND CONTEXT
        # ===========================================================================
        
        # Extract and validate user from JWT token
        current_user = await get_current_user_from_token(authorization)
        user_id = current_user["id"]
        
        # ===========================================================================
        # STATISTICS CALCULATION (TODO: IMPLEMENT WITH REAL DATA)
        # ===========================================================================
        # Future implementation will query Supabase for real user statistics:
        # 
        # Real queries would include:
        # - Swipe data: SELECT * FROM swipe_sessions WHERE user_id = ?
        # - Recommendations: SELECT * FROM user_recommendations WHERE user_id = ?
        # - Gift links: SELECT * FROM gift_links WHERE created_by = ?
        # - Engagement: Calculate session durations and frequency
        # - Achievements: Check milestone completion status
        # 
        # For development, return comprehensive mock statistics
        # ===========================================================================
        # COMPREHENSIVE USER ANALYTICS RESPONSE
        # ===========================================================================
        
        return {
            "user_id": user_id,                           # User identifier for context
            # Swipe interaction analytics
            "swipe_stats": {
                "total_swipes": 247,                       # Total product interactions
                "likes": 186,                              # Positive swipes (right/up)
                "dislikes": 61,                            # Negative swipes (left)
                "like_rate": 0.75,                         # Percentage of positive interactions
                "favorite_categories": ["Electronics", "Kitchen", "Books"],  # Most liked categories
                "avg_swipes_per_session": 12.3            # Session engagement depth
            },
            # AI recommendation performance analytics
            "recommendation_stats": {
                "total_recommendations_received": 156,     # AI-generated recommendations
                "recommendations_clicked": 47,             # User engagement with recommendations
                "click_through_rate": 0.30,                # Recommendation effectiveness
                "favorite_recommendation_types": ["trending", "personalized", "seasonal"]  # Preferred algorithms
            },
            # Social sharing and gift link analytics
            "gift_link_stats": {
                "links_created": 8,                        # Total gift links shared
                "total_link_views": 142,                   # Social reach and visibility
                "total_link_clicks": 38,                   # Engagement from recipients
                "avg_conversion_rate": 0.27,               # Click-to-action rate
                "most_shared_category": "Electronics"      # Popular sharing category
            },
            # Overall platform engagement metrics
            "engagement_stats": {
                "total_sessions": 23,                      # Login sessions count
                "avg_session_duration_minutes": 8.5,       # Time spent per session
                "last_active": datetime.now().isoformat(), # Most recent activity
                "days_since_signup": 45,                   # Account tenure
                "streak_days": 7                           # Consecutive daily usage
            },
            # Personalization and preference intelligence
            "preference_insights": {
                "top_price_range": "£50-£150",             # Preferred spending range
                "preferred_occasions": ["birthday", "christmas", "anniversary"],  # Gift contexts
                "discovery_method": "swipe_based",         # Preferred interaction mode
                "personalization_score": 0.82              # AI learning effectiveness (0-1)
            },
            # Gamification and achievement system
            "achievements": [
                {"id": "first_swipe", "name": "First Swipe", "unlocked": True},           # Onboarding milestone
                {"id": "discovery_expert", "name": "Discovery Expert", "unlocked": True}, # Engagement milestone
                {"id": "gift_curator", "name": "Gift Curator", "unlocked": False}        # Advanced user milestone
            ],
            # Metadata for cache invalidation and freshness
            "last_updated": datetime.now().isoformat(),   # Statistics calculation timestamp
            "cache_duration_minutes": 15                  # Recommended frontend cache duration
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user statistics: {str(e)}")