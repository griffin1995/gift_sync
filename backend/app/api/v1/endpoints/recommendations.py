from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func, desc, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from app.core.database import get_db
from app.models.user import User
from app.models.product import Product
from app.models.recommendation import (
    Recommendation, RecommendationInteraction, RecommendationType, 
    RecommendationStatus, InteractionType, RecommendationAnalytics
)
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.get("/", summary="Get personalized recommendations")
async def get_recommendations(
    limit: int = Query(20, le=50, description="Number of recommendations to return"),
    offset: int = Query(0, description="Number of recommendations to skip"),
    recommendation_type: Optional[str] = Query(None, description="Filter by recommendation type"),
    occasion: Optional[str] = Query(None, description="Filter by occasion"),
    price_range: Optional[str] = Query(None, description="Filter by price range"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get personalized recommendations for the authenticated user."""
    
    # Build query for active recommendations
    stmt = (
        select(Recommendation)
        .where(
            Recommendation.user_id == current_user.id,
            Recommendation.status == RecommendationStatus.ACTIVE
        )
        .options(
            selectinload(Recommendation.product),
            selectinload(Recommendation.interactions)
        )
    )
    
    # Apply filters
    if recommendation_type:
        try:
            rec_type = RecommendationType(recommendation_type)
            stmt = stmt.where(Recommendation.recommendation_type == rec_type)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid recommendation type"
            )
    
    if occasion:
        stmt = stmt.where(Recommendation.occasion == occasion)
    
    if price_range:
        stmt = stmt.where(Recommendation.price_range == price_range)
    
    # Order by confidence score and display priority
    stmt = stmt.order_by(
        desc(Recommendation.display_priority),
        desc(Recommendation.confidence_score),
        desc(Recommendation.created_at)
    )
    
    # Apply pagination
    stmt = stmt.limit(limit).offset(offset)
    
    result = await db.execute(stmt)
    recommendations = result.scalars().all()
    
    # Mark recommendations as served
    for rec in recommendations:
        rec.served_at = datetime.utcnow()
    await db.commit()
    
    # Return enriched recommendations with product data
    return [
        {
            **rec.to_dict(),
            "product": rec.product.to_dict() if rec.product else None,
            "interaction_count": len(rec.interactions),
        }
        for rec in recommendations
    ]


@router.get("/generate", summary="Generate new recommendations")
async def generate_recommendations(
    force_refresh: bool = Query(False, description="Force regeneration of recommendations"),
    session_id: Optional[str] = Query(None, description="Swipe session ID to base recommendations on"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate new personalized recommendations for the user."""
    
    # Check if user has recent recommendations and force_refresh is False
    if not force_refresh:
        recent_cutoff = datetime.utcnow() - timedelta(hours=24)
        stmt = select(func.count(Recommendation.id)).where(
            Recommendation.user_id == current_user.id,
            Recommendation.status == RecommendationStatus.ACTIVE,
            Recommendation.created_at > recent_cutoff
        )
        result = await db.execute(stmt)
        recent_count = result.scalar()
        
        if recent_count > 0:
            return {
                "message": "Recent recommendations exist. Use force_refresh=true to regenerate.",
                "recent_count": recent_count
            }
    
    # TODO: Integrate with ML pipeline to generate actual recommendations
    # For now, this is a placeholder that would call the ML service
    
    # This would typically:
    # 1. Fetch user's swipe history and preferences
    # 2. Call the ML recommendation service
    # 3. Store the generated recommendations in the database
    # 4. Return the new recommendations
    
    # Placeholder response
    return {
        "message": "Recommendation generation triggered",
        "user_id": str(current_user.id),
        "session_id": session_id,
        "status": "pending",
        "estimated_completion": "30 seconds"
    }


@router.post("/{recommendation_id}/interact", summary="Record recommendation interaction")
async def record_recommendation_interaction(
    recommendation_id: str,
    interaction_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Record a user interaction with a recommendation."""
    
    try:
        rec_uuid = uuid.UUID(recommendation_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid recommendation ID format"
        )
    
    # Verify recommendation exists and belongs to user
    stmt = select(Recommendation).where(
        Recommendation.id == rec_uuid,
        Recommendation.user_id == current_user.id
    )
    result = await db.execute(stmt)
    recommendation = result.scalar_one_or_none()
    
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found"
        )
    
    # Validate interaction type
    try:
        interaction_type = InteractionType(interaction_data['interaction_type'])
    except (KeyError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or missing interaction type"
        )
    
    # Create interaction record
    interaction = RecommendationInteraction(
        recommendation_id=recommendation.id,
        user_id=current_user.id,
        interaction_type=interaction_type,
        session_id=interaction_data.get('session_id'),
        device_type=interaction_data.get('device_type'),
        platform=interaction_data.get('platform'),
        time_to_interaction=interaction_data.get('time_to_interaction'),
        interaction_duration=interaction_data.get('interaction_duration'),
        purchase_amount=interaction_data.get('purchase_amount'),
        commission_amount=interaction_data.get('commission_amount'),
        order_id=interaction_data.get('order_id'),
        page_position=interaction_data.get('page_position'),
        referrer=interaction_data.get('referrer'),
        metadata=interaction_data.get('metadata'),
    )
    
    db.add(interaction)
    
    # Update recommendation status based on interaction
    if interaction_type == InteractionType.PURCHASE:
        recommendation.status = RecommendationStatus.PURCHASED
    elif interaction_type == InteractionType.DISMISS:
        recommendation.status = RecommendationStatus.DISMISSED
    
    await db.commit()
    await db.refresh(interaction)
    
    return interaction.to_dict()


@router.get("/{recommendation_id}", summary="Get specific recommendation")
async def get_recommendation(
    recommendation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific recommendation with full details."""
    
    try:
        rec_uuid = uuid.UUID(recommendation_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid recommendation ID format"
        )
    
    stmt = (
        select(Recommendation)
        .where(
            Recommendation.id == rec_uuid,
            Recommendation.user_id == current_user.id
        )
        .options(
            selectinload(Recommendation.product),
            selectinload(Recommendation.interactions)
        )
    )
    
    result = await db.execute(stmt)
    recommendation = result.scalar_one_or_none()
    
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found"
        )
    
    return {
        **recommendation.to_dict(),
        "product": recommendation.product.to_dict() if recommendation.product else None,
        "interactions": [interaction.to_dict() for interaction in recommendation.interactions],
    }


@router.get("/analytics/performance", summary="Get recommendation performance analytics")
async def get_recommendation_analytics(
    days: int = Query(30, description="Number of days to analyse"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get analytics about recommendation performance for the user."""
    
    # Get recommendations from the specified time period
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    stmt = (
        select(Recommendation)
        .where(
            Recommendation.user_id == current_user.id,
            Recommendation.created_at >= cutoff_date
        )
        .options(
            selectinload(Recommendation.product),
            selectinload(Recommendation.interactions)
        )
    )
    
    result = await db.execute(stmt)
    recommendations = result.scalars().all()
    
    if not recommendations:
        return {
            "message": "No recommendations found for the specified period",
            "days": days
        }
    
    # Calculate performance metrics
    performance_metrics = RecommendationAnalytics.calculate_performance_metrics(recommendations)
    
    # Get top performing categories
    top_categories = RecommendationAnalytics.get_top_performing_categories(recommendations)
    
    return {
        "period_days": days,
        "performance_metrics": performance_metrics,
        "top_categories": top_categories,
        "recommendation_types": {
            rec_type.value: len([r for r in recommendations if r.recommendation_type == rec_type])
            for rec_type in RecommendationType
        }
    }


@router.delete("/{recommendation_id}", summary="Dismiss recommendation")
async def dismiss_recommendation(
    recommendation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Dismiss a recommendation (mark as not interested)."""
    
    try:
        rec_uuid = uuid.UUID(recommendation_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid recommendation ID format"
        )
    
    stmt = select(Recommendation).where(
        Recommendation.id == rec_uuid,
        Recommendation.user_id == current_user.id
    )
    result = await db.execute(stmt)
    recommendation = result.scalar_one_or_none()
    
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found"
        )
    
    # Update status to dismissed
    recommendation.status = RecommendationStatus.DISMISSED
    
    # Create dismiss interaction
    dismiss_interaction = RecommendationInteraction(
        recommendation_id=recommendation.id,
        user_id=current_user.id,
        interaction_type=InteractionType.DISMISS,
    )
    
    db.add(dismiss_interaction)
    await db.commit()
    
    return {"message": "Recommendation dismissed successfully"}