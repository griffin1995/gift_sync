from sqlalchemy import Column, String, DateTime, Boolean, Numeric, Integer, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class AffiliateClick(Base):
    __tablename__ = "affiliate_clicks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)  # Can be anonymous
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False, index=True)
    retailer_id = Column(UUID(as_uuid=True), ForeignKey("retailers.id"), nullable=False, index=True)
    
    # Click tracking
    click_id = Column(String(255), unique=True, nullable=False, index=True)  # Unique identifier for this click
    affiliate_url = Column(Text, nullable=False)  # Full affiliate URL that was clicked
    original_url = Column(Text, nullable=True)   # Original product URL (non-affiliate)
    
    # Attribution
    recommendation_id = Column(UUID(as_uuid=True), ForeignKey("recommendations.id"), nullable=True)
    gift_link_id = Column(UUID(as_uuid=True), ForeignKey("gift_links.id"), nullable=True)
    source = Column(String(100), nullable=False)  # "recommendation", "gift_link", "search", "browse"
    campaign = Column(String(100), nullable=True)  # Marketing campaign identifier
    
    # Technical details
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    referrer = Column(Text, nullable=True)
    device_type = Column(String(50), nullable=True)
    
    # Conversion tracking
    converted = Column(Boolean, default=False, nullable=False)
    conversion_time = Column(DateTime, nullable=True)  # When conversion happened
    conversion_value = Column(Numeric(10, 2), nullable=True)  # Purchase amount
    
    # Commission details
    commission_rate = Column(Numeric(5, 4), nullable=True)  # e.g., 0.0750 for 7.5%
    commission_amount = Column(Numeric(10, 2), nullable=True)
    commission_status = Column(String(50), default="pending", nullable=False)  # "pending", "confirmed", "paid", "rejected"
    
    # Cookie and tracking
    cookie_duration_days = Column(Integer, default=30, nullable=False)
    tracking_expires_at = Column(DateTime, nullable=False)  # When attribution window expires
    
    # External tracking (from affiliate networks)
    external_click_id = Column(String(255), nullable=True)  # Click ID from affiliate network
    external_conversion_id = Column(String(255), nullable=True)  # Conversion ID from network
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User")
    product = relationship("Product")
    retailer = relationship("Retailer")
    recommendation = relationship("Recommendation")
    gift_link = relationship("GiftLink")
    
    def __repr__(self):
        return f"<AffiliateClick(id={self.id}, product_id={self.product_id}, converted={self.converted})>"
    
    @property
    def is_attribution_valid(self):
        """Check if click is still within attribution window."""
        return func.now() <= self.tracking_expires_at
    
    @property
    def days_since_click(self):
        """Get number of days since click occurred."""
        return (func.now() - self.created_at).days
    
    def to_dict(self):
        """Convert affiliate click to dictionary."""
        return {
            "id": str(self.id),
            "click_id": self.click_id,
            "product_id": str(self.product_id),
            "source": self.source,
            "converted": self.converted,
            "conversion_value": float(self.conversion_value) if self.conversion_value else None,
            "commission_amount": float(self.commission_amount) if self.commission_amount else None,
            "commission_status": self.commission_status,
            "created_at": self.created_at.isoformat(),
            "conversion_time": self.conversion_time.isoformat() if self.conversion_time else None,
        }


class CommissionStatus(str, enum.Enum):
    PENDING = "pending"       # Conversion tracked, waiting for confirmation
    CONFIRMED = "confirmed"   # Conversion confirmed by retailer
    PAID = "paid"            # Commission has been paid to us
    REJECTED = "rejected"     # Conversion rejected by retailer
    CANCELLED = "cancelled"   # Order was cancelled/returned


