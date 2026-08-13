import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function AdminQuizManagerScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [quizDate, setQuizDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [quizStatus, setQuizStatus] = useState<string>('published');
  const [questions, setQuestions] = useState<any[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    loadQuizForDate(quizDate);
  }, [quizDate]);

  const loadQuizForDate = async (dateStr: string) => {
    setLoading(true);
    try {
      const { data: quiz } = await supabase
        .from('daily_quizzes')
        .select('*')
        .eq('quiz_date', dateStr)
        .maybeSingle();

      if (quiz) {
        setQuizId(quiz.id);
        setQuizStatus(quiz.status);
        const { data: qData } = await supabase
          .from('daily_quiz_questions')
          .select('*')
          .eq('quiz_id', quiz.id)
          .order('question_number', { ascending: true });

        setQuestions(qData || []);
      } else {
        setQuizId(null);
        setQuizStatus('published');
        // Initialize 10 empty template questions
        const emptyQs = Array.from({ length: 10 }, (_, i) => ({
          question_number: i + 1,
          question_text: '',
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          correct_option: 'A',
          explanation: '',
        }));
        setQuestions(emptyQs);
      }
    } catch (err) {
      console.error('Error loading admin quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuestion = (index: number, field: string, val: string) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: val };
    setQuestions(updated);
  };

  const handleSaveAndPublish = async () => {
    // Validate exactly 10 complete questions
    if (questions.length !== 10) {
      Alert.alert('Publish Error', 'Daily Quiz must contain exactly 10 questions before it can be published.');
      return;
    }

    for (let i = 0; i < 10; i++) {
      const q = questions[i];
      if (!q.question_text || !q.option_a || !q.option_b || !q.option_c || !q.option_d) {
        Alert.alert('Validation Error', `Question #${i + 1} has empty fields. All text and 4 options are required.`);
        return;
      }
    }

    setSaving(true);
    try {
      // 1. Create or Update Quiz Record
      let currentQuizId = quizId;
      if (!currentQuizId) {
        const { data: newQuiz, error: qErr } = await supabase
          .from('daily_quizzes')
          .insert({
            quiz_date: quizDate,
            title: `FEEDX Daily Quiz (${quizDate})`,
            status: 'published',
            total_questions: 10,
            coins_reward: 5,
          })
          .select('id')
          .single();

        if (qErr) throw qErr;
        currentQuizId = newQuiz.id;
        setQuizId(currentQuizId);
      }

      // 2. Upsert Questions
      for (const q of questions) {
        await supabase.from('daily_quiz_questions').upsert(
          {
            quiz_id: currentQuizId,
            question_number: q.question_number,
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_option: q.correct_option,
            explanation: q.explanation || '',
          },
          { onConflict: 'quiz_id,question_number' }
        );
      }

      Alert.alert('🎉 Published Successfully!', `Today's 10-MCQ Daily Quiz for ${quizDate} is now live for students!`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to publish quiz.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      <View style={[styles.header, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Super Admin Quiz Manager</Text>
        <TouchableOpacity style={styles.publishBtnHeader} disabled={saving} onPress={handleSaveAndPublish}>
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.publishBtnText}>Publish 🚀</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Manage Questions ({quizDate})</Text>

          {questions.map((q, idx) => (
            <View key={q.question_number} style={[styles.qFormCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
              <Text style={styles.qFormNumber}>Question #{q.question_number}</Text>

              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: isDark ? '#334155' : '#CBD5E1' }]}
                placeholder="Enter Question Text..."
                placeholderTextColor="#94A3B8"
                value={q.question_text}
                onChangeText={(val) => handleUpdateQuestion(idx, 'question_text', val)}
              />

              <View style={styles.optGrid}>
                {(['a', 'b', 'c', 'd'] as const).map((optKey) => (
                  <View key={optKey} style={styles.optInputRow}>
                    <Text style={styles.optLabel}>{optKey.toUpperCase()}:</Text>
                    <TextInput
                      style={[styles.input, { flex: 1, color: colors.textPrimary, borderColor: isDark ? '#334155' : '#CBD5E1' }]}
                      placeholder={`Option ${optKey.toUpperCase()}`}
                      placeholderTextColor="#94A3B8"
                      value={q[`option_${optKey}`]}
                      onChangeText={(val) => handleUpdateQuestion(idx, `option_${optKey}`, val)}
                    />
                  </View>
                ))}
              </View>

              <View style={styles.correctSelectRow}>
                <Text style={[styles.correctLabel, { color: colors.textPrimary }]}>Correct Option:</Text>
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.optChoice,
                      { backgroundColor: q.correct_option === opt ? '#10B981' : isDark ? '#334155' : '#E2E8F0' },
                    ]}
                    onPress={() => handleUpdateQuestion(idx, 'correct_option', opt)}
                  >
                    <Text style={[styles.optChoiceText, { color: q.correct_option === opt ? '#FFFFFF' : colors.textPrimary }]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: isDark ? '#334155' : '#CBD5E1', marginTop: 8 }]}
                placeholder="Explanation (Optional)..."
                placeholderTextColor="#94A3B8"
                value={q.explanation}
                onChangeText={(val) => handleUpdateQuestion(idx, 'explanation', val)}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  publishBtnHeader: { backgroundColor: '#10B981', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  publishBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  qFormCard: { padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 14 },
  qFormNumber: { fontSize: 14, fontWeight: '900', color: '#F59E0B', marginBottom: 8 },
  input: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, fontSize: 13, marginBottom: 8 },
  optGrid: { gap: 4 },
  optInputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  optLabel: { width: 24, fontSize: 13, fontWeight: '800', color: '#F59E0B' },
  correctSelectRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  correctLabel: { fontSize: 12, fontWeight: '800' },
  optChoice: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  optChoiceText: { fontSize: 13, fontWeight: '800' },
});
