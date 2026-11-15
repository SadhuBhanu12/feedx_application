const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPermissions() {
  // Check if any RPCs exist for streak
  const { data: d1, error: e1 } = await supabase.rpc('award_student_activity', {
    p_student_id: 'a5c5dca6-b041-4f1d-b65a-cc55af188d79',
    p_activity_type: 'test',
    p_coins: 0,
    p_xp: 0,
    p_activity_date: '2026-10-10'
  });
  console.log('award_student_activity RPC:', d1, e1);

  // Check RPC for submit_daily_quiz_attempt or others
  const { data: d2, error: e2 } = await supabase.rpc('get_auth_user_id_by_email', { p_email: 'bhanu000@gmail.com' });
  console.log('get_auth_user_id_by_email RPC:', d2, e2);
}

testPermissions();
