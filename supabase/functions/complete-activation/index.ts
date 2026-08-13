import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function formatErrorResponse(err: any, customMessage?: string) {
  const customPrefix = customMessage ? `${customMessage}: ` : '';
  const errorObj = {
    success: false,
    error: customPrefix + (err?.message || String(err)),
    details: err?.details || null,
    hint: err?.hint || null,
    code: err?.code || null,
    stack: err?.stack || null,
  };
  console.error('[complete-activation] Error formatted for client:', JSON.stringify(errorObj));
  return json(errorObj, 200);
}

function validatePasswordStrength(password: string) {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must include a number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include a special character.';
  return null;
}

async function getAuthUserIdByEmail(supabase: any, email: string): Promise<string | null> {
  // Try the RPC function first
  try {
    const { data, error } = await supabase.rpc('get_auth_user_id_by_email', {
      p_email: email.trim().toLowerCase(),
    });
    if (!error && data) {
      console.log('[complete-activation] Found auth user by email RPC:', String(data));
      return String(data);
    }
    if (error) {
      console.warn('[complete-activation] get_auth_user_id_by_email RPC error:', error.message);
    }
  } catch (rpcErr: any) {
    console.warn('[complete-activation] RPC call failed:', rpcErr?.message);
  }

  // Fallback: try listing users by email via admin API
  try {
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 5,
    });
    if (!listError && listData?.users) {
      const match = listData.users.find(
        (u: any) => u.email?.toLowerCase() === email.trim().toLowerCase()
      );
      if (match) {
        console.log('[complete-activation] Found auth user by listUsers fallback:', match.id);
        return String(match.id);
      }
    }
  } catch (_) {
    // Fallback failed silently
  }

  return null;
}

async function reconcileStudentToAuthId(
  supabase: any,
  profileId: string,
  authId: string,
): Promise<string | null> {
  if (!profileId || !authId || profileId === authId) return null;

  console.log(`[complete-activation] Reconciling profile ${profileId} -> auth ${authId}`);

  const { error } = await supabase.rpc('reconcile_student_to_auth_id', {
    p_profile_id: profileId,
    p_auth_id: authId,
  });

  if (error) {
    console.error('[complete-activation] reconcile_student_to_auth_id RPC error:', error.message);
    return error.message;
  }

  return null;
}

