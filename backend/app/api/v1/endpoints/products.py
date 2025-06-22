from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func, desc, asc, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models_sqlalchemy.user import User
from app.models_sqlalchemy.product import Product, Category, Brand, Retailer
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.get("/", summary="Search and filter products")
async def search_products(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    sort_by: Optional[str] = Query("popularity", description="Sort by: price, rating, popularity"),
    sort_order: Optional[str] = Query("desc", description="Sort order: asc, desc"),
    limit: int = Query(20, le=100, description="Number of products to return"),
    offset: int = Query(0, description="Number of products to skip"),
    db: AsyncSession = Depends(get_db)
):
    """Search and filter products with various criteria."""
    
    # Build query
    stmt = select(Product).where(Product.is_active == True)
    
    # Apply filters
    if q:
        search_term = f"%{q}%"
        stmt = stmt.where(
            or_(
                Product.title.ilike(search_term),
                Product.description.ilike(search_term),
                Product.brand.ilike(search_term)
            )
        )
    
    if category:
        stmt = stmt.where(
            or_(
                Product.primary_category.ilike(f"%{category}%"),
                Product.category_path.ilike(f"%{category}%")
            )
        )
    
    if brand:
        stmt = stmt.where(Product.brand.ilike(f"%{brand}%"))
    
    if min_price is not None:
        stmt = stmt.where(Product.price >= min_price)
    
    if max_price is not None:
        stmt = stmt.where(Product.price <= max_price)
    
    # Apply sorting
    if sort_by == "price":
        order_col = Product.price
    elif sort_by == "rating":
        order_col = Product.average_rating
    elif sort_by == "popularity":
        order_col = Product.popularity_score
    else:
        order_col = Product.created_at
    
    if sort_order == "asc":
        stmt = stmt.order_by(asc(order_col))
    else:
        stmt = stmt.order_by(desc(order_col))
    
    # Apply pagination
    stmt = stmt.limit(limit).offset(offset)
    
    result = await db.execute(stmt)
    products = result.scalars().all()
    
    return [product.to_dict() for product in products]


@router.get("/{product_id}", summary="Get product by ID")
async def get_product_by_id(
    product_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific product by ID."""
    
    try:
        product_uuid = uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID format"
        )
    
    stmt = select(Product).where(Product.id == product_uuid, Product.is_active == True)
    result = await db.execute(stmt)
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Increment view count
    product.view_count += 1
    await db.commit()
    
    return product.to_dict()


@router.post("/{product_id}/click", summary="Track product click")
async def track_product_click(
    product_id: str,
    click_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Track when a user clicks on a product (for analytics and affiliate tracking)."""
    
    try:
        product_uuid = uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID format"
        )
    
    stmt = select(Product).where(Product.id == product_uuid, Product.is_active == True)
    result = await db.execute(stmt)
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Increment click count
    product.click_count += 1
    await db.commit()
    
    # TODO: Create affiliate click tracking record
    # This would typically involve creating a record in an affiliate_clicks table
    # for commission tracking and attribution
    
    return {
        "product_id": str(product.id),
        "affiliate_url": product.affiliate_url or product.product_url,
        "tracked": True
    }


@router.get("/categories/", summary="Get all product categories")
async def get_categories(
    parent_id: Optional[str] = Query(None, description="Filter by parent category ID"),
    level: Optional[int] = Query(None, description="Filter by category level"),
    db: AsyncSession = Depends(get_db)
):
    """Get product categories, optionally filtered by parent or level."""
    
    stmt = select(Category).where(Category.is_active == True)
    
    if parent_id:
        try:
            parent_uuid = uuid.UUID(parent_id)
            stmt = stmt.where(Category.parent_id == parent_uuid)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid parent ID format"
            )
    
    if level is not None:
        stmt = stmt.where(Category.level == level)
    
    stmt = stmt.order_by(Category.sort_order, Category.name)
    
    result = await db.execute(stmt)
    categories = result.scalars().all()
    
    return [
        {
            "id": str(category.id),
            "name": category.name,
            "slug": category.slug,
            "description": category.description,
            "parent_id": str(category.parent_id) if category.parent_id else None,
            "level": category.level,
            "icon_url": category.icon_url,
            "color_hex": category.color_hex,
            "popularity_score": float(category.popularity_score) if category.popularity_score else None,
        }
        for category in categories
    ]


@router.get("/brands/", summary="Get all brands")
async def get_brands(
    limit: int = Query(50, le=100),
    offset: int = Query(0),
    featured_only: bool = Query(False, description="Only return featured brands"),
    db: AsyncSession = Depends(get_db)
):
    """Get all product brands."""
    
    stmt = select(Brand).where(Brand.is_active == True)
    
    if featured_only:
        stmt = stmt.where(Brand.is_featured == True)
    
    stmt = stmt.order_by(desc(Brand.popularity_score), Brand.name)
    stmt = stmt.limit(limit).offset(offset)
    
    result = await db.execute(stmt)
    brands = result.scalars().all()
    
    return [
        {
            "id": str(brand.id),
            "name": brand.name,
            "slug": brand.slug,
            "description": brand.description,
            "logo_url": brand.logo_url,
            "website_url": brand.website_url,
            "product_count": brand.product_count,
            "popularity_score": float(brand.popularity_score) if brand.popularity_score else None,
            "is_featured": brand.is_featured,
        }
        for brand in brands
    ]


@router.get("/featured/", summary="Get featured products")
async def get_featured_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(10, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Get featured products, optionally filtered by category."""
    
    stmt = select(Product).where(
        Product.is_active == True,
        Product.is_featured == True
    )
    
    if category:
        stmt = stmt.where(
            or_(
                Product.primary_category.ilike(f"%{category}%"),
                Product.category_path.ilike(f"%{category}%")
            )
        )
    
    stmt = stmt.order_by(desc(Product.popularity_score))
    stmt = stmt.limit(limit)
    
    result = await db.execute(stmt)
    products = result.scalars().all()
    
    return [product.to_dict() for product in products]


@router.get("/trending/", summary="Get trending products")
async def get_trending_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(10, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Get trending products based on recent activity."""
    
    stmt = select(Product).where(Product.is_active == True)
    
    if category:
        stmt = stmt.where(
            or_(
                Product.primary_category.ilike(f"%{category}%"),
                Product.category_path.ilike(f"%{category}%")
            )
        )
    
    stmt = stmt.order_by(desc(Product.trending_score))
    stmt = stmt.limit(limit)
    
    result = await db.execute(stmt)
    products = result.scalars().all()
    
    return [product.to_dict() for product in products]