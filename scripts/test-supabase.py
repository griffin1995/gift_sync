#!/usr/bin/env python3
"""
Simple script to test Supabase connection
"""
import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

def test_supabase_connection():
    """Test if we can connect to Supabase"""
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        print("❌ Missing Supabase credentials in .env file")
        return False
    
    print(f"🔗 Testing connection to: {SUPABASE_URL}")
    
    # Test basic connection
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Try to access a simple endpoint
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Supabase connection successful!")
            print(f"   Status: {response.status_code}")
            return True
        else:
            print(f"⚠️  Supabase responded with status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection failed: {e}")
        return False

def check_supabase_setup():
    """Check what additional setup is needed"""
    print("\n📋 Supabase Setup Checklist:")
    print("✅ Project created")
    print("✅ API keys configured")
    print("\n🔧 Next steps needed:")
    print("1. Go to: https://supabase.com/dashboard/project/xchsarvamppwephulylt")
    print("2. Settings → API → Copy 'service_role' key")
    print("3. Settings → Database → Copy database password")
    print("4. Create database tables (we'll help with this)")
    print("5. Set up Row Level Security policies")

if __name__ == "__main__":
    print("🎁 GiftSync Supabase Connection Test")
    print("=" * 40)
    
    if test_supabase_connection():
        check_supabase_setup()
    else:
        print("\n🔧 Check your .env file and Supabase project settings")