const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: lessons, error: err1 } = await supabase.from('quick_learn_lessons').select('id, title').limit(5);
  console.log("Quick Learn Lessons:", err1 ? err1.message : lessons);

  const { data: quizzes, error: err2 } = await supabase.from('explore_quizzes').select('id, title').limit(5);
  console.log("Explore Quizzes:", err2 ? err2.message : quizzes);
}

main();
