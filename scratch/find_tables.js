const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function findTables() {
  const possibleTables = [
    'daily_streaks',
    'student_wallets',
    'coin_transactions',
    'reward_transactions',
    'daily_task_completions',
    'daily_challenge_attempts',
    'daily_quiz_attempts',
    'daily_quiz_answers',
    'quiz_attempts',
    'student_lesson_progress',
    'student_roadmaps',
    'roadmap_progress',
    'users',
    'students',
    'daily_challenges'
  ];

  for (const t of possibleTables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table [${t}]: ERROR ->`, error.message);
    } else {
      console.log(`Table [${t}]: OK -> columns:`, Object.keys(data[0] || {}));
    }
  }
}

findTables();
