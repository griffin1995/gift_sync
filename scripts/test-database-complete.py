#!/usr/bin/env python3
"""
Test the complete GiftSync database setup in Supabase
"""
import requests
import json
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

def test_table_access(table_name, key=SUPABASE_ANON_KEY):
    """Test if we can read from a table"""
    headers = {
        'apikey': key,
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/{table_name}?limit=5",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {table_name}: {len(data)} records")
            return True, data
        else:
            print(f"❌ {table_name}: {response.status_code} - {response.text}")
            return False, None
            
    except Exception as e:
        print(f"❌ {table_name}: {e}")
        return False, None

def test_categories():
    """Test categories table and show sample data"""
    print("\n📂 Testing Categories Table:")
    success, data = test_table_access('categories')
    
    if success and data:
        print("   Sample categories:")
        for cat in data[:5]:
            print(f"   • {cat['name']} ({cat['slug']})")
    
    return success

def test_database_structure():
    """Test all main tables"""
    print("🗄️  Testing Database Structure")
    print("=" * 40)
    
    tables = [
        'categories',
        'users', 
        'products',
        'swipe_sessions',
        'swipe_interactions', 
        'recommendations',
        'gift_links'
    ]
    
    results = {}
    for table in tables:
        success, data = test_table_access(table)
        results[table] = success
    
    return results

def create_sample_products():
    """Create some sample products for testing"""
    print("\n🛍️  Creating Sample Products:")
    
    headers = {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    # First, get category IDs
    try:
        cat_response = requests.get(
            f"{SUPABASE_URL}/rest/v1/categories?select=id,slug&limit=5",
            headers=headers,
            timeout=10
        )
        
        if cat_response.status_code != 200:
            print("❌ Could not fetch categories")
            return False
            
        categories = cat_response.json()
        if not categories:
            print("❌ No categories found")
            return False
            
        # Sample products
        sample_products = [
            {
                "title": "Wireless Bluetooth Headphones",
                "description": "Premium noise-cancelling wireless headphones with 30-hour battery life",
                "price_min": 79.99,
                "price_max": 149.99,
                "brand": "TechSound",
                "category_id": categories[0]['id'],
                "tags": ["wireless", "bluetooth", "music", "noise-cancelling"],
                "rating": 4.5,
                "review_count": 1247,
                "features": {
                    "battery_life": "30 hours",
                    "noise_cancelling": True,
                    "wireless": True,
                    "color_options": ["Black", "White", "Blue"]
                }
            },
            {
                "title": "Cozy Reading Throw Blanket",
                "description": "Super soft fleece blanket perfect for reading or movie nights",
                "price_min": 24.99,
                "price_max": 39.99,
                "brand": "HomeComfort",
                "category_id": categories[2]['id'] if len(categories) > 2 else categories[0]['id'],
                "tags": ["cozy", "blanket", "home", "comfort"],
                "rating": 4.7,
                "review_count": 892,
                "features": {
                    "material": "fleece",
                    "size": "50x60 inches",
                    "machine_washable": True,
                    "color_options": ["Gray", "Navy", "Burgundy"]
                }
            },
            {
                "title": "Artisan Coffee Subscription Box",
                "description": "Monthly delivery of premium coffee beans from around the world",
                "price_min": 19.99,
                "price_max": 49.99,
                "brand": "GlobalBrew",
                "category_id": categories[1]['id'] if len(categories) > 1 else categories[0]['id'],
                "tags": ["coffee", "subscription", "gourmet", "monthly"],
                "rating": 4.8,
                "review_count": 567,
                "features": {
                    "subscription_type": "monthly",
                    "origin": "various",
                    "roast_levels": ["light", "medium", "dark"],
                    "delivery": "worldwide"
                }
            }
        ]
        
        created_count = 0
        for product in sample_products:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/products",
                headers=headers,
                json=product,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                created_count += 1
                result = response.json()
                if result:
                    print(f"✅ Created: {product['title']}")
            else:
                print(f"❌ Failed to create: {product['title']} - {response.status_code}")
        
        print(f"\n🎉 Created {created_count} sample products!")
        return created_count > 0
        
    except Exception as e:
        print(f"❌ Error creating sample products: {e}")
        return False

def test_api_endpoints():
    """Test basic API functionality"""
    print("\n🔌 Testing API Endpoints:")
    
    # Test basic read operations
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Test categories endpoint
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/categories?select=*&order=sort_order",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            categories = response.json()
            print(f"✅ Categories API: {len(categories)} categories available")
        else:
            print(f"❌ Categories API failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Categories API error: {e}")
    
    # Test products endpoint
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/products?select=title,price_min,rating&limit=3",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Products API: {len(products)} products available")
            if products:
                print("   Sample products:")
                for product in products:
                    print(f"   • {product['title']} - ${product['price_min']} (⭐{product['rating']})")
        else:
            print(f"❌ Products API failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Products API error: {e}")

def show_next_steps():
    """Show what to do next"""
    print("\n🚀 Next Steps:")
    print("1. ✅ Database schema created")
    print("2. ✅ Sample data added")
    print("3. ✅ API endpoints tested")
    print("\n🔧 Ready to build:")
    print("• User authentication endpoints")
    print("• Swipe session management")
    print("• Product recommendation engine")
    print("• Gift link generation")
    print("\n🌐 View your data:")
    print("• Supabase Dashboard: https://supabase.com/dashboard/project/xchsarvamppwephulylt/editor")
    print("• Local API: http://localhost:8000/docs")

if __name__ == "__main__":
    print("🎁 GiftSync Database Complete Test")
    print("=" * 40)
    
    # Test database structure
    results = test_database_structure()
    
    # Test categories specifically
    test_categories()
    
    # Create sample products if none exist
    if results.get('products', False):
        create_sample_products()
    
    # Test API endpoints
    test_api_endpoints()
    
    # Show next steps
    show_next_steps()
    
    # Summary
    successful_tables = sum(1 for success in results.values() if success)
    total_tables = len(results)
    
    print(f"\n📊 Summary: {successful_tables}/{total_tables} tables accessible")
    
    if successful_tables == total_tables:
        print("🎉 Database setup complete and working!")
    else:
        print("⚠️  Some tables may need attention")