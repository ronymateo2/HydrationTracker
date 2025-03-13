-- Create a function to execute arbitrary SQL
-- This is used by the pgmigrate edge function
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE sql_query;
  result := '{"success": true}'::JSONB;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  result := jsonb_build_object('error', SQLERRM, 'detail', SQLSTATE);
  RETURN result;
END;
$$;
