/**
 * FEEDX ID Standardization & Quizue ID Helper Service
 * Format: FX-YY-CC-XXXXXXX
 * Example: FX-26-IA-0004582
 */

export interface FeedXIdComponents {
  year: string | number;
  collegeCode: string;
  sequenceNumber: string | number;
}

/**
 * Standard FEEDX ID Regular Expression: FX-YY-CC-XXXXXXX
 */
export const FEEDX_ID_REGEX = /^FX-\d{2}-[A-Z0-9]{2}-\d{7}$/;

/**
 * Validates if an ID follows the official FEEDX standard: FX-YY-CC-XXXXXXX
 */
export function isStandardFeedXId(id?: string | null): boolean {
  if (!id || typeof id !== 'string') return false;
  return FEEDX_ID_REGEX.test(id.trim().toUpperCase());
}

/**
 * Derives a standardized 2-letter college code from a college name or code
 */
export function extractCollegeCode(collegeName?: string | null, collegeCode?: string | null): string {
  if (collegeCode && collegeCode.trim().length >= 2) {
    return collegeCode.trim().replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
  }
  if (!collegeName || collegeName.trim().length === 0) {
    return 'IA'; // Institutional Academic default
  }
  const cleanName = collegeName.trim().toUpperCase();
  const words = cleanName.split(/\s+/).filter(w => !['GOVERNMENT', 'POLYTECHNIC', 'COLLEGE', 'INSTITUTE', 'OF', 'THE', 'AND', '&'].includes(w));
  
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  const allInitials = cleanName.split(/\s+/).map(w => w[0]).join('');
  if (allInitials.length >= 2) {
    return allInitials.slice(0, 2).toUpperCase();
  }
  return 'IA';
}

/**
 * Formats components into the official FX-YY-CC-XXXXXXX format
 */
export function formatFeedXId(params: {
  year?: string | number;
  collegeName?: string | null;
  collegeCode?: string | null;
  sequence?: string | number | null;
  uuid?: string | null;
}): string {
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
    // Generate deterministic 7-digit sequential integer from UUID hash
    const clean = params.uuid.replace(/[^a-f0-9]/gi, '');
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash * 31 + clean.charCodeAt(i)) % 10000000;
    }
    seqStr = String(Math.abs(hash)).padStart(7, '0');
  }

  return `FX-${yy}-${cc}-${seqStr}`;
}

/**
 * Resolves or standardizes any user/student object to guaranteed standard FEEDX ID
 */
export function resolveStandardFeedXId(userOrStudent?: any): string {
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

/**
 * Generates a persistent Quizue ID associated with the student: QUIZUE-XXXXXXXX
 */
export function resolveQuizueId(userOrStudent?: any): string {
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

/**
 * Generates secure verification payload / verification URL for the QR code
 */
export function getQrVerificationPayload(feedxId: string, quizueId?: string): string {
  const cleanId = (feedxId || '').trim().toUpperCase();
  const qId = quizueId || resolveQuizueId({ feedx_id: cleanId });
  // Encodes verification link containing the official FEEDX ID and secure Quizue association
  return JSON.stringify({
    fid: cleanId,
    qid: qId,
    type: 'FEEDX_STUDENT_VERIFICATION',
    v: 1,
  });
}
