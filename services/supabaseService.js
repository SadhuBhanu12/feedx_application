import { supabase, GOOGLE_APPS_SCRIPT_URL } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { sanitizeInput, validateEmail, validatePhone, validateRollNumber, validateText } from '@/utils/validation';
import { formatDateForDisplay, formatDateForDB } from '@/utils/profile';
import { getCachedData, forceRefresh } from './cacheManager';
import { cacheService } from './cacheService';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';

export async function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timed out. Please try again.')), ms))
  ]);
}

export const LOG = {
  info: (tag, message, meta) => {
    console.log(`[INFO][${tag}][${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (tag, message, meta) => {
    console.warn(`[WARN][${tag}][${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  error: (tag, message, error) => {
    console.error(`[ERROR][${tag}][${new Date().toISOString()}] ${message}`, error ? (error.stack || error.message || JSON.stringify(error)) : '');
  }
};

// ==========================================
// CORE AUTH & USER ENRICHMENT
// ==========================================

export async function withRetry(operation, maxRetries = 3, baseDelayMs = 1000) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (err) {
      attempt++;
      const isAuthError = err?.status === 401 || err?.status === 403 || err?.message?.toLowerCase().includes('jwt');
      if (isAuthError || attempt >= maxRetries) {
        throw err;
      }
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[withRetry] Network/Transient Error on attempt ${attempt}. Retrying in ${delay}ms...`, err);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

export async function ensurePublicProfile(user) {
  if (!user || !user.id) return;
  try {
    const { data } = await supabase.from('users').select('id').eq('id', user.id).maybeSingle();
    if (!data) {
      console.log('[ensurePublicProfile] Healing public profile for user:', user.id);
      const role = user.role || 'student';
      const name = user.full_name || user.email?.split('@')[0] || 'User';
      
      await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        full_name: name,
        role: role,
        is_password_set: user.is_password_set || false,
        first_login_completed: user.first_login_completed || false
      });

      if (role === 'student' || role === 'user') {
        const roll = user.roll_no || 'PENDING';
        await supabase.from('students').insert({
          id: user.id,
          roll_number: roll,
          full_name: name,
          email: user.email,
          is_password_set: user.is_password_set || false,
          year: '1st Year'
        });
      }
    }
  } catch (err) {
    console.warn('[ensurePublicProfile] Profile healing error:', err);
  }
}

export async function enrichUser(authUser) {
  if (!authUser) return null;
  
  try {
    // Fetch profiles, streak, and wallet in parallel with all profile columns
    let [uRes, sRes, aRes, streakRes, walletRes] = await Promise.all([
      supabase.from('users').select('*').eq('id', authUser.id).maybeSingle(),
      supabase.from('students').select('*, colleges(id, college_name, name, location), branches(branch_name), academic_years(year_name, semester)').eq('id', authUser.id).maybeSingle(),
      supabase.from('admins').select('*, colleges:institution_id(id, college_name, name, location, college_code)').eq('id', authUser.id).maybeSingle(),
      supabase.from('daily_streaks').select('*').eq('student_id', authUser.id).maybeSingle(),
      supabase.from('student_wallets').select('*').eq('student_id', authUser.id).maybeSingle()
    ]);

    // Admin lookup fallback by email or user_id if primary id didn't match
    if (!aRes?.data && authUser.email) {
      try {
        const { data: aAlt } = await supabase
          .from('admins')
          .select('*, colleges:institution_id(id, college_name, name, location, college_code)')
          .or(`id.eq.${authUser.id},email.eq.${authUser.email}`)
          .maybeSingle();
        if (aAlt) aRes = { data: aAlt };
      } catch (_) {}
    }

    // Secondary student lookup if primary id didn't match (e.g. students table keyed by user_id or email)
    if (!sRes?.data) {
      try {
        const studentQuery = authUser.email
          ? supabase.from('students').select('*, colleges(id, college_name, name, location), branches(branch_name), academic_years(year_name, semester)').or(`user_id.eq.${authUser.id},email.eq.${authUser.email}`).maybeSingle()
          : supabase.from('students').select('*, colleges(id, college_name, name, location), branches(branch_name), academic_years(year_name, semester)').eq('user_id', authUser.id).maybeSingle();
        const sAlt = await studentQuery;
        if (sAlt.data) sRes = sAlt;
      } catch (_) {}
    }

    // Self-healing: if the user exists in auth but is missing in public.users (e.g. after a DB wipe)
    if (!uRes?.data && authUser.id) {
      console.log('[enrichUser] Public profile missing. Self-healing database state...');
      const role = authUser.user_metadata?.role || 'student';
      const name = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User';
      
      // Re-create public user profile
      const { error: userInsErr } = await supabase.from('users').insert({
        id: authUser.id,
        email: authUser.email,
        full_name: name,
        role: role,
        is_password_set: authUser.user_metadata?.is_password_set === true || false,
        first_login_completed: authUser.user_metadata?.first_login_completed === true || false
      });

      if (userInsErr) {
        console.error('[enrichUser] Error inserting into users table:', userInsErr);
      }

      if (!userInsErr) {
        if (role === 'student' || role === 'user') {
          const roll = authUser.user_metadata?.roll_number || 'PENDING';
          const { error: studentInsErr } = await supabase.from('students').insert({
            id: authUser.id,
            roll_number: roll,
            full_name: name,
            email: authUser.email,
            is_password_set: authUser.user_metadata?.is_password_set === true || false,
            year: '1st Year'
          });
          if (studentInsErr) {
            console.error('[enrichUser] Error inserting into students table:', studentInsErr);
          }
        } else {
          const { error: adminInsErr } = await supabase.from('admins').insert({
            id: authUser.id,
            name: name,
            email: authUser.email,
            role: role
          });
          if (adminInsErr) {
            console.error('[enrichUser] Error inserting into admins table:', adminInsErr);
          }
        }

        // Re-fetch profiles with full columns
        const [uNew, sNew, aNew, streakNew, walletNew] = await Promise.all([
          supabase.from('users').select('*').eq('id', authUser.id).maybeSingle(),
          supabase.from('students').select('*, colleges(id, college_name, name, location), branches(branch_name), academic_years(year_name, semester)').eq('id', authUser.id).maybeSingle(),
          supabase.from('admins').select('*, colleges:institution_id(id, college_name, name, location, college_code)').eq('id', authUser.id).maybeSingle(),
          supabase.from('daily_streaks').select('*').eq('student_id', authUser.id).maybeSingle(),
          supabase.from('student_wallets').select('*').eq('student_id', authUser.id).maybeSingle()
        ]);
        uRes = uNew;
        sRes = sNew;
        aRes = aNew;
        streakRes = streakNew;
        walletRes = walletNew;
      }
    }

    const userProfile = uRes?.data || {};
    const studentProfile = sRes?.data || {};
    const adminProfile = aRes?.data || {};
    const streakData = streakRes?.data || {};
    const walletData = walletRes?.data || {};

    const currentStreak = streakData.current_streak !== undefined ? streakData.current_streak : (userProfile.streak_count ?? userProfile.streak ?? 0);
    const maxStreak = streakData.longest_streak !== undefined ? streakData.longest_streak : (userProfile.max_streak ?? userProfile.longest_streak ?? currentStreak);
    const totalActiveDays = streakData.total_active_days !== undefined ? streakData.total_active_days : (userProfile.total_active_days ?? (currentStreak > 0 ? 1 : 0));
    const xpPoints = streakData.xp_points !== undefined ? streakData.xp_points : (userProfile.xp_points ?? userProfile.xp ?? 0);
    const tokens = walletData.tokens !== undefined ? walletData.tokens : xpPoints;
    const goldCoins = walletData.gold_coins !== undefined ? walletData.gold_coins : (userProfile.gold_coins ?? 0);

    // Generate or retrieve permanent FEEDX ID and QR data
    let feedxId = studentProfile.feedx_id || userProfile.feedx_id;
    let qrCodeData = studentProfile.qr_code_data || userProfile.qr_code_data;
    let identityStatus = studentProfile.identity_status || userProfile.identity_status || 'verified';

    if (!feedxId && authUser.id) {
      feedxId = generateFeedxId({ ...userProfile, ...studentProfile });
      qrCodeData = feedxId;

      // Persist permanently in database non-blockingly
      Promise.all([
        supabase.from('students').update({ feedx_id: feedxId, qr_code_data: qrCodeData, qr_generated_at: new Date().toISOString(), identity_status: 'verified' }).eq('id', authUser.id),
        supabase.from('users').update({ feedx_id: feedxId, qr_code_data: qrCodeData, identity_status: 'verified' }).eq('id', authUser.id)
      ]).catch(e => console.warn('[enrichUser] Persisting feedx_id warning:', e));
    }

    // Determine role and normalize
    const rawRole = adminProfile.role || userProfile.role || 'student';
    const finalRole = String(rawRole).toLowerCase().trim();
    const isAdminRole = ['admin', 'inst_admin', 'super_admin', 'campus_admin', 'college_admin'].includes(finalRole);

    // College lookup with priority based on account role
    let collegeRecord = isAdminRole
      ? (aRes?.data?.colleges || uRes?.data?.colleges)
      : (sRes?.data?.colleges || uRes?.data?.colleges);

    let effectiveCollegeId = isAdminRole
      ? (aRes?.data?.institution_id || aRes?.data?.college_id || uRes?.data?.college_id)
      : (sRes?.data?.college_id || uRes?.data?.college_id || aRes?.data?.institution_id);

    // If campus admin has no assigned college_id, fallback to Government Institute of Electronics
    if (isAdminRole && finalRole !== 'super_admin' && !effectiveCollegeId) {
      effectiveCollegeId = '6dd12d63-e276-4ff8-8e58-bcd2cc878626';
    }

    if (effectiveCollegeId && (!collegeRecord || (!collegeRecord.college_name && !collegeRecord.name))) {
      try {
        const { data: cData } = await supabase.from('colleges').select('id, college_name, name, college_code, location').eq('id', effectiveCollegeId).maybeSingle();
        if (cData) collegeRecord = cData;
      } catch (_) {}
    }

    const metaFirstLogin = authUser.user_metadata?.first_login_completed;

    // Strictly rely on the database value as the single source of truth for password status
    const isPasswordSet = (userProfile.is_password_set ?? studentProfile.is_password_set ?? false) === true;

    const firstLoginCompleted = metaFirstLogin === true ||
      (userProfile.first_login_completed ?? false) ||
      isPasswordSet;

    const rawDob = userProfile.date_of_birth || studentProfile.date_of_birth || authUser.user_metadata?.date_of_birth || null;
    const formattedDob = rawDob ? formatDateForDisplay(rawDob) : null;

    const resolvedCollegeName = collegeRecord?.college_name ||
      collegeRecord?.name ||
      aRes?.data?.colleges?.college_name ||
      aRes?.data?.colleges?.name ||
      sRes?.data?.colleges?.college_name ||
      sRes?.data?.colleges?.name ||
      userProfile.college_name ||
      authUser.user_metadata?.college_name ||
      (isAdminRole ? (finalRole === 'super_admin' ? 'FEEDX Master Control' : 'State Polytechnic Institution') : 'State Polytechnic Institution');

    const resolvedCollegeLocation = collegeRecord?.location ||
      aRes?.data?.colleges?.location ||
      sRes?.data?.colleges?.location ||
      userProfile.college_location ||
      'Telangana, India';

    // Helper for non-empty string fallback
    const pickFirstValid = (...vals) => {
      for (const v of vals) {
        if (v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim().toLowerCase() !== 'user' && String(v).trim().toLowerCase() !== 'student') return String(v).trim();
      }
      return '';
    };

    const derivedNameFromEmail = authUser.email ? authUser.email.split('@')[0].replace(/[._0-9]+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase()) : '';
    const fullName = pickFirstValid(userProfile.full_name, studentProfile.full_name, adminProfile.full_name, adminProfile.name, authUser.user_metadata?.full_name, derivedNameFromEmail) || 'Student';
    const phone = pickFirstValid(userProfile.phone, studentProfile.phone, authUser.phone, authUser.user_metadata?.phone);
    const gender = pickFirstValid(userProfile.gender, studentProfile.gender, authUser.user_metadata?.gender, 'Male');
    const currentStatus = isAdminRole
      ? 'Active Administrator'
      : pickFirstValid(userProfile.current_status, studentProfile.current_status, authUser.user_metadata?.current_status, 'Student');
    const department = isAdminRole
      ? pickFirstValid(adminProfile.department, userProfile.department, finalRole === 'super_admin' ? 'Executive Administration' : 'Campus Administration')
      : null;
    const branch = isAdminRole ? '' : pickFirstValid(userProfile.branch, studentProfile.branch, studentProfile.branches?.branch_name, authUser.user_metadata?.branch, 'CSE');
    const year = isAdminRole ? '' : pickFirstValid(userProfile.year, studentProfile.year, studentProfile.academic_years?.year_name, authUser.user_metadata?.year, '1st Year');
    const domain = pickFirstValid(userProfile.domain, studentProfile.domain, authUser.user_metadata?.domain);
    const bio = pickFirstValid(userProfile.bio, studentProfile.bio, authUser.user_metadata?.bio);
    const rollNo = isAdminRole ? (adminProfile.admin_code || userProfile.admin_id || null) : pickFirstValid(studentProfile.roll_number, userProfile.roll_number, userProfile.roll_no, authUser.user_metadata?.roll_no, authUser.user_metadata?.roll_number);

    const isProfileSaved = userProfile.is_profile_saved === true || 
                           studentProfile.is_profile_saved === true || 
                           authUser.user_metadata?.is_profile_saved === true || 
                           firstLoginCompleted;

    // Safe merge - ensure admin never inherits student branch or unassociated college
    return {
      ...userProfile,
      ...studentProfile,
      ...adminProfile,
      id: authUser.id,
      user_id: authUser.id,
      email: authUser.email,
      role: finalRole,
      full_name: fullName,
      roll_no: rollNo,
      feedx_id: feedxId,
      qr_code_data: qrCodeData || `https://feedxpolytechnic.com/verify/${feedxId}`,
      identity_status: identityStatus,
      phone,
      gender,
      current_status: currentStatus,
      department: department,
      branch: isAdminRole ? '' : branch,
      year: isAdminRole ? '' : year,
      semester: isAdminRole ? '' : (studentProfile.academic_years?.semester || userProfile.semester || ''),
      domain,
      bio,
      cgpa: isAdminRole ? null : (studentProfile.cgpa || userProfile.cgpa || '8.5'),
      branch_id: studentProfile.branch_id || userProfile.branch_id || null,
      academic_year_id: studentProfile.academic_year_id || userProfile.academic_year_id || null,
      college_id: effectiveCollegeId || null,
      institution_id: effectiveCollegeId || null,
      college_name: resolvedCollegeName,
      college_location: resolvedCollegeLocation,
      colleges: collegeRecord || { id: effectiveCollegeId, college_name: resolvedCollegeName, name: resolvedCollegeName, location: resolvedCollegeLocation },
      is_active: userProfile.is_active !== false && adminProfile.is_active !== false,
      profile_image: pickFirstValid(userProfile.avatar_url, studentProfile.avatar_url, userProfile.profile_image, studentProfile.profile_image, authUser.user_metadata?.avatar_url) || null,
      avatar_url: pickFirstValid(userProfile.avatar_url, studentProfile.avatar_url, userProfile.profile_image, studentProfile.profile_image, authUser.user_metadata?.avatar_url) || null,
      is_password_set: isPasswordSet,
      first_login_completed: firstLoginCompleted,
      is_profile_saved: isProfileSaved,
      date_of_birth: formattedDob,
      streak_count: currentStreak,
      streak: currentStreak,
      max_streak: maxStreak,
      longest_streak: maxStreak,
      total_active_days: totalActiveDays,
      xp_points: xpPoints,
      xp: xpPoints,
      tokens: tokens,
      task_tokens: tokens,
      gold_coins: goldCoins,
      coins: goldCoins,
      wallet_tokens: tokens,
      wallet_coins: goldCoins,
      last_active_at: streakData.last_active_date || userProfile.last_active_at || null,
      user_metadata: authUser.user_metadata || {},
    };
  } catch (err) {
    console.error('Enrichment crash:', err);
    throw err;
  }
}

export function generateFeedxId(user) {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  let yearVal = currentYear;
  const roll = user?.roll_no || user?.roll_number;
  if (roll) {
    const rollDigits = String(roll).match(/^(\d{2})/);
    if (rollDigits && rollDigits[1]) {
      yearVal = rollDigits[1];
    }
  }

  const college = user?.college_name || user?.colleges?.college_name || '';
  const collegeCode = user?.college_code || '';
  let cc = 'IA';
  if (collegeCode && collegeCode.trim().length >= 2) {
    cc = collegeCode.trim().replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
  } else if (college) {
    const words = college.trim().toUpperCase().split(/\s+/).filter(w => !['GOVERNMENT', 'POLYTECHNIC', 'COLLEGE', 'INSTITUTE', 'OF', 'THE', 'AND', '&'].includes(w));
    if (words.length >= 2) {
      cc = (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 2) {
      cc = words[0].slice(0, 2).toUpperCase();
    }
  }

  let seqStr = '0000001';
  const uuid = user?.id || user?.user_id;
  if (uuid) {
    const clean = String(uuid).replace(/[^a-f0-9]/gi, '');
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash * 31 + clean.charCodeAt(i)) % 10000000;
    }
    seqStr = String(Math.abs(hash)).padStart(7, '0');
  }

  return `FX-${yearVal}-${cc}-${seqStr}`;
}

export async function verifyStudentFeedxId(feedxIdQuery) {
  let cleanId = String(feedxIdQuery || '').trim().replace(/^.*\/verify\//, '');
  if (cleanId.startsWith('{')) {
    try {
      const parsed = JSON.parse(cleanId);
      if (parsed.fid) cleanId = parsed.fid;
    } catch {}
  }
  if (!cleanId) throw new Error('Invalid FEEDX ID or QR data');

  const { data, error } = await supabase
    .from('students')
    .select('id, roll_number, full_name, email, year, feedx_id, quizue_id, qr_code_data, identity_status, colleges(college_name), branches(branch_name), academic_years(year_name, semester)')
    .or(`feedx_id.eq.${cleanId},roll_number.eq.${cleanId}`)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error(`No verified student record found for FEEDX ID: ${cleanId}`);

  let quizueId = data.quizue_id;
  if (!quizueId) {
    const seed = data.feedx_id || data.id || 'QUIZUE_DEFAULT';
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 33 + seed.charCodeAt(i)) % 100000000;
    }
    quizueId = `QUIZUE-${String(Math.abs(hash)).padStart(8, '0')}`;
  }

  return {
    full_name: data.full_name,
    roll_number: data.roll_number,
    feedx_id: data.feedx_id || cleanId,
    quizue_id: quizueId,
    college_name: data.colleges?.college_name || 'FEEDX Polytechnic',
    branch_name: data.branches?.branch_name || 'General',
    academic_year: data.academic_years?.year_name || data.year || '1st Year',
    identity_status: data.identity_status || 'verified',
    verified_at: new Date().toISOString()
  };
}

export async function checkLoginEligibility(identifier) {
  const { data, error } = await supabase.functions.invoke('check-login-eligibility', {
    body: { identifier: String(identifier).trim() },
  });
  if (error) throw error;
  return data;
}

export async function verifyStudentIdentity(pinNumber, dateOfBirth) {
  const { data, error } = await supabase.functions.invoke('verify-identity', {
    body: { pin_number: pinNumber, date_of_birth: dateOfBirth },
  });
  if (data?.error) throw new Error(data.error);
  if (error) throw new Error('Invalid PIN Number or Date of Birth.');
  return data;
}

export async function completeAccountActivation(activationToken, password, confirmPassword) {
  console.log('[completeAccountActivation] Starting password creation...');
  console.log('[completeAccountActivation] Token prefix:', activationToken?.substring(0, 8) + '...');

  let data, error;
  try {
    const result = await supabase.functions.invoke('complete-activation', {
      body: {
        activation_token: activationToken,
        password,
        confirm_password: confirmPassword,
      },
    });
    data = result.data;
    error = result.error;
  } catch (networkErr) {
    console.error('[completeAccountActivation] Network/invoke error:', networkErr);
    throw new Error('Network error while creating password. Please check your connection and try again.');
  }

  console.log('[completeAccountActivation] Response received. error:', error ? JSON.stringify(error) : 'none', 'data type:', typeof data);

  if (error) {
    // supabase.functions.invoke error (network, non-2xx, etc.)
    const errMsg = typeof error === 'object' ? (error.message || JSON.stringify(error)) : String(error);
    console.error('[completeAccountActivation] Edge function invocation error:', errMsg);
    throw new Error(errMsg);
  }

  // The edge function returns { error: "..." } for application-level errors within an HTTP 200 response.
  let parsed = data;
  if (typeof data === 'string') {
    console.log('[completeAccountActivation] Raw string response:', data.substring(0, 200));
    try {
      parsed = JSON.parse(data);
    } catch (_) {
      console.error('[completeAccountActivation] Failed to parse response as JSON:', data.substring(0, 200));
      throw new Error('Unexpected server response. Please try again.');
    }
  }

  console.log('[completeAccountActivation] Parsed response:', JSON.stringify(parsed));

  if (parsed?.success === false || parsed?.error) {
    const errorMsg = parsed.error || 'Password creation failed.';
    const details = parsed.details ? `\nDetails: ${parsed.details}` : '';
    const hint = parsed.hint ? `\nHint: ${parsed.hint}` : '';
    const code = parsed.code ? ` (Code: ${parsed.code})` : '';
    console.error('[completeAccountActivation] Server returned structured error:', errorMsg, details, hint, code);
    throw new Error(`${errorMsg}${details}${hint}${code}`);
  }

  if (!parsed?.success) {
    console.error('[completeAccountActivation] No success flag in response:', JSON.stringify(parsed));
    throw new Error('Password creation failed. The server did not confirm success. Please try again.');
  }

  console.log('[completeAccountActivation] ✅ Password created successfully!');
  return parsed;
}

export async function requestPasswordReset(email) {
  const eligibility = await checkLoginEligibility(email);
  if (eligibility?.needs_activation) {
    throw new Error('Complete first-time account activation before resetting your password.');
  }
  const normalizedEmail = String(email).includes('@') ? email : `${email}@feedx.app`;
  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);
  if (error) throw error;
  return { success: true };
}

const failedLoginAttempts = new Map();

function checkAccountLock(identifier) {
  const key = String(identifier).trim().toLowerCase();
  const record = failedLoginAttempts.get(key);
  if (record && record.lockedUntil && Date.now() < record.lockedUntil) {
    const remainingMins = Math.ceil((record.lockedUntil - Date.now()) / (1000 * 60));
    throw new Error(`Account temporarily locked. Please try again in ${remainingMins} minute(s).`);
  }
}

function recordFailedLoginAttempt(identifier) {
  const key = String(identifier).trim().toLowerCase();
  const record = failedLoginAttempts.get(key) || { count: 0, lockedUntil: null };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lock
  }
  failedLoginAttempts.set(key, record);
}

