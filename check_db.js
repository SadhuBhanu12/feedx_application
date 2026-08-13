const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  console.log("Running getEvents exact query...");
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'Published')
    .order('created_at', { ascending: false });
    
  console.log("getEvents data length:", data ? data.length : null);
  console.log("getEvents data:", data);
  console.log("getEvents error:", error);
}
run();
