const assert = require('assert');

function getCalendarDateString(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getCalendarDaysDiff(fromDateStr, toDateStr) {
  if (!fromDateStr || !toDateStr) return 9999;
  const [y1, m1, d1] = fromDateStr.split('-').map(Number);
  const [y2, m2, d2] = toDateStr.split('-').map(Number);
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 9999;
  const utcD1 = Date.UTC(y1, m1 - 1, d1);
  const utcD2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((utcD2 - utcD1) / (1000 * 60 * 60 * 24));
}

function computeStreakUpdate(lastActiveDate, currentStreak = 0, longestStreak = 0, todayStr = getCalendarDateString()) {
  const curr = Math.max(0, currentStreak || 0);
  const longest = Math.max(0, longestStreak || 0);

  if (!lastActiveDate) {
    // Rule 1: First-day activity
    const newStreak = 1;
    return {
      newCurrentStreak: newStreak,
      newLongestStreak: Math.max(longest, newStreak),
      isSameDay: false,
      wasReset: false,
    };
  }

  const diffDays = getCalendarDaysDiff(lastActiveDate, todayStr);

  if (diffDays <= 0) {
    // Rule 3: Multiple activities on the same day -> streak does not increment
    const newStreak = Math.max(1, curr);
    return {
      newCurrentStreak: newStreak,
      newLongestStreak: Math.max(longest, newStreak),
      isSameDay: true,
      wasReset: false,
    };
  }

  if (diffDays === 1) {
    // Rule 2: Consecutive-day activity -> increment by 1
    const newStreak = curr + 1;
    return {
      newCurrentStreak: newStreak,
      newLongestStreak: Math.max(longest, newStreak),
      isSameDay: false,
      wasReset: false,
    };
  }

  if (diffDays === 2) {
    // Rule 4: One missed day -> grace period preserves and continues streak
    const newStreak = curr + 1;
    return {
      newCurrentStreak: newStreak,
      newLongestStreak: Math.max(longest, newStreak),
      isSameDay: false,
      wasReset: false,
    };
  }

  // diffDays >= 3: Two or more consecutive calendar days missed -> resets to 1
  // Rule 4 & Rule 5: restarts at 1, longest streak preserved
  const newStreak = 1;
  return {
    newCurrentStreak: newStreak,
    newLongestStreak: Math.max(longest, newStreak),
    isSameDay: false,
    wasReset: true,
  };
}

function evaluateDisplayStreak(lastActiveDate, currentStreak = 0, longestStreak = 0, todayStr = getCalendarDateString()) {
  if (!lastActiveDate) return { currentStreak: 0, longestStreak: longestStreak || 0, isAlive: false };
  const diffDays = getCalendarDaysDiff(lastActiveDate, todayStr);
  if (diffDays <= 2) {
    // Active today (0), yesterday (1), or within 1 missed day grace period (2)
    return { currentStreak: currentStreak || 0, longestStreak: longestStreak || 0, isAlive: true };
  }
  // Two or more missed days (diffDays >= 3)
  return { currentStreak: 0, longestStreak: longestStreak || 0, isAlive: false };
}

console.log('--- Testing All Required Scenarios ---');

// 1. First qualifying activity -> Current streak = 1
const s1 = computeStreakUpdate(null, 0, 0, '2026-10-01');
assert.strictEqual(s1.newCurrentStreak, 1, 'First activity should be 1');
assert.strictEqual(s1.newLongestStreak, 1, 'Longest streak should be 1');
console.log('PASS: First activity -> current: 1, longest: 1');

// 2. Activity on the next day -> Current streak = 2
const s2 = computeStreakUpdate('2026-10-01', 1, 1, '2026-10-02');
assert.strictEqual(s2.newCurrentStreak, 2, 'Next day should be 2');
assert.strictEqual(s2.newLongestStreak, 2, 'Longest streak should be 2');
console.log('PASS: Activity on next day -> current: 2, longest: 2');

// 3. Activity for 5 consecutive days -> Current streak = 5
let curr = 1;
let longst = 1;
for (let day = 2; day <= 5; day++) {
  const prevDate = `2026-10-0${day - 1}`;
  const thisDate = `2026-10-0${day}`;
  const res = computeStreakUpdate(prevDate, curr, longst, thisDate);
  curr = res.newCurrentStreak;
  longst = res.newLongestStreak;
}
assert.strictEqual(curr, 5, '5 consecutive days should yield streak 5');
assert.strictEqual(longst, 5, '5 consecutive days should yield longest 5');
console.log('PASS: 5 consecutive days -> current: 5, longest: 5');

// 4. Multiple qualifying activities on one day -> Streak increments only once
const s4_first = computeStreakUpdate('2026-10-05', 5, 5, '2026-10-06');
assert.strictEqual(s4_first.newCurrentStreak, 6);
const s4_second = computeStreakUpdate('2026-10-06', 6, 6, '2026-10-06');
assert.strictEqual(s4_second.newCurrentStreak, 6, 'Second activity same day must NOT increment');
assert.strictEqual(s4_second.isSameDay, true);
console.log('PASS: Multiple activities on same day -> idempotent, remains 6');

// 5. One missed day, followed by a return -> Apply defined grace period policy (continues)
// Active on 2026-10-06 (streak 6). Missed 2026-10-07. Active on 2026-10-08 (diffDays = 2)
const s5 = computeStreakUpdate('2026-10-06', 6, 6, '2026-10-08');
assert.strictEqual(s5.newCurrentStreak, 7, 'One missed day grace period preserves and continues streak to 7');
console.log('PASS: One missed day grace period -> streak continues: 7');

// 6. Two consecutive missed days, followed by a return -> Current streak restarts at 1
// Active on 2026-10-08 (streak 7). Missed 2026-10-09 and 2026-10-10. Active on 2026-10-11 (diffDays = 3)
const s6 = computeStreakUpdate('2026-10-08', 7, 7, '2026-10-11');
assert.strictEqual(s6.newCurrentStreak, 1, 'Two consecutive missed days must restart streak at 1');
assert.strictEqual(s6.newLongestStreak, 7, 'Longest streak must be preserved at 7');
assert.strictEqual(s6.wasReset, true);
console.log('PASS: Two consecutive missed days -> streak restarts at 1, longest preserved at 7');

// 7. Return after long absence -> Current streak = 1
const s7 = computeStreakUpdate('2026-08-01', 15, 15, '2026-10-13');
assert.strictEqual(s7.newCurrentStreak, 1, 'Return after long absence restarts at 1');
assert.strictEqual(s7.newLongestStreak, 15, 'Longest streak preserved');
console.log('PASS: Return after long absence -> current: 1, longest: 15');

// 8. Current streak exceeds longest streak -> Longest streak updates
const s8 = computeStreakUpdate('2026-10-12', 7, 7, '2026-10-13');
assert.strictEqual(s8.newCurrentStreak, 8);
assert.strictEqual(s8.newLongestStreak, 8);
console.log('PASS: Current exceeds longest -> longest updates to 8');

// 9. Display check when 2 missed days have passed without activity
const dispActive = evaluateDisplayStreak('2026-10-12', 8, 8, '2026-10-13');
assert.strictEqual(dispActive.isAlive, true);
assert.strictEqual(dispActive.currentStreak, 8);

const dispExpired = evaluateDisplayStreak('2026-10-09', 8, 8, '2026-10-13');
assert.strictEqual(dispExpired.isAlive, false);
assert.strictEqual(dispExpired.currentStreak, 0);
assert.strictEqual(dispExpired.longestStreak, 8);
console.log('PASS: Display check handles active and expired streaks properly');

console.log('\nALL TESTS PASSED PERFECTLY!');
