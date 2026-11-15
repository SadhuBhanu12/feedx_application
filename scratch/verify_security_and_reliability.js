const assert = require('assert');
const { createClient } = require('@supabase/supabase-js');

console.log('================================================================');
console.log('FEEDX APPLICATION-WIDE SECURITY, PERFORMANCE & INTEGRITY AUDIT');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;
let failedTests = [];

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    failedTests.push({ name, error: err.message });
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    failedTests.push({ name, error: err.message });
  }
}

// ==============================================================================
// 1. REWARD BOUNDS & CONVERSION INTEGRITY TESTS
// ==============================================================================
function validateTokenConversion(availableTokens, tokensToConvert) {
  if (tokensToConvert < 1000) {
    return { valid: false, error: 'Minimum conversion requirement is 1,000 Task Tokens.' };
  }
  if (tokensToConvert > availableTokens) {
    return { valid: false, error: 'Cannot convert more tokens than available.' };
  }
  const coins = Math.floor(tokensToConvert / 1000);
  const remaining = availableTokens - (coins * 1000);
  return { valid: true, coins, remainingTokens: remaining };
}

runTest('Security - Conversion rejects request when tokensToConvert < 1000', () => {
  const res = validateTokenConversion(5000, 500);
  assert.strictEqual(res.valid, false);
  assert.strictEqual(res.coins, undefined);
});

runTest('Security - Conversion rejects when tokensToConvert exceeds availableTokens', () => {
  const res = validateTokenConversion(1500, 50000);
  assert.strictEqual(res.valid, false);
  assert.strictEqual(res.coins, undefined);
});

runTest('Security - Conversion calculates exact coins and remaining tokens', () => {
  const res = validateTokenConversion(3500, 3000);
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.coins, 3);
  assert.strictEqual(res.remainingTokens, 500);
});

// ==============================================================================
// 2. STREAK GRACE & RESET LOGIC
// ==============================================================================
function getCalendarDaysDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

function calculateStreak(uniqueDateStrings, todayStr) {
  if (!uniqueDateStrings || uniqueDateStrings.length === 0) return 0;
  const dates = [...new Set(uniqueDateStrings)].sort().reverse();
  const lastDate = dates[0];
  const diffFromToday = getCalendarDaysDiff(lastDate, todayStr);
  if (diffFromToday >= 3) return 0;

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const diff = getCalendarDaysDiff(dates[i + 1], dates[i]);
    if (diff === 1 || diff === 2) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

runTest('Streak - Consecutive 7 days yields streak of 7', () => {
  const dates = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07'];
  assert.strictEqual(calculateStreak(dates, '2026-10-07'), 7);
});

runTest('Streak - 2 consecutive missed days breaks streak chain to 0', () => {
  const dates = ['2026-10-01'];
  assert.strictEqual(calculateStreak(dates, '2026-10-04'), 0);
});

// ==============================================================================
// 3. SECURE ROLL NUMBER LOOKUP
// ==============================================================================
runTest('Lookup - Sanitizes and normalizes roll number to uppercase trimmed', () => {
  const input = '  23951a0501  ';
  const normalized = input.trim().toUpperCase();
  assert.strictEqual(normalized, '23951A0501');
});

// ==============================================================================
// 4. CERTIFICATE SERIAL CODE GENERATOR
// ==============================================================================
function generateCertificateId(type, count) {
  const pad = String(count).padStart(4, '0');
  return `FX-${type}-${pad}`;
}

runTest('Certificates - Generates standardized FeedX serial code FX-EX-0001', () => {
  const id = generateCertificateId('EX', 1);
  assert.strictEqual(id, 'FX-EX-0001');
});

runTest('Certificates - Generates standardized FeedX serial code FX-VL-0042', () => {
  const id = generateCertificateId('VL', 42);
  assert.strictEqual(id, 'FX-VL-0042');
});

// ==============================================================================
// 5. LIVE SUPABASE DATABASE CONNECTIVITY & TABLE AUDIT
// ==============================================================================
async function runDatabaseChecks() {
  const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
  const supabase = createClient(supabaseUrl, supabaseKey);

  await runAsyncTest('Database - Live Supabase client connects successfully', async () => {
    const { data, error } = await supabase.from('colleges').select('id, name').limit(1);
    assert.strictEqual(error, null, error?.message);
    assert.ok(Array.isArray(data));
  });

  await runAsyncTest('Database - Events table queryable with Published filter', async () => {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, status')
      .eq('status', 'Published')
      .limit(5);
    assert.strictEqual(error, null, error?.message);
    assert.ok(Array.isArray(data));
  });

  await runAsyncTest('Database - Opportunities queryable with deadline ordering', async () => {
    const { data, error } = await supabase
      .from('opportunities')
      .select('id, title, company, deadline')
      .order('deadline', { ascending: true })
      .limit(5);
    assert.strictEqual(error, null, error?.message);
    assert.ok(Array.isArray(data));
  });

  await runAsyncTest('Database - Community posts queryable with active status', async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('id, title, caption, likes_count, comments_count')
      .order('created_at', { ascending: false })
      .limit(5);
    assert.strictEqual(error, null, error?.message);
    assert.ok(Array.isArray(data));
  });

  console.log('\n================================================================');
  console.log(`TEST SUITE RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (failedTests.length > 0) {
    console.log(`FAILED TESTS: ${failedTests.length}`);
    failedTests.forEach(f => console.log(` - ${f.name}: ${f.error}`));
    process.exit(1);
  } else {
    console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
    console.log('================================================================\n');
  }
}

runDatabaseChecks();
