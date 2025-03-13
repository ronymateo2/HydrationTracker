-- Now that the users table exists, we can modify its columns
ALTER TABLE public.users
ALTER COLUMN id TYPE UUID USING id::UUID;

-- Update foreign key references in other tables
ALTER TABLE public.beverage_logs
ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

ALTER TABLE public.user_profiles
ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
