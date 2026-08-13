import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { adminDeleteStudentProfile, adminListStudents, adminUpsertStudentProfile, bulkUpsertStudents, adminResetUserPassword } from '@/services/supabaseService';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';

interface StudentRecord {
  id: string;
  roll_number: string;
  full_name: string;
  email: string;
  branch_id?: string;
  year?: number | string;
  users?: { full_name: string; email: string };
  branches?: { branch_name: string };
}

export default function StudentRegistry() {
  const router = useRouter();
  const listRef = useRef<any>(null);
  const { user } = useUser();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ id: '', roll_number: '', full_name: '', email: '', branch_id: '', year: '1', pin_number: '', date_of_birth: '', custom_password: '' });

  // Student Password Reset Modal State
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedStudentForPassword, setSelectedStudentForPassword] = useState<StudentRecord | null>(null);
  const [newCustomPassword, setNewCustomPassword] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminListStudents(user?.college_id);
      setStudents(data || []);
    } catch (e: any) {
      console.log('Registry Error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.college_id) return;
    loadData();
    // Real-time Identity Sync
    const channel = supabase.channel(`student-registry-rt-${user.college_id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students', filter: `college_id=eq.${user.college_id}` }, loadData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.college_id]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await adminDeleteStudentProfile(id);
      loadData();
    } catch (e: any) {
      Alert.alert('Delete Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPasswordReset = (student: StudentRecord) => {
    setSelectedStudentForPassword(student);
    setNewCustomPassword('');
    setPasswordModalVisible(true);
  };

  const handleConfirmCustomPassword = async () => {
    if (!selectedStudentForPassword) return;
    if (!newCustomPassword.trim()) {
      return Alert.alert('Validation Error', 'Please enter a new password.');
    }
    if (newCustomPassword.trim().length < 6) {
      return Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
    }

    setLoading(true);
    try {
      await adminResetUserPassword(selectedStudentForPassword.id, newCustomPassword.trim());
      Alert.alert(
        'Password Updated',
        `Password for ${selectedStudentForPassword.full_name || selectedStudentForPassword.users?.full_name} has been updated successfully.`
      );
      setPasswordModalVisible(false);
      loadData();
    } catch (err: any) {
      Alert.alert('Reset Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDOB = async () => {
    if (!selectedStudentForPassword) return;
    setLoading(true);
    try {
      await adminResetUserPassword(selectedStudentForPassword.id, null);
      Alert.alert(
        'Password Reset',
        `Password for ${selectedStudentForPassword.full_name || selectedStudentForPassword.users?.full_name} has been reset to their default Date of Birth.`
      );
      setPasswordModalVisible(false);
      loadData();
    } catch (err: any) {
      Alert.alert('Reset Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.roll_number || !form.full_name) {
      Alert.alert('Incomplete Identity', 'Roll Number and Full Name are mandatory.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.from('students').upsert({
        id: form.id || undefined,
        college_id: user?.college_id || null,
        roll_number: form.roll_number.trim().toUpperCase(),
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        branch_id: form.branch_id || null,
        year: parseInt(form.year) || 1,
        pin_number: form.pin_number.trim() || null,
        date_of_birth: form.date_of_birth.trim() || null,
        is_password_set: form.custom_password ? true : false,
      }).select('id').single();

      if (error) throw error;

      if (form.custom_password.trim() && data?.id) {
        await adminResetUserPassword(data.id, form.custom_password.trim());
      }

      Alert.alert('Identity Synchronized', 'Student record and authentication details have been updated.');
      setForm({ id: '', roll_number: '', full_name: '', email: '', branch_id: '', year: '1', pin_number: '', date_of_birth: '', custom_password: '' });
      loadData();
    } catch (e: any) {
      Alert.alert('Sync Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(s => 
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
           <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerText}>
           <Text style={styles.headerTitle}>Student Registry</Text>
           <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ENROLLMENT CHANNEL ACTIVE</Text>
           </View>
        </View>
        <TouchableOpacity style={styles.importBtn}>
           <MaterialCommunityIcons name="account-plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

       <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadData}
        initialNumToRender={8}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <Animated.View entering={FadeInDown} style={styles.formSection}>
            <BlurView intensity={10} tint="light" style={styles.composerCard}>
              <View style={styles.composerHeader}>
                 <Text style={styles.composerLabel}>IDENTITY COMPOSER</Text>
                 <View style={styles.composerLine} />
              </View>

              <View style={styles.inputGrid}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Roll Number</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.roll_number} 
                    onChangeText={t => setForm(f => ({ ...f, roll_number: t }))} 
                    placeholder="22K61A05..." 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    autoCapitalize="characters"
                  />
                </View>
                <View style={[styles.field, { flex: 2 }]}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.full_name} 
                    onChangeText={t => setForm(f => ({ ...f, full_name: t }))} 
                    placeholder="Full Name" 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>
              </View>

              <View style={styles.inputGrid}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Branch ID</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.branch_id} 
                    onChangeText={t => setForm(f => ({ ...f, branch_id: t }))} 
                    placeholder="UUID" 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Year</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.year} 
                    onChangeText={t => setForm(f => ({ ...f, year: t }))} 
                    placeholder="1-4" 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Institutional Email</Text>
                <TextInput 
                  style={styles.input} 
                  value={form.email} 
                  onChangeText={t => setForm(f => ({ ...f, email: t }))} 
                  placeholder="student@institution.edu" 
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGrid}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>PIN Number</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.pin_number} 
                    onChangeText={t => setForm(f => ({ ...f, pin_number: t }))} 
                    placeholder="123456" 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.date_of_birth} 
                    onChangeText={t => setForm(f => ({ ...f, date_of_birth: t }))} 
                    placeholder="YYYY-MM-DD" 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Temporary Password (Optional)</Text>
                <TextInput 
                  style={styles.input} 
                  value={form.custom_password} 
                  onChangeText={t => setForm(f => ({ ...f, custom_password: t }))} 
                  placeholder="Leave empty to keep current / default" 
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.buttonGradient}>
                   <Text style={styles.primaryButtonText}>{form.id ? 'UPDATE IDENTITY' : 'REGISTER STUDENT'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>

            <View style={styles.searchSection}>
               <View style={styles.searchBox}>
                  <Feather name="search" size={18} color="rgba(255,255,255,0.3)" />
                  <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search Registry..." 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={search}
                    onChangeText={setSearch}
                  />
               </View>
            </View>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 50)} style={styles.studentCardContainer}>
            <View style={styles.studentCard}>
               <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{item.full_name?.[0]}</Text>
               </View>
               <View style={styles.studentInfo}>
                  <View style={styles.cardHeader}>
                     <Text style={styles.studentRoll}>{item.roll_number}</Text>
                     <View style={styles.yearBadge}>
                        <Text style={styles.yearText}>YR {item.year}</Text>
                     </View>
                  </View>
                  <Text style={styles.studentName}>{item.full_name || item.users?.full_name || 'No Name'}</Text>
                  <Text style={styles.studentMeta}>{item.branches?.branch_name || 'N/A'} • {item.email || item.users?.email}</Text>
               </View>
               <TouchableOpacity 
                 style={[styles.editBtn, { backgroundColor: 'rgba(245, 158, 11, 0.05)', marginRight: 8 }]} 
                 onPress={() => handleOpenPasswordReset(item)}
               >
                  <Feather name="key" size={16} color="#F59E0B" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.editBtn} onPress={() => setForm({
                 id: item.id,
                 roll_number: item.roll_number,
                 full_name: item.full_name || item.users?.full_name || '',
                 email: item.email || item.users?.email || '',
                 branch_id: item.branch_id || '',
                 year: String(item.year || '1'),
                 pin_number: (item as any).pin_number || '',
                 date_of_birth: (item as any).date_of_birth || '',
                 custom_password: ''
               })}>
                  <Feather name="edit-3" size={18} color="#3B82F6" />
               </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Password Reset Modal */}
      <Modal visible={passwordModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#0F172A', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#FFF' }}>Change Student Password</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <Feather name="x" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
              Updating password for <Text style={{ color: '#F59E0B', fontWeight: '800' }}>{selectedStudentForPassword?.full_name || selectedStudentForPassword?.roll_number}</Text>
            </Text>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>NEW CUSTOM PASSWORD</Text>
              <TextInput
                style={{ height: 50, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, paddingHorizontal: 16, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
                placeholder="Enter new password (min 6 chars)..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={newCustomPassword}
                onChangeText={setNewCustomPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={{ height: 50, borderRadius: 14, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
              onPress={handleConfirmCustomPassword}
            >
              <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14 }}>UPDATE TO NEW PASSWORD</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ height: 46, borderRadius: 14, backgroundColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', alignItems: 'center', justifyContent: 'center' }}
              onPress={handleResetToDOB}
            >
              <Text style={{ color: '#F59E0B', fontWeight: '800', fontSize: 13 }}>RESET TO DEFAULT (DOB)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: 1 },
  importBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  formSection: { padding: 20 },
  composerCard: { padding: 24, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  composerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  composerLabel: { fontSize: 10, fontWeight: '900', color: '#3B82F6', letterSpacing: 1.5 },
  composerLine: { flex: 1, height: 1, backgroundColor: 'rgba(59, 130, 246, 0.2)' },
  inputGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  input: { height: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, paddingHorizontal: 16, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  primaryButton: { height: 54, borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  buttonGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  searchSection: { marginTop: 32, marginBottom: 20 },
  searchBox: { height: 54, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  searchInput: { flex: 1, marginLeft: 12, color: '#FFF', fontSize: 15 },
  listContent: { paddingBottom: 120 },
  studentCardContainer: { marginHorizontal: 20, marginBottom: 12 },
  studentCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', gap: 16 },
  avatarCircle: { width: 50, height: 50, borderRadius: 18, backgroundColor: 'rgba(59, 130, 246, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#3B82F6' },
  studentInfo: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  studentRoll: { fontSize: 12, fontWeight: '900', color: '#3B82F6' },
  yearBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)' },
  yearText: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.4)' },
  studentName: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  studentMeta: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 6, fontWeight: '600' },
  editBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(59, 130, 246, 0.05)', alignItems: 'center', justifyContent: 'center' }
});
