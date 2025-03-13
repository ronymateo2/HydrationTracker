-- Convert user_id columns to UUID type to match auth.users.id

-- First, modify the users table to ensure id is UUID
ALTER TABLE IF EXISTS users
  ALTER COLUMN id TYPE UUID USING id::UUID;

-- Then modify the beverage_logs table
ALTER TABLE IF EXISTS beverage_logs
  ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Finally modify the user_profiles table
ALTER TABLE IF EXISTS user_profiles
  ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Update the NextAuth signIn callback to use UUID format
COMMENT ON TABLE users IS 'User profiles linked to auth.users with UUID primary keys';
