const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectTables() {
  const { data: streaks } = await supabase.from('daily_streaks').select('*').limit(10);
  console.log('daily_streaks:', streaks);

  const { data: wallets } = await supabase.from('student_wallets').select('*').limit(10);
  console.log('student_wallets:', wallets);
}

inspectTables();
