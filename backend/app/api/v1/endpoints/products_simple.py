from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime

from app.database import supabase
from app.models import Product, ProductCreate

router = APIRouter()


@router.get("/", summary="Get products with filtering")
async def get_products(
    limit: int = Query(20, le=100, description="Number of products to return"),
    category_id: Optional[str] = Query(None, description="Filter by category ID"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    is_active: bool = Query(True, description="Filter by active status")
):
    """Get products with optional filtering."""
    try:
        filters = {"is_active": is_active}
        
        if category_id:
            filters["category_id"] = category_id
        
        # For now, we'll implement basic filtering
        # TODO: Implement price range and search filtering in Supabase queries
        products = await supabase.select(
            "products",
            select="*",
            filters=filters,
            limit=limit
        )
        
        # Apply price filtering client-side for now
        if min_price is not None:
            products = [p for p in products if p.get("price_min", 0) >= min_price]
        if max_price is not None:
            products = [p for p in products if p.get("price_max", float('inf')) <= max_price]
        
        # Apply search filtering client-side for now
        if search:
            search_lower = search.lower()
            products = [
                p for p in products 
                if search_lower in (p.get("title", "") or "").lower() 
                or search_lower in (p.get("description", "") or "").lower()
            ]
        
        return products
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")


@router.get("/{product_id}", summary="Get product by ID")
async def get_product_by_id(product_id: str):
    """Get a specific product by ID."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(product_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid product ID format")
        
        products = await supabase.select(
            "products",
            filters={"id": product_id, "is_active": True}
        )
        
        if not products:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return products[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch product: {str(e)}")


@router.post("/", summary="Create new product")
async def create_product(product: ProductCreate):
    """Create a new product."""
    try:
        product_data = product.dict()
        
        # Add metadata
        product_data["id"] = str(uuid.uuid4())
        product_data["created_at"] = datetime.now().isoformat()
        product_data["updated_at"] = datetime.now().isoformat()
        product_data["is_active"] = True
        
        created_products = await supabase.insert(
            "products",
            product_data,
            use_service_key=True
        )
        
        return created_products[0]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")


@router.put("/{product_id}", summary="Update product")
async def update_product(product_id: str, product: ProductCreate):
    """Update an existing product."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(product_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid product ID format")
        
        # Check if product exists
        existing = await supabase.select(
            "products",
            filters={"id": product_id}
        )
        
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Update product
        product_data = product.dict(exclude_unset=True)
        product_data["updated_at"] = datetime.now().isoformat()
        
        updated_products = await supabase.update(
            "products",
            product_data,
            filters={"id": product_id},
            use_service_key=True
        )
        
        return updated_products[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update product: {str(e)}")


@router.delete("/{product_id}", summary="Delete product")
async def delete_product(product_id: str):
    """Soft delete a product by setting is_active to False."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(product_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid product ID format")
        
        # Check if product exists
        existing = await supabase.select(
            "products",
            filters={"id": product_id}
        )
        
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Soft delete
        await supabase.update(
            "products",
            {"is_active": False, "updated_at": datetime.now().isoformat()},
            filters={"id": product_id},
            use_service_key=True
        )
        
        return {"message": "Product deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete product: {str(e)}")


@router.get("/featured/list", summary="Get featured products")
async def get_featured_products(
    limit: int = Query(10, le=50, description="Number of featured products to return")
):
    """Get featured products."""
    try:
        # TODO: Add is_featured field to products table
        # For now, return recent active products
        products = await supabase.select(
            "products",
            select="*",
            filters={"is_active": True},
            limit=limit
        )
        
        return products
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch featured products: {str(e)}")