function isFieldFilled(val) {
  if (val === null || val === undefined) return false;
  const str = String(val).trim();
  if (str === '' || str.toLowerCase() === 'user' || str === 'PENDING') {
    return false;
  }
  return true;
}

function calculateProfileCompletion(user) {
  if (!user || !user.id) return 0;
  const fields = [
    user.full_name,
    user.phone,
    user.date_of_birth,
    user.gender,
    user.current_status,
    user.branch,
    user.year,
    user.domain,
    user.bio,
    user.college_name,
  ];
  const filledCount = fields.filter(isFieldFilled).length;
  return Math.round((filledCount / fields.length) * 100);
}

function formatDateForDisplay(dateInput) {
  if (!dateInput) return '';
  const str = String(dateInput).trim();
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) return str;
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${d}-${m}-${y}`;
  }
  return str;
}

function formatDateForDB(dateInput) {
  if (!dateInput) return null;
  const str = String(dateInput).trim();
  const ddmmyyyy = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddmmyyyy) {
    const [, d, m, y] = ddmmyyyy;
    return `${y}-${m}-${d}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  return null;
}

function validateDOB(dobStr) {
  if (!dobStr || !dobStr.trim()) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }
  const clean = dobStr.trim();
  const match = clean.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) {
    return { isValid: false, error: 'Please enter a valid date of birth in DD-MM-YYYY format.' };
  }
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  if (month < 1 || month > 12) return { isValid: false, error: 'Please enter a valid date of birth.' };
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return { isValid: false, error: 'Please enter a valid date of birth.' };
  const inputDate = new Date(year, month - 1, day);
  const now = new Date();
  if (inputDate > now) return { isValid: false, error: 'Date of birth cannot be in the future.' };
  if (year < 1950) return { isValid: false, error: 'Please enter a valid date of birth.' };
  return { isValid: true };
}

function normalizeBookmarkParams(typeOrId, idOrType) {
  const KNOWN_TYPES = ['community_post', 'post', 'event', 'opportunity', 'resource', 'innovation', 'college', 'career_role'];
  const t1 = String(typeOrId || '').toLowerCase().trim();
  const t2 = String(idOrType || '').toLowerCase().trim();
  if (KNOWN_TYPES.includes(t1)) {
    return { entityType: t1 === 'post' ? 'community_post' : t1, entityId: idOrType };
  }
  if (KNOWN_TYPES.includes(t2)) {
    return { entityType: t2 === 'post' ? 'community_post' : t2, entityId: typeOrId };
  }
  return { entityType: typeOrId, entityId: idOrType };
}

// Tests
console.log('--- TEST 1: Profile Completion ---');
const completeUser = {
  id: 'usr-123',
  full_name: 'Rahul Sharma',
  phone: '9876543210',
  date_of_birth: '15-08-2005',
  gender: 'Male',
  current_status: 'Student',
  branch: 'CSE',
  year: '2nd Year',
  domain: 'Web Development',
  bio: 'Passionate polytechnic coder',
  college_name: 'Govt Polytechnic Hyderabad'
};
const pct1 = calculateProfileCompletion(completeUser);
console.log('Fully filled user completion:', pct1, '% (Expected: 100%)');
if (pct1 !== 100) throw new Error('Failed complete user test');

const partiallyFilled = {
  id: 'usr-123',
  full_name: 'Rahul',
  phone: '',
  date_of_birth: null,
  gender: 'Male',
  current_status: 'Student',
  branch: 'CSE',
  year: '1st Year',
  domain: '',
  bio: '',
  college_name: 'Govt Polytechnic'
};
const pct2 = calculateProfileCompletion(partiallyFilled);
console.log('Partially filled user completion:', pct2, '% (Expected: 40%)');

console.log('\n--- TEST 2: DOB Display and DB Formatting ---');
const dbDate = '2005-08-15';
const uiDate = formatDateForDisplay(dbDate);
console.log('DB to UI format:', dbDate, '->', uiDate, '(Expected: 15-08-2005)');
if (uiDate !== '15-08-2005') throw new Error('Failed display date format');

const savedDbDate = formatDateForDB(uiDate);
console.log('UI to DB format:', uiDate, '->', savedDbDate, '(Expected: 2005-08-15)');
if (savedDbDate !== '2005-08-15') throw new Error('Failed DB date format');

console.log('\n--- TEST 3: DOB Validation ---');
console.log('Valid date (15-08-2005):', validateDOB('15-08-2005'));
console.log('Future date (15-08-2099):', validateDOB('15-08-2099'));
console.log('Impossible date (31-02-2005):', validateDOB('31-02-2005'));
console.log('Invalid month (15-13-2005):', validateDOB('15-13-2005'));

if (!validateDOB('15-08-2005').isValid) throw new Error('Valid date marked invalid');
if (validateDOB('15-08-2099').isValid) throw new Error('Future date marked valid');
if (validateDOB('31-02-2005').isValid) throw new Error('Feb 31 marked valid');

console.log('\n--- TEST 4: Bookmark Parameter Normalization ---');
const norm1 = normalizeBookmarkParams('community_post', 'post-uuid-123');
console.log('Normal call:', norm1);
const norm2 = normalizeBookmarkParams('post-uuid-123', 'community_post');
console.log('Swapped call:', norm2);
const norm3 = normalizeBookmarkParams('post-uuid-123', 'post');
console.log('Legacy "post" call:', norm3);

if (norm1.entityType !== 'community_post' || norm1.entityId !== 'post-uuid-123') throw new Error('Failed norm1');
if (norm2.entityType !== 'community_post' || norm2.entityId !== 'post-uuid-123') throw new Error('Failed norm2');
if (norm3.entityType !== 'community_post' || norm3.entityId !== 'post-uuid-123') throw new Error('Failed norm3');

console.log('\n ALL TESTS PASSED SUCCESSFULLY! ✨');
