const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log('=== CHECKING ALL STUDENTS ===');
  const { data: students, error: sErr } = await supabase
    .from('students')
    .select('id, roll_number, pin_number, feedx_id, full_name, email, is_password_set');
  if (sErr) console.error('sErr:', sErr);
  else console.table(students);

  console.log('=== CHECKING ALL USERS ===');
  const { data: users, error: uErr } = await supabase
    .from('users')
    .select('id, email, full_name, role, is_password_set, first_login_completed');
  if (uErr) console.error('uErr:', uErr);
  else console.table(users);

  console.log('=== CHECKING ACTIVATION SESSIONS ===');
  const { data: sessions, error: aErr } = await supabase
    .from('activation_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (aErr) console.error('aErr:', aErr);
  else console.table(sessions);

  console.log('=== CHECKING ACTIVATION LOGS ===');
  const { data: logs, error: lErr } = await supabase
    .from('activation_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (lErr) console.error('lErr:', lErr);
  else console.table(logs);
}

inspect();
