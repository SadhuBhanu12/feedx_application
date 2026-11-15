const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const userId = '0b2c4b51-189e-46ce-8565-8da7a00cba4f';
  const email = 'sadhubhanuprasad12@gmail.com';

  console.log('--- Inspecting public.users ---');
  const { data: userRow, error: uErr } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
  console.log('users:', userRow, 'error:', uErr);

  console.log('--- Inspecting public.students ---');
  const { data: studentRow, error: sErr } = await supabase.from('students').select('*').eq('id', userId).maybeSingle();
  console.log('students by ID:', studentRow, 'error:', sErr);

  const { data: studentByEmail, error: sEmailErr } = await supabase.from('students').select('*').eq('email', email).maybeSingle();
  console.log('students by Email:', studentByEmail, 'error:', sEmailErr);

  console.log('--- Inspecting public.daily_streaks ---');
  const { data: streakRow, error: strkErr } = await supabase.from('daily_streaks').select('*').eq('student_id', userId).maybeSingle();
  console.log('daily_streaks:', streakRow, 'error:', strkErr);

  console.log('--- Inspecting public.student_wallets ---');
  const { data: walletRow, error: wErr } = await supabase.from('student_wallets').select('*').eq('student_id', userId).maybeSingle();
  console.log('student_wallets:', walletRow, 'error:', wErr);
}

inspect();
