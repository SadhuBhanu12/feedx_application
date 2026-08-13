const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('verify_event_qr_token', {
    p_qr_token: '00000000-0000-0000-0000-000000000000',
    p_verified_by: '00000000-0000-0000-0000-000000000000',
    p_device: 'Test',
    p_location: 'Test'
  });
  if (error) {
    console.error("verify_event_qr_token error:", error);
  } else {
    console.log("verify_event_qr_token success:", data);
  }
}
check();
