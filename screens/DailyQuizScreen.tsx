import React, { useState, useEffect } from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { useGamification } from '@/context/GamificationContext';
import {
  fetchTodayQuiz,
  getOrCreateAttempt,
  saveQuizAnswer,
  submitQuizAttempt,
  DailyQuiz,
  QuizAttempt,
  QuizQuestion
} from '@/services/quizService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DailyQuizScreen() {
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const { refreshGamification } = useGamification();
  const router = useRouter();
  const params = useLocalSearchParams<{ quizId?: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [quiz, setQuiz] = useState<DailyQuiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setLoading(true);
      try {
        const qData = await fetchTodayQuiz(params.quizId);
        if (!qData || !qData.questions || qData.questions.length === 0) {
          if (isMounted) setLoading(false);
          return;
        }

        const userId = user?.id || 'guest_user';
        const att = (await getOrCreateAttempt(userId, qData.id)) || {
          id: `attempt_${Date.now()}`,
          quiz_id: qData.id,
          user_id: userId,
          current_question: 1,
          score: 0,
          status: 'IN_PROGRESS' as const,
          coins_awarded: 0,
        };

        // If attempt already completed today, navigate to results directly!
        if (att.status === 'COMPLETED') {
          router.replace({ pathname: '/daily-quiz-result' as any, params: { attemptId: att.id } });
          return;
        }

        // Restore cached local answers
        const savedAnswers: Record<string, 'A' | 'B' | 'C' | 'D'> = {};
        for (const question of qData.questions) {
          const stored = await AsyncStorage.getItem(`@quiz_answer_${att.id}_${question.id}`);
          if (stored) {
            savedAnswers[question.id] = stored as 'A' | 'B' | 'C' | 'D';
          }
        }

        if (isMounted) {
          setQuiz(qData);
          setAttempt(att);
          setAnswers(savedAnswers);
          // Resume at saved current_question
          const resumeIdx = Math.max(0, Math.min(att.current_question - 1, qData.questions.length - 1));
          setCurrentIndex(resumeIdx);
          setLoading(false);
        }
      } catch (err) {
        console.error('Quiz init error:', err);
        if (isMounted) setLoading(false);
      }
    };

    init();
    return () => { isMounted = false; };
  }, [user?.id, params.quizId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading Today's 10-MCQ Daily Quiz...</Text>
      </View>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', padding: 20 }]}>
        <Ionicons name="calendar-outline" size={48} color="#94A3B8" />
        <Text style={[styles.noQuizTitle, { color: colors.textPrimary }]}>No Quiz Published Today</Text>
        <Text style={styles.noQuizSub}>Check back later! Today's Daily Quiz is being prepared by FEEDX admins.</Text>
        <TouchableOpacity style={styles.backBtnAction} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const questions = quiz.questions;
  const currentQ: QuizQuestion = questions[currentIndex];
  const selectedOpt = answers[currentQ.id];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = async (option: 'A' | 'B' | 'C' | 'D') => {
    if (!attempt || !user?.id) return;
    const newAnswers = { ...answers, [currentQ.id]: option };
    setAnswers(newAnswers);

    // Save answer progress
    await saveQuizAnswer(attempt.id, currentQ.id, user.id, option, currentIndex + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!attempt) return;
    if (Object.keys(answers).length < questions.length) {
      Alert.alert(
        'Unanswered Questions',
        `You have answered ${Object.keys(answers).length} out of ${questions.length} questions. Do you want to submit anyway?`,
        [
          { text: 'Review', style: 'cancel' },
          { text: 'Submit Now', onPress: processSubmission }
        ]
      );
    } else {
      processSubmission();
    }
  };

  const processSubmission = async () => {
    if (!attempt) return;
    setSubmitting(true);
    try {
      const res = await submitQuizAttempt(attempt.id);
      if (res.success) {
        await refreshGamification();
        router.replace({
          pathname: '/daily-quiz-result' as any,
          params: { attemptId: attempt.id }
        });
      } else {
        Alert.alert('Notice', 'Quiz completion failed to sync. Please try submitting again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
        <TouchableOpacity style={{ padding: 4 }} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>🔥 Daily Quiz (10 MCQs)</Text>
        <View style={styles.coinBadge}>
          <FontAwesome5 name="coins" size={12} color="#D97706" style={{ marginRight: 4 }} />
          <Text style={styles.coinBadgeText}>+5 Coins</Text>
        </View>
      </View>

      {/* Progress Bar & Question Counter */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressCounter, { color: colors.textPrimary }]}>
            Question {currentIndex + 1} of {quiz.questions.length}
          </Text>
          <Text style={styles.percentText}>{progress}%</Text>
        </View>
        <View style={[styles.track, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Question Card */}
        <Animated.View 
          key={currentIndex}
          entering={FadeInUp.duration(350)}
          style={[styles.qCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}
        >
          <Text style={[styles.qText, { color: colors.textPrimary }]}>{currentQ.question_text}</Text>

          {/* Options */}
          {(['A', 'B', 'C', 'D'] as const).map((optKey, idx) => {
            const optValue = currentQ[`option_${optKey.toLowerCase()}` as keyof QuizQuestion];
            const isSelected = selectedOpt === optKey;

            return (
              <Animated.View
                key={optKey}
                entering={FadeInDown.delay(150 + idx * 80).duration(250)}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.optionBox,
                    {
                      backgroundColor: isSelected
                        ? 'rgba(245, 158, 11, 0.15)'
                        : isDark ? '#0F172A' : '#F8FAFC',
                      borderColor: isSelected ? '#F59E0B' : isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                  onPress={() => handleSelectOption(optKey)}
                >
                  <View
                    style={[
                      styles.optBadge,
                      {
                        backgroundColor: isSelected ? '#F59E0B' : isDark ? '#1E293B' : '#E2E8F0',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optBadgeText,
                        { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      {optKey}
                    </Text>
                  </View>
                  <Text style={[styles.optText, { color: colors.textPrimary }]}>{optValue}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation Buttons */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopColor: isDark ? '#334155' : '#E2E8F0' }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: isDark ? '#334155' : '#E2E8F0', opacity: currentIndex === 0 ? 0.5 : 1 }]}
          disabled={currentIndex === 0}
          onPress={handlePrev}
        >
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={[styles.navBtnText, { color: colors.textPrimary }]}>Prev</Text>
        </TouchableOpacity>

        {currentIndex === questions.length - 1 ? (
          <TouchableOpacity style={[styles.submitBtn]} disabled={submitting} onPress={handleSubmitQuiz}>
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Quiz 🏆</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: '#F59E0B' }]} onPress={handleNext}>
            <Text style={[styles.navBtnText, { color: '#FFFFFF' }]}>Next</Text>
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 13, marginTop: 12, fontWeight: '600' },
  noQuizTitle: { fontSize: 18, fontWeight: '800', marginTop: 12 },
  noQuizSub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 4, paddingHorizontal: 20 },
  backBtnAction: { marginTop: 20, backgroundColor: '#F59E0B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  backBtnText: { color: '#FFFFFF', fontWeight: '800' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coinBadgeText: { fontSize: 11, fontWeight: '800', color: '#D97706' },
  progressContainer: { paddingHorizontal: 20, paddingTop: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressCounter: { fontSize: 13, fontWeight: '800' },
  percentText: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 4 },
  qCard: { padding: 20, borderRadius: 20, borderWidth: 1 },
  qText: { fontSize: 16, fontWeight: '800', lineHeight: 24, marginBottom: 20 },
  optionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  optBadge: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  optBadgeText: { fontSize: 13, fontWeight: '800' },
  optText: { fontSize: 14, fontWeight: '600', flex: 1 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 4,
  },
  navBtnText: { fontSize: 14, fontWeight: '800' },
  submitBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
});
