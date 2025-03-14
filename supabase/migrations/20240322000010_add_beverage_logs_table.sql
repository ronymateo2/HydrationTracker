-- Check if beverage_logs table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'beverage_logs') THEN
    -- Create beverage_logs table
    CREATE TABLE public.beverage_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      beverage_type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
    );

    -- Add table to realtime publication
    ALTER PUBLICATION supabase_realtime ADD TABLE public.beverage_logs;

    -- Create policies for beverage_logs
    DROP POLICY IF EXISTS "Users can view their own logs" ON public.beverage_logs;
    CREATE POLICY "Users can view their own logs"
      ON public.beverage_logs FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can insert their own logs" ON public.beverage_logs;
    CREATE POLICY "Users can insert their own logs"
      ON public.beverage_logs FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can update their own logs" ON public.beverage_logs;
    CREATE POLICY "Users can update their own logs"
      ON public.beverage_logs FOR UPDATE
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can delete their own logs" ON public.beverage_logs;
    CREATE POLICY "Users can delete their own logs"
      ON public.beverage_logs FOR DELETE
      USING (auth.uid() = user_id);

    -- Enable RLS on beverage_logs
    ALTER TABLE public.beverage_logs ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;