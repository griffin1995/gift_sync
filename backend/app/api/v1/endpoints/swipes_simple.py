from fastapi import APIRouter, HTTPException, Query, Header
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime

from app.database import supabase
from app.models import SwipeSession, SwipeSessionBase, SwipeSessionCreate, SwipeInteraction, SwipeInteractionBase, SwipeInteractionCreate
from app.api.v1.endpoints.auth import get_current_user_from_token

router = APIRouter()


@router.post("/sessions", summary="Create new swipe session")
async def create_swipe_session(
    session_data: SwipeSessionBase,  # Use base model without user_id requirement
    authorization: Optional[str] = Header(None)
):
    """Create a new swipe session for the authenticated user."""
    try:
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        session_dict = session_data.dict()
        session_dict.update({
            "id": str(uuid.uuid4()),
            "user_id": user_id,  # Set from authenticated user
            "started_at": datetime.now().isoformat(),
            "is_completed": False,
            "total_swipes": 0
        })
        
        created_sessions = await supabase.insert(
            "swipe_sessions",
            session_dict,
            use_service_key=True
        )
        
        return created_sessions[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create swipe session: {str(e)}")


@router.get("/sessions", summary="Get user's swipe sessions")
async def get_user_swipe_sessions(
    limit: int = Query(10, le=50, description="Number of sessions to return"),
    completed_only: Optional[bool] = Query(None, description="Filter by completion status"),
    authorization: Optional[str] = Header(None)
):
    """Get swipe sessions for the authenticated user."""
    try:
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        filters = {"user_id": user_id}
        if completed_only is not None:
            filters["is_completed"] = completed_only
        
        sessions = await supabase.select(
            "swipe_sessions",
            select="*",
            filters=filters,
            limit=limit,
            use_service_key=True  # Use service key to bypass RLS
        )
        
        return sessions
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch swipe sessions: {str(e)}")


@router.get("/sessions/{session_id}", summary="Get specific swipe session")
async def get_swipe_session(
    session_id: str,
    authorization: Optional[str] = Header(None)
):
    """Get a specific swipe session by ID."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(session_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid session ID format")
        
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        sessions = await supabase.select(
            "swipe_sessions",
            filters={"id": session_id, "user_id": user_id},
            use_service_key=True
        )
        
        if not sessions:
            raise HTTPException(status_code=404, detail="Swipe session not found")
        
        return sessions[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch swipe session: {str(e)}")


@router.put("/sessions/{session_id}/complete", summary="Mark session as completed")
async def complete_swipe_session(
    session_id: str,
    authorization: Optional[str] = Header(None)
):
    """Mark a swipe session as completed."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(session_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid session ID format")
        
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        # Check if session exists and belongs to user
        sessions = await supabase.select(
            "swipe_sessions",
            filters={"id": session_id, "user_id": user_id},
            use_service_key=True
        )
        
        if not sessions:
            raise HTTPException(status_code=404, detail="Swipe session not found")
        
        # Update session
        updated_sessions = await supabase.update(
            "swipe_sessions",
            {
                "is_completed": True,
                "completed_at": datetime.now().isoformat()
            },
            filters={"id": session_id},
            use_service_key=True
        )
        
        return updated_sessions[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to complete swipe session: {str(e)}")


@router.post("/interactions", summary="Record swipe interaction")
async def create_swipe_interaction(
    interaction_data: SwipeInteractionBase,  # Use base model without user_id requirement
    session_id: str = Query(..., description="Session ID for this interaction"),
    authorization: Optional[str] = Header(None)
):
    """Record a swipe interaction."""
    try:
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        interaction_dict = interaction_data.dict()
        interaction_dict.update({
            "id": str(uuid.uuid4()),
            "session_id": session_id,  # Set from query parameter
            "user_id": user_id,        # Set from authenticated user
            "swipe_timestamp": datetime.now().isoformat()
        })
        
        # Verify session belongs to user
        session_id = interaction_dict.get("session_id")
        if session_id:
            sessions = await supabase.select(
                "swipe_sessions",
                filters={"id": session_id, "user_id": user_id},
                limit=1,
                use_service_key=True
            )
            if not sessions:
                raise HTTPException(status_code=404, detail="Swipe session not found or unauthorized")
        
        created_interactions = await supabase.insert(
            "swipe_interactions",
            interaction_dict,
            use_service_key=True
        )
        
        # Update session total_swipes count
        if session_id:
            # Get current count
            current_count = await supabase.select(
                "swipe_interactions",
                select="id",
                filters={"session_id": session_id}
            )
            
            # Update session
            await supabase.update(
                "swipe_sessions",
                {"total_swipes": len(current_count)},
                filters={"id": session_id},
                use_service_key=True
            )
        
        return created_interactions[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record swipe interaction: {str(e)}")


@router.get("/sessions/{session_id}/interactions", summary="Get session interactions")
async def get_session_interactions(
    session_id: str,
    limit: int = Query(50, le=200, description="Number of interactions to return"),
    swipe_direction: Optional[str] = Query(None, description="Filter by swipe direction"),
    authorization: Optional[str] = Header(None)
):
    """Get all interactions for a specific swipe session."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(session_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid session ID format")
        
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        # Verify session belongs to user
        sessions = await supabase.select(
            "swipe_sessions",
            filters={"id": session_id, "user_id": user_id},
            limit=1,
            use_service_key=True
        )
        if not sessions:
            raise HTTPException(status_code=404, detail="Swipe session not found or unauthorized")
        
        filters = {"session_id": session_id}
        if swipe_direction:
            if swipe_direction not in ["left", "right", "up", "down"]:
                raise HTTPException(status_code=400, detail="Invalid swipe direction")
            filters["swipe_direction"] = swipe_direction
        
        interactions = await supabase.select(
            "swipe_interactions",
            select="*",
            filters=filters,
            limit=limit,
            use_service_key=True
        )
        
        return interactions
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch session interactions: {str(e)}")


@router.get("/analytics/preferences", summary="Get user preference analytics")
async def get_user_preferences(
    authorization: Optional[str] = Header(None)
):
    """Get analytics about user's swipe preferences."""
    try:
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        # Get all user's interactions
        interactions = await supabase.select(
            "swipe_interactions",
            select="*",
            filters={"user_id": user_id},
            use_service_key=True
        )
        
        if not interactions:
            return {
                "total_swipes": 0,
                "preferences": {},
                "favorite_categories": [],
                "message": "No swipe data available"
            }
        
        # Analyze preferences
        total_swipes = len(interactions)
        right_swipes = [i for i in interactions if i["swipe_direction"] == "right"]
        left_swipes = [i for i in interactions if i["swipe_direction"] == "left"]
        
        # Category preferences
        category_stats = {}
        for interaction in right_swipes:
            cat_id = interaction.get("category_id")
            if cat_id:
                category_stats[cat_id] = category_stats.get(cat_id, 0) + 1
        
        # Get category names
        favorite_categories = []
        if category_stats:
            for cat_id, count in sorted(category_stats.items(), key=lambda x: x[1], reverse=True)[:5]:
                categories = await supabase.select(
                    "categories",
                    select="name",
                    filters={"id": cat_id},
                    limit=1,
                    use_service_key=True
                )
                if categories:
                    favorite_categories.append({
                        "category": categories[0]["name"],
                        "positive_swipes": count
                    })
        
        return {
            "total_swipes": total_swipes,
            "preferences": {
                "positive_swipes": len(right_swipes),
                "negative_swipes": len(left_swipes),
                "engagement_rate": len(right_swipes) / total_swipes if total_swipes > 0 else 0
            },
            "favorite_categories": favorite_categories
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch preference analytics: {str(e)}")


@router.delete("/sessions/{session_id}", summary="Delete swipe session")
async def delete_swipe_session(
    session_id: str,
    authorization: Optional[str] = Header(None)
):
    """Delete a swipe session and all its interactions."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(session_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid session ID format")
        
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        # Verify session belongs to user
        sessions = await supabase.select(
            "swipe_sessions",
            filters={"id": session_id, "user_id": user_id},
            limit=1,
            use_service_key=True
        )
        if not sessions:
            raise HTTPException(status_code=404, detail="Swipe session not found or unauthorized")
        
        # Delete interactions first (due to foreign key constraint)
        await supabase.delete(
            "swipe_interactions",
            filters={"session_id": session_id},
            use_service_key=True
        )
        
        # Delete session
        await supabase.delete(
            "swipe_sessions",
            filters={"id": session_id},
            use_service_key=True
        )
        
        return {"message": "Swipe session deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete swipe session: {str(e)}")