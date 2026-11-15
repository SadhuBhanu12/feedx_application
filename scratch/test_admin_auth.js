const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  console.log('Testing login with ramu@gmail.com (College Admin)...');
  const resAdmin = await supabase.auth.signInWithPassword({
    email: 'ramu@gmail.com',
    password: 'Admin@FeedX2026'
  });
  console.log('Admin login result:', resAdmin.error ? resAdmin.error.message : 'SUCCESS! user: ' + resAdmin.data.user.id);
}

testAuth();
