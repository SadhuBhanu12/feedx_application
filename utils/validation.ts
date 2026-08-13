/**
 * Centralized Form Validation & Input Sanitization Engine for FeedX
 */

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface PasswordValidationResult extends ValidationResult {
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

/**
 * Strips dangerous HTML/script tags and trims excess whitespace
 */
export function sanitizeInput(input: string | any): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Required field validation
 */
export function validateRequired(value: any, fieldName: string = 'This field'): ValidationResult {
  const sanitized = typeof value === 'string' ? value.trim() : value;
  if (sanitized === null || sanitized === undefined || sanitized === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: null };
}

/**
 * Character length validation
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string = 'Field'
): ValidationResult {
  const str = (value || '').trim();
  if (str.length < min) {
    return { isValid: false, error: `${fieldName} must contain minimum ${min} characters` };
  }
  if (str.length > max) {
    return { isValid: false, error: `${fieldName} cannot exceed ${max} characters` };
  }
  return { isValid: true, error: null };
}

/**
 * Text field validation (disallows empty spaces, single chars unless allowed, numbers/symbols only)
 */
export function validateText(
  value: string,
  options: {
    min?: number;
    max?: number;
    fieldName?: string;
    disallowNumbersOnly?: boolean;
    disallowSymbolsOnly?: boolean;
  } = {}
): ValidationResult {
  const {
    min = 2,
    max = 500,
    fieldName = 'Field',
    disallowNumbersOnly = false,
    disallowSymbolsOnly = true,
  } = options;

  const sanitized = sanitizeInput(value);

  if (!sanitized) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (sanitized.length < min) {
    return { isValid: false, error: `${fieldName} must contain minimum ${min} characters` };
  }

  if (sanitized.length > max) {
    return { isValid: false, error: `${fieldName} cannot exceed ${max} characters` };
  }

  if (disallowNumbersOnly && /^\d+$/.test(sanitized)) {
    return { isValid: false, error: `${fieldName} cannot contain only numbers` };
  }

  // Reject repeating punctuation or symbols like ".....", "!!!!", "???", etc.
  if (disallowSymbolsOnly && /^[^a-zA-Z0-9\s]+$/.test(sanitized)) {
    return { isValid: false, error: `${fieldName} cannot contain only special characters or punctuation` };
  }

  // Emoji only detection (Unicode regex for emojis without alphanumeric characters)
  const containsLettersOrNumbers = /[a-zA-Z0-9]/.test(sanitized);
  if (!containsLettersOrNumbers) {
    return { isValid: false, error: `${fieldName} must contain valid text, not just symbols or emojis` };
  }

  return { isValid: true, error: null };
}

/**
 * Validates Google Drive or Image URLs
 */
export function validateGoogleDriveOrImageUrl(url: string, fieldName: string = 'Supporting Document'): ValidationResult {
  const cleanUrl = (url || '').trim();
  if (!cleanUrl) {
    return { isValid: false, error: `${fieldName} URL is required` };
  }

  const isUrlValid = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(cleanUrl);
  if (!isUrlValid) {
    return { isValid: false, error: `Invalid URL format for ${fieldName}` };
  }

  const isDrive = /drive\.google\.com|docs\.google\.com/i.test(cleanUrl);
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(cleanUrl) || /imgur|cloudinary|postimg|i\.ibb\.co/i.test(cleanUrl);

  if (!isDrive && !isImage) {
    return { isValid: false, error: `${fieldName} must be a valid Google Drive link or image URL` };
  }

  return { isValid: true, error: null };
}

/**
 * Validates Prototype URLs (GitHub, YouTube, or general website)
 */
export function validatePrototypeUrl(url: string, fieldName: string = 'Prototype Link'): ValidationResult {
  const cleanUrl = (url || '').trim();
  if (!cleanUrl) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const isUrlValid = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(cleanUrl);
  if (!isUrlValid) {
    return { isValid: false, error: `Invalid URL` };
  }

  const isGithub = /github\.com/i.test(cleanUrl);
  const isYoutube = /youtube\.com|youtu\.be/i.test(cleanUrl);
  const isWebsite = /^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+/i.test(cleanUrl);

  if (!isGithub && !isYoutube && !isWebsite) {
    return { isValid: false, error: `Invalid URL` };
  }

  return { isValid: true, error: null };
}

/**
 * Attendance decimal percentage validation
 */
export function validateAttendance(pct: number | string): ValidationResult {
  const strVal = String(pct ?? '').trim();
  if (!strVal) {
    return { isValid: false, error: 'Attendance percentage is required' };
  }

  const num = parseFloat(strVal);
  if (isNaN(num)) {
    return { isValid: false, error: 'Attendance must be a valid number' };
  }

  if (num < 0 || num > 100) {
    return { isValid: false, error: 'Attendance must be between 0% and 100%' };
  }

  return { isValid: true, error: null };
}

/**
 * Email format validation according to role
 */
export function validateEmail(email: string, role?: string): ValidationResult {
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    return { isValid: false, error: 'Email address is required' };
  }

  if (cleanEmail.includes(' ')) {
    return { isValid: false, error: 'Email address cannot contain spaces' };
  }

  // Strict email standard regex (prevents user@, user@gmail, @gmail.com, user.com)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: 'Enter a valid email address (e.g., student@college.edu)' };
  }

  if (role === 'admin' || role === 'inst_admin' || role === 'super_admin') {
    if (cleanEmail.endsWith('@test.com') && process.env.NODE_ENV === 'production') {
      return { isValid: false, error: 'Please use a valid institutional admin email domain' };
    }
  }

  return { isValid: true, error: null };
}

