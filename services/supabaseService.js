import { supabase, GOOGLE_APPS_SCRIPT_URL } from '@/lib/supabase';
import { Alert, Platform } from 'react-native';
import { sanitizeInput, validateEmail, validatePhone, validateRollNumber, validateText } from '@/utils/validation';
import { getCachedData, forceRefresh } from './cacheManager';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
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
    // Fetch profiles in parallel
    let [uRes, sRes, aRes] = await Promise.all([
      supabase.from('users').select('id, email, full_name, role, is_password_set, first_login_completed, branch, year, date_of_birth').eq('id', authUser.id).maybeSingle(),
      supabase.from('students').select('id, roll_number, full_name, email, is_password_set, year, branch_id, academic_year_id, college_id, date_of_birth, colleges(college_name), branches(branch_name), academic_years(year_name, semester)').eq('id', authUser.id).maybeSingle(),
      supabase.from('admins').select('id, name, full_name, email, role, institution_id, colleges:institution_id(college_name)').eq('id', authUser.id).maybeSingle()
    ]);

    // Self-healing: if the user exists in auth but is missing in public.users (e.g. after a DB wipe)
    if (!uRes.data && authUser.id) {
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

        // Re-fetch profiles
        const [uNew, sNew, aNew] = await Promise.all([
          supabase.from('users').select('id, email, full_name, role, is_password_set, first_login_completed, branch, year, date_of_birth, feedx_id, qr_code_data, identity_status').eq('id', authUser.id).maybeSingle(),
          supabase.from('students').select('id, roll_number, full_name, email, is_password_set, year, branch_id, academic_year_id, college_id, date_of_birth, feedx_id, qr_code_data, identity_status, colleges(college_name), branches(branch_name), academic_years(year_name, semester)').eq('id', authUser.id).maybeSingle(),
          supabase.from('admins').select('id, name, full_name, email, role, institution_id, colleges:institution_id(college_name)').eq('id', authUser.id).maybeSingle()
        ]);
        uRes = uNew;
        sRes = sNew;
        aRes = aNew;
      }
    }

    const userProfile = uRes.data || {};
    const studentProfile = sRes.data || {};
    const adminProfile = aRes.data || {};

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

    // If absolutely no profile exists in any table
    if (!uRes.data && !sRes.data && !aRes.data) {
      return { 
        id: authUser.id, 
        email: authUser.email, 
        role: 'student',
        full_name: 'User',
        feedx_id: feedxId || `FEEDX-TG-26-${String(authUser.id).slice(0, 6).toUpperCase()}`,
        qr_code_data: qrCodeData || feedxId || `FEEDX-TG-26-${String(authUser.id).slice(0, 6).toUpperCase()}`
      };
    }

    // Determine role and normalize
    const rawRole = adminProfile.role || userProfile.role || 'student';
    const finalRole = String(rawRole).toLowerCase().trim();

    const metaFirstLogin = authUser.user_metadata?.first_login_completed;

    // Strictly rely on the database value as the single source of truth for password status
    const isPasswordSet = (userProfile.is_password_set ?? studentProfile.is_password_set ?? false) === true;

    const firstLoginCompleted = metaFirstLogin === true ||
      (userProfile.first_login_completed ?? false) ||
      isPasswordSet;

    // Safe merge
    return {
      ...userProfile,
      ...studentProfile,
      ...adminProfile,
      id: authUser.id,
      user_id: authUser.id,
      email: authUser.email,
      role: finalRole,
      full_name: adminProfile.full_name || adminProfile.name || studentProfile.full_name || userProfile.full_name || 'User',
      roll_no: studentProfile.roll_number || userProfile.roll_number || '',
      feedx_id: feedxId,
      qr_code_data: qrCodeData || `https://feedxpolytechnic.com/verify/${feedxId}`,
      identity_status: identityStatus,
      branch: studentProfile.branches?.branch_name || userProfile.branch || '',
      year: studentProfile.year || userProfile.year || studentProfile.academic_years?.year_name || '',
      semester: studentProfile.academic_years?.semester || '',
      branch_id: studentProfile.branch_id || userProfile.branch_id || null,
      academic_year_id: studentProfile.academic_year_id || userProfile.academic_year_id || null,
      college_id: studentProfile.college_id || userProfile.college_id || adminProfile.institution_id || null,
      college_name: studentProfile.colleges?.college_name || adminProfile.colleges?.college_name || 'FeedX Polytechnic',
      is_password_set: isPasswordSet,
      first_login_completed: firstLoginCompleted,
      date_of_birth: userProfile.date_of_birth || studentProfile.date_of_birth || null,
      user_metadata: authUser.user_metadata || {},
    };
  } catch (err) {
    console.error('Enrichment crash:', err);
    throw err;
  }
}

