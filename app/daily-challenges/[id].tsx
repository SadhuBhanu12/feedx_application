import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import GlassCard from '@/components/ui/GlassCard';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import {
  getTodayChallenge,
  submitChallengeAttempt,
  DailyChallenge,
  ChallengeAttemptResult,
} from '@/services/dailyChallengeService';

export default function ChallengeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { user, setUser } = useUser();
  const { colors, isDark } = useTheme();

  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 min timer
  const [result, setResult] = useState<ChallengeAttemptResult | null>(null);

  useEffect(() => {
    loadChallenge();
  }, [params.id]);

  useEffect(() => {
    if (secondsRemaining <= 0 || result) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining, result]);

  const loadChallenge = async () => {
    setLoading(true);
    try {
      const data = await getTodayChallenge(user?.id);
      setChallenge(data);
      if (data?.estimated_minutes) {
        setSecondsRemaining(data.estimated_minutes * 60);
      }
    } catch (e) {
      console.warn('Load challenge error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge) return;
    const answerToSubmit = selectedOption || textAnswer;

    if (!answerToSubmit) {
      Alert.alert('Answer Required', 'Please select or enter an answer before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitChallengeAttempt(
        challenge.id,
        user?.id || '',
        answerToSubmit,
        (challenge.estimated_minutes * 60) - secondsRemaining
      );

      setResult(res);

      if (res.isCorrect && setUser && user) {
        setUser({
          ...user,
          gold_coins: (user.gold_coins || 0) + res.xpEarned,
          coins: (user.coins || 0) + res.xpEarned,
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to submit attempt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (loading || !challenge) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ color: colors.textMuted, marginTop: 12, fontSize: 13 }}>Loading Challenge Details...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}

      {/* Header Bar */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{challenge.category}</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>{challenge.difficulty} • +{challenge.xp_reward} XP</Text>
        </View>

        {/* Live Timer */}
        <View style={[styles.timerBadge, secondsRemaining < 60 && { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: '#EF4444' }]}>
          <Ionicons name="timer-outline" size={14} color={secondsRemaining < 60 ? '#EF4444' : '#F59E0B'} />
          <Text style={[styles.timerText, secondsRemaining < 60 && { color: '#EF4444' }]}>{formatTimer(secondsRemaining)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Question & Instructions Card */}
        <GlassCard style={styles.card}>
          <Text style={[styles.challengeTitle, { color: colors.textPrimary }]}>{challenge.title}</Text>
          <Text style={[styles.challengeDesc, { color: colors.textSecondary }]}>{challenge.description}</Text>

          {/* Optional Code Snippet */}
          {challenge.code_snippet && (
            <View style={styles.codeSnippetBox}>
              <Text style={styles.codeSnippetText}>{challenge.code_snippet}</Text>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          <Text style={[styles.questionText, { color: colors.textPrimary }]}>{challenge.question}</Text>

          {/* Options List */}
          {challenge.options && challenge.options.length > 0 && (
            <View style={{ gap: 8, marginTop: 8 }}>
              {challenge.options.map((opt) => {
                const isSelected = selectedOption === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    disabled={!!result}
                    style={[
                      styles.optionBox,
                      { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC', borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' },
                      isSelected && { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6' },
                    ]}
                    onPress={() => {
                      try {
                        Haptics.selectionAsync().catch(() => {});
                      } catch {}
                      setSelectedOption(opt);
                    }}
                  >
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={isSelected ? '#3B82F6' : colors.textMuted}
                    />
                    <Text style={[styles.optionText, { color: isSelected ? '#3B82F6' : colors.textPrimary }]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Submit Action CTA */}
          {!result ? (
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.submitBtnText}>Submit Challenge</Text>}
            </TouchableOpacity>
          ) : (
            /* RESULT & EXPLANATION OVERLAY */
            <View style={[styles.resultOverlay, { backgroundColor: result.isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', borderColor: result.isCorrect ? '#10B981' : '#EF4444' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name={result.isCorrect ? 'checkmark-circle' : 'close-circle'} size={24} color={result.isCorrect ? '#10B981' : '#EF4444'} />
                <Text style={[styles.resultTitle, { color: result.isCorrect ? '#10B981' : '#EF4444' }]}>
                  {result.isCorrect ? `Challenge Completed! 🎉 +${result.xpEarned} XP Earned` : 'Incorrect Attempt'}
                </Text>
              </View>

              <View style={{ marginVertical: 8 }}>
                <Text style={[styles.explanationLabel, { color: colors.textPrimary }]}>Correct Answer: {result.correctAnswer}</Text>
                <Text style={[styles.explanationText, { color: colors.textSecondary }]}>{result.explanation}</Text>
              </View>

              <TouchableOpacity style={styles.backDashboardBtn} onPress={() => router.back()}>
                <Text style={styles.backDashboardText}>Back to Challenges Dashboard</Text>
              </TouchableOpacity>
            </View>
          )}
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '900' },
  headerSub: { fontSize: 11, fontWeight: '600' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', backgroundColor: 'rgba(245, 158, 11, 0.1)' },
  timerText: { fontSize: 12, fontWeight: '900', color: '#F59E0B' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { padding: 18, gap: 12 },
  challengeTitle: { fontSize: 18, fontWeight: '900' },
  challengeDesc: { fontSize: 13, lineHeight: 20 },
  codeSnippetBox: { backgroundColor: '#020617', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#334155', marginVertical: 6 },
  codeSnippetText: { color: '#38BDF8', fontSize: 11, fontFamily: 'monospace', lineHeight: 18 },
  divider: { height: 1, marginVertical: 4 },
  questionText: { fontSize: 14, fontWeight: '800' },
  optionBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
  optionText: { fontSize: 13, fontWeight: '700' },
  submitBtn: { backgroundColor: '#3B82F6', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  submitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  resultOverlay: { padding: 14, borderRadius: 14, borderWidth: 1, marginTop: 10 },
  resultTitle: { fontSize: 14, fontWeight: '900' },
  explanationLabel: { fontSize: 12, fontWeight: '800', marginTop: 6 },
  explanationText: { fontSize: 12, lineHeight: 18, marginTop: 2 },
  backDashboardBtn: { backgroundColor: '#10B981', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  backDashboardText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
});
