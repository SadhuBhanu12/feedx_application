import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { completeUserOnboarding, uploadResourceFile } from '@/services/supabaseService';

function DropdownSelect({ label, placeholder, options, value, onSelect, keyName, icon }: any) {
  const [open, setOpen] = useState(false);
  const selectedObj = options.find((o: any) => o.id === value);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.inputWrapper} 
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Feather name={icon || "book"} size={18} color="rgba(255,255,255,0.4)" />
        <Text style={[styles.input, !selectedObj && { color: 'rgba(255,255,255,0.2)' }]}>
          {selectedObj ? selectedObj[keyName] : placeholder}
        </Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={16} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>
      
      {open && options.length > 0 && (
        <View style={styles.optionsDropdown}>
          {options.map((opt: any) => (
            <TouchableOpacity 
              key={opt.id} 
              style={[styles.optionItem, value === opt.id && styles.optionItemActive]}
              onPress={() => {
                onSelect(opt.id);
                setOpen(false);
              }}
            >
              <Text style={[styles.optionText, value === opt.id && styles.optionTextActive]}>
                {opt[keyName]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  
  // Lists from DB
  const [colleges, setColleges] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);

  // Selected state
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch dropdown collections
  useEffect(() => {
    const fetchOnboardingData = async () => {
      try {
        const [colRes, brRes, yrRes] = await Promise.all([
          supabase.from('colleges').select('id, college_name').order('college_name'),
          supabase.from('branches').select('id, branch_name').order('branch_name'),
          supabase.from('academic_years').select('id, year_name').order('year_name')
        ]);
        setColleges(colRes.data || []);
        setBranches(brRes.data || []);
        setYears(yrRes.data || []);
      } catch (err) {
        console.warn('Error fetching onboarding lists:', err);
      }
    };
    fetchOnboardingData();
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log('Error picking image:', err);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setError('User not found. Please log in again.');
      return;
    }
    if (!selectedCollege) {
      setError('Please select your College.');
      return;
    }
    if (!selectedBranch) {
      setError('Please select your Engineering Branch.');
      return;
    }
    if (!selectedYear) {
      setError('Please select your Academic Year / Batch.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let avatarUrl = user?.avatar_url || null;

      if (photoUri) {
        const fileName = `avatar_${user.id}_${Date.now()}.jpg`;
        avatarUrl = await uploadResourceFile(photoUri, fileName, 'image/jpeg');
      }

      await completeUserOnboarding(user.id, {
        avatar_url: avatarUrl,
        phone,
        bio,
        college_id: selectedCollege,
        branch_id: selectedBranch,
        academic_year_id: selectedYear
      });
      
      if (setUser) {
        setUser({ 
          ...user, 
          avatar_url: avatarUrl, 
          phone, 
          bio, 
          college_id: selectedCollege,
          branch_id: selectedBranch,
          academic_year_id: selectedYear,
          first_login_completed: true 
        });
      }
      
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={COLORS.gradientHome || ['#000000', '#0a0a0a']} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Let&apos;s add some basic details to personalize your FeedX experience.</Text>
        </Animated.View>

        <View style={styles.card}>
          <Animated.View entering={FadeInUp.delay(200).duration(500)}>
            <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage} activeOpacity={0.8}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Feather name="camera" size={32} color="rgba(255,255,255,0.5)" />
                  <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Feather name="edit-2" size={12} color="#FFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {error ? (
            <Animated.View entering={FadeInUp} style={styles.errorBox}>
              <Feather name="alert-circle" size={16} color={COLORS.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          ) : null}

          {/* College Dropdown */}
          <Animated.View entering={FadeInUp.delay(250).duration(500)}>
            <DropdownSelect 
              label="Select College"
              placeholder="Choose your institution"
              options={colleges}
              value={selectedCollege}
              onSelect={setSelectedCollege}
              keyName="college_name"
              icon="home"
            />
          </Animated.View>

          {/* Branch Dropdown */}
          <Animated.View entering={FadeInUp.delay(300).duration(500)}>
            <DropdownSelect 
              label="Engineering Branch"
              placeholder="Choose your department / branch"
              options={branches}
              value={selectedBranch}
              onSelect={setSelectedBranch}
              keyName="branch_name"
              icon="git-branch"
            />
          </Animated.View>

          {/* Academic Year Dropdown */}
          <Animated.View entering={FadeInUp.delay(350).duration(500)}>
            <DropdownSelect 
              label="Academic Year / Batch"
              placeholder="Choose your year of study"
              options={years}
              value={selectedYear}
              onSelect={setSelectedYear}
              keyName="year_name"
              icon="calendar"
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <View style={styles.inputWrapper}>
              <Feather name="phone" size={18} color="rgba(255,255,255,0.4)" />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(450).duration(500)} style={styles.inputGroup}>
            <Text style={styles.label}>Bio (Optional)</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <Feather name="info" size={18} color="rgba(255,255,255,0.4)" style={styles.textAreaIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write a short bio about yourself..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).duration(500)}>
            <TouchableOpacity style={styles.cta} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={COLORS.gradientPrimary || ['#3b82f6', '#2563eb']} style={styles.ctaGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.ctaText}>Continue to Dashboard</Text>
                    <Feather name="arrow-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center', paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 40 },
  title: { color: '#FFF', fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  card: {
    backgroundColor: 'rgba(20,20,20,0.5)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 8,
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  imagePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary || '#3b82f6',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0a0a0a',
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginLeft: 4, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    height: 54,
  },
  input: { flex: 1, marginLeft: 12, color: '#FFF', fontSize: 15, fontWeight: '600' },
  textAreaWrapper: { height: 110, alignItems: 'flex-start', paddingTop: 14 },
  textAreaIcon: { marginTop: 2 },
  textArea: { height: 80 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(239,68,68,0.1)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', marginBottom: 20 },
  errorText: { color: COLORS.danger, fontSize: 13, fontWeight: '600', flex: 1 },
  cta: { height: 56, borderRadius: 18, overflow: 'hidden', marginTop: 12, shadowColor: COLORS.primary || '#3b82f6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  ctaGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#FFF', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
  optionsDropdown: {
    marginTop: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  optionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  optionItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  optionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#3B82F6',
    fontWeight: '800',
  },
});
