from fastapi import APIRouter, HTTPException, status, Header
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.database import supabase
from app.api.v1.endpoints.auth import get_current_user_from_token

router = APIRouter()

class SwipeRequest(BaseModel):
    product_id: str
    direction: str  # 'like' or 'dislike'
    session_id: Optional[str] = None

class SwipeResponse(BaseModel):
    id: str
    product_id: str
    direction: str
    timestamp: str
    session_id: Optional[str] = None

class SwipeSessionResponse(BaseModel):
    id: str
    user_id: str
    created_at: str
    total_swipes: int
    likes: int
    dislikes: int

@router.post("/", response_model=SwipeResponse, summary="Record a swipe")
async def record_swipe(
    swipe_data: SwipeRequest,
    authorization: str = Header(None)
):
    """Record a swipe interaction."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    try:
        # Get current user from token
        current_user = await get_current_user_from_token(authorization)
        
        # Create swipe record (mock for now)
        swipe_id = f"swipe_{datetime.now().timestamp()}"
        
        return SwipeResponse(
            id=swipe_id,
            product_id=swipe_data.product_id,
            direction=swipe_data.direction,
            timestamp=datetime.now().isoformat(),
            session_id=swipe_data.session_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record swipe: {str(e)}")

@router.get("/sessions", response_model=List[SwipeSessionResponse], summary="Get swipe sessions")
async def get_swipe_sessions(
    authorization: str = Header(None)
):
    """Get user's swipe sessions."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    try:
        # Get current user from token
        current_user = await get_current_user_from_token(authorization)
        
        # Return mock session data
        return [
            SwipeSessionResponse(
                id="session_1",
                user_id=current_user["id"],
                created_at=datetime.now().isoformat(),
                total_swipes=25,
                likes=15,
                dislikes=10
            )
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get sessions: {str(e)}")

@router.post("/sessions", summary="Start new swipe session")
async def start_swipe_session(
    authorization: str = Header(None)
):
    """Start a new swipe session."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    try:
        # Get current user from token
        current_user = await get_current_user_from_token(authorization)
        
        # Create new session (mock for now)
        session_id = f"session_{datetime.now().timestamp()}"
        
        return {
            "session_id": session_id,
            "user_id": current_user["id"],
            "started_at": datetime.now().isoformat(),
            "status": "active"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start session: {str(e)}")