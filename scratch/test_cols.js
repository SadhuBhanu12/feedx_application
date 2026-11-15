const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCols() {
  const cols = ['id', 'user_id', 'student_id', 'lesson_id', 'completed_at', 'created_at', 'status', 'score'];
  for (const c of cols) {
    const { error } = await supabase.from('student_lesson_progress').select(c).limit(1);
    console.log(`student_lesson_progress.${c}:`, error ? error.message : 'EXISTS');
  }
}

testCols();
