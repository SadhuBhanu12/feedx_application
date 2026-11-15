const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRealUserActivities() {
  const { data: users } = await supabase.from('users').select('id, full_name, email, role').limit(5);
  console.log('users:', users);

  if (users && users.length > 0) {
    for (const u of users) {
      console.log(`\n--- Checking user ${u.full_name} (${u.id}) ---`);
      const { data: coins } = await supabase.from('coin_transactions').select('*').or(`student_id.eq.${u.id},user_id.eq.${u.id}`);
      console.log('coin_transactions:', coins?.length || 0);

      const { data: tasks } = await supabase.from('daily_task_completions').select('*').or(`student_id.eq.${u.id},user_id.eq.${u.id}`);
      console.log('daily_task_completions:', tasks?.length || 0, tasks);

      const { data: quizzes } = await supabase.from('daily_quiz_attempts').select('*').or(`student_id.eq.${u.id},user_id.eq.${u.id}`);
      console.log('daily_quiz_attempts:', quizzes?.length || 0, quizzes);

      const { data: rewards } = await supabase.from('reward_transactions').select('*').or(`student_id.eq.${u.id},user_id.eq.${u.id}`);
      console.log('reward_transactions:', rewards?.length || 0, rewards);

      const { data: lessons } = await supabase.from('student_lesson_progress').select('*').eq('user_id', u.id);
      console.log('student_lesson_progress:', lessons?.length || 0, lessons);
    }
  }
}

checkRealUserActivities();
