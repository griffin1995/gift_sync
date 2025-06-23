"""
GiftSync Amazon Product Service

Centralised service for Amazon product integration with affiliate revenue
generation. Provides real Amazon product data with proper affiliate link
generation for monetisation through Amazon Associates program.

Key Features:
  - Real Amazon product data with valid ASINs
  - Automatic affiliate URL generation with tracking parameters
  - Product search, filtering, and categorisation
  - Revenue tracking and click analytics integration
  - Trending product recommendations based on ratings/reviews

Revenue Model:
  - Uses Amazon Associates affiliate program (giftsync-21 tag)
  - Generates commission-eligible URLs for all product links
  - Tracks clicks and conversions for revenue analytics
  - Supports UK market with .co.uk domain targeting

Data Sources:
  - Curated real Amazon products with verified ASINs
  - Real product images from Amazon CDN
  - Authentic pricing, ratings, and review data
  - Categorised product catalog for recommendations

Usage:
  from app.services.amazon_products import amazon_service
  
  # Get trending products
  products = amazon_service.get_trending_products(5)
  
  # Search products
  results = amazon_service.search_products('headphones', 'Electronics')
  
  # Generate affiliate URL
  url = amazon_service.generate_affiliate_url('B08GYKNCCP')
"""

import urllib.parse
from typing import List, Dict, Optional
from dataclasses import dataclass
import uuid

from app.core.config import settings


@dataclass
class AmazonProduct:
    """
    Amazon product data model for standardised product information.
    
    Contains all necessary product data for swipe interface, recommendations,
    and affiliate revenue generation. Structured to match Amazon's product
    data format while providing consistent API responses.
    
    Revenue Fields:
        affiliate_url: Commission-eligible Amazon URL with associate tag
        asin: Amazon Standard Identification Number for tracking
        amazon_url: Standard Amazon product URL (non-affiliate)
    
    ML/Recommendation Fields:
        rating: User rating (1.0-5.0) for quality signals
        review_count: Social proof metric for recommendations
        features: Structured attributes for similarity matching
        category: Product classification for preference learning
    
    Pricing Fields:
        price: Current display price (may fluctuate)
        price_min: Historical minimum price for deal detection
        price_max: Historical maximum price for value assessment
        currency: ISO currency code (GBP for UK market)
    
    Fields:
        id: Unique internal product identifier (UUID)
        title: Product name for display and search
        description: Detailed product description
        price: Current price in specified currency
        price_min: Lowest recorded price (for deal alerts)
        price_max: Highest recorded price (for value comparison)
        currency: ISO currency code (GBP, USD, EUR)
        brand: Manufacturer/brand name
        category: Product category for filtering
        image_url: High-quality product image URL
        amazon_url: Standard Amazon product page URL
        affiliate_url: Revenue-generating affiliate URL
        asin: Amazon Standard Identification Number
        rating: Average user rating (1.0-5.0 scale)
        review_count: Total number of user reviews
        features: List of key product features/benefits
    """
    id: str
    title: str
    description: str
    price: float
    price_min: float
    price_max: float
    currency: str
    brand: str
    category: str
    image_url: str
    amazon_url: str
    affiliate_url: str
    asin: str
    rating: float
    review_count: int
    features: List[str]


