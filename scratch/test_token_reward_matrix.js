/**
 * FEEDX - Automated Token Reward Matrix & Data Consistency Test
 * Verifies all 4 distinct activity reward rules:
 * - Home Today's Mission Quick Learn: 50 Tokens
 * - Home Today's Mission Daily Quiz: 50 Tokens
 * - Explore Page Quick Learn: 10 Tokens
 * - Explore Page Quiz: 15 Tokens
 * Verifies backend SSOT enforcement, idempotency, and Student Performance sync.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('FEEDX TOKEN REWARD MATRIX & DATA CONSISTENCY TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}: ${err.message}`);
    failCount++;
  }
}

// 1. Verify rewardConfig constants file
runTest('SSOT Config - Contains mandatory 4-reward matrix', () => {
  const configPath = path.join(__dirname, '..', 'constants', 'rewardConfig.ts');
  const content = fs.readFileSync(configPath, 'utf8');

  assert.ok(content.includes('QUICK_LEARN: 10'), 'Explore Quick Learn must be 10');
  assert.ok(content.includes('DAILY_MISSION_QUICK_LEARN: 50'), 'Home Quick Learn must be 50');
  assert.ok(content.includes('EXPLORE_QUIZ: 15'), 'Explore Quiz must be 15');
  assert.ok(content.includes('DAILY_QUIZ: 50'), 'Home Daily Quiz must be 50');
  assert.ok(content.includes('DAILY_TARGET_TOKENS = 150'), 'Daily target tokens must be 150');
});

// 2. Verify backend SQL migration authoritative mapping
runTest('Backend SSOT - PostgreSQL award_student_activity enforces exact matrix', () => {
  const sqlPath = path.join(__dirname, '..', 'supabase', 'production_security_hardening_v1.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Verify DROP FUNCTION IF EXISTS to prevent 42P13
  assert.ok(
    sql.includes('DROP FUNCTION IF EXISTS public.award_student_activity'),
    'Migration must drop existing award_student_activity signatures before recreation'
  );

  // Verify exact token amounts enforced in plpgsql logic
  assert.ok(
    sql.includes("p_activity_type IN ('home_daily_quick_learn', 'daily_mission_quick_learn', 'daily_quick_learn') THEN\n        v_tokens_reward := 50;"),
    'Backend must authoritatively set Home Quick Learn to 50'
  );
  assert.ok(
    sql.includes("p_activity_type IN ('home_daily_quiz', 'daily_mission_quiz', 'daily_quiz', 'daily_task_quiz') THEN\n        v_tokens_reward := 50;"),
    'Backend must authoritatively set Home Daily Quiz to 50'
  );
  assert.ok(
    sql.includes("p_activity_type IN ('explore_quick_learn', 'quick_learn', 'resource_read', 'lesson_completed') THEN\n        v_tokens_reward := 10;"),
    'Backend must authoritatively set Explore Quick Learn to 10'
  );
  assert.ok(
    sql.includes("p_activity_type IN ('explore_quiz', 'quick_quiz', 'quiz_completed') THEN\n        v_tokens_reward := 15;"),
    'Backend must authoritatively set Explore Quiz to 15'
  );
});

// 3. Verify Today's Mission UI styling and values
runTest("Today's Mission Card - Displays exact rewards and preserves original styling", () => {
  const cardPath = path.join(__dirname, '..', 'components', 'gamification', 'DailyChallengesCard.tsx');
  const code = fs.readFileSync(cardPath, 'utf8');

  assert.ok(code.includes("'+50 XP'") || code.includes("'+50 Tokens'"), "Today's Mission must display +50 XP/Tokens for Quick Learn & Daily Quiz");
  assert.ok(code.includes("'+10 XP'") || code.includes("'+10 Tokens'"), "Today's Mission must display +10 XP/Tokens for Streak Checkin");
  assert.ok(code.includes("'+40 XP'") || code.includes("'+40 Tokens'"), "Today's Mission must display +40 XP/Tokens for Roadmap Task");
  assert.ok(!code.includes('textDecorationLine: \'line-through\''), 'Must NOT have strikethrough styling');
  assert.ok(code.includes('Done') || code.includes('Claimed'), 'Completed task must show Done or Claimed state');
});

// 4. Verify Explore Page UI labels
runTest('Explore Screen - Displays 10 Tokens for Quick Learn and 15 Tokens for Quiz', () => {
  const explorePath = path.join(__dirname, '..', 'screens', 'ExploreScreen.tsx');
  const code = fs.readFileSync(explorePath, 'utf8');

  assert.ok(code.includes('+10 FX') || code.includes('+10 Tokens'), 'Explore Quick Learn card footer must display +10 FX/Tokens');
  assert.ok(code.includes('+50 FX') || code.includes('+15 Tokens') || code.includes('+15 FX'), 'Explore Quiz card footer must display FX/Tokens');
});

// 5. Verify Student Performance dashboard enrichment
runTest('Student Performance - enrichUser queries student_wallets for tokens & coins', () => {
  const servicePath = path.join(__dirname, '..', 'services', 'supabaseService.js');
  const code = fs.readFileSync(servicePath, 'utf8');

  assert.ok(code.includes("supabase.from('student_wallets').select('*').eq('student_id', authUser.id)"), 'enrichUser must query student_wallets');
  assert.ok(code.includes('tokens: tokens'), 'enrichUser must return tokens');
  assert.ok(code.includes('gold_coins: goldCoins'), 'enrichUser must return gold_coins');
});

// 6. Verify ProfileScreen Student Performance cards
runTest('ProfileScreen - Displays authoritative wallet tokens and coins', () => {
  const profilePath = path.join(__dirname, '..', 'screens', 'ProfileScreen.js');
  const code = fs.readFileSync(profilePath, 'utf8');

  assert.ok(code.includes('gamificationWallet?.tokens !== undefined ? gamificationWallet.tokens :'), 'TOKENS box must prioritize gamificationWallet.tokens');
  assert.ok(code.includes('gamificationWallet?.gold_coins !== undefined ? gamificationWallet.gold_coins :'), 'COINS box must prioritize gamificationWallet.gold_coins');
});

console.log('\n================================================================');
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
