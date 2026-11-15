const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  const studentId = '148ec926-3068-45bc-85dd-fd998e3f6862';
  
  console.log('1. Test single column eq');
  const res1 = await supabase.from('daily_streaks').select('*').eq('student_id', studentId);
  console.log('res1:', res1.error ? res1.error.message : res1.data);

  console.log('2. Test .or syntax');
  const res2 = await supabase.from('daily_streaks').select('*').or(`student_id.eq.${studentId},user_id.eq.${studentId}`);
  console.log('res2:', res2.error ? res2.error.message : res2.data);
}

testQuery();
