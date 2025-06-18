# Import all models to ensure they're registered with SQLAlchemy
from .user import User
from .product import Product, Category, Brand, Retailer
from .recommendation import Recommendation, RecommendationInteraction
from .swipe import SwipeSession, SwipeInteraction
from .gift_link import GiftLink, GiftLinkInteraction
from .affiliate import AffiliateClick, Commission

__all__ = [
    "User",
    "Product", 
    "Category",
    "Brand",
    "Retailer",
    "Recommendation",
    "RecommendationInteraction", 
    "SwipeSession",
    "SwipeInteraction",
    "GiftLink",
    "GiftLinkInteraction",
    "AffiliateClick",
    "Commission",
]