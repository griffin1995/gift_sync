from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
import jwt
import bcrypt
import uuid
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.core.config import settings
from app.database import supabase

router = APIRouter()

# Pydantic models for auth
class UserRegistration(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    marketing_consent: Optional[bool] = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    subscription_tier: str
    created_at: str
    last_login: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegistration):
    """Register a new user."""
    if not settings.ENABLE_REGISTRATION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Registration is currently disabled"
        )
    
    try:
        # Check if user already exists
        existing_users = await supabase.select(
            "users",
            select="email",
            filters={"email": user_data.email},
            use_service_key=True
        )
        
        if existing_users:
            raise HTTPException(
                status_code=400,
                detail="User with this email already exists"
            )
        
        # Hash password
        password_hash = bcrypt.hashpw(
            user_data.password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Create user data
        user_id = str(uuid.uuid4())
        full_name = f"{user_data.first_name} {user_data.last_name}".strip()
        user_create_data = {
            "id": user_id,
            "email": user_data.email,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "full_name": full_name,
            "password_hash": password_hash,
            "subscription_tier": "free",
            "gdpr_consent": True,
            "is_active": True,
            "email_verified": False,
            # Note: created_at and updated_at will be set by database defaults
            "last_login_at": datetime.now().isoformat()
        }
        
        # Insert user into database
        created_users = await supabase.insert(
            "users",
            user_create_data,
            use_service_key=True
        )
        
        created_user = created_users[0]
        
        # Generate tokens
        access_token = jwt.encode(
            {"user_id": created_user["id"], "email": created_user["email"]},
            settings.SECRET_KEY,
            algorithm="HS256"
        )
        refresh_token = jwt.encode(
            {"user_id": created_user["id"], "type": "refresh"},
            settings.SECRET_KEY,
            algorithm="HS256"
        )
        
        # Return user data without password
        user_response = {
            "id": created_user["id"],
            "email": created_user["email"],
            "first_name": created_user["first_name"],
            "last_name": created_user["last_name"],
            "subscription_tier": created_user["subscription_tier"],
            "created_at": created_user["created_at"],
            "last_login": created_user["last_login_at"]
        }
        
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    """Login user and return access tokens."""
    try:
        # Find user by email
        users = await supabase.select(
            "users",
            select="*",
            filters={"email": credentials.email},
            use_service_key=True
        )
        
        if not users:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user = users[0]
        
        # Verify password
        if "password_hash" not in user or not user["password_hash"]:
            raise HTTPException(status_code=401, detail="Invalid credentials - no password hash")
        
        if not bcrypt.checkpw(credentials.password.encode('utf-8'), user["password_hash"].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials - password mismatch")
        
        # Update last login
        await supabase.update(
            "users",
            {"last_login_at": datetime.now().isoformat()},
            filters={"id": user["id"]},
            use_service_key=True
        )
        
        # Generate tokens
        access_token = jwt.encode(
            {"user_id": user["id"], "email": user["email"]},
            settings.SECRET_KEY,
            algorithm="HS256"
        )
        refresh_token = jwt.encode(
            {"user_id": user["id"], "type": "refresh"},
            settings.SECRET_KEY,
            algorithm="HS256"
        )
        
        # Return user data without password
        user_response = {
            "id": user["id"],
            "email": user["email"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "subscription_tier": user["subscription_tier"],
            "created_at": user["created_at"],
            "last_login": user.get("last_login_at", datetime.now().isoformat())
        }
        
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.get("/me", response_model=UserResponse)
async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current user information from JWT token."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    try:
        # Extract token from "Bearer <token>" format
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format"
            )
        
        token = authorization.split(" ")[1]
        
        # Decode JWT token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Get user from database
        users = await supabase.select(
            "users",
            select="id,email,first_name,last_name,subscription_tier,created_at,last_login_at",
            filters={"id": user_id},
            use_service_key=True
        )
        
        if not users:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        user = users[0]
        
        return UserResponse(
            id=user["id"],
            email=user["email"],
            first_name=user["first_name"],
            last_name=user["last_name"],
            subscription_tier=user["subscription_tier"],
            created_at=user["created_at"],
            last_login=user.get("last_login_at")
        )
        
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}"
        )

@router.post("/refresh")
async def refresh_token(refresh_token_data: dict):
    """Refresh access token using refresh token (placeholder)."""
    # Placeholder implementation - in production would validate refresh token
    return {
        "access_token": "new-access-token",
        "refresh_token": "new-refresh-token",
        "message": "Token refreshed successfully"
    }


@router.post("/logout")
async def logout():
    """Logout user (client should discard tokens)."""
    return {"message": "Successfully logged out"}

# Helper function to get current user (for other endpoints)
async def get_current_user_from_token(authorization: str) -> dict:
    """Extract user from JWT token - helper function for other endpoints."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.split(" ")[1]
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        users = await supabase.select(
            "users",
            select="*",
            filters={"id": user_id},
            use_service_key=True
        )
        
        if not users:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return users[0]
        
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )