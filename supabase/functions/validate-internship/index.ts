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
    if (!body.title || !body.company || !body.deadline) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const { data, error } = await supabase.from('internships').insert(body).select().single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
