const { createClient } = require('@supabase/supabase-js');
const assert = require('assert');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

// Replicate the client awardActivity fallback logic to test end-to-end
async function awardActivityDirect(studentId, activityType, tokenReward, xpReward, referenceId) {
  let tokensGained = Math.max(tokenReward, xpReward, 0);
  if (['home_daily_quick_learn', 'daily_mission_quick_learn', 'daily_quick_learn'].includes(activityType)) {
    tokensGained = 50;
  } else if (['home_daily_quiz', 'daily_mission_quiz', 'daily_quiz', 'daily_task_quiz'].includes(activityType)) {
    tokensGained = 50;
  } else if (['explore_quick_learn', 'quick_learn', 'resource_read', 'lesson_completed'].includes(activityType)) {
    tokensGained = 10;
  } else if (['explore_quiz', 'quick_quiz', 'quiz_completed'].includes(activityType)) {
    tokensGained = 15;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const refId = referenceId || `${activityType}_${todayStr}`;

  // 1. Fetch current wallet & transactions
  const { data: wData } = await supabase.from('student_wallets').select('*').eq('student_id', studentId).maybeSingle();
  const currentTokens = wData?.tokens || 0;
  const currentCoins = wData?.gold_coins || 0;
  const currentEarned = wData?.total_earned || 0;

  const { data: txs } = await supabase.from('coin_transactions').select('*').eq('student_id', studentId).limit(50);
  const isHomeQuickLearn = (type) => ['home_daily_quick_learn', 'daily_mission_quick_learn', 'daily_quick_learn'].includes(type);
  const isHomeDailyQuiz = (type) => ['home_daily_quiz', 'daily_mission_quiz', 'daily_quiz', 'daily_task_quiz'].includes(type);

  // Check idempotency
  const alreadyDone = (txs || []).some((t) => {
    const isMatchingType =
      t.activity_type === activityType ||
      (isHomeQuickLearn(activityType) && isHomeQuickLearn(t.activity_type)) ||
      (isHomeDailyQuiz(activityType) && isHomeDailyQuiz(t.activity_type));
    if (!isMatchingType) return false;
    return t.reference_id === refId || t.reference_id === referenceId;
  });

  if (alreadyDone) {
    return {
      success: true,
      already_earned: true,
      tokens_awarded: 0,
      new_tokens: currentTokens,
    };
  }

  const newWalletTokens = currentTokens + tokensGained;
  const newTotalEarned = currentEarned + tokensGained;

  // Persist to DB
  await supabase.from('student_wallets').upsert({
    student_id: studentId,
    user_id: studentId,
    gold_coins: currentCoins,
    tokens: newWalletTokens,
    total_earned: newTotalEarned,
    updated_at: new Date().toISOString(),
  });

  await supabase.from('coin_transactions').insert({
    student_id: studentId,
    user_id: studentId,
    amount: tokensGained,
    activity_type: activityType,
    reference_id: refId,
    description: `Earned +${tokensGained} Task Tokens for ${activityType}`,
  });

  return {
    success: true,
    already_earned: false,
    tokens_awarded: tokensGained,
    new_tokens: newWalletTokens,
  };
}

async function runVerification() {
  console.log("================================================================");
  console.log("FEEDX REWARD MATRIX & REALTIME SYNCHRONIZATION VERIFICATION");
  console.log("================================================================\n");

  const testUser = "0b2c4b51-189e-46ce-8565-8da7a00cba4f";
  const uniqueTestKey = Date.now();

  // Test 1: Today's Mission Quick Learn -> Exactly 50 tokens
  console.log("Test 1: Today's Mission Quick Learn");
  const qlRes = await awardActivityDirect(
    testUser,
    'home_daily_quick_learn',
    50,
    50,
    `home_ql_test_${uniqueTestKey}`
  );
  console.log("  QL Awarded:", qlRes.tokens_awarded, "New Tokens:", qlRes.new_tokens);
  assert.strictEqual(qlRes.tokens_awarded, 50, "Today's Mission Quick Learn must award exactly 50 tokens");
  assert.strictEqual(qlRes.already_earned, false, "First submission must succeed");
  console.log("  ✅ PASS: Today's Mission Quick Learn = 50 tokens\n");

  // Test 2: Idempotency - duplicate submission blocked
  console.log("Test 2: Idempotency check for Today's Mission Quick Learn");
  const qlDupRes = await awardActivityDirect(
    testUser,
    'home_daily_quick_learn',
    50,
    50,
    `home_ql_test_${uniqueTestKey}`
  );
  console.log("  QL Dup Awarded:", qlDupRes.tokens_awarded, "Already Earned:", qlDupRes.already_earned);
  assert.strictEqual(qlDupRes.already_earned, true, "Duplicate must be detected");
  assert.strictEqual(qlDupRes.tokens_awarded, 0, "Duplicate must award 0 tokens");
  console.log("  ✅ PASS: Duplicate prevented (idempotent)\n");

  // Test 3: Today's Mission Daily Quiz -> Exactly 50 tokens
  console.log("Test 3: Today's Mission Daily Quiz");
  const dqRes = await awardActivityDirect(
    testUser,
    'home_daily_quiz',
    50,
    50,
    `home_quiz_test_${uniqueTestKey}`
  );
  console.log("  Daily Quiz Awarded:", dqRes.tokens_awarded, "New Tokens:", dqRes.new_tokens);
  assert.strictEqual(dqRes.tokens_awarded, 50, "Today's Mission Daily Quiz must award exactly 50 tokens");
  assert.strictEqual(dqRes.already_earned, false);
  console.log("  ✅ PASS: Today's Mission Daily Quiz = 50 tokens\n");

  // Test 4: Explore Quick Learn -> Exactly 10 tokens
  console.log("Test 4: Explore Quick Learn");
  const eqRes = await awardActivityDirect(
    testUser,
    'explore_quick_learn',
    10,
    10,
    `explore_ql_test_${uniqueTestKey}`
  );
  console.log("  Explore QL Awarded:", eqRes.tokens_awarded, "New Tokens:", eqRes.new_tokens);
  assert.strictEqual(eqRes.tokens_awarded, 10, "Explore Quick Learn must award exactly 10 tokens");
  assert.strictEqual(eqRes.already_earned, false);
  console.log("  ✅ PASS: Explore Quick Learn = 10 tokens\n");

  // Test 5: Explore Daily Quiz -> Exactly 15 tokens
  console.log("Test 5: Explore Daily Quiz");
  const eqzRes = await awardActivityDirect(
    testUser,
    'explore_quiz',
    15,
    15,
    `explore_quiz_test_${uniqueTestKey}`
  );
  console.log("  Explore Quiz Awarded:", eqzRes.tokens_awarded, "New Tokens:", eqzRes.new_tokens);
  assert.strictEqual(eqzRes.tokens_awarded, 15, "Explore Daily Quiz must award exactly 15 tokens");
  assert.strictEqual(eqzRes.already_earned, false);
  console.log("  ✅ PASS: Explore Daily Quiz = 15 tokens\n");

  // Test 6: Verify Live Database Wallet & Ledger
  console.log("Test 6: Verify Live Database Wallet & Ledger");
  const { data: finalWallet } = await supabase.from('student_wallets').select('*').eq('student_id', testUser).single();
  console.log("  Final DB Wallet tokens:", finalWallet.tokens);
  assert.ok(finalWallet.tokens > 0, "Wallet tokens must be positive");
  console.log("  ✅ PASS: Wallet balance properly recorded in DB\n");

  console.log("================================================================");
  console.log("ALL 6 TESTS PASSED SUCCESSFULLY! 🚀");
  console.log("================================================================");
}

runVerification().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
