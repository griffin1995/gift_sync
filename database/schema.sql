-- GiftSync Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/xchsarvamppwephulylt/sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
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

-- Categories table
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

-- Products table
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

-- Swipe sessions table
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

-- Swipe interactions table
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

-- Recommendations table
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

-- Gift links table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price_min, price_max);
CREATE INDEX IF NOT EXISTS idx_swipe_interactions_session ON swipe_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_swipe_interactions_user ON swipe_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_score ON recommendations(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_gift_links_token ON gift_links(link_token);

-- Insert sample categories
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

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_links ENABLE ROW LEVEL SECURITY;

-- User can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Users can only access their own swipe sessions
CREATE POLICY "Users can view own swipe sessions" ON swipe_sessions FOR ALL USING (auth.uid() = user_id);

-- Users can only access their own swipe interactions
CREATE POLICY "Users can view own swipe interactions" ON swipe_interactions FOR ALL USING (auth.uid() = user_id);

-- Users can only access their own recommendations
CREATE POLICY "Users can view own recommendations" ON recommendations FOR SELECT USING (auth.uid() = user_id);

-- Users can only access their own gift links
CREATE POLICY "Users can view own gift links" ON gift_links FOR ALL USING (auth.uid() = user_id);

-- Public read access for categories and products
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();