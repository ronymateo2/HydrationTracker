-- Fix the RLS policy for beverage_logs table by properly handling UUID type
DROP POLICY IF EXISTS "Users can only access their own beverage logs" ON beverage_logs;

CREATE POLICY "Users can only access their own beverage logs"
ON beverage_logs
FOR ALL
USING (user_id::text = auth.uid()::text);

alter publication supabase_realtime add table beverage_logs;
