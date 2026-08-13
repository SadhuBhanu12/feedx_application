import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { updateProfile } from '@/services/supabaseService';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { validatePhone, validateText } from '@/utils/validation';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();

  // Helper to check if a field is already saved in database
  const isFilled = (val: any) => {
    if (!val) return false;
    const str = String(val).trim();
    return str !== '' && str !== 'User' && str !== 'Student';
  };

  // Determine individual field lock states based on existing saved details
  const rawFullName = user?.full_name || '';
  const nameParts = rawFullName.trim().split(' ');
  const savedFirstName = isFilled(rawFullName) ? nameParts[0] : '';
  const savedLastName = isFilled(rawFullName) && nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  const isFirstNameLocked = false;
  const isLastNameLocked = false;
  const isPhoneLocked = false;
  const isDobLocked = false;
  const isGenderLocked = false;
  const isStatusLocked = false;
  const isBranchLocked = false;
  const isYearLocked = false;
  const isDomainLocked = false;
  const isLinkedinLocked = false;
  const isGithubLocked = false;
  const isBioLocked = false;

  // Editable Form state
  const [firstName, setFirstName] = useState(savedFirstName);
  const [lastName, setLastName] = useState(savedLastName);
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.date_of_birth || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [currentStatus, setCurrentStatus] = useState(user?.current_status || 'Student');
  const [branch, setBranch] = useState(user?.branch || '');
  const [year, setYear] = useState(String(user?.year || ''));
  const [domain, setDomain] = useState(user?.domain || '');
  const [linkedin, setLinkedin] = useState(user?.social_links?.linkedin || '');
  const [github, setGithub] = useState(user?.social_links?.github || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [saving, setSaving] = useState(false);

  // Count fields
  const fieldList = [
    isFirstNameLocked,
    isLastNameLocked,
    isPhoneLocked,
    isDobLocked,
    isGenderLocked,
    isStatusLocked,
    isBranchLocked,
    isYearLocked,
    isDomainLocked,
    isLinkedinLocked,
    isGithubLocked,
    isBioLocked,
  ];

  const lockedCount = fieldList.filter(Boolean).length;
  const editableCount = fieldList.length - lockedCount;

  const handleSave = async () => {
    if (editableCount === 0) {
      return Alert.alert('Profile Locked', 'All your profile details have already been saved and verified.');
    }

    const finalFirstName = isFirstNameLocked ? savedFirstName : firstName.trim();
    const finalLastName = isLastNameLocked ? savedLastName : lastName.trim();

    // Validation checks
    if (!isFirstNameLocked && !finalFirstName) {
      return Alert.alert('Validation Error', 'Please enter your First Name.');
    }
    if (!isFirstNameLocked && (finalFirstName.length < 2 || !/^[a-zA-Z\s]+$/.test(finalFirstName))) {
      return Alert.alert('Validation Error', 'First Name must contain only letters and be at least 2 characters long.');
    }
    if (!isLastNameLocked && finalLastName && !/^[a-zA-Z\s]+$/.test(finalLastName)) {
      return Alert.alert('Validation Error', 'Last Name must contain only letters and spaces.');
    }

    const phoneVal = isPhoneLocked ? (user?.phone || '') : phone.trim();
    if (!isPhoneLocked && phoneVal) {
      const phoneCheck = validatePhone(phoneVal);
      if (!phoneCheck.isValid) {
        return Alert.alert('Validation Error', phoneCheck.error || 'Invalid phone number');
      }
    }

    const yearVal = isYearLocked ? String(user?.year || '') : year.trim();
    if (!isYearLocked && yearVal) {
      const numYear = parseInt(yearVal, 10);
      if (isNaN(numYear) || numYear < 1 || numYear > 4) {
        return Alert.alert('Validation Error', 'Academic Year must be a number between 1 and 4.');
      }
    }

    const linkedinVal = isLinkedinLocked ? (user?.social_links?.linkedin || '') : linkedin.trim();
    if (!isLinkedinLocked && linkedinVal && !linkedinVal.includes('linkedin.com') && !linkedinVal.startsWith('http')) {
      return Alert.alert('Validation Error', 'Please enter a valid LinkedIn URL (e.g. linkedin.com/in/username).');
    }

    const githubVal = isGithubLocked ? (user?.social_links?.github || '') : github.trim();
    if (!isGithubLocked && githubVal && !githubVal.includes('github.com') && !githubVal.startsWith('http')) {
      return Alert.alert('Validation Error', 'Please enter a valid GitHub URL (e.g. github.com/username).');
    }

    setSaving(true);
    try {
      const name = `${finalFirstName} ${finalLastName}`.trim();

      const updatedData = {
        name,
        phone: phoneVal,
        dob: isDobLocked ? user.date_of_birth : dob.trim(),
        gender: isGenderLocked ? user.gender : gender.trim(),
        currentStatus: isStatusLocked ? user.current_status : currentStatus.trim(),
        branch: isBranchLocked ? user.branch : branch.trim(),
        year: yearVal,
        domain: isDomainLocked ? user.domain : domain.trim(),
        socialLinks: {
          linkedin: linkedinVal,
          github: githubVal,
        },
        bio: isBioLocked ? user.bio : bio.trim(),
        is_profile_saved: true,
      };

      if (user?.id) {
        await updateProfile(user.id, updatedData);
      }

      setUser((prev: any) => ({
        ...prev,
        full_name: name,
        phone: updatedData.phone,
        date_of_birth: updatedData.dob,
        gender: updatedData.gender,
        current_status: updatedData.currentStatus,
        branch: updatedData.branch,
        year: updatedData.year,
        domain: updatedData.domain,
        social_links: updatedData.socialLinks,
        bio: updatedData.bio,
        is_profile_saved: true,
      }));

      Alert.alert(
        'Profile Updated',
        'Your newly entered details have been saved to your profile and locked.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e: any) {
      Alert.alert('Save Failed', e.message || 'Unable to update profile details.');
    } finally {
      setSaving(false);
    }
  };

  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />}

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Edit Profile</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            {lockedCount > 0 ? `${lockedCount} Locked • ${editableCount} Editable` : 'Complete Personal Profile'}
          </Text>
        </View>

        {editableCount > 0 && (
          <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtnTouch}>
            {saving ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.saveBtnGradient}>
                <Text style={styles.saveBtnText}>SAVE</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(400)}>
          
          {/* Status Policy Banner */}
          {editableCount === 0 ? (
            <View style={styles.lockedBanner}>
              <View style={styles.bannerIconWrapLocked}>
                <Feather name="shield" size={22} color="#10B981" />
              </View>
              <View style={styles.bannerTextWrap}>
                <Text style={styles.bannerTitleLocked}>Profile Verified & Locked 🔒</Text>
                <Text style={styles.bannerDesc}>
                  All your profile information is registered in the database. Contact feedxhub@gmail.com if you need to update locked fields.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noticeBanner}>
              <View style={styles.bannerIconWrapNotice}>
                <Feather name="info" size={20} color="#3B82F6" />
              </View>
              <View style={styles.bannerTextWrap}>
                <Text style={styles.bannerTitleNotice}>Smart Field Locking 🔒</Text>
                <Text style={styles.bannerDesc}>
                  Previously saved fields are locked for security. Fill out any blank fields below and save to lock them.
                </Text>
              </View>
            </View>
          )}

          {/* Section 1: Personal Details */}
          <View style={styles.cardSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <MaterialCommunityIcons name="account-outline" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
            </View>

            {/* First Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>FIRST NAME</Text>
              {isFirstNameLocked ? (
                <LockedDisplay value={savedFirstName} icon="user" />
              ) : (
                <View style={styles.inputBox}>
                  <Feather name="user" size={16} color="rgba(255,255,255,0.4)" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter First Name"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                  />
                </View>
              )}
            </View>

            {/* Last Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>LAST NAME</Text>
              {isLastNameLocked ? (
                <LockedDisplay value={savedLastName} icon="user" />
              ) : (
                <View style={styles.inputBox}>
                  <Feather name="user" size={16} color="rgba(255,255,255,0.4)" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter Last Name"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                  />
                </View>
              )}
            </View>

            {/* Mobile Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>MOBILE NUMBER</Text>
              {isPhoneLocked ? (
                <LockedDisplay value={user.phone} icon="phone" />
              ) : (
                <View style={styles.inputBox}>
                  <Feather name="phone" size={16} color="rgba(255,255,255,0.4)" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+91 9876543210"
                    keyboardType="phone-pad"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                  />
                </View>
              )}
            </View>

            {/* Date of Birth */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>DATE OF BIRTH</Text>
              {isDobLocked ? (
                <LockedDisplay value={user.date_of_birth} icon="calendar" />
              ) : (
                <View style={styles.inputBox}>
                  <Feather name="calendar" size={16} color="rgba(255,255,255,0.4)" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={dob}
                    onChangeText={setDob}
                    placeholder="YYYY-MM-DD (e.g. 2004-05-15)"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                  />
                </View>
              )}
            </View>

            {/* Gender Selection */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>GENDER</Text>
              {isGenderLocked ? (
                <LockedDisplay value={user.gender} icon="user-check" />
              ) : (
                <View style={styles.optionsRow}>
                  {['Male', 'Female', 'Other'].map((opt) => {
                    const isSelected = gender?.toLowerCase() === opt.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.optionChip, isSelected && styles.optionChipActive]}
                        onPress={() => setGender(opt)}
                      >
                        <Text style={[styles.optionChipText, isSelected && styles.optionChipTextActive]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Current Status */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CURRENT STATUS</Text>
              {isStatusLocked ? (
                <LockedDisplay value={user.current_status} icon="briefcase" />
              ) : (
                <View style={styles.optionsRow}>
                  {['Student', 'Alumni'].map((opt) => {
                    const isSelected = currentStatus?.toLowerCase() === opt.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.optionChip, isSelected && styles.optionChipActive]}
                        onPress={() => setCurrentStatus(opt)}
                      >
                        <Text style={[styles.optionChipText, isSelected && styles.optionChipTextActive]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          {/* Section 2: Academic Details */}
          <View style={styles.cardSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBadge, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                <MaterialCommunityIcons name="school-outline" size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.sectionTitle}>ACADEMIC INFORMATION</Text>
            </View>

            {/* Branch */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>BRANCH / DEPARTMENT</Text>
              {isBranchLocked ? (
                <LockedDisplay value={user.branch} icon="book-open" />
              ) : (
                <View style={styles.inputBox}>
                  <Feather name="book-open" size={16} color="rgba(255,255,255,0.4)" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={branch}
                    onChangeText={setBranch}
                    placeholder="e.g. Computer Science (CSE)"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                  />
                </View>
              )}
            </View>

            {/* Year */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>ACADEMIC YEAR</Text>
              {isYearLocked ? (
                <LockedDisplay value={user.year} icon="award" />
              ) : (
                <View style={styles.inputBox}>
                  <Feather name="award" size={16} color="rgba(255,255,255,0.4)" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={year}
                    onChangeText={setYear}
                    placeholder="e.g. 1st Year / 2nd Year / 3rd Year"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                  />
                </View>
              )}
            </View>

            {/* Domain */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>DOMAIN OF INTEREST</Text>
              {isDomainLocked ? (
                <LockedDisplay value={user.domain} icon="compass" />
              ) : (
                <View style={styles.inputBox}>
                  <Feather name="compass" size={16} color="rgba(255,255,255,0.4)" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={domain}
                    onChangeText={setDomain}
                    placeholder="e.g. Web Dev, AI, Cloud, Embedded Systems"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                  />
                </View>
              )}
            </View>
          </View>

          {/* Section 3: Social & Portfolio */}
          <View style={styles.cardSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <MaterialCommunityIcons name="link-variant" size={18} color="#10B981" />
              </View>
              <Text style={styles.sectionTitle}>SOCIAL LINKS & BIO</Text>
            </View>

            {/* LinkedIn */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>LINKEDIN PROFILE URL</Text>
              {isLinkedinLocked ? (
                <LockedDisplay value={user.social_links?.linkedin} icon="linkedin" />
              ) : (
                <View style={styles.inputBox}>
                  <Feather name="linkedin" size={16} color="rgba(255,255,255,0.4)" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={linkedin}
                    onChangeText={setLinkedin}
                    placeholder="https://linkedin.com/in/yourprofile"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    autoCapitalize="none"
                  />
                </View>
              )}
            </View>

            {/* GitHub */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>GITHUB PROFILE URL</Text>
              {isGithubLocked ? (
                <LockedDisplay value={user.social_links?.github} icon="github" />
              ) : (
                <View style={styles.inputBox}>
                  <Feather name="github" size={16} color="rgba(255,255,255,0.4)" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={github}
                    onChangeText={setGithub}
                    placeholder="https://github.com/yourusername"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    autoCapitalize="none"
                  />
                </View>
              )}
            </View>

            {/* Bio */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PERSONAL BIO</Text>
              {isBioLocked ? (
                <LockedDisplay value={user.bio} icon="file-text" isMultiline />
              ) : (
                <View style={[styles.inputBox, { height: 100, alignItems: 'flex-start', paddingTop: 14 }]}>
                  <Feather name="file-text" size={16} color="rgba(255,255,255,0.4)" style={[styles.fieldIcon, { marginTop: 2 }]} />
                  <TextInput
                    style={[styles.input, { height: 76, textAlignVertical: 'top' }]}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Share a short bio about yourself..."
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    multiline
                  />
                </View>
              )}
            </View>
          </View>

          {/* Bottom Save Action Button */}
          {editableCount > 0 && (
            <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.bottomSaveBtn}>
              <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.bottomSaveGradient}>
                <Feather name="check-circle" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.bottomSaveText}>CONFIRM & SAVE DETAILS</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Clean, high-contrast display for locked fields
function LockedDisplay({ value, icon, isMultiline }: { value: string; icon?: string; isMultiline?: boolean }) {
  return (
    <View style={[styles.lockedBox, isMultiline && { height: 'auto', paddingVertical: 14 }]}>
      {icon && <Feather name={icon as any} size={15} color="#10B981" style={styles.fieldIcon} />}
      <Text style={[styles.lockedText, isMultiline && { lineHeight: 22 }]}>{value || '—'}</Text>
      <View style={styles.lockedBadge}>
        <Feather name="lock" size={11} color="#10B981" />
        <Text style={styles.lockedBadgeText}>Locked</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 46,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: '600' },
  saveBtnTouch: { borderRadius: 12, overflow: 'hidden' },
  saveBtnGradient: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  saveBtnText: { color: '#FFF', fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
  scroll: { padding: 20, paddingBottom: 60 },

  // Banners
  lockedBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerIconWrapLocked: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bannerTitleLocked: { fontSize: 14, fontWeight: '800', color: '#10B981', marginBottom: 2 },

  noticeBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerIconWrapNotice: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bannerTitleNotice: { fontSize: 14, fontWeight: '800', color: '#3B82F6', marginBottom: 2 },
  bannerTextWrap: { flex: 1 },
  bannerDesc: { fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 17 },

  // Card Sections
  cardSection: {
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 10 },
  sectionIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: '#FFF', letterSpacing: 0.8 },

  // Single Column Stacked Field Group
  fieldGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 10,
  },

  // Editable Input Container
  inputBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 0,
  },

  // Locked Display Container
  lockedBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  lockedText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  lockedBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },

  // Option Chips
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  optionChip: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  optionChipText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '700',
  },
  optionChipTextActive: {
    color: '#3B82F6',
    fontWeight: '800',
  },

  // Action Button
  bottomSaveBtn: { marginTop: 8, borderRadius: 18, overflow: 'hidden' },
  bottomSaveGradient: {
    flexDirection: 'row',
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSaveText: { color: '#FFF', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
});
