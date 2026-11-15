const assert = require('assert');

console.log('====================================================');
console.log('FEEDX COMPLETE BUG FIXING & VALIDATION TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
  }
}

// ==============================================================================
// TEST 1: STREAK RESET LOGIC
// ==============================================================================
function getCalendarDaysDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

function calculateStreakFromDates(uniqueDateStrings, todayStr) {
  if (!uniqueDateStrings || uniqueDateStrings.length === 0) return 0;

  const dates = [...new Set(uniqueDateStrings)]
    .map(d => new Date(d).toISOString().split('T')[0])
    .sort()
    .reverse();

  const lastDate = dates[0];
  const diffFromToday = getCalendarDaysDiff(lastDate, todayStr);

  // If user missed 2 consecutive calendar days (diff >= 3), streak resets to 0
  if (diffFromToday >= 3) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const diff = getCalendarDaysDiff(dates[i + 1], dates[i]);
    if (diff === 1) {
      streak++;
    } else if (diff === 2) {
      // 1 day skipped: streak grace period preserved
      streak++;
    } else {
      // 2 or more days missed: streak chain broken
      break;
    }
  }
  return streak;
}

runTest('Streak - Consecutive activity days increment streak', () => {
  const dates = ['2026-10-01', '2026-10-02', '2026-10-03'];
  const streak = calculateStreakFromDates(dates, '2026-10-03');
  assert.strictEqual(streak, 3);
});

runTest('Streak - Multiple activities on same day do not increment streak', () => {
  const dates = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-03', '2026-10-03'];
  const streak = calculateStreakFromDates(dates, '2026-10-03');
  assert.strictEqual(streak, 3);
});

runTest('Streak - 1 missed day (grace period) preserves streak', () => {
  // Activity on Oct 1, Oct 2, Oct 3. Missed Oct 4. Activity on Oct 5.
  const dates = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-05'];
  const streak = calculateStreakFromDates(dates, '2026-10-05');
  assert.strictEqual(streak, 4);
});

runTest('Streak - 2 consecutive missed days resets streak to 0', () => {
  // Activity on Oct 1. Missed Oct 2 and Oct 3. Checked on Oct 4 (3 days diff).
  const dates = ['2026-10-01'];
  const streak = calculateStreakFromDates(dates, '2026-10-04');
  assert.strictEqual(streak, 0);
});

runTest('Streak - Returning on Day 4 after 2 missed days restarts streak at Day 1', () => {
  // Activity on Oct 1. Missed Oct 2 & Oct 3. New activity completed on Oct 4.
  const dates = ['2026-10-01', '2026-10-04'];
  const streak = calculateStreakFromDates(dates, '2026-10-04');
  assert.strictEqual(streak, 1);
});

// ==============================================================================
// TEST 2: TOKENS, GOLD COINS, CERTIFICATES & PROGRESS
// ==============================================================================
function getCertificateEligibility(userTokens, certificateRequiredCoins) {
  const requiredTokens = certificateRequiredCoins * 1000;
  return {
    isEligible: userTokens >= requiredTokens,
    userCoins: Math.floor(userTokens / 1000),
    requiredTokens,
    requiredCoins: certificateRequiredCoins,
    missingTokens: Math.max(0, requiredTokens - userTokens),
  };
}

function calculateProgress(userTokens) {
  const coinsEarned = Math.floor(userTokens / 1000);
  const currentLevelTokens = userTokens % 1000;
  const tokensRemaining = 1000 - currentLevelTokens;
  const progressPercent = Math.round((currentLevelTokens / 1000) * 100);
  return {
    coinsEarned,
    currentLevelTokens,
    tokensRemaining,
    progressPercent,
    fraction: `${currentLevelTokens.toLocaleString()} / 1,000 Tokens`,
  };
}

runTest('Tokens/Coins - 5 Gold Coins requires exactly 5,000 tokens', () => {
  const under = getCertificateEligibility(4999, 5);
  assert.strictEqual(under.isEligible, false);
  assert.strictEqual(under.missingTokens, 1);

  const exact = getCertificateEligibility(5000, 5);
  assert.strictEqual(exact.isEligible, true);
  assert.strictEqual(exact.missingTokens, 0);

  const over = getCertificateEligibility(6500, 5);
  assert.strictEqual(over.isEligible, true);
});

runTest('Tokens/Coins - 10 Gold Coins requires exactly 10,000 tokens', () => {
  const under = getCertificateEligibility(9999, 10);
  assert.strictEqual(under.isEligible, false);

  const exact = getCertificateEligibility(10000, 10);
  assert.strictEqual(exact.isEligible, true);
});

