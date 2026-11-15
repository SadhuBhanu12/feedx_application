const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserStreak() {
  console.log('--- 1. Get a student record ---');
  const { data: students, error: sErr } = await supabase.from('students').select('id, roll_number, email').limit(5);
  console.log('students:', students, sErr);

  if (students && students.length > 0) {
    const student = students[0];
    console.log('Testing for student:', student.id);

    console.log('--- 2. Direct query daily_streaks ---');
    const { data: streak, error: streakErr } = await supabase
      .from('daily_streaks')
      .select('*')
      .eq('student_id', student.id)
      .maybeSingle();
    console.log('daily_streaks result:', streak, streakErr);

    console.log('--- 3. RPC award_student_activity test ---');
    const { data: rpcData, error: rpcErr } = await supabase.rpc('award_student_activity', {
      p_student_id: student.id,
      p_activity_type: 'daily_login',
      p_coin_reward: 0,
      p_xp_reward: 10,
      p_reference_id: 'test_' + Date.now()
    });
    console.log('award_student_activity result:', rpcData, rpcErr);

    console.log('--- 4. RPC get_student_gamification_state test (if exists) ---');
    const { data: gData, error: gErr } = await supabase.rpc('get_student_gamification_state', {
      p_student_id: student.id
    });
    console.log('get_student_gamification_state result:', gData, gErr);
  }
}

testUserStreak();
