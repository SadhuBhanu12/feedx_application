-- Temporary helper function to read auth.users schema details safely
CREATE OR REPLACE FUNCTION public.inspect_auth_columns()
RETURNS TABLE (col_name TEXT, col_type TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT column_name::TEXT, data_type::TEXT
  FROM information_schema.columns
  WHERE table_schema = 'auth' AND table_name = 'users';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
