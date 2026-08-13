import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GENERIC_ERROR = 'Invalid PIN Number or Date of Birth.';
const LOCK_MINUTES = 15;
const MAX_ATTEMPTS = 5;
const SESSION_MINUTES = 15;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function normalizeDob(input: string) {
  const trimmed = String(input || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const slash = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slash) return `${slash[3]}-${slash[2]}-${slash[1]}`;
  const dash = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dash) return `${dash[3]}-${dash[2]}-${dash[1]}`;
  return null;
}

function sanitizePin(pin: string) {
  return String(pin || '').trim().replace(/\s+/g, '');
}

function attemptKey(pin: string, ip: string) {
  return `${ip}:${pin.slice(0, 4)}`;
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const pin = sanitizePin(body.pin_number);
    const dob = normalizeDob(body.date_of_birth);
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (!pin || !dob) {
      return json({ error: GENERIC_ERROR }, 400);
    }

    const key = attemptKey(pin, ip);
    const now = new Date();

    const { data: attemptRow } = await supabase
      .from('activation_attempts')
      .select('*')
      .eq('attempt_key', key)
      .maybeSingle();

    if (attemptRow?.locked_until && new Date(attemptRow.locked_until) > now) {
      return json({ error: 'Too many failed attempts. Please try again in 15 minutes.', locked: true }, 429);
    }

    const { data: userMatch } = await supabase
      .from('users')
      .select('id, email, full_name, role, is_password_set, first_login_completed, pin_number, date_of_birth')
      .eq('pin_number', pin)
      .eq('date_of_birth', dob)
      .eq('role', 'student')
      .maybeSingle();

    let user = userMatch;

    if (!user) {
      const { data: studentMatch } = await supabase
        .from('students')
        .select('id, email, full_name, pin_number, date_of_birth, is_password_set')
        .eq('pin_number', pin)
        .eq('date_of_birth', dob)
        .maybeSingle();

      if (studentMatch) {
        const { data: linkedUser } = await supabase
          .from('users')
          .select('id, email, full_name, role, is_password_set, first_login_completed, pin_number, date_of_birth')
          .eq('id', studentMatch.id)
          .maybeSingle();
        user = linkedUser || {
          id: studentMatch.id,
          email: studentMatch.email,
          full_name: studentMatch.full_name,
          role: 'student',
          is_password_set: studentMatch.is_password_set ?? false,
          first_login_completed: false,
        };
      }
    }

    if (!user) {
      const failed = (attemptRow?.failed_count || 0) + 1;
      const lockedUntil =
        failed >= MAX_ATTEMPTS ? new Date(now.getTime() + LOCK_MINUTES * 60 * 1000).toISOString() : null;

      await supabase.from('activation_attempts').upsert(
        {
          attempt_key: key,
          failed_count: failed,
          locked_until: lockedUntil,
          last_attempt_at: now.toISOString(),
        },
        { onConflict: 'attempt_key' }
      );

      await supabase.from('activation_logs').insert({
        attempt_key: key,
        event_type: 'verify_failed',
        ip_address: ip,
      });

      if (lockedUntil) {
        return json({ error: 'Too many failed attempts. Please try again in 15 minutes.', locked: true }, 429);
      }

      return json({ error: GENERIC_ERROR }, 401);
    }

    await supabase.from('activation_attempts').upsert(
      { attempt_key: key, failed_count: 0, locked_until: null, last_attempt_at: now.toISOString() },
      { onConflict: 'attempt_key' }
    );

    if (user.is_password_set || user.first_login_completed) {
      return json({ already_activated: true, message: 'Account already activated. Please use Login.' }, 409);
    }

    const token = randomToken();
    const expiresAt = new Date(now.getTime() + SESSION_MINUTES * 60 * 1000).toISOString();

    await supabase.from('activation_sessions').insert({
      user_id: user.id,
      token,
      expires_at: expiresAt,
      used: false,
    });

    await supabase.from('activation_logs').insert({
      attempt_key: key,
      user_id: user.id,
      event_type: 'verify_success',
      ip_address: ip,
    });

    return json({
      activation_token: token,
      expires_at: expiresAt,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (e) {
    return json({ error: 'Unable to verify identity. Please try again.' }, 500);
  }
});