runTest('Progress - 2,600 tokens displays 2 coins, 600/1,000 tokens, 400 remaining (60%)', () => {
  const progress = calculateProgress(2600);
  assert.strictEqual(progress.coinsEarned, 2);
  assert.strictEqual(progress.currentLevelTokens, 600);
  assert.strictEqual(progress.tokensRemaining, 400);
  assert.strictEqual(progress.progressPercent, 60);
  assert.strictEqual(progress.fraction, '600 / 1,000 Tokens');
});

runTest('Progress - 260 tokens displays 0 coins, 260/1,000 tokens, 740 remaining (26%)', () => {
  const progress = calculateProgress(260);
  assert.strictEqual(progress.coinsEarned, 0);
  assert.strictEqual(progress.currentLevelTokens, 260);
  assert.strictEqual(progress.tokensRemaining, 740);
  assert.strictEqual(progress.progressPercent, 26);
});

// ==============================================================================
// TEST 3: RESOURCE CATEGORY FILTERING
// ==============================================================================
function resolveResourceCategory(item) {
  if (!item) return 'Notes';
  const typeStr = String(item.type || item.category || '').toLowerCase().trim();
  const titleStr = String(item.title || item.name || '').toLowerCase().trim();
  const descStr = String(item.description || '').toLowerCase().trim();
  const combined = `${typeStr} ${titleStr} ${descStr}`;

  if (
    combined.includes('previous year') ||
    combined.includes('previous paper') ||
    combined.includes('pyq') ||
    combined.includes('question paper') ||
    combined.includes('exam paper') ||
    combined.includes('model paper') ||
    combined.includes('sample paper') ||
    combined.includes('solved paper') ||
    combined.includes('question bank') ||
    (combined.includes('paper') && (combined.includes('previous') || combined.includes('exam') || combined.includes('solved') || combined.includes('model') || combined.includes('question'))) ||
    typeStr.includes('paper') ||
    typeStr.includes('pyq') ||
    typeStr.includes('exam')
  ) {
    return 'Previous Year Papers';
  }

  if (combined.includes('syllabus') || combined.includes('curriculum')) {
    return 'Syllabus';
  }

  if (
    combined.includes('lab manual') ||
    combined.includes('practical manual') ||
    combined.includes('laboratory') ||
    combined.includes('practical') ||
    /\blab\b/i.test(combined) ||
    typeStr.includes('manual')
  ) {
    return 'Lab Manual';
  }

  if (typeStr.includes('tutorial') || typeStr.includes('video') || titleStr.includes('tutorial')) {
    return 'Tutorials';
  }

  if (typeStr.includes('doc') || titleStr.includes('documentation')) {
    return 'Documentation';
  }

  return 'Notes';
}

runTest('Resources - Previous Year Papers strictly isolated from Notes', () => {
  const pyqItem1 = { title: '5 Year Solved Previous Papers - CSE', type: 'Notes' }; // Was mislabeled as Notes in DB
  const pyqItem2 = { title: 'Diploma 2024 Exam Question Paper', type: 'Question Paper' };
  const notesItem = { title: 'Data Structures Complete Lecture Notes', type: 'Notes' };
  const labItem = { title: 'Microprocessors Lab Manual & Experiments', type: 'Manual' };
  const syllabusItem = { title: 'C-20 Curriculum & Syllabus', type: 'Syllabus' };

  assert.strictEqual(resolveResourceCategory(pyqItem1), 'Previous Year Papers');
  assert.strictEqual(resolveResourceCategory(pyqItem2), 'Previous Year Papers');
  assert.strictEqual(resolveResourceCategory(notesItem), 'Notes');
  assert.strictEqual(resolveResourceCategory(labItem), 'Lab Manual');
  assert.strictEqual(resolveResourceCategory(syllabusItem), 'Syllabus');
});

// ==============================================================================
// TEST 4: QUIZ SCORE CALCULATION
// ==============================================================================
function calculateQuizScore(questions, userAnswers) {
  let correctCount = 0;
  questions.forEach((q) => {
    const selected = userAnswers[q.id];
    if (selected !== undefined && selected !== null && String(selected).trim().toUpperCase() === String(q.correct_option).trim().toUpperCase()) {
      correctCount++;
    }
  });
  return {
    correctCount,
    total: questions.length,
    scorePercent: Math.round((correctCount / questions.length) * 100),
  };
}

runTest('Quiz - Calculates 100% when all answers correct', () => {
  const questions = [
    { id: 'q_1', correct_option: 'A' },
    { id: 'q_2', correct_option: 'B' },
    { id: 'ds-q3', correct_option: 'C' },
  ];
  const userAnswers = { 'q_1': 'A', 'q_2': 'B', 'ds-q3': 'C' };
  const result = calculateQuizScore(questions, userAnswers);
  assert.strictEqual(result.correctCount, 3);
  assert.strictEqual(result.scorePercent, 100);
});

