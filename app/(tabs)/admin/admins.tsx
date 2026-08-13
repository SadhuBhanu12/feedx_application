import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { adminDeleteAdmin, adminListAdmins, adminUpsertAdmin, adminResetUserPassword, adminListColleges } from '@/services/supabaseService';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';

interface AdminRecord {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  college_id?: string;
  status?: string;
  last_sign_in_at?: string;
  created_at?: string;
  colleges?: { name: string };
}

export default function AdminRegistry() {
  const router = useRouter();
  const listRef = useRef<any>(null);
  const { user } = useUser();
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ id: '', full_name: '', email: '', phone: '', college_id: '', role: 'inst_admin', custom_password: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminListAdmins();
      setAdmins(data || []);
      const cols = await adminListColleges();
      setColleges(cols || []);
    } catch (e: any) {
      console.log('Registry Error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Real-time Identity Sync
    const channel = supabase.channel('admin-registry-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, loadData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await adminDeleteAdmin(id);
      loadData();
    } catch (e: any) {
      Alert.alert('Delete Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReset = async (studentId: string, name: string) => {
    Alert.alert(
      'Reset Student Password',
      `Are you sure you want to reset the password for ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Password',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await adminResetUserPassword(studentId, null);
              Alert.alert('Success', `Password for ${name} has been reset.`);
              loadData();
            } catch (err: any) {
              Alert.alert('Reset Failed', err.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!form.email || !form.full_name) {
      Alert.alert('Incomplete Identity', 'Email and Full Name are mandatory.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users').upsert({
        id: form.id || undefined,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        college_id: form.college_id || null,
        role: form.role,
      }).select('id').single();

      if (error) throw error;

      if (form.custom_password.trim() && data?.id) {
        await adminResetUserPassword(data.id, form.custom_password.trim());
      }

      Alert.alert('Identity Synchronized', 'Admin record and authentication details have been updated.');
      setForm({ id: '', full_name: '', email: '', phone: '', college_id: '', role: 'inst_admin', custom_password: '' });
      loadData();
    } catch (e: any) {
      Alert.alert('Sync Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = admins.filter(s => 
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
           <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerText}>
           <Text style={styles.headerTitle}>Admin Registry</Text>
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
                  <Text style={styles.label}>Email</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.email} 
                    onChangeText={t => setForm(f => ({ ...f, email: t }))} 
                    placeholder="admin@college.edu" 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    autoCapitalize="none"
                  />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
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
                  <Text style={styles.label}>Phone</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.phone} 
                    onChangeText={t => setForm(f => ({ ...f, phone: t }))} 
                    placeholder="Optional" 
                    placeholderTextColor="rgba(255,255,255,0.2)" 
                  />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>College ID</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.college_id} 
                    onChangeText={t => setForm(f => ({ ...f, college_id: t }))} 
                    placeholder="UUID" 
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
                  placeholder="Leave empty to keep current" 
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.buttonGradient}>
                   <Text style={styles.primaryButtonText}>{form.id ? 'UPDATE ADMIN' : 'REGISTER ADMIN'}</Text>
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
                      <Text style={styles.studentName}>{item.full_name || 'No Name'}</Text>
                      <View style={styles.yearBadge}>
                         <Text style={styles.yearText}>{item.role.toUpperCase()}</Text>
                      </View>
                   </View>
                   <Text style={styles.studentMeta}>{item.colleges?.name || 'Global'} • {item.email}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.editBtn, { backgroundColor: 'rgba(245, 158, 11, 0.05)', marginRight: 8 }]} 
                  onPress={() => handleQuickReset(item.id, item.full_name || 'Admin')}
                >
                   <Feather name="key" size={16} color="#F59E0B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.editBtn} onPress={() => setForm({
                  id: item.id,
                  full_name: item.full_name || '',
                  email: item.email || '',
                  phone: item.phone || '',
                  college_id: item.college_id || '',
                  role: item.role || 'inst_admin',
                  custom_password: ''
                })}>
                   <Feather name="edit-3" size={18} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.editBtn, { marginLeft: 8, backgroundColor: 'rgba(239, 68, 68, 0.05)' }]} onPress={() => handleDelete(item.id)}>
                   <Feather name="trash-2" size={18} color="#EF4444" />
                </TouchableOpacity>
             </View>
          </Animated.View>
        )}
        contentContainerStyle={styles.listContent}
      />
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
