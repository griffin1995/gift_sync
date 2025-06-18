#!/usr/bin/env python3
"""
Simple script to test Upstash Redis connection
"""
import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

UPSTASH_REDIS_REST_URL = os.getenv('UPSTASH_REDIS_REST_URL')
UPSTASH_REDIS_REST_TOKEN = os.getenv('UPSTASH_REDIS_REST_TOKEN')

def test_upstash_connection():
    """Test if we can connect to Upstash Redis"""
    if not UPSTASH_REDIS_REST_URL or not UPSTASH_REDIS_REST_TOKEN:
        print("❌ Missing Upstash credentials in .env file")
        return False
    
    print(f"🔗 Testing connection to: {UPSTASH_REDIS_REST_URL}")
    
    headers = {
        'Authorization': f'Bearer {UPSTASH_REDIS_REST_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Test setting a value
        test_key = "giftsync:test"
        test_value = "connection_test"
        
        set_response = requests.post(
            f"{UPSTASH_REDIS_REST_URL}/set/{test_key}/{test_value}",
            headers=headers,
            timeout=10
        )
        
        if set_response.status_code == 200:
            print("✅ Successfully set test value in Redis")
            
            # Test getting the value
            get_response = requests.get(
                f"{UPSTASH_REDIS_REST_URL}/get/{test_key}",
                headers=headers,
                timeout=10
            )
            
            if get_response.status_code == 200:
                data = get_response.json()
                if data.get('result') == test_value:
                    print("✅ Successfully retrieved test value from Redis")
                    print(f"   Value: {data.get('result')}")
                    
                    # Clean up test key
                    requests.post(
                        f"{UPSTASH_REDIS_REST_URL}/del/{test_key}",
                        headers=headers,
                        timeout=10
                    )
                    print("🧹 Cleaned up test data")
                    return True
                else:
                    print(f"⚠️  Retrieved wrong value: {data.get('result')}")
                    return False
            else:
                print(f"❌ Failed to get value: {get_response.status_code}")
                return False
        else:
            print(f"❌ Failed to set value: {set_response.status_code}")
            print(f"   Response: {set_response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection failed: {e}")
        return False

def check_upstash_info():
    """Display Upstash connection info"""
    print(f"\n📊 Upstash Redis Info:")
    print(f"   Endpoint: {UPSTASH_REDIS_REST_URL}")
    print(f"   Region: Global (via REST API)")
    print(f"   Free Tier: 10,000 commands/day")
    print(f"   Max Connections: 100")
    print(f"   Data Persistence: Yes")

if __name__ == "__main__":
    print("🎁 GiftSync Upstash Redis Connection Test")
    print("=" * 45)
    
    if test_upstash_connection():
        check_upstash_info()
        print("\n🎉 Upstash Redis is ready for caching!")
    else:
        print("\n🔧 Check your .env file and Upstash project settings")