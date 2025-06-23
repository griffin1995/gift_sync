"""
GiftSync API v1 Router Configuration

Centralizes all API endpoint routing for the GiftSync application.
This module aggregates all individual endpoint routers into a single
API router with versioned prefix (/api/v1/).

Architecture:
  - Modular endpoint organization by feature area
  - Consistent URL prefix structure (/api/v1/{feature})
  - OpenAPI tag organization for documentation
  - Production-ready router configuration

Features Included:
  - Authentication: User login/register, JWT token management
  - Users: User profile management and preferences
  - Products: Amazon product catalog and search
  - Swipes: User preference collection through swipe interactions
  - Recommendations: AI-powered gift recommendations
  - Gift Links: Shareable gift recommendation links
  - Affiliate: Revenue tracking and commission management

URL Structure:
  - /api/v1/auth/*          # Authentication endpoints
  - /api/v1/users/*         # User management endpoints
  - /api/v1/products/*      # Product catalog endpoints
  - /api/v1/swipes/*        # Swipe interaction endpoints
  - /api/v1/recommendations/* # AI recommendation endpoints
  - /api/v1/gift-links/*    # Gift sharing endpoints
  - /api/v1/affiliate/*     # Affiliate tracking endpoints

Usage:
  from app.api.v1.api import api_router
  app.include_router(api_router, prefix="/api/v1")
"""

from fastapi import APIRouter

# Import all endpoint modules for feature-based organization
from app.api.v1.endpoints import (
    auth,                # Authentication and session management
    users,               # User profile and preferences
    simple_products,     # Amazon product catalog integration
    simple_swipes,       # User preference collection
    recommendations,     # AI-powered gift recommendations
    gift_links,          # Shareable gift links
    affiliate            # Revenue tracking and analytics
)

# ==============================================================================
# API ROUTER CONFIGURATION
# ==============================================================================
# Main API router that aggregates all v1 endpoints

# Create the main API router for version 1
api_router = APIRouter()

# ==============================================================================
# ENDPOINT ROUTER REGISTRATION
# ==============================================================================
# Register all feature-specific routers with consistent URL structure

# Authentication endpoints - user login, registration, token management
api_router.include_router(
    auth.router, 
    prefix="/auth", 
    tags=["authentication"]
)

# User management endpoints - profiles, preferences, settings
api_router.include_router(
    users.router, 
    prefix="/users", 
    tags=["users"]
)

# Product catalog endpoints - Amazon integration, search, categories
api_router.include_router(
    simple_products.router, 
    prefix="/products", 
    tags=["products"]
)

# Swipe interaction endpoints - preference collection, session management
api_router.include_router(
    simple_swipes.router, 
    prefix="/swipes", 
    tags=["swipes"]
)

# AI recommendation endpoints - personalized gift suggestions
api_router.include_router(
    recommendations.router, 
    prefix="/recommendations", 
    tags=["recommendations"]
)

# Gift link endpoints - shareable recommendation links
api_router.include_router(
    gift_links.router, 
    prefix="/gift-links", 
    tags=["gift-links"]
)

# Affiliate tracking endpoints - revenue analytics and commission tracking
api_router.include_router(
    affiliate.router, 
    prefix="/affiliate", 
    tags=["affiliate"]
)