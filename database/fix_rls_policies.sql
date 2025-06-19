-- Temporarily disable RLS for development or fix policies for service role access

-- Option 1: Disable RLS temporarily (for development)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Option 2: Add policies for service role access (better approach)
-- DROP the existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policies that allow service role access
CREATE POLICY "Service role can access all users" ON users FOR ALL TO service_role USING (true);
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Allow anon role to insert users (for registration)
CREATE POLICY "Allow anon registration" ON users FOR INSERT TO anon WITH CHECK (true);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;