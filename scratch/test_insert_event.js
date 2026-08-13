const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Inserting event...");
  const { data, error } = await supabase.from('events').insert({
    title: 'Test Event',
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
  console.log("Error:", error);
  console.log("Data:", data);
}
test();
