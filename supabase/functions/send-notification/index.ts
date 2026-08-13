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

    const { user_id, title, message, type = 'system' } = await req.json();
    const { error } = await supabase.from('notifications').insert({ user_id, title, message, type });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
