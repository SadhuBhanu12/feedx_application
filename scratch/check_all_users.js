const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: users, error } = await supabase.from('users').select('*');
  if (error) {
    console.error("users query error:", error);
  } else {
    console.log("Users count:", users.length);
    users.forEach(u => {
      console.log(`Email: ${u.email}, Role: ${u.role}, ID: ${u.id}, Is Password Set: ${u.is_password_set}`);
    });
  }
}
check();
