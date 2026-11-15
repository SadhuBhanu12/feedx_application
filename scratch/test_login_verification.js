const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('=== 1. TESTING ADMIN LOGIN (ramu@gmail.com) ===');
  const resAdmin = await supabase.auth.signInWithPassword({
    email: 'ramu@gmail.com',
    password: 'Admin@FeedX2026'
  });
  if (resAdmin.error) {
    console.log('Admin Login Error:', resAdmin.error.message);
  } else {
    console.log('✅ Admin Login SUCCESS! User ID:', resAdmin.data.user.id);
  }

  console.log('\n=== 2. TESTING STUDENT EMAIL RESOLUTION ===');
  const identifiers = ['GPW-0005', 'GECCC-0020', 'FX-26-IA-0004661', 'bhanuprasad092627@gmail.com'];
  for (const id of identifiers) {
    const { data: rpcRes, error: rpcErr } = await supabase.rpc('get_student_email_for_login', {
      p_roll_number: id
    });
    console.log(`Identifier [${id}] -> Resolved Email:`, rpcRes || '(null)', rpcErr ? `Error: ${rpcErr.message}` : '');
  }

  console.log('\n=== 3. TESTING BHANU AUTH STATUS ===');
  const resBhanu = await supabase.auth.signInWithPassword({
    email: 'bhanuprasad092627@gmail.com',
    password: 'DummyPasswordToCheckSchema'
  });
  if (resBhanu.error) {
    console.log('Bhanu Auth Message:', resBhanu.error.message);
    if (resBhanu.error.message.includes('Invalid login credentials')) {
      console.log('✅ SCHEMA IS HEALTHY! (GoTrue successfully verified schema and rejected wrong dummy password as expected)');
    } else if (resBhanu.error.message.includes('Database error querying schema')) {
      console.log('❌ Schema still has NULL or missing identities');
    }
  }
}

test();
