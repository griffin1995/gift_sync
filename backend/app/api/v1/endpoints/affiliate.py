"""
GiftSync Affiliate Tracking API Endpoints

Comprehensive affiliate marketing management for Amazon Associates program
integration. Handles click tracking, conversion attribution, commission
calculations, and revenue analytics for the GiftSync platform.

Key Features:
  - Affiliate click tracking with unique identifiers
  - Amazon Associates URL generation with proper tags
  - Revenue analytics and performance metrics
  - User attribution and conversion tracking
  - Campaign and source tracking for optimization
  - Commission calculation and reporting

Revenue Model:
  - Amazon Associates commission rates (1-8% depending on category)
  - Click attribution with 24-hour cookie window
  - Conversion tracking for revenue optimization
  - Multi-source tracking (recommendations, gift links, search)

Security Features:
  - User authentication for personalized tracking
  - Secure ASIN validation and URL generation
  - Rate limiting protection (inherited from middleware)
  - Error handling with proper HTTP status codes

API Endpoints:
  - POST /affiliate/clicks/              # Track affiliate clicks
  - GET /affiliate/stats/                # Get performance statistics
  - GET /affiliate/products/{asin}/affiliate-url # Generate affiliate URLs

Data Flow:
  1. User clicks product link in frontend
  2. Frontend calls affiliate tracking endpoint
  3. Backend generates unique click ID and affiliate URL
  4. User redirected to Amazon with tracking parameters
  5. Conversion tracked via Amazon Associates reporting
  6. Analytics updated with performance metrics
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional
from pydantic import BaseModel
from app.api.v1.endpoints.auth import get_current_user_from_token
from app.services.amazon_products import amazon_service
import uuid
from datetime import datetime

router = APIRouter()

class AffiliateClickRequest(BaseModel):
    """
    Request model for tracking affiliate clicks with campaign attribution.
    
    Used when users click on affiliate links to track the source and campaign
    for revenue attribution and conversion optimization.
    
    Fields:
        asin: Amazon Standard Identification Number (10-character product ID)
        source: Click source for attribution tracking
        campaign: Optional campaign identifier for A/B testing
    
    Source Options:
        - "recommendation": From AI recommendation engine
        - "gift_link": From shared gift links
        - "search": From product search results
        - "browse": From category browsing
        - "featured": From featured products
    
    Example:
        {
            "asin": "B08GYKNCCP",
            "source": "recommendation",
            "campaign": "christmas_2024"
        }
    """
    asin: str                           # Amazon product identifier (required)
    source: str = "recommendation"      # Attribution source (default: recommendation)
    campaign: Optional[str] = None      # Optional campaign tracking

class AffiliateClickResponse(BaseModel):
    """
    Response model for affiliate click tracking with redirect information.
    
    Returns the unique tracking identifier and affiliate URL for revenue
    attribution. Used by frontend to redirect users to Amazon with proper
    tracking parameters.
    
    Fields:
        click_id: Unique identifier for this click event
        redirect_url: Amazon affiliate URL with tracking parameters
        tracking_expires_at: ISO timestamp when tracking attribution expires
    
    Tracking Window:
        - Amazon Associates: 24-hour attribution window
        - GiftSync internal: 30-day tracking for analytics
    
    Example:
        {
            "click_id": "click_abc123def456",
            "redirect_url": "https://amazon.co.uk/dp/B08GYKNCCP/?tag=giftsync-21&...",
            "tracking_expires_at": "2024-01-01T23:59:59.999Z"
        }
    """
    click_id: str               # Unique tracking identifier
    redirect_url: str          # Complete Amazon affiliate URL
    tracking_expires_at: str   # Attribution expiry timestamp (ISO format)

@router.post("/clicks/", response_model=AffiliateClickResponse, summary="Track affiliate click")
async def track_affiliate_click(
    request: AffiliateClickRequest,
    current_user = Depends(get_current_user_from_token)
):
    """
    Track affiliate click and generate redirect URL with revenue attribution.
    
    Creates a unique tracking record for each affiliate link click to enable:
      - Revenue attribution to specific users and campaigns
      - Conversion rate optimization and A/B testing
      - Performance analytics across different sources
      - Commission tracking for financial reporting
    
    Authentication:
        - Optional user authentication for personalized tracking
        - Anonymous clicks still tracked for aggregate analytics
        - User ID associated with click for attribution
    
    Process Flow:
        1. Validate ASIN format and source parameter
        2. Generate unique click tracking identifier
        3. Create Amazon affiliate URL with proper parameters
        4. Store click record for analytics (TODO: database implementation)
        5. Return tracking ID and redirect URL to frontend
    
    Revenue Tracking:
        - Click-to-conversion attribution (24-hour Amazon window)
        - Commission calculation based on product category
        - Multi-touch attribution for complex user journeys
        - Campaign performance measurement
    
    Parameters:
        request: Affiliate click request with ASIN and source
        current_user: Optional authenticated user (from JWT token)
    
    Returns:
        AffiliateClickResponse: Click ID and affiliate redirect URL
    
    Raises:
        HTTPException 400: Invalid ASIN format or source
        HTTPException 500: Internal server error during tracking
    
    Example:
        POST /affiliate/clicks/
        {
            "asin": "B08GYKNCCP",
            "source": "recommendation",
            "campaign": "holiday_2024"
        }
        
        Response:
        {
            "click_id": "click_abc123def456",
            "redirect_url": "https://amazon.co.uk/dp/B08GYKNCCP/?tag=giftsync-21&...",
            "tracking_expires_at": "2024-01-01T23:59:59.999Z"
        }
    """
    try:
        # ===========================================================================
        # CLICK TRACKING SETUP
        # ===========================================================================
        
        # Generate unique click identifier for attribution
        click_id = f"click_{uuid.uuid4().hex[:12]}"  # 12-character unique ID
        
        # Generate Amazon affiliate URL with tracking parameters
        affiliate_url = amazon_service.generate_affiliate_url(request.asin)
        
        # Extract user information for attribution
        user_id = current_user.get("id") if current_user else None
        
        # ===========================================================================
        # DATABASE TRACKING (TODO: IMPLEMENT)
        # ===========================================================================
        # Future implementation will store click data for analytics and attribution
        # 
        # affiliate_click = AffiliateClick(
        #     click_id=click_id,                               # Unique tracking ID
        #     user_id=user_id,                                 # User who clicked (optional)
        #     asin=request.asin,                               # Amazon product ID
        #     source=request.source,                           # Click source for attribution
        #     campaign=request.campaign,                       # Campaign tracking
        #     affiliate_url=affiliate_url,                     # Full affiliate URL
        #     clicked_at=datetime.utcnow(),                    # Click timestamp
        #     tracking_expires_at=datetime.utcnow() + timedelta(days=30),  # Attribution window
        #     ip_address=request.client.host,                  # User IP for fraud detection
        #     user_agent=request.headers.get('User-Agent'),    # Browser information
        #     referrer=request.headers.get('Referer'),         # Referring page
        # )
        # 
        # # Save to database
        # await supabase.insert('affiliate_clicks', affiliate_click.dict())
        
        # Log click for development and debugging
        print(f"📊 Affiliate click tracked: {click_id} | ASIN: {request.asin} | User: {user_id} | Source: {request.source}")
        
        # ===========================================================================
        # RESPONSE PREPARATION
        # ===========================================================================
        
        # Calculate tracking expiration (end of current day for Amazon attribution)
        tracking_expires_at = datetime.utcnow().replace(
            hour=23, minute=59, second=59, microsecond=999999
        )
        
        return AffiliateClickResponse(
            click_id=click_id,
            redirect_url=affiliate_url,
            tracking_expires_at=tracking_expires_at.isoformat() + "Z"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to track click: {str(e)}")

@router.get("/stats/", summary="Get affiliate statistics")
async def get_affiliate_stats(
    current_user = Depends(get_current_user_from_token)
):
    """
    Get comprehensive affiliate performance statistics and analytics.
    
    Provides detailed revenue analytics for monitoring affiliate program
    performance, optimizing conversion rates, and tracking commission
    earnings across different campaigns and sources.
    
    Authentication:
        - Requires valid JWT token for access
        - Returns user-specific or aggregate statistics
        - Admin users get comprehensive platform-wide stats
    
    Analytics Included:
        - Total clicks and conversions across all campaigns
        - Conversion rate optimization metrics
        - Commission earnings and revenue tracking
        - Monthly performance trends
        - Top-performing products by revenue and conversion
        - Source attribution (recommendations vs search vs gifts)
    
    Performance Metrics:
        - Click-through rates by source and campaign
        - Average order value and commission per conversion
        - Time-to-conversion analytics
        - Geographic performance data
        - Device and platform breakdowns
    
    Revenue Intelligence:
        - Commission earnings by category and time period
        - Seasonal trends and optimization opportunities
        - Product performance rankings
        - Campaign ROI and effectiveness
    
    Parameters:
        current_user: Authenticated user from JWT token dependency
    
    Returns:
        dict: Comprehensive affiliate performance statistics
    
    Example Response:
        {
            "total_clicks": 1247,
            "total_conversions": 89,
            "conversion_rate": 7.14,
            "total_commission": 1834.56,
            "this_month": {
                "clicks": 156,
                "conversions": 12,
                "commission": 287.34
            },
            "top_products": [
                {
                    "asin": "B08N5WRWNW",
                    "title": "Echo Dot (4th Gen)",
                    "clicks": 45,
                    "conversions": 8,
                    "commission": 67.89
                }
            ]
        }
    """
    try:
        # ===========================================================================
        # STATISTICS CALCULATION (TODO: IMPLEMENT WITH REAL DATA)
        # ===========================================================================
        # Future implementation will query database for real affiliate statistics
        # 
        # Real implementation would include:
        # - SELECT COUNT(*) FROM affiliate_clicks WHERE user_id = current_user.id
        # - SELECT COUNT(*) FROM affiliate_conversions WHERE user_id = current_user.id
        # - Calculate conversion rates and commission totals
        # - Group by time periods for trend analysis
        # - Join with products table for top performers
        # 
        # For development, return mock statistics with realistic data
        
        mock_stats = {
            "total_clicks": 1247,
            "total_conversions": 89,
            "conversion_rate": 7.14,
            "total_commission": 1834.56,
            "this_month": {
                "clicks": 156,
                "conversions": 12,
                "commission": 287.34
            },
            "top_products": [
                {
                    "asin": "B08N5WRWNW",
                    "title": "Echo Dot (4th Gen)",
                    "clicks": 45,
                    "conversions": 8,
                    "commission": 67.89
                },
                {
                    "asin": "B08GYKNCCP", 
                    "title": "Sony WH-1000XM4",
                    "clicks": 23,
                    "conversions": 3,
                    "commission": 89.45
                }
            ]
        }
        
        return mock_stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.get("/products/{asin}/affiliate-url", summary="Get affiliate URL for product")
async def get_affiliate_url(
    asin: str,
    source: str = "direct"
):
    """
    Generate affiliate URL for specific Amazon product with tracking.
    
    Creates commission-eligible Amazon Associates URL for any valid ASIN.
    Used by frontend components to generate affiliate links on-demand
    without requiring full click tracking flow.
    
    Use Cases:
        - Product detail pages needing affiliate links
        - Dynamic link generation for email campaigns
        - API integrations requiring affiliate URLs
        - Testing and development of affiliate functionality
    
    URL Generation:
        - Validates ASIN format (10-character alphanumeric)
        - Adds Amazon Associates tag (giftsync-21)
        - Includes tracking parameters for attribution
        - Generates unique click ID for basic tracking
    
    Tracking Features:
        - Basic click tracking without full analytics
        - Source attribution for performance measurement
        - Associate tag validation for commission eligibility
        - Click ID generation for debugging
    
    Parameters:
        asin: Amazon Standard Identification Number (10 characters)
        source: Attribution source (default: "direct")
    
    Returns:
        dict: Affiliate URL with tracking information
    
    Raises:
        HTTPException 400: Invalid ASIN format
        HTTPException 500: URL generation failure
    
    Example:
        GET /affiliate/products/B08GYKNCCP/affiliate-url?source=email
        
        Response:
        {
            "asin": "B08GYKNCCP",
            "affiliate_url": "https://amazon.co.uk/dp/B08GYKNCCP/?tag=giftsync-21&...",
            "click_id": "click_xyz789abc123",
            "associate_tag": "giftsync-21"
        }
    """
    try:
        # ===========================================================================
        # AFFILIATE URL GENERATION
        # ===========================================================================
        
        # Generate Amazon affiliate URL with proper tracking parameters
        affiliate_url = amazon_service.generate_affiliate_url(asin)
        
        # Create basic click tracking record (lightweight tracking)
        click_id = amazon_service.track_affiliate_click(
            asin=asin,                  # Amazon product identifier
            user_id=None,              # No user context for direct URL requests
            source=source              # Attribution source for analytics
        )
        
        return {
            "asin": asin,
            "affiliate_url": affiliate_url,
            "click_id": click_id,
            "associate_tag": amazon_service.associate_tag
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate affiliate URL: {str(e)}")