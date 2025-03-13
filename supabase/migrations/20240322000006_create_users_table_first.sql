-- Create users table first
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for users table
DROP POLICY IF EXISTS "Public access" ON public.users;
CREATE POLICY "Public access"
ON public.users FOR SELECT
USING (true);

-- Enable realtime
alter publication supabase_realtime add table users;
