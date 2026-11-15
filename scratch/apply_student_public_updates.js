const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdates() {
  const userId = '0b2c4b51-189e-46ce-8565-8da7a00cba4f';
  
  // 1. Update public.users
  const { data: uData, error: uErr } = await supabase.from('users').update({
    full_name: 'Sadhu Bhanu Prasad',
    role: 'student',
    branch: 'Computer Science / IT',
    year: '1st Year',
    feedx_id: 'FEEDX-TG-26-BHANU12',
    is_password_set: true,
    first_login_completed: true,
    is_active: true
  }).eq('id', userId).select();
  console.log('Update public.users:', uData, uErr);

  // 2. Update public.students
  const { data: sData, error: sErr } = await supabase.from('students').update({
    full_name: 'Sadhu Bhanu Prasad',
    year: '1st Year',
    feedx_id: 'FEEDX-TG-26-BHANU12',
    qr_code_data: JSON.stringify({ v: 1, fid: 'FEEDX-TG-26-BHANU12', qid: 'QUIZUE-61026361', type: 'FEEDX_STUDENT_VERIFICATION' }),
    identity_status: 'verified'
  }).eq('id', userId).select();
  console.log('Update public.students:', sData, sErr);

  // 3. Upsert public.daily_streaks
  const { data: strkData, error: strkErr } = await supabase.from('daily_streaks').upsert({
    student_id: userId,
    current_streak: 1,
    longest_streak: 1,
    total_active_days: 1,
    last_active_date: new Date().toISOString().split('T')[0],
    streak_freeze_count: 1,
    xp_points: 50,
    updated_at: new Date().toISOString()
  }).select();
  console.log('Upsert public.daily_streaks:', strkData, strkErr);

  // 4. Upsert public.student_wallets
  const { data: wData, error: wErr } = await supabase.from('student_wallets').upsert({
    student_id: userId,
    gold_coins: 50,
    tokens: 50,
    total_earned: 50,
    total_redeemed: 0,
    updated_at: new Date().toISOString()
  }).select();
  console.log('Upsert public.student_wallets:', wData, wErr);
}

testUpdates();
