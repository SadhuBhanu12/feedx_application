const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStreaks() {
  console.log('--- Checking daily_streaks ---');
  const { data: dData, error: dErr } = await supabase.from('daily_streaks').select('*').limit(5);
  console.log('daily_streaks:', dErr ? dErr.message : dData);

  console.log('--- Checking users streak columns ---');
  const { data: uData, error: uErr } = await supabase.from('users').select('id, full_name, streak_count, max_streak, xp_points, gold_coins, last_active_at').limit(3);
  console.log('users:', uErr ? uErr.message : uData);

  console.log('--- Checking students streak columns ---');
  const { data: sData, error: sErr } = await supabase.from('students').select('id, full_name, streak_count, max_streak, xp_points, gold_coins').limit(3);
  console.log('students:', sErr ? sErr.message : sData);
}

checkStreaks();
