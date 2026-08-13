const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Let's check a student record
  const { data: students, error: studentError } = await supabase.from('students').select('*').limit(1);
  if (studentError) {
    console.error("students query error:", studentError);
  } else {
    console.log("student columns:", students.length > 0 ? Object.keys(students[0]) : "No students");
    console.log("student sample:", students[0]);
  }
}
check();
