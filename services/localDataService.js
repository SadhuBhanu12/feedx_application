import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  session: 'feedx:session',
  users: 'feedx:users',
  tasks: 'feedx:tasks',
  profile: 'feedx:profile',
  issues: 'feedx:issues',
  notifications: 'feedx:notifications',
};

const defaultUsers = [
  { roll_no: '230101', password: 'feedx123', name: 'Aarav Kumar', branch: 'CSE', year: 2, email: 'aarav@feedx.app' },
  { roll_no: '230102', password: 'feedx123', name: 'Isha Sharma', branch: 'ECE', year: 2, email: 'isha@feedx.app' },
];

const baseSubjects = ['Mathematics', 'DSA', 'Microprocessors', 'DBMS', 'Communication Skills'];

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function read(key, fallback) {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

async function write(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

function dayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

function buildTimeTable(branch) {
  const slots = ['09:00', '10:00', '11:15', '12:15', '14:00'];
  return slots.map((start, i) => ({
    id: `${branch}-${dayName()}-${start}`,
    start_time: start,
    end_time: `${Number(start.slice(0, 2)) + 1}${start.slice(2)}`,
    subject_name: `${baseSubjects[i % baseSubjects.length]} (${branch})`,
    faculty: ['R. Singh', 'K. Patel', 'A. Menon', 'N. Das'][i % 4],
  }));
}

export async function bootstrapStore() {
  const users = await read(KEYS.users, null);
  if (!users) await write(KEYS.users, defaultUsers);
}

export async function loginWithRollNo(rollNo, password) {
  await wait(300);
  const users = await read(KEYS.users, defaultUsers);
  const user = users.find((u) => u.roll_no === rollNo && u.password === password);
  if (!user) throw new Error('Invalid roll number or password');
  const session = { ...user, password: undefined };
  await write(KEYS.session, session);
  return session;
}

export async function getSession() {
  return read(KEYS.session, null);
}

export async function logout() {
  await AsyncStorage.removeItem(KEYS.session);
}

export async function getDashboard(rollNo, branch) {
  await wait(250);
  const [tasks, notifications] = await Promise.all([getTasks(rollNo), getNotifications()]);
  const attendanceBySubject = baseSubjects.map((subject) => {
    const total = rnd(25, 44);
    const present = rnd(Math.floor(total * 0.65), total);
    return { subject, present, total, percentage: Math.round((present / total) * 100) };
  });
  const attendance = Math.round(
    attendanceBySubject.reduce((acc, s) => acc + s.percentage, 0) / attendanceBySubject.length
  );
  return {
    attendance,
    attendanceBySubject,
    tasks,
    notifications,
    timetable: buildTimeTable(branch),
  };
}

export async function getTasks(rollNo) {
  const all = await read(KEYS.tasks, []);
  return all.filter((t) => t.roll_no === rollNo).sort((a, b) => Number(new Date(b.created_at)) - Number(new Date(a.created_at)));
}

export async function addTask(rollNo, title, deadline) {
  const all = await read(KEYS.tasks, []);
  const task = {
    id: `tsk-${Date.now()}`,
    roll_no: rollNo,
    title,
    deadline: deadline || null,
    completed: false,
    created_at: new Date().toISOString(),
  };
  await write(KEYS.tasks, [task, ...all]);
  return task;
}

export async function toggleTask(taskId, completed) {
  const all = await read(KEYS.tasks, []);
  const next = all.map((t) => (t.id === taskId ? { ...t, completed } : t));
  await write(KEYS.tasks, next);
}

export async function getNotifications() {
  const stored = await read(KEYS.notifications, []);
  if (stored.length) return stored;
  const seeded = Array.from({ length: 6 }).map((_, i) => ({
    id: `n-${Date.now()}-${i}`,
    title: ['Placement talk', 'Hackathon reminder', 'Scholarship window', 'Internship shortlist'][i % 4],
    body: `Career update #${i + 1} for your growth plan`,
    created_at: new Date(Date.now() - i * 3600 * 1000).toISOString(),
  }));
  await write(KEYS.notifications, seeded);
  return seeded;
}

export async function pushAutoNotification() {
  const all = await read(KEYS.notifications, []);
  const item = {
    id: `n-${Date.now()}`,
    title: ['New internship posted', 'Project deadline nearing', 'Mentor session starts soon'][rnd(0, 2)],
    body: 'Check FeedX to stay ahead.',
    created_at: new Date().toISOString(),
  };
  await write(KEYS.notifications, [item, ...all].slice(0, 25));
  return item;
}

export async function getOpportunities(branch) {
  await wait(220);
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `opp-${branch}-${i}`,
    title: `${['Internship', 'Apprentice', 'Campus Drive'][i % 3]} ${i + 1}`,
    type: ['Internship', 'Job', 'Event'][i % 3],
    branch,
    company: ['TCS', 'Infosys', 'Zoho', 'Wipro'][i % 4],
    posted_at: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

export async function getNotes(branch) {
  await wait(220);
  return baseSubjects.map((subject, i) => ({
    id: `note-${branch}-${i}`,
    subject,
    title: `${subject} quick revision kit`,
    resource_type: i % 2 ? 'PDF' : 'Link',
  }));
}

export async function getIssues(rollNo) {
  const all = await read(KEYS.issues, []);
  return all.filter((i) => i.roll_no === rollNo);
}

export async function addIssue(rollNo, title, description) {
  const all = await read(KEYS.issues, []);
  const issue = {
    id: `iss-${Date.now()}`,
    roll_no: rollNo,
    title,
    description,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  await write(KEYS.issues, [issue, ...all]);
  return issue;
}

export async function getProfile(rollNo, fallback) {
  const all = await read(KEYS.profile, {});
  return all[rollNo] || fallback;
}

export async function updateProfile(rollNo, profile) {
  const all = await read(KEYS.profile, {});
  all[rollNo] = profile;
  await write(KEYS.profile, all);
  return profile;
}
