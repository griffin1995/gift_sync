#!/usr/bin/env python3
"""
Set up GiftSync database schema in Supabase
"""
import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

def execute_sql(sql_query, description=""):
    """Execute SQL query in Supabase"""
    headers = {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
            headers=headers,
            json={"query": sql_query},
            timeout=30
        )
        
        if response.status_code in [200, 201]:
            print(f"✅ {description}")
            return True
        else:
            print(f"❌ Failed {description}: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection failed for {description}: {e}")
        return False

def create_database_schema():
    """Create the complete GiftSync database schema"""
    
    print("🗄️  Creating GiftSync Database Schema")
    print("=" * 40)
    
    # Enable necessary extensions
    extensions_sql = """
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    """
    execute_sql(extensions_sql, "Enabled PostgreSQL extensions")
    
    # Users table
    users_sql = """
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE,
        full_name VARCHAR(255),
        avatar_url TEXT,
        date_of_birth DATE,
        gender VARCHAR(20),
        location_country VARCHAR(100),
        location_city VARCHAR(100),
        subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
        preferences JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login_at TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        gdpr_consent BOOLEAN DEFAULT false,
        gdpr_consent_date TIMESTAMP WITH TIME ZONE
    );
    """
    execute_sql(users_sql, "Created users table")
    
    # Categories table
    categories_sql = """
    CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        icon_url TEXT,
        parent_id UUID REFERENCES categories(id),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    execute_sql(categories_sql, "Created categories table")
    
    # Products table
    products_sql = """
    CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price_min DECIMAL(10,2),
        price_max DECIMAL(10,2),
        currency VARCHAR(3) DEFAULT 'USD',
        brand VARCHAR(100),
        image_url TEXT,
        affiliate_url TEXT,
        affiliate_network VARCHAR(50),
        commission_rate DECIMAL(5,4),
        category_id UUID REFERENCES categories(id),
        tags TEXT[],
        features JSONB DEFAULT '{}',
        rating DECIMAL(3,2),
        review_count INTEGER DEFAULT 0,
        availability_status VARCHAR(20) DEFAULT 'available',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
    );
    """
    execute_sql(products_sql, "Created products table")
    
    # Swipe sessions table
    swipe_sessions_sql = """
    CREATE TABLE IF NOT EXISTS swipe_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        session_type VARCHAR(50) DEFAULT 'discovery',
        occasion VARCHAR(100),
        budget_min DECIMAL(10,2),
        budget_max DECIMAL(10,2),
        recipient_age_range VARCHAR(20),
        recipient_gender VARCHAR(20),
        recipient_relationship VARCHAR(50),
        started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE,
        total_swipes INTEGER DEFAULT 0,
        preferences_data JSONB DEFAULT '{}',
        is_completed BOOLEAN DEFAULT false
    );
    """
    execute_sql(swipe_sessions_sql, "Created swipe_sessions table")
    
    # Swipe interactions table
    swipe_interactions_sql = """
    CREATE TABLE IF NOT EXISTS swipe_interactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        session_id UUID REFERENCES swipe_sessions(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        category_id UUID REFERENCES categories(id),
        swipe_direction VARCHAR(10) NOT NULL CHECK (swipe_direction IN ('left', 'right', 'up', 'down')),
        swipe_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        time_spent_seconds INTEGER,
        interaction_context JSONB DEFAULT '{}',
        preference_strength DECIMAL(3,2) DEFAULT 0.5
    );
    """
    execute_sql(swipe_interactions_sql, "Created swipe_interactions table")
    
    # Recommendations table
    recommendations_sql = """
    CREATE TABLE IF NOT EXISTS recommendations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        session_id UUID REFERENCES swipe_sessions(id),
        confidence_score DECIMAL(5,4) NOT NULL,
        algorithm_version VARCHAR(20),
        reasoning TEXT,
        rank_position INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE,
        is_clicked BOOLEAN DEFAULT false,
        clicked_at TIMESTAMP WITH TIME ZONE,
        is_purchased BOOLEAN DEFAULT false,
        purchased_at TIMESTAMP WITH TIME ZONE
    );
    """
    execute_sql(recommendations_sql, "Created recommendations table")
    
    # Gift links table
    gift_links_sql = """
    CREATE TABLE IF NOT EXISTS gift_links (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        session_id UUID REFERENCES swipe_sessions(id),
        link_token VARCHAR(100) UNIQUE NOT NULL,
        qr_code_url TEXT,
        title VARCHAR(255),
        message TEXT,
        recipient_name VARCHAR(255),
        occasion VARCHAR(100),
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true,
        view_count INTEGER DEFAULT 0,
        share_count INTEGER DEFAULT 0
    );
    """
    execute_sql(gift_links_sql, "Created gift_links table")
    
    # Create indexes for better performance
    indexes_sql = """
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price_min, price_max);
    CREATE INDEX IF NOT EXISTS idx_swipe_interactions_session ON swipe_interactions(session_id);
    CREATE INDEX IF NOT EXISTS idx_swipe_interactions_user ON swipe_interactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id);
    CREATE INDEX IF NOT EXISTS idx_recommendations_score ON recommendations(confidence_score DESC);
    CREATE INDEX IF NOT EXISTS idx_gift_links_token ON gift_links(link_token);
    """
    execute_sql(indexes_sql, "Created database indexes")
    
    # Insert sample categories
    sample_categories_sql = """
    INSERT INTO categories (name, slug, description, sort_order) VALUES
    ('Electronics', 'electronics', 'Gadgets, devices, and tech accessories', 1),
    ('Fashion', 'fashion', 'Clothing, shoes, and accessories', 2),
    ('Home & Garden', 'home-garden', 'Home decor, furniture, and garden items', 3),
    ('Books & Media', 'books-media', 'Books, movies, music, and games', 4),
    ('Health & Beauty', 'health-beauty', 'Skincare, makeup, and wellness products', 5),
    ('Sports & Outdoors', 'sports-outdoors', 'Fitness equipment and outdoor gear', 6),
    ('Food & Drink', 'food-drink', 'Gourmet foods, beverages, and kitchen items', 7),
    ('Toys & Games', 'toys-games', 'Toys, board games, and educational items', 8),
    ('Art & Crafts', 'art-crafts', 'Art supplies, handmade items, and DIY kits', 9),
    ('Experience Gifts', 'experiences', 'Classes, events, and memorable experiences', 10)
    ON CONFLICT (slug) DO NOTHING;
    """
    execute_sql(sample_categories_sql, "Inserted sample categories")
    
    print("\n🎉 Database schema created successfully!")
    print("📊 Tables created: users, categories, products, swipe_sessions, swipe_interactions, recommendations, gift_links")
    print("🔗 Ready for: https://supabase.com/dashboard/project/xchsarvamppwephulylt/editor")

def test_database_connection():
    """Test if we can read from the database"""
    headers = {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Test reading categories
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/categories?select=name,slug&limit=5",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            categories = response.json()
            print(f"\n✅ Database test successful! Found {len(categories)} categories:")
            for cat in categories:
                print(f"   • {cat['name']} ({cat['slug']})")
            return True
        else:
            print(f"❌ Database test failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Database test error: {e}")
        return False

if __name__ == "__main__":
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("❌ Missing Supabase credentials in .env file")
        exit(1)
    
    # Create the schema
    create_database_schema()
    
    # Test the connection
    test_database_connection()
    
    print("\n🚀 Next steps:")
    print("1. View your data: https://supabase.com/dashboard/project/xchsarvamppwephulylt/editor")
    print("2. Set up Row Level Security policies")
    print("3. Add sample products")
    print("4. Test the complete application flow")