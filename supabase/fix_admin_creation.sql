CREATE OR REPLACE FUNCTION public.create_new_user_by_admin(
  p_email TEXT, 
  p_password TEXT, 
  p_full_name TEXT, 
  p_role TEXT
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_requester_role TEXT;
  v_instance_id UUID;
BEGIN
  -- Get requester's role
  SELECT role INTO v_requester_role FROM public.users WHERE id = auth.uid();
  
  -- Check if requester is super_admin
  IF v_requester_role IS NULL OR v_requester_role != 'super_admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only super admins can create new administrative users.';
  END IF;

  -- Get dynamic instance_id to match GoTrue configuration
  SELECT instance_id INTO v_instance_id FROM auth.users WHERE instance_id IS NOT NULL LIMIT 1;
  IF v_instance_id IS NULL THEN
    v_instance_id := '00000000-0000-0000-0000-000000000000'::uuid;
  END IF;

  v_user_id := uuid_generate_v4();

  -- Insert into auth.users with lowercased email, dynamic instance_id, confirmed_at, and standard salt
  INSERT INTO auth.users (
    id,
    instance_id,
    email, 
    encrypted_password, 
    email_confirmed_at,
    raw_app_meta_data, 
    raw_user_meta_data, 
    aud, 
    role,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    v_instance_id,
    LOWER(TRIM(p_email)), 
    crypt(p_password, gen_salt('bf')), 
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('full_name', p_full_name, 'role', p_role), 
    'authenticated', 
    'authenticated',
    now(),
    now()
  );

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
