const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  const email = 'sadhubhanuprasad12@gmail.com';
  const passwordsToTest = ['FeedX@123', 'feedx@123', '123456', 'password', 'Bhanu@123'];
  for (const pw of passwordsToTest) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (!error && data?.user) {
      console.log(`SUCCESS! Password is "${pw}", user ID: ${data.user.id}`);
      return;
    } else {
      console.log(`Failed for "${pw}": ${error?.message}`);
    }
  }
}

testAuth();
