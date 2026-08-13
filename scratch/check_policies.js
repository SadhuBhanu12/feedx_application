const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Query pg_policies via RPC or a custom query if possible?
  // We don't have direct SQL execution, but let's see if we can do it via a system table read if allowed (usually not allowed for anon).
  const { data, error } = await supabase.from('pg_policies').select('*');
  if (error) {
    console.error("pg_policies query failed (expected for anon):", error.message);
  } else {
    console.log("pg_policies:", data);
  }
}
check();
