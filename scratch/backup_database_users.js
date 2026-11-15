const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBackup() {
  console.log('--- Starting Data Backup ---');
  const backup = {
    timestamp: new Date().toISOString(),
    environment: supabaseUrl,
    tables: {}
  };

  const tables = ['users', 'students', 'daily_streaks', 'student_wallets', 'coin_transactions', 'reward_transactions'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.warn(`Warning backing up ${table}:`, error.message);
        backup.tables[table] = { error: error.message };
      } else {
        backup.tables[table] = data || [];
        console.log(`Backed up ${table}: ${data ? data.length : 0} rows`);
      }
    } catch (e) {
      console.warn(`Exception backing up ${table}:`, e.message);
    }
  }

  const backupPath = 'scratch/backup_test_users.json';
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), 'utf-8');
  console.log(`Backup completed successfully saved to ${backupPath}`);
}

createBackup();
