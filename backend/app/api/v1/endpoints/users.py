from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models_sqlalchemy.user import User
from app.api.v1.endpoints.auth import get_current_user, get_current_user_from_token
from app.database import supabase

router = APIRouter()


@router.get("/me", summary="Get current user profile")
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get the current authenticated user's profile."""
    return current_user.to_dict()


@router.put("/me", summary="Update current user profile")
async def update_current_user_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update the current authenticated user's profile."""
    # Update allowed fields
    updatable_fields = ['first_name', 'last_name', 'phone_number', 'date_of_birth', 
                       'gender', 'location', 'preferences', 'notification_settings']
    
    for field, value in profile_data.items():
        if field in updatable_fields and hasattr(current_user, field):
            setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user.to_dict()


@router.delete("/me", summary="Delete current user account")
async def delete_current_user_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Soft delete the current authenticated user's account."""
    from datetime import datetime
    
    current_user.deleted_at = datetime.utcnow()
    current_user.is_active = False
    
    await db.commit()
    
    return {"message": "Account deleted successfully"}


@router.get("/{user_id}", summary="Get user by ID")
async def get_user_by_id(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get user by ID (public profile only)."""
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )
    
    stmt = select(User).where(User.id == user_uuid, User.is_active == True)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return public profile only
    return {
        "id": str(user.id),
        "first_name": user.first_name,
        "full_name": user.full_name,
        "subscription_tier": user.subscription_tier.value,
        "created_at": user.created_at.isoformat(),
    }


@router.get("/me/statistics", summary="Get current user statistics")
async def get_user_statistics(
    authorization: str = Header(None)
):
    """Get comprehensive statistics for the authenticated user."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    try:
        # Get current user from token
        current_user = await get_current_user_from_token(authorization)
        
        # Mock user statistics (in production, query from Supabase)
        return {
            "user_id": current_user["id"],
            "swipe_stats": {
                "total_swipes": 247,
                "likes": 186,
                "dislikes": 61,
                "like_rate": 0.75,
                "favorite_categories": ["Electronics", "Kitchen", "Books"],
                "avg_swipes_per_session": 12.3
            },
            "recommendation_stats": {
                "total_recommendations_received": 156,
                "recommendations_clicked": 47,
                "click_through_rate": 0.30,
                "favorite_recommendation_types": ["trending", "personalized", "seasonal"]
            },
            "gift_link_stats": {
                "links_created": 8,
                "total_link_views": 142,
                "total_link_clicks": 38,
                "avg_conversion_rate": 0.27,
                "most_shared_category": "Electronics"
            },
            "engagement_stats": {
                "total_sessions": 23,
                "avg_session_duration_minutes": 8.5,
                "last_active": datetime.now().isoformat(),
                "days_since_signup": 45,
                "streak_days": 7
            },
            "preference_insights": {
                "top_price_range": "£50-£150",
                "preferred_occasions": ["birthday", "christmas", "anniversary"],
                "discovery_method": "swipe_based",
                "personalization_score": 0.82
            },
            "achievements": [
                {"id": "first_swipe", "name": "First Swipe", "unlocked": True},
                {"id": "discovery_expert", "name": "Discovery Expert", "unlocked": True},
                {"id": "gift_curator", "name": "Gift Curator", "unlocked": False}
            ],
            "last_updated": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user statistics: {str(e)}")