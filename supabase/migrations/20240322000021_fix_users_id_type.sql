-- First, drop the foreign key constraint if it exists
ALTER TABLE IF EXISTS public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

-- Convert users.id to UUID type
ALTER TABLE public.users ALTER COLUMN id TYPE uuid USING id::uuid;

-- Now add the foreign key constraint back
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update the RLS policy to use UUID comparison
DROP POLICY IF EXISTS "Users can only view their own profiles" ON public.user_profiles;
CREATE POLICY "Users can only view their own profiles"
  ON public.user_profiles FOR ALL
  USING (auth.uid()::uuid = user_id);

-- Enable realtime for user_profiles
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
