import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { safeBack } from '@/utils/navigation';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SPACING, RADIUS, SHADOWS, FONT } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/context/UserContext';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { updateProfile, fetchUserProfile } from '@/services/supabaseService';
import { resolveStandardFeedXId } from '@/services/idService';
import { validatePhone } from '@/utils/validation';
import { formatDateForDisplay, validateDOB } from '@/utils/profile';
import PressableCard from '@/components/ui/PressableCard';
import { UserAvatar } from '@/components/ui/UserAvatar';

const ACADEMIC_YEAR_OPTIONS = ['1st Year', '2nd Year', 'Final Year'] as const;
const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;
const STATUS_OPTIONS = ['Student', 'Alumni'] as const;

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user, setUser, refreshDashboard, refreshProfile } = useUser();
  const { colors, isDark } = useTheme();

  const isAdmin = user?.role === 'admin' || user?.role === 'college_admin' || user?.role === 'super_admin';

  // Loading & Error States
  const [loading, setLoading] = useState(() => !user);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const hasFetchedRef = React.useRef(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('Male');
  const [currentStatus, setCurrentStatus] = useState('Student');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('1st Year');
  const [domain, setDomain] = useState('');
  const [bio, setBio] = useState('');
  const [userEmail, setUserEmail] = useState('');
  // Admin-specific Fields
  const [department, setDepartment] = useState('Campus Administration');
  const [assignedCollege, setAssignedCollege] = useState('');

  // Inline Validation States
  const [firstNameError, setFirstNameError] = useState('');
  const [dobError, setDobError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Populate state fields from a profile object
  const populateFromProfile = useCallback((profileData: any) => {
    if (!profileData) return;

    let rawFullName = profileData.full_name || profileData.name || '';
    const isPlaceholder = rawFullName === 'User' || rawFullName === 'Student' || rawFullName === 'FEEDX Student' || rawFullName === 'FEEDXStudent';
    if (isPlaceholder) {
      rawFullName = '';
    }

    // Derive authentic real name from email if name was empty or placeholder
    if (!rawFullName && (profileData.email || user?.email)) {
      const emailToUse = profileData.email || user?.email || '';
      rawFullName = emailToUse.split('@')[0].replace(/[._0-9]+/g, ' ').trim().replace(/\b\w/g, (c: string) => c.toUpperCase());
    }

    if (rawFullName) {
      const parts = rawFullName.trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.length > 1 ? parts.slice(1).join(' ') : '');
    }

    if (profileData.phone) setPhone(String(profileData.phone));
    if (profileData.date_of_birth) {
      setDob(formatDateForDisplay(profileData.date_of_birth));
    }
    if (profileData.gender) setGender(profileData.gender);
    if (profileData.current_status) setCurrentStatus(profileData.current_status);
    if (profileData.branch) setBranch(profileData.branch);
    if (profileData.year) setYear(profileData.year);
    if (profileData.domain) setDomain(profileData.domain);
    if (profileData.bio) setBio(profileData.bio);
    if (profileData.email) setUserEmail(profileData.email);
    if (profileData.department) setDepartment(profileData.department);
    if (profileData.college_name && profileData.college_name !== 'FEEDX Polytechnic') {
      setAssignedCollege(profileData.college_name);
    }
  }, [user?.email]);

  // Immediately initialize form state from existing in-memory user
  useEffect(() => {
    if (user) {
      populateFromProfile(user);
    }
  }, [populateFromProfile]);

  // Primary loader: Fetch fresh profile directly from database once on mount with safety timeout
  const loadProfileFromDatabase = useCallback(async () => {
    setFetchError(null);

    const fetchWithTimeout = async () => {
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authData?.user) {
        throw new Error(authErr?.message || 'Authentication session not found.');
      }

      const authUser = authData.user;
      setUserEmail(authUser.email || '');

      // Fetch latest profile record directly from database
      const latestProfile = await fetchUserProfile(authUser.id);
      return { latestProfile, authUser };
    };

    try {
      // 3-second timeout protection
      const result: any = await Promise.race([
        fetchWithTimeout(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Database sync timeout')), 3000)),
      ]);

      if (result?.latestProfile) {
        populateFromProfile(result.latestProfile);
        setUser(result.latestProfile);
        useAuthStore.getState().setUser(result.latestProfile);
      }
    } catch (err: any) {
      console.warn('[ProfileEdit] Database fetch fallback to local:', err?.message || err);
      // Fallback: populate from existing store
      const localUser = useAuthStore.getState().user;
      if (localUser) {
        populateFromProfile(localUser);
      }
    } finally {
      setLoading(false);
    }
  }, [populateFromProfile, setUser]);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      loadProfileFromDatabase();
    }
  }, [loadProfileFromDatabase]);

  const getInitialDate = () => {
    if (dob) {
      const clean = dob.trim();
      if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) {
        const parts = clean.split('-');
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        const dateObj = new Date(y, m, d);
        if (!isNaN(dateObj.getTime())) return dateObj;
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
        const parts = clean.split('-');
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const dateObj = new Date(y, m, d);
        if (!isNaN(dateObj.getTime())) return dateObj;
      }
    }
    return new Date(2005, 0, 1);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formatted = `${day}-${month}-${year}`;
      setDob(formatted);
      setDobError('');
    }
  };

  const handleSave = async () => {
    // Reset all errors
    setFirstNameError('');
    setPhoneError('');
    setDobError('');

    const finalFirstName = firstName.trim();
    const finalLastName = lastName.trim();

    if (!finalFirstName) {
      setFirstNameError('First Name is required.');
      return Alert.alert('Missing Name', 'Please enter your First Name.');
    }
    if (finalFirstName.length < 2 || !/^[a-zA-Z\s]+$/.test(finalFirstName)) {
      setFirstNameError('First Name must contain only letters (min 2 characters).');
      return Alert.alert('Invalid Name', 'First Name must contain only letters (min 2 characters).');
    }
    if (finalLastName && !/^[a-zA-Z\s]+$/.test(finalLastName)) {
      return Alert.alert('Invalid Name', 'Last Name must contain only letters.');
    }

    const phoneVal = phone.trim();
    if (phoneVal) {
      const phoneCheck = validatePhone(phoneVal);
      if (!phoneCheck.isValid) {
        setPhoneError(phoneCheck.error || 'Please enter a valid 10-digit phone number.');
        return Alert.alert('Invalid Phone', phoneCheck.error || 'Please enter a valid 10-digit phone number.');
      }
    }

    const dobVal = dob.trim();
    if (!isAdmin && dobVal) {
      const dobCheck = validateDOB(dobVal);
      if (!dobCheck.isValid) {
        setDobError(dobCheck.error || 'Please enter a valid date of birth.');
        return Alert.alert('Invalid Date', dobCheck.error || 'Please enter a valid date of birth.');
      }
    }

    setSaving(true);
    try {
      // 1. Identify currently authenticated user session
      const { data: authData } = await supabase.auth.getUser();
      const authUserId = authData?.user?.id || user?.id;

      if (!authUserId) {
        throw new Error('No active user session. Please sign in again.');
      }

      const name = `${finalFirstName} ${finalLastName}`.trim();

      const updatedPayload: any = isAdmin
        ? {
            name,
            full_name: name,
            phone: phoneVal,
            gender: gender.trim(),
            department: department.trim() || 'Campus Administration',
            college_name: assignedCollege || user?.college_name || 'Government Institute of Electronics',
            current_status: 'Active Administrator',
            bio: bio.trim(),
            email: userEmail || authData?.user?.email,
            is_profile_saved: true,
          }
        : {
            name,
            full_name: name,
            phone: phoneVal,
            dob: dobVal,
            gender: gender.trim(),
            currentStatus: currentStatus.trim(),
            current_status: currentStatus.trim(),
            branch: branch.trim(),
            year: year.trim() || '1st Year',
            domain: domain.trim(),
            bio: bio.trim(),
            email: userEmail || authData?.user?.email,
            is_profile_saved: true,
          };

      const standardFeedXId = resolveStandardFeedXId({
        ...user,
        ...updatedPayload,
        full_name: name,
        id: authUserId,
      });

      updatedPayload.feedx_id = standardFeedXId;

      // 2. Direct database update and verification
      const confirmedUser = await updateProfile(authUserId, updatedPayload);

      // 3. Update In-Memory & Persistent Auth State
      const mergedConfirmed = {
        ...user,
        ...confirmedUser,
        full_name: name,
        feedx_id: standardFeedXId,
        bio: bio.trim(),
        first_login_completed: true,
        is_profile_saved: true,
      };

      setUser(mergedConfirmed);
      useAuthStore.getState().setUser(mergedConfirmed);

      // 4. Invalidate and refresh application caches
      if (refreshDashboard) {
        await refreshDashboard(true).catch(() => {});
      }
      if (refreshProfile) {
        await refreshProfile(authUserId).catch(() => {});
      }

      try {
        await AsyncStorage.setItem(`@feedx_user_profile_${authUserId}`, JSON.stringify(mergedConfirmed));
        await AsyncStorage.setItem('@feedx_user_profile', JSON.stringify(mergedConfirmed));
      } catch (_) {}

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } catch {}

      Alert.alert(
        'Profile Saved 🎉',
        'Your profile details have been saved directly to the database.',
        [{ text: 'OK', onPress: () => safeBack('/(tabs)/user_profile') }]
      );
    } catch (e: any) {
      console.error('[ProfileEdit] Save failed:', e);
      Alert.alert(
        'Save Failed',
        e.message || 'Unable to update profile details in the database. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && (
        <LinearGradient
          colors={['#0F172A', '#020617']}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9', borderColor: colors.border }]}
          onPress={() => safeBack('/(tabs)/user_profile')}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Edit Profile</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            {loading ? 'Fetching database details...' : 'Direct Database Synchronization'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || loading}
          style={[
            styles.headerSaveBtn,
            { backgroundColor: colors.primary, opacity: saving || loading ? 0.6 : 1 },
          ]}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.headerSaveBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Loading Indicator (Only shown if user data is completely missing during initial fetch) */}
      {loading && !user ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading latest profile details from database...
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View entering={FadeInDown.duration(300)}>
              {/* Fetch Warning / Retry Banner */}
              {fetchError ? (
                <View style={styles.warningBanner}>
                  <Feather name="alert-circle" size={16} color="#F59E0B" />
                  <Text style={styles.warningText} numberOfLines={2}>
                    {fetchError}
                  </Text>
                  <TouchableOpacity onPress={loadProfileFromDatabase} style={styles.retryBtn}>
                    <Text style={styles.retryBtnText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* Identity Mini Banner */}
              <View style={[styles.identityBanner, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <View style={styles.identityTopRow}>
                  <UserAvatar user={user} size={50} showBadge />
                  <View style={styles.identityTextWrap}>
                    <View style={styles.identityNameRow}>
                      <Text style={[styles.identityName, { color: colors.textPrimary }]} numberOfLines={1}>
                        {firstName || lastName ? `${firstName} ${lastName}`.trim() : (user?.full_name || (userEmail ? userEmail.split('@')[0] : (isAdmin ? 'FEEDX Administrator' : 'Verified Student')))}
                      </Text>
                      <View style={[styles.verifiedBadge, { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)' }]}>
                        <MaterialCommunityIcons name="shield-check" size={13} color="#10B981" />
                        <Text style={styles.verifiedBadgeText}>{isAdmin ? 'ADMIN' : 'VERIFIED'}</Text>
                      </View>
                    </View>
                    <Text style={[styles.identityMeta, { color: colors.textMuted }]} numberOfLines={1}>
                      {assignedCollege || user?.college_name || (isAdmin ? (user?.role === 'super_admin' ? 'FEEDX Master Control' : 'State Polytechnic') : 'State Polytechnic')} • {user?.feedx_id || (isAdmin ? 'Admin' : 'Verified ID')}
                    </Text>
                  </View>
                </View>

                {userEmail ? (
                  <View style={[styles.emailPill, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : '#EFF6FF', borderColor: isDark ? 'rgba(59, 130, 246, 0.22)' : '#BFDBFE' }]}>
                    <Feather name="mail" size={13} color="#3B82F6" />
                    <Text style={[styles.identityEmail, { color: colors.primary }]} numberOfLines={1} ellipsizeMode="tail">
                      {userEmail}
                    </Text>
                  </View>
                ) : null}
              </View>

              {isAdmin ? (
                <>
                  {/* ADMIN SECTION 1: PERSONAL & CONTACT INFORMATION */}
                  <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <View style={styles.sectionHeaderRow}>
                      <View style={[styles.sectionIconWrap, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                        <Feather name="shield" size={15} color="#3B82F6" />
                      </View>
                      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>ADMINISTRATOR PERSONAL DETAILS</Text>
                    </View>

                    {/* First Name & Last Name 2-Column Row */}
                    <View style={styles.rowTwoCols}>
                      <View style={styles.colFlex}>
                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>FIRST NAME *</Text>
                        <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: firstNameError ? '#EF4444' : colors.border }]}>
                          <Feather name="user" size={15} color={firstNameError ? '#EF4444' : colors.textMuted} style={styles.inputLeadingIcon} />
                          <TextInput
                            style={[styles.textInput, { color: colors.textPrimary }]}
                            value={firstName}
                            onChangeText={(t) => {
                              setFirstName(t);
                              if (firstNameError) setFirstNameError('');
                            }}
                            placeholder="First Name"
                            placeholderTextColor={colors.inputPlaceholder}
                          />
                        </View>
                        {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
                      </View>

                      <View style={styles.colFlex}>
                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>LAST NAME</Text>
                        <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                          <Feather name="user" size={15} color={colors.textMuted} style={styles.inputLeadingIcon} />
                          <TextInput
                            style={[styles.textInput, { color: colors.textPrimary }]}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Last Name"
                            placeholderTextColor={colors.inputPlaceholder}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Admin ID & Official Email (Read-Only) */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>ADMIN ID</Text>
                      <View style={[styles.inputBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9', borderColor: colors.border }]}>
                        <Feather name="hash" size={15} color={colors.textMuted} style={styles.inputLeadingIcon} />
                        <TextInput
                          style={[styles.textInput, { color: colors.textSecondary }]}
                          value={user?.feedx_id || user?.id || 'ADM-FEEDX'}
                          editable={false}
                        />
                      </View>
                    </View>

                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>OFFICIAL EMAIL</Text>
                      <View style={[styles.inputBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9', borderColor: colors.border }]}>
                        <Feather name="mail" size={15} color={colors.textMuted} style={styles.inputLeadingIcon} />
                        <TextInput
                          style={[styles.textInput, { color: colors.textSecondary }]}
                          value={userEmail || user?.email || ''}
                          editable={false}
                        />
                      </View>
                    </View>

                    {/* Phone Number */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>OFFICIAL PHONE NUMBER</Text>
                      <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: phoneError ? '#EF4444' : colors.border }]}>
                        <Feather name="phone" size={15} color={phoneError ? '#EF4444' : colors.textMuted} style={styles.inputLeadingIcon} />
                        <TextInput
                          style={[styles.textInput, { color: colors.textPrimary }]}
                          value={phone}
                          onChangeText={(t) => {
                            setPhone(t);
                            if (phoneError) setPhoneError('');
                          }}
                          placeholder="10-digit official contact number"
                          keyboardType="phone-pad"
                          placeholderTextColor={colors.inputPlaceholder}
                        />
                      </View>
                      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                    </View>

                    {/* Gender Selection */}
                    <View style={[styles.fieldItem, { marginBottom: 0 }]}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>GENDER</Text>
                      <View style={styles.chipsRow}>
                        {GENDER_OPTIONS.map((opt) => {
                          const isSelected = gender?.toLowerCase() === opt.toLowerCase();
                          return (
                            <TouchableOpacity
                              key={opt}
                              style={[
                                styles.chipBtn,
                                {
                                  backgroundColor: isSelected
                                    ? colors.primary
                                    : isDark
                                      ? 'rgba(255, 255, 255, 0.04)'
                                      : '#F8FAFC',
                                  borderColor: isSelected ? colors.primary : colors.border,
                                },
                              ]}
                              onPress={() => setGender(opt)}
                              activeOpacity={0.8}
                            >
                              <Text
                                style={[
                                  styles.chipBtnText,
                                  { color: isSelected ? '#FFFFFF' : colors.textSecondary, fontWeight: isSelected ? '800' : '600' },
                                ]}
                              >
                                {opt}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>

                  {/* ADMIN SECTION 2: INSTITUTIONAL ROLE & APPOINTMENT */}
                  <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <View style={styles.sectionHeaderRow}>
                      <View style={[styles.sectionIconWrap, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                        <MaterialCommunityIcons name="office-building" size={15} color="#8B5CF6" />
                      </View>
                      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>INSTITUTIONAL APPOINTMENT</Text>
                    </View>

                    {/* Assigned College */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>ASSIGNED COLLEGE / CAMPUS</Text>
                      <View style={[styles.inputBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9', borderColor: colors.border }]}>
                        <MaterialCommunityIcons name="school" size={15} color={colors.primary} style={styles.inputLeadingIcon} />
                        <TextInput
                          style={[styles.textInput, { color: colors.textPrimary, fontWeight: '700' }]}
                          value={assignedCollege || user?.college_name || 'Government Institute of Electronics'}
                          editable={false}
                        />
                      </View>
                    </View>

                    {/* Administrative Department */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>ADMINISTRATIVE DEPARTMENT</Text>
                      <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                        <Feather name="briefcase" size={15} color={colors.textMuted} style={styles.inputLeadingIcon} />
                        <TextInput
                          style={[styles.textInput, { color: colors.textPrimary }]}
                          value={department}
                          onChangeText={setDepartment}
                          placeholder="e.g. Campus Administration, Examination Cell"
                          placeholderTextColor={colors.inputPlaceholder}
                        />
                      </View>
                    </View>

                    {/* Administrative Role & Account Status */}
                    <View style={styles.rowTwoCols}>
                      <View style={styles.colFlex}>
                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>ADMIN ROLE</Text>
                        <View style={[styles.inputBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
                          <Text style={{ fontSize: 12, fontWeight: '800', color: '#3B82F6' }}>
                            {user?.role === 'super_admin' ? '🛡️ Super Admin' : '🏛️ College Admin'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.colFlex}>
                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>ACCOUNT STATUS</Text>
                        <View style={[styles.inputBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                          <Text style={{ fontSize: 12, fontWeight: '800', color: '#10B981' }}>
                            Active Administrator
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Bio / Administrative Desk Note */}
                    <View style={[styles.fieldItem, { marginBottom: 0 }]}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>ADMINISTRATIVE BIO & DESK NOTE</Text>
                      <View style={[styles.bioInputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                        <TextInput
                          style={[styles.bioTextInput, { color: colors.textPrimary }]}
                          value={bio}
                          onChangeText={setBio}
                          placeholder="Write a brief profile description or office hours note..."
                          placeholderTextColor={colors.inputPlaceholder}
                          multiline
                          numberOfLines={3}
                        />
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  {/* SECTION 1: PERSONAL INFORMATION */}
                  <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <View style={styles.sectionHeaderRow}>
                      <View style={[styles.sectionIconWrap, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                        <Feather name="user" size={15} color="#3B82F6" />
                      </View>
                      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>PERSONAL INFORMATION</Text>
                    </View>

                    {/* First Name & Last Name 2-Column Row */}
                    <View style={styles.rowTwoCols}>
                      <View style={styles.colFlex}>
                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>FIRST NAME *</Text>
                        <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: firstNameError ? '#EF4444' : colors.border }]}>
                          <Feather name="user" size={15} color={firstNameError ? '#EF4444' : colors.textMuted} style={styles.inputLeadingIcon} />
                          <TextInput
                            style={[styles.textInput, { color: colors.textPrimary }]}
                            value={firstName}
                            onChangeText={(t) => {
                              setFirstName(t);
                              if (firstNameError) setFirstNameError('');
                            }}
                            placeholder="First Name"
                            placeholderTextColor={colors.inputPlaceholder}
                          />
                        </View>
                        {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
                      </View>

                      <View style={styles.colFlex}>
                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>LAST NAME</Text>
                        <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                          <Feather name="user" size={15} color={colors.textMuted} style={styles.inputLeadingIcon} />
                          <TextInput
                            style={[styles.textInput, { color: colors.textPrimary }]}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Last Name"
                            placeholderTextColor={colors.inputPlaceholder}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Phone Number */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>PHONE NUMBER</Text>
                      <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: phoneError ? '#EF4444' : colors.border }]}>
                        <Feather name="phone" size={15} color={phoneError ? '#EF4444' : colors.textMuted} style={styles.inputLeadingIcon} />
                        <TextInput
                          style={[styles.textInput, { color: colors.textPrimary }]}
                          value={phone}
                          onChangeText={(t) => {
                            setPhone(t);
                            if (phoneError) setPhoneError('');
                          }}
                          placeholder="10-digit mobile number"
                          keyboardType="phone-pad"
                          placeholderTextColor={colors.inputPlaceholder}
                        />
                      </View>
                      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                    </View>

                    {/* Date of Birth */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>DATE OF BIRTH *</Text>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowDatePicker(true)}
                        style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: dobError ? '#EF4444' : colors.border }]}
                      >
                        <Feather name="calendar" size={15} color={dobError ? '#EF4444' : colors.primary} style={styles.inputLeadingIcon} />
                        <Text
                          style={[
                            styles.textInput,
                            {
                              color: dob ? colors.textPrimary : colors.inputPlaceholder,
                              lineHeight: 44,
                            },
                          ]}
                        >
                          {dob || 'Select Date of Birth (DD-MM-YYYY)'}
                        </Text>
                        <Feather name="chevron-down" size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                      {dobError ? (
                        <Text style={styles.errorText}>{dobError}</Text>
                      ) : (
                        <Text style={[styles.hintText, { color: colors.textMuted }]}>Tap to select from calendar (DD-MM-YYYY)</Text>
                      )}

                      {showDatePicker && (
                        <DateTimePicker
                          value={getInitialDate()}
                          mode="date"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          maximumDate={new Date()}
                          minimumDate={new Date(1970, 0, 1)}
                          onChange={handleDateChange}
                        />
                      )}
                    </View>

                    {/* Registered Student Email (Read-Only) */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>REGISTERED EMAIL ADDRESS</Text>
                      <View style={[styles.inputBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9', borderColor: colors.border }]}>
                        <Feather name="mail" size={15} color={colors.textMuted} style={styles.inputLeadingIcon} />
                        <TextInput
                          style={[styles.textInput, { color: colors.textSecondary, flex: 1 }]}
                          value={userEmail || user?.email || ''}
                          editable={false}
                          selectTextOnFocus={true}
                        />
                      </View>
                      <Text style={[styles.hintText, { color: colors.textMuted }]}>Permanent authentication email associated with your FEEDX account.</Text>
                    </View>

                    {/* Gender Selection */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>GENDER</Text>
                      <View style={styles.chipsRow}>
                        {GENDER_OPTIONS.map((opt) => {
                          const isSelected = gender?.toLowerCase() === opt.toLowerCase();
                          return (
                            <TouchableOpacity
                              key={opt}
                              style={[
                                styles.chipBtn,
                                {
                                  backgroundColor: isSelected
                                    ? colors.primary
                                    : isDark
                                      ? 'rgba(255, 255, 255, 0.04)'
                                      : '#F8FAFC',
                                  borderColor: isSelected ? colors.primary : colors.border,
                                },
                              ]}
                              onPress={() => setGender(opt)}
                              activeOpacity={0.8}
                            >
                              <Text
                                style={[
                                  styles.chipBtnText,
                                  { color: isSelected ? '#FFFFFF' : colors.textSecondary, fontWeight: isSelected ? '800' : '600' },
                                ]}
                              >
                                {opt}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    {/* Current Status Selection */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>CURRENT STATUS</Text>
                      <View style={styles.chipsRow}>
                        {STATUS_OPTIONS.map((opt) => {
                          const isSelected = currentStatus?.toLowerCase() === opt.toLowerCase();
                          return (
                            <TouchableOpacity
                              key={opt}
                              style={[
                                styles.chipBtn,
                                {
                                  backgroundColor: isSelected
                                    ? colors.primary
                                    : isDark
                                      ? 'rgba(255, 255, 255, 0.04)'
                                      : '#F8FAFC',
                                  borderColor: isSelected ? colors.primary : colors.border,
                                },
                              ]}
                              onPress={() => setCurrentStatus(opt)}
                              activeOpacity={0.8}
                            >
                              <Text
                                style={[
                                  styles.chipBtnText,
                                  { color: isSelected ? '#FFFFFF' : colors.textSecondary, fontWeight: isSelected ? '800' : '600' },
                                ]}
                              >
                                {opt}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    {/* Bio / Description */}
                    <View style={[styles.fieldItem, { marginBottom: 0 }]}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>BIO / ABOUT ME</Text>
                      <View style={[styles.bioInputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                        <TextInput
                          style={[styles.bioTextInput, { color: colors.textPrimary }]}
                          value={bio}
                          onChangeText={setBio}
                          placeholder="Write a brief intro about yourself, your career ambitions, or interests..."
                          placeholderTextColor={colors.inputPlaceholder}
                          multiline
                          numberOfLines={3}
                        />
                      </View>
                    </View>
                  </View>

                  {/* SECTION 2: ACADEMIC DETAILS */}
                  <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <View style={styles.sectionHeaderRow}>
                      <View style={[styles.sectionIconWrap, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                        <MaterialCommunityIcons name="school-outline" size={15} color="#8B5CF6" />
                      </View>
                      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>ACADEMIC INFORMATION</Text>
                    </View>

                    {/* Department / Branch */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>BRANCH / DEPARTMENT</Text>
                      <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                        <Feather name="book-open" size={15} color={colors.textMuted} style={styles.inputLeadingIcon} />
                        <TextInput
                          style={[styles.textInput, { color: colors.textPrimary }]}
                          value={branch}
                          onChangeText={setBranch}
                          placeholder="e.g. Computer Science (CSE), ECE, Mechanical"
                          placeholderTextColor={colors.inputPlaceholder}
                        />
                      </View>
                    </View>

                    {/* Academic Year Selection */}
                    <View style={styles.fieldItem}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>ACADEMIC YEAR *</Text>
                      <View style={styles.chipsRow}>
                        {ACADEMIC_YEAR_OPTIONS.map((opt) => {
                          const isSelected = year?.toLowerCase() === opt.toLowerCase();
                          return (
                            <TouchableOpacity
                              key={opt}
                              style={[
                                styles.chipBtn,
                                {
                                  backgroundColor: isSelected
                                    ? colors.primary
                                    : isDark
                                      ? 'rgba(255, 255, 255, 0.04)'
                                      : '#F8FAFC',
                                  borderColor: isSelected ? colors.primary : colors.border,
                                },
                              ]}
                              onPress={() => setYear(opt)}
                              activeOpacity={0.8}
                            >
                              <Text
                                style={[
                                  styles.chipBtnText,
                                  { color: isSelected ? '#FFFFFF' : colors.textSecondary, fontWeight: isSelected ? '800' : '600' },
                                ]}
                              >
                                {opt}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    {/* Domain of Interest */}
                    <View style={[styles.fieldItem, { marginBottom: 0 }]}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>DOMAIN OF INTEREST</Text>
                      <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                        <Feather name="compass" size={15} color={colors.textMuted} style={styles.inputLeadingIcon} />
                        <TextInput
                          style={[styles.textInput, { color: colors.textPrimary }]}
                          value={domain}
                          onChangeText={setDomain}
                          placeholder="e.g. Full Stack, AI/ML, Cloud, Cybersecurity"
                          placeholderTextColor={colors.inputPlaceholder}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}

              {/* Bottom Save Action Button */}
              <PressableCard
                onPress={handleSave}
                disabled={saving || loading}
                style={styles.bottomSaveWrapper}
              >
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.saveBtnGradient}>
                  {saving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                  ) : (
                    <Feather name="check-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  )}
                  <Text style={styles.saveBtnText}>
                    {saving ? 'SAVING PROFILE DIRECTLY TO DATABASE...' : 'SAVE PROFILE CHANGES'}
                  </Text>
                </LinearGradient>
              </PressableCard>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 11.5,
    color: '#D97706',
    fontWeight: '600',
  },
  retryBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F59E0B',
    borderRadius: 6,
  },
  retryBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 14,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    ...SHADOWS.small,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitleWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  headerSaveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSaveBtnText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  identityBanner: {
    borderRadius: RADIUS.xl,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    gap: 10,
    ...SHADOWS.small,
  },
  identityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  identityTextWrap: {
    flex: 1,
  },
  identityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  identityName: {
    fontSize: 14.5,
    fontWeight: '800',
    flex: 1,
  },
  identityMeta: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  identityEmail: {
    fontSize: 11.5,
    fontWeight: '700',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#10B981',
  },
  sectionCard: {
    borderRadius: RADIUS.xl,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    ...SHADOWS.small,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  colFlex: {
    flex: 1,
  },
  fieldItem: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  inputLeadingIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 0,
    height: '100%',
  },
  bioInputBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minHeight: 88,
  },
  bioTextInput: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    textAlignVertical: 'top',
    height: '100%',
  },
  hintText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipBtnText: {
    fontSize: 12,
  },
  bottomSaveWrapper: {
    marginTop: 6,
    marginBottom: 16,
  },
  saveBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    ...SHADOWS.medium,
  },
  errorText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 2,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
