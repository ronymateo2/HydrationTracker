-- Drop existing RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can only access their own profiles" ON user_profiles;

-- Create new RLS policy with proper type casting for user_profiles
CREATE POLICY "Users can only access their own profiles"
ON user_profiles
FOR ALL
USING (user_id::text = auth.uid()::text);

-- Drop existing RLS policies for beverage_logs
DROP POLICY IF EXISTS "Users can only access their own logs" ON beverage_logs;

-- Create new RLS policy with proper type casting for beverage_logs
CREATE POLICY "Users can only access their own logs"
ON beverage_logs
FOR ALL
USING (user_id::text = auth.uid()::text);
