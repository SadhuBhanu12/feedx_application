const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColleges() {
  const { data: colleges } = await supabase.from('colleges').select('id, name, code').limit(5);
  console.log('Colleges:', colleges);
  const { data: branches } = await supabase.from('branches').select('id, name, code').limit(5);
  console.log('Branches:', branches);
  const { data: years } = await supabase.from('academic_years').select('id, year_name, year_number').limit(5);
  console.log('Academic Years:', years);
}

checkColleges();
