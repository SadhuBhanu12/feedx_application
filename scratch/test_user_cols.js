const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserUpdate() {
  const { data: user } = await supabase.from('users').select('id, full_name, bio').limit(1).single();
  console.log('Sample user:', user);

  // Test update with only valid columns
  const validUpdates = {
    full_name: user.full_name,
    bio: user.bio || 'Test Bio'
  };
  const { data: res1, error: err1 } = await supabase.from('users').update(validUpdates).eq('id', user.id).select();
  console.log('Update with valid columns err:', err1, 'success:', !!res1);

  // Test update with domain, gender, current_status
  const invalidUpdates = {
    domain: 'AI',
    gender: 'Male',
    current_status: 'Student'
  };
  const { data: res2, error: err2 } = await supabase.from('users').update(invalidUpdates).eq('id', user.id).select();
  console.log('Update with domain/gender err:', err2?.message);
}

testUserUpdate();
