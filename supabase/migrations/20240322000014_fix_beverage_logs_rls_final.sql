-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow users to insert their own beverage logs" ON beverage_logs;
DROP POLICY IF EXISTS "Allow users to select their own beverage logs" ON beverage_logs;

-- Enable RLS on the table
ALTER TABLE beverage_logs ENABLE ROW LEVEL SECURITY;

-- Create policies with proper type handling
CREATE POLICY "Allow users to insert their own beverage logs"
ON beverage_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Allow users to select their own beverage logs"
ON beverage_logs
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

-- Note: We're not adding to supabase_realtime since it's already a member