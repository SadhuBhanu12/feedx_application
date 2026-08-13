import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import GlassCard from '@/components/ui/GlassCard';
import FeedXIcon from '@/components/ui/FeedXIcon';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { useGamification } from '@/context/GamificationContext';
import { rf, rs } from '@/constants/responsive';
import { exploreService, QuickLearnLesson } from '@/services/exploreService';

import { supabase } from '@/lib/supabase';

function parseContentMarkdown(raw: string) {
  if (!raw) return { learningText: '', keyPoints: [] };
  
  let learningText = '';
  const keyPoints: string[] = [];

  const learningMatch = raw.match(/###\s*Learning Text\s*\n([\s\S]*?)(?=###\s*Key Points|$)/i);
  if (learningMatch && learningMatch[1]) {
    learningText = learningMatch[1].trim();
  } else {
    learningText = raw.replace(/###\s*/g, '').trim();
  }

  const keyPointsMatch = raw.match(/###\s*Key Points\s*\n([\s\S]*)/i);
  if (keyPointsMatch && keyPointsMatch[1]) {
    const lines = keyPointsMatch[1].split('\n');
    lines.forEach(line => {
      const clean = line.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').trim();
      if (clean) keyPoints.push(clean);
    });
  }

  return { learningText, keyPoints };
}

export default function QuickLearnDetailScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { colors, isDark } = useTheme();
  const { triggerActivity, refreshGamification } = useGamification();
  const params = useLocalSearchParams<{ id?: string }>();

  const [lesson, setLesson] = useState<QuickLearnLesson | null>(null);
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [wrongQueue, setWrongQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [reviewIndex, setReviewIndex] = useState<number>(0);
  const [isReviewPhase, setIsReviewPhase] = useState<boolean>(false);

  React.useEffect(() => {
    let isMounted = true;
    const fetchLesson = async () => {
      setLoading(true);
      const data = await exploreService.getLessonById(params.id || 'ql-1');
      if (isMounted) {
        setLesson(data);
        if (data) {
          const initial = data.knowledge_checks && data.knowledge_checks.length > 0
            ? data.knowledge_checks
            : (data.knowledge_check ? [data.knowledge_check] : []);
          setQuestionsList(initial);
        }
      }

      // Check completion status from DB / cache
      if (user?.id && (params.id || data?.id)) {
        const lessonId = params.id || data?.id || 'ql-1';
        try {
          const { data: progress } = await supabase
            .from('student_lesson_progress')
            .select('completed')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .maybeSingle();

          if (progress?.completed) {
            if (isMounted) {
              setCompleted(true);
              setSubmitted(true);
              setIsCorrect(true);
              const firstQuestion = data?.knowledge_checks?.[0] || data?.knowledge_check;
              if (firstQuestion) {
                setSelectedOption(firstQuestion.correct_option);
              }
            }
          } else {
            // Fallback to local storage
            const localKey = `lesson_completed_${user.id}_${lessonId}`;
            const localDone = require('@/store/storage').storage.getBoolean(localKey);
            if (localDone && isMounted) {
              setCompleted(true);
              setSubmitted(true);
              setIsCorrect(true);
              const firstQuestion = data?.knowledge_checks?.[0] || data?.knowledge_check;
              if (firstQuestion) {
                setSelectedOption(firstQuestion.correct_option);
              }
            }
          }
        } catch (dbErr) {
          console.warn('[QuickLearnDetailScreen] DB progress check warning:', dbErr);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };
    fetchLesson();
    return () => { isMounted = false; };
  }, [params.id, user?.id]);

  const currentQuestion = isReviewPhase ? wrongQueue[reviewIndex] : questionsList[currentQuestionIndex];
  const queuedIncorrectCount = wrongQueue.length;

  const handleAnswerSubmit = async () => {
    if (!lesson || !currentQuestion) return;
    if (!selectedOption) {
      Alert.alert('Selection Required', 'Please select an option to submit your knowledge check.');
      return;
    }

    const checkCorrect = selectedOption === currentQuestion.correct_option;
    setIsCorrect(checkCorrect);
    setSubmitted(true);

    if (checkCorrect) {
      const isLastInMain = !isReviewPhase && currentQuestionIndex === questionsList.length - 1 && wrongQueue.length === 0;
      const isLastInReview = isReviewPhase && reviewIndex === wrongQueue.length - 1;

      if ((isLastInMain || isLastInReview) && !completed) {
        setCompleted(true);
        const rewardAmount = lesson.fx_reward || 10;
        await exploreService.completeLesson(user?.id || '', lesson.id, rewardAmount);

        // Award FX tokens & XP in Gamification Context & Wallet
        try {
          await triggerActivity('resource_read', rewardAmount, rewardAmount, lesson.id);
          await refreshGamification();
        } catch (rewardErr) {
          console.warn('[QuickLearn] Failed to trigger activity:', rewardErr);
        }

        if (setUser && user) {
          const updatedXp = (user.xp_points || user.xp || 0) + rewardAmount;
          setUser({
            ...user,
            xp_points: updatedXp,
            xp: updatedXp,
          });
        }

        Alert.alert('Congratulations! 🎉', `Lesson completed successfully! +${rewardAmount} FX Tokens added to your wallet.`);
      }
    } else {
      // Re-append wrong question to wrongQueue for review at the end!
      setWrongQueue(prev => [...prev, currentQuestion]);
    }
  };

  const handleNextQuestion = () => {
    if (!isReviewPhase) {
      if (currentQuestionIndex < questionsList.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (wrongQueue.length > 0) {
        setIsReviewPhase(true);
        setReviewIndex(0);
      }
    } else {
      if (reviewIndex < wrongQueue.length - 1) {
        setReviewIndex(prev => prev + 1);
      }
    }

    setSelectedOption(null);
    setSubmitted(false);
    setIsCorrect(false);
  };

  const hasMoreQuestions = !isReviewPhase
    ? (currentQuestionIndex < questionsList.length - 1 || wrongQueue.length > 0)
    : (reviewIndex < wrongQueue.length - 1);

  if (loading || !lesson) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textMuted, marginTop: 12, fontSize: 14 }}>Loading Quick Learn Lesson...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />}

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
        >
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{lesson.title}</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>{lesson.branch} • {lesson.difficulty} • {lesson.estimated_minutes} min</Text>
        </View>
        <View style={styles.fxTag}>
          <Text style={styles.fxTagText}>+{lesson.fx_reward} FX</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Lesson Article View */}
        {(() => {
          const { learningText, keyPoints } = parseContentMarkdown(lesson.content_markdown || '');
          
          const CHIP_PALETTES = [
            { bg: isDark ? 'rgba(99, 102, 241, 0.16)' : 'rgba(99, 102, 241, 0.12)', border: '#6366F1', text: isDark ? '#A5B4FC' : '#4F46E5', icon: '#6366F1' },
            { bg: isDark ? 'rgba(16, 185, 129, 0.16)' : 'rgba(16, 185, 129, 0.12)', border: '#10B981', text: isDark ? '#6EE7B7' : '#059669', icon: '#10B981' },
            { bg: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.12)', border: '#F59E0B', text: isDark ? '#FDE68A' : '#D97706', icon: '#F59E0B' },
            { bg: isDark ? 'rgba(168, 85, 247, 0.16)' : 'rgba(168, 85, 247, 0.12)', border: '#A855F7', text: isDark ? '#E9D5FF' : '#7E22CE', icon: '#A855F7' },
            { bg: isDark ? 'rgba(6, 182, 212, 0.16)' : 'rgba(6, 182, 212, 0.12)', border: '#06B6D4', text: isDark ? '#7DD3FC' : '#0284C7', icon: '#06B6D4' },
            { bg: isDark ? 'rgba(236, 72, 153, 0.16)' : 'rgba(236, 72, 153, 0.12)', border: '#EC4899', text: isDark ? '#FBCFE8' : '#BE185D', icon: '#EC4899' },
          ];

          return (
            <GlassCard style={[styles.card, { padding: rs(20), gap: rs(16) }]}>
              {/* Header Category & Time */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ backgroundColor: 'rgba(99, 102, 241, 0.18)', paddingHorizontal: rs(10), paddingVertical: rs(4), borderRadius: rs(6), borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                  <Text style={{ fontSize: rf(11), fontWeight: '900', color: isDark ? '#A5B4FC' : '#4F46E5', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                    {lesson.category}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="clock" size={13} color="#F59E0B" />
                  <Text style={{ fontSize: rf(11), fontWeight: '700', color: '#F59E0B' }}>
                    {lesson.estimated_minutes} min read
                  </Text>
                </View>
              </View>

              {/* Title & Short Description */}
              <View style={{ gap: rs(4) }}>
                <Text style={{ fontSize: rf(18), fontWeight: '900', color: colors.textPrimary, lineHeight: 24 }}>
                  {lesson.title}
                </Text>
                <Text style={{ fontSize: rf(12.5), color: colors.textSecondary, lineHeight: 19 }}>
                  {lesson.short_description}
                </Text>
              </View>

              <View style={{ height: 1, backgroundColor: colors.border }} />

              {/* Core Lesson Text Highlight Callout */}
              {learningText ? (
                <View style={{
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(239, 246, 255, 0.9)',
                  borderLeftWidth: 4,
                  borderLeftColor: '#3B82F6',
                  borderRadius: rs(10),
                  padding: rs(14),
                  gap: rs(8),
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(191, 219, 254, 0.8)'
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Feather name="book-open" size={14} color="#3B82F6" />
                    <Text style={{ fontSize: rf(11.5), fontWeight: '900', color: '#3B82F6', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                      Core Lesson Summary
                    </Text>
                  </View>
                  <Text style={{ fontSize: rf(13.5), lineHeight: 24, color: colors.textPrimary, fontWeight: '500' }}>
                    {learningText}
                  </Text>
                </View>
              ) : null}

              {/* Colorful Key Takeaways Chips */}
              {keyPoints.length > 0 ? (
                <View style={{ gap: rs(10), marginTop: rs(4) }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="key" size={16} color="#F59E0B" />
                    <Text style={{ fontSize: rf(12), fontWeight: '900', color: colors.textPrimary, letterSpacing: 0.5 }}>
                      KEY CONCEPTS & VOCABULARY
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: rs(8) }}>
                    {keyPoints.map((kp, idx) => {
                      const palette = CHIP_PALETTES[idx % CHIP_PALETTES.length];
                      return (
                        <View
                          key={idx}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            backgroundColor: palette.bg,
                            borderColor: palette.border,
                            borderWidth: 1,
                            paddingHorizontal: rs(10),
                            paddingVertical: rs(6),
                            borderRadius: rs(8),
                          }}
                        >
                          <Ionicons name="checkmark-circle" size={14} color={palette.icon} />
                          <Text style={{ fontSize: rf(12), fontWeight: '800', color: palette.text }}>
                            {kp}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : null}
            </GlassCard>
          );
        })()}

        {/* Knowledge Check Section */}
        {currentQuestion && (
          <GlassCard style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <FeedXIcon name="quiz" size={20} color="purple" glow={false} />
                <Text style={[styles.checkHeading, { color: colors.textPrimary }]}>
                  {!isReviewPhase 
                    ? `Knowledge Check (${currentQuestionIndex + 1}/${questionsList.length})` 
                    : `Review Missed (${reviewIndex + 1}/${queuedIncorrectCount})`}
                </Text>
              </View>
              {queuedIncorrectCount > 0 && !isReviewPhase && (
                <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: rs(8), paddingVertical: rs(3), borderRadius: rs(6) }}>
                  <Text style={{ fontSize: rf(11), fontWeight: '800', color: '#EF4444' }}>
                    {queuedIncorrectCount} Incorrect queued for end
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.questionText, { color: colors.textPrimary }]}>{currentQuestion.question_text}</Text>

            {['A', 'B', 'C', 'D'].map((optKey) => {
              const optionText = (currentQuestion as any)[`option_${optKey.toLowerCase()}`];
              const isSelected = selectedOption === optKey;
              const isRightOption = currentQuestion.correct_option === optKey;

              let optionBg = colors.inputBg;
              let optionBorder = colors.border;
              let textColor = colors.textPrimary;

              if (submitted) {
                if (isRightOption) {
                  optionBg = 'rgba(16, 185, 129, 0.15)';
                  optionBorder = '#10B981';
                  textColor = '#10B981';
                } else if (isSelected && !isCorrect) {
                  optionBg = 'rgba(239, 68, 68, 0.15)';
                  optionBorder = '#EF4444';
                  textColor = '#EF4444';
                }
              } else if (isSelected) {
                optionBg = 'rgba(59, 130, 246, 0.15)';
                optionBorder = '#3B82F6';
                textColor = '#3B82F6';
              }

              return (
                <TouchableOpacity
                  key={optKey}
                  disabled={submitted}
                  style={[styles.optionBox, { backgroundColor: optionBg, borderColor: optionBorder }]}
                  onPress={() => setSelectedOption(optKey)}
                >
                  <Text style={[styles.optionKey, { color: textColor }]}>{optKey}</Text>
                  <Text style={[styles.optionText, { color: textColor }]}>{optionText}</Text>
                </TouchableOpacity>
              );
            })}

            {!submitted ? (
              <TouchableOpacity style={styles.submitBtn} onPress={handleAnswerSubmit}>
                <Text style={styles.submitBtnText}>Submit Answer</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ gap: 10, marginTop: 10 }}>
                <View style={[styles.resultBox, { backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)' }]}>
                  <Ionicons name={isCorrect ? 'checkmark-circle' : 'close-circle'} size={22} color={isCorrect ? '#10B981' : '#EF4444'} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.resultTitle, { color: isCorrect ? '#10B981' : '#EF4444' }]}>
                      {isCorrect 
                        ? (!hasMoreQuestions ? `Correct! Lesson Completed 🎉 +${lesson.fx_reward} FX Awarded` : 'Correct! Well done.')
                        : 'Incorrect. Added to your review queue at the end!'}
                    </Text>
                  </View>
                </View>

                {hasMoreQuestions && (
                  <TouchableOpacity style={[styles.submitBtn, { backgroundColor: isCorrect ? '#10B981' : '#3B82F6', marginTop: 4 }]} onPress={handleNextQuestion}>
                    <Text style={styles.submitBtnText}>
                      {!isReviewPhase && currentQuestionIndex === questionsList.length - 1 
                        ? `Start Review (${queuedIncorrectCount} Missed) →` 
                        : 'Next Question →'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Detailed Concept Explanation Box */}
            {(selectedOption !== null || submitted) && currentQuestion.explanation && (
              <View style={[styles.explanationCard, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', marginTop: 14 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Ionicons name="information-circle" size={18} color="#3B82F6" />
                  <Text style={[styles.explanationHeading, { color: '#3B82F6' }]}>Detailed Explanation & Answer Breakdown</Text>
                </View>
                <Text style={[styles.explanationText, { color: colors.textSecondary }]}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}
          </GlassCard>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingTop: rs(54), paddingHorizontal: rs(20), paddingBottom: rs(14), flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1 },
  backBtn: { width: rs(38), height: rs(38), borderRadius: rs(10), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: rf(16), fontWeight: '900' },
  headerSub: { fontSize: rf(11), fontWeight: '600' },
  fxTag: { backgroundColor: 'rgba(255, 212, 42, 0.15)', paddingHorizontal: rs(10), paddingVertical: rs(4), borderRadius: rs(6) },
  fxTagText: { fontSize: rf(11), fontWeight: '900', color: '#F59E0B' },
  scrollContent: { padding: rs(20), gap: rs(16), paddingBottom: rs(100) },
  card: { padding: rs(18), gap: rs(12) },
  description: { fontSize: rf(13), lineHeight: 20, fontWeight: '600' },
  divider: { height: 1, marginVertical: 4 },
  bodyText: { fontSize: rf(12.5), lineHeight: 22 },
  checkHeading: { fontSize: rf(15), fontWeight: '900' },
  questionText: { fontSize: rf(13.5), fontWeight: '800', marginBottom: 4 },
  optionBox: { flexDirection: 'row', alignItems: 'center', padding: rs(12), borderRadius: rs(10), borderWidth: 1, gap: rs(10), marginTop: rs(6) },
  optionKey: { fontSize: rf(13), fontWeight: '900' },
  optionText: { fontSize: rf(12.5), flex: 1, fontWeight: '600' },
  submitBtn: { backgroundColor: '#3B82F6', paddingVertical: rs(12), borderRadius: rs(10), alignItems: 'center', marginTop: rs(10) },
  submitBtnText: { color: '#FFF', fontSize: rf(13), fontWeight: '900' },
  resultBox: { flexDirection: 'row', gap: rs(10), padding: rs(12), borderRadius: rs(10), marginTop: rs(10), alignItems: 'flex-start' },
  resultTitle: { fontSize: rf(13), fontWeight: '900' },
  explanationCard: { padding: rs(12), borderRadius: rs(12), borderWidth: 1 },
  explanationHeading: { fontSize: rf(12), fontWeight: '900' },
  explanationText: { fontSize: rf(11.5), lineHeight: 18, marginTop: 2 },
});
