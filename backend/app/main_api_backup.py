"""
GiftSync API with Supabase integration
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
import uuid

from app.core.config import settings
from app.database import supabase
from app.models import (
    Category, Product, ProductCreate, 
    SwipeSession, SwipeSessionCreate,
    SwipeInteraction, SwipeInteractionCreate,
    Recommendation, RecommendationCreate,
    GiftLink, GiftLinkCreate,
    HealthResponse, ErrorResponse
)
from pydantic import BaseModel, EmailStr
import jwt
import bcrypt
from datetime import timedelta

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="GiftSync API - AI-powered gift recommendation platform",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to GiftSync API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs" if settings.DEBUG else None
    }

@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(),
        version=settings.VERSION
    )

# Authentication Models
class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    date_of_birth: Optional[str] = None
    marketing_consent: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: dict

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    subscription_tier: str = "free"
    created_at: str
    last_login: Optional[str] = None

# Authentication Endpoints
@app.post("/api/v1/auth/register", response_model=AuthResponse)
async def register(user_data: UserRegister):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_users = await supabase.select(
            "users",
            filters={"email": user_data.email},
            use_service_key=True
        )
        if existing_users:
            raise HTTPException(status_code=409, detail="User with this email already exists")
        
        # Hash password (simplified - in production use proper hashing)
        hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user record to match database schema
        user_record = {
            "email": user_data.email,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "full_name": f"{user_data.first_name} {user_data.last_name}",
            "password_hash": hashed_password.decode('utf-8'),
            "subscription_tier": "free",
            "date_of_birth": user_data.date_of_birth,
            "gdpr_consent": True,
            "email_verified": False,
            "last_login_at": datetime.now().isoformat()
        }
        
        # Insert user into database
        created_users = await supabase.insert(
            "users",
            user_record,
            use_service_key=True
        )
        
        created_user = created_users[0]
        
        # Generate tokens (simplified - in production use proper JWT)
        access_token = jwt.encode(
            {"user_id": created_user["id"], "email": created_user["email"]},
            "your-secret-key",  # Use settings.SECRET_KEY in production
            algorithm="HS256"
        )
        refresh_token = jwt.encode(
            {"user_id": created_user["id"], "type": "refresh"},
            "your-secret-key",
            algorithm="HS256"
        )
        
        # Return user data without password
        user_response = {
            "id": created_user["id"],
            "email": created_user["email"],
            "first_name": created_user["first_name"],
            "last_name": created_user["last_name"],
            "subscription_tier": created_user["subscription_tier"],
            "created_at": created_user["created_at"],
            "last_login": created_user["last_login_at"]
        }
        
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/v1/auth/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    """Login user"""
    try:
        # Find user by email
        users = await supabase.select(
            "users",
            select="*",
            filters={"email": credentials.email},
            use_service_key=True
        )
        
        if not users:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user = users[0]
        
        # Verify password (simplified - in production use proper verification)
        if "password_hash" not in user or not user["password_hash"]:
            raise HTTPException(status_code=401, detail="Invalid credentials - no password hash")
        
        if not bcrypt.checkpw(credentials.password.encode('utf-8'), user["password_hash"].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials - password mismatch")
        
        # Update last login
        await supabase.update(
            "users",
            {"last_login_at": datetime.now().isoformat()},
            filters={"id": user["id"]},
            use_service_key=True
        )
        
        # Generate tokens
        access_token = jwt.encode(
            {"user_id": user["id"], "email": user["email"]},
            "your-secret-key",
            algorithm="HS256"
        )
        refresh_token = jwt.encode(
            {"user_id": user["id"], "type": "refresh"},
            "your-secret-key",
            algorithm="HS256"
        )
        
        # Return user data without password
        user_response = {
            "id": user["id"],
            "email": user["email"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "subscription_tier": user["subscription_tier"],
            "created_at": user["created_at"],
            "last_login": user.get("last_login_at", datetime.now().isoformat())
        }
        
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.get("/api/v1/auth/me", response_model=UserResponse)
async def get_current_user():
    """Get current user information (placeholder - needs proper auth middleware)"""
    # This is a placeholder - in production you'd extract user from JWT token
    return UserResponse(
        id="test-user-id",
        email="test@example.com",
        first_name="Test",
        last_name="User",
        subscription_tier="free",
        created_at=datetime.now().isoformat()
    )

@app.post("/api/v1/auth/logout")
async def logout():
    """Logout user"""
    return {"message": "Logged out successfully"}

@app.post("/api/v1/auth/refresh", response_model=AuthResponse)
async def refresh_token():
    """Refresh access token (placeholder)"""
    # Placeholder implementation
    return AuthResponse(
        access_token="new-access-token",
        refresh_token="new-refresh-token",
        user={"id": "test", "email": "test@example.com"}
    )

# Categories endpoints
@app.get("/api/v1/categories", response_model=List[Category])
async def get_categories(
    limit: int = Query(50, le=100),
    active_only: bool = Query(True)
):
    """Get all categories"""
    try:
        filters = {"is_active": True} if active_only else None
        categories = await supabase.select(
            "categories", 
            select="*",
            filters=filters,
            limit=limit
        )
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/categories/{category_id}", response_model=Category)
async def get_category(category_id: str):
    """Get a specific category"""
    try:
        categories = await supabase.select(
            "categories",
            filters={"id": category_id}
        )
        if not categories:
            raise HTTPException(status_code=404, detail="Category not found")
        return categories[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Products endpoints
@app.get("/api/v1/products", response_model=List[Product])
async def get_products(
    limit: int = Query(20, le=100),
    category_id: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    search: Optional[str] = Query(None)
):
    """Get products with optional filtering"""
    try:
        filters = {"is_active": True}
        if category_id:
            filters["category_id"] = category_id
        
        # Note: For production, implement proper search and price filtering
        products = await supabase.select(
            "products",
            select="*",
            filters=filters,
            limit=limit
        )
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a specific product"""
    try:
        products = await supabase.select(
            "products",
            filters={"id": product_id, "is_active": True}
        )
        if not products:
            raise HTTPException(status_code=404, detail="Product not found")
        return products[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/products", response_model=Product)
async def create_product(product: ProductCreate):
    """Create a new product (admin only for now)"""
    try:
        product_data = product.dict()
        created_products = await supabase.insert(
            "products", 
            product_data, 
            use_service_key=True
        )
        return created_products[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Users endpoints
@app.post("/api/v1/users", response_model=dict)
async def create_user(user_data: dict):
    """Create a new user (for testing)"""
    try:
        # Generate UUID for user_id if not provided
        if 'id' not in user_data:
            user_data['id'] = str(uuid.uuid4())
        
        created_users = await supabase.insert(
            "users",
            user_data,
            use_service_key=True
        )
        return created_users[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/users/{user_id}")
async def get_user(user_id: str):
    """Get a user by ID"""
    try:
        users = await supabase.select(
            "users",
            filters={"id": user_id}
        )
        if not users:
            raise HTTPException(status_code=404, detail="User not found")
        return users[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Swipe sessions endpoints
@app.post("/api/v1/swipe-sessions", response_model=SwipeSession)
async def create_swipe_session(session: SwipeSessionCreate):
    """Create a new swipe session"""
    try:
        session_data = session.dict()
        
        # Ensure user_id is a valid UUID and user exists
        user_id = session_data.get('user_id')
        if user_id:
            # Check if user exists
            try:
                users = await supabase.select("users", filters={"id": user_id}, limit=1)
                if not users:
                    # User doesn't exist, create a minimal user record
                    await supabase.insert(
                        "users",
                        {
                            "id": user_id,
                            "email": f"{user_id}@test.com",
                            "subscription_tier": "free",
                            "gdpr_consent": True
                        },
                        use_service_key=True
                    )
            except Exception as user_error:
                raise HTTPException(status_code=400, detail=f"User validation failed: {str(user_error)}")
        
        created_sessions = await supabase.insert(
            "swipe_sessions",
            session_data,
            use_service_key=True
        )
        return created_sessions[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/swipe-sessions/{session_id}", response_model=SwipeSession)
async def get_swipe_session(session_id: str):
    """Get a specific swipe session"""
    try:
        sessions = await supabase.select(
            "swipe_sessions",
            filters={"id": session_id}
        )
        if not sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        return sessions[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/swipe-interactions", response_model=SwipeInteraction)
async def create_swipe_interaction(interaction: SwipeInteractionCreate):
    """Record a swipe interaction"""
    try:
        interaction_data = interaction.dict()
        created_interactions = await supabase.insert(
            "swipe_interactions",
            interaction_data,
            use_service_key=True
        )
        return created_interactions[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/sessions/{session_id}/interactions", response_model=List[SwipeInteraction])
async def get_session_interactions(
    session_id: str,
    limit: int = Query(50, le=200)
):
    """Get all interactions for a session"""
    try:
        interactions = await supabase.select(
            "swipe_interactions",
            select="*",
            filters={"session_id": session_id},
            limit=limit
        )
        return interactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Recommendations endpoint
@app.get("/api/v1/users/{user_id}/recommendations", response_model=List[Recommendation])
async def get_user_recommendations(
    user_id: str,
    limit: int = Query(10, le=50),
    session_id: Optional[str] = Query(None)
):
    """Get recommendations for a user"""
    try:
        filters = {"user_id": user_id}
        if session_id:
            filters["session_id"] = session_id
            
        recommendations = await supabase.select(
            "recommendations",
            select="*",
            filters=filters,
            limit=limit
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/recommendations", response_model=Recommendation)
async def create_recommendation(recommendation: RecommendationCreate):
    """Create a new recommendation"""
    try:
        rec_data = recommendation.dict()
        created_recs = await supabase.insert(
            "recommendations",
            rec_data,
            use_service_key=True
        )
        return created_recs[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Gift links endpoints
@app.post("/api/v1/gift-links", response_model=GiftLink)
async def create_gift_link(gift_link: GiftLinkCreate):
    """Create a new gift link"""
    try:
        link_data = gift_link.dict()
        link_data["link_token"] = str(uuid.uuid4())  # Generate unique token
        link_data["is_active"] = True  # Ensure link is active by default
        
        # Check if user exists, create if not (for testing)
        user_id = link_data.get('user_id')
        if user_id:
            try:
                users = await supabase.select("users", filters={"id": user_id}, limit=1)
                if not users:
                    await supabase.insert(
                        "users",
                        {
                            "id": user_id,
                            "email": f"{user_id}@test.com",
                            "subscription_tier": "free",
                            "gdpr_consent": True
                        },
                        use_service_key=True
                    )
            except Exception:
                pass  # Continue if user creation fails
        
        created_links = await supabase.insert(
            "gift_links",
            link_data,
            use_service_key=True
        )
        return created_links[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/gift-links/{link_token}", response_model=GiftLink)
async def get_gift_link(link_token: str):
    """Get a gift link by token"""
    try:
        # First try without is_active filter to see if link exists at all
        all_links = await supabase.select(
            "gift_links",
            filters={"link_token": link_token}
        )
        
        # Then filter for active links
        links = await supabase.select(
            "gift_links",
            filters={"link_token": link_token, "is_active": True}
        )
        
        if not all_links:
            raise HTTPException(status_code=404, detail=f"Gift link {link_token} not found in database")
        elif not links:
            raise HTTPException(status_code=404, detail=f"Gift link {link_token} exists but is not active")
        
        return links[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analytics endpoint
@app.post("/api/v1/analytics/track")
async def track_event(event_data: dict):
    """Track analytics event (placeholder for development)"""
    # For now, just log the event - in production this would save to analytics system
    print(f"Analytics Event: {event_data}")
    return {"status": "tracked", "event": event_data.get("event_name", "unknown")}

@app.get("/api/v1/analytics/dashboard")
async def get_analytics_dashboard():
    """Get basic analytics dashboard data"""
    try:
        # Get basic counts
        categories = await supabase.select("categories", select="id", limit=1000)
        products = await supabase.select("products", select="id", filters={"is_active": True}, limit=1000)
        sessions = await supabase.select("swipe_sessions", select="id", limit=1000)
        interactions = await supabase.select("swipe_interactions", select="id", limit=1000)
        
        return {
            "total_categories": len(categories),
            "total_products": len(products),
            "total_sessions": len(sessions),
            "total_interactions": len(interactions),
            "status": "operational",
            "last_updated": datetime.now()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)