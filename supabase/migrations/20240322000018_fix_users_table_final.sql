-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON users;

-- Make sure the users table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own data
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy for users to update their own data
CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Add the table to the publication for realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
