const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAllTablesCols() {
  const tables = {
    coin_transactions: ['id', 'student_id', 'user_id', 'amount', 'activity_type', 'reference_id', 'description', 'created_at'],
    daily_task_completions: ['id', 'student_id', 'user_id', 'task_type', 'task_date', 'coins_earned', 'status', 'completed_at', 'created_at'],
    daily_quiz_attempts: ['id', 'quiz_id', 'student_id', 'user_id', 'started_at', 'completed_at', 'score', 'status', 'coins_awarded', 'created_at', 'updated_at'],
    reward_transactions: ['id', 'student_id', 'user_id', 'source_type', 'source_id', 'points', 'coins', 'created_at'],
  };

  for (const [table, cols] of Object.entries(tables)) {
    console.log(`=== Checking ${table} ===`);
    for (const col of cols) {
      const { error } = await supabase.from(table).select(col).limit(1);
      console.log(`  ${col}: ${error ? 'ERROR: ' + error.message : 'OK'}`);
    }
  }
}

testAllTablesCols();
