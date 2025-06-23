"""
GiftSync Swipe Interaction API Endpoints

Manages user preference collection through swipe-based interactions with products.
Tracks user engagement patterns, session data, and preference learning for AI
recommendation optimization and personalization.

Key Features:
  - Swipe interaction recording (like/dislike)
  - Session management and analytics
  - User preference pattern tracking
  - Real-time engagement monitoring
  - A/B testing support for swipe interfaces

Business Intelligence:
  - User preference learning for AI recommendations
  - Engagement pattern analysis for UX optimization
  - Session duration and completion rate tracking
  - Product category preference identification
  - Conversion funnel analytics from swipe to purchase

API Endpoints:
  - POST /swipes/                    # Record individual swipe interactions
  - GET /swipes/sessions             # Get user's swipe session history
  - POST /swipes/sessions            # Start new swipe session

Data Flow:
  1. User starts swipe session in frontend
  2. Each swipe interaction recorded via API
  3. Session analytics calculated in real-time
  4. Preference data feeds AI recommendation engine
  5. Engagement metrics tracked for optimization

Integration Points:
  - Recommendation engine: Feeds preference data
  - Analytics dashboard: Session and engagement metrics
  - A/B testing: Interface variant performance
  - User profiles: Preference history and patterns
"""

from fastapi import APIRouter, HTTPException, status, Header
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.database import supabase
from app.api.v1.endpoints.auth import get_current_user_from_token

# Create router for swipe interaction endpoints
router = APIRouter()

# ==============================================================================
# REQUEST/RESPONSE MODELS
# ==============================================================================
# Pydantic models for request validation and response serialization

class SwipeRequest(BaseModel):
    """
    Swipe interaction request model for recording user preferences.
    
    Used when users swipe on products to indicate their preference.
    Captures the essential data needed for preference learning and
    recommendation optimization.
    
    Fields:
        product_id: Amazon ASIN or internal product identifier
        direction: Swipe direction ('like', 'dislike', 'super_like')
        session_id: Optional session identifier for analytics grouping
    
    Validation:
        - product_id must be valid ASIN format or internal ID
        - direction must be one of allowed values
        - session_id optional for anonymous or session-less swipes
    
    Example:
        {
            "product_id": "B08GYKNCCP",
            "direction": "like",
            "session_id": "session_abc123"
        }
    """
    product_id: str                        # Amazon ASIN or product identifier
    direction: str                         # 'like', 'dislike', or 'super_like'
    session_id: Optional[str] = None       # Optional session grouping

class SwipeResponse(BaseModel):
    """
    Swipe interaction response model confirming recorded preference.
    
    Returns confirmation data after successfully recording a swipe
    interaction. Used by frontend to confirm the action was processed
    and for local state management.
    
    Fields:
        id: Unique identifier for this swipe record
        product_id: Product that was swiped on
        direction: Direction of the swipe interaction
        timestamp: ISO timestamp when swipe was recorded
        session_id: Session identifier if part of session
    
    Example:
        {
            "id": "swipe_1704067200123",
            "product_id": "B08GYKNCCP",
            "direction": "like",
            "timestamp": "2024-01-01T00:00:00.123Z",
            "session_id": "session_abc123"
        }
    """
    id: str                                # Unique swipe record identifier
    product_id: str                        # Product identifier
    direction: str                         # Swipe direction
    timestamp: str                         # ISO timestamp of interaction
    session_id: Optional[str] = None       # Optional session identifier

