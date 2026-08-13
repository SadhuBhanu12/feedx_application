import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const {
      data: { user },
    } = await userClient.auth.getUser(token);
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const { data: actor } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (actor?.role !== 'admin') return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

    const body = await req.json();
    const rollNo = String(body.roll_no || '').trim();
    const dob = String(body.date_of_birth || '').trim();
    const pinNumber = String(body.pin_number || body.pin || rollNo).trim();
    if (!rollNo || !dob || !pinNumber) {
      return new Response(JSON.stringify({ error: 'Missing roll_no, pin_number or date_of_birth' }), { status: 400 });
    }

    const email = String(body.email || `${rollNo}@feedx.app`).trim();
    const password = dob;

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created.user) {
      return new Response(JSON.stringify({ error: createError?.message || 'Failed to create auth user' }), { status: 400 });
    }

    const userId = created.user.id;

    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        full_name: body.name || rollNo,
        email,
        role: body.role || 'student',
        phone: body.phone || null,
        pin_number: pinNumber,
        date_of_birth: dob,
        is_password_set: false,
        first_login_completed: false,
      }, { onConflict: 'id' });
    if (userError) return new Response(JSON.stringify({ error: userError.message }), { status: 400 });

    const { error: profileError } = await supabase
      .from('student_profiles')
      .upsert({
        user_id: userId,
        roll_no: rollNo,
        college: body.college || null,
        branch: body.branch || null,
        year: body.year ?? null,
        section: body.section || null,
        date_of_birth: dob,
        pin_number: pinNumber,
        gender: body.gender || null,
        address: body.address || null,
        interests: body.interests || [],
        skills: body.skills || [],
        cgpa: body.cgpa ?? null,
        bio: body.bio || null,
        force_password_change: true,
      }, { onConflict: 'user_id' });
    if (profileError) return new Response(JSON.stringify({ error: profileError.message }), { status: 400 });

    return new Response(JSON.stringify({ user_id: userId, email }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});