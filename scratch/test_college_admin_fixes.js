/**
 * FEEDX - Automated College Admin Integrity & Data Isolation Verification Suite
 * Verifies:
 * 1. Campus Events page structure, segmented tabs, and 4-card organization.
 * 2. Manage Students query schema adherence and college scoping.
 * 3. Command Deck metric scoping and elimination of null-college data leaks.
 * 4. Support Desk role-based isolation (issues, suggestions, feedbacks).
 * 5. Broadcast Hub alignment and payload scoping.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('FEEDX COLLEGE ADMIN INTEGRITY & ROLE ISOLATION TEST SUITE');
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

// 1. Campus Events Page Structure
runTest('Campus Events - Has segmented tabs and structured 4-section form', () => {
  const filePath = path.join(__dirname, '..', 'app', '(tabs)', 'admin', 'events.tsx');
  const code = fs.readFileSync(filePath, 'utf8');

  assert.ok(code.includes("const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')"), 'Must have activeTab state');
  assert.ok(code.includes('Published ({items.length})'), 'Must show published events tab with count');
  assert.ok(code.includes('EVENT IDENTITY & DETAILS'), 'Must have Section 1: Event Identity');
  assert.ok(code.includes('DATE, TIME & VENUE'), 'Must have Section 2: Date, Time & Venue');
  assert.ok(code.includes('CAPACITY & REGISTRATION FEE'), 'Must have Section 3: Capacity & Fee');
  assert.ok(code.includes('REGISTRATION & CERTIFICATION RULES'), 'Must have Section 4: Registration & Certificate');
  assert.ok(code.includes('twoColumnGrid'), 'Must use clean two-column grid instead of squished 4-input row');
  assert.ok(code.includes('effectiveCollegeId'), 'Must resolve effectiveCollegeId for campus isolation');
});

// 2. Manage Students Query Adherence & College Scoping
runTest('Manage Students - Queries valid users columns and enforces effectiveCollegeId', () => {
  const filePath = path.join(__dirname, '..', 'app', '(tabs)', 'admin', 'students.tsx');
  const code = fs.readFileSync(filePath, 'utf8');

  // Must NOT select non-existent columns from users table
  const usersSelectBlock = code.slice(code.indexOf(".from('users')"), code.indexOf(".from('students')"));
  assert.ok(!usersSelectBlock.includes('roll_number,'), 'users table query must not select non-existent roll_number');
  assert.ok(!usersSelectBlock.includes('academic_year,'), 'users table query must not select non-existent academic_year');
  assert.ok(!usersSelectBlock.includes('section,'), 'users table query must not select non-existent section');
  assert.ok(!usersSelectBlock.includes('cgpa,'), 'users table query must not select non-existent cgpa');
  assert.ok(!usersSelectBlock.includes('college_name,'), 'users table query must not select non-existent college_name');

  // Must have effectiveCollegeId fallback
  assert.ok(code.includes('effectiveCollegeId'), 'Must define effectiveCollegeId');
  assert.ok(code.includes("'6dd12d63-e276-4ff8-8e58-bcd2cc878626'"), 'Must fallback to primary campus when college_id is unset');
});

// 3. Command Deck Data Scoping
runTest('Command Deck - Prevents college_id.is.null data leaks and isolates metrics', () => {
  const filePath = path.join(__dirname, '..', 'app', '(tabs)', 'admin', 'index.tsx');
  const code = fs.readFileSync(filePath, 'utf8');

  assert.ok(code.includes('effectiveCollegeId'), 'Command deck must resolve effectiveCollegeId');
  assert.ok(!code.includes('college_id.is.null'), 'Command deck must not allow college_id.is.null data leakage');
  assert.ok(code.includes("from('events')"), 'Command deck must query events table for campus events');
});

// 4. Support Desk Role-Based Isolation
runTest('Support Desk - Strictly scopes grievances, suggestions, and feedback to college', () => {
  const filePath = path.join(__dirname, '..', 'app', 'admin-issues.tsx');
  const code = fs.readFileSync(filePath, 'utf8');

  assert.ok(code.includes('effectiveCollegeId'), 'Support Desk must resolve effectiveCollegeId');
  assert.ok(code.includes("suggQuery = suggQuery.eq('college_id', effectiveCollegeId)"), 'Suggestions must be strictly filtered by college_id');
  assert.ok(code.includes("fbQuery = fbQuery.eq('college_id', effectiveCollegeId)"), 'Feedback must be strictly filtered by college_id');
  assert.ok(!code.includes("suggQuery.or(`college_id.eq."), 'Must not use loose OR filter with null on suggestions');
});

// 5. Broadcast Hub Alignment & Scoping
runTest('Broadcast Hub - Enforces effectiveCollegeId and properly aligns labels & badges', () => {
  const filePath = path.join(__dirname, '..', 'app', '(tabs)', 'admin', 'notifications.tsx');
  const code = fs.readFileSync(filePath, 'utf8');

  assert.ok(code.includes('effectiveCollegeId'), 'Broadcast hub must resolve effectiveCollegeId');
  assert.ok(code.includes('numberOfLines={1}'), 'Must truncate target audience text to prevent wrapping');
  assert.ok(code.includes("maxWidth: '65%'"), 'Target audience pill must have maxWidth');
});

// 6. enrichUser in supabaseService
runTest('Backend Service - enrichUser defaults admin college_id to avoid broken sessions', () => {
  const filePath = path.join(__dirname, '..', 'services', 'supabaseService.js');
  const code = fs.readFileSync(filePath, 'utf8');

  assert.ok(code.includes("isAdminRole && finalRole !== 'super_admin' && !effectiveCollegeId"), 'enrichUser must handle unset admin college_id');
  assert.ok(code.includes("'6dd12d63-e276-4ff8-8e58-bcd2cc878626'"), 'enrichUser must assign primary campus to admins');
});

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
