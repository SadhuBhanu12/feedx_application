const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Logging in...");
  const { data: { session }, error: loginErr } = await supabase.auth.signInWithPassword({
    email: 'bhanu12@gmail.com', // or a known superadmin email, let's try a login we know works or bypass
    password: 'Password123!' // I'll assume we don't know the password...
  });
  
  if (loginErr) {
    console.log("Login err:", loginErr.message);
    return;
  }
  
  console.log("Logged in. Inserting event...");
  const { data, error } = await supabase.from('events').insert({
    title: 'Test Event ' + Date.now(),
    date: '2026-10-15',
    event_date: '2026-10-15',
    location: 'Offline',
    venue: 'Main Auditorium',
    created_by_role: 'super_admin',
    registration_required: true,
    attendance_required: true,
    certificate_available: false,
    price: 0,
    status: 'Published'
  }).select();
  
  console.log("Insert Err:", error);
  console.log("Insert Data:", data);
}

run();
