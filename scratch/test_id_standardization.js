/**
 * Verification test for FEEDX ID Standardization & QR Digital ID
 */
const FEEDX_ID_REGEX = /^FX-\d{2}-[A-Z0-9]{2}-\d{7}$/;

function isStandardFeedXId(id) {
  if (!id || typeof id !== 'string') return false;
  return FEEDX_ID_REGEX.test(id.trim().toUpperCase());
}

function extractCollegeCode(collegeName, collegeCode) {
  if (collegeCode && collegeCode.trim().length >= 2) {
    return collegeCode.trim().replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
  }
  if (!collegeName || collegeName.trim().length === 0) {
    return 'IA';
  }
  const cleanName = collegeName.trim().toUpperCase();
  const words = cleanName.split(/\s+/).filter(w => !['GOVERNMENT', 'POLYTECHNIC', 'COLLEGE', 'INSTITUTE', 'OF', 'THE', 'AND', '&'].includes(w));
  
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return 'IA';
}

function formatFeedXId(params) {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const yy = String(params.year || currentYear).padStart(2, '0').slice(-2);
  const cc = extractCollegeCode(params.collegeName, params.collegeCode);

  let seqStr = '0000001';
  if (params.sequence !== undefined && params.sequence !== null) {
    const num = parseInt(String(params.sequence).replace(/\D/g, ''), 10);
    if (!isNaN(num)) {
      seqStr = String(num).padStart(7, '0').slice(-7);
    }
  } else if (params.uuid) {
    const clean = params.uuid.replace(/[^a-f0-9]/gi, '');
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash * 31 + clean.charCodeAt(i)) % 10000000;
    }
    seqStr = String(Math.abs(hash)).padStart(7, '0');
  }

  return `FX-${yy}-${cc}-${seqStr}`;
}

function resolveStandardFeedXId(userOrStudent) {
  if (!userOrStudent) return 'FX-26-IA-0004582';

  const existing = userOrStudent.feedx_id || userOrStudent.student_id;
  if (isStandardFeedXId(existing)) {
    return existing.trim().toUpperCase();
  }

  const roll = userOrStudent.roll_no || userOrStudent.roll_number;
  const college = userOrStudent.college_name || userOrStudent.colleges?.college_name;
  const collegeCode = userOrStudent.college_code;
  const uuid = userOrStudent.id || userOrStudent.user_id || '00000000';

  let yearVal = '26';
  if (roll) {
    const rollDigits = String(roll).match(/^(\d{2})/);
    if (rollDigits && rollDigits[1]) {
      yearVal = rollDigits[1];
    }
  }

  return formatFeedXId({
    year: yearVal,
    collegeName: college,
    collegeCode,
    uuid,
  });
}

function resolveQuizueId(userOrStudent) {
  if (userOrStudent?.quizue_id) {
    return userOrStudent.quizue_id.trim().toUpperCase();
  }

  const seed = userOrStudent?.feedx_id || userOrStudent?.id || 'QUIZUE_DEFAULT';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33 + seed.charCodeAt(i)) % 100000000;
  }
  const code = String(Math.abs(hash)).padStart(8, '0');
  return `QUIZUE-${code}`;
}

function getQrVerificationPayload(feedxId, quizueId) {
  const cleanId = (feedxId || '').trim().toUpperCase();
  const qId = quizueId || resolveQuizueId({ feedx_id: cleanId });
  return JSON.stringify({
    fid: cleanId,
    qid: qId,
    type: 'FEEDX_STUDENT_VERIFICATION',
    v: 1,
  });
}

function runTests() {
  console.log('--- Starting FEEDX ID Standardization Tests ---');

  // Test 1: Regex & Validation
  const validId = 'FX-26-IA-0004582';
  if (!isStandardFeedXId(validId)) {
    throw new Error(`Test 1 Failed: ${validId} should be valid standard FEEDX ID`);
  }
  console.log('✓ Test 1 Passed: Validated FX-26-IA-0004582');

  // Test 2: Formatting from parameters
  const formatted = formatFeedXId({
    year: '26',
    collegeName: 'Hyderabad Academy',
    sequence: 4582,
  });
  if (!isStandardFeedXId(formatted)) {
    throw new Error(`Test 2 Failed: ${formatted} does not match FEEDX ID standard`);
  }
  console.log('✓ Test 2 Passed: formatFeedXId output valid ->', formatted);

  // Test 3: Resolving user without existing ID
  const testUser = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    full_name: 'Bhanu Prasad',
    roll_no: '26001-CSE-042',
    college_name: 'Inst of Academic',
  };
  const resolvedId = resolveStandardFeedXId(testUser);
  if (!isStandardFeedXId(resolvedId)) {
    throw new Error(`Test 3 Failed: Resolved ID ${resolvedId} is invalid`);
  }
  console.log('✓ Test 3 Passed: Resolved user ID ->', resolvedId);

  // Test 4: Persistent Quizue ID
  const quizueId = resolveQuizueId(testUser);
  if (!quizueId.startsWith('QUIZUE-') || quizueId.length !== 15) {
    throw new Error(`Test 4 Failed: Quizue ID ${quizueId} invalid`);
  }
  console.log('✓ Test 4 Passed: Quizue ID ->', quizueId);

  // Test 5: QR verification payload without sensitive info
  const payload = getQrVerificationPayload(resolvedId, quizueId);
  const parsed = JSON.parse(payload);
  if (parsed.fid !== resolvedId || parsed.qid !== quizueId) {
    throw new Error(`Test 5 Failed: QR payload missing fid/qid`);
  }
  if (payload.includes('phone') || payload.includes('email') || payload.includes('aadhaar')) {
    throw new Error(`Test 5 Failed: QR payload contains sensitive info`);
  }
  console.log('✓ Test 5 Passed: QR Verification payload secured ->', payload);

  console.log('--- All FEEDX ID Standardization tests passed successfully! ---');
}

runTests();
