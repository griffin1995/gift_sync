from sqlalchemy import Column, String, DateTime, Boolean, Numeric, Integer, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class RecommendationType(str, enum.Enum):
    COLLABORATIVE = "collaborative"      # Based on similar users
    CONTENT_BASED = "content_based"     # Based on item features
    HYBRID = "hybrid"                   # Combination of both
    TRENDING = "trending"               # Popular/trending items
    SEASONAL = "seasonal"               # Season-based recommendations
    PERSONALIZED = "personalized"      # AI/ML personalized


class RecommendationStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    DISMISSED = "dismissed"
    PURCHASED = "purchased"


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False, index=True)
    
    # Recommendation metadata
    recommendation_type = Column(Enum(RecommendationType), nullable=False)
    algorithm_version = Column(String(50), nullable=True)  # e.g., "v2.1.0"
    model_name = Column(String(100), nullable=True)  # e.g., "neural_cf", "transformer"
    
    # Scoring
    confidence_score = Column(Numeric(3, 2), nullable=False)  # 0.00 to 1.00
    relevance_score = Column(Numeric(3, 2), nullable=True)   # 0.00 to 1.00
    popularity_score = Column(Numeric(3, 2), nullable=True)  # 0.00 to 1.00
    novelty_score = Column(Numeric(3, 2), nullable=True)     # 0.00 to 1.00 (how unique/surprising)
    
    # Context
    recommendation_context = Column(String(100), nullable=True)  # "onboarding", "daily", "occasion"
    occasion = Column(String(100), nullable=True)  # "birthday", "christmas", "anniversary"
    target_relationship = Column(String(50), nullable=True)  # "partner", "friend", "family"
    price_range = Column(String(50), nullable=True)  # "budget", "mid", "luxury"
    
    # Explanation
    explanation = Column(Text, nullable=True)  # Human-readable explanation
    reasoning_tags = Column(String, nullable=True)  # JSON array of reasoning tags
    
    # Display information
    rank_position = Column(Integer, nullable=True)  # Position in recommendation list
    is_featured = Column(Boolean, default=False, nullable=False)
    display_priority = Column(Integer, default=0, nullable=False)
    
    # Status and lifecycle
    status = Column(Enum(RecommendationStatus), default=RecommendationStatus.ACTIVE, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    
    # A/B testing
    experiment_id = Column(String(100), nullable=True)
    variant_id = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    served_at = Column(DateTime, nullable=True)  # When shown to user
    
    # Relationships
    user = relationship("User")
    product = relationship("Product", back_populates="recommendations")
    interactions = relationship("RecommendationInteraction", back_populates="recommendation", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Recommendation(id={self.id}, user_id={self.user_id}, confidence={self.confidence_score})>"
    
    @property
    def is_expired(self):
        """Check if recommendation has expired."""
        if self.expires_at:
            return func.now() > self.expires_at
        return False
    
    @property
    def age_hours(self):
        """Get age of recommendation in hours."""
        return int((func.now() - self.created_at).total_seconds() / 3600)
    
    def to_dict(self):
        """Convert recommendation to dictionary."""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "product_id": str(self.product_id),
            "recommendation_type": self.recommendation_type.value,
            "confidence_score": float(self.confidence_score),
            "relevance_score": float(self.relevance_score) if self.relevance_score else None,
            "explanation": self.explanation,
            "rank_position": self.rank_position,
            "status": self.status.value,
            "occasion": self.occasion,
            "created_at": self.created_at.isoformat(),
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
        }


class InteractionType(str, enum.Enum):
    VIEW = "view"                    # User viewed the recommendation
    CLICK = "click"                  # User clicked on product
    LIKE = "like"                    # User liked the recommendation
    DISLIKE = "dislike"             # User disliked the recommendation
    SAVE = "save"                   # User saved to wishlist
    SHARE = "share"                 # User shared the recommendation
    PURCHASE = "purchase"           # User made a purchase
    DISMISS = "dismiss"             # User dismissed the recommendation
    ADD_TO_CART = "add_to_cart"     # User added to cart
    COMPARE = "compare"             # User compared with other products


class RecommendationInteraction(Base):
    __tablename__ = "recommendation_interactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recommendation_id = Column(UUID(as_uuid=True), ForeignKey("recommendations.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Interaction details
    interaction_type = Column(Enum(InteractionType), nullable=False)
    interaction_timestamp = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    
    # Context
    session_id = Column(String(255), nullable=True)  # User session ID
    device_type = Column(String(50), nullable=True)  # "mobile", "tablet", "desktop"
    platform = Column(String(50), nullable=True)     # "ios", "android", "web"
    
    # Interaction metrics
    time_to_interaction = Column(Integer, nullable=True)  # Milliseconds from view to interaction
    interaction_duration = Column(Integer, nullable=True)  # How long they interacted
    
    # Purchase specific data (if interaction_type is purchase)
    purchase_amount = Column(Numeric(10, 2), nullable=True)
    commission_amount = Column(Numeric(10, 2), nullable=True)
    order_id = Column(String(255), nullable=True)
    
    # Analytics
    page_position = Column(Integer, nullable=True)  # Position on page when interacted
    referrer = Column(String(255), nullable=True)   # How they got to the recommendation
    
    # Additional data
    additional_metadata = Column(String, nullable=True)  # JSON string for extra context
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    recommendation = relationship("Recommendation", back_populates="interactions")
    user = relationship("User")
    
    def __repr__(self):
        return f"<RecommendationInteraction(id={self.id}, type={self.interaction_type})>"
    
    def to_dict(self):
        """Convert interaction to dictionary."""
        return {
            "id": str(self.id),
            "recommendation_id": str(self.recommendation_id),
            "user_id": str(self.user_id),
            "interaction_type": self.interaction_type.value,
            "interaction_timestamp": self.interaction_timestamp.isoformat(),
            "time_to_interaction": self.time_to_interaction,
            "purchase_amount": float(self.purchase_amount) if self.purchase_amount else None,
            "commission_amount": float(self.commission_amount) if self.commission_amount else None,
            "platform": self.platform,
            "device_type": self.device_type,
        }


# Analytics helper class
class RecommendationAnalytics:
    """Helper class for analyzing recommendation performance."""
    
    @staticmethod
    def calculate_performance_metrics(recommendations: list) -> dict:
        """Calculate key performance metrics for recommendations."""
        if not recommendations:
            return {}
        
        total_recs = len(recommendations)
        viewed_count = 0
        clicked_count = 0
        purchased_count = 0
        total_revenue = 0
        
        for rec in recommendations:
            interactions = rec.interactions
            has_view = any(i.interaction_type == InteractionType.VIEW for i in interactions)
            has_click = any(i.interaction_type == InteractionType.CLICK for i in interactions)
            purchases = [i for i in interactions if i.interaction_type == InteractionType.PURCHASE]
            
            if has_view:
                viewed_count += 1
            if has_click:
                clicked_count += 1
            if purchases:
                purchased_count += 1
                total_revenue += sum(p.commission_amount or 0 for p in purchases)
        
        return {
            "total_recommendations": total_recs,
            "view_rate": viewed_count / total_recs if total_recs > 0 else 0,
            "click_through_rate": clicked_count / viewed_count if viewed_count > 0 else 0,
            "conversion_rate": purchased_count / clicked_count if clicked_count > 0 else 0,
            "total_revenue": float(total_revenue),
            "revenue_per_recommendation": float(total_revenue) / total_recs if total_recs > 0 else 0,
        }
    
    @staticmethod
    def get_top_performing_categories(recommendations: list, limit: int = 10) -> list:
        """Get top performing product categories by conversion rate."""
        category_stats = {}
        
        for rec in recommendations:
            category = rec.product.primary_category if rec.product else "Unknown"
            
            if category not in category_stats:
                category_stats[category] = {
                    "total": 0,
                    "conversions": 0,
                    "revenue": 0
                }
            
            category_stats[category]["total"] += 1
            
            purchases = [i for i in rec.interactions if i.interaction_type == InteractionType.PURCHASE]
            if purchases:
                category_stats[category]["conversions"] += 1
                category_stats[category]["revenue"] += sum(p.commission_amount or 0 for p in purchases)
        
        # Calculate conversion rates and sort
        for stats in category_stats.values():
            stats["conversion_rate"] = stats["conversions"] / stats["total"] if stats["total"] > 0 else 0
        
        return sorted(
            category_stats.items(),
            key=lambda x: x[1]["conversion_rate"],
            reverse=True
        )[:limit]