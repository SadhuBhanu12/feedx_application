const assert = require('assert');

// Mock of timezone-safe helpers & streak calculation
function getCalendarDaysDiff(earlierDateStr, laterDateStr) {
  if (!earlierDateStr || !laterDateStr) return 9999;
  const [y1, m1, d1] = earlierDateStr.split('-').map(Number);
  const [y2, m2, d2] = laterDateStr.split('-').map(Number);
  const utcD1 = Date.UTC(y1, m1 - 1, d1);
  const utcD2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((utcD2 - utcD1) / (1000 * 60 * 60 * 24));
}

function calculateStreak(activeDateList, todayStr) {
  const activeDates = new Set(activeDateList);
  const sortedDates = Array.from(activeDates).sort();
  const latestActiveDate = sortedDates[sortedDates.length - 1] || '';
  const diffFromToday = getCalendarDaysDiff(latestActiveDate, todayStr);

  let currentStreak = 0;

  // Strict consecutive day check: if diffFromToday >= 2, streak is 0 (expired)
  if (diffFromToday >= 2 || !latestActiveDate) {
    currentStreak = 0;
  } else {
    const stepBack = (dateStr, days) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dt = new Date(Date.UTC(y, m - 1, d - days, 12, 0, 0));
      const yyyy = dt.getUTCFullYear();
      const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(dt.getUTCDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    let cursorDateStr = activeDates.has(todayStr)
      ? todayStr
      : (diffFromToday === 1 ? latestActiveDate : '');

    while (cursorDateStr) {
      if (activeDates.has(cursorDateStr)) {
        currentStreak++;
        cursorDateStr = stepBack(cursorDateStr, 1);
      } else {
        break;
      }
    }
  }

  // Longest streak
  let maxConsecutive = 0;
  let currentConsecutive = 0;
  let prevDate = null;

  for (const dateStr of sortedDates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const currentDate = new Date(y, m - 1, d);

    if (prevDate) {
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentConsecutive++;
      } else {
        currentConsecutive = 1;
      }
    } else {
      currentConsecutive = 1;
    }

    if (currentConsecutive > maxConsecutive) {
      maxConsecutive = currentConsecutive;
    }
    prevDate = currentDate;
  }

  return {
    currentStreak,
    longestStreak: Math.max(maxConsecutive, currentStreak),
    totalActiveDays: activeDates.size
  };
}

function recordActivity(currentStreakState, activityDateStr, longestStreak = 0) {
  const prevActive = currentStreakState.lastActiveDate;
  let calculatedStreak = 1;

  if (!prevActive) {
    // Case 1: First qualifying activity
    calculatedStreak = 1;
  } else {
    const diff = getCalendarDaysDiff(prevActive, activityDateStr);
    if (diff === 0) {
      // Case 2: Multiple activities same day -> do NOT increment
      calculatedStreak = Math.max(currentStreakState.currentStreak, 1);
    } else if (diff === 1) {
      // Case 3: Next consecutive calendar day -> increment
      calculatedStreak = currentStreakState.currentStreak + 1;
    } else {
      // Case 4: 1 or more calendar days missed -> restart at 1
      calculatedStreak = 1;
    }
  }

  return {
    currentStreak: calculatedStreak,
    longestStreak: Math.max(longestStreak, calculatedStreak),
    lastActiveDate: activityDateStr
  };
}

// =================== RUN TESTS ===================
console.log('--- Running Streak Rule Verification Tests ---');

// Test 1: First qualifying activity
const s1 = recordActivity({ currentStreak: 0, lastActiveDate: null }, '2026-10-01', 0);
assert.strictEqual(s1.currentStreak, 1, 'Test 1 Failed: First activity should be streak 1');
assert.strictEqual(s1.longestStreak, 1, 'Test 1 Failed: Longest streak should be 1');
console.log('✅ Test 1 Passed: First qualifying activity initializes streak to 1');

// Test 2: Multiple activities on same day
const s2 = recordActivity(s1, '2026-10-01', s1.longestStreak);
assert.strictEqual(s2.currentStreak, 1, 'Test 2 Failed: Same day should not increment streak');
console.log('✅ Test 2 Passed: Same-day activity does NOT increment streak');

// Test 3: Consecutive day activity
const s3 = recordActivity(s2, '2026-10-02', s2.longestStreak);
assert.strictEqual(s3.currentStreak, 2, 'Test 3 Failed: Consecutive day should increment to 2');
assert.strictEqual(s3.longestStreak, 2, 'Test 3 Failed: Longest streak should be 2');
console.log('✅ Test 3 Passed: Next consecutive day increments streak by 1');

// Test 4: Missed 1 calendar day (2026-10-03 missed, return on 2026-10-04)
const s4 = recordActivity(s3, '2026-10-04', s3.longestStreak);
assert.strictEqual(s4.currentStreak, 1, 'Test 4 Failed: Missed day should restart streak at 1 on return');
assert.strictEqual(s4.longestStreak, 2, 'Test 4 Failed: Longest streak should be preserved at 2');
console.log('✅ Test 4 Passed: Missed calendar day restarts streak at 1, preserves longest streak (2)');

// Test 5: User opens app without qualifying activity
// 5a. If today is 2026-10-05 and user was active on 2026-10-04 (yesterday): streak is still 1
const view1 = calculateStreak(['2026-10-04'], '2026-10-05');
assert.strictEqual(view1.currentStreak, 1, 'Test 5a Failed: Yesterday active should show 1');

// 5b. If today is 2026-10-06 and user was active on 2026-10-04 (2 days ago, missed yesterday): streak is 0
const view2 = calculateStreak(['2026-10-04'], '2026-10-06');
assert.strictEqual(view2.currentStreak, 0, 'Test 5b Failed: Missed yesterday should show 0 expired streak');
assert.strictEqual(view2.longestStreak, 1, 'Test 5b Failed: Longest streak preserved');
console.log('✅ Test 5 Passed: App open with missed day shows 0 active days while preserving longest');

// Test 6: App reload does not increment
const view3 = calculateStreak(['2026-10-01', '2026-10-02'], '2026-10-02');
assert.strictEqual(view3.currentStreak, 2, 'Test 6 Failed: Re-evaluating should stay 2');
console.log('✅ Test 6 Passed: App reload does not alter or increment streak');

console.log('🎉 ALL 6 STREAK TESTS PASSED CLEANLY!');
