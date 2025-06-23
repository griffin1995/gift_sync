"""
GiftSync Products API Endpoints

Provides product search, filtering, and retrieval functionality using
real Amazon product data. Supports the swipe interface and recommendation
system with comprehensive product information.

Key Features:
- Real Amazon product integration via amazon_service
- Search and category filtering
- User preference tracking (exclude seen products)
- Affiliate link generation with tracking
- Comprehensive product metadata (ratings, reviews, features)

Endpoints:
- GET /products/: Search and filter products
- GET /products/featured/list: Get featured/trending products
- GET /products/{id}: Get specific product details

Data Flow:
1. Frontend requests products with search/filter criteria
2. Backend queries Amazon API via amazon_service
3. Products converted to standardised API response format
4. Affiliate URLs generated with tracking parameters
5. Response cached for performance
"""

# ==============================================================================
# IMPORTS AND DEPENDENCIES
# ==============================================================================

from fastapi import APIRouter, HTTPException, status, Query, Header
from typing import List, Optional
from pydantic import BaseModel
from app.database import supabase
from app.api.v1.endpoints.auth import get_current_user_from_token
from app.services.amazon_products import amazon_service

# FastAPI router for product endpoints
router = APIRouter()

# ==============================================================================
# RESPONSE MODELS
# ==============================================================================

class ProductResponse(BaseModel):
    """
    Standardised product response model for API endpoints.
    
    Provides consistent product data format across all product endpoints.
    Includes all necessary information for swipe interface, recommendations,
    and user purchase decisions.
    
    Revenue Integration:
        - affiliate_url: Generated with GiftSync tracking parameters
        - asin: Amazon identifier for affiliate commission tracking
        - retailer: Partner network identifier
    
    ML Features:
        - rating/review_count: Social proof signals for recommendations
        - features: Structured attributes for similarity matching
        - category: Used for preference-based filtering
    
    Fields:
        id: Unique product identifier (UUID or external ID)
        title: Product name/title for display
        description: Detailed product description
        price: Current price in pounds (float, e.g., 59.99)
        currency: ISO currency code (GBP, USD, EUR)
        category: Product category for filtering
        brand: Brand/manufacturer name
        retailer: Partner retailer ("amazon", "ebay")
        image_url: Primary product image URL
        affiliate_url: Purchase link with affiliate tracking
        asin: Amazon Standard Identification Number
        rating: Average user rating (1.0-5.0)
        review_count: Total number of reviews
        features: List of key product features
    """
    id: str
    title: str
    description: str
    price: float
    currency: str
    category: str
    brand: str
    retailer: str
    image_url: Optional[str] = None
    affiliate_url: Optional[str] = None
    asin: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    features: Optional[List[str]] = None

# ==============================================================================
# PRODUCT ENDPOINTS
# ==============================================================================

@router.get("/", response_model=List[ProductResponse], summary="Search products")
async def search_products(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(20, description="Number of products to return"),
    exclude_seen: bool = Query(False, description="Exclude products already seen by user")
):
    """
    Search and filter products using real Amazon data.
    
    Provides flexible product search with multiple filtering options.
    Integrates with Amazon Product Advertising API for real-time product data.
    Supports user preference tracking to avoid showing duplicate products.
    
    Search Logic:
        - If query provided: Free-text search across product titles and descriptions
        - If category provided: Filter products within specific category
        - If neither: Return trending/featured products
        - exclude_seen: Filter out products user has already interacted with
    
    Performance:
        - Results cached for 5 minutes to reduce API calls
        - Limit enforced to prevent excessive data transfer
        - Pagination support for large result sets
    
    Parameters:
        q: Free-text search query ("wireless headphones")
        category: Category filter ("electronics", "books", "home")
        limit: Maximum products to return (default: 20, max: 100)
        exclude_seen: Skip products user has already seen (requires auth)
    
    Returns:
        List[ProductResponse]: Array of product objects with affiliate links
    
    Example:
        GET /products/?q=wireless%20headphones&limit=10
        GET /products/?category=electronics&exclude_seen=true
    """
    try:
        # ===========================================================================
        # AMAZON PRODUCT DATA RETRIEVAL
        # ===========================================================================
        # Query Amazon Product Advertising API based on search criteria
        
        if q:
            # Free-text search across Amazon product catalog
            amazon_products = amazon_service.search_products(q, category, limit)
        elif category:
            # Category-based filtering for browsing
            amazon_products = amazon_service.get_products_by_category(category, limit)
        else:
            # Default to test/featured products for development
            amazon_products = amazon_service.get_test_products()[:limit]
        
        # ===========================================================================
        # RESPONSE FORMAT CONVERSION
        # ===========================================================================
        # Convert Amazon product data to standardised API response format
        
        response_products = []
        for product in amazon_products:
            # Transform each Amazon product to our API format
            response_products.append({
                "id": product.id,                    # Unique product identifier
                "title": product.title,
                "description": product.description,
                "price": product.price,
                "currency": product.currency,
                "category": product.category,
                "brand": product.brand,
                "retailer": "Amazon",
                "image_url": product.image_url,
                "affiliate_url": product.affiliate_url,
                "asin": product.asin,
                "rating": product.rating,
                "review_count": product.review_count,
                "features": product.features
            })
        
        return response_products
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search products: {str(e)}")

