const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDirect() {
  const testStudentId = "0b2c4b51-189e-46ce-8565-8da7a00cba4f";
  
  console.log("=== Testing direct insert into coin_transactions ===");
  const res = await supabase.from('coin_transactions').insert({
    student_id: testStudentId,
    amount: 50,
    activity_type: 'home_daily_quick_learn',
    reference_id: `test_direct_${Date.now()}`,
    description: 'Test direct insert'
  });
  console.log("Direct insert result:", res);
}

testDirect();