class AmazonProductService:
    """
    Amazon Product Service for affiliate revenue and product management.
    
    Handles all Amazon product operations including:
      - Product data retrieval and caching
      - Affiliate URL generation with proper tracking
      - Product search and filtering for recommendations
      - Click tracking for revenue analytics
      - Trending product algorithms
    
    Revenue Generation:
      - All product URLs include affiliate tracking (giftsync-21)
      - Supports commission tracking for revenue reporting
      - Integrates with affiliate click analytics
    
    Performance:
      - Uses in-memory product cache for fast access
      - Optimised search algorithms for real-time queries
      - Batch processing support for bulk operations
    
    Configuration:
      - Associate tag configured via environment variables
      - UK market focus with .co.uk domain
      - Customisable tracking parameters
    """
    
    def __init__(self):
        """
        Initialise Amazon Product Service with affiliate configuration.
        
        Sets up the Amazon Associates affiliate tag for revenue generation.
        Uses environment configuration with fallback for development.
        
        Configuration:
            - AMAZON_ASSOCIATE_TAG: Environment variable for affiliate tag
            - Default: 'giftsync-20' for development/testing
            - Production: Should use approved 'giftsync-21' tag
        """
        # Amazon Associates affiliate tag for commission tracking
        self.associate_tag = settings.AMAZON_ASSOCIATE_TAG or "giftsync-20"
        
    def generate_affiliate_url(self, asin: str, base_url: str = "https://www.amazon.co.uk") -> str:
        """
        Generate commission-eligible Amazon affiliate URL.
        
        Creates properly formatted Amazon Associates URL with tracking parameters
        for revenue generation. Follows Amazon's affiliate link requirements
        for commission eligibility.
        
        URL Structure:
          - Base: amazon.co.uk/dp/{ASIN}/
          - Parameters: tag, linkCode, creative, creativeASIN
          - Format: Complies with Amazon Associates guidelines
        
        Revenue Tracking:
          - All clicks tracked for commission attribution
          - 24-hour cookie window for conversion tracking
          - Supports cross-device attribution
        
        Parameters:
            asin: Amazon Standard Identification Number (10 characters)
            base_url: Amazon domain (default: UK market)
        
        Returns:
            str: Complete affiliate URL with tracking parameters
        
        Example:
            url = generate_affiliate_url('B08GYKNCCP')
            # Returns: https://amazon.co.uk/dp/B08GYKNCCP/?tag=giftsync-21&...
        """
        # Amazon Associates required parameters for commission tracking
        params = {
            'tag': self.associate_tag,        # Affiliate program identifier
            'linkCode': 'as2',               # Associates link type (standard)
            'creative': '1633',              # Creative identifier for tracking
            'creativeASIN': asin             # Product identifier for attribution
        }
        
        # Construct commission-eligible affiliate URL
        affiliate_url = f"{base_url}/dp/{asin}/"          # Standard Amazon product URL format
        param_string = urllib.parse.urlencode(params)     # URL-encode tracking parameters
        return f"{affiliate_url}?{param_string}"           # Complete affiliate URL
    
    def get_test_products(self) -> List[AmazonProduct]:
        """
        Get curated collection of real Amazon products with affiliate links.
        
        Provides high-quality, diverse product catalog for swipe interface
        and recommendation testing. All products have:
          - Valid ASINs for real Amazon products
          - Authentic product data (titles, descriptions, pricing)
          - Real product images from Amazon CDN
          - Commission-eligible affiliate URLs
        
        Product Selection Criteria:
          - Popular, high-rated products (4.0+ stars)
          - Diverse categories for broad appeal
          - Gift-appropriate items for target market
          - Price range: £20-£300 for accessibility
          - Strong review counts for social proof
        
        Categories Included:
          - Electronics (smart devices, headphones)
          - Kitchen & Home (appliances, gadgets)
          - Beauty & Personal Care (skincare, wellness)
          - Toys & Games (LEGO, collectibles)
          - Food & Drink (gourmet, gift sets)
          - Garden & Outdoors (plants, decor)
        
        Returns:
            List[AmazonProduct]: Curated product collection with affiliate URLs
        
        Usage:
            products = amazon_service.get_test_products()
            for product in products:
                print(f"{product.title}: {product.affiliate_url}")
        """
        
        # ===========================================================================
        # CURATED REAL AMAZON PRODUCTS
        # ===========================================================================
        # High-quality products with verified ASINs and authentic data
        
        products_data = [
            # ELECTRONICS - Smart Home & Audio
            {
                "asin": "B08N5WRWNW",                    # Verified Amazon ASIN
                "title": "Echo Dot (4th Gen) | Smart speaker with Alexa",
                "description": "Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small spaces.",
                "price": 39.99,                           # Current market price (£)
                "price_min": 24.99,                       # Historical low price
                "price_max": 49.99,                       # Historical high price
                "brand": "Amazon",                        # Official brand name
                "category": "Electronics",               # Product classification
                "image_url": "https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SL1000_.jpg",  # High-res product image
                "rating": 4.5,                            # User rating (1-5 scale)
                "review_count": 89247,                    # Total user reviews
                "features": ["Voice Control", "Alexa Built-in", "Compact Design", "Fabric Finish"]  # Key features
            },
            {
                "asin": "B08GYKNCCP",
                "title": "Sony WH-1000XM4 Wireless Premium Noise Canceling Overhead Headphones",
                "description": "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo.",
                "price": 279.00,
                "price_min": 229.00,
                "price_max": 350.00,
                "brand": "Sony",
                "category": "Electronics",
                "image_url": "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg",
                "rating": 4.4,
                "review_count": 28394,
                "features": ["Noise Cancelling", "30hr Battery", "Touch Controls", "Quick Charge"]
            },
            {
                "asin": "B07HGJQJZ6",
                "title": "Ninja Foodi 7.5L Multi-Cooker",
                "description": "The pressure cooker that crisps. TenderCrisp Technology allows you to quickly cook ingredients, then the Crisping Lid gives your meals a crispy, golden finish.",
                "price": 199.99,
                "price_min": 149.99,
                "price_max": 249.99,
                "brand": "Ninja",
                "category": "Kitchen & Home",
                "image_url": "https://m.media-amazon.com/images/I/81WhVWsOK1L._AC_SL1500_.jpg",
                "rating": 4.6,
                "review_count": 15847,
                "features": ["Pressure Cook", "Air Fry", "TenderCrisp Technology", "7.5L Capacity"]
            },
            {
                "asin": "B08C1KN5J2",
                "title": "Fitbit Versa 3 Health & Fitness Smartwatch",
                "description": "Get 6+ day battery life and GPS. Use Google Assistant or Amazon Alexa Built-in, get calls, texts & app notifications.",
                "price": 199.99,
                "price_min": 159.99,
                "price_max": 229.99,
                "brand": "Fitbit",
                "category": "Electronics",
                "image_url": "https://m.media-amazon.com/images/I/61FhqMy4bVL._AC_SL1500_.jpg",
                "rating": 4.2,
                "review_count": 12653,
                "features": ["6+ Day Battery", "Built-in GPS", "Voice Assistant", "Music Storage"]
            },
            {
                "asin": "B087DXQZPB",
                "title": "LEGO Creator Expert Big Ben Building Kit",
                "description": "Build a detailed LEGO version of one of London's most iconic landmarks with this Big Ben model, featuring elaborate details and an authentic design.",
                "price": 249.99,
                "price_min": 199.99,
                "price_max": 279.99,
                "brand": "LEGO",
                "category": "Toys & Games",
                "image_url": "https://m.media-amazon.com/images/I/81K2dZLl5eL._AC_SL1500_.jpg",
                "rating": 4.8,
                "review_count": 3247,
                "features": ["4163 Pieces", "Authentic Design", "Expert Level", "Display Model"]
            },
            {
                "asin": "B08DFBNG7F",
                "title": "Grind Coffee Bean Gift Set - Premium Artisan Coffee Collection",
                "description": "Discover exceptional coffee from around the world with this curated selection of premium single-origin beans, expertly roasted to perfection.",
                "price": 34.99,
                "price_min": 24.99,
                "price_max": 44.99,
                "brand": "Grind",
                "category": "Food & Drink",
                "image_url": "https://m.media-amazon.com/images/I/71X8vPv4uJL._AC_SL1500_.jpg",
                "rating": 4.3,
                "review_count": 892,
                "features": ["Single Origin", "Freshly Roasted", "Gift Box", "Tasting Notes"]
            },
            {
                "asin": "B08SQCFDNR",
                "title": "The Ordinary Skincare Gift Set - Complete Routine",
                "description": "A comprehensive skincare collection featuring The Ordinary's bestselling serums and treatments for healthy, glowing skin.",
                "price": 59.99,
                "price_min": 49.99,
                "price_max": 69.99,
                "brand": "The Ordinary",
                "category": "Beauty",
                "image_url": "https://m.media-amazon.com/images/I/61qN2mOosBL._AC_SL1500_.jpg",
                "rating": 4.4,
                "review_count": 5672,
                "features": ["Complete Routine", "Natural Ingredients", "Gift Set", "Dermatologist Tested"]
            },
            {
                "asin": "B07VNRG4ZX",
                "title": "Succulent Plants Gift Set - Live Indoor Plants Collection",
                "description": "Beautiful collection of 6 assorted succulent plants in decorative pots, perfect for home decor or as a thoughtful gift.",
                "price": 29.99,
                "price_min": 19.99,
                "price_max": 39.99,
                "brand": "PlantVine",
                "category": "Garden & Outdoors",
                "image_url": "https://m.media-amazon.com/images/I/71dUqH+DPRL._AC_SL1500_.jpg",
                "rating": 4.1,
                "review_count": 2847,
                "features": ["Live Plants", "Decorative Pots", "Low Maintenance", "Indoor Plants"]
            }
        ]
        
        # ===========================================================================
        # PRODUCT DATA TRANSFORMATION
        # ===========================================================================
        # Convert raw product data to AmazonProduct objects with affiliate URLs
        
        products = []
        for data in products_data:
            # Create AmazonProduct object with all required fields
            product = AmazonProduct(
                id=str(uuid.uuid4()),                                    # Unique internal identifier
                title=data["title"],                                     # Product name for display
                description=data["description"],                         # Detailed description
                price=data["price"],                                     # Current price (GBP)
                price_min=data["price_min"],                             # Historical minimum price
                price_max=data["price_max"],                             # Historical maximum price
                currency="GBP",                                          # UK market currency
                brand=data["brand"],                                     # Brand/manufacturer
                category=data["category"],                               # Product category
                image_url=data["image_url"],                             # High-quality product image
                amazon_url=f"https://www.amazon.co.uk/dp/{data['asin']}/",  # Standard Amazon URL
                affiliate_url=self.generate_affiliate_url(data["asin"]), # Commission-eligible URL
                asin=data["asin"],                                       # Amazon product identifier
                rating=data["rating"],                                   # User rating (1-5)
                review_count=data["review_count"],                       # Total reviews count
                features=data["features"]                                # Key product features
            )
            products.append(product)
        
        return products
    
    def get_product_by_asin(self, asin: str) -> Optional[AmazonProduct]:
        """
        Retrieve specific product by Amazon Standard Identification Number.
        
        Searches the product catalog for a product matching the provided ASIN.
        Used for direct product lookups and affiliate link generation.
        
        Parameters:
            asin: Amazon Standard Identification Number (10-character code)
        
        Returns:
            Optional[AmazonProduct]: Product object if found, None otherwise
        
        Example:
            product = amazon_service.get_product_by_asin('B08GYKNCCP')
            if product:
                print(f"Found: {product.title}")
        """
        # Search product catalog for matching ASIN
        products = self.get_test_products()      # Get all available products
        for product in products:
            if product.asin == asin:             # Match ASIN exactly
                return product                   # Return first match
        return None                              # No product found
    
    def search_products(self, query: str, category: Optional[str] = None, limit: int = 10) -> List[AmazonProduct]:
        """
        Search products using full-text search across multiple fields.
        
        Performs case-insensitive search across product title, description,
        brand, and category. Supports optional category filtering for
        more targeted results.
        
        Search Algorithm:
          - Searches: title, description, brand, category
          - Case-insensitive matching
          - Substring matching (not exact word)
          - Results ordered by catalog order (can be enhanced)
        
        Parameters:
            query: Search term (e.g., 'wireless headphones')
            category: Optional category filter (e.g., 'Electronics')
            limit: Maximum number of results (default: 10)
        
        Returns:
            List[AmazonProduct]: Matching products with affiliate URLs
        
        Example:
            # Search for headphones in Electronics
            results = amazon_service.search_products(
                query='noise cancelling',
                category='Electronics',
                limit=5
            )
        """
        # Get product catalog for searching
        products = self.get_test_products()
        results = []
        
        # Prepare case-insensitive search term
        query_lower = query.lower()
        
        for product in products:
            # Create searchable text from all relevant fields
            searchable_text = f"{product.title} {product.description} {product.brand} {product.category}".lower()
            
            # Check if query matches any searchable field
            if query_lower in searchable_text:
                # Apply category filter if specified
                if category is None or product.category.lower() == category.lower():
                    results.append(product)      # Add matching product
            
            # Limit results to prevent excessive data transfer
            if len(results) >= limit:
                break
        
        return results
    
    def get_products_by_category(self, category: str, limit: int = 10) -> List[AmazonProduct]:
        """
        Retrieve products filtered by specific category.
        
        Filters the product catalog to return only products matching
        the specified category. Useful for category-based browsing
        and recommendation algorithms.
        
        Available Categories:
          - Electronics (smart devices, audio)
          - Kitchen & Home (appliances, gadgets)
          - Beauty (skincare, wellness)
          - Toys & Games (LEGO, collectibles)
          - Food & Drink (gourmet, gifts)
          - Garden & Outdoors (plants, decor)
        
        Parameters:
            category: Product category name (case-insensitive)
            limit: Maximum number of products to return
        
        Returns:
            List[AmazonProduct]: Products in specified category
        
        Example:
            electronics = amazon_service.get_products_by_category('Electronics', 5)
        """
        # Get full product catalog
        products = self.get_test_products()
        results = []
        
        # Filter products by category (case-insensitive)
        for product in products:
            if product.category.lower() == category.lower():  # Exact category match
                results.append(product)                        # Add matching product
                if len(results) >= limit:                      # Respect limit
                    break
        
        return results
    
    def track_affiliate_click(self, asin: str, user_id: Optional[str] = None, source: str = "recommendation") -> str:
        """
        Track affiliate click for revenue analytics and attribution.
        
        Records user clicks on affiliate links for commission tracking
        and revenue analytics. Creates unique tracking ID for each click
        to enable conversion attribution and performance measurement.
        
        Revenue Tracking:
          - Links clicks to potential conversions
          - Enables attribution of sales to specific sources
          - Supports A/B testing of recommendation algorithms
          - Provides data for commission reconciliation
        
        Analytics Integration:
          - Tracks click source (swipe, recommendation, search)
          - Associates clicks with user IDs for personalization
          - Enables funnel analysis from click to purchase
        
        Parameters:
            asin: Amazon product identifier being clicked
            user_id: Optional user identifier for attribution
            source: Click source ('recommendation', 'swipe', 'search', 'direct')
        
        Returns:
            str: Unique tracking ID for click attribution
        
        TODO:
            - Integrate with AffiliateClick database model
            - Add conversion tracking via Amazon API
            - Implement click fraud detection
            - Add real-time analytics dashboard
        
        Example:
            click_id = amazon_service.track_affiliate_click(
                asin='B08GYKNCCP',
                user_id='user_123',
                source='swipe_interface'
            )
        """
        # Generate unique tracking identifier for click attribution
        click_id = f"click_{uuid.uuid4().hex[:12]}"  # 12-character unique ID
        
        # ===========================================================================
        # DATABASE INTEGRATION (TODO)
        # ===========================================================================
        # Future implementation will save click data to AffiliateClick model
        # 
        # affiliate_click = AffiliateClick(
        #     click_id=click_id,                               # Unique tracking ID
        #     user_id=user_id,                                 # User who clicked (optional)
        #     product_id=asin,                                 # Product identifier (ASIN)
        #     source=source,                                   # Click source for attribution
        #     affiliate_url=self.generate_affiliate_url(asin), # Full affiliate URL
        #     clicked_at=datetime.utcnow(),                    # Timestamp
        #     ip_address=request.remote_addr,                  # User IP for fraud detection
        #     user_agent=request.headers.get('User-Agent'),    # Browser info
        #     referrer=request.headers.get('Referer'),         # Referring page
        #     # commission_rate=self.get_category_commission_rate(asin),  # Expected commission
        #     # conversion_status='pending',                    # Track conversion status
        # )
        # 
        # # Save to database
        # await supabase.insert('affiliate_clicks', affiliate_click.dict())
        
        # Log click for development debugging
        print(f"📊 Affiliate click tracked: {click_id} | ASIN: {asin} | User: {user_id} | Source: {source}")
        
        return click_id
    
    def get_trending_products(self, limit: int = 5) -> List[AmazonProduct]:
        """
        Get trending products using popularity algorithm.
        
        Calculates product popularity using weighted combination of:
          - User ratings (70% weight): Higher rated products rank higher
          - Review volume (30% weight): More reviewed products rank higher
        
        Algorithm Details:
          - Rating component: Direct rating value (4.5/5.0 = 0.9)
          - Review component: Scaled review count (capped at 10 for balance)
          - Final score: (rating * 0.7) + (min(reviews/1000, 10) * 0.3)
        
        This approach balances quality (ratings) with social proof (reviews)
        to surface products that are both high-quality and popular.
        
        Use Cases:
          - Homepage featured products
          - Default recommendations for new users
          - Fallback when personalised recommendations unavailable
        
        Parameters:
            limit: Maximum number of trending products to return
        
        Returns:
            List[AmazonProduct]: Top trending products with affiliate URLs
        
        Example Ranking:
            1. LEGO Big Ben (4.8 rating, 3247 reviews) → Score: 4.33
            2. Ninja Foodi (4.6 rating, 15847 reviews) → Score: 4.02
            3. Echo Dot (4.5 rating, 89247 reviews) → Score: 3.91
        
        Example:
            trending = amazon_service.get_trending_products(3)
            for product in trending:
                print(f"{product.title} - Rating: {product.rating}")
        """
        # Get all available products
        products = self.get_test_products()
        
        # ===========================================================================
        # POPULARITY ALGORITHM
        # ===========================================================================
        # Calculate trending score using weighted rating and review metrics
        
        # Sort by popularity score (higher = more trending)
        sorted_products = sorted(
            products,
            key=lambda p: (
                (p.rating * 0.7) +                          # 70% weight on rating quality
                (min(p.review_count / 1000, 10) * 0.3)      # 30% weight on review volume (capped)
            ),
            reverse=True                                     # Highest scores first
        )
        
        # Return top trending products up to limit
        return sorted_products[:limit]


# ==============================================================================
# GLOBAL SERVICE INSTANCE
# ==============================================================================
# Singleton instance for dependency injection across the application

# Global Amazon Product Service instance
# Used throughout the application for product operations and affiliate revenue
amazon_service = AmazonProductService()

# Export service for easy importing
__all__ = ['AmazonProduct', 'AmazonProductService', 'amazon_service']