const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealUser() {
  const uid = 'ebebc008-eb36-4eb1-ba4b-ce66d9b8badc';
  const res = await supabase.rpc('award_student_activity', {
    p_student_id: uid,
    p_activity_type: 'home_daily_quick_learn',
    p_coin_reward: 0,
    p_xp_reward: 50,
    p_reference_id: `test_real_${Date.now()}`
  });
  console.log("Real user result:", res);
}

testRealUser();
