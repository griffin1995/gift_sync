from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models_sqlalchemy.user import User
from app.models_sqlalchemy.swipe import SwipeSession, SwipeInteraction, SwipeDirection, SwipeAnalytics
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.post("/sessions", summary="Start a new swipe session")
async def start_swipe_session(
    session_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Start a new swipe session for the authenticated user."""
    
    # Create new swipe session
    session = SwipeSession(
        user_id=current_user.id,
        session_type=session_data.get('session_type', 'onboarding'),
        device_id=session_data.get('device_id'),
        platform=session_data.get('platform'),
    )
    
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    return session.to_dict()


@router.get("/sessions", summary="Get user's swipe sessions")
async def get_user_swipe_sessions(
    limit: int = 10,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get the current user's swipe sessions."""
    
    stmt = (
        select(SwipeSession)
        .where(SwipeSession.user_id == current_user.id)
        .order_by(desc(SwipeSession.created_at))
        .limit(limit)
        .offset(offset)
        .options(selectinload(SwipeSession.interactions))
    )
    
    result = await db.execute(stmt)
    sessions = result.scalars().all()
    
    return [session.to_dict() for session in sessions]


@router.get("/sessions/{session_id}", summary="Get specific swipe session")
async def get_swipe_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific swipe session with all interactions."""
    
    try:
        session_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    stmt = (
        select(SwipeSession)
        .where(SwipeSession.id == session_uuid, SwipeSession.user_id == current_user.id)
        .options(selectinload(SwipeSession.interactions))
    )
    
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Swipe session not found"
        )
    
    return session.to_dict()


@router.post("/sessions/{session_id}/interactions", summary="Record a swipe interaction")
async def record_swipe_interaction(
    session_id: str,
    interaction_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Record a swipe interaction within a session."""
    
    try:
        session_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    # Verify session exists and belongs to user
    stmt = select(SwipeSession).where(
        SwipeSession.id == session_uuid, 
        SwipeSession.user_id == current_user.id
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Swipe session not found"
        )
    
    # Validate swipe direction
    try:
        swipe_direction = SwipeDirection(interaction_data['swipe_direction'])
    except (KeyError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or missing swipe direction"
        )
    
    # Create interaction
    interaction = SwipeInteraction(
        session_id=session.id,
        user_id=current_user.id,
        category_id=interaction_data.get('category_id'),
        category_name=interaction_data.get('category_name'),
        product_id=interaction_data.get('product_id'),
        content_type=interaction_data.get('content_type', 'category'),
        swipe_direction=swipe_direction,
        time_viewed=interaction_data.get('time_viewed'),
        swipe_order=interaction_data.get('swipe_order', 1),
        swipe_velocity=interaction_data.get('swipe_velocity'),
        swipe_distance=interaction_data.get('swipe_distance'),
        screen_position=interaction_data.get('screen_position'),
        additional_data=interaction_data.get('additional_data'),
    )
    
    db.add(interaction)
    
    # Update session statistics
    session.total_swipes += 1
    if swipe_direction == SwipeDirection.RIGHT:
        session.likes_count += 1
    elif swipe_direction == SwipeDirection.LEFT:
        session.dislikes_count += 1
    elif swipe_direction == SwipeDirection.UP:
        session.super_likes_count += 1
    
    await db.commit()
    await db.refresh(interaction)
    
    return interaction.to_dict()


@router.put("/sessions/{session_id}/complete", summary="Mark swipe session as complete")
async def complete_swipe_session(
    session_id: str,
    completion_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark a swipe session as completed."""
    
    try:
        session_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    stmt = select(SwipeSession).where(
        SwipeSession.id == session_uuid, 
        SwipeSession.user_id == current_user.id
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Swipe session not found"
        )
    
    # Mark as completed
    session.is_completed = True
    session.session_end = datetime.utcnow()
    session.completion_rate = completion_data.get('completion_rate')
    session.total_session_time = completion_data.get('total_session_time')
    session.average_time_per_swipe = completion_data.get('average_time_per_swipe')
    
    await db.commit()
    await db.refresh(session)
    
    return session.to_dict()


@router.get("/analytics/preferences", summary="Get user preference analytics")
async def get_user_preference_analytics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get analytics about user's swiping preferences."""
    
    # Get all user's sessions with interactions
    stmt = (
        select(SwipeSession)
        .where(SwipeSession.user_id == current_user.id)
        .options(selectinload(SwipeSession.interactions))
    )
    
    result = await db.execute(stmt)
    sessions = result.scalars().all()
    
    if not sessions:
        return {
            "category_preferences": {},
            "overall_like_rate": 0,
            "total_swipes": 0,
            "selectivity_score": 0.5,
        }
    
    # Calculate preferences using the analytics helper
    preferences = SwipeAnalytics.calculate_user_preferences(
        str(current_user.id), 
        sessions
    )
    
    return preferences


@router.get("/analytics/patterns", summary="Get swipe pattern analytics")
async def get_swipe_pattern_analytics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get analytics about user's swiping patterns."""
    
    # Get recent interactions for pattern analysis
    stmt = (
        select(SwipeInteraction)
        .where(SwipeInteraction.user_id == current_user.id)
        .order_by(desc(SwipeInteraction.swipe_timestamp))
        .limit(100)  # Last 100 swipes
    )
    
    result = await db.execute(stmt)
    interactions = result.scalars().all()
    
    if not interactions:
        return {"is_valid": True, "confidence": 1.0}
    
    # Analyze patterns using the analytics helper
    patterns = SwipeAnalytics.detect_swipe_patterns(interactions)
    
    return patterns