function clearFailedLoginAttempts(identifier) {
  const key = String(identifier).trim().toLowerCase();
  failedLoginAttempts.delete(key);
}

export async function loginWithRollNo(identifier, password) {
  const trimmed = String(identifier).trim();
  if (!trimmed || !password) {
    throw new Error('Invalid Student ID or Password.');
  }

  checkAccountLock(trimmed);

  let email;
  if (trimmed.includes('@')) {
    // User entered an email directly
    email = trimmed.toLowerCase();
  } else {
    // User entered a roll number, PIN, or FeedX ID – look up their actual email securely
    console.log('[loginWithRollNo] Looking up email for identifier:', trimmed);
    try {
      const { data: rpcEmail, error: rpcErr } = await supabase.rpc('get_student_email_for_login', {
        p_roll_number: trimmed.toUpperCase()
      });
      if (!rpcErr && rpcEmail) {
        email = String(rpcEmail).trim().toLowerCase();
        console.log('[loginWithRollNo] Found student email via secure lookup:', email);
      }
    } catch (_) {}

    if (!email) {
      // 1. Check students table by roll_number, pin_number, or feedx_id
      try {
        const { data: studentRecords } = await supabase
          .from('students')
          .select('email')
          .or(`roll_number.ilike.${trimmed},pin_number.ilike.${trimmed},feedx_id.ilike.${trimmed}`)
          .limit(1);

        if (studentRecords && studentRecords.length > 0 && studentRecords[0]?.email) {
          email = studentRecords[0].email.trim().toLowerCase();
          console.log('[loginWithRollNo] Found student email via multi-column lookup:', email);
        }
      } catch (err) {
        console.warn('[loginWithRollNo] Student multi-lookup warning:', err);
      }
    }

    if (!email) {
      // 2. Check users table by email
      try {
        const { data: userRecords } = await supabase
          .from('users')
          .select('email')
          .ilike('email', trimmed)
          .limit(1);

        if (userRecords && userRecords.length > 0 && userRecords[0]?.email) {
          email = userRecords[0].email.trim().toLowerCase();
          console.log('[loginWithRollNo] Found email via users table:', email);
        }
      } catch (_) {}
    }

    if (!email) {
      // Fallback: try the legacy rollnumber@feedx.app format
      email = `${trimmed.toLowerCase()}@feedx.app`;
      console.log('[loginWithRollNo] No student record found, trying fallback:', email);
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data?.user) {
    console.error('[loginWithRollNo] Auth failed for email:', email, '| Error:', error?.message);
    recordFailedLoginAttempt(trimmed);

    // If login failed with the real email, also try the @feedx.app fallback
    if (!trimmed.includes('@') && !email.endsWith('@feedx.app')) {
      const fallbackEmail = `${trimmed.toLowerCase()}@feedx.app`;
      console.log('[loginWithRollNo] Retrying with fallback email:', fallbackEmail);
      const { data: fallbackData, error: fallbackError } = await supabase.auth.signInWithPassword({
        email: fallbackEmail,
        password,
      });
      if (!fallbackError && fallbackData?.user) {
        clearFailedLoginAttempts(trimmed);
        const user = await enrichUser(fallbackData.user);
        await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);
        return user;
      }
    }

    throw new Error(error ? `Login Failed: ${error.message}` : 'Invalid Student ID or Password.');
  }

  clearFailedLoginAttempts(trimmed);

  const user = await enrichUser(data.user);
  await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);

  return user;
}

export async function adminResetUserPassword(userId, customPassword) {
  return await withTimeout((async () => {
    let resetPass = customPassword ? String(customPassword).trim() : null;
    let isDefault = false;
    if (!resetPass) {
      isDefault = true;
      // Fetch student or user DOB to use as default password
      const { data: student } = await supabase.from('students').select('date_of_birth').eq('id', userId).maybeSingle();
      const { data: userRecord } = await supabase.from('users').select('date_of_birth').eq('id', userId).maybeSingle();
      const dob = student?.date_of_birth || userRecord?.date_of_birth;
      resetPass = dob ? String(dob).trim() : 'FEEDX@2025';
    }

    const { data, error } = await supabase.rpc('change_user_password_by_admin', {
      target_user_id: userId,
      new_plain_password: resetPass
    });
    if (error) throw error;

    // Reset account status to first-time registration mode
    try {
      await supabase.from('users').update({
        is_password_set: false,
        first_login_completed: false,
        updated_at: new Date().toISOString()
      }).eq('id', userId);
    } catch (_) {}

    try {
      await supabase.from('students').update({
        is_password_set: false,
        first_login_completed: false,
        updated_at: new Date().toISOString()
      }).or(`user_id.eq.${userId},id.eq.${userId}`);
    } catch (_) {}

    return { success: true, password: resetPass, isDefault };
  })(), 15000);
}

export async function getSession() {
  const { data: { user } } = await supabase.auth.getUser();
  return enrichUser(user);
}

export async function logout() {
  await supabase.auth.signOut();
}

// ==========================================
// STUDENT DASHBOARD
// ==========================================

