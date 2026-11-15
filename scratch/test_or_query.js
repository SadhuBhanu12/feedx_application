const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  const uid = "0b2c4b51-189e-46ce-8565-8da7a00cba4f";
  const { data, error } = await supabase
    .from('coin_transactions')
    .select('activity_type, reference_id, created_at')
    .or(`student_id.eq.${uid},user_id.eq.${uid}`)
    .order('created_at', { ascending: false })
    .limit(40);
    
  console.log("Error:", error);
  console.log("Count:", data?.length);
  console.log("Data:", data?.slice(0, 5));
}

testQuery();
