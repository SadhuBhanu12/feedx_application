const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function tryLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    console.log(`Failed for ${email} with ${password}: ${error.message}`);
    return false;
  } else {
    console.log(`Success! Logged in as ${email}`);
    // Let's query event_registrations!
    const { data: regs, error: regError } = await supabase.from('event_registrations').select('*');
    if (regError) {
      console.error("Error reading registrations:", regError);
    } else {
      console.log("Registrations:", regs);
    }
    return true;
  }
}

async function run() {
  await tryLogin('testcompat_1783839320897@feedx.app', 'TestPassword123!');
  await tryLogin('testcompat_1783839320897@feedx.app', 'NewPassword987!');
}
run();
