"""
GiftSync Product Data Models

Comprehensive SQLAlchemy models for the GiftSync product catalog system.
Provides enterprise-grade data structures for product management, categorisation,
branding, and retailer integration with full affiliate marketing support.

Key Features:
    - Complete product catalog with hierarchical categories
    - Multi-retailer support with affiliate link management
    - Advanced analytics tracking for business intelligence
    - Machine learning feature vectors for recommendation algorithms
    - Flexible JSON storage for dynamic attributes and specifications
    - Full audit trail with creation and modification timestamps

Database Design:
    - PostgreSQL-optimised with UUID primary keys
    - Proper indexing for search and filtering performance
    - Foreign key relationships for data integrity
    - JSON columns for flexible schema evolution
    - Numeric precision for accurate financial calculations

British Market Considerations:
    - GBP currency default for UK market focus
    - VAT-inclusive pricing structure
    - UK retailer integration priorities
    - British English terminology throughout

Performance Optimisations:
    - Strategic database indexes on frequently queried fields
    - Efficient relationship mappings for complex queries
    - Lazy loading configuration for large datasets
    - Optimised serialisation methods for API responses
"""

from sqlalchemy import Column, String, DateTime, Boolean, Text, JSON, Numeric, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class Product(Base):
    """
    Core Product Model - Complete Product Catalog Entity
    
    Represents individual products in the GiftSync catalog with comprehensive
    metadata, pricing, categorisation, and analytics tracking. Designed for
    scalable multi-retailer product management with affiliate integration.
    
    Database Schema:
        - Primary key: UUID for distributed system compatibility
        - Indexes: external_id, brand, category fields for search performance
        - JSON fields: flexible storage for attributes and feature vectors
        - Numeric precision: accurate financial calculations for pricing
    
    Key Relationships:
        - Retailer: Many-to-one relationship for product sourcing
        - Recommendations: One-to-many for ML-generated suggestions
    
    Analytics Integration:
        - View/click/purchase tracking for popularity scoring
        - Feature vectors for machine learning recommendations
        - Trending scores based on recent user activity
    
    Business Logic:
        - Sale detection with discount percentage calculation
        - Availability status management for inventory tracking
        - Multi-currency support with GBP default for UK market
    
    Performance Features:
        - Strategic indexing on search and filter fields
        - Efficient JSON serialisation for API responses
        - Lazy loading relationships to optimise query performance
    """
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_id = Column(String(255), nullable=False, index=True)  # Retailer's product ID
    retailer_id = Column(UUID(as_uuid=True), ForeignKey("retailers.id"), nullable=False)
    
    # =========================================================================
    # CORE PRODUCT INFORMATION - VERIFIED DATABASE SCHEMA
    # =========================================================================
    # Basic product information for display and search
    title = Column(Text, nullable=False)                           # VERIFIED: Full product name for display
    description = Column(Text, nullable=True)                      # VERIFIED: Rich product description
    brand = Column(String(200), nullable=True, index=True)         # VERIFIED: Indexed for brand filtering
    model = Column(String(200), nullable=True)                     # VERIFIED: Specific product model/SKU
    
    # =========================================================================
    # PRICING INFORMATION - VERIFIED BRITISH MARKET FOCUS
    # =========================================================================
    # Accurate pricing with British Pound default
    price = Column(Numeric(10, 2), nullable=False)                # VERIFIED: Current price in GBP (e.g., 29.99)
    original_price = Column(Numeric(10, 2), nullable=True)         # VERIFIED: Pre-discount price for sale detection
    currency = Column(String(3), default="GBP", nullable=False)   # VERIFIED: ISO currency code, defaults to British Pounds
    
    # =========================================================================
    # CATEGORISATION SYSTEM - VERIFIED HIERARCHICAL STRUCTURE
    # =========================================================================
    # Multi-level category system for filtering and organisation
    category_path = Column(String(500), nullable=False, index=True)   # VERIFIED: Full hierarchy "Electronics/Audio/Headphones"
    primary_category = Column(String(100), nullable=False, index=True)  # VERIFIED: Top-level category "Electronics"
    sub_category = Column(String(100), nullable=True, index=True)     # VERIFIED: Secondary category "Audio"
    tags = Column(JSON, nullable=True)  # Array of tags for filtering
    
    # Media
    image_urls = Column(JSON, nullable=True)  # Array of image URLs
    primary_image_url = Column(Text, nullable=True)
    
    # Links
    product_url = Column(Text, nullable=False)
    affiliate_url = Column(Text, nullable=True)
    
    # Ratings and reviews
    average_rating = Column(Numeric(3, 2), nullable=True)  # 0.00 to 5.00
    review_count = Column(Integer, default=0, nullable=False)
    
    # Product attributes (flexible JSON storage)
    attributes = Column(JSON, nullable=True)  # Size, color, material, etc.
    specifications = Column(JSON, nullable=True)  # Technical specs
    
    # Inventory and availability
    availability_status = Column(String(50), default="in_stock", nullable=False)
    stock_quantity = Column(Integer, nullable=True)
    
    # SEO and metadata
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    keywords = Column(JSON, nullable=True)  # Array of keywords
    
    # Analytics
    view_count = Column(Integer, default=0, nullable=False)
    click_count = Column(Integer, default=0, nullable=False)
    purchase_count = Column(Integer, default=0, nullable=False)
    
    # ML features (for recommendation algorithms)
    feature_vector = Column(JSON, nullable=True)  # Embedded features for similarity
    popularity_score = Column(Numeric(5, 2), nullable=True)
    trending_score = Column(Numeric(5, 2), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    last_crawled_at = Column(DateTime, nullable=True)  # When product data was last updated
    
    # Relationships
    retailer = relationship("Retailer", back_populates="products")
    recommendations = relationship("Recommendation", back_populates="product")
    
    def __repr__(self):
        """
        String representation for debugging and logging.
        
        Provides concise product identification with truncated title
        for readable logging and development debugging.
        
        Returns:
            str: Debug-friendly product representation
        """
        return f"<Product(id={self.id}, title={self.title[:50]})>"
    
    @property
    def is_on_sale(self):
        """
        Determine if product is currently on sale.
        
        Compares current price with original price to identify discounted items.
        Used for sale badge display, promotional filtering, and discount alerts.
        
        Returns:
            bool: True if product has discount (current price < original price)
        """
        return self.original_price and self.price < self.original_price
    
    @property
    def discount_percentage(self):
        """
        Calculate percentage discount from original price.
        
        Computes the savings percentage when product is on sale, rounded to
        one decimal place for consistent display. Used for promotional badges
        and deal highlighting throughout the application.
        
        Calculation:
            ((original_price - current_price) / original_price) * 100
        
        Returns:
            float: Discount percentage (0.0 if not on sale)
        """
        if self.is_on_sale:
            return round(((self.original_price - self.price) / self.original_price) * 100, 1)
        return 0
    
    def to_dict(self):
        """
        Convert product instance to dictionary for API serialisation.
        
        Transforms the SQLAlchemy model instance into a clean dictionary
        format suitable for JSON API responses. Handles type conversions,
        null values, and computed properties for consistent client-side usage.
        
        Type Conversions:
            - UUID fields: Converted to string format
            - Decimal fields: Converted to float for JSON compatibility
            - Boolean computed properties: Included for client convenience
        
        Computed Fields:
            - is_on_sale: Boolean indicating if product has discount
            - discount_percentage: Calculated savings percentage
            - popularity_score: Normalised popularity metric
        
        Returns:
            Dict[str, Any]: Clean dictionary representation with all
                           essential product data for API consumption
        """
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "brand": self.brand,
            "price": float(self.price),
            "original_price": float(self.original_price) if self.original_price else None,
            "currency": self.currency,
            "category_path": self.category_path,
            "primary_category": self.primary_category,
            "image_urls": self.image_urls,
            "primary_image_url": self.primary_image_url,
            "product_url": self.product_url,
            "affiliate_url": self.affiliate_url,
            "average_rating": float(self.average_rating) if self.average_rating else None,
            "review_count": self.review_count,
            "attributes": self.attributes,
            "availability_status": self.availability_status,
            "is_on_sale": self.is_on_sale,
            "discount_percentage": self.discount_percentage,
            "popularity_score": float(self.popularity_score) if self.popularity_score else None,
        }