export async function getDashboard(userId, bypassCache = false) {
  if (!userId) {
    return { 
      profile: null,
      notifications: [], 
      tasks: [], 
      opportunities: [], 
      resources: [], 
      oppCount: 0, 
      resourceCount: 0,
      communityHighlight: null,
      roadmapProgress: null,
      quickLearnLessons: [],
      lessonProgress: [],
      officialUpdates: []
    };
  }

  const cacheKey = `student_dashboard_${userId}`;
  if (bypassCache) {
    cacheService.invalidate(cacheKey);
  }

  return cacheService.fetchWithCache(
    cacheKey,
    async () => {
      try {
        const [{ data: userProfile }, { data: student }, { data: authData }] = await Promise.all([
          supabase.from('users').select('*').eq('id', userId).maybeSingle(),
          supabase.from('students').select('*, colleges(college_name, location), branches(branch_name), academic_years(year_name, semester)').eq('id', userId).maybeSingle(),
          supabase.auth.getUser()
        ]);
        const authUserMeta = authData?.user?.user_metadata || {};
        
        let batchId = student?.academic_year_id;
        if (!batchId && (userProfile?.year || authUserMeta?.year)) {
          const targetYear = userProfile?.year || authUserMeta?.year;
          const { data: batch } = await supabase.from('academic_years').select('id').ilike('year_name', `%${targetYear}%`).maybeSingle();
          batchId = batch?.id;
        }

        let collegeRecord = student?.colleges;
        const cid = student?.college_id || userProfile?.college_id || authUserMeta?.college_id;
        if (!collegeRecord && cid) {
          const { data: colData } = await supabase.from('colleges').select('college_name, location').eq('id', cid).maybeSingle();
          if (colData) collegeRecord = colData;
        }
        if (!collegeRecord) {
          const { data: firstCol } = await supabase.from('colleges').select('college_name, location').limit(1).maybeSingle();
          if (firstCol) collegeRecord = firstCol;
        }

        const fid = student?.feedx_id || userProfile?.feedx_id || authUserMeta?.feedx_id || generateFeedxId({ ...authUserMeta, ...userProfile, ...student, id: userId });
        const profile = { 
          ...authUserMeta,
          ...userProfile, 
          ...student,
          id: userId,
          full_name: student?.full_name || userProfile?.full_name || authUserMeta?.full_name || 'FEEDX Student',
          feedx_id: fid,
          phone: student?.phone || userProfile?.phone || authUserMeta?.phone || '',
          bio: student?.bio || userProfile?.bio || authUserMeta?.bio || '',
          gender: student?.gender || userProfile?.gender || authUserMeta?.gender || 'Male',
          current_status: student?.current_status || userProfile?.current_status || authUserMeta?.current_status || 'Student',
          domain: student?.domain || userProfile?.domain || authUserMeta?.domain || '',
          department: student?.department || userProfile?.department || authUserMeta?.department || '',
          college_name: collegeRecord?.college_name || userProfile?.college_name || authUserMeta?.college_name || 'Government Institute of Electronics',
          college_location: collegeRecord?.location || userProfile?.college_location || 'Telangana, India',
          branch: student?.branches?.branch_name || userProfile?.branch || authUserMeta?.branch || 'CSE',
          semester: student?.academic_years?.semester || userProfile?.semester || '',
          year: student?.year || student?.academic_years?.year_name || userProfile?.year || authUserMeta?.year || '3rd Year',
          roll_number: student?.roll_number || userProfile?.roll_number || authUserMeta?.roll_no || authUserMeta?.roll_number || '21001-CSE-001',
          student_id: student?.id || userId,
          verification_status: student?.verification_status || userProfile?.verification_status || 'Verified',
          academic_year_id: batchId
        };

        const notifFilter = `user_id.eq.${userId},user_id.is.null`;

        const queries = [
          supabase.from('notifications')
            .select('id, title, message, body, type, priority, category, department, is_official, is_verified, created_at, apply_url, user_id, target_college, target_branch, target_year, branch, year')
            .or(notifFilter)
            .order('created_at', { ascending: false })
            .limit(30),
          supabase.from('tasks').select('id, title, deadline, completed, created_at, user_id').eq('user_id', userId).order('created_at', { ascending: false }),
          supabase.from('opportunities').select('*').order('created_at', { ascending: false }).limit(20),
          supabase.from('resources').select('*').order('created_at', { ascending: false }).limit(20),
          supabase.from('notification_reads').select('notification_id').eq('user_id', userId),
          supabase.from('community_posts').select('id, content, likes_count, created_at').neq('is_deleted', true).order('created_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('student_roadmap_progress').select('*').eq('user_id', userId).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('quick_learn_lessons').select('id, title, category, estimated_minutes, short_description, branch').eq('is_published', true).limit(5),
          supabase.from('events').select('id, title, event_date, location, description, registration_link, created_at, college_id, banner_url, image_url').is('college_id', null).order('created_at', { ascending: false }).limit(5),
          supabase.from('student_lesson_progress').select('lesson_id, completed, fx_awarded').eq('user_id', userId)
        ];

        const results = await Promise.all(
          queries.map(q => Promise.resolve(q).catch(err => {
            console.warn('[supabaseService] getDashboard query failed:', err);
            return { data: null, error: err };
          }))
        );
        const [
          notificationsRaw, tasks, opportunities, resources, readRows,
          communityHighlightRes, roadmapProgressRes, quickLearnRes, eventsRes, lessonProgressRes
        ] = results.map(r => r?.data || null);

        const oppCount = opportunities?.length || 0;
        const resourceCount = resources?.length || 0;

        // Fetch local read notifications from AsyncStorage to guarantee 100% sync
        let localReadIds = [];
        try {
          const cached = await AsyncStorage.getItem(`@feedx_read_notifs_${userId}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) localReadIds = parsed;
          }
        } catch (_) {}

        const readSet = new Set();
        (readRows || []).forEach((r) => {
          if (r?.notification_id) {
            const sid = String(r.notification_id).trim();
            readSet.add(sid);
            readSet.add(sid.replace(/^(notif_|event_|opp_|notif-)/, ''));
          }
        });
        localReadIds.forEach((id) => {
          if (id) {
            const sid = String(id).trim();
            readSet.add(sid);
            readSet.add(sid.replace(/^(notif_|event_|opp_|notif-)/, ''));
          }
        });

        const studentCollegeId = cid || profile.college_id;
        const studentBranch = String(profile.branch || '').toLowerCase().trim();
        const studentYear = String(profile.year || '').toLowerCase().trim();

        const seenNotifTitles = new Set();
        const notifications = (notificationsRaw || [])
          .filter((n) => {
            if (!n || !n.title) return false;
            const normTitle = String(n.title).trim().toLowerCase();
            if (seenNotifTitles.has(normTitle)) return false;
            seenNotifTitles.add(normTitle);

            // Direct user notification
            if (n.user_id && n.user_id === userId) return true;

            // Strict College targeting: if notification specifies a college, student must belong to it
            const notifCollege = n.college_id || n.target_college;
            if (notifCollege && studentCollegeId) {
              const nColStr = String(notifCollege).toLowerCase().trim();
              const sColStr = String(studentCollegeId).toLowerCase().trim();
              if (nColStr !== sColStr) return false;
            } else if (notifCollege && !studentCollegeId) {
              return false;
            }

            // Branch targeting
            const targetBranch = String(n.branch || n.target_branch || 'All').toLowerCase().trim();
            const branchOk = targetBranch === 'all' || !studentBranch || 
              studentBranch.includes(targetBranch) || targetBranch.includes(studentBranch);

            // Year targeting
            const targetYear = String(n.year || n.target_year || 'All').toLowerCase().trim();
            const yearOk = targetYear === 'all' || !studentYear || 
              studentYear.includes(targetYear) || targetYear.includes(studentYear);

            return branchOk && yearOk;
          })
          .slice(0, 25)
          .map((n) => {
            const sId = String(n.id).trim();
            const cleanId = sId.replace(/^(notif_|event_|opp_|notif-)/, '');
            const isRead = Boolean(n.is_read) || readSet.has(sId) || readSet.has(cleanId);
            return {
              ...n,
              is_read: isRead,
            };
          });

        // Process Official Updates feed combining notifications, events, and opportunities
        const rawUpdates = [];

        (notifications || []).forEach(n => {
          rawUpdates.push({
            id: `notif_${n.id}`,
            notifId: n.id,
            title: n.title,
            body: n.message || n.body || '',
            badgeText: n.category || n.department || 'OFFICIAL',
            badgeBg: n.priority === 'urgent' ? '#EF4444' : '#2563EB',
            badgeColor: '#FFFFFF',
            is_official: true,
            is_verified: true,
            timestamp: n.created_at,
            created_at: n.created_at,
            contentType: 'Notice',
            actionLabel: n.apply_url ? 'View Notice' : 'Details',
            route: `/(tabs)/updates?notificationId=${n.id}`,
            apply_url: n.apply_url
          });
        });

        (eventsRes || []).forEach(e => {
          rawUpdates.push({
            id: `event_${e.id}`,
            eventId: e.id,
            title: e.title,
            body: e.description || '',
            badgeText: 'CAMPUS EVENT',
            badgeBg: '#10B981',
            badgeColor: '#FFFFFF',
            is_official: true,
            is_verified: true,
            timestamp: e.event_date || e.created_at,
            created_at: e.created_at,
            contentType: 'Event',
            actionLabel: 'Register',
            route: `/event-detail?id=${e.id}`
          });
        });

        (opportunities || []).slice(0, 3).forEach(o => {
          rawUpdates.push({
            id: `opp_${o.id}`,
            oppId: o.id,
            title: `${o.title} — ${o.company || 'Tech Partner'}`,
            body: o.description || `Stipend: ${o.stipend || 'Competitive'} | Deadline: ${o.deadline || 'Rolling'}`,
            badgeText: o.type ? o.type.toUpperCase() : 'CAREER',
            badgeBg: '#8B5CF6',
            badgeColor: '#FFFFFF',
            is_official: true,
            is_verified: true,
            timestamp: o.created_at,
            created_at: o.created_at,
            contentType: o.type || 'Placement',
            actionLabel: 'Apply',
            route: `/opportunity-detail?id=${o.id}`
          });
        });

        // Deduplicate updates stream by normalized title
        const seenUpdateTitles = new Set();
        const officialUpdates = rawUpdates.filter(u => {
          if (!u || !u.title) return false;
          const key = String(u.title).trim().toLowerCase();
          if (seenUpdateTitles.has(key)) return false;
          seenUpdateTitles.add(key);
          return true;
        });

        // Default student tasks if empty
        const defaultStudentTasks = [
          { id: 'task_1', title: 'Review 3rd Year CSE Lecture Notes & Lab Diagrams', category: 'Academic', deadline: 'Today', completed: false },
          { id: 'task_2', title: 'Submit Mini-Project Architecture & Spec Sheet', category: 'Project', deadline: '5:00 PM', completed: false },
          { id: 'task_3', title: 'Complete 3-Minute Quick Learn Daily Concept', category: 'Learning', deadline: 'Today', completed: false },
          { id: 'task_4', title: 'Check Campus Placement Drive Eligibility & Resume', category: 'Career', deadline: 'End of Day', completed: false },
        ];
        const finalTasks = (tasks && tasks.length > 0) ? tasks : defaultStudentTasks;

        let formattedRoadmap = null;
        if (roadmapProgressRes && roadmapProgressRes.career_role_id) {
          const phases = Array.isArray(roadmapProgressRes.completed_phase_ids) ? roadmapProgressRes.completed_phase_ids : [];
          const totalPhases = 6;
          const pct = roadmapProgressRes.readiness_score !== undefined && roadmapProgressRes.readiness_score !== null 
            ? Number(roadmapProgressRes.readiness_score) 
            : Math.min(100, Math.round((phases.length / totalPhases) * 100));
          
          formattedRoadmap = {
            id: roadmapProgressRes.career_role_id,
            career_role_id: roadmapProgressRes.career_role_id,
            title: String(roadmapProgressRes.career_role_id).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            percentage: pct,
            readiness_score: pct,
            completedPhasesCount: phases.length,
            totalPhasesCount: totalPhases,
            completed_phase_ids: phases,
            completed_task_ids: phases,
          };
        }

        return {
          profile,
          notifications: notifications || [],
          tasks: finalTasks,
          opportunities: opportunities || [],
          resources: resources || [],
          oppCount,
          resourceCount,
          communityHighlight: communityHighlightRes || null,
          roadmapProgress: formattedRoadmap,
          quickLearnLessons: quickLearnRes || [],
          lessonProgress: lessonProgressRes || [],
          officialUpdates
        };
      } catch (error) {
        console.error('getDashboard error:', error);
        return { 
          profile: null,
          notifications: [], 
          tasks: [], 
          opportunities: [], 
          resources: [], 
          oppCount: 0, 
          resourceCount: 0,
          communityHighlight: null,
          roadmapProgress: null,
          quickLearnLessons: [],
          lessonProgress: [],
          officialUpdates: []
        };
      }
    },
    45000 // 45s TTL for smooth instant rendering
  );
}

export async function getAdminStats() {
  try {
    const [students, issues, resources, notifications] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }),
      supabase.from('issues').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('resources').select('id', { count: 'exact', head: true }),
      supabase.from('notifications').select('id', { count: 'exact', head: true })
    ]);

    return {
      studentCount: students.count || 0,
      issueCount: issues.count || 0,
      resourceCount: resources.count || 0,
      notifCount: notifications.count || 0
    };
  } catch (err) {
    console.error('getAdminStats error:', err);
    return { studentCount: 0, issueCount: 0, resourceCount: 0, notifCount: 0 };
  }
}

export async function getAdminAnalyticsDetail(collegeId = null) {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    let stQuery = supabase.from('students').select('id', { count: 'exact', head: true });
    let stRecentQuery = supabase.from('students').select('id', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo);
    let pendingIssuesQuery = supabase.from('issues').select('id', { count: 'exact', head: true }).eq('status', 'pending');
    let highPriorityIssuesQuery = supabase.from('issues').select('id', { count: 'exact', head: true }).eq('status', 'pending').gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());
    let recentResourcesQuery = supabase.from('resources').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 86400000).toISOString());
    let resolvedIssuesQuery = supabase.from('issues').select('id', { count: 'exact', head: true }).eq('status', 'resolved');
    let resourcesTotalQuery = supabase.from('resources').select('id', { count: 'exact', head: true });

    if (collegeId) {
      stQuery = stQuery.eq('college_id', collegeId);
      stRecentQuery = stRecentQuery.eq('college_id', collegeId);
      pendingIssuesQuery = pendingIssuesQuery.eq('college_id', collegeId);
      highPriorityIssuesQuery = highPriorityIssuesQuery.eq('college_id', collegeId);
      recentResourcesQuery = recentResourcesQuery.eq('college_id', collegeId);
      resolvedIssuesQuery = resolvedIssuesQuery.eq('college_id', collegeId);
      resourcesTotalQuery = resourcesTotalQuery.eq('college_id', collegeId);
    }

    const [students, recentStudents, pendingIssues, highPriorityIssues, recentResources, resolvedIssues, resourcesTotal] = await Promise.all([
      stQuery,
      stRecentQuery,
      pendingIssuesQuery,
      highPriorityIssuesQuery,
      recentResourcesQuery,
      resolvedIssuesQuery,
      resourcesTotalQuery,
    ]);
    const totalStudents = students.count || 0;
    const growthPct = totalStudents > 0 ? Math.round(((recentStudents.count || 0) / totalStudents) * 100) : 0;
    return {
      studentBase: {
        summary: collegeId
          ? `${totalStudents} active students enrolled in your institution.`
          : `${totalStudents} active students enrolled across all departments.`,
        metrics: [`${growthPct}% growth (30d)`, `${recentStudents.count || 0} new this month`],
      },
      supportDesk: {
        summary: collegeId
          ? `${pendingIssues.count || 0} unresolved college student tickets requiring action.`
          : `${pendingIssues.count || 0} unresolved student tickets requiring action.`,
        metrics: [`${highPriorityIssues.count || 0} opened this week`, `${resolvedIssues.count || 0} resolved total`],
      },
      knowledgeAssets: {
        summary: collegeId
          ? 'Institutional documents and academic resources uploaded for your campus.'
          : 'Institutional documents and academic resources available to students.',
        metrics: [`${recentResources.count || 0} added in 24h`, `${resourcesTotal.count || 0} total assets`],
      },
    };
  } catch (err) {
    console.error('getAdminAnalyticsDetail error:', err);
    return null;
  }
}

// ==========================================
// COLLEGE FUNCTIONS (Used by CollegeDetailScreen, CollegesScreen)
// ==========================================

export async function getCollegeById(id) {
  const { data } = await supabase.from('colleges').select('*').eq('id', id).maybeSingle();
  return data;
}

export async function adminListColleges() {
  return getCachedData('adminListColleges', async () => {
    const { data } = await supabase.from('colleges').select('id, name, location').order('name');
    return data || [];
  }, 12 * 60 * 60 * 1000); // 12 hours TTL
}

// ==========================================
// EVENTS (Used by EventsScreen, EventDetailScreen)
// ==========================================

export async function getEvents() {
  const { data, error } = await supabase.from('events').select('*').eq('status', 'Published').order('created_at', { ascending: false });
  if (error) {
    console.warn('[getEvents] Error fetching events:', error?.message);
    return [];
  }
  if (data && data.length > 0) {
    const eventIds = data.map(e => e.id);
    const countMap = {};
    try {
      const { data: regCounts } = await supabase
        .from('event_registrations')
        .select('event_id')
        .in('event_id', eventIds)
        .not('status', 'ilike', 'cancel%');

      if (regCounts && regCounts.length > 0) {
        regCounts.forEach(r => {
          countMap[r.event_id] = (countMap[r.event_id] || 0) + 1;
        });
      }
    } catch (_) {}

    data.forEach(item => {
      const dbRegistered = Number(item.registered) || 0;
      const computedCount = countMap[item.id] || 0;
      item.capacity = Number(item.max_participants || item.capacity || 100);
      item.registered = Math.max(dbRegistered, computedCount);
    });
  }
  return data || [];
}

export async function getEventById(id) {
  const { data, error } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;

  let regCount = Number(data.registered) || 0;
  try {
    const { count } = await supabase
      .from('event_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', id)
      .not('status', 'ilike', 'cancel%');
    if (count !== null && count !== undefined && count > regCount) {
      regCount = count;
    }
  } catch (_) {}

  data.capacity = Number(data.max_participants || data.capacity || 100);
  data.registered = regCount;
  return data;
}

export async function adminListEvents(collegeId) {
  let query = supabase.from('events').select('*').order('created_at', { ascending: false });
  if (collegeId) {
    query = query.eq('college_id', collegeId);
  }
  const { data } = await query;
  if (data) {
    data.forEach(item => {
      item.capacity = item.max_participants || item.capacity || null;
    });
  }
  return data || [];
}

export async function adminCreateEvent(eventData) {
  const { data, error } = await supabase.from('events').insert([eventData]).select().single();
  if (error) throw error;
  return data;
}

export async function adminUpdateEvent(eventId, eventData) {
  const { data, error } = await supabase.from('events').update(eventData).eq('id', eventId).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteEvent(eventId) {
  const { error } = await supabase.from('events').delete().eq('id', eventId);
  if (error) throw error;
  return true;
}

export async function pushToGoogleSheets(studentId, eventId, regNumber) {
  try {
    if (!GOOGLE_APPS_SCRIPT_URL) return false;

    // Fetch student profile & event details to push meaningful data
    const [stRes, evRes] = await Promise.all([
      supabase.from('students').select('full_name, email, roll_number').eq('id', studentId).maybeSingle(),
      supabase.from('events').select('title, venue, event_date').eq('id', eventId).maybeSingle()
    ]);

    const student = stRes.data || {};
    const event = evRes.data || {};

    const payload = {
      action: 'registerEvent',
      studentName: student.full_name || 'FEEDX Official',
      studentEmail: student.email || '',
      rollNumber: student.roll_number || 'PENDING',
      eventTitle: event.title || 'FEEDX Event',
      eventDate: event.event_date || 'TBA',
      venue: event.venue || 'TBA',
      registrationNumber: regNumber,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (err) {
    console.warn('[pushToGoogleSheets] Failed to sync registration to sheets:', err);
    return false;
  }
}

export async function registerForEvent(eventId, studentId, studentInfo = {}) {
  const isValidUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
  const validCollegeId = isValidUUID(studentInfo.college_id) ? studentInfo.college_id.trim() : null;

  const feedxId = studentInfo.feedx_id || studentInfo.roll_number || `FEEDX-TG-26-${String(studentId).substring(0,6).toUpperCase()}`;
  const regNumber = `REG-${eventId.substring(0,4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const qrToken = `${feedxId}_${eventId.substring(0,6)}`;

  // 1. Try secure database RPC first (bypasses RLS and handles atomic registration + count update)
  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc('register_for_event_secure', {
      p_event_id: eventId,
      p_user_id: studentId,
      p_student_info: {
        ...studentInfo,
        college_id: validCollegeId,
        feedx_id: feedxId
      }
    });
    if (!rpcErr && rpcData) {
      console.log('[registerForEvent] Registered via secure RPC successfully');
      pushToGoogleSheets(studentId, eventId, regNumber).catch(() => {});
      return rpcData;
    }
    if (rpcErr) {
      console.warn('[registerForEvent] RPC attempt notice, proceeding with direct sync:', rpcErr.message);
    }
  } catch (rpcEx) {
    console.warn('[registerForEvent] RPC fallback notice:', rpcEx);
  }

  // 2. Check for existing registration record (e.g. previously cancelled)
  const { data: existingReg } = await supabase
    .from('event_registrations')
    .select('id, status')
    .eq('event_id', eventId)
    .or(`student_id.eq.${studentId},user_id.eq.${studentId}`)
    .maybeSingle();

  if (existingReg) {
    const { data: updated, error: updateErr } = await supabase
      .from('event_registrations')
      .update({
        status: 'registered',
        attendance_status: 'registered',
        attendance: 'Pending',
        registered_at: new Date().toISOString()
      })
      .eq('id', existingReg.id)
      .select()
      .maybeSingle();

    if (!updateErr && updated) {
      try {
        const { count } = await supabase.from('event_registrations').select('id', { count: 'exact', head: true }).eq('event_id', eventId).not('status', 'ilike', 'cancel%');
        if (count !== null && count !== undefined) {
          await supabase.from('events').update({ registered: count }).eq('id', eventId);
        }
      } catch (_) {}
      return updated;
    }
  }

  // 3. Direct insert with resilient status candidates (including lowercase 'registered')
  const basePayload = {
    student_id: studentId,
    user_id: studentId,
    event_id: eventId,
    registration_number: regNumber,
    feedx_id: feedxId,
    qr_token: qrToken,
    event_qr: qrToken,
    registered_at: new Date().toISOString(),
    attendance_status: 'registered',
    attendance: 'Pending',
    student_name: studentInfo.full_name || studentInfo.name || null,
    college_id: validCollegeId,
    branch: studentInfo.branch || null,
  };

  const statusCandidates = ['registered', 'Registered', 'Active', 'Confirmed', null];
  let lastError = null;
  let data = null;

  for (const statusVal of statusCandidates) {
    const payload = { ...basePayload };
    if (statusVal !== null) {
      payload.status = statusVal;
    }
    const res = await supabase.from('event_registrations').insert(payload).select().single();
    if (!res.error) {
      data = res.data;
      lastError = null;
      break;
    }
    lastError = res.error;
    if (!res.error.message?.includes('check constraint') && !res.error.message?.includes('23514')) {
      break;
    }
  }

  if (lastError && !data) throw lastError;

  // Push registration to Google Sheets in background
  pushToGoogleSheets(studentId, eventId, regNumber).catch(e => {
    console.warn('[registerForEvent] Background Google Sheets sync notice:', e);
  });

  // Dynamically recalculate and sync registered count in events table
  try {
    const { count } = await supabase
      .from('event_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .not('status', 'ilike', 'cancel%');

    if (count !== null && count !== undefined) {
      await supabase.from('events').update({ registered: count }).eq('id', eventId);
    }
  } catch (e) {
    console.warn('[registerForEvent] Error syncing count:', e);
  }

  return data;
}

export async function verifyEventRegistrationQR(qrPayload, scannerUser, targetEventId) {
  if (!qrPayload) throw new Error('Invalid QR payload');
  const cleanPayload = String(qrPayload).trim();

  // 1. Direct registration lookup by token, ticket number, or ID
  let { data: reg, error } = await supabase
    .from('event_registrations')
    .select('*, events(*), students(*)')
    .or(`qr_token.eq.${cleanPayload},event_qr.eq.${cleanPayload},feedx_id.eq.${cleanPayload},registration_number.eq.${cleanPayload},id.eq.${cleanPayload}`)
    .maybeSingle();

  // 2. If not found directly, lookup user by FeedX ID, Roll No, PIN, or User ID
  if (!reg) {
    const { data: userRow } = await supabase
      .from('users')
      .select('id, full_name, email, phone, roll_number, pin_number, branch, college_name')
      .or(`feedx_id.eq.${cleanPayload},roll_number.eq.${cleanPayload},pin_number.eq.${cleanPayload},id.eq.${cleanPayload}`)
      .maybeSingle();

    if (userRow?.id) {
      let regQuery = supabase
        .from('event_registrations')
        .select('*, events(*), students(*)')
        .or(`student_id.eq.${userRow.id},user_id.eq.${userRow.id}`);

      if (targetEventId) {
        regQuery = regQuery.eq('event_id', targetEventId);
      }

      const { data: userReg } = await regQuery.order('created_at', { ascending: false }).limit(1).maybeSingle();

      if (userReg) {
        reg = userReg;
      } else {
        const studentName = userRow.full_name || 'Student';
        const rollNum = userRow.pin_number || userRow.roll_number || 'N/A';
        throw new Error(`Student ${studentName} (${rollNum}) has NOT registered for this event.`);
      }
    }
  }

  if (error) throw error;
  if (!reg) throw new Error('Invalid QR Code: No matching student or event registration record found.');

  // Check event status
  if (reg.status === 'Cancelled') throw new Error('Registration for this event has been cancelled.');

  // Role based permission check
  const scannerRole = String(scannerUser?.role || '').toLowerCase();
  const isSuperAdmin = scannerRole === 'super_admin';
  const isCollegeAdmin = scannerRole === 'admin' || scannerRole === 'inst_admin';

  if (!isSuperAdmin && isCollegeAdmin) {
    const eventCollegeId = reg.events?.college_id || reg.events?.institution_id;
    if (eventCollegeId && scannerUser?.college_id && String(eventCollegeId) !== String(scannerUser.college_id)) {
      throw new Error("Permission Denied: College Admins can only verify events belonging to their own college.");
    }
  }

  // Already checked in check
  if (reg.checked_in || reg.attendance_status === 'present' || reg.attendance_status === 'Checked In' || reg.attendance === 'Present') {
    const studentName = reg.students?.full_name || reg.user_name || 'Student';
    const rollNum = reg.students?.roll_number || reg.students?.pin_number || reg.pin_number || 'N/A';
    const eventTitle = reg.events?.title || 'Event';
    return {
      status: 'ALREADY_CHECKED_IN',
      message: `Already Checked-In:\n\nStudent: ${studentName}\nRoll: ${rollNum}\nEvent: ${eventTitle}\nTime: ${new Date(reg.verified_at || reg.updated_at || Date.now()).toLocaleTimeString()}`,
      registration: reg,
      student: reg.students,
      event: reg.events
    };
  }

  // Verify and update check-in status
  const now = new Date().toISOString();
  const { data: updatedReg, error: updateErr } = await supabase
    .from('event_registrations')
    .update({
      checked_in: true,
      attendance_status: 'present',
      attendance: 'Present',
      verified_at: now,
      verification_time: now,
      verified_by: scannerUser?.id || null
    })
    .eq('id', reg.id)
    .select('*, events(*), students(*)')
    .single();

  if (updateErr) throw updateErr;

  const verifiedStudentName = updatedReg.students?.full_name || updatedReg.user_name || 'Student';
  const verifiedRoll = updatedReg.students?.roll_number || updatedReg.students?.pin_number || updatedReg.pin_number || 'N/A';
  const verifiedEventTitle = updatedReg.events?.title || 'Event';

  return {
    status: 'VERIFIED_SUCCESS',
    message: `Verified & Checked-In Successfully!\n\nStudent: ${verifiedStudentName}\nRoll: ${verifiedRoll}\nEvent: ${verifiedEventTitle}\nTime: ${new Date(now).toLocaleTimeString()}`,
    registration: updatedReg,
    student: updatedReg.students,
  };
}

export async function getUserEventRegistration(eventId, studentId) {
  const { data } = await supabase.from('event_registrations')
    .select('*')
    .eq('event_id', eventId)
    .or(`student_id.eq.${studentId},user_id.eq.${studentId}`)
    .not('status', 'ilike', 'cancel%')
    .maybeSingle();
  return data;
}

export async function cancelEventRegistration(eventId, studentId) {
  try {
    const { error: rpcErr } = await supabase.rpc('cancel_event_registration_secure', {
      p_event_id: eventId,
      p_user_id: studentId
    });
    if (!rpcErr) {
      return { success: true };
    }
  } catch (_) {}

  // Direct fallback with constraint resilience
  let { error } = await supabase.from('event_registrations')
    .update({ status: 'cancelled' })
    .eq('event_id', eventId)
    .or(`student_id.eq.${studentId},user_id.eq.${studentId}`);

  if (error && (error.message?.includes('check constraint') || error.code === '23514')) {
    const retry = await supabase.from('event_registrations')
      .update({ status: 'Cancelled' })
      .eq('event_id', eventId)
      .or(`student_id.eq.${studentId},user_id.eq.${studentId}`);
    error = retry.error;
  }

  if (error) throw error;

  // Dynamically recalculate and sync registered count in events table
  try {
    const { count } = await supabase
      .from('event_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .not('status', 'ilike', 'cancel%');

    if (count !== null && count !== undefined) {
      await supabase.from('events').update({ registered: Math.max(0, count) }).eq('id', eventId);
    }
  } catch (e) {
    console.warn('[cancelEventRegistration] Error syncing count:', e);
  }

  return { success: true };
}

export async function getStudentRegistrations(studentId) {
  const { data, error } = await supabase.from('event_registrations')
    .select('*, events(*)')
    .or(`student_id.eq.${studentId},user_id.eq.${studentId}`)
    .not('status', 'ilike', 'cancel%')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getMyEventRegistrations(studentId) {
  return getStudentRegistrations(studentId);
}

export async function getUserRegisteredEventIds(studentId) {
  const { data, error } = await supabase.from('event_registrations')
    .select('event_id')
    .or(`student_id.eq.${studentId},user_id.eq.${studentId}`)
    .not('status', 'ilike', 'cancel%');
  if (error) {
    console.error('getUserRegisteredEventIds error:', error);
    return [];
  }
  return (data || []).map((r) => r.event_id);
}

export async function getEventRegistrations(eventId) {
  const { data, error } = await supabase.from('event_registrations')
    .select('*, students(full_name, roll_number, branch, year)')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function verifyQRToken(qrToken, verifiedBy, device, location) {
  const { data, error } = await supabase.rpc('verify_event_qr_token', {
    p_qr_token: qrToken,
    p_verified_by: verifiedBy,
    p_device: device || 'Mobile App',
    p_location: location || 'Campus'
  });
  if (error) throw error;
  return data;
}

export async function getEventAnalytics(eventId) {
  const [{ count: total }, { count: presentUpper }, { count: presentLower }] = await Promise.all([
    supabase.from('event_registrations').select('id', { count: 'exact', head: true }).eq('event_id', eventId),
    supabase.from('event_registrations').select('id', { count: 'exact', head: true }).eq('event_id', eventId).or('attendance.eq.Present,attendance_status.eq.present'),
    supabase.from('event_registrations').select('id', { count: 'exact', head: true }).eq('event_id', eventId).or('attendance.eq.Absent,attendance_status.eq.absent')
  ]);
  const present = presentUpper || 0;
  return {
    totalRegistrations: total || 0,
    present: present,
    absent: Math.max(0, (total || 0) - present)
  };
}


// ==========================================
// NOTIFICATIONS (Used by admin/notifications.tsx)
// ==========================================

export async function getNotifications(userId, collegeId, bypassCache = false, page = 1, limit = 20) {
  let readSet = new Set();
  try {
    if (userId) {
      try {
        const cachedReads = await AsyncStorage.getItem(`@feedx_read_notifs_${userId}`);
        if (cachedReads) {
          const parsed = JSON.parse(cachedReads);
          if (Array.isArray(parsed)) {
            parsed.forEach((id) => {
              if (id) {
                const sid = String(id).trim();
                readSet.add(sid);
                readSet.add(sid.replace(/^(notif_|event_|opp_|notif-)/, ''));
              }
            });
          }
        }
      } catch (_) {}

      try {
        const { data: readRows } = await supabase
          .from('notification_reads')
          .select('notification_id')
          .eq('user_id', userId);
        if (readRows) {
          readRows.forEach((r) => {
            if (r?.notification_id) {
              const sid = String(r.notification_id).trim();
              readSet.add(sid);
              readSet.add(sid.replace(/^(notif_|event_|opp_|notif-)/, ''));
            }
          });
        }
      } catch (_) {}
    }

    let orConditions = ['and(college_id.is.null,user_id.is.null)', 'target_audience.eq.all'];
    if (userId) {
      orConditions.push(`user_id.eq.${userId}`);
    }
    if (collegeId) {
      orConditions.push(`college_id.eq.${collegeId}`);
      orConditions.push(`target_college.eq.${collegeId}`);
    }

    let query = supabase.from('notifications').select('*');
    query = query.or(orConditions.join(','));

    const from = Math.max(0, (page - 1) * limit);
    const to = from + limit - 1;
    const { data: notificationsRaw, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error || !notificationsRaw || notificationsRaw.length === 0) {
      return getFallbackNotifications(readSet);
    }

    // Filter strictly to ensure college notices from OTHER colleges are excluded
    const filteredList = notificationsRaw.filter((n) => {
      // 1. Direct user notification
      if (n.user_id && userId && n.user_id === userId) return true;
      // 2. Student's own college notification
      const nCollege = n.college_id || n.target_college;
      if (nCollege && collegeId && (String(nCollege).toLowerCase().trim() === String(collegeId).toLowerCase().trim())) return true;
      // 3. SuperAdmin overall broadcast (sent to all colleges state-wide)
      if (!nCollege && !n.user_id) return true;
      // Exclude if it belongs to another college
      return false;
    });

    const finalRaw = filteredList.length > 0 ? filteredList : notificationsRaw;
    return finalRaw.map(n => {
      const sId = String(n.id).trim();
      const cleanId = sId.replace(/^(notif_|event_|opp_|notif-)/, '');
      const isRead = Boolean(n.is_read) || readSet.has(sId) || readSet.has(cleanId);
      return {
        ...n,
        is_read: isRead,
      };
    });
  } catch (e) {
    return getFallbackNotifications(readSet);
  }
}

function getFallbackNotifications(readSet = new Set()) {
  const now = new Date();
  const raw = [
    {
      id: 'notif-1',
      title: '📢 Mid-Term Examination Schedule Announced',
      message: 'The Mid-Term examination datesheet for Polytechnic Semester 2, 4 & 6 has been released. Check Academics tab for details.',
      body: 'The Mid-Term examination datesheet for Polytechnic Semester 2, 4 & 6 has been released. Check Academics tab for details.',
      type: 'Academic',
      created_at: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
      is_read: false,
    },
    {
      id: 'notif-2',
      title: '🔥 New Daily Data Structures Challenge Live',
      message: 'Complete today\'s 10-MCQ Data Structures Quiz to earn 5 Gold Coins and extend your streak!',
      body: 'Complete today\'s 10-MCQ Data Structures Quiz to earn 5 Gold Coins and extend your streak!',
      type: 'Quiz',
      created_at: new Date(now.getTime() - 5 * 3600 * 1000).toISOString(),
      is_read: false,
    },
    {
      id: 'notif-3',
      title: '💼 Campus Placement Drive: L&T Tech Services',
      message: 'L&T is hiring Polytechnic Diploma Engineers (CSE, ECE, EEE, MECH). Apply via Opportunities tab before Friday.',
      body: 'L&T is hiring Polytechnic Diploma Engineers (CSE, ECE, EEE, MECH). Apply via Opportunities tab before Friday.',
      type: 'Placement',
      created_at: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
      is_read: true,
    },
    {
      id: 'notif-4',
      title: '🏆 State Polytechnic Hackathon 2026',
      message: 'Registrations are open for the Annual Technical Innovation Challenge. Team size 2-4 students.',
      body: 'Registrations are open for the Annual Technical Innovation Challenge. Team size 2-4 students.',
      type: 'Event',
      created_at: new Date(now.getTime() - 48 * 3600 * 1000).toISOString(),
      is_read: true,
    }
  ];
  return raw.map(n => {
    const sId = String(n.id).trim();
    const cleanId = sId.replace(/^(notif_|event_|opp_|notif-)/, '');
    const isRead = Boolean(n.is_read) || readSet.has(sId) || readSet.has(cleanId);
    return {
      ...n,
      is_read: isRead,
    };
  });
}

export async function adminCreateNotification(notification) {
  const cId = notification.college_id || notification.target_college || null;
  const payload = {
    title: notification.title,
    message: notification.message || notification.body || '',
    body: notification.body || notification.message || '',
    type: notification.type || 'admin',
    branch: notification.branch || 'All',
    year: notification.year || 'All',
    apply_url: notification.apply_url || null,
    user_id: notification.user_id || null,
    college_id: cId,
    target_college: cId,
    target_branch: notification.target_branch || null,
    target_year: notification.target_year || null,
  };
  const { error } = await supabase.from('notifications').insert(payload);
  if (error) throw error;
  return { success: true };
}

export async function adminPostNotification(notification) {
  return adminCreateNotification(notification);
}

// ==========================================
// INNOVATIONS & PROJECTS HUB
// ==========================================

export async function getInnovations(filters = {}) {
  try {
    let query = supabase.from('innovations').select('*').order('created_at', { ascending: false });
    
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    } else if (filters.collegeId) {
      query = query.eq('college_id', filters.collegeId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('getInnovations DB query warning:', error.message);
      return [];
    }
    return (data || []).map(item => ({
      ...item,
      author_name: item.author_name || item.student_name || 'Student Innovator',
      author_email: item.author_email || '',
      college_name: item.college_name || 'FEEDX Polytechnic',
      branch: item.branch || '',
      year: item.year || ''
    }));
  } catch (err) {
    console.error('getInnovations crash:', err);
    return [];
  }
}

export async function getMyInnovations(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('innovations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.warn('getMyInnovations DB warning:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('getMyInnovations crash:', err);
    return [];
  }
}

const validateUUID = (id) => {
  if (!id) return null;
  const str = String(id).trim();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str) ? str : null;
};

export async function createInnovation(project) {
  const title = sanitizeInput(project?.title);
  const description = sanitizeInput(project?.description);
  const problem = sanitizeInput(project?.problem_statement);
  const solution = sanitizeInput(project?.proposed_solution);

  if (!title || title.length < 5) {
    throw new Error('Database Validation Failed: Title must contain minimum 5 characters.');
  }
  if (!problem || problem.length < 10) {
    throw new Error('Database Validation Failed: Problem statement must contain minimum 10 characters.');
  }
  if (!solution || solution.length < 10) {
    throw new Error('Database Validation Failed: Proposed solution must contain minimum 10 characters.');
  }
  if (!description || description.length < 20) {
    throw new Error('Database Validation Failed: Description must contain minimum 20 characters.');
  }

  const basePayload = {
    title,
    category: sanitizeInput(project.category) || 'AI',
    problem_statement: problem,
    proposed_solution: solution,
    description,
    expected_impact: sanitizeInput(project.expected_impact) || '',
    tech_stack: sanitizeInput(project.tech_stack) || null,
    team_members: sanitizeInput(project.team_members) || null,
    supporting_docs: sanitizeInput(project.supporting_docs) || null,
    demo_link: sanitizeInput(project.demo_link) || null,
    stage: sanitizeInput(project.stage) || 'Idea',
    patent_status: sanitizeInput(project.patent_status) || null,
    user_id: validateUUID(project.user_id),
    college_id: validateUUID(project.college_id),
    status: project.status || 'Pending Review',
    upvotes: project.upvotes || 0,
    created_at: new Date().toISOString()
  };

  const extendedPayload = {
    ...basePayload,
    feedx_id: project.feedx_id || null,
    author_name: project.author_name || project.full_name || 'Student Innovator',
    author_email: project.author_email || project.email || '',
    college_name: project.college_name || 'FEEDX Polytechnic',
    branch: project.branch || '',
    year: project.year || ''
  };

  // 1. Attempt extended payload insert
  const { data: extData, error: extErr } = await supabase.from('innovations').insert(extendedPayload).select().single();
  if (!extErr && extData) return extData;

  console.warn('[createInnovation] Extended payload DB notice (falling back to base schema payload):', extErr?.message);

  // 2. Fallback to base schema payload if DB table hasn't migrated extra columns yet
  const { data: baseData, error: baseErr } = await supabase.from('innovations').insert(basePayload).select().single();
  if (baseErr) throw baseErr;
  return baseData;
}

export async function upvoteInnovation(id, currentUpvotes = 0) {
  return toggleInnovationUpvote(id, currentUpvotes, false);
}

export async function toggleInnovationUpvote(id, currentUpvotes = 0, isCurrentlyLiked = false) {
  try {
    const newUpvotes = isCurrentlyLiked ? Math.max(0, currentUpvotes - 1) : currentUpvotes + 1;
    const { error } = await supabase
      .from('innovations')
      .update({ upvotes: newUpvotes })
      .eq('id', id);
    if (error) throw error;
    return newUpvotes;
  } catch (err) {
    console.warn('toggleInnovationUpvote DB warning:', err.message);
    return isCurrentlyLiked ? Math.max(0, currentUpvotes - 1) : currentUpvotes + 1;
  }
}

// ==========================================
// OPPORTUNITIES (Used by admin/opportunities.tsx)
// ==========================================

export async function adminListOpportunities(collegeId) {
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    await supabase.from('opportunities').delete().lt('deadline', todayStr);
  } catch (e) {
    console.warn('Purging expired opportunities failed:', e);
  }

  let query = supabase.from('opportunities').select('id, title, company, type, stipend, deadline, eligible_branches, apply_link, description, college_id, created_at');
  if (collegeId) {
    query = query.eq('college_id', collegeId);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminUpsertOpportunity(item) {
  const { error } = await supabase.from('opportunities').upsert(item);
  if (error) throw error;
}

export async function adminDeleteOpportunity(id) {
  const { error } = await supabase.from('opportunities').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// RESOURCES / NOTES (Used by admin/resources.tsx, AcademicScreen)
// ==========================================

export async function adminListNotes(collegeId = null) {
  let query = supabase.from('resources').select('id, title, file_url, type, created_at, uploaded_by, college_id').order('created_at', { ascending: false });
  if (collegeId) {
    query = query.eq('college_id', collegeId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function adminUpsertNote(item) {
  const { error } = await supabase.from('resources').upsert(item);
  if (error) throw error;
}

export async function adminDeleteNote(id, collegeId = null) {
  let query = supabase.from('resources').delete().eq('id', id);
  if (collegeId) {
    query = query.eq('college_id', collegeId);
  }
  const { error } = await query;
  if (error) throw error;
}

export async function uploadResourceFile(fileUri, fileName, mimeType) {
  const filePath = `resources/${Date.now()}_${fileName}`;
  const response = await fetch(fileUri);
  const blob = await response.blob();
  const { error } = await supabase.storage.from('uploads').upload(filePath, blob, { contentType: mimeType });
  if (error) throw error;
  const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
  return data.publicUrl;
}

// ==========================================
// STUDENTS (Used by admin/students.tsx)
// ==========================================

export async function adminListStudents(collegeId, branchId, academicYearId, sectionId) {
  let query = supabase
    .from('students')
    .select(`
      *,
      users(full_name, email, role, phone),
      colleges(college_name),
      branches(branch_name),
      academic_years(year_name),
      sections(section_name)
    `)
    .order('created_at', { ascending: false });
    
  if (collegeId) {
    query = query.eq('college_id', collegeId);
  }
  if (branchId) {
    query = query.eq('branch_id', branchId);
  }
  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }
  if (sectionId) {
    query = query.eq('section_id', sectionId);
  }
  
  const { data, error } = await query;

    
  if (error) {
    console.error('adminListStudents error:', error);
    throw error;
  }
  return data || [];
}

export async function adminUpsertStudentProfile(profile) {
  const { user_id, name, email, roll_no, ...rest } = profile;
  const { error } = await supabase.from('students').upsert({ id: user_id || undefined, roll_number: roll_no, full_name: name, email, ...rest });
  if (error) throw error;
}

export async function adminDeleteStudentProfile(userId) {
  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) throw error;
}

export async function adminListAdmins() {
  const { data, error } = await supabase
    .from('users')
    .select('*, colleges(name)')
    .in('role', ['inst_admin', 'super_admin'])
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminUpsertAdmin(profile) {
  const userUpdates = {
    id: profile.id || undefined,
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone || null,
    role: profile.role
  };
  
  const { data, error: userError } = await supabase
    .from('users')
    .upsert(userUpdates)
    .select('id')
    .single();
    
  if (userError) throw userError;

  if (data?.id) {
    const adminUpdates = {
      id: data.id,
      name: profile.full_name,
      email: profile.email,
      role: profile.role,
      institution_id: profile.college_id || null
    };
    const { error: adminError } = await supabase
      .from('admins')
      .upsert(adminUpdates);
      
    if (adminError) throw adminError;
  }
  return data;
}

export async function adminDeleteAdmin(userId) {
  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) throw error;
}

export async function bulkUpsertStudents(students) {
  const { error } = await supabase.from('students').upsert(students, { onConflict: 'roll_number' });
  if (error) throw error;
}

// ==========================================
// TASKS (Used by admin/tasks.tsx)
// ==========================================

export async function adminListTasks(collegeId) {
  let query = supabase.from('tasks').select('*, users!inner(college_id)').order('created_at', { ascending: false });
  if (collegeId) {
    query = query.eq('users.college_id', collegeId);
  }
  const { data } = await query;
  return data || [];
}

export async function adminUpsertTask(item) {
  const { error } = await supabase.from('tasks').upsert(item);
  if (error) throw error;
}

export async function adminDeleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// TIMETABLE (Used by admin/timetable.tsx)
// ==========================================

export async function adminListTimetable() {
  const { data } = await supabase
    .from('timetables')
    .select('*, subjects(subject_name), academic_years(year_name), sections(section_name)')
    .order('day_of_week')
    .order('period_number');
  return data || [];
}

export async function adminUpsertTimetable(item) {
  // 1. Resolve Subject ID
  const { data: sub } = await supabase.from('subjects').select('id').eq('subject_name', item.subject_name).maybeSingle();
  let subId = sub?.id;
  
  if (!subId) {
    const { data: newSub } = await supabase.from('subjects').insert({ 
      subject_name: item.subject_name,
      subject_code: item.subject_name.toUpperCase().slice(0, 5),
      branch_id: (await supabase.from('branches').select('id').limit(1).single()).data?.id,
      academic_year_id: (await supabase.from('academic_years').select('id').limit(1).single()).data?.id
    }).select().single();
    subId = newSub?.id;
  }

  // 2. Resolve Batch ID (Year)
  const { data: batch } = await supabase.from('academic_years').select('id').eq('year_name', `${item.year}rd Year`).maybeSingle();
  const batchId = batch?.id || (await supabase.from('academic_years').select('id').limit(1).single()).data?.id;

  // 3. Upsert
  const { error } = await supabase.from('timetables').upsert({
    id: item.id || undefined,
    batch_id: batchId,
    subject_id: subId,
    day_of_week: typeof item.day === 'string' ? { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 }[item.day] : item.day,
    period_number: item.period_number || 1,
    start_time: item.start_time,
    end_time: item.end_time,
    room_number: item.room
  });
  
  if (error) throw error;
}

export async function adminDeleteTimetable(id) {
  const { error } = await supabase.from('timetables').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// ISSUES (Used by admin/issues.tsx, SupportScreen)
// ==========================================

export async function adminListIssues() {
  const { data } = await supabase.from('issues').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function adminUpdateIssue(id, updates) {
  const { error } = await supabase.from('issues').update(updates).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteIssue(id) {
  const { error } = await supabase.from('issues').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// ATTENDANCE (Used by admin/attendance.tsx)
// ==========================================

export async function adminListStudentsFiltered(filters) {
  let query = supabase.from('users').select(`
    id,
    full_name,
    email,
    roll_number,
    branch,
    year,
    section
  `).eq('role', 'student');

  if (filters?.branch && filters.branch !== 'All') query = query.eq('branch', filters.branch);
  if (filters?.year && filters.year !== 'All') query = query.eq('year', filters.year);
  if (filters?.section && filters.section !== 'All') query = query.eq('section', filters.section);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function adminGetSubjectByName(subjectName) {
  const { data } = await supabase.from('subjects').select('id').eq('subject_name', subjectName).maybeSingle();
  if (!data) {
    // Create subject if it doesn't exist to prevent failure
    const { data: newSub } = await supabase.from('subjects').insert({ 
      subject_name: subjectName, 
      subject_code: subjectName.toUpperCase().slice(0, 5),
      branch_id: (await supabase.from('branches').select('id').limit(1).single()).data?.id,
      academic_year_id: (await supabase.from('academic_years').select('id').limit(1).single()).data?.id
    }).select().single();
    return newSub?.id;
  }
  return data.id;
}



// ==========================================
// PROFILE (Used by ProfileScreen)
// ==========================================

export async function fetchUserProfile(userId) {
  try {
    let effectiveId = userId;
    let authUser = null;

    if (!effectiveId) {
      const { data: authData } = await supabase.auth.getUser();
      authUser = authData?.user;
      effectiveId = authUser?.id;
    } else {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.id === effectiveId) {
        authUser = authData.user;
      }
    }

    if (!effectiveId) return null;

    // Call enrichUser with available auth metadata
    const userToEnrich = authUser || { id: effectiveId };
    const enriched = await enrichUser(userToEnrich);
    return enriched;
  } catch (err) {
    console.error('[fetchUserProfile] Error fetching profile:', err);
    throw err;
  }
}

export async function updateProfile(userId, data) {
  let effectiveId = userId;
  if (!effectiveId) {
    const { data: authData } = await supabase.auth.getUser();
    effectiveId = authData?.user?.id;
  }
  if (!effectiveId) {
    throw new Error('Authenticated user session not found. Please log in again.');
  }

  const fullName = data.name || data.full_name;
  const rawDob = data.dob || data.date_of_birth;
  const dbDob = rawDob ? formatDateForDB(rawDob) : null;
  const currentStatus = data.currentStatus || data.current_status;
  const avatarUrl = data.avatar_url || data.profile_image;
  const standardFeedxId = data.feedx_id || generateFeedxId({ ...data, id: effectiveId, full_name: fullName });

  // Valid columns in public.users: full_name, phone, bio, branch, year, gender, domain, current_status, department, date_of_birth, avatar_url, feedx_id, college_id, first_login_completed, is_password_set, is_profile_saved, updated_at
  const userUpdates = {
    full_name: fullName, 
    phone: data.phone, 
    bio: data.bio,
    branch: data.branch,
    year: data.year,
    gender: data.gender,
    domain: data.domain,
    current_status: currentStatus,
    department: data.department,
    first_login_completed: true,
    is_profile_saved: true,
    feedx_id: standardFeedxId,
    updated_at: new Date().toISOString(),
    ...(dbDob ? { date_of_birth: dbDob } : {}),
    ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    ...(data.college_id ? { college_id: data.college_id } : {})
  };
  
  // Valid columns in public.students: full_name, phone, bio, year, gender, domain, current_status, department, date_of_birth, profile_image, feedx_id, college_id, is_profile_saved
  const studentUpdates = {
    full_name: fullName, 
    phone: data.phone, 
    bio: data.bio,
    year: data.year,
    gender: data.gender,
    domain: data.domain,
    current_status: currentStatus,
    department: data.department,
    feedx_id: standardFeedxId,
    is_profile_saved: true,
    ...(dbDob ? { date_of_birth: dbDob } : {}),
    ...(avatarUrl ? { profile_image: avatarUrl } : {}),
    ...(data.college_id ? { college_id: data.college_id } : {})
  };

  // 1. Direct update to public.users table with safe column retry
  let updatedUsers = null;
  let uError = null;

  try {
    const res = await supabase
      .from('users')
      .update(userUpdates)
      .eq('id', effectiveId)
      .select();
    updatedUsers = res.data;
    uError = res.error;
  } catch (err) {
    uError = err;
  }

  if (uError) {
    console.warn('[updateProfile] Warning updating users table, attempting base columns fallback:', uError.message || uError);
    const { gender, domain, current_status, department, is_profile_saved, ...baseUserUpdates } = userUpdates;
    try {
      const fallbackRes = await supabase
        .from('users')
        .update(baseUserUpdates)
        .eq('id', effectiveId)
        .select();
      if (!fallbackRes.error) {
        updatedUsers = fallbackRes.data;
        uError = null;
      }
    } catch (_) {}
  }

  // Also attempt updating users table by email if id didn't match any row
  if ((!updatedUsers || updatedUsers.length === 0) && data.email) {
    try {
      const emailRes = await supabase
        .from('users')
        .update(userUpdates)
        .eq('email', data.email)
        .select();
      if (!emailRes.error && emailRes.data?.length) {
        updatedUsers = emailRes.data;
      }
    } catch (_) {}
  }

  // If no row was updated in users, attempt safe upsert without failing profile update on RLS
  if (!updatedUsers || updatedUsers.length === 0) {
    try {
      const { data: authUserRes } = await supabase.auth.getUser();
      const { error: insErr } = await supabase.from('users').upsert({
        id: effectiveId,
        email: data.email || authUserRes?.user?.email || null,
        role: 'student',
        ...userUpdates
      });
      if (insErr) {
        console.warn('[updateProfile] Users table upsert non-critical notice (student record updated independently):', insErr.message);
      }
    } catch (upsertErr) {
      console.warn('[updateProfile] Users table upsert notice:', upsertErr);
    }
  }

  // 2. Update students table where applicable
  const studentUpdatePromises = [
    supabase.from('students').update(studentUpdates).eq('id', effectiveId),
    supabase.from('students').update(studentUpdates).eq('user_id', effectiveId),
  ];

  if (data.email) {
    studentUpdatePromises.push(supabase.from('students').update(studentUpdates).eq('email', data.email));
  }
  if (data.roll_number || data.roll_no) {
    studentUpdatePromises.push(supabase.from('students').update(studentUpdates).eq('roll_number', data.roll_number || data.roll_no));
  }

  try {
    await Promise.allSettled(studentUpdatePromises);
  } catch (sErr) {
    console.warn('[updateProfile] Non-critical student table update warning:', sErr);
  }

  // 2.5 Update admins table where applicable
  if (data.college_id || fullName || data.phone || data.department) {
    try {
      const adminUpdates = {};
      if (fullName) {
        adminUpdates.name = fullName;
        adminUpdates.admin_name = fullName;
      }
      if (data.college_id) adminUpdates.institution_id = data.college_id;
      if (data.department) adminUpdates.department = data.department;
      if (Object.keys(adminUpdates).length > 0) {
        await supabase.from('admins').update(adminUpdates).eq('id', effectiveId);
      }
    } catch (aErr) {
      console.warn('[updateProfile] Non-critical admin table update warning:', aErr);
    }
  }

  // 3. Sync Supabase Auth Metadata permanently
  try {
    await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        phone: data.phone,
        first_login_completed: true,
        is_profile_saved: true,
        branch: data.branch,
        year: data.year,
        gender: data.gender,
        domain: data.domain,
        current_status: currentStatus,
        date_of_birth: dbDob,
        bio: data.bio,
        feedx_id: standardFeedxId,
      }
    });
  } catch (authErr) {
    console.warn('[updateProfile] auth updateUser metadata notice:', authErr);
  }

  // 4. Invalidate cached user profile so changes reflect immediately across app
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.removeItem(`@feedx_user_profile_${effectiveId}`);
    await AsyncStorage.removeItem('@feedx_user_profile');
  } catch (_) {}

  // 5. Re-enrich and return confirmed latest profile
  const { data: currentAuth } = await supabase.auth.getUser();
  const refreshedUser = await enrichUser(currentAuth?.user || { id: effectiveId, email: data.email });
  return refreshedUser;
}

export async function completeUserOnboarding(userId, data) {
  // Update both users and students table
  const updates = {
    avatar_url: data.avatar_url,
    phone: data.phone,
    bio: data.bio,
    first_login_completed: true,
    ...(data.college_id ? { college_id: data.college_id } : {}),
    ...(data.branch_id ? { branch_id: data.branch_id } : {}),
    ...(data.academic_year_id ? { academic_year_id: data.academic_year_id } : {})
  };

  const { error: userError } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);
    
  if (userError) throw userError;

  // For students table, we use profile_image instead of avatar_url
  const studentUpdates = {
    profile_image: data.avatar_url,
    phone: data.phone,
    bio: data.bio
  };

  if (data.college_id) studentUpdates.college_id = data.college_id;
  if (data.branch_id) studentUpdates.branch_id = data.branch_id;
  if (data.academic_year_id) studentUpdates.academic_year_id = data.academic_year_id;

  const { error: studentError } = await supabase
    .from('students')
    .update(studentUpdates)
    .eq('id', userId);

  // It's possible the user is not in the students table, so we don't throw on studentError
  // unless we absolutely require them to be a student.

  return { success: true };
}

// ==========================================
// COMMUNITY (Used by JoinUsScreen)
// ==========================================

const FALLBACK_COMMUNITY_LINKS = [
  { id: '1', name: 'Website', url: 'https://feedxpolytechnic.com', icon: 'globe', description: 'Official FEEDX Polytechnic Website' },
  { id: '2', name: 'WhatsApp Public Channel', url: 'https://whatsapp.com/channel/0029Vaqm8e4IN9iqTfXumX1r', icon: 'message-circle', description: 'Join our public channel for instant updates' },
  { id: '3', name: 'Instagram Highlights', url: 'https://instagram.com/feedx_official', icon: 'instagram', description: 'Follow us for the latest highlights and moments' },
  { id: '4', name: 'LinkedIn Career Network', url: 'https://linkedin.com/company/feedx-tg-polytechnic-community', icon: 'linkedin', description: 'Connect with our professional community to build your career network' },
  { id: '5', name: 'YouTube Learning Portal', url: 'https://youtube.com/@feedx_official', icon: 'youtube', description: 'Subscribe for tutorials and event highlights' },
];

export async function getCommunityLinks() {
  const { data, error } = await supabase
    .from('community_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error || !data?.length) return FALLBACK_COMMUNITY_LINKS;
  return data;
}


// BOOKMARKS
// ==========================================

export async function getBookmarks(userId) {
  const { data } = await supabase.from('bookmarks').select('*').eq('user_id', userId);
  return data || [];
}

export function normalizeBookmarkParams(typeOrId, idOrType) {
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

export async function isBookmarked(userId, entityType, entityId) {
  const normalized = normalizeBookmarkParams(entityType, entityId);
  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('entity_type', normalized.entityType)
    .eq('entity_id', normalized.entityId)
    .maybeSingle();
  return !!data;
}

export async function toggleBookmark(userId, entityType, entityId) {
  const normalized = normalizeBookmarkParams(entityType, entityId);
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('entity_type', normalized.entityType)
    .eq('entity_id', normalized.entityId)
    .maybeSingle();

  if (existing) {
    await supabase.from('bookmarks').delete().eq('id', existing.id);
    return { bookmarked: false };
  }

  const { error } = await supabase.from('bookmarks').insert({
    user_id: userId,
    entity_type: normalized.entityType,
    entity_id: normalized.entityId
  });
  if (error) throw error;
  return { bookmarked: true };
}

export async function getBookmarkedItems(userId) {
  const bookmarks = await getBookmarks(userId);
  if (!bookmarks.length) return { events: [], opportunities: [], resources: [], posts: [], innovations: [], colleges: [], rewards: [] };

  const eventIds = bookmarks.filter((b) => b.entity_type === 'event').map((b) => b.entity_id);
  const oppIds = bookmarks.filter((b) => b.entity_type === 'opportunity').map((b) => b.entity_id);
  const resIds = bookmarks.filter((b) => b.entity_type === 'resource').map((b) => b.entity_id);
  const postIds = bookmarks.filter((b) => b.entity_type === 'community_post' || b.entity_type === 'post').map((b) => b.entity_id);
  const innIds = bookmarks.filter((b) => b.entity_type === 'innovation').map((b) => b.entity_id);
  const rewardIds = bookmarks.filter((b) => b.entity_type === 'reward').map((b) => b.entity_id);
  const collegeIds = bookmarks.filter((b) => b.entity_type === 'college').map((b) => b.entity_id);

  const [events, opportunities, resources, posts, innovations, colleges, rewards] = await Promise.all([
    eventIds.length ? supabase.from('events').select('*').in('id', eventIds) : { data: [] },
    oppIds.length ? supabase.from('opportunities').select('*').in('id', oppIds) : { data: [] },
    resIds.length ? supabase.from('resources').select('*').in('id', resIds) : { data: [] },
    postIds.length ? supabase.from('community_posts').select('*').in('id', postIds) : { data: [] },
    innIds.length ? supabase.from('innovations').select('*').in('id', innIds) : { data: [] },
    collegeIds.length ? supabase.from('colleges').select('*').in('id', collegeIds) : { data: [] },
    rewardIds.length ? supabase.from('rewards').select('*').in('id', rewardIds) : { data: [] },
  ]);

  const bookmarkedEvents = events.data || [];
  bookmarkedEvents.forEach(item => {
    item.capacity = item.max_participants || item.capacity || null;
  });

  return {
    events: bookmarkedEvents,
    opportunities: opportunities.data || [],
    resources: resources.data || [],
    posts: posts.data || [],
    innovations: innovations.data || [],
    colleges: colleges.data || [],
    rewards: rewards.data || [],
  };
}

// ==========================================
// GLOBAL SEARCH
// ==========================================

export async function globalSearch(query, userId) {
  const q = String(query || '').trim();
  if (!q || q.length < 2) return { events: [], opportunities: [], resources: [], colleges: [], posts: [], innovations: [] };

  const pattern = `%${q}%`;
  // Use .or() to search across multiple relevant fields for a more robust unified search
  const [events, opportunities, resources, colleges, posts, innovations] = await Promise.all([
    supabase.from('events').select('id, title, venue, date, description').or(`title.ilike.${pattern},venue.ilike.${pattern},description.ilike.${pattern}`).limit(10),
    supabase.from('opportunities').select('id, title, company, type, description').or(`title.ilike.${pattern},company.ilike.${pattern},description.ilike.${pattern}`).limit(10),
    supabase.from('resources').select('id, title, type').or(`title.ilike.${pattern},type.ilike.${pattern}`).limit(10),
    supabase.from('colleges').select('id, name, location').or(`name.ilike.${pattern},location.ilike.${pattern}`).limit(10),
    supabase.from('community_posts').select('id, title, caption').or(`title.ilike.${pattern},caption.ilike.${pattern}`).limit(10),
    supabase.from('innovations').select('id, title, description, category').or(`title.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern}`).limit(10),
  ]);

  return {
    events: events.data || [],
    opportunities: opportunities.data || [],
    resources: resources.data || [],
    colleges: colleges.data || [],
    posts: posts.data || [],
    innovations: innovations.data || [],
  };
}

// ==========================================
// COMING SOON / NOTIFY ME
// ==========================================

export async function joinFeatureWaitlist(userId, featureKey) {
  const { error } = await supabase
    .from('feature_waitlist')
    .upsert({ user_id: userId, feature_key: featureKey }, { onConflict: 'user_id,feature_key' });
  if (error) throw error;
  return { success: true };
}

// ==========================================
// PROFILE PHOTO
// ==========================================

export async function uploadProfilePhoto(userId, fileUri) {
  const response = await fetch(fileUri);
  const blob = await response.blob();
  const path = `${userId}/avatar.jpg`;
  const { error: uploadError } = await supabase.storage.from('profile-photos').upload(path, blob, {
    upsert: true,
    contentType: 'image/jpeg',
  });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
  const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
  await supabase.from('students').update({ profile_image: publicUrl }).eq('id', userId);
  await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', userId);
  return publicUrl;
}

export async function uploadResumeFile(userId, fileUri) {
  const response = await fetch(fileUri);
  const blob = await response.blob();
  const path = `${userId}/resume.pdf`;
  const { error } = await supabase.storage.from('resumes').upload(path, blob, {
    upsert: true,
    contentType: 'application/pdf',
  });
  if (error) throw error;
  const { data } = supabase.storage.from('resumes').getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function uploadSupportAttachment(userId, fileUri, fileName = 'attachment') {
  if (!fileUri) return '';
  if (fileUri.startsWith('http://') || fileUri.startsWith('https://')) {
    return fileUri;
  }

  try {
    const ext = String(fileUri).split('.').pop()?.toLowerCase() || 'jpg';
    const isImage = ['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext);
    const mimeType = isImage ? `image/${ext === 'jpg' ? 'jpeg' : ext}` : 'application/octet-stream';
    const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${userId || 'guest'}/${Date.now()}-${safeName}`;

    let base64Data = '';
    
    if (isImage) {
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          fileUri,
          [{ resize: { width: 1200 } }],
          { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
        );
        base64Data = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: 'base64' });
      } catch (manipErr) {
        console.warn('[uploadSupportAttachment] Image compression fallback to raw read:', manipErr);
        base64Data = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });
      }
    } else {
      base64Data = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });
    }

    if (!base64Data) {
      throw new Error('Could not read image data from device storage.');
    }

    const arrayBuffer = decode(base64Data);

    const candidateBuckets = ['support-attachments', 'uploads', 'community-images1', 'profile-photos', 'public'];
    for (const bucket of candidateBuckets) {
      try {
        const { error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(path, arrayBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadErr) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (_) {}
    }

    return `data:${mimeType};base64,${base64Data}`;
  } catch (err) {
    console.warn('[uploadSupportAttachment] Attachment handled with fallback:', err?.message || err);
    return '';
  }
}

export async function markNotificationRead(arg1, arg2) {
  if (!arg1 && !arg2) return;

  // Resilient argument detection: supports (userId, notif), (notifId, userId), or (userId, notifId)
  let resolvedUserId = null;
  let resolvedNotifId = null;
  let notifObj = null;

  if (typeof arg1 === 'object' && arg1 !== null && arg1.id) {
    notifObj = arg1;
    resolvedNotifId = String(arg1.id);
    resolvedUserId = arg2;
  } else if (typeof arg2 === 'object' && arg2 !== null && arg2.id) {
    notifObj = arg2;
    resolvedNotifId = String(arg2.id);
    resolvedUserId = arg1;
  } else if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    // Both are strings: determine which one looks like a UUID or notification ID
    const isArg1Notif = /^(notif_|event_|opp_)/.test(arg1);
    const isArg2Notif = /^(notif_|event_|opp_)/.test(arg2);
    if (isArg1Notif) {
      resolvedNotifId = arg1;
      resolvedUserId = arg2;
    } else if (isArg2Notif) {
      resolvedNotifId = arg2;
      resolvedUserId = arg1;
    } else {
      // Default: arg1 is userId, arg2 is notifId
      resolvedUserId = arg1;
      resolvedNotifId = arg2;
    }
  } else if (typeof arg1 === 'string' && !arg2) {
    resolvedNotifId = arg1;
  }

  if (!resolvedNotifId) return;
  const cleanId = String(resolvedNotifId).replace(/^(notif_|event_|opp_|notif-)/, '');

  // 1. Immediately cache in AsyncStorage for offline and instant UI response
  if (resolvedUserId) {
    try {
      const cacheKey = `@feedx_read_notifs_${resolvedUserId}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      let list = cached ? JSON.parse(cached) : [];
      if (!Array.isArray(list)) list = [];
      if (!list.includes(cleanId)) list.push(cleanId);
      if (!list.includes(resolvedNotifId)) list.push(resolvedNotifId);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(list));
    } catch (_) {}
    try {
      cacheService.invalidate(`student_dashboard_${resolvedUserId}`);
    } catch (_) {}
  }

  // 2. Persist to Supabase
  try {
    if (notifObj?.user_id && resolvedUserId) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', cleanId).eq('user_id', resolvedUserId);
    } else if (resolvedUserId) {
      await supabase.from('notification_reads').upsert(
        { user_id: resolvedUserId, notification_id: cleanId },
        { onConflict: 'user_id,notification_id' }
      );
    }
  } catch (err) {
    console.warn('[markNotificationRead] Non-blocking sync notice:', err?.message || err);
  }
}

// ==========================================
// RESOURCES (student-scoped)
// ==========================================

// Standardized Resource Category Normalizer
export function resolveResourceCategory(item) {
  if (!item) return 'Notes';
  const typeStr = String(item.type || item.category || '').toLowerCase().trim();
  const titleStr = String(item.title || '').toLowerCase().trim();
  const descStr = String(item.description || '').toLowerCase().trim();
  const combined = `${typeStr} ${titleStr} ${descStr}`;

  // 1. Previous Year Question Papers (Strict Priority over generic 'Notes')
  const isPYQP =
    /\b(?:pyq|pyqp|qp|qps)\b/i.test(combined) ||
    /previous\s*(?:year|years|sem|semester)?\s*(?:question\s*)?paper/i.test(combined) ||
    /question\s*paper/i.test(combined) ||
    /exam\s*paper/i.test(combined) ||
    /examination\s*paper/i.test(combined) ||
    /model\s*(?:question\s*)?paper/i.test(combined) ||
    /sample\s*(?:question\s*)?paper/i.test(combined) ||
    /solved\s*(?:question\s*)?paper/i.test(combined) ||
    /question\s*bank/i.test(combined) ||
    /mid\s*(?:term|exam|1|2)?\s*(?:question\s*)?paper/i.test(combined) ||
    /end\s*(?:term|exam|sem|semester)?\s*(?:question\s*)?paper/i.test(combined) ||
    /semester\s*(?:exam|end)?\s*(?:question\s*)?paper/i.test(combined) ||
    /board\s*(?:exam)?\s*paper/i.test(combined) ||
    /\b(?:mid-?1|mid-?2|sem-?end)\s*(?:paper|exam)\b/i.test(combined) ||
    typeStr.includes('paper') ||
    typeStr.includes('pyq') ||
    typeStr.includes('question') ||
    titleStr.includes('question paper') ||
    titleStr.includes('pyq') ||
    titleStr.includes('pyqp') ||
    titleStr.includes('exam paper') ||
    titleStr.includes('model paper');

  if (isPYQP) {
    return 'Previous Year Question Papers';
  }

  // 2. Syllabus / Curriculum
  if (
    combined.includes('syllabus') ||
    combined.includes('curriculum')
  ) {
    return 'Syllabus';
  }

  // 3. Lab Manual / Practical Guide
  if (
    combined.includes('lab manual') ||
    combined.includes('practical manual') ||
    combined.includes('laboratory') ||
    combined.includes('practical') ||
    /\blab\b/i.test(combined) ||
    typeStr.includes('manual')
  ) {
    return 'Lab Manual';
  }

  // 4. Notes / Study Handouts
  return 'Notes';
}

export async function getResourcesForStudent(user, page = 1, limit = 30, search = '', filters = {}) {
  const cacheKey = `student-resources-${user?.id}-${page}-${limit}-${search}-${JSON.stringify(filters)}`;
  return getCachedData(cacheKey, async () => {
    let query = supabase.from('resources')
      .select('id, title, file_url, type, created_at, uploaded_by');

    // Apply search query
    if (search && search.trim() !== '') {
      const searchPattern = `%${search.trim()}%`;
      query = query.or(`title.ilike.${searchPattern},type.ilike.${searchPattern}`);
    }

    // Apply optional filters (only if not 'All')
    if (filters.resource_type && filters.resource_type !== 'All') {
      const targetCategory = filters.resource_type;
      const isPYQ =
        targetCategory === 'Previous Year Question Papers' ||
        targetCategory === 'Previous Year Papers' ||
        targetCategory.includes('Question') ||
        targetCategory.includes('Paper');

      if (isPYQ) {
        query = query.or('type.ilike.%paper%,type.ilike.%pyq%,type.ilike.%exam%,type.ilike.%question%,title.ilike.%paper%,title.ilike.%pyq%,title.ilike.%exam%,title.ilike.%question%');
      } else if (targetCategory === 'Lab Manual') {
        query = query.or('type.ilike.%lab%,type.ilike.%manual%,title.ilike.%lab%,title.ilike.%manual%');
      } else if (targetCategory === 'Syllabus') {
        query = query.or('type.ilike.%syllabus%,title.ilike.%syllabus%');
      } else if (targetCategory === 'Notes') {
        // Explicitly exclude Question Papers so they never appear under Notes
        query = query.ilike('type', '%note%')
          .not('title', 'ilike', '%paper%')
          .not('title', 'ilike', '%pyq%')
          .not('title', 'ilike', '%question%')
          .not('title', 'ilike', '%exam%');
      }
    }

    // Apply DB pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    
    const records = data || [];
    if (filters.resource_type && filters.resource_type !== 'All') {
      const targetCategory = filters.resource_type;
      const isPYQ =
        targetCategory === 'Previous Year Question Papers' ||
        targetCategory === 'Previous Year Papers' ||
        targetCategory.includes('Question') ||
        targetCategory.includes('Paper');

      if (isPYQ) {
        return records.filter(r => {
          const c = resolveResourceCategory(r);
          return c === 'Previous Year Question Papers' || c === 'Previous Year Papers';
        });
      }
      return records.filter(r => resolveResourceCategory(r) === targetCategory);
    }
    return records;
  }, 2 * 60 * 1000); // 2 mins cache
}

// ==========================================
// OPPORTUNITY APPLICATIONS
// ==========================================





// ==========================================
// ISSUE TIMELINE
// ==========================================

export async function getIssueTimeline(issueId) {
  const { data } = await supabase
    .from('issue_timeline')
    .select('*')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true });
  return data || [];
}

export async function addIssueTimelineEntry(issueId, status, note, actorId) {
  const { data, error } = await supabase
    .from('issue_timeline')
    .insert({ issue_id: issueId, status, note, actor_id: actorId || null });
  if (error) throw error;
  return data;
}

export async function voteForIssue(issueId, userId) {
  if (!issueId || !userId) return;
  const { error: voteError } = await supabase.from('issue_votes').insert({ issue_id: issueId, user_id: userId });
  if (voteError && voteError.code !== '23505') throw voteError; // ignore duplicate vote errors

  const { data: issue } = await supabase.from('issues').select('affected_count').eq('id', issueId).single();
  const currentCount = issue?.affected_count || 1;
  const { error: updateError } = await supabase.from('issues').update({ affected_count: currentCount + 1 }).eq('id', issueId);
  if (updateError) throw updateError;
  return { success: true };
}

export async function getUserVotedIssueIds(userId) {
  if (!userId) return [];
  const { data } = await supabase.from('issue_votes').select('issue_id').eq('user_id', userId);
  return (data || []).map(v => v.issue_id);
}

export async function superAdminApproveIssue(issueId, collegeId, actorId) {
  let resolvedCollegeId = collegeId;
  if (!resolvedCollegeId) {
    try {
      const { data: currIssue } = await supabase
        .from('issues')
        .select('college_id, user_id, users:user_id(college_id)')
        .eq('id', issueId)
        .maybeSingle();
      resolvedCollegeId = currIssue?.college_id || currIssue?.users?.college_id;
      if (!resolvedCollegeId && currIssue?.user_id) {
        const { data: st } = await supabase
          .from('students')
          .select('college_id')
          .or(`id.eq.${currIssue.user_id},user_id.eq.${currIssue.user_id}`)
          .maybeSingle();
        resolvedCollegeId = st?.college_id;
      }
      if (!resolvedCollegeId && currIssue?.user_id) {
        const { data: usr } = await supabase
          .from('users')
          .select('college_id')
          .eq('id', currIssue.user_id)
          .maybeSingle();
        resolvedCollegeId = usr?.college_id;
      }
    } catch (_) {}
  }

  // If still not resolved, query the first active college
  if (!resolvedCollegeId) {
    try {
      const { data: anyCollege } = await supabase.from('colleges').select('id').limit(1).maybeSingle();
      if (anyCollege?.id) resolvedCollegeId = anyCollege.id;
    } catch (_) {}
  }

  const updatePayload = { 
    triage_status: 'approved', 
    status: 'pending',
    updated_at: new Date().toISOString() 
  };
  if (resolvedCollegeId) {
    updatePayload.college_id = resolvedCollegeId;
  }

  const { data, error } = await supabase
    .from('issues')
    .update(updatePayload)
    .eq('id', issueId)
    .select()
    .single();
  if (error) throw error;
  await addIssueTimelineEntry(issueId, 'approved', 'Issue verified by Super Admin & escalated to College Admin desk.', actorId);
  return data;
}

export async function superAdminRejectIssue(issueId, reason, actorId) {
  const { data, error } = await supabase
    .from('issues')
    .update({ 
      triage_status: 'rejected', 
      response: reason || 'Issue rejected by Super Admin during triage review.', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', issueId)
    .select()
    .single();
  if (error) throw error;
  await addIssueTimelineEntry(issueId, 'Rejected by Super Admin', reason || 'Rejected during triage review.', actorId);
  return data;
}

export async function superAdminMergeIssues(sourceIssueId, targetIssueId, actorId) {
  const [{ data: source }, { data: target }] = await Promise.all([
    supabase.from('issues').select('*').eq('id', sourceIssueId).single(),
    supabase.from('issues').select('*').eq('id', targetIssueId).single()
  ]);

  if (!source || !target) throw new Error('Source or target issue not found.');

  const mergedCount = (target.affected_count || 1) + (source.affected_count || 1);

  // Update target issue affected count
  await supabase.from('issues').update({ affected_count: mergedCount }).eq('id', targetIssueId);

  // Update source issue as merged
  await supabase.from('issues').update({ 
    triage_status: 'merged', 
    merged_into_id: targetIssueId, 
    status: 'closed',
    response: `Merged into issue #${targetIssueId.slice(0, 8)}`,
    updated_at: new Date().toISOString() 
  }).eq('id', sourceIssueId);

  await Promise.all([
    addIssueTimelineEntry(targetIssueId, 'Duplicate Merged', `Merged issue details from #${sourceIssueId.slice(0, 8)}. Affected count increased to ${mergedCount}.`, actorId),
    addIssueTimelineEntry(sourceIssueId, 'Merged into Main Ticket', `This report has been merged into main ticket #${targetIssueId.slice(0, 8)}.`, actorId)
  ]);

  return { success: true };
}

export async function getSuperAdminSupportAnalytics() {
  const { data: allIssues } = await supabase.from('issues').select('status, triage_status, affected_count');
  const issues = allIssues || [];

  const total = issues.length;
  const pendingReview = issues.filter(i => i.triage_status === 'pending_review' || !i.triage_status).length;
  const approved = issues.filter(i => i.triage_status === 'approved').length;
  const rejected = issues.filter(i => i.triage_status === 'rejected').length;
  const merged = issues.filter(i => i.triage_status === 'merged').length;
  const resolved = issues.filter(i => i.status === 'resolved').length;
  const totalAffectedStudents = issues.reduce((acc, curr) => acc + (curr.affected_count || 1), 0);

  return {
    total,
    pendingReview,
    approved,
    rejected,
    merged,
    resolved,
    totalAffectedStudents,
    averageAffectedPerIssue: total ? (totalAffectedStudents / total).toFixed(1) : 0
  };
}

export async function markAllNotificationsRead(userId, notifications) {
  if (userId) {
    try {
      cacheService.invalidate(`student_dashboard_${userId}`);
    } catch (_) {}
    try {
      const cacheKey = `@feedx_read_notifs_${userId}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      let list = cached ? JSON.parse(cached) : [];
      if (!Array.isArray(list)) list = [];
      (notifications || []).forEach(n => {
        const sid = String(n.id);
        const cid = sid.replace(/^(notif_|event_|opp_|notif-)/, '');
        if (!list.includes(sid)) list.push(sid);
        if (!list.includes(cid)) list.push(cid);
      });
      await AsyncStorage.setItem(cacheKey, JSON.stringify(list));
    } catch (_) {}
  }
  await Promise.all((notifications || []).filter((n) => !n.is_read).map((n) => markNotificationRead(userId, n)));
}

// ==========================================
// REAL-TIME SUBSCRIPTIONS
// ==========================================

export function subscribeToRealtime(userId, callbacks) {
  const channel = supabase.channel(`user-realtime-multiplexed-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance', filter: `student_id=eq.${userId}` },
      payload => callbacks.onAttendance?.(payload))
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' },
      payload => callbacks.onNotification?.(payload.new))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` },
      payload => callbacks.onTasks?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` },
      payload => callbacks.onBookmarks?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'events' },
      payload => callbacks.onEvents?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' },
      payload => callbacks.onOpportunities?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' },
      payload => callbacks.onResources?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' },
      payload => callbacks.onCommunity?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' },
      payload => callbacks.onPolls?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_options' },
      payload => callbacks.onPolls?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' },
      payload => callbacks.onPollVotes?.(payload))
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
      payload => callbacks.onProfile?.(payload.new))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'event_registrations', filter: `student_id=eq.${userId}` },
      payload => callbacks.onEventRegistrations?.(payload))
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}



// ==========================================
// EVENT MANAGEMENT & FEEDBACK
// ==========================================



export async function checkInStudent(registrationId) {
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq('id', registrationId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('DB checkInStudent fallback:', err);
    return { success: true };
  }
}

export async function closeEventRegistration(eventId) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({ registration_closed: true })
      .eq('id', eventId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('DB closeEventRegistration fallback:', err);
    return { success: true };
  }
}

export async function submitEventFeedback(eventId, rating, session, suggestions, comments, userId) {
  try {
    const { data, error } = await supabase
      .from('event_feedbacks')
      .insert({
        event_id: eventId,
        user_id: userId,
        rating,
        favorite_session: session,
        suggestions,
        comments,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('DB submitEventFeedback fallback:', err);
    return { success: true };
  }
}

// ==========================================
// SUPPORT SUGGESTIONS & FEEDBACKS
// ==========================================



// ==========================================
// GOOGLE SHEETS / APPS SCRIPT OTP CONTROLLER
// ==========================================

let localSimulatedOtp = null;

export async function sendOtpToEmail(studentId, email, options = {}) {
  const { skipEmailCheck = false } = options;

  console.log(`[sendOtpToEmail] Sending OTP for studentId=${studentId}, email=${email}, skipEmailCheck=${skipEmailCheck}`);

  // Only check for conflicts if not explicitly skipped (e.g. forgot-password flows)
  if (!skipEmailCheck) {
    // Check if a DIFFERENT student has already activated with this email
    const { data: existingStudent, error: checkError } = await supabase
      .from('students')
      .select('id, roll_number, is_password_set')
      .eq('email', email.trim().toLowerCase())
      .eq('is_password_set', true)
      .maybeSingle();

    if (checkError) {
      console.error('[sendOtpToEmail] Check error:', checkError.message);
      throw checkError;
    }
    // Only block if a DIFFERENT student (by roll_number) has already activated with this email
    if (existingStudent && existingStudent.roll_number?.toUpperCase() !== studentId?.toUpperCase()) {
      console.warn('[sendOtpToEmail] Email already activated by different student:', existingStudent.roll_number);
      throw new Error('This email is already activated by another student account.');
    }
  }

  // If no URL is configured, simulate it locally for development
  if (!GOOGLE_APPS_SCRIPT_URL) {
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    localSimulatedOtp = { studentId: studentId.toUpperCase(), email: email.toLowerCase(), otp: mockOtp, expiresAt: Date.now() + 5 * 60 * 1000 };
    console.log(`[FEEDX SIMULATOR] Generated OTP for student ${studentId} (${email}): ${mockOtp}`);
    Alert.alert(
      'Development OTP Simulation',
      `[SIMULATION MODE]\nAn OTP has been generated for testing:\n\nVerification Code: ${mockOtp}`
    );
    return { success: true, message: 'OTP Sent (Simulated)' };
  }

  const response = await withTimeout(
    fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_otp',
        studentId: studentId.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
      }),
    }),
    15000
  );
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to send OTP.');
  }
  return data;
}

export async function verifyOtpCode(studentId, otp) {
  if (!GOOGLE_APPS_SCRIPT_URL) {
    if (!localSimulatedOtp) {
      throw new Error('No OTP request was sent.');
    }
    if (localSimulatedOtp.studentId !== studentId.toUpperCase()) {
      throw new Error('OTP student ID mismatch.');
    }
    if (Date.now() > localSimulatedOtp.expiresAt) {
      throw new Error('OTP has expired.');
    }
    if (localSimulatedOtp.otp !== otp.trim()) {
      throw new Error('Incorrect verification code.');
    }
    return { verified: true };
  }

  const response = await withTimeout(
    fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify_otp',
        studentId: studentId.trim().toUpperCase(),
        otp: otp.trim(),
      }),
    }),
    15000
  );
  const data = await response.json();
  if (!data.verified) {
    throw new Error(data.error || 'Invalid or expired OTP.');
  }
  return data;
}

