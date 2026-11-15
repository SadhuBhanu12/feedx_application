const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLessonColumns() {
  const { data, error } = await supabase.from('student_lesson_progress').select('*').limit(1);
  console.log('lesson data error:', error, 'data:', data);

  const { data: ct, error: ce } = await supabase.from('coin_transactions').select('*').limit(1);
  console.log('coin_transactions error:', ce, 'data:', ct);

  const { data: rt, error: re } = await supabase.from('reward_transactions').select('*').limit(1);
  console.log('reward_transactions error:', re, 'data:', rt);
}

checkLessonColumns();
