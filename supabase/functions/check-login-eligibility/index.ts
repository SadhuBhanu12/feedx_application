import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function toEmail(identifier: string) {
  const trimmed = String(identifier || '').trim();
  return trimmed.includes('@') ? trimmed : `${trimmed}@feedx.app`;
}

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { identifier } = await req.json();
    if (!identifier) {
      return json({ error: 'Identifier required' }, 400);
    }

    const email = toEmail(identifier);

    const { data: userByEmail } = await supabase
      .from('users')
      .select('id, email, is_password_set, first_login_completed, role')
      .eq('email', email)
      .maybeSingle();

    let user = userByEmail;

    if (!user) {
      const roll = String(identifier).trim();
      const { data: student } = await supabase
        .from('students')
        .select('id, email, is_password_set')
        .eq('roll_number', roll)
        .maybeSingle();

      if (student) {
        const { data: linked } = await supabase
          .from('users')
          .select('id, email, is_password_set, first_login_completed, role')
          .eq('id', student.id)
          .maybeSingle();
        user = linked || {
          id: student.id,
          email: student.email,
          is_password_set: student.is_password_set ?? false,
          first_login_completed: false,
          role: 'student',
        };
      }
    }

    if (!user) {
      return json({ found: false, needs_activation: false, forgot_password_allowed: false });
    }

    const needsActivation = user.role === 'student' && !(user.is_password_set || user.first_login_completed);

    return json({
      found: true,
      needs_activation: needsActivation,
      forgot_password_allowed: !needsActivation,
      email,
    });
  } catch (e) {
    return json({ error: 'Unable to check account status.' }, 500);
  }
});