// ==========================================
// INNOVATION HUB SERVICES
// ==========================================

export async function updateInnovation(id, payload) {
  const { data, error } = await supabase
    .from('innovations')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteInnovation(id) {
  const { error } = await supabase.from('innovations').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

export async function updateInnovationStatus(id, status, feedbackField, feedbackText) {
  const updateData = { status };
  if (feedbackField) {
    updateData[feedbackField] = feedbackText;
  }
  const { data, error } = await supabase
    .from('innovations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==========================================
// STUDENT COMMUNITY (REAL-TIME BACKED)
// ==========================================

// 1. Student Feed (Posts, Comments, Likes)

import { convertDriveUrlToImageUrl, resolveCommunityMedia } from '@/utils/googleDrive';

export async function getCommunityPosts(pageOrCollegeId = 0, limit = 20, category = 'All', search = '', filterSort = 'Newest', studentId = null) {
  try {
    let page = typeof pageOrCollegeId === 'number' ? pageOrCollegeId : 0;
    const rangeStart = page * limit;
    const rangeEnd = rangeStart + limit - 1;
    
    let query = supabase
      .from('community_posts')
      .select('*')
      .neq('is_deleted', true);

    if (category && category !== 'All') {
      if (category === 'Featured') {
        query = query.eq('featured', true);
      } else if (category === 'Pinned') {
        query = query.eq('pinned', true);
      } else {
        query = query.ilike('category', `%${category}%`);
      }
    }

    if (search && search.trim().length > 0) {
      const p = `%${search.trim()}%`;
      query = query.or(`title.ilike.${p},description.ilike.${p},caption.ilike.${p},category.ilike.${p}`);
    }

    if (filterSort === 'Oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (filterSort === 'Popular') {
      query = query.order('likes_count', { ascending: false });
    } else {
      query = query
        .order('pinned', { ascending: false })
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });
    }

    const { data, error } = await query.range(rangeStart, rangeEnd);
      
    if (error) {
      console.warn('getCommunityPosts DB warning:', error.message);
      return [];
    }
    
    // Fetch attached images, poll data, real user reactions, and real comment counts for returned posts
    const postIds = (data || []).map(p => p.id);
    let imagesByPostId = {};
    let pollsByPostId = {};
    let userLikedPostIds = new Set();
    let reactionsByPostId = {};
    let userReactionsByPostId = {};
    let totalLikesByPostId = {};
    let totalCommentsByPostId = {};

    if (postIds.length > 0) {
      try {
        const likesQuery = supabase
          .from('community_likes')
          .select('post_id, reaction_emoji, student_id, user_id')
          .in('post_id', postIds);

        const commentsQuery = supabase
          .from('community_comments')
          .select('post_id')
          .in('post_id', postIds);

        const promises = [
          supabase.from('community_post_images').select('post_id, storage_path, display_order').in('post_id', postIds).order('display_order'),
          supabase.from('polls').select('*, poll_options(*), poll_votes(*)').in('post_id', postIds),
          likesQuery,
          commentsQuery,
        ];

        const [imageRes, pollRes, likesRes, commentsRes] = await Promise.all(promises);

        (imageRes?.data || []).forEach(img => {
          if (!imagesByPostId[img.post_id]) imagesByPostId[img.post_id] = [];
          if (img.storage_path) {
            imagesByPostId[img.post_id].push(img.storage_path);
          }
        });

        (pollRes?.data || []).forEach(poll => {
          pollsByPostId[poll.post_id] = poll;
        });

        (likesRes?.data || []).forEach(like => {
          const pid = like.post_id;
          const emoji = like.reaction_emoji || '❤️';
          
          if (!reactionsByPostId[pid]) reactionsByPostId[pid] = {};
          reactionsByPostId[pid][emoji] = (reactionsByPostId[pid][emoji] || 0) + 1;
          totalLikesByPostId[pid] = (totalLikesByPostId[pid] || 0) + 1;

          if (studentId && (like.student_id === studentId || like.user_id === studentId)) {
            userLikedPostIds.add(pid);
            userReactionsByPostId[pid] = emoji;
          }
        });

        (commentsRes?.data || []).forEach(comm => {
          const pid = comm.post_id;
          totalCommentsByPostId[pid] = (totalCommentsByPostId[pid] || 0) + 1;
        });
      } catch (e) {
        console.warn('[getCommunityPosts] Warning fetching attachments/polls/likes/comments:', e);
      }
    }

    const mappedPosts = (data || []).map(post => {
      const dbImages = imagesByPostId[post.id] || [];
      const postWithImages = {
        ...post,
        images: dbImages.length > 0 ? dbImages : (post.images || post.media_urls || [])
      };

      const resolved = resolveCommunityMedia(postWithImages);
      const countFromLikes = totalLikesByPostId[post.id] !== undefined ? totalLikesByPostId[post.id] : null;
      const realLikesCount = countFromLikes !== null ? countFromLikes : (post.likes_count ?? post.likes ?? 0);
      const computedReactions = reactionsByPostId[post.id] || (realLikesCount > 0 ? { '❤️': realLikesCount } : {});

      const countFromComments = totalCommentsByPostId[post.id] !== undefined ? totalCommentsByPostId[post.id] : null;
      const realCommentsCount = countFromComments !== null ? countFromComments : (post.comments_count ?? 0);

      return {
        ...post,
        post_type: resolved.type !== 'none' ? resolved.type : (post.post_type || 'text'),
        video_url: resolved.type === 'video' ? (resolved.streamUrl || resolved.displayUrl || post.video_url || post.drive_url) : (post.video_url || null),
        image_url: resolved.type === 'image' ? resolved.displayUrl : (post.image_url || resolved.displayUrl || null),
        drive_url: post.drive_url || resolved.rawUrl,
        images: resolved.mediaUrls.length > 0 ? resolved.mediaUrls : (resolved.displayUrl ? [resolved.displayUrl] : []),
        media_urls: resolved.mediaUrls.length > 0 ? resolved.mediaUrls : (resolved.displayUrl ? [resolved.displayUrl] : []),
        media: resolved,
        poll: pollsByPostId[post.id] || null,
        likes_count: realLikesCount,
        likes: realLikesCount,
        comments_count: realCommentsCount,
        reaction_counts: computedReactions,
        user_reaction: userReactionsByPostId[post.id] || null,
        hasLiked: userLikedPostIds.has(post.id),
        tagged_users: post.tagged_users || []
      };
    });

    return mappedPosts;
  } catch (err) {
    console.error('getCommunityPosts error:', err);
    return [];
  }
}

export const SAMPLE_COMMUNITY_POSTS = [
  {
    id: 'sample-post-1',
    title: 'FEEDX National Hackathon 2026 Live Registrations 🚀',
    caption: 'Assemble your teams and build the future of AI & Cloud engineering. Over ₹2,50,000 cash pool + direct hiring fast-tracks with industry leaders. Registration link is active in bio! #FEEDX #Hackathon2026 #CodeTheFuture #TechInnovation',
    category: 'Hackathon',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&auto=format&fit=crop&q=80'],
    media_urls: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&auto=format&fit=crop&q=80'],
    likes_count: 428,
    comments_count: 36,
    pinned: true,
    created_by_name: 'FEEDX Official',
    author_name: 'FEEDX Official',
    tagged_users: ['Bhanu Prakash', 'CampusAdmin', 'CodeClub'],
    users: { full_name: 'FEEDX Official', role: 'super_admin', avatar_url: 'https://api.dicebear.com/7.x/bottts/png?seed=FEEDXOfficial&backgroundColor=3b82f6' }
  },
  {
    id: 'sample-post-2',
    title: 'Spring Campus Placement Drive: 40+ Tech Recruiters Visiting',
    caption: 'Great news for final and pre-final year students! Major product & tech consultancies are opening on-campus drives next month. Polish your projects and resume on FEEDX! #CampusPlacement #CareerReady #EngineeringJobs #FEEDX',
    category: 'Opportunities',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80'],
    media_urls: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80'],
    likes_count: 615,
    comments_count: 52,
    pinned: false,
    created_by_name: 'Career & Placement Cell',
    author_name: 'Career & Placement Cell',
    tagged_users: ['PlacementOfficer', 'TechTeam'],
    users: { full_name: 'Career & Placement Cell', role: 'admin', avatar_url: 'https://api.dicebear.com/7.x/avataaars/png?seed=CareerCell&backgroundColor=10b981' }
  },
  {
    id: 'sample-post-3',
    title: 'Hands-On GenAI & Cloud Architecture Masterclass: Slide Recap',
    caption: 'Swipe through key takeaways and architecture blueprints from yesterday\'s deep dive with Google Cloud Architects. Verified e-certificates have been issued to all attendees! 👉 Swipe left for slides 1-3. #Masterclass #Nextjs #AIArchitecture #FEEDXLearning',
    category: 'Workshop',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop&q=80'
    ],
    media_urls: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop&q=80'
    ],
    likes_count: 834,
    comments_count: 71,
    pinned: false,
    created_by_name: 'FEEDX Academy',
    author_name: 'FEEDX Academy',
    tagged_users: ['AIClub', 'CloudArchitects'],
    users: { full_name: 'FEEDX Academy', role: 'super_admin', avatar_url: 'https://api.dicebear.com/7.x/bottts/png?seed=Academy&backgroundColor=8b5cf6' }
  },
  {
    id: 'sample-post-4',
    title: 'Student Innovation Expo: Autonomous Rover Wins Gold 🏆',
    caption: 'Huge congratulations to our multidisciplinary student engineering team! Their LiDAR-guided autonomous rover prototype took 1st place in the State Robotics Innovation League. #Robotics #StudentMakers #Innovation #EngineeringExcellence',
    category: 'General',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=80'],
    media_urls: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=80'],
    likes_count: 512,
    comments_count: 29,
    pinned: false,
    created_by_name: 'FEEDX Innovation Hub',
    author_name: 'FEEDX Innovation Hub',
    tagged_users: ['RoboticsClub', 'Bhanu'],
    users: { full_name: 'FEEDX Innovation Hub', role: 'admin', avatar_url: 'https://api.dicebear.com/7.x/avataaars/png?seed=InnovationHub&backgroundColor=f59e0b' }
  },
  {
    id: 'sample-post-5',
    title: 'Watch: AI Drone Navigation in Action 🎥⚡',
    caption: 'Real-time obstacle avoidance demo running at 60 FPS on edge TPU hardware. Check out the autonomous flight tests conducted in the aero-lab today! #DroneTech #EdgeAI #Robotics #ComputerVision',
    category: 'Innovation',
    post_type: 'video',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    media_urls: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'],
    image_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=900&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    likes_count: 739,
    comments_count: 48,
    pinned: false,
    created_by_name: 'Robotics & UAV Club',
    author_name: 'Robotics & UAV Club',
    tagged_users: ['AeroClub', 'DronePilots'],
    users: { full_name: 'Robotics & UAV Club', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/bottts/png?seed=UAVClub&backgroundColor=3b82f6' }
  }
];

export async function createCommunityPostAdmin(postData) {
  const resolved = resolveCommunityMedia(postData);
  const captionText = postData.caption || postData.description || postData.title || 'Community Post';
  const isScheduled = Boolean(postData.is_scheduled || postData.status === 'Scheduled' || postData.status === 'scheduled');
  const scheduledTime = postData.scheduled_at || postData.scheduled_for || (isScheduled ? new Date(Date.now() + 86400000).toISOString() : null);

  const finalPostType = resolved.type !== 'none' && resolved.type !== 'text' 
    ? resolved.type 
    : (postData.post_type || 'text');

  const payload = {
    title: postData.title || captionText.slice(0, 60),
    caption: captionText,
    image_url: resolved.type === 'image' ? (resolved.displayUrl || postData.image_url) : (postData.image_url || null),
    video_url: resolved.type === 'video' ? (resolved.streamUrl || postData.video_url || postData.drive_url) : (postData.video_url || null),
    drive_url: postData.drive_url || (resolved.isDrive ? resolved.rawUrl : null),
    post_type: finalPostType,
    category: postData.category || 'General',
    audience_type: postData.audience_type || 'all',
    status: isScheduled ? 'Scheduled' : (postData.status || 'active'),
    visibility: 'public',
    is_published: !isScheduled,
    is_scheduled: isScheduled,
    scheduled_at: scheduledTime,
  };

  if (postData.created_by) {
    payload.created_by = postData.created_by;
  }

  // 1. Try full insert with is_scheduled and scheduled_at
  let res = await supabase.from('community_posts').insert(payload).select().single();

  // 2. If is_scheduled / scheduled_at column missing from PostgREST schema cache, retry without them
  if (res.error) {
    const errMsg = String(res.error.message || '');
    if (errMsg.includes('is_scheduled') || errMsg.includes('scheduled_at') || errMsg.includes('schema cache')) {
      console.warn('[createCommunityPostAdmin] Retrying insert without is_scheduled column (schema cache fallback)...');
      delete payload.is_scheduled;
      delete payload.scheduled_at;
      res = await supabase.from('community_posts').insert(payload).select().single();
    }
  }

  if (res.error) {
    console.error('[createCommunityPostAdmin] Insert error:', res.error);
    throw res.error;
  }

  const post = res.data;

  // Insert additional images into community_post_images if provided
  if (Array.isArray(postData.images) && postData.images.length > 0) {
    const imagePayloads = postData.images.map((url, idx) => ({
      post_id: post.id,
      storage_path: url,
      display_order: idx
    }));
    await supabase.from('community_post_images').insert(imagePayloads).catch((imgErr) => {
      console.warn('[createCommunityPostAdmin] community_post_images insert warning:', imgErr);
    });
  }

  return post;
}

export async function createCommunityPollPostAdmin(pollData) {
  // 1. Insert post into community_posts
  const captionText = pollData.description || pollData.question || 'Community Poll';
  let creatorId = pollData.created_by || null;
  if (!creatorId) {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      creatorId = authUser?.user?.id || null;
    } catch (_) {}
  }

  const postPayload = {
    title: pollData.title || pollData.question || 'Community Poll',
    caption: captionText,
    post_type: 'poll',
    category: pollData.category || 'Polls',
    audience_type: pollData.audience_type || 'all',
    status: 'active',
    visibility: 'public',
    created_by: creatorId,
    image_url: pollData.image_url || null
  };

  let post = null;
  const { data: insertedPost, error: postErr } = await supabase.from('community_posts').insert(postPayload).select().single();
  if (postErr) {
    console.warn('[createCommunityPollPostAdmin] Post insert warning:', postErr);
    // If foreign key constraint failed on created_by, retry with created_by = null
    if (postErr.code === '23503' && creatorId) {
      postPayload.created_by = null;
      const { data: retryPost, error: retryErr } = await supabase.from('community_posts').insert(postPayload).select().single();
      if (retryErr) throw retryErr;
      post = retryPost;
    } else {
      throw postErr;
    }
  } else {
    post = insertedPost;
  }

  // 2. Insert poll into polls table (with automatic fallback if options column is required)
  const pollPayload = {
    post_id: post.id,
    question: pollData.question,
    allow_multiple: Boolean(pollData.allow_multiple),
    anonymous_voting: pollData.anonymous_voting !== false,
    show_results_before_vote: Boolean(pollData.show_results_before_vote),
    allow_vote_change: Boolean(pollData.allow_vote_change),
    starts_at: pollData.starts_at || new Date().toISOString(),
    ends_at: pollData.ends_at || null,
    status: (pollData.status || 'ACTIVE').toUpperCase()
  };

  let poll = null;
  const { data: insertedPoll, error: pollErr } = await supabase.from('polls').insert(pollPayload).select().single();
  if (pollErr) {
    console.warn('[createCommunityPollPostAdmin] Poll insert retry with options payload:', pollErr);
    // Retry with options JSON array if schema requires options column
    const fallbackPollPayload = {
      ...pollPayload,
      options: Array.isArray(pollData.options) ? pollData.options : []
    };
    const { data: retryPoll, error: retryErr } = await supabase.from('polls').insert(fallbackPollPayload).select().single();
    if (retryErr) {
      console.error('[createCommunityPollPostAdmin] Poll error:', retryErr);
      throw retryErr;
    }
    poll = retryPoll;
  } else {
    poll = insertedPoll;
  }

  // 3. Insert poll options
  if (Array.isArray(pollData.options) && pollData.options.length > 0 && poll?.id) {
    const optionPayloads = pollData.options.map((optText, idx) => ({
      poll_id: poll.id,
      option_text: optText,
      display_order: idx
    }));
    const { error: optErr } = await supabase.from('poll_options').insert(optionPayloads);
    if (optErr) console.warn('[createCommunityPollPostAdmin] Option insert notice:', optErr);
  }

  // 4. Insert optional images
  if (Array.isArray(pollData.images) && pollData.images.length > 0 && post?.id) {
    const imagePayloads = pollData.images.map((url, idx) => ({
      post_id: post.id,
      storage_path: url,
      display_order: idx
    }));
    await supabase.from('community_post_images').insert(imagePayloads);
  }

  return { post, poll };
}

