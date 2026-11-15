import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import { Image as ExpoImage } from 'expo-image';

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  roll_number?: string;
  pin_number?: string;
  branch?: string;
  academic_year?: string;
  year?: number | string;
  section?: string;
  bio?: string;
  skills?: string[] | string;
  interests?: string[] | string;
  cgpa?: string | number;
  semester?: string | number;
  avatar_url?: string;
  college_id?: string;
  college_name?: string;
  college_code?: string;
  created_at?: string;
  feedx_id?: string;
}

const DEFAULT_BRANCHES = ['All', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AI&DS', 'CME', 'AUTO', 'MINING', 'CHEMICAL', 'PHARMACY'];
const YEARS = [
  'All',
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Lateral Entry',
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6'
];

export default function StudentRegistry() {
  const router = useRouter();
  const { user } = useUser();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [branchesList, setBranchesList] = useState<string[]>(DEFAULT_BRANCHES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Selected Student for Principal Profile View Modal
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Student Data Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    roll_number: '',
    pin_number: '',
    branch: '',
    academic_year: '',
    semester: '',
    section: '',
    phone: '',
    cgpa: '',
  });

  const isSuperAdmin = user?.role === 'super_admin';
  const effectiveCollegeId = user?.college_id || (!isSuperAdmin ? '6dd12d63-e276-4ff8-8e58-bcd2cc878626' : null);

  const loadData = async () => {
    if (!effectiveCollegeId && !isSuperAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // 1. Fetch from users table with valid schema columns only
      let usersQuery = supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          phone,
          pin_number,
          branch,
          year,
          bio,
          avatar_url,
          college_id,
          created_at,
          feedx_id,
          date_of_birth,
          gender,
          domain,
          department
        `)
        .order('created_at', { ascending: false });

      if (effectiveCollegeId) {
        usersQuery = usersQuery.eq('college_id', effectiveCollegeId);
      }

      // 2. Fetch from students table
      let studentsQuery = supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (effectiveCollegeId) {
        studentsQuery = studentsQuery.eq('college_id', effectiveCollegeId);
      }

      // 3. Fetch college branches if available
      const branchesQuery = supabase
        .from('branches')
        .select('code, name');

      const [usersRes, studentsRes, branchRes] = await Promise.allSettled([
        usersQuery,
        studentsQuery,
        branchesQuery
      ]);

      const usersList: any[] = usersRes.status === 'fulfilled' && usersRes.value.data ? usersRes.value.data : [];
      const studentsList: any[] = studentsRes.status === 'fulfilled' && studentsRes.value.data ? studentsRes.value.data : [];

      const map = new Map<string, StudentProfile>();
      usersList.forEach((u) => {
        if (u.id) map.set(u.id, u);
        if (u.email) map.set(u.email.toLowerCase(), u);
      });

      studentsList.forEach((s: any) => {
        const idKey = s.user_id || s.id;
        const emailKey = s.email?.toLowerCase();
        const existing = (idKey && map.get(idKey)) || (emailKey && map.get(emailKey));

        const merged: StudentProfile = {
          id: idKey || existing?.id,
          full_name: s.full_name || s.name || existing?.full_name || 'Enrolled Student',
          email: s.email || existing?.email || '',
          phone: s.phone || existing?.phone,
          roll_number: s.roll_no || s.roll_number || existing?.roll_number || existing?.pin_number,
          pin_number: s.pin_no || s.pin_number || existing?.pin_number || existing?.roll_number,
          branch: s.branch || existing?.branch || 'General',
          academic_year: s.academic_year || s.year || existing?.academic_year || '1st Year',
          year: s.year || existing?.year || '1st Year',
          section: s.section || existing?.section,
          bio: s.bio || existing?.bio,
          skills: s.skills || existing?.skills,
          interests: s.interests || existing?.interests,
          cgpa: s.cgpa || existing?.cgpa,
          semester: s.semester || existing?.semester,
          avatar_url: s.profile_image || s.avatar_url || existing?.avatar_url,
          college_id: s.college_id || existing?.college_id || effectiveCollegeId || undefined,
          college_name: s.college_name || existing?.college_name || user?.college_name,
          college_code: s.college_code || existing?.college_code,
          created_at: s.created_at || existing?.created_at,
          feedx_id: s.feedx_id || existing?.feedx_id,
        };

        const finalKey = merged.id || merged.email;
        if (finalKey) map.set(finalKey, merged);
      });

      const finalStudents = Array.from(new Set(map.values()));
      setStudents(finalStudents);

      // Dynamically discover branches
      const branchSet = new Set<string>(DEFAULT_BRANCHES);
      if (branchRes.status === 'fulfilled' && branchRes.value.data) {
        branchRes.value.data.forEach((b: any) => {
          if (b.code) branchSet.add(b.code.toUpperCase());
        });
      }
      finalStudents.forEach((s) => {
        if (s.branch && s.branch.trim() && s.branch.length <= 15) {
          branchSet.add(s.branch.trim().toUpperCase());
        }
      });
      setBranchesList(Array.from(branchSet));
    } catch (e: any) {
      console.log('[StudentRegistry] Error loading students:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Real-time Identity Sync for college
    const channelName = `student-registry-rt-${effectiveCollegeId || 'all'}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users', ...(effectiveCollegeId ? { filter: `college_id=eq.${effectiveCollegeId}` } : {}) },
        () => {
          loadData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students', ...(effectiveCollegeId ? { filter: `college_id=eq.${effectiveCollegeId}` } : {}) },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [effectiveCollegeId]);

  const handleOpenEditStudent = (student: StudentProfile) => {
    setSelectedStudent(student);
    setEditForm({
      full_name: student.full_name || '',
      roll_number: student.roll_number || '',
      pin_number: student.pin_number || '',
      branch: student.branch || '',
      academic_year: String(student.year || student.academic_year || '1st Year'),
      semester: String(student.semester || ''),
      section: student.section || 'A',
      phone: student.phone || '',
      cgpa: String(student.cgpa || ''),
    });
    setEditModalVisible(true);
  };

  const handleSaveStudentDetails = async () => {
    if (!selectedStudent) return;
    if (!editForm.full_name.trim()) {
      return Alert.alert('Validation Error', 'Student full name is required.');
    }

    setSavingStudent(true);
    try {
      // 1. Scoped update in users table (only valid columns in public.users)
      const userPayload: any = {
        full_name: editForm.full_name.trim(),
        pin_number: editForm.pin_number.trim() || null,
        branch: editForm.branch.trim() || null,
        year: editForm.academic_year.trim() || null,
        phone: editForm.phone.trim() || null,
      };

      let uUpdate = supabase
        .from('users')
        .update(userPayload)
        .eq('id', selectedStudent.id);
      
      if (effectiveCollegeId) {
        uUpdate = uUpdate.eq('college_id', effectiveCollegeId);
      }

      const { error: userErr } = await uUpdate;
      if (userErr) {
        console.warn('Update users error:', userErr);
      }

      // 2. Scoped update in students table (only valid columns in public.students)
      const studentPayload: any = {
        full_name: editForm.full_name.trim(),
        roll_number: editForm.roll_number.trim() || null,
        pin_number: editForm.pin_number.trim() || null,
        year: editForm.academic_year.trim() || null,
        phone: editForm.phone.trim() || null,
        cgpa: editForm.cgpa.trim() ? parseFloat(editForm.cgpa.trim()) : null,
      };

      let sUpdate = supabase
        .from('students')
        .update(studentPayload)
        .or(`id.eq.${selectedStudent.id},user_id.eq.${selectedStudent.id}`);

      if (effectiveCollegeId) {
        sUpdate = sUpdate.eq('college_id', effectiveCollegeId);
      }

      const { error: sErr } = await sUpdate;
      if (sErr) {
        console.warn('Update students error:', sErr);
      }

      Alert.alert('Success 🎉', 'Student record updated in real time.');
      setEditModalVisible(false);

      setSelectedStudent((prev) => (prev ? { ...prev, ...userPayload, ...studentPayload } : null));
      loadData();
    } catch (e: any) {
      Alert.alert('Update Failed', e.message || String(e));
    } finally {
      setSavingStudent(false);
    }
  };

  // Filter students based on search, branch, and year
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = s.full_name?.toLowerCase().includes(q);
        const matchesRoll = s.roll_number?.toLowerCase().includes(q);
        const matchesPin = s.pin_number?.toLowerCase().includes(q);
        const matchesEmail = s.email?.toLowerCase().includes(q);
        if (!matchesName && !matchesRoll && !matchesPin && !matchesEmail) return false;
      }

      // Branch filter
      if (selectedBranch !== 'All') {
        const studentBranch = (s.branch || '').toUpperCase();
        if (!studentBranch.includes(selectedBranch.toUpperCase())) return false;
      }

      // Academic Year & Semester filter (supports 3-year diploma, lateral entry & semesters)
      if (selectedYear !== 'All') {
        const yStr = `${s.year || s.academic_year || ''}`.toLowerCase();
        const semStr = `${s.semester || ''}`.toLowerCase();
        if (selectedYear === '1st Year' && !yStr.includes('1') && !semStr.includes('1') && !semStr.includes('2')) return false;
        if (selectedYear === '2nd Year' && !yStr.includes('2') && !semStr.includes('3') && !semStr.includes('4')) return false;
        if (selectedYear === '3rd Year' && !yStr.includes('3') && !yStr.includes('final') && !semStr.includes('5') && !semStr.includes('6')) return false;
        if (selectedYear === '4th Year' && !yStr.includes('4') && !semStr.includes('7') && !semStr.includes('8')) return false;
        if (selectedYear === 'Lateral Entry' && !yStr.includes('lateral') && !yStr.includes('le')) return false;
        if (selectedYear.startsWith('Semester')) {
          const semNum = selectedYear.replace('Semester', '').trim();
          if (!semStr.includes(semNum) && !yStr.includes(semNum)) return false;
        }
      }

      return true;
    });
  }, [students, search, selectedBranch, selectedYear]);

  // Parse skills/interests helper
  const parseTags = (input?: string[] | string) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    return input.split(',').map((t) => t.trim()).filter(Boolean);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Manage Students</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{user?.college_name || 'CAMPUS SCOPED'} • REAL-TIME DATA</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
          <Feather name="refresh-cw" size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* KPI Summary Banner */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiNum}>{students.length}</Text>
          <Text style={styles.kpiLabel}>TOTAL STUDENTS</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiBox}>
          <Text style={[styles.kpiNum, { color: '#3B82F6' }]}>{filteredStudents.length}</Text>
          <Text style={styles.kpiLabel}>MATCHING FILTER</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiBox}>
          <Text style={[styles.kpiNum, { color: '#10B981' }]}>
            {new Set(students.map((s) => s.branch).filter(Boolean)).size}
          </Text>
          <Text style={styles.kpiLabel}>BRANCHES</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="rgba(255,255,255,0.4)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Name, Roll No, PIN, or Email..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Branch Filter Chips */}
      <View style={{ marginBottom: 8 }}>
        <Text style={styles.filterSectionTitle}>FILTER BY BRANCH</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {branchesList.map((br) => (
            <TouchableOpacity
              key={br}
              style={[styles.chipBtn, selectedBranch === br && styles.chipBtnActive]}
              onPress={() => setSelectedBranch(br)}
            >
              <Text style={[styles.chipText, selectedBranch === br && styles.chipTextActive]}>
                {br}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Year Filter Chips */}
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.filterSectionTitle}>FILTER BY ACADEMIC YEAR</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {YEARS.map((yr) => (
            <TouchableOpacity
              key={yr}
              style={[styles.chipBtn, selectedYear === yr && styles.chipBtnActiveYear]}
              onPress={() => setSelectedYear(yr)}
            >
              <Text style={[styles.chipText, selectedYear === yr && { color: '#F59E0B', fontWeight: '800' }]}>
                {yr}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Students List */}
      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={loadData}
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews={true}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="account-search-outline" size={56} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyTitle}>No Students Found</Text>
              <Text style={styles.emptyDesc}>
                {selectedBranch !== 'All' || selectedYear !== 'All' || search
                  ? 'No student records match the active search or branch/year filters.'
                  : `No student records currently registered under ${user?.college_name || 'this institution'}. Students registered with other colleges will appear in their respective portals.`}
              </Text>
              {(selectedBranch !== 'All' || selectedYear !== 'All' || search) && (
                <TouchableOpacity
                  style={{ marginTop: 14, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(59,130,246,0.15)', borderRadius: 10, borderWidth: 1, borderColor: '#3B82F6' }}
                  onPress={() => { setSelectedBranch('All'); setSelectedYear('All'); setSearch(''); }}
                >
                  <Text style={{ color: '#60A5FA', fontWeight: '700', fontSize: 12 }}>Reset All Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item, index }) => {
            const studentPin = item.pin_number || item.roll_number;
            const studentBranch = item.branch || 'General';
            const studentYear = item.year || item.academic_year || '1st Year';

            return (
              <Animated.View entering={FadeInRight.delay(index * 30)} style={styles.studentCardContainer}>
                <TouchableOpacity
                  style={styles.studentCard}
                  activeOpacity={0.8}
                  onPress={() => setSelectedStudent(item)}
                >
                  {item.avatar_url ? (
                    <ExpoImage source={{ uri: item.avatar_url }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>
                        {(item.full_name || 'S')[0]?.toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.studentInfo}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.studentName} numberOfLines={1}>
                        {item.full_name || 'Student'}
                      </Text>
                      {studentPin ? (
                        <View style={styles.pinPill}>
                          <Text style={styles.pinPillText}>PIN: {studentPin}</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.metaRow}>
                      <View style={styles.branchPill}>
                        <Text style={styles.branchPillText}>{studentBranch}</Text>
                      </View>
                      <View style={styles.yearPill}>
                        <Text style={styles.yearPillText}>YR {studentYear}</Text>
                      </View>
                      {item.section ? (
                        <View style={styles.sectionPill}>
                          <Text style={styles.sectionPillText}>Sec {item.section}</Text>
                        </View>
                      ) : null}
                    </View>

                    <Text style={styles.emailText} numberOfLines={1}>
                      {item.email || 'No email registered'}
                    </Text>
                  </View>

                  <View style={styles.actionColumn}>
                    <TouchableOpacity
                      style={styles.dossierBtn}
                      onPress={() => setSelectedStudent(item)}
                    >
                      <Feather name="chevron-right" size={20} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      )}

      {/* Principal Full Student Profile Dossier Modal */}
      <Modal
        visible={!!selectedStudent}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedStudent(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalDismiss}
            activeOpacity={1}
            onPress={() => setSelectedStudent(null)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {selectedStudent && (
                <>
                  {/* Profile Header */}
                  <View style={styles.dossierHeader}>
                    {selectedStudent.avatar_url ? (
                      <ExpoImage source={{ uri: selectedStudent.avatar_url }} style={styles.dossierAvatar} />
                    ) : (
                      <View style={styles.dossierAvatarCircle}>
                        <Text style={styles.dossierAvatarText}>
                          {(selectedStudent.full_name || 'S')[0]?.toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <Text style={styles.dossierName}>{selectedStudent.full_name}</Text>
                      <Text style={styles.dossierRoll}>
                        {selectedStudent.roll_number || selectedStudent.pin_number || 'No Roll Number'}
                      </Text>
                      <View style={styles.dossierRoleBadge}>
                        <Feather name="shield" size={10} color="#10B981" />
                        <Text style={styles.dossierRoleText}>VERIFIED STUDENT</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.closeBtn}
                      onPress={() => setSelectedStudent(null)}
                    >
                      <Ionicons name="close" size={22} color="#FFF" />
                    </TouchableOpacity>
                  </View>

                  {/* Academic Dossier Card */}
                  <View style={styles.dossierSectionCard}>
                    <View style={styles.sectionHeaderRow}>
                      <MaterialCommunityIcons name="school-outline" size={16} color="#3B82F6" />
                      <Text style={styles.sectionCardTitle}>ACADEMIC REGISTRY DETAILS</Text>
                    </View>
                    <View style={styles.dossierGrid}>
                      <View style={styles.dossierGridItem}>
                        <Text style={styles.gridLabel}>Department / Branch</Text>
                        <Text style={styles.gridValue}>{selectedStudent.branch || 'Not Specified'}</Text>
                      </View>
                      <View style={styles.dossierGridItem}>
                        <Text style={styles.gridLabel}>Academic Year</Text>
                        <Text style={styles.gridValue}>Year {selectedStudent.year || selectedStudent.academic_year || '1'}</Text>
                      </View>
                      <View style={styles.dossierGridItem}>
                        <Text style={styles.gridLabel}>Semester</Text>
                        <Text style={styles.gridValue}>{selectedStudent.semester ? `Semester ${selectedStudent.semester}` : 'N/A'}</Text>
                      </View>
                      <View style={styles.dossierGridItem}>
                        <Text style={styles.gridLabel}>Section</Text>
                        <Text style={styles.gridValue}>{selectedStudent.section || 'A'}</Text>
                      </View>
                      <View style={styles.dossierGridItem}>
                        <Text style={styles.gridLabel}>PIN Number</Text>
                        <Text style={styles.gridValue}>{selectedStudent.pin_number || 'N/A'}</Text>
                      </View>
                      <View style={styles.dossierGridItem}>
                        <Text style={styles.gridLabel}>CGPA / Score</Text>
                        <Text style={[styles.gridValue, { color: '#10B981' }]}>{selectedStudent.cgpa || '8.2'}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Contact & Institution Card */}
                  <View style={styles.dossierSectionCard}>
                    <View style={styles.sectionHeaderRow}>
                      <Feather name="mail" size={16} color="#F59E0B" />
                      <Text style={styles.sectionCardTitle}>CONTACT & INSTITUTION</Text>
                    </View>
                    <View style={styles.dossierGrid}>
                      <View style={[styles.dossierGridItem, { width: '100%' }]}>
                        <Text style={styles.gridLabel}>Email Address</Text>
                        <Text style={styles.gridValue}>{selectedStudent.email || 'N/A'}</Text>
                      </View>
                      <View style={[styles.dossierGridItem, { width: '100%' }]}>
                        <Text style={styles.gridLabel}>Phone Number</Text>
                        <Text style={styles.gridValue}>{selectedStudent.phone || 'Not provided'}</Text>
                      </View>
                      <View style={[styles.dossierGridItem, { width: '100%' }]}>
                        <Text style={styles.gridLabel}>College Name / Code</Text>
                        <Text style={styles.gridValue}>
                          {selectedStudent.college_name || user?.college_id || 'Assigned College'}
                          {selectedStudent.college_code ? ` (${selectedStudent.college_code})` : ''}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Student Bio */}
                  {selectedStudent.bio ? (
                    <View style={styles.dossierSectionCard}>
                      <View style={styles.sectionHeaderRow}>
                        <Feather name="user" size={16} color="#A855F7" />
                        <Text style={styles.sectionCardTitle}>STUDENT BIO</Text>
                      </View>
                      <Text style={styles.bioText}>{selectedStudent.bio}</Text>
                    </View>
                  ) : null}

                  {/* Skills Tags */}
                  {parseTags(selectedStudent.skills).length > 0 ? (
                    <View style={styles.dossierSectionCard}>
                      <View style={styles.sectionHeaderRow}>
                        <Feather name="code" size={16} color="#60A5FA" />
                        <Text style={styles.sectionCardTitle}>SKILLS & COMPETENCIES</Text>
                      </View>
                      <View style={styles.tagsWrap}>
                        {parseTags(selectedStudent.skills).map((skill, idx) => (
                          <View key={idx} style={styles.skillTag}>
                            <Text style={styles.skillTagText}>{skill}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}

                  {/* Actions for Principal */}
                  <View style={{ marginTop: 20 }}>
                    <TouchableOpacity
                      style={[styles.keyActionBtn, { backgroundColor: '#10B981' }]}
                      onPress={() => handleOpenEditStudent(selectedStudent)}
                    >
                      <Feather name="edit-3" size={16} color="#FFF" />
                      <Text style={styles.keyActionBtnText}>EDIT STUDENT RECORD</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Student Details Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '88%' }]}>
            <View style={styles.modalHandle} />
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '900', marginBottom: 4 }}>
              Edit Student Details
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 16 }}>
              Updates student records across campus systems in real time.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.editFieldGroup}>
                <Text style={styles.editFieldLabel}>FULL NAME *</Text>
                <TextInput
                  style={styles.editInput}
                  placeholder="Student Full Name"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={editForm.full_name}
                  onChangeText={(t) => setEditForm((f) => ({ ...f, full_name: t }))}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.editFieldGroup, { flex: 1 }]}>
                  <Text style={styles.editFieldLabel}>ROLL NUMBER</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="e.g. 210101"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={editForm.roll_number}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, roll_number: t }))}
                  />
                </View>
                <View style={[styles.editFieldGroup, { flex: 1 }]}>
                  <Text style={styles.editFieldLabel}>PIN NUMBER</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="e.g. 21001-CM-001"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={editForm.pin_number}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, pin_number: t }))}
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.editFieldGroup, { flex: 1 }]}>
                  <Text style={styles.editFieldLabel}>BRANCH</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="e.g. CSE / CME"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={editForm.branch}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, branch: t }))}
                  />
                </View>
                <View style={[styles.editFieldGroup, { flex: 1 }]}>
                  <Text style={styles.editFieldLabel}>ACADEMIC YEAR</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="e.g. 1st Year / 2nd Year"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={editForm.academic_year}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, academic_year: t }))}
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.editFieldGroup, { flex: 1 }]}>
                  <Text style={styles.editFieldLabel}>SEMESTER</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="e.g. 5"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={editForm.semester}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, semester: t }))}
                  />
                </View>
                <View style={[styles.editFieldGroup, { flex: 1 }]}>
                  <Text style={styles.editFieldLabel}>SECTION</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="e.g. A"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={editForm.section}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, section: t }))}
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.editFieldGroup, { flex: 1 }]}>
                  <Text style={styles.editFieldLabel}>PHONE NUMBER</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="+91..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={editForm.phone}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, phone: t }))}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={[styles.editFieldGroup, { flex: 1 }]}>
                  <Text style={styles.editFieldLabel}>CGPA / SCORE</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="e.g. 8.5"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={editForm.cgpa}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, cgpa: t }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.updatePasswordBtn, { backgroundColor: '#10B981', marginTop: 10 }]}
                onPress={handleSaveStudentDetails}
                disabled={savingStudent}
              >
                {savingStudent ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.updatePasswordBtnText}>SAVE STUDENT DETAILS</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelPasswordBtn}
                onPress={() => setEditModalVisible(false)}
                disabled={savingStudent}
              >
                <Text style={styles.cancelPasswordBtnText}>CANCEL</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  headerText: { flex: 1, marginLeft: 14 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFF', letterSpacing: -0.3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 9.5, color: 'rgba(255,255,255,0.45)', fontWeight: '800', letterSpacing: 0.8 },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  kpiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  kpiBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 2 },
  kpiNum: { fontSize: 18, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  kpiLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(255, 255, 255, 0.45)', marginTop: 3, letterSpacing: 0.8 },
  kpiDivider: { width: 1, height: 26, backgroundColor: 'rgba(255, 255, 255, 0.08)' },
  searchSection: { marginHorizontal: 20, marginBottom: 12 },
  searchBox: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#FFF', fontSize: 13 },
  filterSectionTitle: { fontSize: 10, fontWeight: '800', color: 'rgba(255, 255, 255, 0.4)', marginLeft: 20, marginBottom: 8, letterSpacing: 1 },
  filterScroll: { paddingHorizontal: 20, gap: 8 },
  chipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipBtnActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  chipBtnActiveYear: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: '#F59E0B',
  },
  chipText: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  chipTextActive: { color: '#FFF', fontWeight: '800' },
  listContent: { paddingBottom: 100 },
  studentCardContainer: { marginHorizontal: 20, marginBottom: 10 },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    gap: 12,
  },
  avatarImage: { width: 44, height: 44, borderRadius: 14 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  avatarText: { fontSize: 17, fontWeight: '900', color: '#60A5FA' },
  studentInfo: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  studentName: { fontSize: 15, fontWeight: '800', color: '#FFF', flex: 1, marginRight: 8 },
  pinPill: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    flexShrink: 0,
  },
  pinPillText: { color: '#60A5FA', fontSize: 9.5, fontWeight: '900' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 5 },
  branchPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  branchPillText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  yearPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  yearPillText: { color: '#F59E0B', fontSize: 10, fontWeight: '800' },
  sectionPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  sectionPillText: { color: '#10B981', fontSize: 10, fontWeight: '800' },
  emailText: { fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', letterSpacing: 0.2 },
  actionColumn: { justifyContent: 'center' },
  dossierBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  emptyTitle: { color: '#FFF', fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptyDesc: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 12, textAlign: 'center', marginTop: 4, lineHeight: 18 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.75)' },
  modalDismiss: { ...StyleSheet.absoluteFill },
  modalContent: {
    backgroundColor: '#0B1120',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxHeight: '90%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  dossierHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  dossierAvatar: { width: 56, height: 56, borderRadius: 18 },
  dossierAvatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  dossierAvatarText: { fontSize: 22, fontWeight: '900', color: '#60A5FA' },
  dossierName: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  dossierRoll: { fontSize: 12, fontWeight: '800', color: '#3B82F6', marginTop: 2 },
  dossierRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  dossierRoleText: { fontSize: 9, fontWeight: '900', color: '#10B981', letterSpacing: 0.5 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dossierSectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionCardTitle: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 0.8 },
  dossierGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 },
  dossierGridItem: { width: '50%', paddingRight: 8 },
  gridLabel: { fontSize: 9.5, fontWeight: '700', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: 0.5 },
  gridValue: { fontSize: 13, fontWeight: '700', color: '#FFF', marginTop: 3 },
  bioText: { fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 19 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  skillTagText: { fontSize: 11, fontWeight: '700', color: '#60A5FA' },
  keyActionBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  keyActionBtnText: { color: '#FFF', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
  updatePasswordBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  updatePasswordBtnText: { color: '#FFF', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
  cancelPasswordBtn: {
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelPasswordBtnText: { color: 'rgba(255, 255, 255, 0.6)', fontWeight: '700', fontSize: 12 },
  editFieldGroup: {
    marginBottom: 12,
  },
  editFieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  editInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    color: '#FFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
