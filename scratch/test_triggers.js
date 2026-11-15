const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTriggers() {
  const uid = 'ebebc008-eb36-4eb1-ba4b-ce66d9b8badc';
  
  console.log("1. Testing daily_streaks update:");
  const dRes = await supabase.from('daily_streaks').update({ updated_at: new Date().toISOString() }).eq('student_id', uid);
  console.log("daily_streaks:", dRes.error);

  console.log("2. Testing student_wallets update:");
  const wRes = await supabase.from('student_wallets').update({ updated_at: new Date().toISOString() }).eq('student_id', uid);
  console.log("student_wallets:", wRes.error);

  console.log("3. Testing coin_transactions insert:");
  const cRes = await supabase.from('coin_transactions').insert({
    student_id: uid,
    amount: 1,
    activity_type: 'test_trigger',
    reference_id: `trigger_test_${Date.now()}`,
    description: 'Trigger test'
  });
  console.log("coin_transactions:", cRes.error);

  console.log("4. Testing reward_transactions insert:");
  const rRes = await supabase.from('reward_transactions').insert({
    user_id: uid,
    student_id: uid,
    source_type: 'test_trigger',
    source_id: `r_test_${Date.now()}`,
    coins: 0,
    points: 1
  });
  console.log("reward_transactions:", rRes.error);
}

testTriggers();