class Commission(Base):
    __tablename__ = "commissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    affiliate_click_id = Column(UUID(as_uuid=True), ForeignKey("affiliate_clicks.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    
    # Commission details
    order_id = Column(String(255), nullable=True)  # Retailer's order ID
    order_value = Column(Numeric(10, 2), nullable=False)  # Total order value
    commission_rate = Column(Numeric(5, 4), nullable=False)  # Commission rate applied
    commission_amount = Column(Numeric(10, 2), nullable=False)  # Commission earned
    currency = Column(String(3), default="GBP", nullable=False)
    
    # Status tracking
    status = Column(String, default=CommissionStatus.PENDING, nullable=False)
    status_reason = Column(Text, nullable=True)  # Reason for rejection/cancellation
    
    # External tracking
    external_order_id = Column(String(255), nullable=True)  # Order ID from affiliate network
    external_commission_id = Column(String(255), nullable=True)  # Commission ID from network
    
    # Payment tracking
    payment_batch_id = Column(String(255), nullable=True)  # Batch ID when paid
    paid_amount = Column(Numeric(10, 2), nullable=True)  # Actual amount paid (may differ due to fees)
    paid_at = Column(DateTime, nullable=True)
    
    # User rewards (if sharing commission with users)
    user_reward_percentage = Column(Numeric(5, 4), nullable=True)  # Percentage shared with user
    user_reward_amount = Column(Numeric(10, 2), nullable=True)  # Amount shared with user
    user_reward_paid = Column(Boolean, default=False, nullable=False)
    
    # Timeline
    confirmed_at = Column(DateTime, nullable=True)  # When commission was confirmed
    rejected_at = Column(DateTime, nullable=True)   # When commission was rejected
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    affiliate_click = relationship("AffiliateClick")
    user = relationship("User")
    
    def __repr__(self):
        return f"<Commission(id={self.id}, amount={self.commission_amount}, status={self.status})>"
    
    @property
    def is_pending(self):
        return self.status == CommissionStatus.PENDING
    
    @property
    def is_confirmed(self):
        return self.status == CommissionStatus.CONFIRMED
    
    @property
    def is_paid(self):
        return self.status == CommissionStatus.PAID
    
    @property
    def days_pending(self):
        """Get number of days commission has been pending."""
        if self.confirmed_at:
            return (self.confirmed_at - self.created_at).days
        return (func.now() - self.created_at).days
    
    def to_dict(self):
        """Convert commission to dictionary."""
        return {
            "id": str(self.id),
            "order_id": self.order_id,
            "order_value": float(self.order_value),
            "commission_rate": float(self.commission_rate),
            "commission_amount": float(self.commission_amount),
            "status": self.status,
            "currency": self.currency,
            "user_reward_amount": float(self.user_reward_amount) if self.user_reward_amount else None,
            "created_at": self.created_at.isoformat(),
            "confirmed_at": self.confirmed_at.isoformat() if self.confirmed_at else None,
            "paid_at": self.paid_at.isoformat() if self.paid_at else None,
        }


# Analytics and reporting helper class
class AffiliateAnalytics:
    """Helper class for affiliate performance analytics."""
    
    @staticmethod
    def calculate_conversion_metrics(clicks: list) -> dict:
        """Calculate conversion metrics from a list of affiliate clicks."""
        if not clicks:
            return {}
        
        total_clicks = len(clicks)
        conversions = [c for c in clicks if c.converted]
        total_conversions = len(conversions)
        total_revenue = sum(c.conversion_value or 0 for c in conversions)
        total_commission = sum(c.commission_amount or 0 for c in conversions)
        
        return {
            "total_clicks": total_clicks,
            "total_conversions": total_conversions,
            "conversion_rate": (total_conversions / total_clicks * 100) if total_clicks > 0 else 0,
            "total_revenue": float(total_revenue),
            "total_commission": float(total_commission),
            "average_order_value": float(total_revenue / total_conversions) if total_conversions > 0 else 0,
            "revenue_per_click": float(total_revenue / total_clicks) if total_clicks > 0 else 0,
            "commission_per_click": float(total_commission / total_clicks) if total_clicks > 0 else 0,
        }
    
    @staticmethod
    def get_top_performing_products(clicks: list, limit: int = 10) -> list:
        """Get top performing products by conversion rate and revenue."""
        product_stats = {}
        
        for click in clicks:
            product_id = str(click.product_id)
            if product_id not in product_stats:
                product_stats[product_id] = {
                    "clicks": 0,
                    "conversions": 0,
                    "revenue": 0,
                    "commission": 0
                }
            
            product_stats[product_id]["clicks"] += 1
            if click.converted:
                product_stats[product_id]["conversions"] += 1
                product_stats[product_id]["revenue"] += float(click.conversion_value or 0)
                product_stats[product_id]["commission"] += float(click.commission_amount or 0)
        
        # Calculate conversion rates
        for stats in product_stats.values():
            stats["conversion_rate"] = (stats["conversions"] / stats["clicks"] * 100) if stats["clicks"] > 0 else 0
        
        # Sort by revenue
        sorted_products = sorted(
            product_stats.items(),
            key=lambda x: x[1]["revenue"],
            reverse=True
        )
        
        return sorted_products[:limit]
    
    @staticmethod
    def get_attribution_analysis(clicks: list) -> dict:
        """Analyze attribution patterns (time to conversion, etc.)."""
        conversions = [c for c in clicks if c.converted and c.conversion_time]
        
        if not conversions:
            return {}
        
        # Time to conversion analysis
        time_to_conversions = []
        for click in conversions:
            time_diff = (click.conversion_time - click.created_at).total_seconds() / 3600  # Hours
            time_to_conversions.append(time_diff)
        
        time_to_conversions.sort()
        
        # Attribution window utilization
        total_attributed = len([c for c in clicks if c.is_attribution_valid])
        expired_attribution = len(clicks) - total_attributed
        
        return {
            "average_time_to_conversion_hours": sum(time_to_conversions) / len(time_to_conversions),
            "median_time_to_conversion_hours": time_to_conversions[len(time_to_conversions)//2],
            "fastest_conversion_hours": min(time_to_conversions),
            "slowest_conversion_hours": max(time_to_conversions),
            "attribution_window_utilization": (total_attributed / len(clicks) * 100) if clicks else 0,
            "expired_attributions": expired_attribution,
        }