-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own beverage logs" ON beverage_logs;
DROP POLICY IF EXISTS "Users can view their own beverage logs" ON beverage_logs;

-- Enable RLS on the table
ALTER TABLE beverage_logs ENABLE ROW LEVEL SECURITY;

-- Create policies with proper type handling
CREATE POLICY "Users can insert their own beverage logs"
ON beverage_logs
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own beverage logs"
ON beverage_logs
FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Make sure the table is in the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE beverage_logs;
