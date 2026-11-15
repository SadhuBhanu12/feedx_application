const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectPolls() {
  console.log('--- Inspecting polls table ---');
  const candidateCols = [
    'id', 'post_id', 'question', 'options', 'total_votes', 'created_by', 
    'expires_at', 'ends_at', 'starts_at', 'status', 'allow_multiple', 
    'anonymous_voting', 'show_results_before_vote', 'allow_vote_change', 'created_at'
  ];

  for (const c of candidateCols) {
    const { error } = await supabase.from('polls').select(c).limit(1);
    console.log(`polls.${c}:`, error ? `NO (${error.message})` : 'EXISTS');
  }

  console.log('--- Checking poll_options table ---');
  const { data: optData, error: optErr } = await supabase.from('poll_options').select('*').limit(1);
  console.log('poll_options:', optErr ? `ERROR: ${optErr.message}` : 'EXISTS');

  console.log('--- Checking sample poll data ---');
  const { data: pollData, error: pollErr } = await supabase.from('polls').select('*').limit(3);
  console.log('polls sample:', pollErr ? pollErr.message : JSON.stringify(pollData, null, 2));
}

inspectPolls();
