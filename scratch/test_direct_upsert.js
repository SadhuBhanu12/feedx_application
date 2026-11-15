const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDirectUpsert() {
  const testStudentId = "0b2c4b51-189e-46ce-8565-8da7a00cba4f";
  
  console.log("=== Testing direct student_wallets select ===");
  const { data: w1 } = await supabase.from('student_wallets').select('*').eq('student_id', testStudentId);
  console.log("Wallet before:", w1);

  console.log("=== Testing direct student_wallets upsert ===");
  const res = await supabase.from('student_wallets').upsert({
    student_id: testStudentId,
    gold_coins: (w1?.[0]?.gold_coins || 0),
    tokens: (w1?.[0]?.tokens || 0) + 50,
    total_earned: (w1?.[0]?.total_earned || 0) + 50,
    updated_at: new Date().toISOString()
  });
  console.log("Wallet upsert result:", res);

  console.log("=== Testing direct student_wallets after ===");
  const { data: w2 } = await supabase.from('student_wallets').select('*').eq('student_id', testStudentId);
  console.log("Wallet after:", w2);
}

testDirectUpsert();
