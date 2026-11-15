const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetchAdminPolls() {
  const { data, error } = await supabase
    .from('polls')
    .select('*, community_posts(title, caption), poll_options(id, option_text), poll_votes(id, option_id)')
    .order('created_at', { ascending: false });

  console.log('Result:', error ? error : `Found ${data?.length} polls`);
}

testFetchAdminPolls();
