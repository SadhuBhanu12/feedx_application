/**
 * FEEDX Centralized Student Profile Utilities
 * Single source of truth for profile completion calculation, Date of Birth formatting and validation.
 */

export interface ProfileUser {
  full_name?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  current_status?: string | null;
  branch?: string | null;
  year?: string | null;
  domain?: string | null;
  bio?: string | null;
  college_name?: string | null;
  [key: string]: any;
}

/**
 * Checks if a string value is considered filled/meaningful for a student profile.
 */
export function isFieldFilled(val: any): boolean {
  if (val === null || val === undefined) return false;
  const str = String(val).trim();
  if (str === '' || str.toLowerCase() === 'user' || str === 'PENDING') {
    return false;
  }
  return true;
}

/**
 * Authoritative Profile Completion Percentage (0 - 100)
 * Calculated strictly from real student profile fields.
 */
export function calculateProfileCompletion(user: ProfileUser | null | undefined): number {
  if (!user || !user.id) return 0;

  const coreFields = [
    user.full_name,
    user.phone,
    user.date_of_birth || user.dob,
    user.gender,
    user.branch || user.branches?.branch_name,
    user.year || user.academic_years?.year_name,
    user.college_name || user.colleges?.college_name,
  ];

  const optionalFields = [
    user.current_status,
    user.domain,
    user.bio,
    user.avatar_url || user.profile_image || user.avatar,
  ];

  const coreFilled = coreFields.filter(isFieldFilled).length;
  const optionalFilled = optionalFields.filter(isFieldFilled).length;

  if (coreFilled >= coreFields.length) {
    return 100;
  }

  const basePct = (coreFilled / coreFields.length) * 85;
  const optBonus = (optionalFilled / optionalFields.length) * 15;
  return Math.min(100, Math.round(basePct + optBonus));
}

/**
 * Normalizes any valid date string or Date object into DD-MM-YYYY format for UI presentation.
 */
export function formatDateForDisplay(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';

  if (dateInput instanceof Date) {
    if (isNaN(dateInput.getTime())) return '';
    const d = String(dateInput.getDate()).padStart(2, '0');
    const m = String(dateInput.getMonth() + 1).padStart(2, '0');
    const y = dateInput.getFullYear();
    return `${d}-${m}-${y}`;
  }

  const str = String(dateInput).trim();
  if (!str) return '';

  // Case 1: Already DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    return str;
  }

  // Case 2: YYYY-MM-DD or ISO String (e.g. 2004-05-15 or 2004-05-15T00:00:00Z)
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${d}-${m}-${y}`;
  }

  // Case 3: DD/MM/YYYY
  const slashMatch = str.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (slashMatch) {
    const [, d, m, y] = slashMatch;
    return `${d}-${m}-${y}`;
  }

  // Fallback Date parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const d = String(parsed.getDate()).padStart(2, '0');
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const y = parsed.getFullYear();
    return `${d}-${m}-${y}`;
  }

  return str;
}

/**
 * Converts user input (DD-MM-YYYY) into PostgreSQL DATE format (YYYY-MM-DD).
 */
export function formatDateForDB(dateInput: string | Date | null | undefined): string | null {
  if (!dateInput) return null;

  if (dateInput instanceof Date) {
    if (isNaN(dateInput.getTime())) return null;
    const y = dateInput.getFullYear();
    const m = String(dateInput.getMonth() + 1).padStart(2, '0');
    const d = String(dateInput.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const str = String(dateInput).trim();
  if (!str) return null;

  // DD-MM-YYYY -> YYYY-MM-DD
  const ddmmyyyy = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddmmyyyy) {
    const [, d, m, y] = ddmmyyyy;
    return `${y}-${m}-${d}`;
  }

  // DD/MM/YYYY -> YYYY-MM-DD
  const slashMatch = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    const [, d, m, y] = slashMatch;
    return `${y}-${m}-${d}`;
  }

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // ISO string
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return isoMatch[0];
  }

  return null;
}

/**
 * Comprehensive Date of Birth Validation
 * Prevents impossible future dates, minimum year 1950, and checks valid day/month.
 */
export function validateDOB(dobStr: string | null | undefined): { isValid: boolean; error?: string } {
  if (!dobStr || !dobStr.trim()) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }

  const clean = dobStr.trim();
  const pattern = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = clean.match(pattern);

  if (!match) {
    return {
      isValid: false,
      error: 'Please enter a valid date of birth in DD-MM-YYYY format (e.g. 15-08-2005).',
    };
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }

  // Check days per month (including leap years)
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }

  const inputDate = new Date(year, month - 1, day);
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  if (inputDate > now) {
    return { isValid: false, error: 'Date of birth cannot be in the future.' };
  }

  if (year < 1950) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }

  // Student must be at least 10 years old
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 10);
  if (inputDate > minAgeDate) {
    return { isValid: false, error: 'Please enter a valid date of birth for a polytechnic student.' };
  }

  return { isValid: true };
}
