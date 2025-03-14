-- First drop all policies that reference the user_id column
DROP POLICY IF EXISTS "Users can view their own beverage logs" ON beverage_logs;
DROP POLICY IF EXISTS "Users can insert their own beverage logs" ON beverage_logs;
DROP POLICY IF EXISTS "Users can update their own beverage logs" ON beverage_logs;
DROP POLICY IF EXISTS "Users can delete their own beverage logs" ON beverage_logs;

-- Now alter the column type
ALTER TABLE beverage_logs ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Recreate the policies with the proper UUID comparison
CREATE POLICY "Users can view their own beverage logs"
ON beverage_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own beverage logs"
ON beverage_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own beverage logs"
ON beverage_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own beverage logs"
ON beverage_logs FOR DELETE
USING (auth.uid() = user_id);
