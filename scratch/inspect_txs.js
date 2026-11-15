const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: ct, error: ctErr } = await supabase.from('coin_transactions').select('*').limit(2);
  console.log('coin_transactions error:', ctErr);
  if (ct && ct.length > 0) {
    console.log('coin_transactions row:', ct[0]);
    console.log('coin_transactions columns:', Object.keys(ct[0]));
  }

  const { data: rt, error: rtErr } = await supabase.from('reward_transactions').select('*').limit(2);
  console.log('reward_transactions error:', rtErr);
  if (rt && rt.length > 0) {
    console.log('reward_transactions row:', rt[0]);
  }
}

test();
