const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('--- Testing Database Communication ---');

  // 1. Test users table query
  const { data: uData, error: uErr } = await supabase.from('users').select('id, full_name, email, role, phone, branch, year, domain, bio').limit(3);
  console.log('Users query success:', !uErr, 'Rows count:', uData?.length);
  if (uErr) console.error('Users error:', uErr);

  // 2. Test students table query
  const { data: sData, error: sErr } = await supabase.from('students').select('id, full_name, email, roll_number').limit(3);
  console.log('Students query success:', !sErr, 'Rows count:', sData?.length);
  if (sErr) console.error('Students error:', sErr);

  // 3. Test daily_streaks query
  const { data: strData, error: strErr } = await supabase.from('daily_streaks').select('*').limit(3);
  console.log('Daily streaks query success:', !strErr, 'Rows count:', strData?.length);
  if (strErr) console.error('Streaks error:', strErr);

  console.log('--- Database communication verified! ---');
}

testDatabase();