class SwipeSessionResponse(BaseModel):
    """
    Swipe session analytics response model.
    
    Provides comprehensive session statistics for user engagement
    analysis and frontend dashboard display. Used for showing
    user progress and session completion metrics.
    
    Fields:
        id: Unique session identifier
        user_id: User who owns this session
        created_at: Session start timestamp
        total_swipes: Total number of swipes in session
        likes: Number of positive swipes (likes)
        dislikes: Number of negative swipes (dislikes)
    
    Analytics Use:
        - Session completion rates
        - User engagement depth
        - Preference ratio analysis
        - Time-based engagement patterns
    
    Example:
        {
            "id": "session_abc123",
            "user_id": "user_def456",
            "created_at": "2024-01-01T00:00:00Z",
            "total_swipes": 25,
            "likes": 15,
            "dislikes": 10
        }
    """
    id: str                                # Session identifier
    user_id: str                           # User identifier
    created_at: str                        # Session start timestamp
    total_swipes: int                      # Total interaction count
    likes: int                             # Positive swipe count
    dislikes: int                          # Negative swipe count

# ==============================================================================
# SWIPE INTERACTION ENDPOINTS
# ==============================================================================

@router.post("/", response_model=SwipeResponse, summary="Record swipe interaction")
async def record_swipe(
    swipe_data: SwipeRequest,
    authorization: str = Header(None)
):
    """
    Record user swipe interaction for preference learning and analytics.
    
    Captures individual swipe interactions to build user preference profiles
    and feed the AI recommendation engine. Each swipe provides valuable data
    about user preferences, engagement patterns, and product categories.
    
    Business Value:
        - Builds user preference profiles for personalized recommendations
        - Tracks engagement patterns for UX optimization
        - Provides data for A/B testing different swipe interfaces
        - Enables conversion funnel analysis from swipe to purchase
    
    Data Processing:
        1. Validates user authentication and swipe data
        2. Records swipe interaction with timestamp and session context
        3. Updates user preference profile asynchronously
        4. Triggers recommendation engine updates
        5. Logs analytics event for dashboard metrics
    
    Authentication:
        - Requires valid JWT token in Authorization header
        - Associates swipe with authenticated user profile
        - Supports anonymous swipes for guest users (limited features)
    
    Parameters:
        swipe_data: SwipeRequest containing product and preference data
        authorization: JWT token in "Bearer <token>" format
    
    Returns:
        SwipeResponse: Confirmation with unique swipe ID and metadata
    
    Raises:
        HTTPException 401: Missing or invalid authorization
        HTTPException 400: Invalid swipe data or product ID
        HTTPException 500: Database error during swipe recording
    
    Example:
        POST /swipes/
        Authorization: Bearer <jwt_token>
        {
            "product_id": "B08GYKNCCP",
            "direction": "like",
            "session_id": "session_abc123"
        }
    """
    # ===========================================================================
    # AUTHENTICATION VALIDATION
    # ===========================================================================
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required for swipe tracking"
        )
    
    try:
        # ===========================================================================
        # USER CONTEXT AND VALIDATION
        # ===========================================================================
        
        # Extract user information from JWT token
        current_user = await get_current_user_from_token(authorization)
        user_id = current_user["id"]
        
        # ===========================================================================
        # SWIPE DATA VALIDATION
        # ===========================================================================
        
        # Validate swipe direction
        allowed_directions = ["like", "dislike", "super_like"]
        if swipe_data.direction not in allowed_directions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid swipe direction. Must be one of: {allowed_directions}"
            )
        
        # Generate unique swipe identifier
        timestamp = datetime.now()
        swipe_id = f"swipe_{int(timestamp.timestamp() * 1000)}"  # Millisecond precision
        
        # ===========================================================================
        # DATABASE RECORDING (TODO: IMPLEMENT WITH REAL DATABASE)
        # ===========================================================================
        # Future implementation will store swipe data for analytics and ML:
        # 
        # swipe_record = {
        #     "id": swipe_id,
        #     "user_id": user_id,
        #     "product_id": swipe_data.product_id,
        #     "direction": swipe_data.direction,
        #     "session_id": swipe_data.session_id,
        #     "timestamp": timestamp.isoformat(),
        #     "ip_address": request.client.host,
        #     "user_agent": request.headers.get("User-Agent"),
        #     "platform": "web"  # Could be detected from user agent
        # }
        # 
        # await supabase.insert("swipe_interactions", swipe_record)
        
        # Log swipe for development and debugging
        print(f"👍 Swipe recorded: {swipe_id} | User: {user_id} | Product: {swipe_data.product_id} | Direction: {swipe_data.direction}")
        
        # ===========================================================================
        # PREFERENCE LEARNING (TODO: IMPLEMENT)
        # ===========================================================================
        # Future implementation will update user preference model:
        # - Update category preferences based on product category
        # - Adjust price range preferences
        # - Update brand preferences
        # - Trigger ML model retraining if needed
        
        # ===========================================================================
        # RESPONSE PREPARATION
        # ===========================================================================
        
        return SwipeResponse(
            id=swipe_id,
            product_id=swipe_data.product_id,
            direction=swipe_data.direction,
            timestamp=timestamp.isoformat() + "Z",  # ISO format with UTC timezone
            session_id=swipe_data.session_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record swipe interaction: {str(e)}"
        )

