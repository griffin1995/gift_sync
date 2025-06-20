from fastapi import APIRouter

from app.api.v1.endpoints import auth

api_router = APIRouter()

# Include auth router only for now (other endpoints need SQLAlchemy models)
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

# TODO: Re-enable other routers once SQLAlchemy models are implemented or
# TODO: Convert other endpoints to use Supabase like auth does
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(swipes.router, prefix="/swipes", tags=["swipes"])
# api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
# api_router.include_router(products.router, prefix="/products", tags=["products"])
# api_router.include_router(gift_links.router, prefix="/gift-links", tags=["gift-links"])