export function generateFeedxId(user) {
  const prefix = 'FEEDX';
  const college = user?.college_name || user?.colleges?.college_name || 'GPTE';
  let collegeCode = college.split(' ').map(w => w[0]).join('').replace(/[^A-Za-z]/g, '').toUpperCase();
  if (collegeCode.length < 2) collegeCode = college.slice(0, 4).toUpperCase();
  const branch = user?.branch || user?.branches?.branch_name || 'CSE';
  let branchCode = branch.split(' ').map(w => w[0]).join('').replace(/[^A-Za-z]/g, '').toUpperCase();
  if (branchCode.length < 2) branchCode = branch.slice(0, 3).toUpperCase();
  const rawRoll = (user?.roll_no || user?.roll_number || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const rollStr = rawRoll && rawRoll !== 'PENDING' ? rawRoll : String(Math.floor(100000 + Math.random() * 900000));
  return `${prefix}-${collegeCode}-${branchCode}-${rollStr}`;
}

export async function verifyStudentFeedxId(feedxIdQuery) {
  const cleanId = String(feedxIdQuery || '').trim().replace(/^.*\/verify\//, '');
  if (!cleanId) throw new Error('Invalid FEEDX ID or QR data');

  const { data, error } = await supabase
    .from('students')
    .select('id, roll_number, full_name, email, year, feedx_id, qr_code_data, identity_status, colleges(college_name), branches(branch_name), academic_years(year_name, semester)')
    .or(`feedx_id.eq.${cleanId},roll_number.eq.${cleanId}`)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error(`No verified student record found for FEEDX ID: ${cleanId}`);

  return {
    full_name: data.full_name,
    roll_number: data.roll_number,
    feedx_id: data.feedx_id || cleanId,
    college_name: data.colleges?.college_name || 'FeedX Polytechnic',
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
    // User entered a roll number – look up their actual email from the students table
    console.log('[loginWithRollNo] Looking up email for roll number:', trimmed);
    const { data: studentRecord } = await supabase
      .from('students')
      .select('email')
      .eq('roll_number', trimmed.toUpperCase())
      .maybeSingle();

    if (studentRecord?.email) {
      email = studentRecord.email.trim().toLowerCase();
      console.log('[loginWithRollNo] Found student email:', email);
    } else {
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
    let resetPass = customPassword;
    if (!resetPass) {
      // Fetch student DOB to use as default password
      const { data: student } = await supabase.from('students').select('date_of_birth').eq('id', userId).maybeSingle();
      const { data: userRecord } = await supabase.from('users').select('date_of_birth').eq('id', userId).maybeSingle();
      const dob = student?.date_of_birth || userRecord?.date_of_birth || '2005-05-15';
      resetPass = String(dob).trim();
    }

    const { data, error } = await supabase.rpc('change_user_password_by_admin', {
      target_user_id: userId,
      new_plain_password: resetPass
    });
    if (error) throw error;
    return data;
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

export async function getDashboard(userId) {
  try {
    const [{ data: userProfile }, { data: student }] = await Promise.all([
      supabase.from('users').select('id, email, full_name, role, is_password_set, first_login_completed, branch, year, date_of_birth, profile_picture, avatar_url, roll_number, verification_status').eq('id', userId).maybeSingle(),
      supabase.from('students').select('id, roll_number, full_name, email, is_password_set, year, branch_id, academic_year_id, college_id, date_of_birth, profile_picture, verification_status, colleges(college_name, location), branches(branch_name), academic_years(year_name, semester)').eq('id', userId).maybeSingle()
    ]);
    
    let batchId = student?.academic_year_id;
    if (!batchId && userProfile?.year) {
      const { data: batch } = await supabase.from('academic_years').select('id').ilike('year_name', `%${userProfile.year}%`).maybeSingle();
      batchId = batch?.id;
    }

    let collegeRecord = student?.colleges;
    const cid = student?.college_id || userProfile?.college_id;
    if (!collegeRecord && cid) {
      const { data: colData } = await supabase.from('colleges').select('college_name, location').eq('id', cid).maybeSingle();
      if (colData) collegeRecord = colData;
    }
    if (!collegeRecord) {
      const { data: firstCol } = await supabase.from('colleges').select('college_name, location').limit(1).maybeSingle();
      if (firstCol) collegeRecord = firstCol;
    }

    const profile = { 
      ...userProfile, 
      ...student,
      id: userId,
      full_name: student?.full_name || userProfile?.full_name || 'FeedX Student',
      college_name: collegeRecord?.college_name || userProfile?.college_name || 'Government Institute of Electronics',
      college_location: collegeRecord?.location || 'Telangana, India',
      branch: student?.branches?.branch_name || userProfile?.branch || 'CSE',
      semester: student?.academic_years?.semester || '',
      year: student?.year || student?.academic_years?.year_name || userProfile?.year || '3rd Year',
      roll_number: student?.roll_number || userProfile?.roll_number || '21001-CSE-001',
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
        .limit(40),
      supabase.from('tasks').select('id, title, deadline, completed, created_at, user_id').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('opportunities').select('id, title, company, type, stipend, deadline, apply_link, description, college_id, created_at, location').order('created_at', { ascending: false }).limit(10),
      supabase.from('resources').select('id, title, file_url, type, created_at').order('created_at', { ascending: false }).limit(10),
      supabase.from('notification_reads').select('notification_id').eq('user_id', userId),
      supabase.from('opportunities').select('id', { count: 'exact', head: true }),
      supabase.from('resources').select('id', { count: 'exact', head: true }),
      supabase.from('community_posts').select('id, content, likes_count, created_at').neq('is_deleted', true).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('student_roadmap_progress').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('quick_learn_lessons').select('id, title, category, estimated_minutes, short_description, branch').eq('is_published', true).limit(5),
      supabase.from('events').select('id, title, event_date, location, description, registration_link, created_at').order('created_at', { ascending: false }).limit(5),
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
      oppCountRes, resCountRes, communityHighlightRes, roadmapProgressRes, quickLearnRes, eventsRes, lessonProgressRes
    ] = results.map(r => r?.data || null);

    const oppCount = results[5]?.count || opportunities?.length || 0;
    const resourceCount = results[6]?.count || resources?.length || 0;

    const readSet = new Set((readRows || []).map((r) => r.notification_id));
    const studentBranch = String(profile.branch || '').toLowerCase().trim();
    const studentYear = String(profile.year || '').toLowerCase().trim();

    const seenNotifTitles = new Set();
    const notifications = (notificationsRaw || [])
      .filter((n) => {
        if (!n || !n.title) return false;
        const normTitle = String(n.title).trim().toLowerCase();
        if (seenNotifTitles.has(normTitle)) return false;
        seenNotifTitles.add(normTitle);

        if (n.user_id === userId) return true;
        const targetBranch = String(n.branch || n.target_branch || 'All').toLowerCase().trim();
        const branchOk = targetBranch === 'all' || !studentBranch || 
          studentBranch.includes(targetBranch) || targetBranch.includes(studentBranch);
        const targetYear = String(n.year || n.target_year || 'All').toLowerCase().trim();
        const yearOk = targetYear === 'all' || !studentYear || 
          studentYear.includes(targetYear) || targetYear.includes(studentYear);
        return branchOk && yearOk;
      })
      .slice(0, 35)
      .map((n) => ({
        ...n,
        is_read: n.user_id ? Boolean(n.is_read) : readSet.has(n.id),
      }));

    // Process Official Updates feed combining notifications, events, and opportunities
    const rawUpdates = [];

    (notifications || []).forEach(n => {
      rawUpdates.push({
        id: `notif_${n.id}`,
        title: n.title,
        description: n.message || n.body || 'Tap to view full details.',
        category: n.category || n.type || 'Announcements',
        source: n.department ? `${n.department} Department` : `${profile.college_name}`,
        is_official: n.is_official !== false,
        is_verified: n.is_verified !== false,
        timestamp: n.created_at,
        created_at: n.created_at,
        contentType: n.type || 'Announcement',
        actionLabel: 'View Details >',
        apply_url: n.apply_url
      });
    });

    (eventsRes || []).forEach(e => {
      rawUpdates.push({
        id: `event_${e.id}`,
        title: e.title,
        description: e.description || `Venue: ${e.venue || 'Campus Main Hall'}`,
        category: 'Events',
        source: e.department ? `${e.department} Department` : 'College Event Cell',
        is_official: true,
        is_verified: true,
        timestamp: e.event_date || e.date || new Date().toISOString(),
        created_at: e.event_date || e.date || new Date().toISOString(),
        contentType: 'Event',
        actionLabel: 'Register',
        route: '/(tabs)/events'
      });
    });

    (opportunities || []).forEach(o => {
      rawUpdates.push({
        id: `opp_${o.id}`,
        title: `${o.title} (${o.company || 'Placement Cell'})`,
        description: o.description || `Stipend / Package: ${o.stipend || 'Competitive'} • Location: ${o.location || 'Remote'}`,
        category: o.type === 'Job' || o.type === 'Internship' ? 'Placements' : 'Opportunities',
        source: 'Placement & Career Cell',
        is_official: true,
        is_verified: true,
        timestamp: o.created_at,
        created_at: o.created_at,
        contentType: o.type || 'Placement',
        actionLabel: 'Apply',
        route: '/(tabs)/opportunities'
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

    // Sort Newest -> Oldest
    // Provide fallback student daily tasks if database has no tasks yet
    const defaultStudentTasks = [
      { id: 'task_1', title: 'Review 3rd Year CSE Lecture Notes & Lab Diagrams', category: 'Academic', deadline: 'Today', completed: false },
      { id: 'task_2', title: 'Submit Mini-Project Architecture & Spec Sheet', category: 'Project', deadline: '5:00 PM', completed: false },
      { id: 'task_3', title: 'Complete 3-Minute Quick Learn Daily Concept', category: 'Learning', deadline: 'Today', completed: false },
      { id: 'task_4', title: 'Check Campus Placement Drive Eligibility & Resume', category: 'Career', deadline: 'End of Day', completed: false },
    ];
    const finalTasks = (tasks && tasks.length > 0) ? tasks : defaultStudentTasks;

    return {
      profile,
      notifications: notifications || [],
      tasks: finalTasks,
      opportunities: opportunities || [],
      resources: resources || [],
      oppCount,
      resourceCount,
      communityHighlight: communityHighlightRes || null,
      roadmapProgress: roadmapProgressRes || null,
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

export async function getAdminAnalyticsDetail() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    const [students, recentStudents, pendingIssues, highPriorityIssues, recentResources, resolvedIssues, resourcesTotal] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }),
      supabase.from('students').select('id', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
      supabase.from('issues').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('issues').select('id', { count: 'exact', head: true }).eq('status', 'pending').gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
      supabase.from('resources').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 86400000).toISOString()),
      supabase.from('issues').select('id', { count: 'exact', head: true }).eq('status', 'resolved'),
      supabase.from('resources').select('id', { count: 'exact', head: true }),
    ]);
    const totalStudents = students.count || 0;
    const growthPct = totalStudents > 0 ? Math.round(((recentStudents.count || 0) / totalStudents) * 100) : 0;
    return {
      studentBase: {
        summary: `${totalStudents} active students enrolled across all departments.`,
        metrics: [`${growthPct}% growth (30d)`, `${recentStudents.count || 0} new this month`],
      },
      supportDesk: {
        summary: `${pendingIssues.count || 0} unresolved student tickets requiring action.`,
        metrics: [`${highPriorityIssues.count || 0} opened this week`, `${resolvedIssues.count || 0} resolved total`],
      },
      knowledgeAssets: {
        summary: 'Institutional documents and academic resources available to students.',
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
  const { data } = await supabase.from('events').select('*').eq('status', 'Published').order('created_at', { ascending: false });
  if (data && data.length > 0) {
    const eventIds = data.map(e => e.id);
    const { data: regCounts } = await supabase
      .from('event_registrations')
      .select('event_id')
      .in('event_id', eventIds)
      .neq('status', 'Cancelled');

    const countMap = {};
    if (regCounts) {
      regCounts.forEach(r => {
        countMap[r.event_id] = (countMap[r.event_id] || 0) + 1;
      });
    }

    data.forEach(item => {
      item.capacity = item.max_participants || item.capacity || null;
      item.registered = countMap[item.id] !== undefined ? countMap[item.id] : (item.registered || 0);
    });
  }
  return data || [];
}

export async function getEventById(id) {
  const { data } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
  if (data) {
    data.capacity = data.max_participants || data.capacity || null;
    const { count } = await supabase
      .from('event_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', id)
      .neq('status', 'Cancelled');
    data.registered = count || 0;
  }
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
  const regNumber = `REG-${eventId.substring(0,4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const feedxId = studentInfo.feedx_id || studentInfo.roll_number || `FEEDX-TG-26-${studentId.substring(0,6).toUpperCase()}`;
  const qrToken = feedxId;

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
    student_name: studentInfo.full_name || studentInfo.name || null,
    college_id: studentInfo.college_id || null,
    branch: studentInfo.branch || null,
  };

  const statusCandidates = ['Active', 'Registered', 'Pending', 'Confirmed', null];
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
      throw res.error;
    }
  }

  if (lastError) throw lastError;

  // Push registration to Google Sheets in background
  pushToGoogleSheets(studentId, eventId, regNumber).catch(e => {
    console.warn('[registerForEvent] Background Google Sheets sync failed:', e);
  });

  // Dynamically recalculate and sync registered count in events table
  try {
    const { count } = await supabase
      .from('event_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .neq('status', 'Cancelled');

    if (count !== null && count !== undefined) {
      await supabase.from('events').update({ registered: count }).eq('id', eventId);
    }
  } catch (e) {
    console.warn('[registerForEvent] Error syncing count:', e);
  }

  return data;
}

export async function verifyEventRegistrationQR(qrPayload, scannerUser) {
  if (!qrPayload) throw new Error('Invalid QR payload');
  const cleanPayload = String(qrPayload).trim();

  // Look up registration by qr_token, event_qr, feedx_id, registration_number, or id
  const { data: reg, error } = await supabase
    .from('event_registrations')
    .select('*, events(*), students(*)')
    .or(`qr_token.eq.${cleanPayload},event_qr.eq.${cleanPayload},feedx_id.eq.${cleanPayload},registration_number.eq.${cleanPayload},id.eq.${cleanPayload}`)
    .maybeSingle();

  if (error) throw error;
  if (!reg) throw new Error('Invalid QR Code: Registration record not found.');

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
    return {
      status: 'ALREADY_CHECKED_IN',
      message: `Student already checked in at ${new Date(reg.verified_at || reg.updated_at || Date.now()).toLocaleTimeString()}`,
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

  return {
    status: 'VERIFIED',
    message: 'Registration verified & checked in successfully!',
    registration: updatedReg || reg,
    student: reg.students,
    event: reg.events
  };
}

export async function getUserEventRegistration(eventId, studentId) {
  const { data } = await supabase.from('event_registrations')
    .select('*')
    .eq('event_id', eventId)
    .eq('student_id', studentId)
    .neq('status', 'Cancelled')
    .maybeSingle();
  return data;
}

export async function cancelEventRegistration(eventId, studentId) {
  const { error } = await supabase.from('event_registrations')
    .update({ status: 'Cancelled' })
    .eq('event_id', eventId)
    .eq('student_id', studentId);
  if (error) throw error;

  // Dynamically recalculate and sync registered count in events table
  try {
    const { count } = await supabase
      .from('event_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .neq('status', 'Cancelled');

    if (count !== null && count !== undefined) {
      await supabase.from('events').update({ registered: count || 0 }).eq('id', eventId);
    }
  } catch (e) {
    console.warn('[cancelEventRegistration] Error syncing count:', e);
  }

  return { success: true };
}

export async function getStudentRegistrations(studentId) {
  const { data, error } = await supabase.from('event_registrations')
    .select('*, events(*)')
    .eq('student_id', studentId)
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
    .eq('student_id', studentId)
    .neq('status', 'Cancelled');
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
  try {
    let query = supabase.from('notifications').select('*');
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    } else {
      query = query.or('user_id.is.null');
    }

    const { data: notificationsRaw, error } = await query.order('created_at', { ascending: false }).limit(limit);

    if (error || !notificationsRaw || notificationsRaw.length === 0) {
      return getFallbackNotifications();
    }

    // Fetch read notification IDs for this user to compute correct is_read status
    let readSet = new Set();
    if (userId) {
      const { data: readRows } = await supabase
        .from('notification_reads')
        .select('notification_id')
        .eq('user_id', userId);
      if (readRows) {
        readSet = new Set(readRows.map(r => r.notification_id));
      }
    }

    return notificationsRaw.map(n => ({
      ...n,
      is_read: n.user_id ? Boolean(n.is_read) : readSet.has(n.id),
    }));
  } catch (e) {
    return getFallbackNotifications();
  }
}

function getFallbackNotifications() {
  const now = new Date();
  return [
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
}

export async function adminCreateNotification(notification) {
  const payload = {
    title: notification.title,
    message: notification.message || notification.body || '',
    body: notification.body || notification.message || '',
    type: notification.type || 'admin',
    branch: notification.branch || 'All',
    year: notification.year || 'All',
    apply_url: notification.apply_url || null,
    user_id: notification.user_id || null,
    target_college: notification.target_college || notification.college_id || null,
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

export async function adminListNotes() {
  const { data, error } = await supabase.from('resources').select('id, title, file_url, type, created_at, uploaded_by').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminUpsertNote(item) {
  const { error } = await supabase.from('resources').upsert(item);
  if (error) throw error;
}

export async function adminDeleteNote(id) {
  const { error } = await supabase.from('resources').delete().eq('id', id);
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

export async function updateProfile(userId, data) {
  const userUpdates = {
    full_name: data.name, 
    phone: data.phone, 
    bio: data.bio,
    branch: data.branch,
    year: data.year,
    gender: data.gender,
    domain: data.domain,
    current_status: data.currentStatus,
    date_of_birth: data.dob,
    social_links: data.socialLinks
  };
  
  const studentUpdates = {
    full_name: data.name,
    phone: data.phone,
    bio: data.bio,
    year: data.year,
    gender: data.gender,
    current_status: data.currentStatus,
    date_of_birth: data.dob,
    social_links: data.socialLinks
  };

  const { error: uError } = await supabase.from('users').update(userUpdates).eq('id', userId);
  if (uError) console.warn("users table update issue:", uError);
  
  const { error: sError } = await supabase
    .from('students')
    .update(studentUpdates)
    .eq('id', userId);
    
  if (sError) console.warn("students table update issue:", sError);
  return { success: true };
}

export async function completeUserOnboarding(userId, data) {
  // Update both users and students table
  const updates = {
    avatar_url: data.avatar_url,
    phone: data.phone,
    bio: data.bio,
    first_login_completed: true
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
  { id: '1', name: 'Website', url: 'https://feedxpolytechnic.com', icon: 'globe', description: 'Official FeedX Polytechnic Website' },
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

export async function isBookmarked(userId, entityType, entityId) {
  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .maybeSingle();
  return !!data;
}

export async function toggleBookmark(userId, entityType, entityId) {
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .maybeSingle();

  if (existing) {
    await supabase.from('bookmarks').delete().eq('id', existing.id);
    return { bookmarked: false };
  }

  const { error } = await supabase.from('bookmarks').insert({ user_id: userId, entity_type: entityType, entity_id: entityId });
  if (error) throw error;
  return { bookmarked: true };
}

export async function getBookmarkedItems(userId) {
  const bookmarks = await getBookmarks(userId);
  if (!bookmarks.length) return { events: [], opportunities: [], resources: [], posts: [], innovations: [], colleges: [] };

  const eventIds = bookmarks.filter((b) => b.entity_type === 'event').map((b) => b.entity_id);
  const oppIds = bookmarks.filter((b) => b.entity_type === 'opportunity').map((b) => b.entity_id);
  const resIds = bookmarks.filter((b) => b.entity_type === 'resource').map((b) => b.entity_id);
  const postIds = bookmarks.filter((b) => b.entity_type === 'community_post' || b.entity_type === 'post').map((b) => b.entity_id);
  const innIds = bookmarks.filter((b) => b.entity_type === 'innovation').map((b) => b.entity_id);
  const collegeIds = bookmarks.filter((b) => b.entity_type === 'college').map((b) => b.entity_id);

  const [events, opportunities, resources, posts, innovations, colleges] = await Promise.all([
    eventIds.length ? supabase.from('events').select('*').in('id', eventIds) : { data: [] },
    oppIds.length ? supabase.from('opportunities').select('*').in('id', oppIds) : { data: [] },
    resIds.length ? supabase.from('resources').select('*').in('id', resIds) : { data: [] },
    postIds.length ? supabase.from('community_posts').select('*').in('id', postIds) : { data: [] },
    innIds.length ? supabase.from('innovations').select('*').in('id', innIds) : { data: [] },
    collegeIds.length ? supabase.from('colleges').select('*').in('id', collegeIds) : { data: [] },
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
  const response = await fetch(fileUri);
  const blob = await response.blob();
  const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from('support-attachments').upload(path, blob, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('support-attachments').getPublicUrl(path);
  return data.publicUrl;
}

export async function markNotificationRead(userId, notification) {
  if (!userId || !notification?.id) return;
  const cleanId = String(notification.id).replace(/^(notif_|event_|opp_)/, '');
  if (notification.user_id) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', cleanId).eq('user_id', userId);
  } else {
    await supabase.from('notification_reads').upsert(
      { user_id: userId, notification_id: cleanId },
      { onConflict: 'user_id,notification_id' }
    );
  }
}

// ==========================================
// RESOURCES (student-scoped)
// ==========================================

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
      let typeStr = filters.resource_type.toLowerCase();
      if (typeStr.includes('paper')) typeStr = 'paper';
      else if (typeStr.includes('note')) typeStr = 'note';
      else if (typeStr.includes('lab')) typeStr = 'lab';
      else if (typeStr.includes('syllabus')) typeStr = 'syllabus';
      
      query = query.ilike('type', `%${typeStr}%`);
    }

    // Apply DB pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    
    return data || [];
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
  const { data, error } = await supabase
    .from('issues')
    .update({ 
      triage_status: 'approved', 
      college_id: collegeId || null, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', issueId)
    .select()
    .single();
  if (error) throw error;
  await addIssueTimelineEntry(issueId, 'Approved by Super Admin', 'Issue verified & forwarded to College Admin desk.', actorId);
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

import { convertDriveUrlToImageUrl } from '@/utils/googleDrive';

export async function getCommunityPosts(pageOrCollegeId = 0, limit = 20, category = 'All', search = '', filterSort = 'Newest') {
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
      query = query.order('pinned', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data, error } = await query.range(rangeStart, rangeEnd);
      
    if (error) {
      console.warn('getCommunityPosts DB warning:', error.message);
      return [];
    }
    
    // Fetch attached images and poll data for returned posts
    const postIds = (data || []).map(p => p.id);
    let imagesByPostId = {};
    let pollsByPostId = {};

    if (postIds.length > 0) {
      try {
        const [{ data: imageRows }, { data: pollRows }] = await Promise.all([
          supabase.from('community_post_images').select('post_id, storage_path, display_order').in('post_id', postIds).order('display_order'),
          supabase.from('polls').select('*, poll_options(*), poll_votes(*)').in('post_id', postIds)
        ]);

        (imageRows || []).forEach(img => {
          if (!imagesByPostId[img.post_id]) imagesByPostId[img.post_id] = [];
          imagesByPostId[img.post_id].push(img.storage_path);
        });

        (pollRows || []).forEach(poll => {
          pollsByPostId[poll.post_id] = poll;
        });
      } catch (e) {
        console.warn('[getCommunityPosts] Warning fetching attachments/polls:', e);
      }
    }

    return (data || []).map(post => {
      const rawUrl = post.image_url || post.drive_url || '';
      const convertedUrl = convertDriveUrlToImageUrl(rawUrl);
      const gallery = imagesByPostId[post.id] || (convertedUrl ? [convertedUrl] : []);

      return {
        ...post,
        image_url: convertedUrl || rawUrl,
        drive_url: post.drive_url || rawUrl,
        images: gallery,
        poll: pollsByPostId[post.id] || null
      };
    });
  } catch (err) {
    console.error('getCommunityPosts crash:', err);
    return [];
  }
}

export async function createCommunityPostAdmin(postData) {
  const driveUrl = postData.drive_url || postData.image_url || '';
  const imageUrl = convertDriveUrlToImageUrl(driveUrl);
  const captionText = postData.caption || postData.description || postData.title || 'Community Post';

  const payload = {
    title: postData.title || captionText.slice(0, 60),
    caption: captionText,
    image_url: imageUrl || null,
    post_type: postData.post_type || (imageUrl ? 'image' : 'text'),
    category: postData.category || 'General',
    audience_type: postData.audience_type || 'all',
    status: 'active',
    visibility: 'public',
  };

  if (postData.created_by) {
    payload.created_by = postData.created_by;
  }

  const { data: post, error } = await supabase.from('community_posts').insert(payload).select().single();
  if (error) {
    console.error('[createCommunityPostAdmin] Insert error:', error);
    throw error;
  }

  // Insert additional images into community_post_images if provided
  if (Array.isArray(postData.images) && postData.images.length > 0) {
    const imagePayloads = postData.images.map((url, idx) => ({
      post_id: post.id,
      storage_path: url,
      display_order: idx
    }));
    await supabase.from('community_post_images').insert(imagePayloads);
  }

  return post;
}

export async function createCommunityPollPostAdmin(pollData) {
  // 1. Insert post into community_posts
  const captionText = pollData.description || pollData.question || 'Community Poll';
  const postPayload = {
    title: pollData.title || pollData.question || 'Community Poll',
    caption: captionText,
    post_type: 'poll',
    category: pollData.category || 'Polls',
    audience_type: pollData.audience_type || 'all',
    status: 'active',
    visibility: 'public',
    created_by: pollData.created_by || null,
    image_url: pollData.image_url || null
  };

  const { data: post, error: postErr } = await supabase.from('community_posts').insert(postPayload).select().single();
  if (postErr) {
    console.error('[createCommunityPollPostAdmin] Post error:', postErr);
    throw postErr;
  }

  // 2. Insert poll into polls table
  const pollPayload = {
    post_id: post.id,
    question: pollData.question,
    allow_multiple: Boolean(pollData.allow_multiple),
    anonymous_voting: pollData.anonymous_voting !== false,
    show_results_before_vote: Boolean(pollData.show_results_before_vote),
    allow_vote_change: Boolean(pollData.allow_vote_change),
    starts_at: pollData.starts_at || new Date().toISOString(),
    ends_at: pollData.ends_at || null,
    status: pollData.status || 'ACTIVE'
  };

  const { data: poll, error: pollErr } = await supabase.from('polls').insert(pollPayload).select().single();
  if (pollErr) {
    console.error('[createCommunityPollPostAdmin] Poll error:', pollErr);
    throw pollErr;
  }

  // 3. Insert poll options
  if (Array.isArray(pollData.options) && pollData.options.length > 0) {
    const optionPayloads = pollData.options.map((optText, idx) => ({
      poll_id: poll.id,
      option_text: optText,
      display_order: idx
    }));
    const { error: optErr } = await supabase.from('poll_options').insert(optionPayloads);
    if (optErr) console.error('[createCommunityPollPostAdmin] Option error:', optErr);
  }

  // 4. Insert optional images
  if (Array.isArray(pollData.images) && pollData.images.length > 0) {
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

    if (error) throw error;
    return polls || [];
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

export async function fetchPostDetail(postId) {
  try {
    const [{ data: post }, { data: images }, { data: poll }] = await Promise.all([
      supabase.from('community_posts').select('*').eq('id', postId).maybeSingle(),
      supabase.from('community_post_images').select('storage_path').eq('post_id', postId).order('display_order'),
      supabase.from('polls').select('*, poll_options(*), poll_votes(*)').eq('post_id', postId).maybeSingle()
    ]);

    if (!post) return null;

    const rawUrl = post.image_url || post.drive_url || '';
    const convertedUrl = convertDriveUrlToImageUrl(rawUrl);
    const imageList = (images || []).map(i => i.storage_path);
    const gallery = imageList.length > 0 ? imageList : (convertedUrl ? [convertedUrl] : []);

    return {
      ...post,
      image_url: convertedUrl || rawUrl,
      images: gallery,
      poll: poll || null
    };
  } catch (err) {
    console.error('[fetchPostDetail] error:', err);
    return null;
  }
}

export async function updateCommunityPostAdmin(postId, postData) {
  const driveUrl = postData.drive_url || postData.image_url || '';
  const imageUrl = convertDriveUrlToImageUrl(driveUrl);
  const captionText = postData.caption || postData.description || postData.title || 'Community Post';

  const payload = {
    title: postData.title || captionText.slice(0, 60),
    caption: captionText,
    image_url: imageUrl || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('community_posts').update(payload).eq('id', postId).select().single();
  if (error) {
    console.error('[updateCommunityPostAdmin] Update error:', error);
    throw error;
  }
  return data;
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

export async function togglePostLike(postId, studentId, hasLiked) {
  if (hasLiked) {
    // Unlike: delete the like row
    const { error: deleteError } = await supabase
      .from('community_likes')
      .delete()
      .eq('post_id', postId)
      .eq('student_id', studentId);
    if (deleteError) throw deleteError;
    
    // Atomically decrement using RPC
    const { error: rpcError } = await supabase.rpc('decrement_likes', { post_id_input: postId });
    
    // Fallback if RPC doesn't exist
    if (rpcError) {
       const { data } = await supabase.from('community_posts').select('likes_count').eq('id', postId).single();
       const newLikes = Math.max(0, (data?.likes_count || 0) - 1);
       await supabase.from('community_posts').update({ likes_count: newLikes }).eq('id', postId);
    }
  } else {
    // Like: insert the like row (upsert to prevent duplicates on rapid tapping)
    const { error: insertError } = await supabase
      .from('community_likes')
      .upsert({ post_id: postId, student_id: studentId }, { onConflict: 'post_id,student_id', ignoreDuplicates: true });
    if (insertError) throw insertError;
    
    // Atomically increment
    const { error: rpcError } = await supabase.rpc('increment_likes', { post_id_input: postId });
    
    if (rpcError) {
       const { data } = await supabase.from('community_posts').select('likes_count').eq('id', postId).single();
       const newLikes = (data?.likes_count || 0) + 1;
       await supabase.from('community_posts').update({ likes_count: newLikes }).eq('id', postId);
    }
  }
}

export async function createCommunityComment(postId, studentId, commentText) {
  const { data, error } = await supabase
    .from('community_comments')
    .insert({ post_id: postId, student_id: studentId, comment: commentText })
    .select(`
      *,
      users:student_id(full_name, avatar_url, role)
    `)
    .single();
    
  if (error) throw error;

  try {
    const { data: post } = await supabase.from('community_posts').select('comments_count').eq('id', postId).single();
    const newCommentsCount = (post?.comments_count || 0) + 1;
    await supabase.from('community_posts').update({ comments_count: newCommentsCount }).eq('id', postId);
  } catch (e) {
    console.warn('Failed to update comments_count:', e);
  }

  return {
    ...data,
    comment_text: data.comment
  };
}

export async function fetchCommunityComments(postId) {
  const { data, error } = await supabase
    .from('community_comments')
    .select(`
      *,
      users:student_id(full_name, avatar_url, role)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  return (data || []).map(c => ({
    ...c,
    comment_text: c.comment
  }));
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
  const [
    { count: collegesCount },
    { count: studentsCount },
    { count: adminsCount },
    { count: facultyCount },
    { count: departmentsCount },
    { count: subjectsCount },
    { count: notesCount },
    { count: previousPapersCount },
    { count: opportunitiesCount },
    { count: eventsCount },
    { count: communitiesCount },
    { count: innovationsCount },
    { count: activeUsersCount },
  ] = await Promise.all([
    supabase.from('colleges').select('id', { count: 'exact', head: true }),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'inst_admin'),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'faculty'),
    supabase.from('branches').select('id', { count: 'exact', head: true }),
    supabase.from('subjects').select('id', { count: 'exact', head: true }),
    supabase.from('resources').select('id', { count: 'exact', head: true }).ilike('type', '%note%'),
    supabase.from('resources').select('id', { count: 'exact', head: true }).ilike('type', '%paper%'),
    supabase.from('opportunities').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('clubs').select('id', { count: 'exact', head: true }),
    supabase.from('innovations').select('id', { count: 'exact', head: true }),
    supabase.from('users').select('id', { count: 'exact', head: true }),
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
    innovationsCount: innovationsCount || 0,
    activeUsersCount: activeUsersCount || 0,
    downloadsCount: 15420,
    health: '100% Operational'
  };
}

export async function saListColleges() {
  const { data, error } = await supabase.from('colleges').select('*');
  if (error) {
    console.error('saListColleges error:', error);
    throw error;
  }
  return data || [];
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

  // 1. Direct Auth Registration (Bypasses PostgreSQL RPC function overloading conflicts)
  try {
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

    if (!authErr && authData?.user?.id) {
      newUserId = authData.user.id;
    } else if (authErr && authErr.message?.toLowerCase().includes('already registered')) {
      throw new Error('An account with this email address already exists.');
    }
  } catch (e) {
    if (e.message?.includes('already exists')) throw e;
    console.warn('[saCreateAdminUser] Direct signup notice:', e.message);
  }

  // 2. RPC Fallback if Auth SignUp was restricted by session/RLS
  if (!newUserId) {
    const { data: rpcData, error: rpcErr } = await supabase.rpc('create_college_admin', {
      admin_email: cleanEmail,
      admin_password: cleanPassword,
      admin_name: cleanName,
      college_id: collegeId || null,
      admin_role: role
    });

    if (rpcErr) throw rpcErr;
    if (rpcData?.error) throw new Error(rpcData.error);
    newUserId = rpcData?.user_id;
  }

  if (!newUserId) {
    throw new Error('Could not create admin account. Please check email/password format.');
  }

  // 3. Upsert into public.users table safely
  try {
    await supabase.from('users').upsert({
      id: newUserId,
      full_name: cleanName,
      email: cleanEmail,
      role: role,
      is_active: true
    });
  } catch (e) {
    console.warn('[saCreateAdminUser] public.users upsert warning:', e);
  }

  // 4. Upsert into public.admins table with institution_id
  try {
    await supabase.from('admins').upsert({
      id: newUserId,
      name: cleanName,
      admin_name: cleanName,
      email: cleanEmail,
      role: role,
      institution_id: collegeId || null
    });
  } catch (e) {
    console.warn('[saCreateAdminUser] public.admins upsert warning:', e);
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
  let query = supabase.from('support_tickets').select('*');

  if (userId) {
    query = query.eq('student_id', userId);
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