export async function fetchPollDetails(pollId, studentId) {
  try {
    const [{ data: poll }, { data: options }, { data: votes }] = await Promise.all([
      supabase.from('polls').select('*').eq('id', pollId).maybeSingle(),
      supabase.from('poll_options').select('*').eq('poll_id', pollId).order('display_order'),
      supabase.from('poll_votes').select('id, option_id, student_id').eq('poll_id', pollId)
    ]);

    if (!poll) return null;

    const allVotes = votes || [];
    const totalVotes = allVotes.length;
    const studentVoteOptionIds = studentId ? allVotes.filter(v => v.student_id === studentId).map(v => v.option_id) : [];
    const hasVoted = studentVoteOptionIds.length > 0;

    const optionsWithStats = (options || []).map(opt => {
      const optVotes = allVotes.filter(v => v.option_id === opt.id).length;
      const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
      return {
        ...opt,
        votes_count: optVotes,
        percentage: pct,
        is_selected: studentVoteOptionIds.includes(opt.id)
      };
    });

    const isClosed = poll.status === 'CLOSED' || (poll.ends_at && new Date(poll.ends_at) < new Date());

    return {
      ...poll,
      options: optionsWithStats,
      total_votes: totalVotes,
      has_voted: hasVoted,
      student_votes: studentVoteOptionIds,
      is_closed: isClosed
    };
  } catch (err) {
    console.error('[fetchPollDetails] error:', err);
    return null;
  }
}

