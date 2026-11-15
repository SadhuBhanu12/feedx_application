import { useUser } from '@/context/UserContext';
import { useGamification } from '@/context/GamificationContext';
import { getCalendarDateString } from '@/services/gamificationService';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { useTasksQuery } from '@/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { requestQueue } from '@/lib/requestQueue';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeInRight, Layout, SlideInDown, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';

const PRIORITIES = [
  { label: 'High', color: COLORS.danger, icon: 'alert-circle' },
  { label: 'Medium', color: COLORS.warning, icon: 'clock' },
  { label: 'Low', color: COLORS.success, icon: 'check-circle' }
];

function TaskItem({ task, onToggle, index }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(task.status === 'Completed' ? 0.6 : 1);

  useEffect(() => {
    opacity.value = withTiming(task.status === 'Completed' ? 0.5 : 1, { duration: 300 });
  }, [task.status]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const priorityInfo = PRIORITIES.find(p => p.label === (task.priority || 'Medium')) || PRIORITIES[1];

  return (
    <Animated.View layout={Layout.springify()} entering={FadeInRight.delay(index * 80).springify()}>
      <Pressable
        onPress={() => onToggle(task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
      >
        <Animated.View style={[styles.taskCard, task.status === 'Completed' && styles.taskCardCompleted, animStyle]}>
          <View style={[styles.checkbox, task.status === 'Completed' && styles.checkboxCompleted]}>
            {task.status === 'Completed' && <Feather name="check" size={14} color="#fff" />}
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={styles.taskHeader}>
              <Text style={[styles.taskTitle, task.status === 'Completed' && styles.taskTitleCompleted]}>{task.title}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: priorityInfo.color + '15' }]}>
                <Text style={[styles.priorityText, { color: priorityInfo.color }]}>{priorityInfo.label}</Text>
              </View>
            </View>
            
            <View style={styles.taskMeta}>
              {task.deadline && (
                <View style={styles.metaItem}>
                  <Feather name="calendar" size={12} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>{new Date(task.deadline).toLocaleDateString()}</Text>
                </View>
              )}
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="circle-medium" size={16} color={task.status === 'Completed' ? COLORS.success : COLORS.warning} />
                <Text style={styles.metaText}>{task.status || 'Pending'}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function TasksScreen() {
  const { user } = useUser();
  const { triggerReward, refreshGamification } = useGamification();
  const queryClient = useQueryClient();
  const { data: serverTasks, isLoading: loading } = useTasksQuery(user?.id);
  
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // New Task Form
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', deadline: '' });

  useEffect(() => {
    if (serverTasks) {
      setTasks(serverTasks);
    }
  }, [serverTasks]);

  const handleToggleTask = async (id, newStatus) => {
    const taskItem = tasks.find(t => t.id === id);

    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    
    try {
      await requestQueue.enqueue('UPDATE_TASK_STATUS', { id, status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', user?.id] });

      // If task marked as Completed, award task completion tokens & trigger celebration popup!
      if (newStatus === 'Completed' && user?.id && triggerReward) {
        const todayDate = getCalendarDateString();
        const refId = `task_desk_${id}_${todayDate}`;
        try {
          await triggerReward({
            userId: user.id,
            activityType: 'daily_task',
            points: 20,
            referenceId: refId,
            activityName: taskItem?.title ? `Task: ${taskItem.title}` : 'Task Desk Mission Completed',
          });
          await refreshGamification();
        } catch (rewardErr) {
          console.warn('[TasksScreen] Task reward trigger warning:', rewardErr);
        }
      }
    } catch (e) {
      console.warn('Toggle task failed, reverting:', e);
      // Revert optimistic update
      setTasks(serverTasks || []);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    
    const optimisticTask = { 
      id: Math.random(), 
      ...newTask,
      status: 'Pending', 
      user_id: user.id 
    };
    
    setTasks(prev => [optimisticTask, ...prev]);
    setModalVisible(false);
    
    try {
      await requestQueue.enqueue('ADD_TASK', { 
        title: newTask.title, 
        description: newTask.description,
        priority: newTask.priority,
        deadline: newTask.deadline || null,
        user_id: user.id
      });
      
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', user?.id] });
    } catch (e) {
      console.warn('Add task failed, reverting:', e);
      setTasks(serverTasks || []);
    }
    
    setNewTask({ title: '', description: '', priority: 'Medium', deadline: '' });
  };

  const pendingCount = tasks.filter(t => t.status !== 'Completed').length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Task Desk</Text>
          <Text style={styles.subtitle}>{pendingCount} missions active</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
           <MaterialCommunityIcons name="clipboard-check-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks.filter(t => t.status !== 'Completed')}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <TaskItem task={item} onToggle={handleToggleTask} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                 <MaterialCommunityIcons name="check-decagram-outline" size={60} color={COLORS.success} />
              </View>
              <Text style={styles.emptyTitle}>Zero Pending Tasks</Text>
              <Text style={styles.emptySubtitle}>You&apos;re all caught up! Take a break or start something new.</Text>
            </View>
          )
        }
      />

      <Animated.View entering={SlideInDown.duration(500).springify()} style={styles.fabContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.fab}>
            <Feather name="plus" size={30} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Task</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Feather name="x" size={24} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                <Text style={styles.inputLabel}>TASK TITLE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What needs to be done?"
                  placeholderTextColor={COLORS.textDisabled}
                  value={newTask.title}
                  onChangeText={t => setNewTask(prev => ({ ...prev, title: t }))}
                />

                <Text style={styles.inputLabel}>PRIORITY LEVEL</Text>
                <View style={styles.priorityRow}>
                  {PRIORITIES.map(p => (
                    <TouchableOpacity 
                      key={p.label} 
                      onPress={() => setNewTask(prev => ({ ...prev, priority: p.label }))}
                      style={[
                        styles.priorityOption, 
                        newTask.priority === p.label && { borderColor: p.color, backgroundColor: p.color + '10' }
                      ]}
                    >
                      <Text style={[styles.priorityOptionText, newTask.priority === p.label && { color: p.color }]}>{p.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>DESCRIPTION (OPTIONAL)</Text>
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
                  placeholder="Add some details..."
                  placeholderTextColor={COLORS.textDisabled}
                  multiline
                  value={newTask.description}
                  onChangeText={t => setNewTask(prev => ({ ...prev, description: t }))}
                />
              </ScrollView>

              <TouchableOpacity onPress={handleAddTask} activeOpacity={0.8} style={styles.saveBtn}>
                <LinearGradient colors={COLORS.gradientPrimary} style={styles.saveBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.saveBtnText}>Initialize Task</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 4, fontWeight: '600' },
  headerIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingHorizontal: 24, paddingBottom: 120 },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 24, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', ...SHADOWS.small },
  taskCardCompleted: { opacity: 0.6, borderColor: 'transparent' },
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', marginRight: 16, alignItems: 'center', justifyContent: 'center' },
  checkboxCompleted: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  taskTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, flex: 1, marginRight: 10 },
  taskTitleCompleted: { color: COLORS.textMuted },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  priorityText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  fabContainer: { position: 'absolute', right: 24, bottom: 40 },
  fab: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', ...SHADOWS.glow(COLORS.primary) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: COLORS.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '80%' },
  modalContent: { flex: 1, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  modalScroll: { flex: 1 },
  inputLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 12, marginTop: 16 },
  input: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  priorityRow: { flexDirection: 'row', gap: 12 },
  priorityOption: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  priorityOptionText: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted },
  saveBtn: { marginTop: 24 },
  saveBtnGradient: { height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  emptyBox: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(34, 197, 94, 0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
});