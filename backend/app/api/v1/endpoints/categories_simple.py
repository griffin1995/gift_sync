from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime

from app.database import supabase
from app.models import Category, CategoryBase

router = APIRouter()


@router.get("/", summary="Get all categories")
async def get_categories(
    limit: int = Query(50, le=100, description="Number of categories to return"),
    active_only: bool = Query(True, description="Only return active categories"),
    parent_id: Optional[str] = Query(None, description="Filter by parent category ID")
):
    """Get categories with optional filtering."""
    try:
        filters = {}
        
        if active_only:
            filters["is_active"] = True
            
        if parent_id:
            # Validate UUID format
            try:
                uuid.UUID(parent_id)
                filters["parent_id"] = parent_id
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid parent_id format")
        
        categories = await supabase.select(
            "categories",
            select="*",
            filters=filters,
            limit=limit
        )
        
        return categories
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch categories: {str(e)}")


@router.get("/{category_id}", summary="Get category by ID")
async def get_category_by_id(category_id: str):
    """Get a specific category by ID."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(category_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid category ID format")
        
        categories = await supabase.select(
            "categories",
            filters={"id": category_id}
        )
        
        if not categories:
            raise HTTPException(status_code=404, detail="Category not found")
        
        return categories[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch category: {str(e)}")


@router.post("/", summary="Create new category")
async def create_category(category: CategoryBase):
    """Create a new category."""
    try:
        category_data = category.dict()
        
        # Add metadata
        category_data["id"] = str(uuid.uuid4())
        category_data["created_at"] = datetime.now().isoformat()
        category_data["is_active"] = True
        
        # Validate parent_id if provided
        if category_data.get("parent_id"):
            try:
                uuid.UUID(category_data["parent_id"])
                # Check if parent exists
                parent_check = await supabase.select(
                    "categories",
                    filters={"id": category_data["parent_id"]},
                    limit=1
                )
                if not parent_check:
                    raise HTTPException(status_code=400, detail="Parent category not found")
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid parent_id format")
        
        created_categories = await supabase.insert(
            "categories",
            category_data,
            use_service_key=True
        )
        
        return created_categories[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create category: {str(e)}")


@router.put("/{category_id}", summary="Update category")
async def update_category(category_id: str, category: CategoryBase):
    """Update an existing category."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(category_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid category ID format")
        
        # Check if category exists
        existing = await supabase.select(
            "categories",
            filters={"id": category_id}
        )
        
        if not existing:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Update category
        category_data = category.dict(exclude_unset=True)
        
        # Validate parent_id if being updated
        if "parent_id" in category_data and category_data["parent_id"]:
            try:
                uuid.UUID(category_data["parent_id"])
                # Check if parent exists and is not self
                if category_data["parent_id"] == category_id:
                    raise HTTPException(status_code=400, detail="Category cannot be its own parent")
                    
                parent_check = await supabase.select(
                    "categories",
                    filters={"id": category_data["parent_id"]},
                    limit=1
                )
                if not parent_check:
                    raise HTTPException(status_code=400, detail="Parent category not found")
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid parent_id format")
        
        updated_categories = await supabase.update(
            "categories",
            category_data,
            filters={"id": category_id},
            use_service_key=True
        )
        
        return updated_categories[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update category: {str(e)}")


@router.delete("/{category_id}", summary="Delete category")
async def delete_category(category_id: str):
    """Soft delete a category by setting is_active to False."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(category_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid category ID format")
        
        # Check if category exists
        existing = await supabase.select(
            "categories",
            filters={"id": category_id}
        )
        
        if not existing:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Check if category has children
        children = await supabase.select(
            "categories",
            filters={"parent_id": category_id, "is_active": True},
            limit=1
        )
        
        if children:
            raise HTTPException(
                status_code=400, 
                detail="Cannot delete category with active child categories"
            )
        
        # Soft delete
        await supabase.update(
            "categories",
            {"is_active": False},
            filters={"id": category_id},
            use_service_key=True
        )
        
        return {"message": "Category deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete category: {str(e)}")


@router.get("/tree/hierarchy", summary="Get category tree")
async def get_category_tree():
    """Get categories organized in hierarchical tree structure."""
    try:
        # Get all active categories
        categories = await supabase.select(
            "categories",
            select="*",
            filters={"is_active": True}
        )
        
        # Organize into tree structure
        category_dict = {cat["id"]: cat for cat in categories}
        tree = []
        
        for category in categories:
            if category["parent_id"] is None:
                # Root category
                category["children"] = []
                tree.append(category)
            else:
                # Child category
                parent = category_dict.get(category["parent_id"])
                if parent:
                    if "children" not in parent:
                        parent["children"] = []
                    parent["children"].append(category)
        
        return tree
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to build category tree: {str(e)}")