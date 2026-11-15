import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { useGamification } from '@/context/GamificationContext';
import { OFFICIAL_REWARDS } from '@/constants/rewardConfig';
import { getCalendarDateString } from '@/services/gamificationService';
import { supabase } from '@/lib/supabase';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function DailyQuizResultScreen() {
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { showRewardModal, triggerReward } = useGamification();
  const router = useRouter();
  const params = useLocalSearchParams();
  const attemptId = params.attemptId as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const rewardTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loadResult = async () => {
      if (!attemptId && !user?.id) return;
      setLoading(true);
      try {
        let attData = null;
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

        if (attemptId) {
          if (isUuid(attemptId)) {
            const { data } = await supabase
              .from('daily_quiz_attempts')
              .select('*')
              .eq('id', attemptId)
              .maybeSingle();
            attData = data;
          }

          if (!attData) {
            const cached = await AsyncStorage.getItem(`@quiz_attempt_${attemptId}`);
            if (cached) {
              attData = JSON.parse(cached);
            }
          }
        } else if (user?.id) {
          const today = new Date().toISOString().split('T')[0];
          const { data: qData } = await supabase
            .from('daily_quizzes')
            .select('id')
            .eq('quiz_date', today)
            .maybeSingle();

          if (qData && isUuid(qData.id) && isUuid(user.id)) {
            const { data } = await supabase
              .from('daily_quiz_attempts')
              .select('*')
              .eq('user_id', user.id)
              .eq('quiz_id', qData.id)
              .maybeSingle();
            attData = data;
          }

          if (!attData) {
            const keys = await AsyncStorage.getAllKeys();
            const attemptKeys = keys.filter((k: string) => k.startsWith('@quiz_attempt_'));
            if (attemptKeys.length > 0) {
              attemptKeys.sort();
              const latestKey = attemptKeys[attemptKeys.length - 1];
              const cached = await AsyncStorage.getItem(latestKey);
              if (cached) {
                attData = JSON.parse(cached);
              }
            }
          }
        }

        if (attData) {
          let qList: any[] = [];
          let aList: any[] = [];

          if (isUuid(attData.quiz_id || '')) {
            const [qRes, aRes] = await Promise.all([
              supabase.from('daily_quiz_questions').select('*').eq('quiz_id', attData.quiz_id).order('question_number', { ascending: true }),
              supabase.from('daily_quiz_answers').select('*').eq('attempt_id', attData.id)
            ]);
            qList = qRes.data || [];
            aList = aRes.data || [];
          }

          if (qList.length === 0) {
            const { fetchTodayQuiz } = require('@/services/quizService');
            const todayQuiz = await fetchTodayQuiz(attData.quiz_id);
            qList = todayQuiz?.questions || [];
          }

          const ansMap: Record<string, string> = {};
          aList.forEach((a: any) => {
            ansMap[a.question_id] = a.selected_option;
          });

          const missingQIds = qList.filter(q => !ansMap[q.id]).map(q => q.id);
          if (missingQIds.length > 0) {
            const prefix = `@quiz_answer_${attData.id}_`;
            const keys = missingQIds.map(qid => `${prefix}${qid}`);
            const batchPairs = await AsyncStorage.multiGet(keys);
            batchPairs.forEach(([k, v]: [string, string | null]) => {
              if (v) {
                const qid = k.startsWith(prefix) ? k.slice(prefix.length) : k.split('_').slice(-1)[0];
                ansMap[qid] = v;
              }
            });
          }

          // Compute accurate correct answers count directly from answers map
          let computedCount = 0;
          qList.forEach((q) => {
            const userAns = String(ansMap[q.id] || '').trim().toUpperCase();
            const correctAns = String(q.correct_option || '').trim().toUpperCase();
            if (userAns && correctAns && userAns === correctAns) {
              computedCount++;
            }
          });

          const paramScore = params.score !== undefined ? Number(params.score) : null;
          const finalScore = Math.max(
            paramScore !== null && !isNaN(paramScore) ? paramScore : 0,
            attData?.score !== undefined && attData?.score !== null ? attData.score : 0,
            computedCount
          );

          if (isMounted) {
            setAttempt({
              ...attData,
              score: finalScore,
            });
            setQuestions(qList);
            setAnswers(ansMap);

            if (user?.id) {
              const quizId = attData.quiz_id || attemptId || 'daily_quiz';
              const correct = finalScore;
              const total = qList.length || 10;
              const todayStr = getCalendarDateString();

              // Mark daily quiz challenge as completed immediately in both user-scoped and global storage
              const userChallengeKey = `@feedx_daily_challenges_${user.id}_${todayStr}`;
              const globalChallengeKey = `@feedx_daily_challenges_${todayStr}`;
              for (const key of [userChallengeKey, globalChallengeKey]) {
                AsyncStorage.getItem(key).then((saved: string | null) => {
                  const map = saved ? JSON.parse(saved) : {};
                  map['daily_quiz'] = true;
                  map['quiz_completed'] = true;
                  map['explore_quiz'] = true;
                  map['home_daily_quiz'] = true;
                  AsyncStorage.setItem(key, JSON.stringify(map)).catch(() => { });
                }).catch(() => { });
              }

              const isDailyQuiz = params.isDaily !== 'false' && params.source !== 'explore';
              const quizRefId = isDailyQuiz
                ? `daily_quiz_${user.id}_${todayStr}`
                : `explore_quiz_${quizId}_${user.id}_${todayStr}`;
              const awardedKey = `@quiz_reward_awarded_${quizRefId}`;
              const attemptAwardedKey = attemptId ? `@quiz_reward_awarded_${attemptId}` : null;

              if (!rewardTriggeredRef.current) {
                rewardTriggeredRef.current = true;
                Promise.all([
                  AsyncStorage.getItem(awardedKey),
                  attemptAwardedKey ? AsyncStorage.getItem(attemptAwardedKey) : Promise.resolve(null),
                ]).then(([alreadyAwardedByRef, alreadyAwardedByAttempt]) => {
                  if (!alreadyAwardedByRef && !alreadyAwardedByAttempt) {
                    AsyncStorage.setItem(awardedKey, 'true').catch(() => { });
                    if (attemptAwardedKey) {
                      AsyncStorage.setItem(attemptAwardedKey, 'true').catch(() => { });
                    }
                    const pointsToAward = isDailyQuiz ? 50 : 15;
                    if (triggerReward) {
                      triggerReward({
                        userId: user.id,
                        activityType: isDailyQuiz ? 'home_daily_quiz' : 'explore_quiz',
                        points: pointsToAward,
                        referenceId: quizRefId,
                        activityName: isDailyQuiz ? "Today's Mission Quiz Completed" : 'Explore Quiz Completed',
                        scoreText: `${correct}/${total} Correct (${Math.round((correct / total) * 100)}%)`,
                        forcePopup: true,
                      });
                    }
                  }
                }).catch(() => { });
              }
            }
          }
        }
      } catch (err) {
        console.error('Error loading quiz result:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadResult();
    return () => { isMounted = false; };
  }, [attemptId, user?.id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  const totalQuestions = questions.length || 15;
  let calculatedCount = 0;
  questions.forEach((q) => {
    const userAns = String(answers[q.id] || '').trim().toUpperCase();
    const correctAns = String(q.correct_option || '').trim().toUpperCase();
    if (userAns && correctAns && userAns === correctAns) {
      calculatedCount++;
    }
  });

  const paramScore = params.score !== undefined ? Number(params.score) : null;
  const correctCount = paramScore !== null && !isNaN(paramScore)
    ? paramScore
    : (attempt?.score !== undefined && attempt?.score !== null
      ? attempt.score
      : calculatedCount);
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isDailyForDisplay = params.isDaily !== 'false' && params.source !== 'explore';
  const expectedReward = isDailyForDisplay ? OFFICIAL_REWARDS.DAILY_QUIZ : OFFICIAL_REWARDS.EXPLORE_QUIZ;
  const tokenReward = (attempt?.coins_awarded && attempt.coins_awarded > 0) ? attempt.coins_awarded : expectedReward;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 12) }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
        <TouchableOpacity style={{ padding: 4 }} onPress={() => router.replace('/(tabs)' as any)}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, flex: 1, marginHorizontal: 8 }]} numberOfLines={1}>Quiz Performance</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Result Hero Card */}
        <View style={[styles.resultCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(245, 158, 11, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Ionicons name="trophy" size={36} color="#F59E0B" />
          </View>
          <Text style={[styles.cardTitle, { color: colors.textPrimary, textAlign: 'center' }]}>Quiz Completed!</Text>

          <Text style={styles.scoreText}>{correctCount} / {totalQuestions}</Text>
          <Text style={styles.percentageText}>{percentage}% Accuracy</Text>

          <View style={styles.coinRewardBox}>
            <Ionicons name="flash" size={16} color="#3B82F6" style={{ marginRight: 6 }} />
            <Text style={styles.coinRewardText}>+{tokenReward} Task Tokens Awarded!</Text>
          </View>
        </View>

        {/* Answer Breakdown */}
        <Text style={[styles.breakdownHeader, { color: colors.textPrimary }]}>Answer Review & Explanations</Text>

        <View style={styles.questionsList}>
          {questions.map((q, idx) => {
            const userAns = String(answers[q.id] || '').trim().toUpperCase();
            const correctOpt = String(q.correct_option || '').trim().toUpperCase();
            const isCorrect = userAns === correctOpt;

            return (
              <Animated.View
                key={q.id}
                entering={FadeInDown.delay(idx * 60).springify()}
                style={[
                  styles.reviewItem,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isCorrect ? '#10B981' : '#EF4444',
                  },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Text style={[styles.qNum, { color: colors.textPrimary }]}>Q{idx + 1}.</Text>
                  <Text style={[styles.qText, { color: colors.textPrimary }]}>{q.question_text}</Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.ansLabel}>Your Answer: <Text style={{ fontWeight: '800', color: isCorrect ? '#10B981' : '#EF4444' }}>Option {userAns || 'None'}</Text></Text>
                  <Text style={styles.ansLabel}>Correct: <Text style={{ fontWeight: '800', color: '#10B981' }}>Option {q.correct_option}</Text></Text>
                </View>

                {q.explanation && (
                  <View style={[styles.expBox, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
                    <Text style={styles.expTitle}>💡 Explanation:</Text>
                    <Text style={[styles.expText, { color: colors.textSecondary }]}>{q.explanation}</Text>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* Action CTA */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopColor: isDark ? '#334155' : '#E2E8F0' }]}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)' as any)}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  resultCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: { fontSize: 20, fontWeight: '900', marginBottom: 6 },
  scoreText: { fontSize: 36, fontWeight: '900', color: '#F59E0B' },
  percentageText: { fontSize: 14, color: '#64748B', fontWeight: '700', marginBottom: 14 },
  coinRewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  coinRewardText: { fontSize: 13, fontWeight: '800', color: '#2563EB' },
  breakdownHeader: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  questionsList: { gap: 12 },
  reviewItem: { padding: 16, borderRadius: 18, borderWidth: 1.5 },
  reviewHeader: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  qNum: { fontSize: 14, fontWeight: '900', color: '#F59E0B' },
  qText: { fontSize: 14, fontWeight: '700', flex: 1 },
  answerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  ansLabel: { fontSize: 12, color: '#64748B' },
  expBox: { padding: 10, borderRadius: 10, marginTop: 4 },
  expTitle: { fontSize: 11, fontWeight: '800', color: '#D97706', marginBottom: 2 },
  expText: { fontSize: 11, lineHeight: 16 },
  bottomBar: { padding: 16, borderTopWidth: 1 },
  homeBtn: { backgroundColor: '#F59E0B', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  homeBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
});

