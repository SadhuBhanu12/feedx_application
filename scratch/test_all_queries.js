const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAll() {
  const studentId = '148ec926-3068-45bc-85dd-fd998e3f6862';

  console.log('1. coin_transactions query');
  const r1 = await supabase.from('coin_transactions').select('*').or(`student_id.eq.${studentId},user_id.eq.${studentId}`);
  console.log('coin_transactions with .or:', r1.error ? r1.error.message : 'OK (' + r1.data.length + ')');

  const r1b = await supabase.from('coin_transactions').select('*').eq('student_id', studentId);
  console.log('coin_transactions with .eq(student_id):', r1b.error ? r1b.error.message : 'OK (' + r1b.data.length + ')');

  console.log('2. student_quiz_attempts query');
  const r2 = await supabase.from('student_quiz_attempts').select('created_at, completed_at').or(`student_id.eq.${studentId},user_id.eq.${studentId}`);
  console.log('student_quiz_attempts with .or:', r2.error ? r2.error.message : 'OK (' + r2.data.length + ')');

  const r2b = await supabase.from('student_quiz_attempts').select('created_at, completed_at').eq('student_id', studentId);
  console.log('student_quiz_attempts with .eq(student_id):', r2b.error ? r2b.error.message : 'OK (' + (r2b.data ? r2b.data.length : 'null') + ')');

  console.log('3. student_lesson_progress query');
  const r3 = await supabase.from('student_lesson_progress').select('completed_at, updated_at').or(`user_id.eq.${studentId}`);
  console.log('student_lesson_progress with user_id:', r3.error ? r3.error.message : 'OK (' + (r3.data ? r3.data.length : 'null') + ')');

  console.log('4. daily_streaks query with student_id');
  const r4 = await supabase.from('daily_streaks').select('*').eq('student_id', studentId);
  console.log('daily_streaks with student_id:', r4.error ? r4.error.message : 'OK');
}

testAll();
