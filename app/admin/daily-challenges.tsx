import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/context/ThemeContext';
import { adminCreateChallenge } from '@/services/dailyChallengeService';
import { supabase } from '@/lib/supabase';

export default function AdminDailyChallengesScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Programming');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [xpReward, setXpReward] = useState('20');
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    loadChallengesList();
  }, []);

  const loadChallengesList = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setChallenges(data);
      }
    } catch (e) {
      console.warn('Admin load challenges error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async () => {
    if (!title || !question || !correctAnswer) {
      Alert.alert('Required Fields Missing', 'Please fill in Title, Question, and Correct Answer.');
      return;
    }

    setSubmitting(true);
    try {
      const optionsArray = [optionA, optionB, optionC, optionD].filter((opt) => opt.trim() !== '');

      const res = await adminCreateChallenge({
        title,
        description: description || title,
        category,
        challenge_type: 'mcq',
        difficulty,
        xp_reward: parseInt(xpReward) || 20,
        question,
        options: optionsArray.length > 0 ? optionsArray : ['Option A', 'Option B'],
        correct_answer: correctAnswer,
        explanation: explanation || 'Standard challenge explanation.',
        status: 'Published',
      });

      if (res.success) {
        Alert.alert('Success! 🎉', 'Daily Challenge created and published successfully!');
        setShowCreateModal(false);
        setTitle('');
        setQuestion('');
        setCorrectAnswer('');
        loadChallengesList();
      } else {
        Alert.alert('Creation Failed', res.message || 'Unable to create challenge.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Super Admin — Daily Challenges</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>Create, target, schedule & analyze challenges</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowCreateModal(!showCreateModal)}
        >
          <Ionicons name={showCreateModal ? 'close' : 'add'} size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Create Challenge Form Toggle */}
        {showCreateModal && (
          <GlassCard style={styles.formCard}>
            <Text style={[styles.formTitle, { color: colors.textPrimary }]}>Create New Challenge</Text>

            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.cardBorder }]}
              placeholder="Challenge Title (e.g. Solve Java Array Problem)"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.cardBorder }]}
              placeholder="Description"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
            />

            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.cardBorder }]}
              placeholder="Question Prompt"
              placeholderTextColor={colors.textMuted}
              value={question}
              onChangeText={setQuestion}
              multiline
            />

            <Text style={[styles.label, { color: colors.textMuted }]}>MCQ Options</Text>
            <View style={{ gap: 6 }}>
              <TextInput style={[styles.input, { color: colors.textPrimary, borderColor: colors.cardBorder }]} placeholder="Option A" placeholderTextColor={colors.textMuted} value={optionA} onChangeText={setOptionA} />
              <TextInput style={[styles.input, { color: colors.textPrimary, borderColor: colors.cardBorder }]} placeholder="Option B" placeholderTextColor={colors.textMuted} value={optionB} onChangeText={setOptionB} />
              <TextInput style={[styles.input, { color: colors.textPrimary, borderColor: colors.cardBorder }]} placeholder="Option C" placeholderTextColor={colors.textMuted} value={optionC} onChangeText={setOptionC} />
              <TextInput style={[styles.input, { color: colors.textPrimary, borderColor: colors.cardBorder }]} placeholder="Option D" placeholderTextColor={colors.textMuted} value={optionD} onChangeText={setOptionD} />
            </View>

            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.cardBorder, marginTop: 6 }]}
              placeholder="Correct Answer (Exact Match)"
              placeholderTextColor={colors.textMuted}
              value={correctAnswer}
              onChangeText={setCorrectAnswer}
            />

            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.cardBorder }]}
              placeholder="Concept Explanation"
              placeholderTextColor={colors.textMuted}
              value={explanation}
              onChangeText={setExplanation}
              multiline
            />

            <TouchableOpacity style={styles.createBtn} onPress={handleCreateChallenge} disabled={submitting}>
              {submitting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.createBtnText}>Publish Challenge →</Text>}
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* Existing Challenges List */}
        <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>PUBLISHED & SCHEDULED CHALLENGES ({challenges.length})</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 30 }} />
        ) : (
          challenges.map((c) => (
            <View key={c.id} style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={styles.badgeCategory}>{c.category}</Text>
                  <Text style={styles.badgeDiff}>{c.difficulty}</Text>
                  <Text style={styles.statusPublished}>{c.status}</Text>
                </View>
                <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{c.title}</Text>
                <Text style={[styles.itemQuestion, { color: colors.textSecondary }]} numberOfLines={2}>{c.question}</Text>
              </View>

              <View style={styles.xpBox}>
                <Text style={styles.xpText}>+{c.xp_reward} XP</Text>
              </View>
            </View>
          ))
        )}
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
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100, gap: 14 },
  formCard: { padding: 16, gap: 10 },
  formTitle: { fontSize: 15, fontWeight: '900', marginBottom: 4 },
  input: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, fontSize: 12 },
  label: { fontSize: 11, fontWeight: '800', marginTop: 4 },
  createBtn: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  createBtnText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  sectionHeading: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  itemCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 16, borderWidth: 1, gap: 10 },
  badgeCategory: { fontSize: 9, fontWeight: '900', color: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeDiff: { fontSize: 9, fontWeight: '800', color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  statusPublished: { fontSize: 9, fontWeight: '900', color: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  itemTitle: { fontSize: 13, fontWeight: '800' },
  itemQuestion: { fontSize: 11, marginTop: 2 },
  xpBox: { backgroundColor: 'rgba(16,185,129,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  xpText: { fontSize: 11, fontWeight: '900', color: '#10B981' },
});
