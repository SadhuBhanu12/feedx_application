const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function safeDbQuery(queryPromise) {
  try {
    const res = await queryPromise;
    if (res && res.data) return res.data;
    return null;
  } catch (_) {
    return null;
  }
}

async function safeDbArrayQuery(queryPromise) {
  try {
    const res = await queryPromise;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  } catch (_) {
    return [];
  }
}

function getLocalTodayDateStr(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getLocalYesterdayDateStr(d = new Date()) {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return getLocalTodayDateStr(y);
}

function calculateStreakFromTransactions(
  transactions = [],
  storedHistory = {},
  baseLongest = 0,
  baseTotal = 0,
  additionalDates = []
) {
  const activeDates = new Set();

  (transactions || []).forEach((t) => {
    if (t.created_at) {
      try {
        const d = new Date(t.created_at);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        activeDates.add(`${yyyy}-${mm}-${dd}`);
      } catch (_) {}
    }
    if (t.reference_id) {
      const match = t.reference_id.match(/\d{4}-\d{2}-\d{2}/);
      if (match) activeDates.add(match[0]);
    }
  });

  (additionalDates || []).forEach((dt) => {
    if (!dt) return;
    try {
      if (typeof dt === 'string') {
        const match = dt.match(/\d{4}-\d{2}-\d{2}/);
        if (match) {
          activeDates.add(match[0]);
          return;
        }
      }
      const d = new Date(dt);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        activeDates.add(`${yyyy}-${mm}-${dd}`);
      }
    } catch (_) {}
  });

  Object.keys(storedHistory || {}).forEach((dateStr) => {
    if (storedHistory[dateStr]) activeDates.add(dateStr);
  });

  const totalActiveDays = Math.max(activeDates.size, baseTotal);

  if (activeDates.size === 0) {
    return {
      currentStreak: 0,
      longestStreak: Math.max(0, baseLongest),
      totalActiveDays: Math.max(0, baseTotal),
      activeDates,
    };
  }

  const todayStr = getLocalTodayDateStr();
  const yesterdayStr = getLocalYesterdayDateStr();

  let currentStreak = 0;
  let cursorDate = new Date();

  if (activeDates.has(todayStr)) {
    cursorDate = new Date();
  } else if (activeDates.has(yesterdayStr)) {
    cursorDate = new Date();
    cursorDate.setDate(cursorDate.getDate() - 1);
  } else {
    cursorDate = new Date(0);
  }

  if (cursorDate.getTime() > 0) {
    while (true) {
      const yyyy = cursorDate.getFullYear();
      const mm = String(cursorDate.getMonth() + 1).padStart(2, '0');
      const dd = String(cursorDate.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}-${mm}-${dd}`;

      if (activeDates.has(dateKey)) {
        currentStreak++;
        cursorDate.setDate(cursorDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const sortedDates = Array.from(activeDates).sort();
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
      } else if (diffDays > 1) {
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

  const longestStreak = Math.max(maxConsecutive, currentStreak, baseLongest);

  return {
    currentStreak,
    longestStreak,
    totalActiveDays,
    activeDates,
  };
}

async function fetchDailyStreak(studentId) {
  const todayStr = getLocalTodayDateStr();

  const [streakData, txsData, taskData, quizData, rewardData, lessonData] = await Promise.all([
    safeDbQuery(supabase.from('daily_streaks').select('*').eq('student_id', studentId).maybeSingle()),
    safeDbArrayQuery(supabase.from('coin_transactions').select('*').or(`student_id.eq.${studentId},user_id.eq.${studentId}`).order('created_at', { ascending: false }).limit(200)),
    safeDbArrayQuery(supabase.from('daily_task_completions').select('completed_at, created_at, task_date').or(`student_id.eq.${studentId},user_id.eq.${studentId}`).limit(100)),
    safeDbArrayQuery(supabase.from('daily_quiz_attempts').select('completed_at, started_at, created_at').or(`student_id.eq.${studentId},user_id.eq.${studentId}`).limit(100)),
    safeDbArrayQuery(supabase.from('reward_transactions').select('created_at, source_id').or(`student_id.eq.${studentId},user_id.eq.${studentId}`).limit(100)),
    safeDbArrayQuery(supabase.from('student_lesson_progress').select('completed_at').eq('user_id', studentId).limit(100)),
  ]);

  const extraDates = [];
  (taskData || []).forEach((t) => {
    if (t.task_date) extraDates.push(t.task_date);
    if (t.completed_at) extraDates.push(t.completed_at);
    if (t.created_at) extraDates.push(t.created_at);
  });
  (quizData || []).forEach((q) => {
    if (q.completed_at) extraDates.push(q.completed_at);
    if (q.started_at) extraDates.push(q.started_at);
    if (q.created_at) extraDates.push(q.created_at);
  });
  (rewardData || []).forEach((r) => {
    if (r.created_at) extraDates.push(r.created_at);
    if (r.source_id) extraDates.push(r.source_id);
  });
  (lessonData || []).forEach((l) => {
    if (l.completed_at) extraDates.push(l.completed_at);
  });

  const historyObj = (streakData?.activity_history && typeof streakData.activity_history === 'object')
    ? streakData.activity_history
    : {};

  const calculated = calculateStreakFromTransactions(
    txsData,
    historyObj,
    streakData?.longest_streak || 0,
    streakData?.total_active_days || 0,
    extraDates
  );

  const mergedCurrentStreak = Math.max(streakData?.current_streak || 0, calculated.currentStreak);
  const mergedLongestStreak = Math.max(streakData?.longest_streak || 0, calculated.longestStreak, mergedCurrentStreak);
  const mergedTotalActive = Math.max(streakData?.total_active_days || 0, calculated.totalActiveDays, (mergedCurrentStreak > 0 ? 1 : 0));

  const merged = {
    student_id: studentId,
    current_streak: mergedCurrentStreak,
    longest_streak: mergedLongestStreak,
    total_active_days: mergedTotalActive,
    last_active_date: streakData?.last_active_date || (mergedCurrentStreak > 0 ? todayStr : ''),
    streak_freeze_count: streakData?.streak_freeze_count ?? 1,
    xp_points: streakData?.xp_points !== undefined ? streakData.xp_points : 0,
    activity_history: historyObj,
    updated_at: new Date().toISOString(),
  };

  return merged;
}

async function runTest() {
  const studentId = 'ebebc008-eb36-4eb1-ba4b-ce66d9b8badc'; // Bhanu Prasad
  console.log('--- Testing fetchDailyStreak for student', studentId, '---');
  const streak = await fetchDailyStreak(studentId);
  console.log('Result streak:', streak);
}

runTest();
