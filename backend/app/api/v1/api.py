from fastapi import APIRouter

from app.api.v1.endpoints import auth
from app.api.v1.endpoints import products_simple
from app.api.v1.endpoints import categories_simple
from app.api.v1.endpoints import swipes_simple
from app.api.v1.endpoints import recommendations_simple

api_router = APIRouter()

# Include working Supabase-based routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(products_simple.router, prefix="/products", tags=["products"])
api_router.include_router(categories_simple.router, prefix="/categories", tags=["categories"])
api_router.include_router(swipes_simple.router, prefix="/swipes", tags=["swipes"])
api_router.include_router(recommendations_simple.router, prefix="/recommendations", tags=["recommendations"])

# TODO: Implement remaining endpoints with Supabase pattern
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(swipes.router, prefix="/swipes", tags=["swipes"])
# api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
# api_router.include_router(gift_links.router, prefix="/gift-links", tags=["gift-links"])