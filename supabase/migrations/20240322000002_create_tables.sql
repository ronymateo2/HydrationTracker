-- Create beverage_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.beverage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  beverage_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  weight INTEGER,
  activity_level TEXT,
  daily_goal INTEGER NOT NULL DEFAULT 2500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable realtime for both tables
alter publication supabase_realtime add table beverage_logs;
alter publication supabase_realtime add table user_profiles;