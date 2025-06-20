from fastapi import APIRouter, HTTPException, Query, Header
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import random

from app.database import supabase
from app.models import Recommendation, RecommendationCreate
from app.api.v1.endpoints.auth import get_current_user_from_token

router = APIRouter()


@router.get("/", summary="Get personalized recommendations")
async def get_recommendations(
    limit: int = Query(10, le=50, description="Number of recommendations to return"),
    session_id: Optional[str] = Query(None, description="Filter by swipe session"),
    min_confidence: float = Query(0.5, ge=0.0, le=1.0, description="Minimum confidence score"),
    authorization: Optional[str] = Header(None)
):
    """Get personalized recommendations for the authenticated user."""
    try:
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        filters = {"user_id": user_id}
        if session_id:
            try:
                uuid.UUID(session_id)
                filters["session_id"] = session_id
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid session ID format")
        
        # Get existing recommendations
        recommendations = await supabase.select(
            "recommendations",
            select="*",
            filters=filters,
            limit=limit,
            use_service_key=True
        )
        
        # If no recommendations exist, generate some basic ones
        if not recommendations and session_id is None:
            await generate_basic_recommendations(user_id, limit)
            recommendations = await supabase.select(
                "recommendations",
                select="*",
                filters={"user_id": user_id},
                limit=limit,
                use_service_key=True
            )
        
        # Filter by confidence score
        filtered_recommendations = [
            rec for rec in recommendations 
            if rec.get("confidence_score", 0) >= min_confidence
        ]
        
        # Enrich with product data
        enriched_recommendations = []
        for rec in filtered_recommendations:
            product_id = rec.get("product_id")
            if product_id:
                products = await supabase.select(
                    "products",
                    filters={"id": product_id, "is_active": True},
                    limit=1,
                    use_service_key=True
                )
                if products:
                    rec["product"] = products[0]
            enriched_recommendations.append(rec)
        
        return enriched_recommendations
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recommendations: {str(e)}")


