from sqlalchemy import Column, String, DateTime, Boolean, Integer, Numeric, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import secrets
import string

from app.core.database import Base


class GiftLink(Base):
    __tablename__ = "gift_links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Link identification
    link_token = Column(String(255), unique=True, nullable=False, index=True)
    qr_code_url = Column(String(500), nullable=True)  # URL to generated QR code image
    
    # Link content
    title = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    custom_message = Column(Text, nullable=True)  # Personal message from gift giver
    
    # Privacy and access
    privacy_level = Column(String(20), default="public", nullable=False)  # "public", "friends", "private"
    password_protected = Column(Boolean, default=False, nullable=False)
    password_hash = Column(String(255), nullable=True)
    access_code = Column(String(20), nullable=True)  # Simple 6-digit access code
    
    # Recommendations included
    max_recommendations = Column(Integer, default=20, nullable=False)
    category_filter = Column(String, nullable=True)  # JSON array of category filters
    price_min = Column(Numeric(10, 2), nullable=True)
    price_max = Column(Numeric(10, 2), nullable=True)
    
    # Link lifecycle
    is_active = Column(Boolean, default=True, nullable=False)
    expiry_date = Column(DateTime, nullable=True)
    max_views = Column(Integer, nullable=True)  # Optional view limit
    
    # Analytics counters
    view_count = Column(Integer, default=0, nullable=False)
    unique_view_count = Column(Integer, default=0, nullable=False)
    click_count = Column(Integer, default=0, nullable=False)
    purchase_count = Column(Integer, default=0, nullable=False)
    total_revenue = Column(Numeric(10, 2), default=0, nullable=False)
    
    # Social features
    allow_comments = Column(Boolean, default=True, nullable=False)
    allow_votes = Column(Boolean, default=True, nullable=False)
    
    # Occasion and context
    occasion = Column(String(100), nullable=True)  # "birthday", "christmas", etc.
    occasion_date = Column(DateTime, nullable=True)
    recipient_name = Column(String(100), nullable=True)
    recipient_gender = Column(String(20), nullable=True)
    recipient_age_range = Column(String(20), nullable=True)  # "18-25", "26-35", etc.
    
    # Sharing tracking
    times_shared = Column(Integer, default=0, nullable=False)
    share_platforms = Column(String, nullable=True)  # JSON array of platforms shared to
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    last_accessed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User")  # Gift link creator
    interactions = relationship("GiftLinkInteraction", back_populates="gift_link", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<GiftLink(id={self.id}, token={self.link_token}, views={self.view_count})>"
    
    @classmethod
    def generate_link_token(cls, length: int = 12) -> str:
        """Generate a unique, URL-safe link token."""
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))
    
    @classmethod
    def generate_access_code(cls) -> str:
        """Generate a 6-digit access code."""
        return ''.join(secrets.choice(string.digits) for _ in range(6))
    
    @property
    def is_expired(self):
        """Check if the gift link has expired."""
        if self.expiry_date:
            return func.now() > self.expiry_date
        return False
    
    @property
    def is_view_limit_reached(self):
        """Check if view limit has been reached."""
        if self.max_views:
            return self.view_count >= self.max_views
        return False
    
    @property
    def is_accessible(self):
        """Check if the gift link is accessible."""
        return (self.is_active and 
                not self.is_expired and 
                not self.is_view_limit_reached)
    
    @property
    def full_url(self):
        """Get the full URL for this gift link."""
        # This would be constructed based on your domain
        return f"https://giftsync.app/gift/{self.link_token}"
    
    @property
    def conversion_rate(self):
        """Calculate conversion rate (purchases / views)."""
        if self.view_count == 0:
            return 0
        return round((self.purchase_count / self.view_count) * 100, 2)
    
    def to_dict(self):
        """Convert gift link to dictionary."""
        return {
            "id": str(self.id),
            "link_token": self.link_token,
            "title": self.title,
            "description": self.description,
            "custom_message": self.custom_message,
            "privacy_level": self.privacy_level,
            "is_active": self.is_active,
            "view_count": self.view_count,
            "click_count": self.click_count,
            "purchase_count": self.purchase_count,
            "conversion_rate": self.conversion_rate,
            "occasion": self.occasion,
            "recipient_name": self.recipient_name,
            "full_url": self.full_url,
            "created_at": self.created_at.isoformat(),
            "expiry_date": self.expiry_date.isoformat() if self.expiry_date else None,
        }


