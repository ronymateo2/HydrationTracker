-- First drop the foreign key constraint if it exists
ALTER TABLE IF EXISTS public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

-- Change user_id column in user_profiles to text type to match users.id
ALTER TABLE public.user_profiles ALTER COLUMN user_id TYPE text;

-- Now recreate the foreign key constraint
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id);

-- Update RLS policy for user_profiles
DROP POLICY IF EXISTS "Users can only access their own profiles" ON public.user_profiles;
CREATE POLICY "Users can only access their own profiles"
  ON public.user_profiles
  FOR ALL
  USING (auth.uid()::text = user_id);

-- Enable realtime for user_profiles
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
