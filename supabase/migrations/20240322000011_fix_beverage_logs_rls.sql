-- Enable RLS on beverage_logs table
ALTER TABLE beverage_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own logs
DROP POLICY IF EXISTS "Users can insert their own logs" ON beverage_logs;
CREATE POLICY "Users can insert their own logs"
ON beverage_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to select their own logs
DROP POLICY IF EXISTS "Users can view their own logs" ON beverage_logs;
CREATE POLICY "Users can view their own logs"
ON beverage_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to update their own logs
DROP POLICY IF EXISTS "Users can update their own logs" ON beverage_logs;
CREATE POLICY "Users can update their own logs"
ON beverage_logs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own logs
DROP POLICY IF EXISTS "Users can delete their own logs" ON beverage_logs;
CREATE POLICY "Users can delete their own logs"
ON beverage_logs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Make sure the table is in the realtime publication
alter publication supabase_realtime add table beverage_logs;