class GiftLinkInteraction(Base):
    __tablename__ = "gift_link_interactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gift_link_id = Column(UUID(as_uuid=True), ForeignKey("gift_links.id"), nullable=False, index=True)
    
    # Visitor identification (anonymous)
    visitor_id = Column(UUID(as_uuid=True), nullable=True)  # Anonymous visitor tracking
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # If logged in user
    session_id = Column(String(255), nullable=True)
    
    # Interaction details
    interaction_type = Column(String(50), nullable=False)  # "view", "click", "purchase", "vote", "comment"
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=True)  # If interacting with specific product
    
    # Technical details
    ip_address = Column(String(45), nullable=True)  # IPv4 or IPv6
    user_agent = Column(Text, nullable=True)
    referrer = Column(Text, nullable=True)
    device_type = Column(String(50), nullable=True)  # "mobile", "tablet", "desktop"
    browser = Column(String(100), nullable=True)
    operating_system = Column(String(100), nullable=True)
    
    # Geographic information
    country = Column(String(2), nullable=True)  # ISO country code
    region = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    
    # Interaction context
    page_position = Column(Integer, nullable=True)  # Position of item clicked
    interaction_value = Column(String, nullable=True)  # Rating, vote, comment text
    time_on_page = Column(Integer, nullable=True)  # Seconds spent on page
    
    # Purchase details (if applicable)
    purchase_amount = Column(Numeric(10, 2), nullable=True)
    commission_earned = Column(Numeric(10, 2), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    
    # Relationships
    gift_link = relationship("GiftLink", back_populates="interactions")
    user = relationship("User")
    product = relationship("Product")
    
    def __repr__(self):
        return f"<GiftLinkInteraction(id={self.id}, type={self.interaction_type})>"
    
    def to_dict(self):
        """Convert interaction to dictionary."""
        return {
            "id": str(self.id),
            "gift_link_id": str(self.gift_link_id),
            "interaction_type": self.interaction_type,
            "device_type": self.device_type,
            "country": self.country,
            "created_at": self.created_at.isoformat(),
            "purchase_amount": float(self.purchase_amount) if self.purchase_amount else None,
        }


# Analytics helper functions
class GiftLinkAnalytics:
    """Helper class for analyzing gift link performance."""
    
    @staticmethod
    def get_performance_summary(gift_link) -> dict:
        """Get comprehensive performance summary for a gift link."""
        interactions = gift_link.interactions
        
        # Basic metrics
        total_views = len([i for i in interactions if i.interaction_type == "view"])
        total_clicks = len([i for i in interactions if i.interaction_type == "click"])
        total_purchases = len([i for i in interactions if i.interaction_type == "purchase"])
        
        # Geographic breakdown
        countries = {}
        devices = {}
        
        for interaction in interactions:
            if interaction.country:
                countries[interaction.country] = countries.get(interaction.country, 0) + 1
            if interaction.device_type:
                devices[interaction.device_type] = devices.get(interaction.device_type, 0) + 1
        
        # Time analysis
        hourly_views = {}
        for interaction in interactions:
            if interaction.interaction_type == "view":
                hour = interaction.created_at.hour
                hourly_views[hour] = hourly_views.get(hour, 0) + 1
        
        return {
            "basic_metrics": {
                "total_views": total_views,
                "total_clicks": total_clicks,
                "total_purchases": total_purchases,
                "click_through_rate": (total_clicks / total_views * 100) if total_views > 0 else 0,
                "conversion_rate": (total_purchases / total_views * 100) if total_views > 0 else 0,
                "total_revenue": float(gift_link.total_revenue),
            },
            "geographic_breakdown": countries,
            "device_breakdown": devices,
            "hourly_distribution": hourly_views,
        }
    
    @staticmethod
    def get_popular_products(gift_link, limit: int = 5) -> list:
        """Get most popular products from gift link interactions."""
        product_clicks = {}
        
        for interaction in gift_link.interactions:
            if interaction.interaction_type == "click" and interaction.product_id:
                product_id = str(interaction.product_id)
                product_clicks[product_id] = product_clicks.get(product_id, 0) + 1
        
        # Sort by click count
        sorted_products = sorted(product_clicks.items(), key=lambda x: x[1], reverse=True)
        return sorted_products[:limit]