async function setAuthPassword(supabase: any, authUserId: string, password: string) {
  console.log(`[complete-activation] Setting password directly in DB via RPC for auth user: ${authUserId}`);
  
  const { error } = await supabase.rpc('set_auth_password_direct', {
    p_user_id: authUserId,
    p_password: password,
  });

  if (error) {
    console.error('[complete-activation] set_auth_password_direct RPC error:', error.message);
    return error; // Return the full error object
  }
  console.log('[complete-activation] ✅ Password set directly in DB successfully');
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? '';

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[complete-activation] Missing SUPABASE_URL or SERVICE_ROLE_KEY');
    return json({ success: false, error: 'Server configuration error.' }, 200);
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { activation_token, password, confirm_password } = await req.json();

    console.log('[complete-activation] Received request with token prefix:', activation_token?.substring(0, 8));

    if (!activation_token || !password || !confirm_password) {
      return json({ success: false, error: 'Missing required fields.' }, 200);
    }
    if (password !== confirm_password) {
      return json({ success: false, error: 'Passwords do not match.' }, 200);
    }
    const strengthError = validatePasswordStrength(password);
    if (strengthError) {
      return json({ success: false, error: strengthError }, 200);
    }

    // Step 1: Look up the activation session
    console.log('[complete-activation] Step 1: Looking up activation session...');
    const { data: session, error: sessionError } = await supabase
      .from('activation_sessions')
      .select('*')
      .eq('token', activation_token)
      .eq('used', false)
      .maybeSingle();

    if (sessionError) {
      return formatErrorResponse(sessionError, 'Database error while verifying session');
    }
    if (!session) {
      console.warn('[complete-activation] No valid session found for token');
      return json({ success: false, error: 'Session expired or already used. Please verify again.' }, 200);
    }

    console.log('[complete-activation] Session found. user_id:', session.user_id, 'expires_at:', session.expires_at);

    if (new Date(session.expires_at) < new Date()) {
      await supabase.from('activation_sessions').update({ used: true }).eq('id', session.id);
      return json({ success: false, error: 'Session expired. Please verify again.' }, 200);
    }

    let profileUserId = String(session.user_id);
    const now = new Date().toISOString();

    // Step 2: Resolve user email and details from public tables
    console.log('[complete-activation] Step 2: Resolving user profile for ID:', profileUserId);

    const { data: userRow } = await supabase
      .from('users')
      .select('id, email, full_name, role, pin_number, date_of_birth')
      .eq('id', profileUserId)
      .maybeSingle();

    let email = userRow?.email?.trim() || '';
    let fullName = userRow?.full_name?.trim() || '';
    let pinNumber = userRow?.pin_number || null;
    let dateOfBirth = userRow?.date_of_birth || null;
    let rollNumber = '';
    const userRole = userRow?.role || 'student';

    // Also check students table (may have different ID or additional info)
    const { data: studentRow } = await supabase
      .from('students')
      .select('id, email, full_name, roll_number, pin_number, date_of_birth')
      .eq('id', profileUserId)
      .maybeSingle();

    // If no user row found by ID, try finding student by email from the users row
    let studentByEmail = null;
    if (!studentRow && email) {
      const { data: sByEmail } = await supabase
        .from('students')
        .select('id, email, full_name, roll_number, pin_number, date_of_birth')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      studentByEmail = sByEmail;
    }

    const resolvedStudent = studentRow || studentByEmail;

    if (!email) email = resolvedStudent?.email?.trim() || '';
    if (!fullName) fullName = resolvedStudent?.full_name?.trim() || '';
    if (!pinNumber) pinNumber = resolvedStudent?.pin_number || null;
    if (!dateOfBirth) dateOfBirth = resolvedStudent?.date_of_birth || null;
    rollNumber = resolvedStudent?.roll_number?.trim() || '';

    console.log('[complete-activation] Resolved email:', email, '| name:', fullName, '| roll:', rollNumber, '| role:', userRole);

    if (!email) {
      console.error('[complete-activation] No email found for user ID:', profileUserId);
      return json({ success: false, error: 'No email on record for this account. Please contact your administrator.' }, 200);
    }

    // Step 3: Resolve or create the auth.users entry
    console.log('[complete-activation] Step 3: Resolving auth user...');

    // 3a. Check if auth user exists by the profile ID
    let authUserId: string | null = null;
    const { data: existingByIdRes } = await supabase.auth.admin.getUserById(profileUserId);
    const existingByProfileId = existingByIdRes?.user;

    if (existingByProfileId?.id) {
      authUserId = String(existingByProfileId.id);
      console.log('[complete-activation] Found auth user by profile ID:', authUserId);
    }

    // 3b. If not found by ID, check by email
    if (!authUserId) {
      authUserId = await getAuthUserIdByEmail(supabase, email);
      if (authUserId) {
        console.log('[complete-activation] Found auth user by email lookup:', authUserId);
      }
    }

    // 3c. If still no auth user exists, create one
    if (!authUserId) {
      console.log('[complete-activation] No auth user found. Creating new auth user...');

      const authEmail = email;

      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        id: profileUserId,
        email: authEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName || email,
          roll_number: rollNumber || 'PENDING',
          role: userRole,
          pin_number: pinNumber,
          date_of_birth: dateOfBirth,
          must_change_password: false,
          is_password_set: true,
          first_login_completed: true,
        },
      });

      if (createErr) {
        console.error('[complete-activation] Create user error:', JSON.stringify(createErr));

        // If creation failed because user already exists by email, try to find them
        const retryAuthId = await getAuthUserIdByEmail(supabase, email);
        if (retryAuthId) {
          console.log('[complete-activation] Found existing auth user on retry:', retryAuthId);
          authUserId = retryAuthId;
          // Fall through to set password below
        } else {
          return formatErrorResponse(createErr, 'Auth user creation failed');
        }
      } else {
        authUserId = String(created.user?.id || profileUserId);
        console.log('[complete-activation] ✅ New auth user created:', authUserId);
        await finalizeActivation(supabase, authUserId, profileUserId, now, session.id, email);
        return json({ success: true, message: 'Your password has been created successfully.' });
      }
    }

    if (!authUserId) {
      console.error('[complete-activation] Could not resolve auth account');
      return json({ success: false, error: 'Could not resolve auth account for this email. Please contact support.' }, 200);
    }

    // Step 4: Reconcile profile IDs if mismatched
    if (authUserId !== profileUserId) {
      console.log(`[complete-activation] Step 4: Reconciling IDs. profile=${profileUserId} -> auth=${authUserId}`);
      const reconcileError = await reconcileStudentToAuthId(supabase, profileUserId, authUserId);
      if (reconcileError) {
        console.error('[complete-activation] Reconciliation failed:', reconcileError);
      }
    }

    // Step 5: Set the password on the auth user
    console.log('[complete-activation] Step 5: Setting password...');
    const passwordError = await setAuthPassword(supabase, authUserId, password);
    if (passwordError) {
      return formatErrorResponse(passwordError, 'Password update failed');
    }

    // Step 6: Finalize activation
    console.log('[complete-activation] Step 6: Finalizing activation...');
    await finalizeActivation(supabase, authUserId, profileUserId, now, session.id, email);
    console.log('[complete-activation] ✅ Activation complete!');
    return json({ success: true, message: 'Your password has been created successfully.' });
  } catch (e: any) {
    return formatErrorResponse(e, 'Server exception occurred');
  }
});

async function finalizeActivation(
  supabase: any,
  authUserId: string,
  profileUserId: string,
  now: string,
  sessionId: string,
  email: string,
) {
  // Update users table (try both auth ID and profile ID)
  const updatePayload = {
    is_password_set: true,
    first_login_completed: true,
    password_changed_at: now,
    updated_at: now,
  };

  await supabase.from('users').update(updatePayload).eq('id', authUserId);
  if (authUserId !== profileUserId) {
    await supabase.from('users').update(updatePayload).eq('id', profileUserId);
  }

  // Update students table (try both IDs and by email)
  await supabase.from('students').update({ is_password_set: true }).eq('id', authUserId);
  if (authUserId !== profileUserId) {
    await supabase.from('students').update({ is_password_set: true }).eq('id', profileUserId);
  }
  if (email) {
    await supabase.from('students').update({ is_password_set: true }).eq('email', email.toLowerCase());
  }

  // Update student_profiles if they exist
  await supabase
    .from('student_profiles')
    .update({ is_password_set: true, first_login_completed: true, force_password_change: false })
    .eq('user_id', authUserId);

  // Mark session as used
  await supabase.from('activation_sessions').update({ used: true }).eq('id', sessionId);

  // Log the activation
  await supabase.from('activation_logs').insert({
    user_id: authUserId,
    event_type: 'activation_complete',
  });

  console.log('[finalizeActivation] All records updated for user:', authUserId);
}
