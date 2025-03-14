-- Fix the UUID to text comparison issue in RLS policies

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can only view their own profiles" ON user_profiles;

-- Create a new policy with proper type casting
CREATE POLICY "Users can only view their own profiles"
ON user_profiles
FOR ALL
USING (user_id::text = auth.uid()::text);

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can only view their own logs" ON beverage_logs;

-- Create a new policy with proper type casting
CREATE POLICY "Users can only view their own logs"
ON beverage_logs
FOR ALL
USING (user_id::text = auth.uid()::text);

-- Ensure realtime is enabled for user_profiles
alter publication supabase_realtime add table user_profiles;
