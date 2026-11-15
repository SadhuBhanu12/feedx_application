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
  ScrollView, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { saListColleges, saCreateAdmin, saDeleteAdmin } from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function CollegesManager() {
  const router = useRouter();
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Bottom action menu modal
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  // CRUD Modals
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formType, setFormType] = useState('Private'); // Private, Govt, Autonomous
  const [formPrincipal, setFormPrincipal] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formRanking, setFormRanking] = useState('');
  const [formFee, setFormFee] = useState('');
  const [formPlacements, setFormPlacements] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Stats / Admin Modal
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [collegeStats, setCollegeStats] = useState<any>(null);
  const [adminsModalVisible, setAdminsModalVisible] = useState(false);
  const [collegeAdmins, setCollegeAdmins] = useState<any[]>([]);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminActionLoading, setAdminActionLoading] = useState(false);

  // Branches Modal
  const [branchesModalVisible, setBranchesModalVisible] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchHOD, setNewBranchHOD] = useState('');

  // Academic Years Modal
  const [academicsModalVisible, setAcademicsModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [newYearName, setNewYearName] = useState('');
  const [newYearSemester, setNewYearSemester] = useState('');

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const data = await saListColleges();
      setColleges(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleOpenActionMenu = (college: any) => {
    setSelectedCollege(college);
    setActionMenuVisible(true);
  };

  const handleViewDetails = () => {
    setActionMenuVisible(false);
    setDetailsModalVisible(true);
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormName('');
    setFormCode('');
    setFormLocation('');
    setFormType('Private');
    setFormPrincipal('');
    setFormEmail('');
    setFormPhone('');
    setFormWebsite('');
    setFormRanking('');
    setFormFee('');
    setFormPlacements('');
    setFormModalVisible(true);
  };

  const handleOpenEdit = () => {
    setIsEditing(true);
    setFormName(selectedCollege.college_name || '');
    setFormCode(selectedCollege.college_code || '');
    setFormLocation(selectedCollege.location || '');
    setFormType(selectedCollege.type || 'Private');
    setFormPrincipal(selectedCollege.principal_name || '');
    setFormEmail(selectedCollege.email || '');
    setFormPhone(selectedCollege.phone || '');
    setFormWebsite(selectedCollege.website || '');
    setFormRanking(String(selectedCollege.ranking || ''));
    setFormFee(selectedCollege.fee || '');
    setFormPlacements(selectedCollege.placements || '');
    setActionMenuVisible(false);
    setFormModalVisible(true);
  };

  const handleSaveCollege = async () => {
    if (!formName.trim() || !formCode.trim()) {
      return Alert.alert('Error', 'College Name and Code are required.');
    }
    setActionLoading(true);
    const payload = {
      college_name: formName.trim(),
      name: formName.trim(), // Stored duplicate compatibility
      college_code: formCode.trim().toUpperCase(),
      location: formLocation.trim() || null,
      type: formType,
      principal_name: formPrincipal.trim() || null,
      email: formEmail.trim() || null,
      phone: formPhone.trim() || null,
      website: formWebsite.trim() || null,
      ranking: formRanking.trim() ? parseInt(formRanking.trim(), 10) : null,
      fee: formFee.trim() || null,
      placements: formPlacements.trim() || null,
      updated_at: new Date().toISOString()
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('colleges')
          .update(payload)
          .eq('id', selectedCollege.id);
        if (error) throw error;
        Alert.alert('Success', 'College updated successfully.');
      } else {
        const { error } = await supabase
          .from('colleges')
          .insert({
            ...payload,
            is_active: true
          });
        if (error) throw error;
        Alert.alert('Success', 'College registered successfully.');
      }
      setFormModalVisible(false);
      fetchColleges();
    } catch (e: any) {
      Alert.alert('Save Failed', e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCollege = async () => {
    setActionMenuVisible(false);
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${selectedCollege.college_name}? All linked students, branches, and schedules will be permanently lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Permanently', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const { error } = await supabase.from('colleges').delete().eq('id', selectedCollege.id);
              if (error) throw error;
              Alert.alert('Success', 'College deleted successfully.');
              fetchColleges();
            } catch (err: any) {
              Alert.alert('Deletion Failed', err.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleToggleActivation = async () => {
    setActionMenuVisible(false);
    setLoading(true);
    const newStatus = !selectedCollege.is_active;
    try {
      const { error } = await supabase
        .from('colleges')
        .update({ is_active: newStatus })
        .eq('id', selectedCollege.id);
      if (error) throw error;
      Alert.alert('Success', `College status set to: ${newStatus ? 'Active' : 'Inactive'}`);
      fetchColleges();
    } catch (err: any) {
      Alert.alert('Status Toggle Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchStats = async () => {
    setActionMenuVisible(false);
    setStatsModalVisible(true);
    setCollegeStats(null);
    try {
      const [
        { count: branchesCount, error: bErr },
        { count: studentsCount, error: sErr },
        { count: adminsCount, error: aErr },
        { count: usersAdminCount, error: uErr }
      ] = await Promise.all([
        supabase.from('branches').select('id', { count: 'exact', head: true }).eq('college_id', selectedCollege.id),
        supabase.from('students').select('id', { count: 'exact', head: true }).eq('college_id', selectedCollege.id),
        supabase.from('admins').select('id', { count: 'exact', head: true }).eq('institution_id', selectedCollege.id),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('college_id', selectedCollege.id).in('role', ['admin', 'inst_admin']),
      ]);

      if (bErr) console.warn('Branches stats error:', bErr.message);
      if (sErr) console.warn('Students stats error:', sErr.message);
      if (aErr) console.warn('Admins stats error:', aErr.message);

      const totalAdmins = Math.max(adminsCount || 0, usersAdminCount || 0);

      setCollegeStats({
        branches: branchesCount || 0,
        students: studentsCount || 0,
        admins: totalAdmins
      });
    } catch (e: any) {
      console.error('Fetch Stats error:', e);
      setCollegeStats({
        branches: 0,
        students: 0,
        admins: 0
      });
    }
  };

  const handleFetchAdmins = async () => {
    setActionMenuVisible(false);
    setAdminsModalVisible(true);
    setCollegeAdmins([]);
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('institution_id', selectedCollege.id);
      if (error) throw error;
      setCollegeAdmins(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminName || !newAdminEmail || !newAdminPassword) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    try {
      setAdminActionLoading(true);
      await saCreateAdmin(newAdminEmail.trim(), newAdminPassword, newAdminName.trim(), selectedCollege.id);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      Alert.alert('Success', 'Admin created successfully');
      handleFetchAdmins(); // Refresh
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to create admin');
    } finally {
      setAdminActionLoading(false);
    }
  };

  const handleDeleteAdmin = (adminId: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this admin account permanently?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await saDeleteAdmin(adminId);
            Alert.alert('Success', 'Admin deleted');
            handleFetchAdmins();
          } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to delete admin');
          }
        }
      }
    ]);
  };

  // Branch CRUD handlers
  const handleOpenBranches = async () => {
    setActionMenuVisible(false);
    setBranchesModalVisible(true);
    setBranches([]);
    setNewBranchName('');
    setNewBranchCode('');
    setNewBranchHOD('');
    await fetchBranches();
  };

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('college_id', selectedCollege.id)
        .order('branch_name');
      if (error) throw error;
      setBranches(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddBranch = async () => {
    if (!newBranchName.trim() || !newBranchCode.trim()) {
      return Alert.alert('Required Fields', 'Please fill in Branch Name and Code.');
    }
    try {
      const { error } = await supabase
        .from('branches')
        .insert({
          college_id: selectedCollege.id,
          branch_name: newBranchName.trim(),
          name: newBranchName.trim(),
          branch_code: newBranchCode.trim().toUpperCase(),
          hod_name: newBranchHOD.trim() || null
        });
      if (error) throw error;
      setNewBranchName('');
      setNewBranchCode('');
      setNewBranchHOD('');
      fetchBranches();
    } catch (err: any) {
      Alert.alert('Failed to add branch', err.message);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    Alert.alert(
      'Delete Branch',
      'Are you sure you want to delete this branch? All academic years and timetables for this branch will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('branches').delete().eq('id', branchId);
              if (error) throw error;
              fetchBranches();
            } catch (err: any) {
              Alert.alert('Delete failed', err.message);
            }
          }
        }
      ]
    );
  };

  // Academic Years CRUD handlers
  const handleOpenAcademics = async () => {
    setActionMenuVisible(false);
    setAcademicsModalVisible(true);
    setSelectedBranch(null);
    setAcademicYears([]);
    setNewYearName('');
    setNewYearSemester('');
    await fetchBranches(); // Loads branches to select
  };

  const selectBranchForAcademics = async (branch: any) => {
    setSelectedBranch(branch);
    await fetchAcademicYears(branch.id);
  };

  const fetchAcademicYears = async (branchId: string) => {
    try {
      const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .eq('branch_id', branchId)
        .order('year_name');
      if (error) throw error;
      setAcademicYears(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAcademicYear = async () => {
    if (!newYearName.trim()) {
      return Alert.alert('Required Fields', 'Year name (e.g. 1st Year) is required.');
    }
    try {
      const { error } = await supabase
        .from('academic_years')
        .insert({
          branch_id: selectedBranch.id,
          year_name: newYearName.trim(),
          semester: newYearSemester.trim() || null
        });
      if (error) throw error;
      setNewYearName('');
      setNewYearSemester('');
      fetchAcademicYears(selectedBranch.id);
    } catch (err: any) {
      Alert.alert('Failed to add year', err.message);
    }
  };

  const handleDeleteAcademicYear = async (yearId: string) => {
    Alert.alert(
      'Delete Academic Year',
      'Are you sure you want to delete this Academic Year?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('academic_years').delete().eq('id', yearId);
              if (error) throw error;
              fetchAcademicYears(selectedBranch.id);
            } catch (err: any) {
              Alert.alert('Delete failed', err.message);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <BlurView intensity={20} tint="dark" style={[styles.card, !item.is_active && styles.cardInactive]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="domain" size={24} color={item.is_active ? '#3B82F6' : '#64748B'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.collegeName}>{item.college_name}</Text>
            <Text style={styles.collegeCode}>CODE: {item.college_code}  •  {item.location || 'No Location'}</Text>
          </View>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOpenActionMenu(item)}>
            <Feather name="more-vertical" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.type || 'Engineering'}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: item.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
            <Text style={[styles.badgeText, { color: item.is_active ? '#10B981' : '#EF4444' }]}>
              {item.is_active ? 'ACTIVE' : 'SUSPENDED'}
            </Text>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#000000']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Colleges Registry</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleOpenAdd}>
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={colleges}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchColleges} tintColor="#FFF" />}
        ListEmptyComponent={() => (
          !loading ? <Text style={styles.emptyText}>No colleges found.</Text> : null
        )}
      />

      {/* 3-Dot Action Menu Sheet Modal */}
      <Modal visible={actionMenuVisible} animationType="slide" transparent>
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => setActionMenuVisible(false)}>
          <BlurView intensity={40} tint="dark" style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetLine} />
              <Text style={styles.sheetTitle}>{selectedCollege?.college_name}</Text>
              <Text style={styles.sheetSub}>{selectedCollege?.college_code}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.sheetButtons}>
              <TouchableOpacity style={styles.sheetBtn} onPress={handleViewDetails}>
                <Feather name="info" size={20} color="#FFF" />
                <Text style={styles.sheetBtnText}>View Full Details</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetBtn} onPress={handleOpenEdit}>
                <Feather name="edit" size={20} color="#FFF" />
                <Text style={styles.sheetBtnText}>Edit Institution Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetBtn} onPress={handleToggleActivation}>
                <Feather name={selectedCollege?.is_active ? 'user-x' : 'user-check'} size={20} color={selectedCollege?.is_active ? '#EF4444' : '#10B981'} />
                <Text style={[styles.sheetBtnText, { color: selectedCollege?.is_active ? '#EF4444' : '#10B981' }]}>
                  {selectedCollege?.is_active ? 'Deactivate / Suspend' : 'Activate / Restore'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetBtn} onPress={handleFetchStats}>
                <Feather name="bar-chart-2" size={20} color="#FFF" />
                <Text style={styles.sheetBtnText}>View Statistics</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetBtn} onPress={handleFetchAdmins}>
                <Feather name="shield" size={20} color="#FFF" />
                <Text style={styles.sheetBtnText}>View Admins Registry</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetBtn} onPress={handleOpenBranches}>
                <Feather name="git-branch" size={20} color="#FFF" />
                <Text style={styles.sheetBtnText}>Manage Branches</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetBtn} onPress={handleOpenAcademics}>
                <Feather name="calendar" size={20} color="#FFF" />
                <Text style={styles.sheetBtnText}>Manage Academic Years</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.sheetBtn, styles.deleteBtn]} onPress={handleDeleteCollege}>
                <Feather name="trash-2" size={20} color="#EF4444" />
                <Text style={[styles.sheetBtnText, { color: '#EF4444' }]}>Delete Permanently</Text>
              </TouchableOpacity>
            </ScrollView>
          </BlurView>
        </TouchableOpacity>
      </Modal>

      {/* College Info Details Modal */}
      <Modal visible={detailsModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} tint="dark" style={styles.detailsContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>College Dossier</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailsScroll}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{selectedCollege?.college_name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Code</Text>
                <Text style={styles.detailValue}>{selectedCollege?.college_code}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{selectedCollege?.type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{selectedCollege?.location || 'Unspecified'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Principal Head</Text>
                <Text style={styles.detailValue}>{selectedCollege?.principal_name || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>E-mail</Text>
                <Text style={styles.detailValue}>{selectedCollege?.email || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone contact</Text>
                <Text style={styles.detailValue}>{selectedCollege?.phone || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Website URL</Text>
                <Text style={styles.detailValue}>{selectedCollege?.website || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>National Ranking</Text>
                <Text style={styles.detailValue}>{selectedCollege?.ranking ? `#${selectedCollege.ranking}` : 'Unranked'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Annual Tuition Fee</Text>
                <Text style={styles.detailValue}>{selectedCollege?.fee || 'Not Registered'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Placement Matrix</Text>
                <Text style={styles.detailValue}>{selectedCollege?.placements || 'Not Registered'}</Text>
              </View>
            </ScrollView>
          </BlurView>
        </View>
      </Modal>

      {/* College Add / Edit Modal */}
      <Modal visible={formModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} tint="dark" style={styles.formContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Edit College' : 'Add New College'}</Text>
              <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ paddingHorizontal: 20 }}>
              <Text style={styles.fieldLabel}>College Name *</Text>
              <TextInput style={styles.formInput} value={formName} onChangeText={setFormName} placeholder="e.g. Government Engineering College" placeholderTextColor="rgba(255,255,255,0.3)" />

              <Text style={styles.fieldLabel}>College Code *</Text>
              <TextInput style={styles.formInput} value={formCode} onChangeText={setFormCode} autoCapitalize="characters" placeholder="e.g. GEC" placeholderTextColor="rgba(255,255,255,0.3)" />

              <Text style={styles.fieldLabel}>Location</Text>
              <TextInput style={styles.formInput} value={formLocation} onChangeText={setFormLocation} placeholder="e.g. Bengaluru, Karnataka" placeholderTextColor="rgba(255,255,255,0.3)" />

              <Text style={styles.fieldLabel}>Ranking (National)</Text>
              <TextInput style={styles.formInput} value={formRanking} onChangeText={setFormRanking} keyboardType="numeric" placeholder="e.g. 45" placeholderTextColor="rgba(255,255,255,0.3)" />

              <Text style={styles.fieldLabel}>Principal Name</Text>
              <TextInput style={styles.formInput} value={formPrincipal} onChangeText={setFormPrincipal} placeholder="e.g. Dr. Rajesh Rao" placeholderTextColor="rgba(255,255,255,0.3)" />

              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput style={styles.formInput} value={formEmail} onChangeText={setFormEmail} keyboardType="email-address" autoCapitalize="none" placeholder="e.g. contact@gec.edu" placeholderTextColor="rgba(255,255,255,0.3)" />

              <Text style={styles.fieldLabel}>Phone number</Text>
              <TextInput style={styles.formInput} value={formPhone} onChangeText={setFormPhone} keyboardType="phone-pad" placeholder="e.g. +91 9876543210" placeholderTextColor="rgba(255,255,255,0.3)" />

              <Text style={styles.fieldLabel}>Website</Text>
              <TextInput style={styles.formInput} value={formWebsite} onChangeText={setFormWebsite} autoCapitalize="none" placeholder="e.g. www.gec.edu" placeholderTextColor="rgba(255,255,255,0.3)" />

              <Text style={styles.fieldLabel}>Average Fee</Text>
              <TextInput style={styles.formInput} value={formFee} onChangeText={setFormFee} placeholder="e.g. ₹85,000 / year" placeholderTextColor="rgba(255,255,255,0.3)" />

              <Text style={styles.fieldLabel}>Placement Info</Text>
              <TextInput style={styles.formInput} value={formPlacements} onChangeText={setFormPlacements} placeholder="e.g. 94% placed, Max CTC ₹22LPA" placeholderTextColor="rgba(255,255,255,0.3)" />

              <Text style={styles.fieldLabel}>Institution Type</Text>
              <View style={styles.typeGroup}>
                {['Private', 'Govt', 'Autonomous'].map((t) => (
                  <TouchableOpacity key={t} style={[styles.typeSelect, formType === t && styles.typeSelectActive]} onPress={() => setFormType(t)}>
                    <Text style={[styles.typeSelectText, formType === t && styles.typeSelectTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCollege} disabled={actionLoading}>
                {actionLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save College Settings</Text>}
              </TouchableOpacity>
            </ScrollView>
          </BlurView>
        </View>
      </Modal>

      {/* College Statistics Modal */}
      <Modal visible={statsModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} tint="dark" style={styles.statsContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Statistics Dashboard</Text>
              <TouchableOpacity onPress={() => setStatsModalVisible(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {collegeStats ? (
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Feather name="users" size={28} color="#3B82F6" />
                  <Text style={styles.statCount}>{collegeStats.students}</Text>
                  <Text style={styles.statLabel}>Students</Text>
                </View>

                <View style={styles.statBox}>
                  <Feather name="git-branch" size={28} color="#10B981" />
                  <Text style={styles.statCount}>{collegeStats.branches}</Text>
                  <Text style={styles.statLabel}>Branches</Text>
                </View>

                <View style={styles.statBox}>
                  <Feather name="shield" size={28} color="#F59E0B" />
                  <Text style={styles.statCount}>{collegeStats.admins}</Text>
                  <Text style={styles.statLabel}>Admins</Text>
                </View>
              </View>
            ) : (
              <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 40 }} />
            )}
          </BlurView>
        </View>
      </Modal>

      {/* College Admins Modal */}
      <Modal visible={adminsModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} tint="dark" style={styles.detailsContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Institutional Admins</Text>
              <TouchableOpacity onPress={() => setAdminsModalVisible(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.branchAddBox}>
              <TextInput style={styles.branchInput} placeholder="Admin Name" placeholderTextColor="rgba(255,255,255,0.3)" value={newAdminName} onChangeText={setNewAdminName} />
              <TextInput style={styles.branchInput} placeholder="Email Address" placeholderTextColor="rgba(255,255,255,0.3)" value={newAdminEmail} onChangeText={setNewAdminEmail} keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.branchInput} placeholder="Initial Password" placeholderTextColor="rgba(255,255,255,0.3)" value={newAdminPassword} onChangeText={setNewAdminPassword} secureTextEntry />
              <TouchableOpacity style={styles.branchAddBtn} onPress={handleAddAdmin} disabled={adminActionLoading}>
                {adminActionLoading ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.branchAddBtnText}>Create Admin</Text>}
              </TouchableOpacity>
            </View>

            <FlatList
              data={collegeAdmins}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 20 }}
              renderItem={({ item }) => (
                <View style={styles.adminRow}>
                  <Feather name="user" size={18} color="#3B82F6" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.adminNameText}>{item.admin_name || item.name || 'Admin'}</Text>
                    <Text style={styles.adminEmailText}>{item.email}</Text>
                  </View>
                  <TouchableOpacity style={{ padding: 8 }} onPress={() => handleDeleteAdmin(item.id)}>
                    <Feather name="trash-2" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>No administrators assigned yet.</Text>
              )}
            />
          </BlurView>
        </View>
      </Modal>

      {/* Manage Branches Modal */}
      <Modal visible={branchesModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} tint="dark" style={styles.branchContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Branches Manager</Text>
              <TouchableOpacity onPress={() => setBranchesModalVisible(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.branchAddBox}>
              <TextInput style={styles.branchInput} placeholder="Branch Name (e.g. Computer Science)" placeholderTextColor="rgba(255,255,255,0.3)" value={newBranchName} onChangeText={setNewBranchName} />
              <TextInput style={styles.branchInput} placeholder="Branch Code (e.g. CSE)" placeholderTextColor="rgba(255,255,255,0.3)" value={newBranchCode} onChangeText={setNewBranchCode} />
              <TextInput style={styles.branchInput} placeholder="HOD Name" placeholderTextColor="rgba(255,255,255,0.3)" value={newBranchHOD} onChangeText={setNewBranchHOD} />
              <TouchableOpacity style={styles.branchAddBtn} onPress={handleAddBranch}>
                <Text style={styles.branchAddBtnText}>Add Branch</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={branches}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
              renderItem={({ item }) => (
                <View style={styles.branchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.branchRowName}>{item.branch_name}</Text>
                    <Text style={styles.branchRowCode}>Code: {item.branch_code}  •  HOD: {item.hod_name || 'N/A'}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteBranch(item.id)}>
                    <Feather name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </BlurView>
        </View>
      </Modal>

      {/* Manage Academic Years Modal */}
      <Modal visible={academicsModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} tint="dark" style={styles.branchContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Academic Calendar Manager</Text>
              <TouchableOpacity onPress={() => setAcademicsModalVisible(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {!selectedBranch ? (
              <View style={{ padding: 20 }}>
                <Text style={styles.fieldLabel}>Select Branch to Manage Years:</Text>
                <FlatList
                  data={branches}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.branchSelectRow} onPress={() => selectBranchForAcademics(item)}>
                      <Text style={styles.branchSelectText}>{item.branch_name} ({item.branch_code})</Text>
                      <Feather name="chevron-right" size={16} color="#FFF" />
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Please add branches first.</Text>
                  )}
                />
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <TouchableOpacity style={styles.backToBranchesRow} onPress={() => setSelectedBranch(null)}>
                  <Feather name="chevron-left" size={16} color="#3B82F6" />
                  <Text style={styles.backToBranchesText}>Back to Branches Selection</Text>
                </TouchableOpacity>

                <View style={styles.branchAddBox}>
                  <Text style={styles.branchHeaderTitle}>{selectedBranch.branch_name}</Text>
                  <TextInput style={styles.branchInput} placeholder="Year Name (e.g. 1st Year)" placeholderTextColor="rgba(255,255,255,0.3)" value={newYearName} onChangeText={setNewYearName} />
                  <TextInput style={styles.branchInput} placeholder="Semester (e.g. Semester 2)" placeholderTextColor="rgba(255,255,255,0.3)" value={newYearSemester} onChangeText={setNewYearSemester} />
                  <TouchableOpacity style={styles.branchAddBtn} onPress={handleAddAcademicYear}>
                    <Text style={styles.branchAddBtnText}>Add Academic Year</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={academicYears}
                  keyExtractor={item => item.id}
                  contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                  renderItem={({ item }) => (
                    <View style={styles.branchRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.branchRowName}>{item.year_name}</Text>
                        <Text style={styles.branchRowCode}>Semester: {item.semester || 'N/A'}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteAcademicYear(item.id)}>
                        <Feather name="trash" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 42, paddingBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 120, gap: 16 },
  card: { padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', overflow: 'hidden' },
  cardInactive: { borderColor: 'rgba(100, 116, 139, 0.2)', opacity: 0.6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(59, 130, 246, 0.1)', alignItems: 'center', justifyContent: 'center' },
  collegeName: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  collegeCode: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: 2 },
  actionBtn: { padding: 8 },
  cardFooter: { flexDirection: 'row', gap: 8 },
  badge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '700' },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 40, fontSize: 14 },

  // Bottom action menu sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: '#0B0F19', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 40, overflow: 'hidden' },
  sheetHeader: { alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  sheetLine: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 12 },
  sheetTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', textAlign: 'center', paddingHorizontal: 20 },
  sheetSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '700', marginTop: 4 },
  sheetButtons: { paddingHorizontal: 20, paddingTop: 10, gap: 4 },
  sheetBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.02)' },
  sheetBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  deleteBtn: { borderBottomWidth: 0, marginTop: 10 },

  // Modals General
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' },
  detailsContent: { width: '90%', height: '70%', backgroundColor: '#0B0F19', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  formContent: { width: '90%', height: '80%', backgroundColor: '#0B0F19', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  statsContent: { width: '85%', backgroundColor: '#0B0F19', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', paddingBottom: 20 },
  branchContent: { width: '90%', height: '75%', backgroundColor: '#0B0F19', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },

  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  detailsScroll: { padding: 20 },
  detailRow: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)', paddingVertical: 12 },
  detailLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  detailValue: { color: '#FFF', fontSize: 14, fontWeight: '700', marginTop: 4 },

  fieldLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginTop: 16, marginBottom: 6 },
  formInput: { height: 48, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 16, color: '#FFF', fontSize: 14 },
  typeGroup: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  typeSelect: { flex: 1, height: 42, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  typeSelectActive: { backgroundColor: '#FFF', borderColor: '#FFF' },
  typeSelectText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700' },
  typeSelectTextActive: { color: '#000' },
  saveBtn: { backgroundColor: '#3B82F6', height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginVertical: 24 },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

  statsGrid: { flexDirection: 'row', padding: 20, gap: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statCount: { color: '#FFF', fontSize: 22, fontWeight: '900', marginVertical: 8 },
  statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

  adminRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  adminNameText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  adminEmailText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '500' },
  adminBadge: { backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  adminBadgeText: { color: '#3B82F6', fontSize: 10, fontWeight: '800' },

  branchAddBox: { padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', gap: 10 },
  branchInput: { height: 42, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 10, paddingHorizontal: 12, color: '#FFF', fontSize: 13 },
  branchAddBtn: { backgroundColor: '#10B981', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  branchAddBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  branchRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.02)' },
  branchRowName: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  branchRowCode: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2, fontWeight: '600' },

  branchSelectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  branchSelectText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  backToBranchesRow: { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 8 },
  backToBranchesText: { color: '#3B82F6', fontSize: 13, fontWeight: '700' },
  branchHeaderTitle: { color: '#FFF', fontSize: 15, fontWeight: '900', marginBottom: 5 }
});