@router.post("/generate", summary="Generate new recommendations")
async def generate_recommendations(
    session_id: Optional[str] = Query(None, description="Base recommendations on specific session"),
    force_refresh: bool = Query(False, description="Force regeneration of recommendations"),
    authorization: Optional[str] = Header(None)
):
    """Generate new personalized recommendations for the user."""
    try:
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        # Check if user has recent recommendations (unless force_refresh)
        if not force_refresh:
            recent_cutoff = datetime.now() - timedelta(hours=24)
            recent_recs = await supabase.select(
                "recommendations",
                select="id",
                filters={"user_id": user_id},
                limit=1,
                use_service_key=True
            )
            
            if recent_recs:
                # Check if any are recent
                for rec in recent_recs:
                    rec_created = datetime.fromisoformat(rec.get("created_at", "").replace("Z", "+00:00"))
                    if rec_created > recent_cutoff:
                        return {
                            "message": "Recent recommendations exist. Use force_refresh=true to regenerate.",
                            "existing_count": len(recent_recs)
                        }
        
        # Generate recommendations based on user preferences
        generated_count = await generate_smart_recommendations(user_id, session_id)
        
        return {
            "message": "Recommendations generated successfully",
            "user_id": user_id,
            "session_id": session_id,
            "generated_count": generated_count,
            "status": "completed"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")


@router.post("/{recommendation_id}/interact", summary="Record recommendation interaction")
async def record_recommendation_interaction(
    recommendation_id: str,
    interaction_data: Dict[str, Any],
    authorization: Optional[str] = Header(None)
):
    """Record a user interaction with a recommendation (click, purchase, dismiss)."""
    try:
        # Validate UUID format
        try:
            uuid.UUID(recommendation_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid recommendation ID format")
        
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        # Verify recommendation exists and belongs to user
        recommendations = await supabase.select(
            "recommendations",
            filters={"id": recommendation_id, "user_id": user_id},
            limit=1,
            use_service_key=True
        )
        
        if not recommendations:
            raise HTTPException(status_code=404, detail="Recommendation not found")
        
        recommendation = recommendations[0]
        
        # Update recommendation based on interaction type
        interaction_type = interaction_data.get("interaction_type", "view")
        update_data = {}
        
        if interaction_type == "click":
            update_data["is_clicked"] = True
            update_data["clicked_at"] = datetime.now().isoformat()
        elif interaction_type == "purchase":
            update_data["is_purchased"] = True
            update_data["purchased_at"] = datetime.now().isoformat()
            update_data["is_clicked"] = True  # Assume clicked if purchased
        # Note: dismiss functionality can be added later if needed
        
        # Update the recommendation
        await supabase.update(
            "recommendations",
            update_data,
            filters={"id": recommendation_id},
            use_service_key=True
        )
        
        return {
            "recommendation_id": recommendation_id,
            "interaction_type": interaction_type,
            "recorded_at": datetime.now().isoformat(),
            "status": "recorded"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record interaction: {str(e)}")


@router.get("/analytics", summary="Get recommendation performance analytics")
async def get_recommendation_analytics(
    days: int = Query(30, description="Number of days to analyze"),
    authorization: Optional[str] = Header(None)
):
    """Get analytics about recommendation performance for the user."""
    try:
        # Get user from token
        if authorization:
            user = await get_current_user_from_token(authorization)
            user_id = user["id"]
        else:
            raise HTTPException(status_code=401, detail="Authorization required")
        
        # Get user's recommendations from the specified period
        recommendations = await supabase.select(
            "recommendations",
            select="*",
            filters={"user_id": user_id},
            use_service_key=True
        )
        
        if not recommendations:
            return {
                "message": "No recommendations found",
                "analytics": {
                    "total_recommendations": 0,
                    "click_rate": 0,
                    "purchase_rate": 0,
                    "dismissal_rate": 0
                }
            }
        
        # Calculate metrics
        total_recommendations = len(recommendations)
        clicked_count = len([r for r in recommendations if r.get("is_clicked", False)])
        purchased_count = len([r for r in recommendations if r.get("is_purchased", False)])
        analytics = {
            "total_recommendations": total_recommendations,
            "click_rate": clicked_count / total_recommendations if total_recommendations > 0 else 0,
            "purchase_rate": purchased_count / total_recommendations if total_recommendations > 0 else 0,
            "engagement_score": (clicked_count + purchased_count * 2) / total_recommendations if total_recommendations > 0 else 0
        }
        
        return {
            "period_days": days,
            "analytics": analytics,
            "summary": {
                "most_successful": "high_engagement" if analytics["engagement_score"] > 0.5 else "needs_improvement",
                "recommendation_count": total_recommendations
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch analytics: {str(e)}")


async def generate_basic_recommendations(user_id: str, count: int = 10):
    """Generate basic recommendations for new users."""
    try:
        # Get some popular products from different categories
        products = await supabase.select(
            "products",
            select="*",
            filters={"is_active": True},
            limit=20,
            use_service_key=True
        )
        
        if not products:
            return 0
        
        # Select random products for basic recommendations
        selected_products = random.sample(products, min(count, len(products)))
        
        recommendations = []
        for i, product in enumerate(selected_products):
            rec_data = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "product_id": product["id"],
                "confidence_score": 0.5,  # Basic confidence for new users
                "algorithm_version": "basic_v1.0",
                "reasoning": "Popular product recommendation for new user",
                "rank_position": i + 1,
                "created_at": datetime.now().isoformat(),
                "is_clicked": False,
                "is_purchased": False
            }
            recommendations.append(rec_data)
        
        # Insert recommendations
        if recommendations:
            await supabase.insert(
                "recommendations",
                recommendations,
                use_service_key=True
            )
        
        return len(recommendations)
        
    except Exception as e:
        print(f"Error generating basic recommendations: {e}")
        return 0


async def generate_smart_recommendations(user_id: str, session_id: Optional[str] = None, count: int = 10):
    """Generate smart recommendations based on user's swipe preferences."""
    try:
        # Get user's swipe interactions to understand preferences
        interactions = await supabase.select(
            "swipe_interactions",
            select="*",
            filters={"user_id": user_id},
            use_service_key=True
        )
        
        if not interactions:
            # No swipe data, fall back to basic recommendations
            return await generate_basic_recommendations(user_id, count)
        
        # Analyze positive swipes (right swipes)
        positive_swipes = [i for i in interactions if i["swipe_direction"] == "right"]
        
        if not positive_swipes:
            return await generate_basic_recommendations(user_id, count)
        
        # Get preferred categories and products
        preferred_categories = set()
        preferred_products = set()
        
        for swipe in positive_swipes:
            if swipe.get("category_id"):
                preferred_categories.add(swipe["category_id"])
            if swipe.get("product_id"):
                preferred_products.add(swipe["product_id"])
        
        # Find similar products in preferred categories
        candidate_products = []
        
        for category_id in preferred_categories:
            products = await supabase.select(
                "products",
                select="*",
                filters={"category_id": category_id, "is_active": True},
                limit=20,
                use_service_key=True
            )
            
            # Filter out products user has already swiped on
            filtered_products = [
                p for p in products 
                if p["id"] not in preferred_products
            ]
            candidate_products.extend(filtered_products)
        
        if not candidate_products:
            return await generate_basic_recommendations(user_id, count)
        
        # Select top candidates
        selected_products = candidate_products[:count]
        
        # Generate recommendations with higher confidence
        recommendations = []
        for i, product in enumerate(selected_products):
            confidence = min(0.9, 0.6 + (len(positive_swipes) * 0.05))  # Higher confidence based on data
            
            rec_data = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "product_id": product["id"],
                "session_id": session_id,
                "confidence_score": confidence,
                "algorithm_version": "preference_based_v1.0",
                "reasoning": f"Recommended based on {len(positive_swipes)} positive interactions in preferred categories",
                "rank_position": i + 1,
                "created_at": datetime.now().isoformat(),
                "is_clicked": False,
                "is_purchased": False
            }
            recommendations.append(rec_data)
        
        # Insert recommendations
        if recommendations:
            await supabase.insert(
                "recommendations",
                recommendations,
                use_service_key=True
            )
        
        return len(recommendations)
        
    except Exception as e:
        print(f"Error generating smart recommendations: {e}")
        return await generate_basic_recommendations(user_id, count)