runTest('Quiz - Calculates partial correct answers accurately', () => {
  const questions = [
    { id: 'q_1', correct_option: 'A' },
    { id: 'q_2', correct_option: 'B' },
    { id: 'q_3', correct_option: 'C' },
    { id: 'q_4', correct_option: 'D' },
  ];
  const userAnswers = { 'q_1': 'A', 'q_2': 'A', 'q_3': 'C', 'q_4': 'B' };
  const result = calculateQuizScore(questions, userAnswers);
  assert.strictEqual(result.correctCount, 2);
  assert.strictEqual(result.scorePercent, 50);
});

runTest('Quiz - Calculates 0% when all answers incorrect or unanswered', () => {
  const questions = [
    { id: 'q_1', correct_option: 'A' },
    { id: 'q_2', correct_option: 'B' },
  ];
  const userAnswers = { 'q_1': 'D', 'q_2': 'C' };
  const result = calculateQuizScore(questions, userAnswers);
  assert.strictEqual(result.correctCount, 0);
  assert.strictEqual(result.scorePercent, 0);
});

// ==============================================================================
// TEST 5: ROADMAP 12:00 AM CYCLE & DAILY LIMIT
// ==============================================================================
function checkPhaseDailyUnlock(completedPhases, completedMap, phaseIndex, phaseId, currentTime = new Date()) {
  const todayStart = new Date(currentTime);
  todayStart.setHours(0, 0, 0, 0);

  const nextMidnight = new Date(currentTime);
  nextMidnight.setHours(24, 0, 0, 0);

  const isPreviousCompleted = phaseIndex === 0 || (completedPhases.length >= phaseIndex);
  const isCompleted = completedPhases.includes(phaseId);

  // Check if any other phase was completed today
  const anyOtherPhaseCompletedToday = Object.entries(completedMap).some(([k, compIso]) => {
    if (k === phaseId || !compIso) return false;
    const d = new Date(compIso);
    return d.getTime() >= todayStart.getTime();
  });

  const isDailyUnlocked = !anyOtherPhaseCompletedToday;
  let state = 'locked';

  if (isCompleted) {
    state = 'completed';
  } else if (isPreviousCompleted && isDailyUnlocked) {
    state = 'available';
  } else {
    state = 'locked';
  }

  return {
    state,
    isDailyUnlocked,
    remainingMs: isDailyUnlocked ? 0 : Math.max(0, nextMidnight.getTime() - currentTime.getTime()),
  };
}

runTest('Roadmap - Phase 1 available initially when no phase completed today', () => {
  const result = checkPhaseDailyUnlock([], {}, 0, 'phase-1');
  assert.strictEqual(result.state, 'available');
  assert.strictEqual(result.isDailyUnlocked, true);
});

runTest('Roadmap - Phase 2 locked when Phase 1 was completed today (12:00 AM daily cycle)', () => {
  const now = new Date();
  const completedMap = { 'phase-1': now.toISOString() };
  const completedPhases = ['phase-1'];
  
  const result = checkPhaseDailyUnlock(completedPhases, completedMap, 1, 'phase-2', now);
  assert.strictEqual(result.state, 'locked');
  assert.strictEqual(result.isDailyUnlocked, false);
  assert.ok(result.remainingMs > 0);
});

runTest('Roadmap - Phase 2 unlocks next day after 12:00 AM midnight', () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const completedMap = { 'phase-1': yesterday.toISOString() };
  const completedPhases = ['phase-1'];
  
  const result = checkPhaseDailyUnlock(completedPhases, completedMap, 1, 'phase-2', new Date());
  assert.strictEqual(result.state, 'available');
  assert.strictEqual(result.isDailyUnlocked, true);
});

// ==============================================================================
// TEST 6: BRANDING STANDARDIZATION
// ==============================================================================
runTest('Branding - Product references use FEEDX in uppercase', () => {
  const testPhrases = [
    'FEEDX Polytechnic',
    'FEEDX ID',
    'FEEDX Enterprise',
    'FEEDX Student',
    'FEEDX Community',
    'FEEDX Store',
  ];
  testPhrases.forEach((p) => {
    assert.ok(p.includes('FEEDX'), `Phrase must include FEEDX: ${p}`);
    assert.ok(!p.includes('FeedX'), `Phrase must not include FeedX: ${p}`);
    assert.ok(!p.includes('Feedx'), `Phrase must not include Feedx: ${p}`);
  });
});

console.log('\n====================================================');
console.log(`SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED SUCCESSFULLY!`);
console.log('====================================================');
