-- First drop the existing policies that depend on the user_id column
DROP POLICY IF EXISTS "Users can view their own beverage logs" ON beverage_logs;
DROP POLICY IF EXISTS "Users can insert their own beverage logs" ON beverage_logs;

-- Now we can safely alter the column type
ALTER TABLE beverage_logs ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Recreate the policies with the proper UUID comparison
CREATE POLICY "Users can view their own beverage logs"
ON beverage_logs FOR SELECT
USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can insert their own beverage logs"
ON beverage_logs FOR INSERT
WITH CHECK (user_id = auth.uid()::uuid);

-- Make sure RLS is enabled
ALTER TABLE beverage_logs ENABLE ROW LEVEL SECURITY;
