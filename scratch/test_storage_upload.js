/* eslint-disable */
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Attempting anonymous test upload to community-images1 bucket...");
  const buffer = Buffer.from("test image content");
  const path = `test/${Date.now()}.jpg`;

  const start = Date.now();
  const { data, error } = await supabase.storage
    .from('community-images1')
    .upload(path, buffer, {
      contentType: 'image/jpeg',
      upsert: false
    });

  const duration = Date.now() - start;
  if (error) {
    console.log(`Upload failed after ${duration}ms (Expected RLS error if alive):`, error);
  } else {
    console.log(`Upload succeeded (unexpected) in ${duration}ms! Path:`, data.path);
  }
}

run();