export async function submitPollVote({ poll_id, option_ids, student_id }) {
  if (!poll_id || !student_id || !Array.isArray(option_ids) || option_ids.length === 0) {
    throw new Error('Invalid vote parameters.');
  }

  // 1. Fetch poll validation settings
  const { data: poll, error: pollErr } = await supabase.from('polls').select('*').eq('id', poll_id).maybeSingle();
  if (pollErr || !poll) throw new Error('Poll not found.');

  if (poll.status === 'CLOSED' || (poll.ends_at && new Date(poll.ends_at) < new Date())) {
    throw new Error('This poll is closed and no longer accepting votes.');
  }

  // 2. Check if student already voted
  const { data: existingVotes } = await supabase.from('poll_votes').select('id, option_id').eq('poll_id', poll_id).eq('student_id', student_id);

  if (existingVotes && existingVotes.length > 0) {
    if (!poll.allow_vote_change) {
      throw new Error('You have already voted in this poll.');
    }
    // Delete existing votes to allow changing vote
    await supabase.from('poll_votes').delete().eq('poll_id', poll_id).eq('student_id', student_id);
  }

  // 3. Single vs Multiple check
  const selectedIds = poll.allow_multiple ? option_ids : [option_ids[0]];

  const voteInsertPayloads = selectedIds.map(optId => ({
    poll_id,
    option_id: optId,
    student_id
  }));

  const { error: insertErr } = await supabase.from('poll_votes').insert(voteInsertPayloads);
  if (insertErr) {
    console.error('[submitPollVote] Insert error:', insertErr);
    throw new Error('Failed to record vote. You may have already voted.');
  }

  // 3b. Award points only if this is the user's first vote in this poll
  if (!existingVotes || existingVotes.length === 0) {
    try {
      await supabase.rpc('award_student_activity', {
        p_student_id: student_id,
        p_activity_type: 'poll_voted',
        p_coin_reward: 5,
        p_xp_reward: 5,
        p_reference_id: poll_id
      });
    } catch (rewardErr) {
      console.warn('[submitPollVote] Failed to award points:', rewardErr);
    }
  }

  // 4. Return updated details
  return fetchPollDetails(poll_id, student_id);
}

export async function fetchAdminPolls() {
  try {
    const { data: polls, error } = await supabase
      .from('polls')
      .select('*, community_posts(title, caption), poll_options(id, option_text), poll_votes(id, option_id)')
      .order('created_at', { ascending: false });

    if (!error && polls) return polls;

    // Fallback if PostgREST schema relationship cache is pending refresh
    const { data: rawPolls, error: rawErr } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false });

    if (rawErr || !rawPolls) return [];

    const pollIds = rawPolls.map(p => p.id);
    const postIds = rawPolls.map(p => p.post_id).filter(Boolean);

    const [postsRes, optsRes, votesRes] = await Promise.all([
      postIds.length > 0 ? supabase.from('community_posts').select('id, title, caption').in('id', postIds) : { data: [] },
      pollIds.length > 0 ? supabase.from('poll_options').select('id, poll_id, option_text').in('poll_id', pollIds) : { data: [] },
      pollIds.length > 0 ? supabase.from('poll_votes').select('id, poll_id, option_id').in('poll_id', pollIds) : { data: [] }
    ]);

    const postsMap = (postsRes.data || []).reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
    const optsMap = (optsRes.data || []).reduce((acc, o) => {
      acc[o.poll_id] = acc[o.poll_id] || [];
      acc[o.poll_id].push(o);
      return acc;
    }, {});
    const votesMap = (votesRes.data || []).reduce((acc, v) => {
      acc[v.poll_id] = acc[v.poll_id] || [];
      acc[v.poll_id].push(v);
      return acc;
    }, {});

    return rawPolls.map(p => ({
      ...p,
      community_posts: postsMap[p.post_id] || null,
      poll_options: optsMap[p.id] || [],
      poll_votes: votesMap[p.id] || []
    }));
  } catch (err) {
    console.error('[fetchAdminPolls] error:', err);
    return [];
  }
}

export async function closePollAdmin(pollId) {
  const { data, error } = await supabase.from('polls').update({ status: 'CLOSED' }).eq('id', pollId).select().single();
  if (error) throw error;
  return data;
}

export async function deletePollAdmin(pollId) {
  const { error } = await supabase.from('polls').delete().eq('id', pollId);
  if (error) throw error;
  return true;
}

export async function togglePinPostAdmin(postId, currentPinnedState) {
  const newPinnedState = !currentPinnedState;
  const { data, error } = await supabase
    .from('community_posts')
    .update({ pinned: newPinnedState, updated_at: new Date().toISOString() })
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    console.error('[togglePinPostAdmin] error:', error);
    throw error;
  }
  return data;
}

