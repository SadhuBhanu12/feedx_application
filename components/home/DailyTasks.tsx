import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/context/ThemeContext';
import { useGamification } from '@/context/GamificationContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export interface TaskItem {
  id: string;
  title: string;
  category?: string;
  completed?: boolean;
  deadline?: string;
  route?: string;
}

interface DailyTasksProps {
  tasks?: TaskItem[];
  userId?: string;
  onTaskToggle?: () => void;
}

const getLocalTodayStr = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getTodayKey = () => {
  return `@feedx_daily_tasks_${getLocalTodayStr()}`;
};

export function DailyTasks({ tasks = [], userId, onTaskToggle }: DailyTasksProps) {
  const { colors, isDark } = useTheme();
  const { triggerActivity, triggerReward, refreshGamification } = useGamification();
  const router = useRouter();

  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const processingTasksRef = useRef<Set<string>>(new Set());

  // Load persisted daily task completion state from database & AsyncStorage
  useEffect(() => {
    let isMounted = true;
    const loadState = async () => {
      try {
        const todayDate = getLocalTodayStr();
        
        // 1. Fetch completed daily task transactions from database if user is logged in
        const dbCompleted: Record<string, boolean> = {};
        if (userId) {
          try {
            const { data: txs } = await supabase
              .from('coin_transactions')
              .select('reference_id')
              .eq('student_id', userId)
              .like('reference_id', `daily_task_%_${todayDate}`);

            if (txs) {
              txs.forEach((tx: any) => {
                if (tx.reference_id && tx.reference_id.startsWith('daily_task_')) {
                  const sub = tx.reference_id.substring('daily_task_'.length);
                  const dateRegex = /_\d{4}-\d{2}-\d{2}$/;
                  const taskId = sub.replace(dateRegex, '');
                  if (taskId) {
                    dbCompleted[taskId] = true;
                  }
                }
              });
            }
          } catch (dbErr) {
            console.warn('[DailyTasks] DB tasks load error:', dbErr);
          }
        }

        // 2. Fetch from AsyncStorage local cache
        const key = getTodayKey();
        const saved = await AsyncStorage.getItem(key);
        const localMap: Record<string, boolean> = saved ? JSON.parse(saved) : {};
        
        // 3. Merge database records, AsyncStorage cache, and tasks props
        const mergedMap = { ...localMap, ...dbCompleted };
        (tasks || []).forEach((t) => {
          if (mergedMap[t.id] === undefined && t.completed) {
            mergedMap[t.id] = true;
          }
        });

        if (isMounted) {
          setCompletedMap(mergedMap);
        }
      } catch (err) {
        console.warn('DailyTasks state load error:', err);
      }
    };

    loadState();

    return () => {
      isMounted = false;
    };
  }, [tasks, userId]);

  const handleToggleTask = (taskId: string) => {
    if (completedMap[taskId] || processingTasksRef.current.has(taskId)) {
      return; // Already completed or currently processing, do not re-award
    }
    processingTasksRef.current.add(taskId);

    const updatedMap = { ...completedMap, [taskId]: true };
    setCompletedMap(updatedMap);

    const todayDate = getLocalTodayStr();
    const refId = `daily_task_${taskId}_${todayDate}`;

    // 1. Immediately trigger reward popup with 0ms delay!
    const taskItem = tasks.find((t) => t.id === taskId);
    if (userId && triggerReward) {
      triggerReward({
        userId,
        activityType: 'daily_task',
        points: 20,
        referenceId: refId,
        activityName: taskItem?.title ? `Task: ${taskItem.title}` : 'Daily Task Completed',
      })
        .then(() => refreshGamification && refreshGamification())
        .catch((err) => console.warn('Task reward trigger warning:', err));
    } else if (triggerActivity) {
      triggerActivity('task_completed', 20, 20, refId).catch(() => {});
    }

    // 2. Background asynchronous synchronization of storage and database
    (async () => {
      try {
        const key = getTodayKey();
        await AsyncStorage.setItem(key, JSON.stringify(updatedMap));

        if (userId && taskId && !taskId.startsWith('task_')) {
          await supabase
            .from('tasks')
            .update({ completed: true, status: 'Completed' })
            .eq('id', taskId)
            .eq('user_id', userId);
        }

        if (onTaskToggle) {
          onTaskToggle();
        }
      } catch (e) {
        console.warn('Background task persistence warning:', e);
      }
    })();
  };

  const pendingTasks = tasks.filter((t) => !completedMap[t.id]);
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => completedMap[t.id]).length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(200).springify()} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Daily Tasks</Text>
        </View>

        {totalCount > 0 && (
          <View style={styles.progressPill}>
            <Text style={[styles.progressText, { color: colors.primary }]}>
              {completedCount}/{totalCount} Completed ({progressPct}%)
            </Text>
          </View>
        )}
      </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="check-all" size={28} color="#10B981" />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No tasks assigned for today</Text>
            <Text style={[styles.emptySub, { color: colors.textMuted }]}>
              You&apos;re all caught up! Explore new career opportunities or continue your learning roadmap.
            </Text>
          </View>
        ) : (
          <View style={styles.taskList}>
            {tasks.map((task) => {
              const isCompleted = !!completedMap[task.id];
              return (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskItemRow,
                    { 
                      borderColor: isCompleted 
                        ? (isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)')
                        : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                      backgroundColor: isCompleted
                        ? (isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.03)')
                        : 'transparent'
                    }
                  ]}
                  onPress={() => handleToggleTask(task.id)}
                  activeOpacity={0.7}
                  delayPressIn={0}
                >
                  <View style={styles.checkBtn}>
                    <MaterialCommunityIcons
                      name={isCompleted ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                      size={20}
                      color={isCompleted ? "#10B981" : colors.textMuted}
                    />
                  </View>

                  <View style={styles.taskTextWrap}>
                    <Text style={[
                      styles.taskTitle, 
                      { 
                        color: isCompleted ? colors.textMuted : colors.textPrimary,
                        opacity: isCompleted ? 0.8 : 1,
                        textDecorationLine: isCompleted ? 'line-through' : 'none',
                      }
                    ]}>
                      {task.title}
                    </Text>
                    <Text style={[styles.taskCategory, { color: isCompleted ? '#10B981' : colors.textMuted }]}>
                      {task.category || 'Personal Task'}{isCompleted ? ' • ✓ Completed' : ''}
                    </Text>
                  </View>

                  {task.route && (
                    <TouchableOpacity onPress={() => router.push(task.route as any)} style={styles.openTaskBtn}>
                      <Feather name="chevron-right" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  progressPill: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '800',
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    ...SHADOWS.small,
  },
  emptyWrap: {
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
  },
  taskList: {
    gap: 8,
  },
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  checkBtn: {
    padding: 2,
    marginTop: 1,
  },
  taskTextWrap: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  taskCategory: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  openTaskBtn: {
    padding: 4,
  },
});
