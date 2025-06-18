from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class SwipeDirection(str, enum.Enum):
    LEFT = "left"      # Dislike
    RIGHT = "right"    # Like
    UP = "up"         # Super like/love


class SwipeSession(Base):
    __tablename__ = "swipe_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Session information
    session_type = Column(String(50), default="onboarding", nullable=False)  # "onboarding", "discovery", "refresh"
    device_id = Column(String(255), nullable=True)
    platform = Column(String(50), nullable=True)  # "ios", "android", "web"
    
    # Session tracking
    session_start = Column(DateTime, server_default=func.now(), nullable=False)
    session_end = Column(DateTime, nullable=True)
    total_swipes = Column(Integer, default=0, nullable=False)
    likes_count = Column(Integer, default=0, nullable=False)
    dislikes_count = Column(Integer, default=0, nullable=False)
    super_likes_count = Column(Integer, default=0, nullable=False)
    
    # Completion tracking
    is_completed = Column(Boolean, default=False, nullable=False)
    completion_rate = Column(String, nullable=True)  # Percentage as string
    interrupted_at_swipe = Column(Integer, nullable=True)
    
    # Analytics
    average_time_per_swipe = Column(Integer, nullable=True)  # Milliseconds
    total_session_time = Column(Integer, nullable=True)  # Seconds
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User")
    interactions = relationship("SwipeInteraction", back_populates="session", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<SwipeSession(id={self.id}, user_id={self.user_id}, total_swipes={self.total_swipes})>"
    
    @property
    def duration_seconds(self):
        """Calculate session duration in seconds."""
        if self.session_end:
            return int((self.session_end - self.session_start).total_seconds())
        return None
    
    @property
    def like_rate(self):
        """Calculate percentage of likes vs total swipes."""
        if self.total_swipes == 0:
            return 0
        return round((self.likes_count / self.total_swipes) * 100, 1)
    
    def to_dict(self):
        """Convert session to dictionary."""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "session_type": self.session_type,
            "total_swipes": self.total_swipes,
            "likes_count": self.likes_count,
            "dislikes_count": self.dislikes_count,
            "super_likes_count": self.super_likes_count,
            "is_completed": self.is_completed,
            "completion_rate": self.completion_rate,
            "like_rate": self.like_rate,
            "duration_seconds": self.duration_seconds,
            "session_start": self.session_start.isoformat(),
            "session_end": self.session_end.isoformat() if self.session_end else None,
        }


class SwipeInteraction(Base):
    __tablename__ = "swipe_interactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("swipe_sessions.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Swipe target (what was swiped on)
    category_id = Column(UUID(as_uuid=True), nullable=True)  # If swiping on categories
    category_name = Column(String(100), nullable=True)
    product_id = Column(UUID(as_uuid=True), nullable=True)  # If swiping on products
    content_type = Column(String(50), nullable=False)  # "category", "product", "style"
    
    # Swipe details
    swipe_direction = Column(Enum(SwipeDirection), nullable=False)
    swipe_timestamp = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    
    # Interaction metrics
    time_viewed = Column(Integer, nullable=True)  # Milliseconds before swipe
    swipe_order = Column(Integer, nullable=False)  # Order in session (1, 2, 3...)
    
    # Swipe mechanics (for analytics)
    swipe_velocity = Column(String, nullable=True)  # "slow", "medium", "fast"
    swipe_distance = Column(String, nullable=True)  # "short", "medium", "long"
    
    # Context
    screen_position = Column(Integer, nullable=True)  # Position in feed/stack
    additional_data = Column(String, nullable=True)  # JSON string for extra data
    
    # ML features (computed)
    confidence_score = Column(String, nullable=True)  # How confident the swipe was
    is_outlier = Column(Boolean, default=False, nullable=False)  # Unusual swipe pattern
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    session = relationship("SwipeSession", back_populates="interactions")
    user = relationship("User")
    
    def __repr__(self):
        return f"<SwipeInteraction(id={self.id}, direction={self.swipe_direction}, content={self.content_type})>"
    
    def to_dict(self):
        """Convert interaction to dictionary."""
        return {
            "id": str(self.id),
            "session_id": str(self.session_id),
            "user_id": str(self.user_id),
            "category_name": self.category_name,
            "content_type": self.content_type,
            "swipe_direction": self.swipe_direction.value,
            "time_viewed": self.time_viewed,
            "swipe_order": self.swipe_order,
            "swipe_timestamp": self.swipe_timestamp.isoformat(),
            "confidence_score": self.confidence_score,
        }


# Helper function to process swipe sessions for ML training
class SwipeAnalytics:
    """Helper class for analyzing swipe patterns and extracting insights."""
    
    @staticmethod
    def calculate_user_preferences(user_id: str, sessions: list) -> dict:
        """Calculate user preferences based on swipe history."""
        category_preferences = {}
        total_swipes = 0
        total_likes = 0
        
        for session in sessions:
            for interaction in session.interactions:
                total_swipes += 1
                
                if interaction.swipe_direction == SwipeDirection.RIGHT:
                    total_likes += 1
                    category = interaction.category_name
                    if category:
                        category_preferences[category] = category_preferences.get(category, 0) + 1
                elif interaction.swipe_direction == SwipeDirection.UP:  # Super like
                    total_likes += 1
                    category = interaction.category_name
                    if category:
                        category_preferences[category] = category_preferences.get(category, 0) + 2  # Weight super likes more
        
        # Normalize scores
        max_score = max(category_preferences.values()) if category_preferences else 1
        normalized_preferences = {
            cat: score / max_score for cat, score in category_preferences.items()
        }
        
        return {
            "category_preferences": normalized_preferences,
            "overall_like_rate": total_likes / total_swipes if total_swipes > 0 else 0,
            "total_swipes": total_swipes,
            "selectivity_score": 1 - (total_likes / total_swipes) if total_swipes > 0 else 0.5,
        }
    
    @staticmethod
    def detect_swipe_patterns(interactions: list) -> dict:
        """Detect patterns in swipe behavior for fraud detection and insights."""
        if not interactions:
            return {"is_valid": True, "confidence": 1.0}
        
        # Check for bot-like behavior
        time_gaps = []
        directions = []
        
        for i, interaction in enumerate(interactions):
            directions.append(interaction.swipe_direction)
            if i > 0:
                prev_time = interactions[i-1].swipe_timestamp
                current_time = interaction.swipe_timestamp
                gap = (current_time - prev_time).total_seconds()
                time_gaps.append(gap)
        
        # Calculate metrics
        avg_time_gap = sum(time_gaps) / len(time_gaps) if time_gaps else 0
        direction_variance = len(set(directions)) / len(directions) if directions else 0
        
        # Simple heuristics for bot detection
        is_too_fast = avg_time_gap < 0.5  # Less than 500ms between swipes
        is_too_uniform = direction_variance < 0.3  # Too little variety in swipes
        
        return {
            "is_valid": not (is_too_fast and is_too_uniform),
            "avg_time_gap": avg_time_gap,
            "direction_variance": direction_variance,
            "confidence": min(avg_time_gap * direction_variance, 1.0),
        }