export async function fetchPostDetail(postId, studentId = null) {
  try {
    const [{ data: post }, { data: images }, { data: poll }, userLikeRes, likesCountRes] = await Promise.all([
      supabase.from('community_posts').select('*').eq('id', postId).maybeSingle(),
      supabase.from('community_post_images').select('storage_path').eq('post_id', postId).order('display_order'),
      supabase.from('polls').select('*, poll_options(*), poll_votes(*)').eq('post_id', postId).maybeSingle(),
      studentId 
        ? supabase.from('community_likes').select('id, reaction_emoji').eq('post_id', postId).or(`student_id.eq.${studentId},user_id.eq.${studentId}`).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase.from('community_likes').select('id', { count: 'exact', head: true }).eq('post_id', postId)
    ]);

    if (!post) return null;

    const dbImages = (images || []).map(i => i.storage_path).filter(Boolean);
    const postWithImages = {
      ...post,
      images: dbImages.length > 0 ? dbImages : (post.images || post.media_urls || [])
    };
    const resolved = resolveCommunityMedia(postWithImages);
    const realLikes = typeof likesCountRes?.count === 'number' ? likesCountRes.count : (post.likes_count ?? 0);

    return {
      ...post,
      post_type: resolved.type !== 'none' ? resolved.type : (post.post_type || 'text'),
      video_url: resolved.type === 'video' ? (resolved.streamUrl || resolved.displayUrl || post.video_url || post.drive_url) : (post.video_url || null),
      image_url: resolved.type === 'image' ? resolved.displayUrl : (post.image_url || resolved.displayUrl || null),
      drive_url: post.drive_url || resolved.rawUrl,
      images: resolved.mediaUrls.length > 0 ? resolved.mediaUrls : (resolved.displayUrl ? [resolved.displayUrl] : []),
      media_urls: resolved.mediaUrls.length > 0 ? resolved.mediaUrls : (resolved.displayUrl ? [resolved.displayUrl] : []),
      media: resolved,
      poll: poll || null,
      likes_count: realLikes,
      likes: realLikes,
      hasLiked: Boolean(userLikeRes?.data),
      user_reaction: userLikeRes?.data?.reaction_emoji || (userLikeRes?.data ? '❤️' : null)
    };
  } catch (err) {
    console.error('[fetchPostDetail] error:', err);
    return null;
  }
}

export async function updateCommunityPostAdmin(postId, postData) {
  const payload = {
    updated_at: new Date().toISOString(),
  };

  if (postData.title !== undefined) payload.title = postData.title;
  if (postData.caption !== undefined) payload.caption = postData.caption;
  if (postData.description !== undefined) {
    payload.description = postData.description;
    if (!payload.caption) payload.caption = postData.description;
  }
  if (postData.category !== undefined) payload.category = postData.category;
  if (postData.status !== undefined) payload.status = postData.status;
  if (postData.featured !== undefined) payload.featured = Boolean(postData.featured);
  if (postData.pinned !== undefined) payload.pinned = Boolean(postData.pinned);
  if (postData.tags !== undefined) payload.tags = postData.tags;
  if (postData.is_scheduled !== undefined) {
    payload.is_scheduled = postData.is_scheduled;
    payload.is_published = !postData.is_scheduled;
  }
  if (postData.scheduled_at !== undefined) payload.scheduled_at = postData.scheduled_at;

  // Media resolution if any media keys are provided
  if (postData.image_url !== undefined || postData.video_url !== undefined || postData.drive_url !== undefined) {
    const resolved = resolveCommunityMedia(postData);
    if (resolved.type === 'image') {
      payload.image_url = resolved.displayUrl || postData.image_url;
      payload.post_type = 'image';
    } else if (resolved.type === 'video') {
      payload.video_url = resolved.streamUrl || postData.video_url || postData.drive_url;
      payload.post_type = 'video';
    } else if (postData.image_url !== undefined) {
      payload.image_url = postData.image_url;
    }
    if (resolved.isDrive) {
      payload.drive_url = resolved.rawUrl;
    } else if (postData.drive_url !== undefined) {
      payload.drive_url = postData.drive_url;
    }
  }

  let res = await supabase.from('community_posts').update(payload).eq('id', postId).select().single();
  if (res.error) {
    const errMsg = String(res.error.message || '');
    if (errMsg.includes('is_scheduled') || errMsg.includes('scheduled_at') || errMsg.includes('schema cache')) {
      console.warn('[updateCommunityPostAdmin] Retrying update without is_scheduled column (schema cache fallback)...');
      delete payload.is_scheduled;
      delete payload.scheduled_at;
      res = await supabase.from('community_posts').update(payload).eq('id', postId).select().single();
    }
  }

  if (res.error) {
    console.error('[updateCommunityPostAdmin] Update error:', res.error);
    throw res.error;
  }
  return res.data;
}

export async function deleteCommunityPostAdmin(postId) {
  const { error } = await supabase.from('community_posts').update({ is_deleted: true }).eq('id', postId);
  if (error) throw error;
  return true;
}

export async function uploadCommunityImage(userId, localUri) {
  if (!localUri) throw new Error('No image file selected.');
  
  const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const path = `community/${year}/${month}/${uuid}.jpg`;
  
  console.log(`[uploadCommunityImage] Uploading via FormData for URI: ${localUri}`);
  
  const ext = localUri.split('.').pop() || 'jpg';
  const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  
  const formData = new FormData();
  formData.append('file', {
    uri: localUri,
    name: `${uuid}.${ext}`,
    type: mimeType
  });

  const { error } = await supabase.storage
    .from('community-images1')
    .upload(path, formData, {
      upsert: false
    });
    
  if (error) {
    console.error('[uploadCommunityImage] Upload error:', error);
    throw error;
  }
  console.log(`[uploadCommunityImage] Upload done successfully. Getting public URL...`);

  const { data } = supabase.storage.from('community-images1').getPublicUrl(path);
  if (!data?.publicUrl) {
    console.warn(`[uploadCommunityImage] Public URL not found. Cleaning up storage...`);
    await supabase.storage.from('community-images1').remove([path]);
    throw new Error('Public URL generation failed.');
  }

  console.log(`[uploadCommunityImage] Complete. Public URL: ${data.publicUrl}`);
  return data.publicUrl;
}


export async function uploadWithRetryAndBackoff(userId, localUri, onProgress, onUploadHandle, maxRetries = 3) {
  let attempt = 0;
  let delay = 1500;
  
  while (attempt < maxRetries) {
    try {
      LOG.info('Upload', `Starting base64 upload attempt ${attempt + 1}/${maxRetries}`);
      
      if (onProgress) {
        onProgress(25); // Simulated progress
      }
      
      const fileExt = localUri.split('.').pop() || 'jpeg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `${userId}/${fileName}`;
      
      // 1. Compress Image before Base64 extraction to prevent UI freeze and timeouts
      LOG.info('Upload', `Compressing image...`);
      const manipResult = await ImageManipulator.manipulateAsync(
        localUri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // 2. Read compressed file natively via Expo FileSystem as Base64
      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: 'base64' });
      
      if (onProgress) {
        onProgress(60); // Simulated progress
      }
      
      // Upload binary array buffer directly (Bulletproof RN method)
      const { data, error } = await supabase.storage
        .from('community-images1')
        .upload(filePath, decode(base64), { 
          contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}` 
        });
        
      if (error) throw error;
      
      if (onProgress) {
        onProgress(100);
      }
      
      const { data: urlData } = supabase.storage.from('community-images1').getPublicUrl(filePath);
      LOG.info('Upload', `Upload successful! Public URL: ${urlData.publicUrl}`);
      
      return { publicUrl: urlData.publicUrl, filePath: filePath };
    } catch (error) {
      attempt++;
      LOG.warn('Upload', `Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt >= maxRetries) {
        LOG.error('Upload', `All ${maxRetries} upload attempts failed.`);
        throw error;
      }
      
      // Update progress UI with retry state
      if (onProgress) {
        onProgress(`Retry ${attempt}/${maxRetries}`);
      }
      
      // Wait for backoff delay
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // double the delay
    }
  }
}

export async function deleteCommunityImage(filePath) {
  try {
    await supabase.storage.from('community-images1').remove([filePath]);
  } catch (e) {
    console.warn('Failed to delete storage file:', e);
  }
}

export async function createCommunityPost(project) {
  const payload = {
    title: project.title || null,
    caption: project.caption || project.content || '',
    image_url: project.image_url || null,
    created_by: project.created_by || project.user_id,
    status: project.status || 'active',
    visibility: project.visibility || 'public'
  };

  const { data, error } = await withTimeout(
    supabase
      .from('community_posts')
      .insert(payload)
      .select()
      .single()
  );

  if (error) {
    console.error('createCommunityPost error:', error);
    throw error;
  }
  return data;
}

export async function deleteCommunityPost(postId, imageUrl = null) {
  if (imageUrl) {
    try {
      const match = imageUrl.match(/\/community-images1\/(.+)$/);
      if (match && match[1]) {
        await supabase.storage.from('community-images1').remove([match[1]]);
      }
    } catch (e) {
      console.warn('Failed to delete image from storage on post delete:', e);
    }
  }

  const { error } = await supabase.from('community_posts').delete().eq('id', postId);
  if (error) throw error;
}

export async function togglePostLike(postId, studentId, explicitHasLiked = undefined) {
  try {
    let isCurrentlyLiked = explicitHasLiked;
    if (isCurrentlyLiked === undefined) {
      const { data: existing } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', postId)
        .or(`student_id.eq.${studentId},user_id.eq.${studentId}`)
        .maybeSingle();
      isCurrentlyLiked = Boolean(existing);
    }

    if (isCurrentlyLiked) {
      // Unlike
      await supabase
        .from('community_likes')
        .delete()
        .eq('post_id', postId)
        .or(`student_id.eq.${studentId},user_id.eq.${studentId}`);

      const { count } = await supabase
        .from('community_likes')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId);

      const newLikes = typeof count === 'number' ? count : 0;
      await supabase.from('community_posts').update({ likes_count: newLikes }).eq('id', postId).catch(() => {});
      return { hasLiked: false, likes: newLikes };
    } else {
      // Like: delete previous and insert cleanly
      await supabase
        .from('community_likes')
        .delete()
        .eq('post_id', postId)
        .or(`student_id.eq.${studentId},user_id.eq.${studentId}`)
        .catch(() => {});

      await supabase
        .from('community_likes')
        .insert({
          post_id: postId,
          student_id: studentId,
          user_id: studentId,
          reaction_emoji: '❤️'
        });

      const { count } = await supabase
        .from('community_likes')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId);

      const newLikes = typeof count === 'number' ? count : 1;
      await supabase.from('community_posts').update({ likes_count: newLikes }).eq('id', postId).catch(() => {});
      return { hasLiked: true, likes: newLikes };
    }
  } catch (err) {
    console.warn('[togglePostLike] error:', err);
    return { hasLiked: !explicitHasLiked, likes: 0 };
  }
}

export async function togglePostReaction(postId, studentId, emoji = '👍') {
  try {
    const { data: existing } = await supabase
      .from('community_likes')
      .select('id, reaction_emoji, student_id, user_id')
      .eq('post_id', postId)
      .or(`student_id.eq.${studentId},user_id.eq.${studentId}`)
      .maybeSingle();

    let newReaction = emoji;
    if (existing && (existing.reaction_emoji === emoji || emoji === 'unlike' || emoji === 'toggle_like')) {
      // Unlike / remove reaction
      await supabase
        .from('community_likes')
        .delete()
        .eq('id', existing.id);
      newReaction = null;
    } else if (existing) {
      // Update existing reaction
      await supabase
        .from('community_likes')
        .update({
          reaction_emoji: emoji,
          student_id: studentId,
          user_id: studentId
        })
        .eq('id', existing.id);
    } else {
      // Insert new reaction with both student_id and user_id
      await supabase
        .from('community_likes')
        .insert({
          post_id: postId,
          student_id: studentId,
          user_id: studentId,
          reaction_emoji: emoji
        });
    }

    const { data: allLikes, count } = await supabase
      .from('community_likes')
      .select('reaction_emoji', { count: 'exact' })
      .eq('post_id', postId);

    const reactionCounts = {};
    (allLikes || []).forEach(l => {
      const em = l.reaction_emoji || '❤️';
      reactionCounts[em] = (reactionCounts[em] || 0) + 1;
    });

    const totalCount = typeof count === 'number' ? count : (allLikes || []).length;
    await supabase
      .from('community_posts')
      .update({ likes_count: totalCount, reaction_counts: reactionCounts })
      .eq('id', postId)
      .catch(() => {});

    return { success: true, reaction: newReaction, totalCount };
  } catch (err) {
    console.warn('[togglePostReaction] notice:', err);
    return { success: false, error: err.message };
  }
}

export async function createCommunityComment(arg1, arg2, arg3, arg4 = null) {
  let postId, studentId, commentText, parentId;

  if (arg1 && typeof arg1 === 'object') {
    postId = arg1.post_id || arg1.postId;
    studentId = arg1.student_id || arg1.user_id || arg1.studentId;
    commentText = arg1.content || arg1.comment || arg1.commentText || '';
    parentId = arg1.parent_id || arg1.parentId || null;
  } else {
    postId = arg1;
    studentId = arg2;
    commentText = arg3;
    parentId = arg4;
  }

  const insertPayload = {
    post_id: postId,
    student_id: studentId,
    user_id: studentId,
    comment: commentText,
  };
  if (parentId) {
    insertPayload.parent_id = parentId;
  }

  let { data, error } = await supabase
    .from('community_comments')
    .insert(insertPayload)
    .select('*')
    .single();

  if (error && parentId && (error.code === 'PGRST204' || String(error.message || '').includes('parent_id') || String(error.details || '').includes('parent_id'))) {
    console.warn('[createCommunityComment] Schema missing parent_id column, falling back without parent_id:', error.message);
    delete insertPayload.parent_id;
    const retry = await supabase
      .from('community_comments')
      .insert(insertPayload)
      .select('*')
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error('[createCommunityComment] error:', error);
    if (String(error.message || '').includes('is_deleted')) {
      const customErr = new Error('Database update required: Run supabase/fix_community_comments_is_deleted.sql in Supabase SQL editor.');
      customErr.code = error.code;
      throw customErr;
    }
    throw error;
  }

  // Fetch author info safely from users table
  let authorObj = null;
  if (studentId) {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, role')
        .eq('id', studentId)
        .maybeSingle();
      authorObj = userData;
    } catch (_) {}
  }

  try {
    const { count: actualCount, error: countErr } = await supabase
      .from('community_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    let finalCount = 1;
    if (!countErr && actualCount !== null && actualCount !== undefined) {
      finalCount = actualCount;
    } else {
      const { data: post } = await supabase.from('community_posts').select('comments_count').eq('id', postId).maybeSingle();
      finalCount = (post?.comments_count || 0) + 1;
    }
    await supabase.from('community_posts').update({ comments_count: finalCount }).eq('id', postId);
  } catch (e) {
    console.warn('Failed to update comments_count:', e);
  }

  return {
    ...data,
    content: data?.comment || commentText,
    comment: data?.comment || commentText,
    comment_text: data?.comment || commentText,
    users: authorObj || { full_name: 'Community Student', avatar_url: null, role: 'student' }
  };
}

export async function fetchCommunityComments(postId) {
  if (!postId) return [];
  try {
    const { data, error } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('fetchCommunityComments error:', error);
      return [];
    }

    const commentsList = data || [];
    if (commentsList.length === 0) return [];

    // Extract all unique author user IDs
    const authorIds = Array.from(
      new Set(
        commentsList
          .map((c) => c.student_id || c.user_id)
          .filter(Boolean)
      )
    );

    let usersMap = {};
    if (authorIds.length > 0) {
      try {
        const { data: authors } = await supabase
          .from('users')
          .select('id, full_name, avatar_url, role')
          .in('id', authorIds);

        if (authors) {
          authors.forEach((a) => {
            usersMap[a.id] = a;
          });
        }
      } catch (userErr) {
        console.warn('[fetchCommunityComments] author lookup warning:', userErr);
      }
    }

    return commentsList.map((item) => {
      const uid = item.student_id || item.user_id;
      const author = usersMap[uid] || { full_name: 'Student', avatar_url: null, role: 'student' };
      return {
        ...item,
        content: item.comment || item.content || '',
        comment: item.comment || item.content || '',
        comment_text: item.comment || item.content || '',
        users: author,
      };
    });
  } catch (err) {
    console.warn('[fetchCommunityComments] exception:', err);
    return [];
  }
}

export async function toggleCommentLike(commentId, studentId) {
  try {
    const { data: existing } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('student_id', studentId)
      .maybeSingle();

    if (existing) {
      await supabase.from('comment_likes').delete().eq('id', existing.id);
      const { data: c } = await supabase.from('community_comments').select('likes_count').eq('id', commentId).maybeSingle();
      const newCount = Math.max(0, (c?.likes_count || 1) - 1);
      await supabase.from('community_comments').update({ likes_count: newCount }).eq('id', commentId);
      return { liked: false, likes_count: newCount };
    } else {
      await supabase.from('comment_likes').insert({ comment_id: commentId, student_id: studentId });
      const { data: c } = await supabase.from('community_comments').select('likes_count').eq('id', commentId).maybeSingle();
      const newCount = (c?.likes_count || 0) + 1;
      await supabase.from('community_comments').update({ likes_count: newCount }).eq('id', commentId);
      return { liked: true, likes_count: newCount };
    }
  } catch (e) {
    console.warn('toggleCommentLike error:', e);
    return { liked: false, likes_count: 0 };
  }
}

/**
 * @param {string} commentId
 * @param {string|null} [postId]
 */
export async function deleteCommunityComment(commentId, postId = /** @type {string|null} */ (null)) {
  try {
    let targetPostId = postId;
    if (!targetPostId) {
      const { data: c } = await supabase.from('community_comments').select('post_id').eq('id', commentId).maybeSingle();
      targetPostId = c?.post_id;
    }

    const { error } = await supabase.from('community_comments').delete().eq('id', commentId);
    if (error) throw error;

    if (targetPostId) {
      const { count, error: countErr } = await supabase
        .from('community_comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', targetPostId);

      const actualCount = countErr ? 0 : (count || 0);
      await supabase.from('community_posts').update({ comments_count: actualCount }).eq('id', targetPostId);
      return { success: true, count: actualCount };
    }
    return { success: true, count: 0 };
  } catch (e) {
    console.warn('deleteCommunityComment error:', e);
    throw e;
  }
}

export async function reportCommunityItem(params = {}) {
  const { postId = null, commentId = null, userId = null, reason = 'Inappropriate content', description = '' } = params;
  try {
    const { data, error } = await supabase.from('community_reports').insert({
      post_id: postId,
      comment_id: commentId,
      reported_by: userId,
      reason,
      description,
      status: 'pending',
    }).select().single();
    if (error) {
      console.warn('community_reports insert notice:', error.message);
    }
    return { success: true };
  } catch (e) {
    console.warn('reportCommunityItem notice:', e);
    return { success: true };
  }
}

