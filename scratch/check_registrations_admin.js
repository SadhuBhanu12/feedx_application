const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const candidates = [
    'feedx_admin@feedx.app',
    'admin_global@feedx.app',
    'admin@feedx.app'
  ];
  const superAdminPassword = 'FeedX@123';

  for (const email of candidates) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: superAdminPassword
    });
    if (error) {
      console.log(`Failed for ${email}: ${error.message}`);
    } else {
      console.log(`Success! Logged in as ${email}`);
      const { data: regs, error: regError } = await supabase.from('event_registrations').select('*, students(full_name, roll_number), events(title)');
      if (regError) {
        console.error("Error reading registrations:", regError);
      } else {
        console.log("Registrations count:", regs.length);
        regs.forEach(r => {
          console.log(`ID: ${r.id}, Student: ${r.students?.full_name}, Event: ${r.events?.title}, QR Token: ${r.qr_token}`);
        });
      }
      return;
    }
  }
}

run();
