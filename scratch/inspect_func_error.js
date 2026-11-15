const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectFunc() {
  const { data, error } = await supabase.rpc('award_student_activity', {
    p_student_id: '00000000-0000-0000-0000-000000000000',
    p_activity_type: 'unknown',
    p_coin_reward: 0,
    p_xp_reward: 0,
    p_reference_id: 'test'
  });
  console.log("Error details:", error);
}

inspectFunc();
