import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useRouter, useFocusEffect } from 'expo-router';
import { useGamification } from '@/context/GamificationContext';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { exploreService } from '@/services/exploreService';
import { roadmapService } from '@/services/roadmapService';
import { getCalendarDateString } from '@/services/gamificationService';
import { supabase } from '@/lib/supabase';
import { rf, rs } from '@/constants/responsive';

export interface DailyChallengesCardProps {
  showSummaryProgress?: boolean;
}

export default function DailyChallengesCard({ showSummaryProgress = true }: DailyChallengesCardProps = {}) {
  const { user } = useUser();
  const { wallet, streak, transactions, completeDailyLogin, refreshGamification } = useGamification();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [claiming, setClaiming] = useState<string | null>(null);

  const getTodayStr = () => {
    return getCalendarDateString();
  };

  const [currentDateStr, setCurrentDateStr] = useState(getTodayStr());
  const [selectedLesson, setSelectedLesson] = useState<{ id: string; title: string } | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<{ id: string; title: string } | null>(null);
  const [resetCountdown, setResetCountdown] = useState('Resets in 1h 11m');

  // Dynamic countdown to midnight
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = Math.max(0, midnight.getTime() - now.getTime());
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setResetCountdown(`Resets in ${diffHrs}h ${diffMins}m`);
    };
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

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
    const utcDateStr = new Date().toISOString().split('T')[0];
    if (t.reference_id && (t.reference_id.includes(currentDateStr) || t.reference_id.includes(utcDateStr))) return true;
    if (!t.created_at) return false;
    try {
      const txDate = new Date(t.created_at);
      const yyyy = txDate.getFullYear();
      const mm = String(txDate.getMonth() + 1).padStart(2, '0');
      const dd = String(txDate.getDate()).padStart(2, '0');
      const localFormatted = `${yyyy}-${mm}-${dd}`;
      const utcFormatted = t.created_at.split('T')[0];
      return localFormatted === currentDateStr || utcFormatted === currentDateStr || utcFormatted === utcDateStr;
    } catch (e) {
      return false;
    }
  };

  const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>({});

  const loadState = useCallback(async () => {
    try {
      const globalKey = `@feedx_daily_challenges_${currentDateStr}`;
      const userKey = user?.id ? `@feedx_daily_challenges_${user.id}_${currentDateStr}` : null;
      const [globalSaved, userSaved] = await Promise.all([
        AsyncStorage.getItem(globalKey),
        userKey ? AsyncStorage.getItem(userKey) : Promise.resolve(null),
      ]);
      const merged: Record<string, boolean> = {};
      if (globalSaved) {
        try { Object.assign(merged, JSON.parse(globalSaved)); } catch (_) {}
      }
      if (userSaved) {
        try { Object.assign(merged, JSON.parse(userSaved)); } catch (_) {}
      }

      // Authoritative database check: query coin_transactions directly from Supabase!
      if (user?.id) {
        const utcDateStr = new Date().toISOString().split('T')[0];
        const { data: dbTxs } = await supabase
          .from('coin_transactions')
          .select('activity_type, reference_id, created_at')
          .or(`student_id.eq.${user.id},user_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(50);

        if (dbTxs && dbTxs.length > 0) {
          dbTxs.forEach((tx) => {
            const ref = tx.reference_id || '';
            let isTodayTx = ref.includes(currentDateStr) || ref.includes(utcDateStr);
            if (!isTodayTx && tx.created_at) {
              try {
                const txDate = new Date(tx.created_at);
                const yyyy = txDate.getFullYear();
                const mm = String(txDate.getMonth() + 1).padStart(2, '0');
                const dd = String(txDate.getDate()).padStart(2, '0');
                const localFormatted = `${yyyy}-${mm}-${dd}`;
                const utcFormatted = tx.created_at.split('T')[0];
                isTodayTx = localFormatted === currentDateStr || utcFormatted === currentDateStr || utcFormatted === utcDateStr;
              } catch (_) {}
            }

            if (isTodayTx) {
              const type = tx.activity_type;
              merged[type] = true;
              if (['home_daily_quick_learn', 'explore_quick_learn', 'daily_mission_quick_learn', 'daily_quick_learn', 'quick_learn', 'resource_read', 'lesson_completed'].includes(type)) {
                merged['resource_read'] = true;
                merged['quick_learn'] = true;
                merged['home_daily_quick_learn'] = true;
                merged['explore_quick_learn'] = true;
                merged['daily_quick_learn'] = true;
                merged['daily_mission_quick_learn'] = true;
              }
              if (['home_daily_quiz', 'explore_quiz', 'daily_quiz', 'daily_mission_quiz', 'quiz_completed', 'daily_task_quiz'].includes(type)) {
                merged['quiz_completed'] = true;
                merged['home_daily_quiz'] = true;
                merged['daily_quiz'] = true;
                merged['explore_quiz'] = true;
                merged['daily_mission_quiz'] = true;
                merged['daily_task_quiz'] = true;
              }
              if (['daily_login', 'streak_checkin', 'daily_checkin', 'home_daily_streak'].includes(type)) {
                merged['daily_login'] = true;
                merged['streak_checkin'] = true;
                merged['daily_checkin'] = true;
                merged['home_daily_streak'] = true;
              }
              if (['roadmap_task', 'roadmap_completed', 'phase_completed', 'home_daily_roadmap'].includes(type)) {
                merged['roadmap_completed'] = true;
                merged['roadmap_task'] = true;
                merged['phase_completed'] = true;
                merged['home_daily_roadmap'] = true;
              }
            }
          });
        }
      }

      // Check roadmap service state directly for today's roadmap activity
      if (roadmapService.hasCompletedAnyRoadmapActivityToday()) {
        merged['roadmap_completed'] = true;
        merged['roadmap_task'] = true;
        merged['phase_completed'] = true;
        merged['home_daily_roadmap'] = true;
      }

      setLocalCompleted(merged);
    } catch (err) {
      console.warn('DailyChallenges database/storage load error:', err);
    }
  }, [currentDateStr, user?.id]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  // Instantly re-check and refresh challenge status on screen focus
  useFocusEffect(
    useCallback(() => {
      loadState();
      if (refreshGamification) {
        refreshGamification().catch(() => {});
      }
    }, [loadState, refreshGamification])
  );

  // Realtime Supabase subscription for instant live updates!
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`daily-challenges-realtime-${user.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coin_transactions',
          filter: `student_id=eq.${user.id}`,
        },
        () => {
          loadState();
          if (refreshGamification) {
            refreshGamification().catch(() => {});
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_wallets',
          filter: `student_id=eq.${user.id}`,
        },
        () => {
          if (refreshGamification) {
            refreshGamification().catch(() => {});
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, loadState, refreshGamification]);

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
      const globalKey = `@feedx_daily_challenges_${currentDateStr}`;
      const userKey = user?.id ? `@feedx_daily_challenges_${user.id}_${currentDateStr}` : null;
      AsyncStorage.setItem(globalKey, JSON.stringify(updated)).catch(() => {});
      if (userKey) {
        AsyncStorage.setItem(userKey, JSON.stringify(updated)).catch(() => {});
      }
    }
  }, [transactions, currentDateStr, user?.id]);

  const challenges = useMemo(() => {
    const todayTypes = new Set(
      transactions.filter((t) => isToday(t)).map((t) => t.activity_type)
    );

    return [
      {
        id: 'daily_login',
        categoryTag: 'DAILY STREAK',
        reward: '+10 Tokens',
        tagColor: '#F59E0B',
        title: 'Daily Streak Check-in',
        subtitle: 'Check in today to maintain your daily streak.',
        tokens: 10,
        completed: Boolean(
          todayTypes.has('daily_login') ||
          todayTypes.has('streak_checkin') ||
          todayTypes.has('daily_checkin') ||
          todayTypes.has('home_daily_streak') ||
          localCompleted['daily_login'] ||
          localCompleted['streak_checkin'] ||
          localCompleted['daily_checkin'] ||
          (streak?.last_active_date && (streak.last_active_date.startsWith(currentDateStr) || isToday({ created_at: streak.last_active_date })))
        ),
        actionText: 'Check In',
        iconBoxBg: '#064E3B',
        btnBg: '#059669',
        icon: <Ionicons name="checkmark-circle" size={rs(20)} color="#10B981" />,
      },
      {
        id: 'resource_read',
        categoryTag: 'QUICK LEARN',
        reward: '+50 Tokens',
        tagColor: '#10B981',
        title: selectedLesson ? selectedLesson.title : 'Mobile App Development',
        subtitle: 'Read 1 core technical concept and expand skills.',
        tokens: 50,
        completed: Boolean(
          todayTypes.has('home_daily_quick_learn') ||
          todayTypes.has('daily_mission_quick_learn') ||
          todayTypes.has('daily_quick_learn') ||
          todayTypes.has('explore_quick_learn') ||
          todayTypes.has('quick_learn') ||
          todayTypes.has('resource_read') ||
          todayTypes.has('lesson_completed') ||
          localCompleted['resource_read'] ||
          localCompleted['home_daily_quick_learn'] ||
          localCompleted['explore_quick_learn'] ||
          localCompleted['daily_quick_learn'] ||
          localCompleted['quick_learn'] ||
          localCompleted['daily_mission_quick_learn']
        ),
        actionText: 'Start (2m)',
        iconBoxBg: '#064E3B',
        btnBg: '#059669',
        icon: <Ionicons name="book-outline" size={rs(19)} color="#FFFFFF" />,
      },
      {
        id: 'quiz_completed',
        categoryTag: 'DAILY QUIZ',
        reward: '+50 Tokens',
        tagColor: '#A855F7',
        title: selectedQuiz ? `${selectedQuiz.title} Quiz` : 'Mobile App Development Challenge Quiz',
        subtitle: 'Test your understanding with a quick 10-question quiz.',
        tokens: 50,
        completed: Boolean(
          todayTypes.has('home_daily_quiz') ||
          todayTypes.has('daily_quiz') ||
          todayTypes.has('daily_mission_quiz') ||
          todayTypes.has('explore_quiz') ||
          todayTypes.has('quiz_completed') ||
          todayTypes.has('daily_task_quiz') ||
          localCompleted['quiz_completed'] ||
          localCompleted['home_daily_quiz'] ||
          localCompleted['explore_quiz'] ||
          localCompleted['daily_quiz'] ||
          localCompleted['daily_mission_quiz'] ||
          localCompleted['daily_task_quiz']
        ),
        actionText: 'Take Quiz',
        iconBoxBg: '#581C87',
        btnBg: '#7C3AED',
        icon: <MaterialCommunityIcons name="help-circle-outline" size={rs(20)} color="#FFFFFF" />,
      },
      {
        id: 'roadmap_completed',
        categoryTag: 'CAREER PATH',
        reward: '+40 Tokens',
        tagColor: '#38BDF8',
        title: 'Advance Career Roadmap',
        subtitle: 'Complete 1 roadmap milestone for your track.',
        tokens: 40,
        completed: Boolean(
          todayTypes.has('roadmap_completed') ||
          todayTypes.has('roadmap_task') ||
          todayTypes.has('phase_completed') ||
          todayTypes.has('home_daily_roadmap') ||
          localCompleted['roadmap_completed'] ||
          localCompleted['roadmap_task'] ||
          localCompleted['phase_completed'] ||
          localCompleted['home_daily_roadmap']
        ),
        actionText: 'Continue',
        iconBoxBg: '#0369A1',
        btnBg: '#0284C7',
        icon: <Ionicons name="map-outline" size={rs(19)} color="#FFFFFF" />,
      },
    ];
  }, [transactions, localCompleted, selectedLesson, selectedQuiz, currentDateStr, streak?.last_active_date]);

  const completedCount = challenges.filter((c) => c.completed).length;
  const progressPercent = Math.round((completedCount / challenges.length) * 100);
  const earnedTokens = challenges.filter((c) => c.completed).reduce((acc, c) => acc + c.tokens, 0);
  const isAllCompleted = completedCount === challenges.length;

  const handleTaskAction = async (challenge: typeof challenges[0]) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    if (challenge.completed) {
      Alert.alert('Task Completed! ✅', 'Points have already been awarded for this activity today.');
      return;
    }

    if (challenge.id === 'daily_login') {
      setClaiming(challenge.id);
      try {
        const updatedLocal = { ...localCompleted, daily_login: true, streak_checkin: true };
        setLocalCompleted(updatedLocal);
        const globalKey = `@feedx_daily_challenges_${currentDateStr}`;
        const userKey = user?.id ? `@feedx_daily_challenges_${user.id}_${currentDateStr}` : null;
        AsyncStorage.setItem(globalKey, JSON.stringify(updatedLocal)).catch(() => {});
        if (userKey) {
          AsyncStorage.setItem(userKey, JSON.stringify(updatedLocal)).catch(() => {});
        }

        const res = await completeDailyLogin();
        if (res.success && !res.already_completed) {
          // Handled cleanly by global RewardEarnedPopup
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
        router.push({ pathname: '/quick-learn-detail' as any, params: { id: selectedLesson.id, source: 'daily_mission', isDaily: 'true' } });
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
        router.push({ pathname: '/daily-quiz' as any, params: { quizId: selectedQuiz.id, source: 'daily_mission', isDaily: 'true' } });
      } else {
        router.push({ pathname: '/daily-quiz' as any, params: { source: 'daily_mission', isDaily: 'true' } });
      }
      return;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#0C101D' : '#FFFFFF', borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }]}>
      {/* Header Matching Reference Screenshot #2 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.orangeTargetBox}>
            <MaterialCommunityIcons name="target" size={rs(20)} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.headerTitleRow}>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                Today's Missions
              </Text>
              <View style={styles.liveGreenDot} />
            </View>
            <Text style={[styles.resetCountdownText, { color: colors.textMuted }]}>
              {resetCountdown}
            </Text>
          </View>
        </View>

        {/* Tokens Pill Badge (e.g. ✦ 10/150 Tokens) */}
        <View style={styles.xpPill}>
          <MaterialCommunityIcons name="star-four-points" size={rs(11)} color="#FBBF24" style={{ marginRight: 4 }} />
          <Text style={styles.xpPillText}>
            {earnedTokens}/150 Tokens
          </Text>
        </View>
      </View>

      {/* Progress Meta & Track */}
      {showSummaryProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressMetaRow}>
            <Text style={[styles.progressMetaText, { color: colors.textPrimary }]}>
              {completedCount} of {challenges.length} Tasks Completed
            </Text>
            <Text style={styles.progressPercentText}>
              {progressPercent}%
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
            <LinearGradient
              colors={['#F59E0B', '#38BDF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.fill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>
      )}

      {/* 4 Exact Mission Cards */}
      <View style={styles.taskList}>
        {/* Victory Banner (shown when all 4 are completed) */}
        {isAllCompleted && (
          <View style={[styles.victoryCard, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
            <View style={styles.victoryHeader}>
              <View style={styles.victoryIconBox}>
                <Ionicons name="sparkles" size={20} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.victoryTitle}>All Today's Missions Complete!</Text>
                <Text style={[styles.victorySub, { color: colors.textMuted }]}>
                  You've earned the full +150 Tokens today and maintained your streak.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.shareVictoryBtn}
              onPress={async () => {
                try {
                  await Share.share({
                    message: `🎯 I completed all today's missions on FEEDX! Earned 150 Tokens and extended my learning streak. 🚀 #FEEDX`,
                  });
                } catch (_) {}
              }}
            >
              <Ionicons name="share-social-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.shareVictoryText}>Share Victory 🚀</Text>
            </TouchableOpacity>
          </View>
        )}

        {challenges.map((c) => (
          <View
            key={c.id}
            style={[
              styles.missionCard,
              {
                backgroundColor: isDark ? '#111827' : '#F8FAFC',
                borderColor: c.completed
                  ? (isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.35)')
                  : (isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'),
              },
            ]}
          >
            {/* Left Icon Box */}
            <View style={[styles.missionIconBox, { backgroundColor: c.iconBoxBg }]}>
              {c.icon}
            </View>

            {/* Middle Content Column */}
            <View style={styles.missionMiddleCol}>
              <Text style={[styles.categoryTagText, { color: c.tagColor }]}>
                {c.categoryTag} ★ {c.reward}
              </Text>
              <Text style={[styles.missionTitleText, { color: colors.textPrimary }]} numberOfLines={2}>
                {c.title}
              </Text>
              <Text style={[styles.missionSubtitleText, { color: colors.textMuted }]} numberOfLines={2}>
                {c.subtitle}
              </Text>
            </View>

            {/* Right Action Button */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                c.completed
                  ? styles.doneBtn
                  : [styles.pendingBtn, { backgroundColor: c.btnBg }],
              ]}
              disabled={claiming === c.id || c.completed}
              onPress={() => handleTaskAction(c)}
              delayPressIn={0}
              activeOpacity={c.completed ? 1 : 0.7}
            >
              {claiming === c.id ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : c.completed ? (
                <View style={styles.doneBtnContent}>
                  <Text style={styles.doneBtnText}>✓ Done</Text>
                </View>
              ) : (
                <Text style={styles.pendingBtnText}>{c.actionText}</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: rs(16),
    marginVertical: rs(10),
    borderRadius: rs(18),
    padding: rs(14),
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: rs(12),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: rs(8),
  },
  orangeTargetBox: {
    width: rs(38),
    height: rs(38),
    borderRadius: rs(10),
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(10),
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: rf(15),
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  liveGreenDot: {
    width: rs(5),
    height: rs(5),
    borderRadius: rs(2.5),
    backgroundColor: '#10B981',
    marginLeft: rs(5),
  },
  resetCountdownText: {
    fontSize: rf(11),
    fontWeight: '500',
    marginTop: rs(2),
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B13',
    borderWidth: 1,
    borderColor: '#78350F',
    borderRadius: rs(16),
    paddingHorizontal: rs(10),
    paddingVertical: rs(5),
  },
  xpPillText: {
    color: '#FBBF24',
    fontSize: rf(11.5),
    fontWeight: '700',
  },
  progressContainer: {
    marginBottom: rs(12),
  },
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs(6),
  },
  progressMetaText: {
    fontSize: rf(11.5),
    fontWeight: '600',
  },
  progressPercentText: {
    fontSize: rf(12),
    fontWeight: '800',
    color: '#F59E0B',
  },
  progressTrack: {
    height: rs(5),
    borderRadius: rs(2.5),
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: rs(2.5),
  },
  taskList: {
    gap: rs(10),
  },
  victoryCard: {
    padding: rs(12),
    borderRadius: rs(14),
    borderWidth: 1,
    marginBottom: rs(4),
    gap: rs(8),
  },
  victoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(8),
  },
  victoryIconBox: {
    width: rs(32),
    height: rs(32),
    borderRadius: rs(10),
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  victoryTitle: {
    fontSize: rf(12.5),
    fontWeight: '800',
    color: '#10B981',
  },
  victorySub: {
    fontSize: rf(10.5),
    fontWeight: '500',
    marginTop: rs(2),
  },
  shareVictoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: rs(8),
    borderRadius: rs(10),
  },
  shareVictoryText: {
    color: '#FFFFFF',
    fontSize: rf(11),
    fontWeight: '800',
  },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rs(12),
    borderRadius: rs(14),
    borderWidth: 1,
  },
  missionIconBox: {
    width: rs(38),
    height: rs(38),
    borderRadius: rs(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionMiddleCol: {
    flex: 1,
    marginHorizontal: rs(10),
  },
  categoryTagText: {
    fontSize: rf(9.5),
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: rs(2),
  },
  missionTitleText: {
    fontSize: rf(13.5),
    fontWeight: '700',
    lineHeight: rf(17),
  },
  missionSubtitleText: {
    fontSize: rf(11),
    fontWeight: '400',
    lineHeight: rf(15),
    marginTop: rs(2),
  },
  actionBtn: {
    minWidth: rs(74),
    paddingHorizontal: rs(10),
    paddingVertical: rs(6),
    borderRadius: rs(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtn: {
    backgroundColor: 'rgba(6, 78, 59, 0.3)',
    borderWidth: 1,
    borderColor: '#059669',
  },
  doneBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#34D399',
    fontSize: rf(11.5),
    fontWeight: '700',
  },
  pendingBtn: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pendingBtnText: {
    color: '#FFFFFF',
    fontSize: rf(11.5),
    fontWeight: '700',
  },
});