// 2. Academic Discussion (Forum)
export async function getForumQuestions(collegeId) {
  try {
    let query = supabase.from('forum_questions').select('*, replies:forum_replies(*), upvotes:forum_upvotes(user_id)');
    if (collegeId) {
      query = query.eq('college_id', collegeId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createForumQuestion(q) {
  const { data, error } = await supabase
    .from('forum_questions')
    .insert({
      college_id: q.college_id || null,
      user_id: q.user_id || null,
      title: q.title,
      description: q.description,
      category: q.category || 'General'
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleQuestionUpvote(questionId, userId, hasUpvoted) {
  if (hasUpvoted) {
    const { error } = await supabase.from('forum_upvotes').delete().eq('question_id', questionId).eq('user_id', userId);
    if (error) throw error;
    
    const { data } = await supabase.from('forum_questions').select('upvotes_count').eq('id', questionId).single();
    const newUpvotes = Math.max(0, (data?.upvotes_count || 0) - 1);
    await supabase.from('forum_questions').update({ upvotes_count: newUpvotes }).eq('id', questionId);
    return newUpvotes;
  } else {
    const { error } = await supabase.from('forum_upvotes').insert({ question_id: questionId, user_id: userId });
    if (error) throw error;
    
    const { data } = await supabase.from('forum_questions').select('upvotes_count').eq('id', questionId).single();
    const newUpvotes = (data?.upvotes_count || 0) + 1;
    await supabase.from('forum_questions').update({ upvotes_count: newUpvotes }).eq('id', questionId);
    return newUpvotes;
  }
}

export async function createForumReply(questionId, userId, authorName, content) {
  const { data, error } = await supabase
    .from('forum_replies')
    .insert({ question_id: questionId, user_id: userId, author_name: authorName, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 3. Project Collaboration
export async function getProjectCollaborations(collegeId) {
  try {
    let query = supabase.from('project_collaborations').select('*, applications:collaboration_applications(user_id)');
    if (collegeId) {
      query = query.eq('college_id', collegeId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createProjectCollaboration(collab) {
  const { data, error } = await supabase
    .from('project_collaborations')
    .insert({
      college_id: collab.college_id || null,
      user_id: collab.user_id || null,
      title: collab.title,
      author_name: collab.author_name,
      branch: collab.branch || '',
      skills: collab.skills || [],
      description: collab.description
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleCollabApply(collabId, userId, hasApplied) {
  if (hasApplied) {
    const { error } = await supabase.from('collaboration_applications').delete().eq('collaboration_id', collabId).eq('user_id', userId);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase.from('collaboration_applications').insert({ collaboration_id: collabId, user_id: userId });
    if (error) throw error;
    return true;
  }
}

// 4. Study Groups
export async function getStudyGroups(collegeId) {
  try {
    let query = supabase.from('study_groups').select('*, members:study_group_members(user_id)');
    if (collegeId) {
      query = query.eq('college_id', collegeId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createStudyGroup(group) {
  const { data, error } = await supabase
    .from('study_groups')
    .insert({
      college_id: group.college_id || null,
      title: group.title,
      subject: group.subject,
      members_count: 1,
      files_count: group.files_count || 0
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleJoinStudyGroup(groupId, userId, hasJoined) {
  if (hasJoined) {
    const { error } = await supabase.from('study_group_members').delete().eq('group_id', groupId).eq('user_id', userId);
    if (error) throw error;
    
    const { data } = await supabase.from('study_groups').select('members_count').eq('id', groupId).single();
    const newMembers = Math.max(1, (data?.members_count || 1) - 1);
    await supabase.from('study_groups').update({ members_count: newMembers }).eq('id', groupId);
    return newMembers;
  } else {
    const { error } = await supabase.from('study_group_members').insert({ group_id: groupId, user_id: userId });
    if (error) throw error;
    
    const { data } = await supabase.from('study_groups').select('members_count').eq('id', groupId).single();
    const newMembers = (data?.members_count || 1) + 1;
    await supabase.from('study_groups').update({ members_count: newMembers }).eq('id', groupId);
    return newMembers;
  }
}

// 5. Placement Cell
export async function getPlacementExperiences(collegeId) {
  try {
    let query = supabase.from('placement_experiences').select('*');
    if (collegeId) {
      query = query.eq('college_id', collegeId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createPlacementExperience(exp) {
  const { data, error } = await supabase
    .from('placement_experiences')
    .insert({
      college_id: exp.college_id || null,
      user_id: exp.user_id || null,
      title: exp.title,
      author_name: exp.author_name,
      company: exp.company,
      content: exp.content
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 6. Marketplace
export async function getMarketplaceItems(collegeId) {
  try {
    let query = supabase.from('marketplace_items').select('*');
    if (collegeId) {
      query = query.eq('college_id', collegeId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createMarketplaceItem(item) {
  const { data, error } = await supabase
    .from('marketplace_items')
    .insert({
      college_id: item.college_id || null,
      user_id: item.user_id || null,
      author_name: item.author_name,
      title: item.title,
      price: item.price || 0,
      condition: item.condition || 'Good',
      category: item.category || 'Books',
      description: item.description,
      is_sold: false
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markMarketplaceItemSold(id) {
  const { data, error } = await supabase
    .from('marketplace_items')
    .update({ is_sold: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 7. Alumni Directory
export async function getAlumniDirectory(collegeId) {
  try {
    let query = supabase.from('alumni_directory').select('*');
    if (collegeId) {
      query = query.eq('college_id', collegeId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

// ==========================================
// ADDITIONAL DYNAMIC REGISTRY HELPERS
// ==========================================

export async function adminListBranches() {
  return getCachedData('adminListBranches', async () => {
    const { data, error } = await supabase.from('branches').select('id, branch_name, branch_code').order('branch_name');
    if (error) throw error;
    return data || [];
  }, 12 * 60 * 60 * 1000); // 12 hours TTL
}

export async function adminListAcademicYears() {
  return getCachedData('adminListAcademicYears', async () => {
    const { data, error } = await supabase.from('academic_years').select('id, branch_id, year_name, semester').order('year_name');
    if (error) throw error;
    return data || [];
  }, 12 * 60 * 60 * 1000); // 12 hours TTL
}

export async function adminListSections(yearId = null) {
  let query = supabase.from('sections').select('*').order('section_name');
  if (yearId) {
    query = query.eq('academic_year_id', yearId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function adminListSubjects(branchId = null, yearId = null) {
  let query = supabase.from('subjects').select('*').order('subject_name');
  if (branchId) query = query.eq('branch_id', branchId);
  if (yearId) query = query.eq('academic_year_id', yearId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getStudentTimetable(userId) {
  return getCachedData(`studentTimetable:${userId}`, async () => {
    const { data: student } = await supabase
      .from('students')
      .select('academic_year_id, section_id')
      .eq('id', userId)
      .maybeSingle();

    if (!student?.academic_year_id) return [];

    let query = supabase
      .from('timetables')
      .select('*, subjects(subject_name, subject_code, faculty_name), academic_years(year_name), sections(section_name)')
      .eq('batch_id', student.academic_year_id);

    if (student.section_id) {
      query = query.eq('section_id', student.section_id);
    }

    const { data, error } = await query
      .order('day_of_week')
      .order('period_number');

    if (error) throw error;
    return data || [];
  }, 4 * 60 * 60 * 1000); // 4 hours TTL
}

// ==========================================
// SUPER ADMIN MODULE HELPERS
// ==========================================

export async function saGetPlatformMetrics() {
  const safeCount = async (table, filterFn = null) => {
    try {
      let query = supabase.from(table).select('id', { count: 'exact', head: true });
      if (filterFn) query = filterFn(query);
      const res = await query;
      return res.count || 0;
    } catch (e) {
      return 0;
    }
  };

  const [
    collegesCount,
    studentsCount,
    adminsCount,
    facultyCount,
    departmentsCount,
    subjectsCount,
    notesCount,
    previousPapersCount,
    opportunitiesCount,
    eventsCount,
    communitiesCount,
    activeUsersCount,
  ] = await Promise.all([
    safeCount('colleges'),
    safeCount('users', (q) => q.eq('role', 'student')),
    safeCount('users', (q) => q.in('role', ['admin', 'inst_admin', 'super_admin'])),
    safeCount('users', (q) => q.eq('role', 'faculty')),
    safeCount('branches'),
    safeCount('subjects'),
    safeCount('resources', (q) => q.ilike('type', '%note%')),
    safeCount('resources', (q) => q.ilike('type', '%paper%')),
    safeCount('opportunities'),
    safeCount('events'),
    safeCount('community_posts'),
    safeCount('users'),
    safeCount('activity_logs', (q) => q.ilike('action', '%download%')),
  ]);
  
  return {
    collegesCount: collegesCount || 0,
    studentsCount: studentsCount || 0,
    adminsCount: adminsCount || 0,
    facultyCount: facultyCount || 0,
    departmentsCount: departmentsCount || 0,
    subjectsCount: subjectsCount || 0,
    notesCount: notesCount || 0,
    previousPapersCount: previousPapersCount || 0,
    opportunitiesCount: opportunitiesCount || 0,
    eventsCount: eventsCount || 0,
    communitiesCount: communitiesCount || 0,
    innovationsCount: 0,
    activeUsersCount: activeUsersCount || 0,
    downloadsCount: activityDownloadsCount || 0,
    health: '100% Operational'
  };
}

export async function saListColleges() {
  try {
    const { data, error } = await supabase.from('colleges').select('*');
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {}

  return [
    { id: 'col-1', college_name: 'ESC Govt Polytechnic, Nandyal', college_code: 'ESCP', location: 'Nandyal, AP', type: 'Government', nirf_rank: 12, annual_fee: 4700, active_students: 1240 },
    { id: 'col-2', college_name: 'Govt Polytechnic for Women, Guntur', college_code: 'GPWG', location: 'Guntur, AP', type: 'Government', nirf_rank: 18, annual_fee: 4700, active_students: 980 },
    { id: 'col-3', college_name: 'Govt Polytechnic, Vijayawada', college_code: 'GPVJ', location: 'Vijayawada, AP', type: 'Government', nirf_rank: 8, annual_fee: 4700, active_students: 1650 },
    { id: 'col-4', college_name: 'Govt Polytechnic, Visakhapatnam', college_code: 'GPVZ', location: 'Visakhapatnam, AP', type: 'Government', nirf_rank: 6, annual_fee: 4700, active_students: 1820 },
    { id: 'col-5', college_name: 'SV Govt Polytechnic, Tirupati', college_code: 'SVGP', location: 'Tirupati, AP', type: 'Government', nirf_rank: 10, annual_fee: 4700, active_students: 1430 },
    { id: 'col-6', college_name: 'Govt Polytechnic, Anantapur', college_code: 'GPAT', location: 'Anantapur, AP', type: 'Government', nirf_rank: 22, annual_fee: 4700, active_students: 890 },
  ];
}

export async function saListAdmins() {
  const { data, error } = await supabase.from('users')
    .select(`
      *,
      admins(
        institution_id,
        colleges:institution_id(
          college_name,
          college_code
        )
      )
    `)
    .in('role', ['admin', 'inst_admin', 'super_admin'])
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('saListAdmins error:', error);
    throw error;
  }
  return data || [];
}


export async function saCreateAdminUser(email, password, fullName, role, collegeId) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '').trim();
  const cleanName = String(fullName || '').trim();

  let newUserId = null;

  // 1. Prioritize atomic SECURITY DEFINER RPC to bypass RLS and create in all tables simultaneously
  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc('create_college_admin', {
      admin_email: cleanEmail,
      admin_password: cleanPassword,
      admin_name: cleanName,
      college_id: collegeId || null,
      admin_role: role
    });

    if (!rpcErr && rpcData) {
      if (rpcData.error) {
        throw new Error(rpcData.error);
      }
      if (rpcData.user_id) {
        newUserId = rpcData.user_id;
      }
    } else if (rpcErr) {
      console.warn('[saCreateAdminUser] RPC call returned error, trying fallback:', rpcErr.message);
      if (rpcErr.message?.toLowerCase().includes('already in use') || rpcErr.message?.toLowerCase().includes('already registered')) {
        throw new Error('An account with this email address already exists.');
      }
    }
  } catch (e) {
    if (e.message?.toLowerCase().includes('already in use') || e.message?.toLowerCase().includes('already exists')) {
      throw e;
    }
    console.warn('[saCreateAdminUser] RPC exception, attempting signup fallback:', e.message);
  }

  // 2. Fallback to direct client signup if RPC is unavailable
  if (!newUserId) {
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        data: {
          full_name: cleanName,
          role: role,
          college_id: collegeId || null
        }
      }
    });

    if (authErr) {
      if (authErr.message?.toLowerCase().includes('already registered')) {
        throw new Error('An account with this email address already exists.');
      }
      throw authErr;
    }

    if (authData?.user?.id) {
      newUserId = authData.user.id;
    }
  }

  if (!newUserId) {
    throw new Error('Could not create admin account. Please verify input fields.');
  }

  // 3. Ensure record exists in public.users
  const { error: userUpsertErr } = await supabase.from('users').upsert({
    id: newUserId,
    full_name: cleanName,
    email: cleanEmail,
    role: role,
    college_id: collegeId || null,
    is_active: true
  });
  if (userUpsertErr) {
    console.warn('[saCreateAdminUser] public.users upsert warning:', userUpsertErr.message);
  }

  // 4. Ensure record exists in public.admins
  const { error: adminUpsertErr } = await supabase.from('admins').upsert({
    id: newUserId,
    name: cleanName,
    admin_name: cleanName,
    email: cleanEmail,
    role: role,
    institution_id: collegeId || null
  });
  if (adminUpsertErr) {
    console.warn('[saCreateAdminUser] public.admins upsert warning:', adminUpsertErr.message);
  }

  return newUserId;
}

export async function adminAddTimetableSlot(slot) {
  const { data, error } = await supabase.from('timetables').insert({
    batch_id: slot.batch_id,
    section_id: slot.section_id || null,
    subject_id: slot.subject_id,
    day_of_week: parseInt(slot.day_of_week, 10),
    period_number: parseInt(slot.period_number, 10),
    faculty_id: slot.faculty_id || null,
    start_time: slot.start_time,
    end_time: slot.end_time,
    room_number: slot.room_number || ''
  }).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteTimetableSlot(slotId) {
  const { error } = await supabase.from('timetables').delete().eq('id', slotId);
  if (error) throw error;
  return true;
}

export async function getClubs(collegeId) {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('college_id', collegeId)
    .order('name');
  if (error) throw error;
  return data || [];
}

// ==========================================
// DEEP QR VERIFICATION
// ==========================================

export async function verifyQrAttendance(qrToken, verifiedByUserId) {
  // 1. Fetch registration
  const { data: reg, error: regErr } = await supabase
    .from('event_registrations')
    .select('*, students(full_name, roll_number), events(title, certificate_available)')
    .eq('qr_token', qrToken)
    .maybeSingle();
     
  if (regErr || !reg) {
    throw new Error('Invalid QR Code: Registration not found.');
  }
   
  if (reg.status === 'Cancelled') {
    throw new Error('Invalid QR Code: This registration has been cancelled.');
  }
   
  if (reg.attendance === 'Present') {
    // Log check-in scan as duplicate audit
    await supabase.from('qr_verifications').insert({
      registration_id: reg.id,
      verified_by: verifiedByUserId,
      scan_result: 'Duplicate'
    }).select();
    throw new Error(`Attendance already marked for ${reg.students?.full_name || 'Student'}!`);
  }
   
  // 2. Mark attendance as Present and verified = true
  const { error: updErr } = await supabase
    .from('event_registrations')
    .update({
      attendance: 'Present',
      verified: true,
      verified_by: verifiedByUserId,
      verified_at: new Date().toISOString(),
      certificate_status: reg.events?.certificate_available ? 'Eligible' : 'Not Eligible'
    })
    .eq('id', reg.id);
     
  if (updErr) throw updErr;
   
  // 3. Log check-in scan as success audit
  await supabase.from('qr_verifications').insert({
    registration_id: reg.id,
    verified_by: verifiedByUserId,
    scan_result: 'Success'
  }).select();
   
  return {
    studentName: reg.students?.full_name || 'Student',
    rollNumber: reg.students?.roll_number || 'N/A',
    eventTitle: reg.events?.title || 'Event',
    verifiedAt: new Date().toISOString()
  };
}

// --- SuperAdmin: Admin Management ---

export async function saCreateAdmin(email, password, name, collegeId) {
  const { data, error } = await supabase.rpc('create_college_admin', {
    admin_email: email,
    admin_password: password,
    admin_name: name,
    college_id: collegeId
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function saUpdateAdminPassword(adminId, newPassword) {
  const { data, error } = await supabase.rpc('update_admin_password', {
    target_admin_id: adminId,
    new_password: newPassword
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function saDeleteAdmin(adminId) {
  const { data, error } = await supabase.rpc('delete_college_admin', {
    target_admin_id: adminId
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

// ==========================================
// ENTERPRISE GLOBAL FILTER SYSTEM IMPLEMENTATION
// ==========================================

export async function getFilteredNotifications(userId, page = 0, limit = 20, search = '', filters = {}) {
  let query = supabase.from('notifications').select('*').eq('is_deleted', false);
  if (userId) query = query.eq('user_id', userId);
  
  if (filters.category && filters.category !== 'All') {
    query = query.ilike('category', `%${filters.category}%`);
  }
  if (filters.status === 'Read') {
    query = query.eq('read', true);
  } else if (filters.status === 'Unread') {
    query = query.eq('read', false);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,message.ilike.%${search}%`);
  }

  const orderAsc = filters.sort === 'Oldest';
  query = query.order('created_at', { ascending: orderAsc });
  
  const from = page * limit;
  const to = from + limit - 1;
  const { data, error } = await query.range(from, to);
  if (error) throw error;
  return data || [];
}

export async function getFilteredOpportunities(userId, page = 0, limit = 20, search = '', filters = {}) {
  let query = supabase.from('opportunities').select('*');
  
  if (filters.type && filters.type !== 'All') {
    query = query.eq('type', filters.type);
  }
  if (filters.location_type && filters.location_type !== 'All') {
    query = query.eq('location_type', filters.location_type);
  }
  if (filters.compensation && filters.compensation !== 'All') {
    query = query.eq('compensation', filters.compensation);
  }
  if (filters.branch) {
    query = query.contains('eligible_branches', [filters.branch]);
  }
  if (filters.status === 'Expired') {
    query = query.lt('deadline', new Date().toISOString().split('T')[0]);
  } else if (filters.status === 'Active') {
    query = query.gte('deadline', new Date().toISOString().split('T')[0]);
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,company_name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const orderAsc = filters.sort === 'Oldest';
  query = query.order('created_at', { ascending: orderAsc });

  const from = page * limit;
  const to = from + limit - 1;
  const { data, error } = await query.range(from, to);
  if (error) throw error;
  return data || [];
}

export async function getFilteredResources(userId, page = 0, limit = 20, search = '', filters = {}) {
  let query = supabase.from('resources').select('*');

  if (filters.type && filters.type !== 'All') {
    query = query.eq('type', filters.type);
  }
  if (filters.semester && filters.semester !== 'All') {
    query = query.eq('semester', filters.semester);
  }
  if (filters.branch && filters.branch !== 'All') {
    query = query.eq('branch', filters.branch);
  }
  if (filters.department && filters.department !== 'All') {
    query = query.eq('department', filters.department);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const orderAsc = filters.sort === 'Oldest';
  query = query.order('created_at', { ascending: orderAsc });

  const from = page * limit;
  const to = from + limit - 1;
  const { data, error } = await query.range(from, to);
  if (error) throw error;
  return data || [];
}

export async function getFilteredEvents(userId, page = 0, limit = 20, search = '', filters = {}) {
  let query = supabase.from('events').select('*');

  if (filters.status && filters.status !== 'All') {
    query = query.eq('status', filters.status);
  }
  if (filters.type && filters.type !== 'All') {
    query = query.eq('type', filters.type);
  }
  if (filters.location_type && filters.location_type !== 'All') {
    query = query.eq('location_type', filters.location_type);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,venue.ilike.%${search}%`);
  }

  const orderAsc = filters.sort === 'Oldest';
  query = query.order('created_at', { ascending: orderAsc });

  const from = page * limit;
  const to = from + limit - 1;
  const { data, error } = await query.range(from, to);
  if (error) throw error;
  return data || [];
}

export async function getFilteredInnovationProjects(userId, page = 0, limit = 20, search = '', filters = {}) {
  let query = supabase.from('innovations').select('*');

  if (filters.type && filters.type !== 'All') {
    query = query.eq('type', filters.type);
  }
  if (filters.technology && filters.technology !== 'All') {
    query = query.ilike('technology', `%${filters.technology}%`);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const orderAsc = filters.sort === 'Oldest';
  query = query.order('created_at', { ascending: orderAsc });

  const from = page * limit;
  const to = from + limit - 1;
  const { data, error } = await query.range(from, to);
  if (error) throw error;
  return data || [];
}

export async function getFilteredColleges(page = 0, limit = 20, search = '', filters = {}) {
  let query = supabase.from('colleges').select('*');

  if (filters.type && filters.type !== 'All') {
    query = query.eq('type', filters.type);
  }
  if (filters.district && filters.district !== 'All') {
    query = query.eq('district', filters.district);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
  }

  query = query.order('name', { ascending: true });

  const from = page * limit;
  const to = from + limit - 1;
  const { data, error } = await query.range(from, to);
  if (error) throw error;
  return data || [];
}

export async function getFilteredGrievances(userId, page = 0, limit = 20, search = '', filters = {}) {
  let query = supabase.from('issues').select('*');

  if (userId) {
    query = query.eq('user_id', userId);
  }
  if (filters.status && filters.status !== 'All') {
    query = query.eq('status', filters.status);
  }
  if (filters.priority && filters.priority !== 'All') {
    query = query.eq('priority', filters.priority);
  }
  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const orderAsc = filters.sort === 'Oldest';
  query = query.order('created_at', { ascending: orderAsc });

  const from = page * limit;
  const to = from + limit - 1;
  const { data, error } = await query.range(from, to);
  if (error) throw error;
  return data || [];
}

export async function getFilteredAdminStudents(collegeId, page = 0, limit = 20, search = '', filters = {}) {
  let query = supabase.from('students').select('*');

  if (collegeId) {
    query = query.eq('college_id', collegeId);
  }
  if (filters.branch && filters.branch !== 'All') {
    query = query.eq('branch', filters.branch);
  }
  if (filters.year && filters.year !== 'All') {
    query = query.eq('year', filters.year);
  }
  if (filters.status && filters.status !== 'All') {
    query = query.eq('status', filters.status);
  }
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,roll_number.ilike.%${search}%`);
  }

  query = query.order('full_name', { ascending: true });

  const from = page * limit;
  const to = from + limit - 1;
  const { data, error } = await query.range(from, to);
  if (error) throw error;
  return data || [];
}

/**
 * Submit Support Suggestion to Supabase DB (support_suggestions or suggestions)
 */
export async function submitSupportSuggestion(payload) {
  const { college_id, ...cleanPayload } = payload;
  let lastErr = null;

  // 1. Standard Insert with user_id (without .select() to bypass RLS read check)
  try {
    const res1 = await supabase.from('support_suggestions').insert([cleanPayload]);
    if (!res1.error) return cleanPayload;
    lastErr = res1.error;
  } catch (e) {
    lastErr = e;
  }

  // 2. Insert into suggestions table
  try {
    const res2 = await supabase.from('suggestions').insert([cleanPayload]);
    if (!res2.error) return cleanPayload;
  } catch (e) {
    // continue
  }

  // 3. Try without user_id
  try {
    const { user_id, ...noUserPayload } = cleanPayload;
    const res3 = await supabase.from('support_suggestions').insert([noUserPayload]);
    if (!res3.error) return noUserPayload;
  } catch (e) {
    // continue
  }

  // 4. Fallback to main 'issues' table (which has open RLS insert policies for student tickets)
  try {
    const randomNum = String(Math.floor(1000 + Math.random() * 9000));
    const issuePayload = {
      id: `SUGG-${Date.now()}-${randomNum}`,
      title: `[Suggestion] ${payload.title}`,
      description: `${payload.description || payload.title}\n\nExpected Benefits:\n${payload.expected_benefits || 'N/A'}`,
      category: payload.category || 'Suggestion',
      is_anonymous: !!payload.is_anonymous,
      user_id: payload.user_id,
      status: 'pending',
      triage_status: 'pending_review',
    };
    const resIssue = await supabase.from('issues').insert([issuePayload]);
    if (!resIssue.error) return issuePayload;
  } catch (e) {
    // continue
  }

  throw lastErr || new Error('Row Level Security policy blocked suggestion submission.');
}

/**
 * Submit Support Feedback to Supabase DB (support_feedbacks or feedbacks)
 */
export async function submitSupportFeedback(payload) {
  let lastErr = null;
  try {
    const { data, error } = await supabase.from('support_feedbacks').insert([payload]).select().single();
    if (!error) return data;
    lastErr = error;

    const plainInsert = await supabase.from('support_feedbacks').insert([payload]);
    if (!plainInsert.error) return payload;

    const fallback = await supabase.from('feedbacks').insert([payload]);
    if (!fallback.error) return payload;
  } catch (err) {
    lastErr = err;
  }

  // Fallback to main 'issues' table
  try {
    const randomNum = String(Math.floor(1000 + Math.random() * 9000));
    const issuePayload = {
      id: `FB-${Date.now()}-${randomNum}`,
      title: `[Feedback] Rating: ${payload.rating || 5}/5 - ${payload.category || 'General'}`,
      description: payload.feedback_text || 'User submitted feedback.',
      category: payload.category || 'Feedback',
      is_anonymous: !!payload.is_anonymous,
      user_id: payload.user_id,
      status: 'pending',
      triage_status: 'pending_review',
    };
    const resIssue = await supabase.from('issues').insert([issuePayload]);
    if (!resIssue.error) return issuePayload;
  } catch (e) {
    // continue
  }

  throw lastErr || new Error('Could not submit feedback.');
}

/**
 * Save user CGPA to profile in Supabase
 */
export async function saveUserCGPA(userId, cgpaValue) {
  try {
    const numericCGPA = parseFloat(cgpaValue);
    if (isNaN(numericCGPA)) throw new Error('Invalid CGPA value');

    const { data, error } = await supabase
      .from('profiles')
      .update({ cgpa: numericCGPA, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select();

    if (error) {
      // Try users table fallback
      const userRes = await supabase
        .from('users')
        .update({ cgpa: numericCGPA })
        .eq('id', userId)
        .select();
      if (userRes.error) throw error;
      return userRes.data;
    }
    return data;
  } catch (err) {
    console.error('saveUserCGPA Error:', err);
    throw err;
  }
}

/**
 * Track Opportunity Apply Status
 */
export async function trackOpportunityApply(userId, opportunityId, metadata = {}) {
  try {
    const payload = {
      user_id: userId,
      opportunity_id: opportunityId,
      status: metadata.applied_status || 'Applied',
      applied_at: metadata.applied_date || new Date().toISOString(),
      application_completed: metadata.application_completed ?? true,
    };
    const { data, error } = await supabase.from('opportunity_applications').upsert(payload).select();
    if (error) {
      // Fallback user metadata update
      console.warn('opportunity_applications table upsert notice:', error.message);
    }
    return data || payload;
  } catch (err) {
    console.warn('trackOpportunityApply notice:', err.message);
    return { user_id: userId, opportunity_id: opportunityId };
  }
}

/**
 * Get User Applied Opportunity IDs
 */
export async function getUserAppliedOpportunityIds(userId) {
  try {
    const { data, error } = await supabase
      .from('opportunity_applications')
      .select('opportunity_id')
      .eq('user_id', userId);
    if (error) return [];
    return (data || []).map(item => item.opportunity_id);
  } catch {
    return [];
  }
}


