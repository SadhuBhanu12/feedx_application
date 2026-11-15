const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSubmitQuiz() {
  const { data: attempts } = await supabase.from('daily_quiz_attempts').select('id, user_id, status').limit(2);
  console.log("Attempts:", attempts);
  if (attempts && attempts.length > 0) {
    const res = await supabase.rpc('submit_daily_quiz_attempt', { p_attempt_id: attempts[0].id });
    console.log("submit_daily_quiz_attempt result:", res);
  }
}

testSubmitQuiz();
