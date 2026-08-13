import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Platform, 
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { saListAdmins, saCreateAdminUser, adminResetUserPassword, saListColleges } from '@/services/supabaseService';
import { validateEmail, validatePhone, validateText, validatePassword } from '@/utils/validation';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface AdminRecord {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
  is_active?: boolean;
  admins?: {
    institution_id: string;
    colleges?: {
      college_name: string;
      college_code: string;
    };
  }[];
}

export default function AdminsManager() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal control
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRecord | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'inst_admin' | 'super_admin'>('inst_admin');
  const [actionLoading, setActionLoading] = useState(false);

  // College Autocomplete Search
  const [collegeSearchQuery, setCollegeSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Details Modal
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [activeDetailsAdmin, setActiveDetailsAdmin] = useState<AdminRecord | null>(null);

  const fetchAdminsAndColleges = async () => {
    try {
      setLoading(true);
      const [adminsData, collegesData] = await Promise.all([saListAdmins(), saListColleges()]);
      setAdmins(adminsData || []);
      setColleges(collegesData || []);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Load Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminsAndColleges();

    const channel = supabase.channel(`super-admin-admins-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => {
          fetchAdminsAndColleges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminsAndColleges();
  };

  // Autocomplete Filter
  const filteredColleges = collegeSearchQuery.trim() === '' 
    ? [] 
    : colleges.filter(c => 
        c.college_name?.toLowerCase().includes(collegeSearchQuery.toLowerCase()) ||
        c.college_code?.toLowerCase().includes(collegeSearchQuery.toLowerCase()) ||
        c.location?.toLowerCase().includes(collegeSearchQuery.toLowerCase()) ||
        String(c.ranking || '').includes(collegeSearchQuery)
      );

  const handleSelectCollege = (college: any) => {
    setSelectedCollege(college);
    setCollegeSearchQuery('');
    setShowDropdown(false);
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedAdmin(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('inst_admin');
    setSelectedCollege(null);
    setCollegeSearchQuery('');
    setShowDropdown(false);
    setModalVisible(true);
  };

  const handleOpenEdit = (admin: AdminRecord) => {
    setIsEditing(true);
    setSelectedAdmin(admin);
    setFullName(admin.full_name || '');
    setEmail(admin.email || '');
    setPhone(admin.phone || '');
    setPassword('');
    setRole(admin.role as any);
    
    // Find assigned college if exists
    const collegeInfo = admin.admins?.[0]?.colleges;
    const collegeId = admin.admins?.[0]?.institution_id;
    if (collegeId && collegeInfo) {
      setSelectedCollege({
        id: collegeId,
        college_name: collegeInfo.college_name,
        college_code: collegeInfo.college_code
      });
    } else {
      setSelectedCollege(null);
    }
    setCollegeSearchQuery('');
    setShowDropdown(false);
    setModalVisible(true);
  };

  const handleSaveAdmin = async () => {
    const nameCheck = validateText(fullName, { min: 3, max: 100, fieldName: 'Full Name' });
    if (!nameCheck.isValid) {
      return Alert.alert('Validation Error', nameCheck.error || 'Invalid name');
    }
    const emailCheck = validateEmail(email, role);
    if (!emailCheck.isValid) {
      return Alert.alert('Validation Error', emailCheck.error || 'Invalid email');
    }
    if (phone.trim()) {
      const phoneCheck = validatePhone(phone);
      if (!phoneCheck.isValid) {
        return Alert.alert('Validation Error', phoneCheck.error || 'Invalid phone number');
      }
    }
    if (!isEditing) {
      const passCheck = validatePassword(password);
      if (!passCheck.isValid) {
        return Alert.alert('Validation Error', passCheck.error || 'Invalid password');
      }
    }
    if ((role === 'inst_admin' || role === 'admin') && !selectedCollege) {
      return Alert.alert('Validation Error', 'Campus / College Admin must be assigned to a college.');
    }

    setActionLoading(true);
    try {
      if (isEditing && selectedAdmin) {
        // Edit User details
        const { error: userError } = await supabase
          .from('users')
          .update({
            full_name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
            role: role,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedAdmin.id);

        if (userError) throw userError;

        // Upsert admin record
        const { error: adminError } = await supabase
          .from('admins')
          .upsert({
            id: selectedAdmin.id,
            name: fullName.trim(),
            email: email.trim(),
            role: role,
            institution_id: (role === 'inst_admin' || role === 'admin') && selectedCollege ? selectedCollege.id : null
          });

        if (adminError) throw adminError;
        Alert.alert('Success', 'Admin profile updated.');
        setModalVisible(false);
      } else {
        // Create new Admin
        const collegeIdToPass = (role === 'inst_admin' || role === 'admin') && selectedCollege ? selectedCollege.id : null;
        const newUserId = await saCreateAdminUser(email.trim(), password.trim(), fullName.trim(), role, collegeIdToPass);
        
        // Also set phone number if provided
        if (phone.trim() && newUserId) {
          await supabase.from('users').update({ phone: phone.trim() }).eq('id', newUserId);
        }
        
        // Ensure they show up in the admins registry
        if (newUserId) {
          const { error: insertError } = await supabase.from('admins').upsert({
            id: newUserId,
            name: fullName.trim(),
            email: email.trim(),
            role: role,
            institution_id: collegeIdToPass
          });
          if (insertError) {
             console.warn("Could not upsert into admins table:", insertError);
          }
        }
        
        Alert.alert('Success', `${role.toUpperCase()} registered successfully.`);
        setModalVisible(false);
      }
      fetchAdminsAndColleges();
    } catch (err: any) {
      Alert.alert('Action Failed', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAdmin = (adminId: string, name: string) => {
    Alert.alert(
      'Remove Administrator',
      `Are you sure you want to permanently delete ${name}? This action is irreversible.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove User',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const { error } = await supabase.from('users').delete().eq('id', adminId);
              if (error) throw error;
              Alert.alert('Deleted', 'Admin removed successfully.');
              fetchAdminsAndColleges();
            } catch (err: any) {
              Alert.alert('Failed to remove admin', err.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleToggleSuspend = async (admin: AdminRecord) => {
    const newStatus = !admin.is_active;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: newStatus })
        .eq('id', admin.id);
      if (error) throw error;
      Alert.alert('Success', `Admin status set to: ${newStatus ? 'Active' : 'Suspended'}`);
      fetchAdminsAndColleges();
    } catch (e: any) {
      Alert.alert('Failed to update status', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (admin: AdminRecord) => {
    setActiveDetailsAdmin(admin);
    setDetailsModalVisible(true);
  };

  const handleResetPassword = (adminId: string, name: string) => {
    Alert.alert(
      'Reset Admin Password',
      `Enter a new custom password or reset it to the default date of birth for ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Default DOB Reset',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await adminResetUserPassword(adminId, undefined);
              Alert.alert('Success', 'Password has been reset to default DOB.');
            } catch (e: any) {
              Alert.alert('Reset Failed', e.message);
            } finally {
              setLoading(false);
            }
          }
        },
        {
          text: 'Custom Password',
          onPress: () => {
            Alert.prompt(
              'New Password',
              'Enter the new custom password:',
              async (newPass) => {
                if (!newPass || !newPass.trim()) return;
                setLoading(true);
                try {
                  await adminResetUserPassword(adminId, newPass.trim());
                  Alert.alert('Success', 'Custom password applied.');
                } catch (e: any) {
                  Alert.alert('Failed', e.message);
                } finally {
                  setLoading(false);
                }
              },
              'plain-text'
            );
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }: { item: AdminRecord; index: number }) => {
    const isSuspended = item.is_active === false;
    const collegeInfo = item.admins?.[0]?.colleges;

    return (
      <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
        <BlurView intensity={20} tint="dark" style={[styles.card, isSuspended && styles.cardSuspended]}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => handleOpenDetails(item)}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarContainer}>
                {item.avatar_url ? (
                  <OptimizedImage source={item.avatar_url} style={styles.avatarImg} />
                ) : (
                  <View style={styles.iconBox}>
                    <MaterialCommunityIcons 
                      name={item.role === 'super_admin' ? 'shield-crown' : 'shield-account'} 
                      size={24} 
                      color={item.role === 'super_admin' ? '#F59E0B' : '#10B981'} 
                    />
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.adminName}>{item.full_name || 'No Name'}</Text>
                <Text style={styles.adminEmail}>{item.email}</Text>
                {collegeInfo && (
                  <Text style={styles.adminCollegeText}>
                    🏢 {collegeInfo.college_name} ({collegeInfo.college_code})
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.cardFooter}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { borderColor: item.role === 'super_admin' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={[styles.badgeText, { color: item.role === 'super_admin' ? '#F59E0B' : '#10B981' }]}>
                  {item.role === 'inst_admin' ? 'COLLEGE ADMIN' : item.role.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.badge, { borderColor: isSuspended ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={[styles.badgeText, { color: isSuspended ? '#EF4444' : '#10B981' }]}>
                  {isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: 'rgba(245, 158, 11, 0.05)' }]} 
                onPress={() => handleResetPassword(item.id, item.full_name || 'Admin')}
              >
                <Feather name="key" size={15} color="#F59E0B" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: 'rgba(59, 130, 246, 0.05)' }]} 
                onPress={() => handleOpenEdit(item)}
              >
                <Feather name="edit-2" size={15} color="#3B82F6" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: isSuspended ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)' }]} 
                onPress={() => handleToggleSuspend(item)}
              >
                <Feather name={isSuspended ? 'unlock' : 'lock'} size={15} color={isSuspended ? '#10B981' : '#EF4444'} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.05)' }]} 
                onPress={() => handleDeleteAdmin(item.id, item.full_name || 'Admin')}
              >
                <Feather name="trash-2" size={15} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0B0F19', '#020408']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.headerTitle}>Admins Registry</Text>
          <Text style={styles.headerSubtitle}>System Administrators & Staff</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleOpenAdd}>
          <Feather name="user-plus" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={admins}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}
        ListEmptyComponent={() => (
          !loading ? <Text style={styles.emptyText}>No admins found.</Text> : null
        )}
      />

      {/* View Details Modal */}
      <Modal visible={detailsModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} tint="dark" style={styles.detailsContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Admin Dossier</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.detailsScroll}>
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                {activeDetailsAdmin?.avatar_url ? (
                  <OptimizedImage source={activeDetailsAdmin.avatar_url} style={styles.detailAvatar} />
                ) : (
                  <View style={[styles.detailAvatar, styles.detailAvatarPlaceholder]}>
                    <Feather name="user" size={40} color="rgba(255,255,255,0.4)" />
                  </View>
                )}
                <Text style={styles.detailNameText}>{activeDetailsAdmin?.full_name}</Text>
                <Text style={styles.detailRoleText}>{String(activeDetailsAdmin?.role).toUpperCase()}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email address</Text>
                <Text style={styles.detailValue}>{activeDetailsAdmin?.email}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone Contact</Text>
                <Text style={styles.detailValue}>{activeDetailsAdmin?.phone || 'Not provided'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Assigned Campus</Text>
                <Text style={styles.detailValue}>
                  {activeDetailsAdmin?.admins?.[0]?.colleges?.college_name || 'Global Access'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Campus Code</Text>
                <Text style={styles.detailValue}>
                  {activeDetailsAdmin?.admins?.[0]?.colleges?.college_code || 'ALL'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Member Since</Text>
                <Text style={styles.detailValue}>
                  {activeDetailsAdmin?.created_at ? new Date(activeDetailsAdmin.created_at).toLocaleDateString() : 'N/A'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Session Login</Text>
                <Text style={styles.detailValue}>
                  {activeDetailsAdmin?.last_login ? new Date(activeDetailsAdmin.last_login).toLocaleString() : 'Never logged in'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Registry Status</Text>
                <Text style={[styles.detailValue, { color: activeDetailsAdmin?.is_active === false ? '#EF4444' : '#10B981' }]}>
                  {activeDetailsAdmin?.is_active === false ? 'SUSPENDED' : 'ACTIVE'}
                </Text>
              </View>
            </ScrollView>
          </BlurView>
        </View>
      </Modal>

      {/* Add / Edit Admin Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <BlurView intensity={45} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Modify Admin' : 'Register Admin'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{ paddingHorizontal: 20, paddingTop: 10 }}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput 
                style={styles.modalInput}
                placeholder="e.g. Dr. Ramesh Kumar"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={fullName}
                onChangeText={setFullName}
              />

              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput 
                style={styles.modalInput}
                placeholder="e.g. principal@college.edu"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isEditing} // Email edits are restricted for auth safety
              />

              <Text style={styles.fieldLabel}>Phone number</Text>
              <TextInput 
                style={styles.modalInput}
                placeholder="e.g. +91 9876543210"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              {!isEditing && (
                <>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <TextInput 
                    style={styles.modalInput}
                    placeholder="Temporary login password"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </>
              )}

              <Text style={styles.fieldLabel}>System Role</Text>
              <View style={styles.roleGroup}>
                {(['inst_admin', 'admin', 'super_admin'] as const).map(r => (
                  <TouchableOpacity 
                    key={r}
                    style={[styles.roleSelectBtn, role === r && styles.roleSelectBtnActive]}
                    onPress={() => setRole(r)}
                  >
                    <Text style={[styles.roleSelectText, role === r && styles.roleSelectTextActive]}>
                      {r === 'inst_admin' ? 'CAMPUS ADMIN' : r.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {(role === 'inst_admin' || role === 'admin') && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.fieldLabel}>Assign College *</Text>
                  
                  {/* Selected College Card */}
                  {selectedCollege ? (
                    <View style={styles.selectedCollegeCard}>
                      <Feather name="check-circle" size={18} color="#10B981" />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.selectedCollegeName}>{selectedCollege.college_name}</Text>
                        <Text style={styles.selectedCollegeCode}>CODE: {selectedCollege.college_code}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setSelectedCollege(null)}>
                        <Feather name="x" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.searchContainer}>
                      <BlurView intensity={30} tint="dark" style={{ borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', padding: 8 }}>
                        <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                          {colleges.map((item) => (
                            <TouchableOpacity 
                              key={item.id} 
                              style={styles.dropdownRow} 
                              onPress={() => handleSelectCollege(item)}
                            >
                              <Text style={styles.dropdownRowText}>
                                {item.college_name} ({item.college_code})
                              </Text>
                              <Text style={styles.dropdownSubtext}>
                                Ranking: #{item.ranking || 'Unranked'} • {item.location || 'No Location'}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </BlurView>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalBtn, styles.confirmBtn]}
                  onPress={handleSaveAdmin}
                  disabled={actionLoading}
                >
                  {actionLoading ? <ActivityIndicator size="small" color="#000" /> : <Text style={styles.confirmBtnText}>{isEditing ? 'Save' : 'Register'}</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 70 : 50, paddingBottom: 15 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 20, paddingBottom: 120, gap: 16 },
  
  card: { padding: 18, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  cardSuspended: { borderColor: 'rgba(239, 68, 68, 0.2)', opacity: 0.7 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatarContainer: { width: 48, height: 48, borderRadius: 14, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  adminName: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  adminEmail: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: 2 },
  adminCollegeText: { fontSize: 11, color: '#3B82F6', fontWeight: '700', marginTop: 4 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)', paddingTop: 12 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  badge: { backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  
  actionRow: { flexDirection: 'row', gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 40, fontSize: 14 },

  // Details Modal
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  detailsContent: { width: '88%', maxHeight: '80%', backgroundColor: '#0F131E', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  detailsScroll: { padding: 24 },
  detailAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12, resizeMode: 'cover' },
  detailAvatarPlaceholder: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  detailNameText: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  detailRoleText: { fontSize: 11, color: '#10B981', fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },
  detailRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  detailLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 13, fontWeight: '700', color: '#FFF', marginTop: 4 },

  // Modal Input styles
  modalContent: { width: '90%', maxHeight: '85%', backgroundColor: '#0F131E', paddingVertical: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { fontSize: 19, fontWeight: '900', color: '#FFF' },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 },
  modalInput: { height: 46, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 14, color: '#FFF', fontSize: 14, marginBottom: 16 },
  
  roleGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  roleSelectBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  roleSelectBtnActive: { backgroundColor: '#FFF', borderColor: '#FFF' },
  roleSelectText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700' },
  roleSelectTextActive: { color: '#000' },
  
  // Autocomplete College Styles
  searchContainer: { position: 'relative', zIndex: 10 },
  searchInput: { height: 46, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 14, color: '#FFF', fontSize: 13 },
  autocompleteDropdown: { position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: '#0B0F19', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, zIndex: 999, overflow: 'hidden', padding: 4 },
  dropdownRow: { padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  dropdownRowText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  dropdownSubtext: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 },
  
  selectedCollegeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)', padding: 12, borderRadius: 12 },
  selectedCollegeName: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  selectedCollegeCode: { color: '#10B981', fontSize: 11, fontWeight: '700', marginTop: 2 },

  modalActions: { flexDirection: 'row', gap: 12, marginVertical: 20 },
  modalBtn: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  cancelBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  confirmBtn: { backgroundColor: '#10B981' },
  confirmBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' }
});
