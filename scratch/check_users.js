const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('=== USERS ===');
  const { data: users, error: uErr } = await supabase.from('users').select('id, email, full_name, role, is_active');
  if (uErr) console.log('uErr:', uErr);
  else console.log('users count:', users.length, users);

  console.log('=== STUDENTS ===');
  const { data: students, error: sErr } = await supabase.from('students').select('id, roll_number, full_name, email');
  if (sErr) console.log('sErr:', sErr);
  else console.log('students count:', students.length, students);

  console.log('=== DAILY STREAKS ===');
  const { data: streaks, error: dErr } = await supabase.from('daily_streaks').select('*');
  if (dErr) console.log('dErr:', dErr);
  else console.log('streaks count:', streaks.length, streaks);
}

check();
