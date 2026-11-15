import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Share, Alert, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { COLORS, SHADOWS, RADIUS, SPACING } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import QRCode from 'react-native-qrcode-svg';
import { UserAvatar } from '@/components/ui/UserAvatar';
import StudentIdCardFlip from '@/components/ui/StudentIdCardFlip';
import { resolveStandardFeedXId, resolveQuizueId, getQrVerificationPayload } from '@/services/idService';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

function DropdownSelect({ label, placeholder, options, value, onSelect, keyName, icon }) {
  const [open, setOpen] = useState(false);
  const selectedObj = options.find((o) => o.id === value);

  return (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>{label}</Text>
      <TouchableOpacity 
        style={styles.dropdownHeader} 
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Feather name={icon || "book"} size={16} color="rgba(255,255,255,0.4)" />
        <Text style={[styles.dropdownHeaderText, !selectedObj && { color: 'rgba(255,255,255,0.2)' }]}>
          {selectedObj ? selectedObj[keyName] : placeholder}
        </Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={14} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>
      
      {open && options.length > 0 && (
        <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
          {options.map((opt) => (
            <TouchableOpacity 
              key={opt.id} 
              style={[styles.dropdownItem, value === opt.id && styles.dropdownItemActive]}
              onPress={() => {
                onSelect(opt.id);
                setOpen(false);
              }}
            >
              <Text style={[styles.dropdownItemText, value === opt.id && styles.dropdownItemTextActive]}>
                {opt[keyName]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default function IDGeneratorScreen() {
  const router = useRouter();
  const { user, setUser, refreshDashboard } = useUser();
  const { colors, isDark } = useTheme();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fullQrVisible, setFullQrVisible] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  
  const [rollNumber, setRollNumber] = useState(user?.roll_no || '');
  const [selectedCollege, setSelectedCollege] = useState(user?.college_id || '');
  const [selectedBranch, setSelectedBranch] = useState(user?.branch_id || '');
  const [selectedYear, setSelectedYear] = useState(user?.academic_year_id || '');
  const [saving, setSaving] = useState(false);

  const roll = user?.roll_no || user?.roll_number;
  // Details are only missing if there is no valid roll number
  const isMissingDetails = !roll || roll === 'PENDING';

  // Automatically fetch & synchronize student profile details from Supabase database
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.id) return;
      try {
        const { data: stData } = await supabase
          .from('students')
          .select('*, colleges(college_name), branches(branch_name), academic_years(year_name, semester)')
          .eq('id', user.id)
          .maybeSingle();

        if (stData) {
          setUser((prev) => ({
            ...prev,
            full_name: stData.full_name || prev?.full_name,
            name: stData.full_name || prev?.name,
            phone: stData.phone || prev?.phone,
            feedx_id: stData.feedx_id || prev?.feedx_id,
            roll_no: stData.roll_number || prev?.roll_no || '21001-C-001',
            roll_number: stData.roll_number || prev?.roll_number || '21001-C-001',
            branch: stData.branches?.branch_name || stData.branch || prev?.branch || 'CSE',
            college_name: stData.colleges?.college_name || prev?.college_name || 'FEEDX Polytechnic',
            year: stData.year || stData.academic_years?.year_name || prev?.year || '3rd Year',
            semester: stData.semester || stData.academic_years?.semester || prev?.semester || '5',
            college_id: stData.college_id || prev?.college_id,
            branch_id: stData.branch_id || prev?.branch_id,
            academic_year_id: stData.academic_year_id || prev?.academic_year_id,
          }));
        }
      } catch (e) {
        console.warn('[IDGenerator] Auto fetch error:', e);
      }
    };
    fetchStudentData();
  }, [user?.id]);

  // Load dropdown lists on mount
  useEffect(() => {
    const loadDropdownData = async () => {
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
        console.warn('Error loading dropdowns in ID Generator:', err);
      }
    };
    loadDropdownData();
  }, []);

  const handleSaveDetails = async () => {
    const cleanRoll = rollNumber.trim().toUpperCase();
    if (!cleanRoll || cleanRoll === 'PENDING') {
      Alert.alert('Validation Error', 'Please enter a valid Roll Number.');
      return;
    }
    if (cleanRoll.length < 4 || cleanRoll.length > 20) {
      Alert.alert('Validation Error', 'Roll Number must be between 4 and 20 characters.');
      return;
    }
    if (!/^[A-Z0-9\-\/]+$/.test(cleanRoll)) {
      Alert.alert('Validation Error', 'Roll Number can only contain letters, numbers, hyphens, or slashes.');
      return;
    }
    if (!selectedCollege) {
      Alert.alert('Validation Error', 'Please select a College.');
      return;
    }
    if (!selectedBranch) {
      Alert.alert('Validation Error', 'Please select a Branch.');
      return;
    }
    if (!selectedYear) {
      Alert.alert('Validation Error', 'Please select an Academic Year.');
      return;
    }

    setSaving(true);
    try {
      // 1. Update students table in Supabase
      const { error: dbErr } = await supabase
        .from('students')
        .update({
          roll_number: cleanRoll,
          college_id: selectedCollege,
          branch_id: selectedBranch,
          academic_year_id: selectedYear
        })
        .eq('id', user.id);

      if (dbErr) throw dbErr;

      // 2. Fetch the newly enriched user profile
      const [studentProfileRes, userProfileRes] = await Promise.all([
        supabase.from('students').select('*, colleges(college_name), branches(branch_name), academic_years(year_name, semester)').eq('id', user.id).maybeSingle(),
        supabase.from('users').select('*').eq('id', user.id).maybeSingle()
      ]);

      const updatedStudent = studentProfileRes.data;
      const updatedUser = userProfileRes.data;

      // 3. Update the global context state
      if (setUser) {
        setUser((prev) => ({
          ...prev,
          ...updatedUser,
          ...updatedStudent,
          roll_no: updatedStudent?.roll_number || '',
          college_name: updatedStudent?.colleges?.college_name || 'FEEDX Polytechnic',
          branch: updatedStudent?.branches?.branch_name || updatedStudent?.branch || '',
          year: updatedStudent?.year || updatedStudent?.academic_years?.year_name || '',
          semester: updatedStudent?.semester || updatedStudent?.academic_years?.semester || '',
          college_id: selectedCollege,
          branch_id: selectedBranch,
          academic_year_id: selectedYear
        }));
      }

      if (refreshDashboard) {
        refreshDashboard(true).catch(() => {});
      }

      Alert.alert('Success', 'Your ID details have been updated successfully.');
      setEditModalVisible(false);
    } catch (err) {
      Alert.alert('Save Failed', err.message || 'Unable to update details in the database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFill} />}
      
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.inputBg }]}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>FEEDX ID</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Your Verified Digital Student Identity</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(350).springify()} style={styles.cardContainer}>
          <StudentIdCardFlip user={user} showTapHint={true} />
        </Animated.View>

        {/* Action Buttons Row */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <TouchableOpacity 
            style={[styles.downloadBtn, { flex: 1 }]}
            onPress={() => {
              const currentFeedxId = resolveStandardFeedXId(user);
              if (Platform.OS === 'web' && navigator?.clipboard) {
                navigator.clipboard.writeText(currentFeedxId);
              }
              Alert.alert('Copied!', `FEEDX ID (${currentFeedxId}) copied successfully.`);
            }}
          >
             <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.btnInner} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Feather name="copy" size={18} color="#FFF" />
                <Text style={styles.btnText} numberOfLines={1}>Copy FEEDX ID</Text>
             </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.downloadBtn, { flex: 1 }]}
            onPress={() => {
              const currentFeedxId = resolveStandardFeedXId(user);
              const message = `📜 FEEDX Verified Student Identity Card\n\n👤 Name: ${user?.full_name || 'Student'}\n🆔 FEEDX ID: ${currentFeedxId}\n🏛️ Institution: ${user?.college_name || 'FEEDX Polytechnic'}\n📚 Branch: ${user?.branch || 'N/A'}\n🎓 Academic Year: ${user?.year || '1st Year'}\n✅ Status: Verified Polytechnic Student\n🔗 Verification: https://feedxpolytechnic.com/verify/${currentFeedxId}`;
              Alert.alert(
                'Digital ID Export',
                'Your verified digital identity is ready to share.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Share ID Card', 
                    onPress: () => Share.share({ message, title: 'FEEDX Verified Student ID' }) 
                  }
                ]
              );
            }}
          >
             <LinearGradient colors={COLORS.gradientSecondary} style={styles.btnInner} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Feather name="share-2" size={18} color="#FFF" />
                <Text style={styles.btnText} numberOfLines={1}>Share Identity</Text>
             </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tipBox}>
           <Feather name="info" size={16} color={COLORS.textMuted} />
           <Text style={styles.tipText}>This digital identity is permanently stored in the database and valid for all institutional services.</Text>
        </View>
      </ScrollView>

      {/* Full-Screen High-Res QR Code Modal */}
      <Modal visible={fullQrVisible} animationType="fade" transparent={true} onRequestClose={() => setFullQrVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'center', padding: 24, gap: 16 }]}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF' }}>FEEDX Digital QR Code</Text>
              <TouchableOpacity onPress={() => setFullQrVisible(false)}>
                <Feather name="x" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginVertical: 12 }}>
              <QRCode
                value={getQrVerificationPayload(resolveStandardFeedXId(user), resolveQuizueId(user))}
                size={220}
                color="#000"
                backgroundColor="#FFF"
              />
            </View>

            <Text style={{ fontSize: 14, fontWeight: '800', color: '#60A5FA', letterSpacing: 0.5 }}>
              {resolveStandardFeedXId(user)}
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
              Scan this QR code to verify student identity, library access, and institutional credentials.
            </Text>

            <TouchableOpacity
              style={[styles.downloadBtn, { width: '100%', marginTop: 8 }]}
              onPress={() => {
                const currentId = resolveStandardFeedXId(user);
                if (Platform.OS === 'web' && navigator?.clipboard) {
                  navigator.clipboard.writeText(currentId);
                }
                Alert.alert('Copied!', 'FEEDX ID copied successfully.');
              }}
            >
              <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.btnInner} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Feather name="copy" size={18} color="#FFF" />
                <Text style={styles.btnText}>Copy FEEDX ID</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Editing Form Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true} onRequestClose={() => isMissingDetails ? router.back() : setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Complete Your FEEDX Profile</Text>
                <TouchableOpacity onPress={() => isMissingDetails ? router.back() : setEditModalVisible(false)}>
                  <Feather name="x" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>ROLL NUMBER</Text>
                  <TextInput 
                    style={styles.formInput} 
                    value={rollNumber} 
                    onChangeText={setRollNumber} 
                    placeholder="Enter Roll Number" 
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    autoCapitalize="characters"
                  />
                </View>

                <DropdownSelect 
                  label="COLLEGE / INSTITUTION"
                  placeholder="Choose College"
                  options={colleges}
                  value={selectedCollege}
                  onSelect={setSelectedCollege}
                  keyName="college_name"
                  icon="school"
                />

                <DropdownSelect 
                  label="DEPARTMENT / BRANCH"
                  placeholder="Choose Branch"
                  options={branches}
                  value={selectedBranch}
                  onSelect={setSelectedBranch}
                  keyName="branch_name"
                  icon="git-branch"
                />

                <DropdownSelect 
                  label="ACADEMIC YEAR / BATCH"
                  placeholder="Choose Academic Year"
                  options={years}
                  value={selectedYear}
                  onSelect={setSelectedYear}
                  keyName="year_name"
                  icon="calendar"
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveDetails} disabled={saving}>
                  {saving ? (
                    <ButtonLoading color="#FFF" />
                  ) : (
                    <Text style={styles.saveBtnText}>Generate FEEDX ID</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

import { rf, rs } from '@/constants/responsive';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: rs(54), paddingHorizontal: rs(24), paddingBottom: rs(16), flexDirection: 'row', alignItems: 'center', gap: rs(16) },
  backBtn: { width: rs(44), height: rs(44), borderRadius: rs(12), backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: rf(24), fontWeight: '900', color: '#FFF' },
  subtitle: { fontSize: rf(13), color: COLORS.textMuted, fontWeight: '600' },
  editCardBtn: { width: rs(44), height: rs(44), borderRadius: rs(12), backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: rs(24) },
  cardContainer: { marginBottom: rs(32) },
  idCard: { width: '100%', minHeight: rs(230), borderRadius: rs(24), padding: rs(20), borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', ...SHADOWS.medium },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: rs(12), marginBottom: rs(16), borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingBottom: rs(12) },
  logo: { width: rs(32), height: rs(32), borderRadius: rs(8) },
  instName: { color: '#FFFFFF', fontSize: rf(14), fontWeight: '900' },
  cardType: { color: '#E0F2FE', fontSize: rf(10), fontWeight: '900', letterSpacing: 1 },
  cardBody: { flexDirection: 'row', gap: rs(16) },
  photoContainer: { width: rs(74), height: rs(74), borderRadius: rs(12), borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  studentPhoto: { width: '100%', height: '100%' },
  infoCol: { flex: 1 },
  name: { color: '#FFFFFF', fontSize: rf(18), fontWeight: '900', marginBottom: rs(2) },
  roll: { color: '#F0F9FF', fontSize: rf(12), fontWeight: '800', marginBottom: rs(8) },
  detailRow: { flexDirection: 'row', gap: rs(8), marginBottom: rs(4) },
  label: { color: '#E0F2FE', fontSize: rf(10), fontWeight: '800' },
  value: { color: '#FFFFFF', fontSize: rf(10), fontWeight: '900' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: rs(12), paddingTop: rs(12), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  validText: { color: '#FFFFFF', fontSize: rf(10), fontWeight: '900' },
  authText: { color: '#E0F2FE', fontSize: rf(8.5), fontWeight: '800' },
  downloadBtn: { marginBottom: rs(24) },
  btnInner: { minHeight: rs(54), borderRadius: rs(20), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rs(12) },
  btnText: { color: '#FFF', fontSize: rf(16), fontWeight: '800' },
  tipBox: { flexDirection: 'row', gap: rs(12), padding: rs(18), backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: rs(16) },
  tipText: { flex: 1, fontSize: rf(12), color: COLORS.textMuted, lineHeight: rf(18) },
  
  // Modal & Form Styling
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContainer: { height: '85%' },
  modalContent: { flex: 1, backgroundColor: '#0F172A', borderTopLeftRadius: rs(28), borderTopRightRadius: rs(28), borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: rs(24) },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rs(20) },
  modalTitle: { fontSize: rf(18), fontWeight: '900', color: '#FFF' },
  formScroll: { flex: 1 },
  formGroup: { marginBottom: rs(18) },
  formLabel: { fontSize: rf(10), fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rs(8), marginLeft: rs(4) },
  formInput: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: rs(14), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', paddingHorizontal: rs(16), height: rs(50), color: '#FFF', fontSize: rf(14), fontWeight: '600' },
  dropdownHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: rs(14), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', paddingHorizontal: rs(16), height: rs(50) },
  dropdownHeaderText: { flex: 1, marginLeft: rs(12), color: '#FFF', fontSize: rf(14), fontWeight: '600' },
  dropdownList: { marginTop: rs(6), maxHeight: rs(150), backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: rs(14), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  dropdownItem: { padding: rs(14), borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.02)' },
  dropdownItemActive: { backgroundColor: 'rgba(59,130,246,0.15)' },
  dropdownItemText: { color: 'rgba(255,255,255,0.7)', fontSize: rf(13), fontWeight: '600' },
  dropdownItemTextActive: { color: '#3B82F6', fontWeight: '800' },
  saveBtn: { backgroundColor: '#3B82F6', minHeight: rs(50), borderRadius: rs(14), alignItems: 'center', justifyContent: 'center', marginTop: rs(24), marginBottom: rs(40) },
  saveBtnText: { color: '#FFF', fontSize: rf(14), fontWeight: '800' }
});
