-- Create tables for the hydration tracker app

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  age INTEGER,
  gender TEXT,
  weight NUMERIC,
  activity_level TEXT,
  daily_goal INTEGER NOT NULL DEFAULT 2500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beverage logs table
CREATE TABLE IF NOT EXISTS public.beverage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  beverage_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_beverage_logs_user_id ON public.beverage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_beverage_logs_created_at ON public.beverage_logs(created_at);

-- Set up Row Level Security (RLS)
-- Enable RLS on tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beverage_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for beverage_logs
CREATE POLICY "Users can view their own beverage logs"
  ON public.beverage_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own beverage logs"
  ON public.beverage_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
