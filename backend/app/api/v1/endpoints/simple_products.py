from fastapi import APIRouter, HTTPException, status, Query, Header
from typing import List, Optional
from pydantic import BaseModel
from app.database import supabase
from app.api.v1.endpoints.auth import get_current_user_from_token

router = APIRouter()

class ProductResponse(BaseModel):
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

@router.get("/", response_model=List[ProductResponse], summary="Search products")
async def search_products(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(20, description="Number of products to return")
):
    """Search and filter products."""
    try:
        # For now, return mock data since we don't have products in Supabase yet
        mock_products = [
            {
                "id": "1",
                "title": "Wireless Headphones",
                "description": "High-quality wireless headphones with noise cancellation",
                "price": 199.99,
                "currency": "GBP",
                "category": "Electronics",
                "brand": "AudioTech",
                "retailer": "Amazon",
                "image_url": "https://picsum.photos/400/300?random=1",
                "affiliate_url": "https://amazon.co.uk/headphones"
            },
            {
                "id": "2", 
                "title": "Coffee Maker",
                "description": "Premium coffee maker for the perfect brew",
                "price": 149.99,
                "currency": "GBP",
                "category": "Kitchen",
                "brand": "BrewMaster",
                "retailer": "Amazon",
                "image_url": "https://picsum.photos/400/300?random=2",
                "affiliate_url": "https://amazon.co.uk/coffee-maker"
            },
            {
                "id": "3",
                "title": "Smart Watch",
                "description": "Feature-rich smartwatch with health tracking",
                "price": 299.99,
                "currency": "GBP",
                "category": "Electronics",
                "brand": "TechWear",
                "retailer": "Amazon",
                "image_url": "https://picsum.photos/400/300?random=3",
                "affiliate_url": "https://amazon.co.uk/smartwatch"
            },
            {
                "id": "4",
                "title": "Laptop Stand",
                "description": "Ergonomic laptop stand for better posture",
                "price": 49.99,
                "currency": "GBP",
                "category": "Office",
                "brand": "DeskPro",
                "retailer": "Amazon",
                "image_url": "https://picsum.photos/400/300?random=4",
                "affiliate_url": "https://amazon.co.uk/laptop-stand"
            },
            {
                "id": "5",
                "title": "Wireless Charger",
                "description": "Fast wireless charging pad for all devices",
                "price": 34.99,
                "currency": "GBP",
                "category": "Electronics",
                "brand": "ChargeMaster",
                "retailer": "Amazon",
                "image_url": "https://picsum.photos/400/300?random=5",
                "affiliate_url": "https://amazon.co.uk/wireless-charger"
            }
        ]
        
        # Filter by search query if provided
        if q:
            mock_products = [p for p in mock_products if q.lower() in p["title"].lower() or q.lower() in p["description"].lower()]
            
        # Filter by category if provided
        if category:
            mock_products = [p for p in mock_products if p["category"].lower() == category.lower()]
            
        return mock_products[:limit]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search products: {str(e)}")

@router.get("/{product_id}", response_model=ProductResponse, summary="Get product by ID")
async def get_product(product_id: str):
    """Get a specific product by ID."""
    # Mock product for now
    if product_id == "1":
        return {
            "id": "1",
            "title": "Wireless Headphones",
            "description": "High-quality wireless headphones with noise cancellation",
            "price": 199.99,
            "currency": "GBP", 
            "category": "Electronics",
            "brand": "AudioTech",
            "retailer": "Amazon",
            "image_url": "https://picsum.photos/400/300?random=1",
            "affiliate_url": "https://amazon.co.uk/headphones"
        }
    else:
        raise HTTPException(status_code=404, detail="Product not found")