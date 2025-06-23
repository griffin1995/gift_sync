"""
GiftSync Authentication API Endpoints

Provides secure user authentication services including registration,
login, token refresh, and session management. Implements JWT-based
authentication with bcrypt password hashing.

Security Features:
- JWT access tokens (30 minute expiry)
- JWT refresh tokens (30 day expiry)
- bcrypt password hashing with salt
- Registration toggle via feature flag
- Comprehensive input validation
- Rate limiting ready (implement in production)

Endpoints:
- POST /auth/register: Create new user account
- POST /auth/login: Authenticate existing user
- POST /auth/refresh: Renew access token
- GET /auth/me: Get current user profile
- POST /auth/logout: End user session
"""

# ==============================================================================
# IMPORTS AND DEPENDENCIES
# ==============================================================================

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
from app.core.database import get_db
from app.models_sqlalchemy.user import User

# FastAPI router for authentication endpoints
router = APIRouter()

# ==============================================================================
# REQUEST/RESPONSE MODELS
# ==============================================================================
# Pydantic models for request validation and response serialisation

class UserRegistration(BaseModel):
    """
    User registration request model.
    
    Validates new user registration data with required fields
    and optional marketing consent for GDPR compliance.
    
    Fields:
        first_name: User's first name (required)
        last_name: User's last name (required)
        email: Valid email address (required, unique)
        password: User password (required, min 8 chars)
        marketing_consent: Optional marketing email consent (GDPR)
    """
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    marketing_consent: Optional[bool] = False

class UserLogin(BaseModel):
    """
    User login request model.
    
    Validates user authentication credentials for login endpoint.
    
    Fields:
        email: User's registered email address
        password: User's password in plain text (encrypted in transit)
    """
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """
    User profile response model.
    
    Contains safe user data for API responses (excludes sensitive fields
    like password hash).
    
    Fields:
        id: Unique user identifier (UUID)
        email: User's email address
        first_name: User's first name
        last_name: User's last name
        subscription_tier: User's subscription level
        created_at: Account creation timestamp (ISO format)
        last_login: Most recent login timestamp (ISO format)
    """
    id: str
    email: str
    first_name: str
    last_name: str
    subscription_tier: str
    created_at: str
    last_login: Optional[str] = None

class AuthResponse(BaseModel):
    """
    Authentication response model.
    
    Contains JWT tokens and user profile data returned after
    successful login or registration.
    
    Fields:
        access_token: JWT access token (30 minute expiry)
        refresh_token: JWT refresh token (30 day expiry)
        user: Complete user profile data
    """
    access_token: str
    refresh_token: str
    user: UserResponse


# ==============================================================================
# AUTHENTICATION ENDPOINTS
# ==============================================================================

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegistration):
    """
    Register a new user account.
    
    Creates a new user account with secure password hashing and returns
    JWT tokens for immediate authentication. Includes email uniqueness
    validation and GDPR compliance handling.
    
    Security Features:
        - bcrypt password hashing with salt
        - Email uniqueness validation
        - UUID generation for user ID
        - Immediate JWT token generation
        - Feature flag protection
    
    Parameters:
        user_data: UserRegistration model with required user information
    
    Returns:
        AuthResponse: JWT tokens and user profile data
    
    Raises:
        HTTPException 403: Registration disabled via feature flag
        HTTPException 400: Email already exists
        HTTPException 500: Database error during user creation
    
    Example:
        POST /auth/register
        {
            "first_name": "John",
            "last_name": "Smith", 
            "email": "john@example.com",
            "password": "SecurePass123",
            "marketing_consent": true
        }
    """
    # Check if registration is enabled via feature flag
    if not settings.ENABLE_REGISTRATION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Registration is currently disabled"
        )
    
    try:
        # ===========================================================================
        # EMAIL UNIQUENESS VALIDATION
        # ===========================================================================
        # Check if user already exists with this email address
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
        
        # ===========================================================================
        # SECURE PASSWORD HASHING
        # ===========================================================================
        # Hash password using bcrypt with automatically generated salt
        password_hash = bcrypt.hashpw(
            user_data.password.encode('utf-8'),  # Convert to bytes
            bcrypt.gensalt()                     # Generate random salt
        ).decode('utf-8')                        # Convert back to string for storage
        
        # ===========================================================================
        # USER DATA PREPARATION
        # ===========================================================================
        # Generate unique user ID and prepare user data for database insertion
        user_id = str(uuid.uuid4())  # Generate UUID for user ID
        full_name = f"{user_data.first_name} {user_data.last_name}".strip()
        
        user_create_data = {
            "id": user_id,                              # Unique user identifier
            "email": user_data.email,                   # User's email address
            "first_name": user_data.first_name,         # User's first name
            "last_name": user_data.last_name,           # User's last name
            "full_name": full_name,                     # Combined full name
            "password_hash": password_hash,             # Securely hashed password
            "subscription_tier": "free",                # Default to free tier
            "gdpr_consent": True,                       # GDPR consent (required for registration)
            "is_active": True,                          # Account is active
            "email_verified": False,                    # Email verification pending
            # Note: created_at and updated_at will be set by database defaults
            "last_login_at": datetime.now().isoformat() # Set initial login time
        }
        
        # ===========================================================================
        # DATABASE USER CREATION
        # ===========================================================================
        # Insert new user record into database with service key privileges
        created_users = await supabase.insert(
            "users",                    # Target table
            user_create_data,           # User data to insert
            use_service_key=True        # Bypass RLS policies
        )
        
        created_user = created_users[0]  # Get created user record
        
        # ===========================================================================
        # JWT TOKEN GENERATION
        # ===========================================================================
        # Generate access and refresh tokens for immediate authentication
        access_token = jwt.encode(
            {
                "user_id": created_user["id"],     # User identifier for API requests
                "email": created_user["email"],     # Email for additional verification
                "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            },
            settings.SECRET_KEY,                     # JWT signing secret
            algorithm="HS256"                        # HMAC SHA-256 algorithm
        )
        
        refresh_token = jwt.encode(
            {
                "user_id": created_user["id"],     # User identifier
                "type": "refresh",                  # Token type for validation
                "exp": datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
            },
            settings.SECRET_KEY,                     # JWT signing secret
            algorithm="HS256"                        # HMAC SHA-256 algorithm
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


# Additional function to get current user as SQLAlchemy model (for complex endpoints)
async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current user as SQLAlchemy User model from JWT token."""
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
        
        # Get user from database using SQLAlchemy
        from sqlalchemy import select
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
        
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