@router.get("/sessions", response_model=List[SwipeSessionResponse], summary="Get user swipe sessions")
async def get_swipe_sessions(
    authorization: str = Header(None)
):
    """
    Retrieve user's swipe session history and analytics.
    
    Returns comprehensive session data for user engagement analysis,
    progress tracking, and dashboard display. Used by frontend components
    to show session history, completion rates, and preference patterns.
    
    Session Analytics:
        - Historical session data with engagement metrics
        - Preference ratios (like/dislike rates) per session
        - Session duration and completion analysis
        - Time-based engagement patterns
        - Progress tracking for recommendation accuracy
    
    Business Intelligence:
        - User engagement depth and frequency
        - Session completion rate optimization
        - A/B testing results for different session lengths
        - Conversion correlation from swipe patterns to purchases
    
    Authentication:
        - Requires valid JWT token for user identification
        - Returns only sessions belonging to authenticated user
        - Respects user privacy and data access controls
    
    Parameters:
        authorization: JWT token in "Bearer <token>" format
    
    Returns:
        List[SwipeSessionResponse]: Array of session data with analytics
    
    Raises:
        HTTPException 401: Missing or invalid authorization
        HTTPException 500: Database error during session retrieval
    
    Example Response:
        [
            {
                "id": "session_abc123",
                "user_id": "user_def456",
                "created_at": "2024-01-01T10:00:00Z",
                "total_swipes": 25,
                "likes": 15,
                "dislikes": 10
            }
        ]
    """
    # ===========================================================================
    # AUTHENTICATION VALIDATION
    # ===========================================================================
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required for session data access"
        )
    
    try:
        # ===========================================================================
        # USER CONTEXT EXTRACTION
        # ===========================================================================
        
        # Get current user from JWT token
        current_user = await get_current_user_from_token(authorization)
        user_id = current_user["id"]
        
        # ===========================================================================
        # SESSION DATA RETRIEVAL (TODO: IMPLEMENT WITH REAL DATABASE)
        # ===========================================================================
        # Future implementation will query database for real session data:
        # 
        # sessions_query = await supabase.select(
        #     "swipe_sessions",
        #     select="id,user_id,created_at,total_swipes,likes,dislikes,completed_at",
        #     filters={"user_id": user_id},
        #     order_by="created_at DESC",
        #     limit=50  # Limit to recent sessions
        # )
        
        # For development, return realistic mock session data
        mock_sessions = [
            SwipeSessionResponse(
                id="session_recent_001",
                user_id=user_id,
                created_at="2024-01-15T14:30:00Z",
                total_swipes=25,
                likes=15,
                dislikes=10
            ),
            SwipeSessionResponse(
                id="session_recent_002", 
                user_id=user_id,
                created_at="2024-01-14T10:15:00Z",
                total_swipes=18,
                likes=12,
                dislikes=6
            ),
            SwipeSessionResponse(
                id="session_recent_003",
                user_id=user_id, 
                created_at="2024-01-13T16:45:00Z",
                total_swipes=32,
                likes=20,
                dislikes=12
            )
        ]
        
        return mock_sessions
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve swipe sessions: {str(e)}"
        )

@router.post("/sessions", summary="Start new swipe session")
async def start_swipe_session(
    authorization: str = Header(None)
):
    """
    Initialize a new swipe session for user engagement tracking.
    
    Creates a new session container for grouping swipe interactions
    and tracking user engagement patterns. Used by frontend when
    users begin a new product discovery session.
    
    Session Management:
        - Creates unique session identifier for interaction grouping
        - Initializes session metadata and tracking parameters
        - Sets up analytics collection for this session
        - Establishes baseline for engagement measurement
    
    Business Value:
        - Enables session-based analytics and completion rate tracking
        - Provides context for recommendation algorithm optimization
        - Supports A/B testing of different session configurations
        - Creates engagement funnel data for conversion analysis
    
    Session Features:
        - Unique session ID for tracking related interactions
        - Timestamp tracking for session duration analysis
        - User context for personalized session management
        - Status tracking for session lifecycle management
    
    Authentication:
        - Requires valid JWT token for user association
        - Sessions are tied to specific user accounts
        - Anonymous sessions not supported (require login)
    
    Parameters:
        authorization: JWT token in "Bearer <token>" format
    
    Returns:
        dict: Session initialization data with unique session ID
    
    Raises:
        HTTPException 401: Missing or invalid authorization
        HTTPException 500: Database error during session creation
    
    Example Response:
        {
            "session_id": "session_1704067200123",
            "user_id": "user_def456",
            "started_at": "2024-01-01T00:00:00.123Z",
            "status": "active",
            "expected_swipes": 20,
            "session_type": "discovery"
        }
    """
    # ===========================================================================
    # AUTHENTICATION VALIDATION  
    # ===========================================================================
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required for session creation"
        )
    
    try:
        # ===========================================================================
        # USER CONTEXT EXTRACTION
        # ===========================================================================
        
        # Get current user from JWT token
        current_user = await get_current_user_from_token(authorization)
        user_id = current_user["id"]
        
        # ===========================================================================
        # SESSION INITIALIZATION
        # ===========================================================================
        
        # Generate unique session identifier with timestamp precision
        timestamp = datetime.now()
        session_id = f"session_{int(timestamp.timestamp() * 1000)}"  # Millisecond precision
        
        # ===========================================================================
        # DATABASE SESSION CREATION (TODO: IMPLEMENT WITH REAL DATABASE)
        # ===========================================================================
        # Future implementation will create session record in database:
        # 
        # session_record = {
        #     "id": session_id,
        #     "user_id": user_id,
        #     "started_at": timestamp.isoformat(),
        #     "status": "active",
        #     "session_type": "discovery",  # discovery, targeted, quick_swipe
        #     "expected_swipes": 20,        # Target swipe count for this session
        #     "platform": "web",            # Platform context
        #     "device_info": request.headers.get("User-Agent"),
        #     "ip_address": request.client.host
        # }
        # 
        # await supabase.insert("swipe_sessions", session_record)
        
        # Log session start for development and debugging
        print(f"🎯 New swipe session started: {session_id} | User: {user_id} | Time: {timestamp.isoformat()}")
        
        # ===========================================================================
        # SESSION RESPONSE PREPARATION
        # ===========================================================================
        
        return {
            "session_id": session_id,                       # Unique session identifier
            "user_id": user_id,                             # User who owns this session
            "started_at": timestamp.isoformat() + "Z",      # Session start time (ISO format)
            "status": "active",                             # Session lifecycle status
            "expected_swipes": 20,                          # Target engagement level
            "session_type": "discovery",                    # Type of swipe session
            "expires_at": None                              # No automatic expiration
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start swipe session: {str(e)}"
        )