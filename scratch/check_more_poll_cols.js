const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testMoreCols() {
  const testCols = [
    'college_id', 'user_id', 'author_id', 'student_id', 'admin_id',
    'title', 'category', 'is_closed', 'is_active', 'updated_at',
    'pinned', 'allow_comments', 'visibility', 'target_audience', 'audience_type'
  ];

  for (const c of testCols) {
    const { error } = await supabase.from('polls').select(c).limit(1);
    const exists = error?.message.includes('permission denied');
    console.log(`polls.${c}:`, exists ? 'EXISTS' : `NO (${error?.message})`);
  }
}

testMoreCols();
