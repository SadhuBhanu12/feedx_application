import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native';
import { COLORS, SHADOWS } from '@/constants/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useUser } from '@/context/UserContext';
import { adminDeleteTask, adminListTasks, adminUpsertTask, adminListStudents } from '@/services/supabaseService';

interface StudentItem {
  id: string;
  roll_number: string;
  full_name: string;
  email: string;
  branch_id?: string;
  year?: number | string;
}

const AdminTasksScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();

  const [tasks, setTasks] = useState<any[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Form State
  const [form, setForm] = useState({ id: '', user_id: '', title: '', deadline: '', description: '' });
  const [activeStudent, setActiveStudent] = useState<StudentItem | null>(null);

  // Selector Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTasksAndStudents = async () => {
    setLoading(true);
    try {
      const collegeId = user?.college_id;
      const [tData, sData] = await Promise.all([
        adminListTasks(collegeId),
        adminListStudents(collegeId)
      ]);
      setTasks(tData || []);
      setStudents(sData || []);
    } catch (e: any) {
      console.error('Error loading tasks/students:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasksAndStudents();

    // Subscribe to task updates in real time
    const channel = supabase.channel(`admin-tasks-rt-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, loadTasksAndStudents)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSave = async () => {
    if (!form.user_id || !form.title.trim()) {
      Alert.alert('Required Fields', 'Please select a student and enter a task title.');
      return;
    }

    setSyncing(true);
    try {
      const payload = {
        id: form.id || undefined,
        user_id: form.user_id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        deadline: form.deadline.trim() || null,
        completed: false
      };

      await adminUpsertTask(payload);
      Alert.alert('Success', 'Student task successfully allocated.');
      
      // Reset form
      setForm({ id: '', user_id: '', title: '', deadline: '', description: '' });
      setActiveStudent(null);
      loadTasksAndStudents();
    } catch (e: any) {
      Alert.alert('Save Failed', e.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleEdit = (item: any) => {
    const matchedStudent = students.find(s => s.id === item.user_id) || null;
    setActiveStudent(matchedStudent);
    setForm({
      id: item.id,
      user_id: item.user_id || '',
      title: item.title || '',
      description: item.description || '',
      deadline: item.deadline || ''
    });
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to remove this assigned task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminDeleteTask(id);
            Alert.alert('Deleted', 'Task removed.');
            loadTasksAndStudents();
          } catch (e: any) {
            Alert.alert('Delete Failed', e.message);
          }
        }
      }
    ]);
  };

  const selectStudent = (student: StudentItem) => {
    setActiveStudent(student);
    setForm(f => ({ ...f, user_id: student.id }));
    setIsModalVisible(false);
  };

  // Filter students list in picker modal
  const searchedStudents = useMemo(() => {
    return students.filter(s => 
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  // Map user IDs to student names for task lists
  const getStudentDisplay = (userId: string) => {
    const match = students.find(s => s.id === userId);
    return match ? `${match.full_name} (${match.roll_number})` : 'Assigned Student';
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Task Console</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>TASK SCHEDULER ACTIVE</Text>
          </View>
        </View>
        <View style={styles.logoBox}>
          <MaterialCommunityIcons name="clipboard-check-multiple-outline" size={24} color="#A855F7" />
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadTasksAndStudents}
        initialNumToRender={8}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <Animated.View entering={FadeInDown} style={styles.formSection}>
            <BlurView intensity={10} tint="light" style={styles.composerCard}>
              <Text style={styles.composerLabel}>ASSIGN NEW TASK</Text>

              {/* Student Picker Trigger */}
              <View style={styles.field}>
                <Text style={styles.label}>Select Student</Text>
                <TouchableOpacity style={styles.selectorBtn} onPress={() => setIsModalVisible(true)}>
                  <Text style={[styles.selectorText, !activeStudent && styles.placeholderText]}>
                    {activeStudent ? `${activeStudent.full_name} (${activeStudent.roll_number})` : 'Choose Student...'}
                  </Text>
                  <Feather name="user-check" size={16} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              </View>

              {/* Task Title */}
              <View style={styles.field}>
                <Text style={styles.label}>Task Title</Text>
                <TextInput 
                  style={styles.input} 
                  value={form.title} 
                  onChangeText={t => setForm(f => ({ ...f, title: t }))} 
                  placeholder="e.g. Submit Microprocessor Record" 
                  placeholderTextColor="rgba(255,255,255,0.2)"
                />
              </View>

              {/* Task Description */}
              <View style={styles.field}>
                <Text style={styles.label}>Description</Text>
                <TextInput 
                  style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]} 
                  value={form.description} 
                  onChangeText={t => setForm(f => ({ ...f, description: t }))} 
                  placeholder="Details and instructions..." 
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  multiline
                />
              </View>

              {/* Task Deadline */}
              <View style={styles.field}>
                <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
                <TextInput 
                  style={styles.input} 
                  value={form.deadline} 
                  onChangeText={t => setForm(f => ({ ...f, deadline: t }))} 
                  placeholder="e.g. 2026-07-15" 
                  placeholderTextColor="rgba(255,255,255,0.2)"
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={syncing}>
                <LinearGradient colors={['#A855F7', '#8B5CF6']} style={styles.buttonGradient}>
                  {syncing ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.primaryButtonText}>{form.id ? 'UPDATE ASSIGNED TASK' : 'ALLOCATE TASK'}</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>

            <Text style={styles.listSectionTitle}>Currently Active Tasks</Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 40)} style={styles.taskCardContainer}>
            <View style={styles.taskCard}>
              <View style={styles.taskInfoBox}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskAssignee}>{getStudentDisplay(item.user_id)}</Text>
                {item.description && <Text style={styles.taskDesc}>{item.description}</Text>}
                
                <View style={styles.taskFooterRow}>
                  <View style={styles.deadlineTag}>
                    <Feather name="calendar" size={11} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.deadlineText}>Due: {item.deadline || 'No Deadline'}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: item.completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)' }]}>
                    <Text style={[styles.statusBadgeText, { color: item.completed ? '#10B981' : '#F59E0B' }]}>
                      {item.completed ? 'COMPLETED' : 'PENDING'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionColumn}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                  <Feather name="edit-3" size={16} color="#A855F7" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Feather name="trash-2" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={48} color="rgba(255,255,255,0.15)" />
            <Text style={styles.emptyText}>No allocated tasks in the registry.</Text>
          </View>
        }
      />

      {/* Searchable Student Picker Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setIsModalVisible(false)} />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalHeading}>SELECT STUDENT USER</Text>
            
            {/* Search Bar */}
            <View style={styles.searchBarBox}>
              <Feather name="search" size={16} color="rgba(255,255,255,0.3)" />
              <TextInput 
                style={styles.searchInput} 
                value={searchQuery} 
                onChangeText={setSearchQuery} 
                placeholder="Search by Roll number or Name..."
                placeholderTextColor="rgba(255,255,255,0.25)"
              />
            </View>

            <FlatList
              data={searchedStudents}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 320 }}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={15}
              windowSize={5}
              removeClippedSubviews={true}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.studentOptionRow} onPress={() => selectStudent(item)}>
                  <View style={styles.studentOptionAvatar}>
                    <Text style={styles.studentOptionAvatarText}>{item.full_name?.[0]}</Text>
                  </View>
                  <View style={styles.studentOptionMeta}>
                    <Text style={styles.studentOptionRoll}>{item.roll_number}</Text>
                    <Text style={styles.studentOptionName}>{item.full_name}</Text>
                  </View>
                  <Feather name="chevron-right" size={14} color="rgba(255,255,255,0.2)" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.modalEmpty}>
                  <Text style={styles.modalEmptyText}>No matching students found.</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default AdminTasksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#A855F7' },
  statusText: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: 1 },
  logoBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(168, 85, 247, 0.08)', alignItems: 'center', justifyContent: 'center' },
  formSection: { padding: 20 },
  composerCard: { padding: 24, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  composerLabel: { fontSize: 10, fontWeight: '900', color: '#A855F7', letterSpacing: 1.5, marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  selectorBtn: { height: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  selectorText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  placeholderText: { color: 'rgba(255,255,255,0.25)' },
  input: { height: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, paddingHorizontal: 16, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  primaryButton: { height: 54, borderRadius: 16, overflow: 'hidden', marginTop: 12 },
  buttonGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  listSectionTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', marginTop: 32, marginBottom: 4, marginLeft: 4 },
  listContent: { paddingBottom: 120 },
  taskCardContainer: { marginHorizontal: 20, marginBottom: 12 },
  taskCard: { flexDirection: 'row', padding: 18, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', gap: 14 },
  taskInfoBox: { flex: 1 },
  taskTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  taskAssignee: { color: '#A855F7', fontSize: 12, fontWeight: '700', marginTop: 4 },
  taskDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 12.5, lineHeight: 18, marginTop: 8 },
  taskFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)' },
  deadlineTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deadlineText: { color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 9, fontWeight: '900' },
  actionColumn: { gap: 8, justifyContent: 'center' },
  editBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(168, 85, 247, 0.08)', alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.08)', alignItems: 'center', justifyContent: 'center' },
  emptyBox: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: 'rgba(255,255,255,0.25)', fontSize: 13, fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalDismiss: { flex: 1 },
  modalContent: { backgroundColor: '#1E293B', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '80%', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  modalHandle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeading: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 1.5, marginBottom: 16, alignSelf: 'center' },
  searchBarBox: { height: 48, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 10, color: '#FFF', fontSize: 14 },
  studentOptionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)', gap: 12 },
  studentOptionAvatar: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(168, 85, 247, 0.1)', alignItems: 'center', justifyContent: 'center' },
  studentOptionAvatarText: { color: '#A855F7', fontWeight: '900', fontSize: 15 },
  studentOptionMeta: { flex: 1 },
  studentOptionRoll: { fontSize: 11, fontWeight: '900', color: '#A855F7' },
  studentOptionName: { fontSize: 14, color: '#FFF', fontWeight: '700', marginTop: 1 },
  modalEmpty: { paddingVertical: 32, alignItems: 'center' },
  modalEmptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: '700' }
});
