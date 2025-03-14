-- Fix the user_profiles table foreign key reference to users table
-- Ensure the user_id column is UUID type and properly references users.id

-- First, drop any existing foreign key constraint
ALTER TABLE IF EXISTS user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

-- Ensure user_id is UUID type
ALTER TABLE IF EXISTS user_profiles ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Add the foreign key constraint back
ALTER TABLE IF EXISTS user_profiles ADD CONSTRAINT user_profiles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update the RLS policy to use UUID comparison
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid()::UUID = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid()::UUID = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid()::UUID = user_id);
