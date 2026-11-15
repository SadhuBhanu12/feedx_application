const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";
const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateFirstTimeLogin(email) {
  const mail = email.trim().toLowerCase();
  console.log(`\n========================================`);
  console.log(`[TEST] Simulating First-Time Login for: ${mail}`);

  // 1. Fetch user profile from users table
  const { data: userProfile, error: profileErr } = await supabase
    .from('users')
    .select('*')
    .ilike('email', mail)
    .maybeSingle();

  if (profileErr) throw profileErr;

  // 2. Fetch student profile from students table
  let { data: studentData, error: dbError } = await supabase
    .from('students')
    .select('*')
    .ilike('email', mail)
    .maybeSingle();

  if (dbError) throw dbError;

  let student = studentData;
  if (!student && userProfile) {
    student = {
      id: userProfile.id,
      roll_number: userProfile.pin_number || userProfile.roll_no || userProfile.admin_code || mail.split('@')[0].toUpperCase(),
      full_name: userProfile.full_name || 'User',
      email: userProfile.email || mail,
      is_password_set: userProfile.is_password_set === true,
    };
  }

  if (!student) {
    return { status: 'NOT_FOUND', message: 'Email not found in registry' };
  }

  const isPasswordAlreadySet = Boolean(student?.is_password_set === true || userProfile?.is_password_set === true);

  if (isPasswordAlreadySet) {
    return {
      status: 'ALREADY_ACTIVATED',
      message: 'This account has already been activated with a password. Please log in or reset password.'
    };
  }

  // Password is NOT set: System MUST require OTP
  return {
    status: 'REQUIRE_OTP',
    roll_number: student.roll_number,
    name: student.full_name,
    message: 'OTP dispatched. Showing Step 2 (Verification Code).'
  };
}

async function runTests() {
  console.log('--- STARTING FIRST-TIME LOGIN VERIFICATION TESTS ---');

  // Test 1: Active student whose password is NOT set
  // e.g. omvigneshlodh@gmail.com
  const res1 = await simulateFirstTimeLogin('omvigneshlodh@gmail.com');
  console.log('Result 1 (Password NOT set):', res1);
  if (res1.status === 'REQUIRE_OTP') {
    console.log('✅ TEST 1 PASSED: Asks for OTP when password is not set.');
  } else {
    console.error('❌ TEST 1 FAILED:', res1);
  }

  // Test 2: Active student whose password IS set
  // e.g. bhanuprasad092627@gmail.com
  const res2 = await simulateFirstTimeLogin('bhanuprasad092627@gmail.com');
  console.log('Result 2 (Password IS set):', res2);
  if (res2.status === 'ALREADY_ACTIVATED') {
    console.log('✅ TEST 2 PASSED: Directs already activated accounts to login/reset.');
  } else {
    console.error('❌ TEST 2 FAILED:', res2);
  }

  // Test 3: Admin account whose password is NOT set
  // e.g. ramu@gmail.com
  const res3 = await simulateFirstTimeLogin('ramu@gmail.com');
  console.log('Result 3 (Admin with password NOT set):', res3);
  if (res3.status === 'REQUIRE_OTP') {
    console.log('✅ TEST 3 PASSED: Admin without password also requires OTP (no bypass).');
  } else {
    console.error('❌ TEST 3 FAILED:', res3);
  }
}

runTests();
