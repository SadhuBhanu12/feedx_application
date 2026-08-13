const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('event_registrations').select('*').limit(1);
  if (error) {
    console.error("Error reading event_registrations:", error);
  } else {
    console.log("Columns:", data.length > 0 ? Object.keys(data[0]) : "No data to check keys, but request succeeded!");
    // Let's try selecting registration_number explicitly to see if it fails
    const { data: regNumData, error: regNumError } = await supabase.from('event_registrations').select('registration_number').limit(1);
    if (regNumError) {
      console.error("Explicit select registration_number failed:", regNumError);
    } else {
      console.log("Explicit select registration_number succeeded!");
    }
  }
}
check();
