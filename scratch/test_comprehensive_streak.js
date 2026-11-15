const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabase = createClient(supabaseUrl, supabaseKey);

function getLocalTodayDateStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getLocalYesterdayDateStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function calculateStreakFromDates(allDates, baseLongest = 0, baseTotal = 0) {
  const activeDates = new Set();

  allDates.forEach((dt) => {
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

  const totalActiveDays = Math.max(activeDates.size, baseTotal);
  if (activeDates.size === 0) {
    return {
      currentStreak: 0,
      longestStreak: Math.max(0, baseLongest),
      totalActiveDays: Math.max(0, baseTotal),
      activeDates: Array.from(activeDates),
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

  // Longest streak
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
    activeDates: sortedDates,
  };
}

async function safeQuery(fn) {
  try {
    const res = await fn();
    return res.data || [];
  } catch (_) {
    return [];
  }
}

async function testFetchDailyStreak(studentId) {
  console.log('Testing for student:', studentId);

  const [streakData, txsData, taskData, quizData, rewardData, lessonData] = await Promise.all([
    safeQuery(() => supabase.from('daily_streaks').select('*').eq('student_id', studentId).maybeSingle()),
    safeQuery(() => supabase.from('coin_transactions').select('created_at, reference_id').or(`student_id.eq.${studentId},user_id.eq.${studentId}`).limit(200)),
    safeQuery(() => supabase.from('daily_task_completions').select('completed_at, created_at, task_date').or(`student_id.eq.${studentId},user_id.eq.${studentId}`).limit(100)),
    safeQuery(() => supabase.from('daily_quiz_attempts').select('completed_at, started_at, created_at').or(`student_id.eq.${studentId},user_id.eq.${studentId}`).limit(100)),
    safeQuery(() => supabase.from('reward_transactions').select('created_at, source_id').or(`student_id.eq.${studentId},user_id.eq.${studentId}`).limit(100)),
    safeQuery(() => supabase.from('student_lesson_progress').select('completed_at').eq('user_id', studentId).limit(100)),
  ]);

  console.log('Results:', {
    streakData,
    txsCount: txsData.length,
    taskCount: taskData.length,
    quizCount: quizData.length,
    rewardCount: rewardData.length,
    lessonCount: lessonData.length,
  });

  const allDates = [];
  txsData.forEach(t => { if (t.created_at) allDates.push(t.created_at); if (t.reference_id) allDates.push(t.reference_id); });
  taskData.forEach(t => { if (t.task_date) allDates.push(t.task_date); if (t.completed_at) allDates.push(t.completed_at); });
  quizData.forEach(q => { if (q.completed_at) allDates.push(q.completed_at); if (q.started_at) allDates.push(q.started_at); });
  rewardData.forEach(r => { if (r.created_at) allDates.push(r.created_at); if (r.source_id) allDates.push(r.source_id); });
  lessonData.forEach(l => { if (l.completed_at) allDates.push(l.completed_at); });

  const calculated = calculateStreakFromDates(allDates, streakData?.longest_streak || 0, streakData?.total_active_days || 0);
  console.log('Calculated streak from DB:', calculated);
}

testFetchDailyStreak('ebebc008-eb36-4eb1-ba4b-ce66d9b8badc');
