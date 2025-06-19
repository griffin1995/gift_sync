"""
Minimal test server for registration testing
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import jwt
import bcrypt
import uuid
from datetime import datetime

app = FastAPI(title="GiftSync Test API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    date_of_birth: str = None
    marketing_consent: bool = False

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: dict

@app.get("/")
async def root():
    return {"message": "GiftSync Test API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/v1/auth/register")
async def register(user_data: UserRegister):
    """Test registration endpoint"""
    
    # Simple validation
    if "@" not in user_data.email:
        raise HTTPException(status_code=422, detail="Invalid email")
    
    if len(user_data.password) < 8:
        raise HTTPException(status_code=422, detail="Password too short")
    
    # Mock successful registration
    user_id = str(uuid.uuid4())
    
    # Create mock tokens
    access_token = jwt.encode(
        {"user_id": user_id, "email": user_data.email},
        "test-secret-key",
        algorithm="HS256"
    )
    refresh_token = jwt.encode(
        {"user_id": user_id, "type": "refresh"},
        "test-secret-key",
        algorithm="HS256"
    )
    
    # Mock user data
    user = {
        "id": user_id,
        "email": user_data.email,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "subscription_tier": "free",
        "created_at": datetime.now().isoformat(),
        "last_login": datetime.now().isoformat()
    }
    
    return {
        "data": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user
        },
        "message": "User registered successfully",
        "success": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=3001)