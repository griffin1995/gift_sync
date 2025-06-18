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

# Swipe sessions endpoints
@app.post("/api/v1/swipe-sessions", response_model=SwipeSession)
async def create_swipe_session(session: SwipeSessionCreate):
    """Create a new swipe session"""
    try:
        session_data = session.dict()
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
        links = await supabase.select(
            "gift_links",
            filters={"link_token": link_token, "is_active": True}
        )
        if not links:
            raise HTTPException(status_code=404, detail="Gift link not found")
        return links[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analytics endpoint
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