class Category(Base):
    """
    Hierarchical Product Category Model
    
    Implements a flexible category taxonomy system for product organisation
    with support for unlimited hierarchy depth, visual styling, and machine
    learning integration for intelligent categorisation.
    
    Hierarchical Structure:
        - Self-referencing foreign key for parent-child relationships
        - Level tracking for efficient depth queries
        - Sort order for custom category arrangement
        - Breadcrumb navigation support
    
    Visual Customisation:
        - Icon URLs for category representation
        - Colour hex codes for consistent UI theming
        - Slug generation for SEO-friendly URLs
    
    Machine Learning Integration:
        - Embedding vectors for category similarity matching
        - Popularity scoring based on product performance
        - Automatic categorisation training data
    
    Business Features:
        - Active/inactive status for category management
        - Analytics integration for category performance tracking
        - Flexible description field for category explanations
    
    Database Optimisation:
        - Indexed slug field for fast URL lookups
        - Efficient parent-child relationship queries
        - JSON storage for flexible embedding vectors
    """
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    
    # Hierarchy
    parent_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    level = Column(Integer, default=0, nullable=False)  # 0=root, 1=child, etc.
    sort_order = Column(Integer, default=0, nullable=False)
    
    # Display
    icon_url = Column(String(255), nullable=True)
    color_hex = Column(String(7), nullable=True)  # e.g., #FF5733
    
    # ML and preferences
    embedding_vector = Column(JSON, nullable=True)  # For similarity matching
    popularity_score = Column(Numeric(5, 2), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    parent = relationship("Category", remote_side=[id])
    children = relationship("Category")
    
    def __repr__(self):
        """
        String representation for debugging and logging.
        
        Returns:
            str: Debug-friendly category representation
        """
        return f"<Category(id={self.id}, name={self.name})>"


class Brand(Base):
    """
    Product Brand Management Model
    
    Comprehensive brand entity for product catalog organisation with
    analytics tracking, featured brand highlighting, and brand-specific
    metadata management for enhanced user experience.
    
    Brand Information:
        - Unique name and slug for identification
        - Logo and website URLs for brand representation
        - Rich text descriptions for brand storytelling
    
    Analytics and Performance:
        - Product count tracking for brand portfolio size
        - Popularity scoring based on user engagement
        - Featured status for promotional highlighting
    
    Search and Discovery:
        - Indexed name and slug for fast brand lookups
        - Active status management for brand visibility
        - Integration with product filtering and search
    
    Business Intelligence:
        - Brand performance metrics for merchant insights
        - Popular brand identification for marketing
        - Brand-based recommendation algorithms
    
    Database Design:
        - UUID primary key for distributed compatibility
        - Unique constraints on name and slug fields
        - Timestamp tracking for audit trails
    """
    __tablename__ = "brands"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False, unique=True, index=True)
    slug = Column(String(200), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    
    # Brand information
    logo_url = Column(String(255), nullable=True)
    website_url = Column(String(255), nullable=True)
    
    # Analytics
    product_count = Column(Integer, default=0, nullable=False)
    popularity_score = Column(Numeric(5, 2), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        """
        String representation for debugging and logging.
        
        Returns:
            str: Debug-friendly brand representation
        """
        return f"<Brand(id={self.id}, name={self.name})>"


class Retailer(Base):
    """
    Multi-Retailer Management and Affiliate Integration Model
    
    Comprehensive retailer entity supporting multi-channel product sourcing
    with full affiliate marketing integration, API connectivity, and detailed
    analytics tracking for revenue optimisation.
    
    Retailer Information:
        - Basic details (name, description, branding)
        - Website and logo URLs for retailer representation
        - Unique slug generation for SEO-friendly URLs
    
    Affiliate Marketing Integration:
        - Multi-network support (Amazon Associates, Commission Junction, etc.)
        - Commission rate tracking for revenue calculations
        - Cookie duration management for attribution windows
        - Click and conversion tracking for performance analysis
    
    API Integration Capabilities:
        - Configurable API endpoints for automated product syncing
        - Encrypted API key storage for secure authentication
        - Last sync timestamp tracking for data freshness
        - Automated product catalog updates
    
    Business Analytics:
        - Product count tracking for catalog size monitoring
        - Click-through rate analysis for retailer performance
        - Conversion tracking for revenue attribution
        - Featured retailer highlighting for partnerships
    
    Security and Compliance:
        - Encrypted API credentials for secure integrations
        - Audit trail with creation and modification timestamps
        - Active status management for retailer visibility
    
    Performance Optimisation:
        - Indexed slug field for fast retailer lookups
        - Efficient product relationship queries
        - Strategic analytics field indexing
    """
    __tablename__ = "retailers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False, unique=True)
    slug = Column(String(200), nullable=False, unique=True, index=True)
    
    # Retailer information
    description = Column(Text, nullable=True)
    website_url = Column(String(255), nullable=False)
    logo_url = Column(String(255), nullable=True)
    
    # Affiliate configuration
    affiliate_network = Column(String(100), nullable=True)  # "amazon", "cj", "shareasale"
    commission_rate = Column(Numeric(5, 4), nullable=True)  # e.g., 0.0750 for 7.5%
    cookie_duration_days = Column(Integer, default=30, nullable=False)
    
    # API configuration
    api_endpoint = Column(String(255), nullable=True)
    api_key_encrypted = Column(Text, nullable=True)
    last_sync_at = Column(DateTime, nullable=True)
    
    # Analytics
    product_count = Column(Integer, default=0, nullable=False)
    total_clicks = Column(Integer, default=0, nullable=False)
    total_conversions = Column(Integer, default=0, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    products = relationship("Product", back_populates="retailer")
    
    def __repr__(self):
        """
        String representation for debugging and logging.
        
        Returns:
            str: Debug-friendly retailer representation
        """
        return f"<Retailer(id={self.id}, name={self.name})>"