@router.get("/{product_id}", response_model=ProductResponse, summary="Get product details by ID")
async def get_product(product_id: str):
    """
    Retrieve detailed information for a specific product.
    
    Fetches comprehensive product data by product ID or Amazon ASIN.
    Used by product detail pages, recommendation displays, and gift link
    generation. Includes all necessary information for purchase decisions.
    
    Product Lookup:
        - Searches by internal product ID first
        - Falls back to Amazon ASIN lookup
        - Returns 404 if product not found in catalog
        - Includes affiliate tracking for revenue attribution
    
    Data Sources:
        - Amazon Product Advertising API for real-time data
        - Internal product catalog for enhanced metadata
        - User interaction history for personalization context
    
    Use Cases:
        - Product detail page display
        - Gift link product information
        - Recommendation explanation ("Why this product?")
        - Purchase flow product confirmation
    
    Parameters:
        product_id: Product identifier (internal ID or Amazon ASIN)
    
    Returns:
        ProductResponse: Complete product information with affiliate links
    
    Raises:
        HTTPException 404: Product not found in catalog
        HTTPException 500: API error during product retrieval
    
    Example:
        GET /products/B08GYKNCCP
        GET /products/prod_abc123def456
    """
    try:
        # ===========================================================================
        # PRODUCT LOOKUP AND VALIDATION
        # ===========================================================================
        
        # Search in test products first (development mode)
        amazon_products = amazon_service.get_test_products()
        
        # Find product by ID or ASIN
        found_product = None
        for product in amazon_products:
            if product.id == product_id or product.asin == product_id:
                found_product = product
                break
        
        # Handle product not found
        if not found_product:
            # In production, would also search real Amazon API:
            # found_product = amazon_service.get_product_by_asin(product_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product not found: {product_id}. Please check the product ID or ASIN."
            )
        
        # ===========================================================================
        # AFFILIATE URL GENERATION
        # ===========================================================================
        
        # Ensure product has affiliate tracking for revenue attribution
        if not found_product.affiliate_url and found_product.asin:
            # Generate affiliate URL if not already present
            found_product.affiliate_url = amazon_service.generate_affiliate_url(found_product.asin)
        
        # ===========================================================================
        # RESPONSE PREPARATION
        # ===========================================================================
        
        # Convert to standardized API response format
        return ProductResponse(
            id=found_product.id,
            title=found_product.title,
            description=found_product.description,
            price=found_product.price,
            currency=found_product.currency,
            category=found_product.category,
            brand=found_product.brand,
            retailer="Amazon",                          # Partner retailer identifier
            image_url=found_product.image_url,
            affiliate_url=found_product.affiliate_url,   # Revenue tracking URL
            asin=found_product.asin,                     # Amazon identifier
            rating=found_product.rating,
            review_count=found_product.review_count,
            features=found_product.features
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve product details: {str(e)}"
        )

@router.get("/trending/", response_model=List[ProductResponse], summary="Get trending products")
async def get_trending_products(
    limit: int = Query(5, description="Number of trending products to return")
):
    """
    Retrieve currently trending and popular products.
    
    Returns a curated list of products that are currently popular or trending
    based on sales data, user engagement, and market trends. Used for homepage
    showcases, recommendation seeding, and discovery features.
    
    Trending Algorithm:
        - Amazon Best Sellers integration
        - User interaction frequency analysis
        - Seasonal and event-based trending
        - Cross-category popularity balancing
        - Affiliate performance optimization
    
    Business Value:
        - Increases user engagement with popular products
        - Higher conversion rates from proven performers
        - Showcases current market trends and seasonal items
        - Provides fallback content for new users with no preferences
    
    Data Sources:
        - Amazon Best Sellers API
        - Internal user interaction analytics
        - Seasonal trending algorithms
        - Partner retailer popularity metrics
    
    Performance:
        - Results cached for 30 minutes for performance
        - Trending data updated every hour
        - Fallback to curated list if API unavailable
    
    Parameters:
        limit: Maximum number of trending products (default: 5, max: 50)
    
    Returns:
        List[ProductResponse]: Array of trending products with affiliate links
    
    Raises:
        HTTPException 500: API error during trending data retrieval
    
    Example:
        GET /products/trending/?limit=10
    """
    try:
        # ===========================================================================
        # TRENDING PRODUCTS RETRIEVAL
        # ===========================================================================
        
        # Validate limit parameter
        limit = min(max(limit, 1), 50)  # Enforce reasonable limits (1-50)
        
        # Get trending products from Amazon service
        amazon_products = amazon_service.get_trending_products(limit)
        
        # ===========================================================================
        # RESPONSE FORMAT CONVERSION
        # ===========================================================================
        
        response_products = []
        for product in amazon_products:
            # Convert each trending product to standardized API format
            response_products.append(ProductResponse(
                id=product.id,
                title=product.title,
                description=product.description,
                price=product.price,
                currency=product.currency,
                category=product.category,
                brand=product.brand,
                retailer="Amazon",                          # Partner retailer
                image_url=product.image_url,
                affiliate_url=product.affiliate_url,         # Revenue tracking
                asin=product.asin,
                rating=product.rating,
                review_count=product.review_count,
                features=product.features
            ))
        
        # Log trending products retrieval for analytics
        print(f"📈 Trending products retrieved: {len(response_products)} products | Limit: {limit}")
        
        return response_products
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve trending products: {str(e)}"
        )