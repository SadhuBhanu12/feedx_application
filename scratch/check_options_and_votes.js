const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testOptionsAndVotes() {
  console.log('--- Checking poll_options columns ---');
  const optCols = ['id', 'poll_id', 'option_text', 'text', 'display_order', 'order', 'votes_count', 'created_at'];
  for (const c of optCols) {
    const { error } = await supabase.from('poll_options').select(c).limit(1);
    const exists = error?.message.includes('permission denied');
    console.log(`poll_options.${c}:`, exists ? 'EXISTS' : `NO (${error?.message})`);
  }

  console.log('--- Checking poll_votes columns ---');
  const voteCols = ['id', 'poll_id', 'option_id', 'student_id', 'user_id', 'option_index', 'created_at'];
  for (const c of voteCols) {
    const { error } = await supabase.from('poll_votes').select(c).limit(1);
    const exists = error?.message.includes('permission denied');
    console.log(`poll_votes.${c}:`, exists ? 'EXISTS' : `NO (${error?.message})`);
  }
}

testOptionsAndVotes();
