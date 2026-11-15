const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log('=== 1. Check users table columns ===');
  const { data: uData, error: uErr } = await supabase.from('users').select('*').limit(1);
  if (uErr) console.log('users error:', uErr.message);
  else console.log('users columns:', Object.keys(uData[0] || {}));

  console.log('=== 2. Check students table columns ===');
  const { data: sData, error: sErr } = await supabase.from('students').select('*').limit(1);
  if (sErr) console.log('students error:', sErr.message);
  else console.log('students columns:', Object.keys(sData[0] || {}));

  console.log('=== 3. Check profiles table columns ===');
  const { data: pData, error: pErr } = await supabase.from('profiles').select('*').limit(1);
  if (pErr) console.log('profiles error:', pErr.message);
  else console.log('profiles columns:', Object.keys(pData[0] || {}));

  console.log('=== 4. Check daily_streaks error ===');
  const { data: dData, error: dErr } = await supabase.from('daily_streaks').select('*').limit(1);
  console.log('daily_streaks err:', dErr, 'data:', dData);

  console.log('=== 5. Check coin_transactions ===');
  const { data: cData, error: cErr } = await supabase.from('coin_transactions').select('*').limit(3);
  console.log('coin_transactions err:', cErr, 'count:', cData?.length);

  console.log('=== 6. Check student_wallets ===');
  const { data: wData, error: wErr } = await supabase.from('student_wallets').select('*').limit(1);
  console.log('student_wallets err:', wErr, 'columns:', Object.keys(wData?.[0] || {}));
}

inspect();
