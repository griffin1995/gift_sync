from sqlalchemy import Column, String, DateTime, Boolean, Text, JSON, Numeric, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_id = Column(String(255), nullable=False, index=True)  # Retailer's product ID
    retailer_id = Column(UUID(as_uuid=True), ForeignKey("retailers.id"), nullable=False)
    
    # Basic product information
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    brand = Column(String(200), nullable=True, index=True)
    model = Column(String(200), nullable=True)
    
    # Pricing
    price = Column(Numeric(10, 2), nullable=False)
    original_price = Column(Numeric(10, 2), nullable=True)  # For sale items
    currency = Column(String(3), default="GBP", nullable=False)
    
    # Categorization
    category_path = Column(String(500), nullable=False, index=True)  # e.g., "Fashion/Women/Accessories"
    primary_category = Column(String(100), nullable=False, index=True)
    sub_category = Column(String(100), nullable=True, index=True)
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
        return f"<Product(id={self.id}, title={self.title[:50]})>"
    
    @property
    def is_on_sale(self):
        return self.original_price and self.price < self.original_price
    
    @property
    def discount_percentage(self):
        if self.is_on_sale:
            return round(((self.original_price - self.price) / self.original_price) * 100, 1)
        return 0
    
    def to_dict(self):
        """Convert product to dictionary."""
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
        return f"<Category(id={self.id}, name={self.name})>"


class Brand(Base):
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
        return f"<Brand(id={self.id}, name={self.name})>"


class Retailer(Base):
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
        return f"<Retailer(id={self.id}, name={self.name})>"