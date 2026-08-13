const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://ktontqbfcinzqvalxyqd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8"
);

async function checkColleges() {
  const userId = 'ebebc008-eb36-4eb1-ba4b-ce66d9b8badc'; // Bhanu Prasad

  console.log("1. Checking user profile columns...");
  const { data: userProfile } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
  console.log("User Profile found:", userProfile);

  console.log("\n2. Checking student profile...");
  const { data: student } = await supabase.from('students').select('*, colleges(*)').eq('id', userId).maybeSingle();
  console.log("Student Profile found:", student);

  console.log("\n3. Listing colleges from DB...");
  const { data: colleges } = await supabase.from('colleges').select('id, college_name, location');
  console.log("Colleges list count:", colleges ? colleges.length : 0);
  if (colleges && colleges.length > 0) {
    console.log("Sample College 1:", colleges[0]);
    if (colleges.length > 1) console.log("Sample College 2:", colleges[1]);
  }
}

checkColleges();
