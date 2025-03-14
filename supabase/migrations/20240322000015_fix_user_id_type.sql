-- Drop existing policies first
DROP POLICY IF EXISTS "Allow users to insert their own beverage logs" ON beverage_logs;
DROP POLICY IF EXISTS "Allow users to select their own beverage logs" ON beverage_logs;

-- Alter the user_id column to be UUID type
ALTER TABLE beverage_logs ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Enable RLS
ALTER TABLE beverage_logs ENABLE ROW LEVEL SECURITY;

-- Create policies with proper UUID comparison
CREATE POLICY "Allow users to insert their own beverage logs" ON beverage_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to select their own beverage logs" ON beverage_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
