-- Drop existing policies that might use text comparison with UUID
DROP POLICY IF EXISTS "Users can only view their own profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can only view their own logs" ON public.beverage_logs;

-- Recreate policies with proper UUID casting
CREATE POLICY "Users can only view their own profiles"
  ON public.user_profiles FOR ALL
  USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can only view their own logs"
  ON public.beverage_logs FOR ALL
  USING (auth.uid()::uuid = user_id);