/**
 * Phone number validation (Indian numbers: exactly 10 digits starting with 6,7,8,9)
 */
export function validatePhone(phone: string): ValidationResult {
  const cleanPhone = (phone || '').trim();

  if (!cleanPhone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  if (/[^\d]/.test(cleanPhone)) {
    return { isValid: false, error: 'Phone number must contain numbers only' };
  }

  if (cleanPhone.length !== 10) {
    return { isValid: false, error: 'Phone number must contain exactly 10 digits' };
  }

  if (!/^[6-9]/.test(cleanPhone)) {
    return { isValid: false, error: 'Phone number must start with 6, 7, 8, or 9' };
  }

  return { isValid: true, error: null };
}

/**
 * Student Roll Number validation (prevents phone numbers, emails, random short text)
 */
export function validateRollNumber(rollNumber: string): ValidationResult {
  const cleanRoll = (rollNumber || '').trim().toUpperCase();

  if (!cleanRoll) {
    return { isValid: false, error: 'Roll number is required' };
  }

  // Reject if user entered an email
  if (cleanRoll.includes('@')) {
    return { isValid: false, error: 'Roll number format is incorrect. Do not enter email address' };
  }

  // Reject if user entered a 10-digit Indian phone number starting with 6-9
  if (/^[6-9]\d{9}$/.test(cleanRoll)) {
    return { isValid: false, error: 'Roll number format is incorrect. Do not enter phone number' };
  }

  // Reject overly short or random invalid inputs
  if (cleanRoll.length < 4 || cleanRoll.length > 20) {
    return { isValid: false, error: 'Roll number must be between 4 and 20 characters' };
  }

  // College Roll pattern matching: alphanumeric with optional hyphens/slashes (e.g. 23001A0501, 23XXXXXX)
  const rollRegex = /^[A-Z0-9\-\/]{4,20}$/;
  if (!rollRegex.test(cleanRoll)) {
    return { isValid: false, error: 'Roll number must contain valid college alphanumeric format' };
  }

  return { isValid: true, error: null };
}

/**
 * General Numeric Range Validation
 */
export function validateNumberRange(
  value: number | string,
  min: number,
  max: number,
  fieldName: string = 'Value'
): ValidationResult {
  const strVal = String(value ?? '').trim();
  if (!strVal) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const num = parseFloat(strVal);
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (num < min) {
    return { isValid: false, error: `${fieldName} cannot be less than ${min}` };
  }

  if (num > max) {
    return { isValid: false, error: `${fieldName} cannot be greater than ${max}` };
  }

  return { isValid: true, error: null };
}

export function validateCGPA(cgpa: number | string): ValidationResult {
  return validateNumberRange(cgpa, 0, 10, 'CGPA');
}

export function validatePercentage(pct: number | string): ValidationResult {
  return validateNumberRange(pct, 0, 100, 'Percentage');
}

export function validateAge(age: number | string): ValidationResult {
  return validateNumberRange(age, 15, 100, 'Age');
}

export function validateExperience(exp: number | string): ValidationResult {
  return validateNumberRange(exp, 0, 70, 'Experience');
}

/**
 * Dropdown / Select Validation
 */
export function validateSelect(
  value: string,
  fieldName: string = 'Option',
  invalidValues: string[] = ['', 'Select', 'Select...', 'All', 'Choose', 'None']
): ValidationResult {
  const cleanVal = (value || '').trim();
  if (!cleanVal || invalidValues.some(inv => inv.toLowerCase() === cleanVal.toLowerCase())) {
    return { isValid: false, error: `Please select a valid ${fieldName.toLowerCase()}` };
  }
  return { isValid: true, error: null };
}

/**
 * File Upload Validation (Images & Documents)
 */
export function validateFileUpload(
  file: { name?: string; size?: number; type?: string; mimeType?: string } | null,
  allowedExtensions: string[],
  maxSizeMB: number = 5
): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'Please select a file to upload' };
  }

  const fileName = file.name || '';
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (allowedExtensions.length > 0 && (!ext || !allowedExtensions.map(e => e.toLowerCase()).includes(ext))) {
    return {
      isValid: false,
      error: `Invalid file format. Allowed formats: ${allowedExtensions.join(', ').toUpperCase()}`,
    };
  }

  if (file.size && file.size > maxSizeMB * 1024 * 1024) {
    return {
      isValid: false,
      error: `File size exceeds limit of ${maxSizeMB} MB`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Password Rules Validation
 * Must contain min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
export function validatePassword(password: string = ''): PasswordValidationResult {
  const p = password || '';
  const checks = {
    length: p.length >= 8,
    uppercase: /[A-Z]/.test(p),
    lowercase: /[a-z]/.test(p),
    number: /[0-9]/.test(p),
    special: /[^A-Za-z0-9]/.test(p),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;
  const isValid = passedCount === 5;

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (passedCount === 5) strength = 'strong';
  else if (passedCount >= 3) strength = 'medium';

  let error: string | null = null;
  if (!checks.length) error = 'Password must be at least 8 characters long';
  else if (!checks.uppercase) error = 'Password must include at least one uppercase letter';
  else if (!checks.lowercase) error = 'Password must include at least one lowercase letter';
  else if (!checks.number) error = 'Password must include at least one number';
  else if (!checks.special) error = 'Password must include at least one special character';

  return {
    isValid,
    error,
    checks,
    strength,
    score: passedCount,
  };
}

export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true, error: null };
}

/**
 * Innovation Hub Preset Field Validation matching explicit prompt limits
 */
export const INNOVATION_VALIDATION = {
  title: (val: string) =>
    validateText(val, {
      min: 10,
      max: 100,
      fieldName: 'Idea Title',
      disallowNumbersOnly: true,
      disallowSymbolsOnly: true,
    }),

  problemStatement: (val: string) =>
    validateText(val, {
      min: 30,
      max: 500,
      fieldName: 'Problem Statement',
    }),

  proposedSolution: (val: string) =>
    validateText(val, {
      min: 30,
      max: 500,
      fieldName: 'Solution',
    }),

  detailedDescription: (val: string) =>
    validateText(val, {
      min: 100,
      max: 2000,
      fieldName: 'Detailed Description',
    }),

  description: (val: string) =>
    validateText(val, {
      min: 100,
      max: 2000,
      fieldName: 'Detailed Description',
    }),

  expectedImpact: (val: string) =>
    validateText(val, {
      min: 20,
      max: 500,
      fieldName: 'Expected Impact',
    }),

  teamMembers: (val: string | any[]) => {
    const list = Array.isArray(val) ? val : (val || '').split(',').map(s => s.trim()).filter(Boolean);
    if (list.length > 10) return { isValid: false, error: 'Maximum 10 team members allowed' };
    return { isValid: true, error: null };
  },

  techStack: (val: string | any[]) => {
    const list = Array.isArray(val) ? val : (val || '').split(',').map(s => s.trim()).filter(Boolean);
    if (list.length > 10) return { isValid: false, error: 'Maximum 10 technology items allowed' };
    return { isValid: true, error: null };
  },

  supportingDoc: (url: string) => validateGoogleDriveOrImageUrl(url, 'Supporting Document'),
  prototypeLink: (url: string) => validatePrototypeUrl(url, 'Prototype Link'),
};


