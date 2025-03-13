-- Convert user_id columns to accept text instead of UUID

-- First modify the beverage_logs table
ALTER TABLE beverage_logs
ALTER COLUMN user_id TYPE TEXT;

-- Then modify the user_profiles table
ALTER TABLE user_profiles
ALTER COLUMN user_id TYPE TEXT;

-- Enable realtime for both tables
alter publication supabase_realtime add table beverage_logs;
alter publication supabase_realtime add table user_profiles;