-- Safe helper function to inspect instance_id of existing users
CREATE OR REPLACE FUNCTION public.get_sample_instance_id()
RETURNS TABLE (sample_instance_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT instance_id FROM auth.users LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
