import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGamification } from '@/context/GamificationContext';
import { useTheme } from '@/context/ThemeContext';
import { exploreService } from '@/services/exploreService';
import RewardSuccessModal from './RewardSuccessModal';

export default function DailyChallengesCard() {
  const { wallet, streak, transactions, completeDailyLogin, refreshGamification } = useGamification();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [claiming, setClaiming] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<{ visible: boolean; activityType: string; coins: number }>({
    visible: false,
    activityType: '',
    coins: 0,
  });

  const getTodayStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [currentDateStr, setCurrentDateStr] = useState(getTodayStr());
  const [quizTitle, setQuizTitle] = useState('Daily Tech Quiz');
  const [selectedLesson, setSelectedLesson] = useState<{ id: string; title: string } | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nowStr = getTodayStr();
      if (nowStr !== currentDateStr) {
        setCurrentDateStr(nowStr);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [currentDateStr]);

  useEffect(() => {
    let isMounted = true;
    const fetchRandomTasks = async () => {
      try {
        const [lessons, quizzes] = await Promise.all([
          exploreService.getQuickLearnLessons('All'),
          exploreService.getQuizzes('All'),
        ]);

        if (lessons && lessons.length > 0 && quizzes && quizzes.length > 0) {
          let seed = 0;
          for (let i = 0; i < currentDateStr.length; i++) {
            seed += currentDateStr.charCodeAt(i);
          }

          const lesson = lessons[seed % lessons.length];
          const quiz = quizzes[seed % quizzes.length];

          if (isMounted) {
            setSelectedLesson({ id: lesson.id, title: lesson.title });
            setSelectedQuiz({ id: quiz.id, title: quiz.title });
          }
        }
      } catch (err) {
        console.warn('fetchRandomTasks error:', err);
      }
    };
    fetchRandomTasks();
    return () => { isMounted = false; };
  }, [currentDateStr]);

  const isToday = (t: { created_at?: string; reference_id?: string | null }) => {
    if (t.reference_id && t.reference_id.includes(currentDateStr)) return true;
    if (!t.created_at) return false;
    try {
      const txDate = new Date(t.created_at);
      const yyyy = txDate.getFullYear();
      const mm = String(txDate.getMonth() + 1).padStart(2, '0');
      const dd = String(txDate.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}` === currentDateStr;
    } catch (e) {
      return false;
    }
  };

  const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const loadState = async () => {
      try {
        const key = `@feedx_daily_challenges_${currentDateStr}`;
        const saved = await AsyncStorage.getItem(key);
        if (saved && isMounted) {
          setLocalCompleted(JSON.parse(saved));
        } else if (isMounted) {
          setLocalCompleted({});
        }
      } catch (err) {
        console.warn('DailyChallenges AsyncStorage load error:', err);
      }
    };
    loadState();
    return () => { isMounted = false; };
  }, [currentDateStr]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;
    const todayTypes = transactions.filter((t) => isToday(t)).map((t) => t.activity_type);
    if (todayTypes.length === 0) return;

    let changed = false;
    const updated = { ...localCompleted };
    todayTypes.forEach((type) => {
      if (!updated[type]) {
        updated[type] = true;
        changed = true;
      }
    });

    if (changed) {
      setLocalCompleted(updated);
      AsyncStorage.setItem(`@feedx_daily_challenges_${currentDateStr}`, JSON.stringify(updated)).catch(() => {});
    }
  }, [transactions, currentDateStr]);

  const challenges = useMemo(() => {
    const todayTypes = new Set(
      transactions.filter((t) => isToday(t)).map((t) => t.activity_type)
    );

    return [
      {
        id: 'daily_login',
        title: "Daily Streak Check-in",
        subtitle: "Check in daily to build your active learning streak.",
        reward: '+10 Points',
        tokens: 10,
        completed: Boolean(
          todayTypes.has('daily_login') ||
          todayTypes.has('streak_checkin') ||
          todayTypes.has('daily_checkin') ||
          localCompleted['daily_login'] ||
          (streak?.last_active_date && streak.last_active_date.startsWith(currentDateStr))
        ),
        actionText: 'Claim',
        iconName: 'calendar-check',
      },
      {
        id: 'resource_read',
        title: "Complete today's learning activity",
        subtitle: selectedLesson ? `Topic: ${selectedLesson.title}` : "Learn today's assigned topic and complete the required activity.",
        reward: '+45 Points',
        tokens: 45,
        completed: Boolean(todayTypes.has('resource_read') || localCompleted['resource_read']),
        actionText: 'Start Activity',
        iconName: 'book-open-variant',
      },
      {
        id: 'quiz_completed',
        title: "Complete today's Daily Quiz",
        subtitle: selectedQuiz ? `Challenge: ${selectedQuiz.title}` : quizTitle,
        reward: '+60 Points',
        tokens: 60,
        completed: Boolean(todayTypes.has('quiz_completed') || localCompleted['quiz_completed']),
        actionText: 'Start Quiz',
        iconName: 'head-lightbulb',
      },
      {
        id: 'roadmap_completed',
        title: "Complete today's Roadmap Task",
        subtitle: "Advance 1 day in your active career learning roadmap.",
        reward: '+35 Points',
        tokens: 35,
        completed: Boolean(
          todayTypes.has('roadmap_completed') ||
          todayTypes.has('roadmap_task') ||
          todayTypes.has('phase_completed') ||
          localCompleted['roadmap_completed']
        ),
        actionText: 'Start Roadmap',
        iconName: 'map-legend',
      },
    ];
  }, [transactions, localCompleted, quizTitle, selectedLesson, selectedQuiz]);

  const completedCount = challenges.filter((c) => c.completed).length;
  const progressPercent = Math.round((completedCount / challenges.length) * 100);

  const handleTaskAction = async (challenge: typeof challenges[0]) => {
    if (challenge.completed) {
      Alert.alert('Task Completed! ✅', 'Points have already been awarded for this activity today.');
      return;
    }

    if (challenge.id === 'daily_login') {
      setClaiming(challenge.id);
      try {
        const updatedLocal = { ...localCompleted, daily_login: true };
        setLocalCompleted(updatedLocal);
        AsyncStorage.setItem(`@feedx_daily_challenges_${currentDateStr}`, JSON.stringify(updatedLocal)).catch(() => {});

        const res = await completeDailyLogin();
        if (res.success && !res.already_completed) {
          Alert.alert('Checked In! 🎉', 'You have successfully checked in today and earned +10 Points!');
        } else {
          Alert.alert('Checked In! ✅', 'You have already checked in today.');
        }
        await refreshGamification();
      } catch (err) {
        console.warn('daily_login error:', err);
      } finally {
        setClaiming(null);
      }
      return;
    }

    if (challenge.id === 'resource_read') {
      if (selectedLesson) {
        router.push({ pathname: '/quick-learn-detail' as any, params: { id: selectedLesson.id } });
      } else {
        router.push('/(tabs)/explore' as any);
      }
      return;
    }

    if (challenge.id === 'roadmap_completed') {
      router.push('/roadmap' as any);
      return;
    }

    if (challenge.id === 'quiz_completed') {
      if (selectedQuiz) {
        router.push({ pathname: '/daily-quiz' as any, params: { quizId: selectedQuiz.id } });
      } else {
        router.push('/daily-quiz' as any);
      }
      return;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginRight: 8 }}>
          <View style={styles.iconGlowBox}>
            <MaterialCommunityIcons name="target" size={20} color="#F59E0B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>🎯 Today's Mission</Text>
            <Text style={[styles.subTitle, { color: colors.textMuted }]} numberOfLines={1}>Complete your daily standard tasks to earn rewards</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{completedCount}/{challenges.length} Done</Text>
        </View>
      </View>

      {/* Animated Progress Track */}
      <View style={styles.progressRow}>
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
          <View style={[styles.fill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressPercentText}>{progressPercent}%</Text>
      </View>

      {/* Task List Grid: Filter out completed tasks so they disappear upon completion */}
      <View style={styles.taskList}>
        {challenges.filter((c) => !c.completed).length === 0 ? (
          <View style={[styles.modernDoneCard, { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC', borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.25)' }]}>
            <View style={styles.modernTopRow}>
              <View style={styles.modernEmblem}>
                <Ionicons name="checkmark-done-circle" size={20} color="#10B981" />
              </View>
              <View style={styles.modernBadgePill}>
                <Text style={styles.modernBadgePillText}>DAILY MASTERY ACHIEVED</Text>
              </View>
            </View>

            <Text style={[styles.modernTitle, { color: colors.textPrimary }]}>
              🎉 All Missions Mastered Today!
            </Text>

            <Text style={[styles.modernSub, { color: colors.textMuted }]}>
              Congratulations! You unlocked all available 150 Points and kept your daily streak active.
            </Text>

            <View style={styles.modernMetricsRow}>
              <View style={[styles.modernMetricChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9' }]}>
                <Text style={styles.modernMetricVal}>⭐ 150/150</Text>
                <Text style={styles.modernMetricLabel}>Points Earned</Text>
              </View>
              <View style={[styles.modernMetricChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9' }]}>
                <Text style={styles.modernMetricVal}>🔥 Active</Text>
                <Text style={styles.modernMetricLabel}>Streak Intact</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modernShareBtn}
              onPress={async () => {
                try {
                  await Share.share({
                    message: `🎯 I completed all today's learning missions on FEEDX! Earned 150 XP points and kept my daily streak alive. #FEEDX #Gamification`,
                  });
                } catch (_) {}
              }}
            >
              <Ionicons name="share-social-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modernShareBtnText}>Share Daily Victory 🚀</Text>
            </TouchableOpacity>
          </View>
        ) : (
          challenges
            .filter((c) => !c.completed)
            .map((c) => (
              <View
                key={c.id}
                style={[
                  styles.taskItem,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: colors.cardBorder }
                ]}
              >
                <View style={styles.taskLeft}>
                  <View style={[styles.taskIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                    <MaterialCommunityIcons 
                      name={c.iconName as any} 
                      size={18} 
                      color="#F59E0B" 
                    />
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{c.title}</Text>
                    <Text style={[styles.taskDesc, { color: colors.textMuted }]}>{c.subtitle}</Text>
                    <Text style={[styles.taskPoints, { color: '#F59E0B', fontWeight: '800', marginTop: 2, fontSize: 11 }]}>
                      ⭐ {c.reward}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.claimBtn, styles.activeBtn]}
                  disabled={claiming === c.id}
                  onPress={() => handleTaskAction(c)}
                >
                  {claiming === c.id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.claimBtnText}>{c.actionText}</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))
        )}
      </View>

      <RewardSuccessModal
        visible={successModal.visible}
        activityType={successModal.activityType}
        coinsEarned={successModal.coins}
        onClose={() => setSuccessModal({ visible: false, activityType: '', coins: 0 })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconGlowBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F59E0B',
  },
  taskList: {
    gap: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  taskIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  taskDesc: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  claimBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  activeBtn: {
    backgroundColor: '#3B82F6',
  },
  completedBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  completedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  taskPoints: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  allDoneBox: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  allDoneTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 6,
    textAlign: 'center',
  },
  allDoneSub: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  modernDoneCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    marginVertical: 4,
    gap: 12,
  },
  modernTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modernEmblem: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernBadgePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  modernBadgePillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.8,
  },
  modernTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  modernSub: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  modernMetricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modernMetricChip: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  modernMetricVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#10B981',
  },
  modernMetricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  modernShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  modernShareBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
