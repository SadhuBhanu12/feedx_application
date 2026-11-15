import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '@/components/ui/GlassCard';
import FeedXIcon from '@/components/ui/FeedXIcon';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { rf, rs } from '@/constants/responsive';
import { supabase } from '@/lib/supabase';

export default function AdminExploreManagerScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  const role = String(user?.role || '').trim().toLowerCase();
  const isAdmin = ['admin', 'super_admin', 'inst_admin', 'college_admin', 'campus_admin'].includes(role);

  useEffect(() => {
    if (!user || !isAdmin) {
      Alert.alert('Access Denied', 'Administrative privileges required.');
      router.replace('/(tabs)');
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  const [title, setTitle] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [category, setCategory] = useState('Web Dev');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [estimatedMinutes, setEstimatedMinutes] = useState('2');
  const [fxReward, setFxReward] = useState('10');
  const [description, setDescription] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePublishLesson = async () => {
    if (!title || !description || !contentMarkdown) {
      Alert.alert('Validation Error', 'Title, description, and content markdown are required.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('quick_learn_lessons').insert({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        branch,
        category,
        difficulty,
        estimated_minutes: parseInt(estimatedMinutes) || 2,
        fx_reward: parseInt(fxReward) || 10,
        short_description: description,
        content_markdown: contentMarkdown,
        is_published: true,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success 🎉', 'Quick Learn Micro-Lesson published in real time!');
        setTitle('');
        setDescription('');
        setContentMarkdown('');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to publish lesson.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Super Admin Content Studio</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>Create & Publish Explore Content</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.formCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <FeedXIcon name="resources" size={22} color="blue" glow={false} />
            <Text style={[styles.cardHeading, { color: colors.textPrimary }]}>Publish Quick Learn Micro-Lesson</Text>
          </View>

          <View style={styles.group}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Lesson Title</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={title} onChangeText={setTitle} placeholder="e.g. What is a REST API?" placeholderTextColor={colors.inputPlaceholder} />
          </View>

          <View style={styles.row}>
            <View style={[styles.group, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Branch</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={branch} onChangeText={setBranch} placeholder="CSE" placeholderTextColor={colors.inputPlaceholder} />
            </View>
            <View style={[styles.group, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={category} onChangeText={setCategory} placeholder="Web Dev" placeholderTextColor={colors.inputPlaceholder} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.group, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Est. Minutes</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={estimatedMinutes} onChangeText={setEstimatedMinutes} keyboardType="numeric" placeholder="2" placeholderTextColor={colors.inputPlaceholder} />
            </View>
            <View style={[styles.group, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>FX Token Reward</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={fxReward} onChangeText={setFxReward} keyboardType="numeric" placeholder="10" placeholderTextColor={colors.inputPlaceholder} />
            </View>
          </View>

          <View style={styles.group}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Short Description</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={description} onChangeText={setDescription} placeholder="Brief summary of the lesson concept..." placeholderTextColor={colors.inputPlaceholder} />
          </View>

          <View style={styles.group}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Content Markdown</Text>
            <TextInput style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} multiline value={contentMarkdown} onChangeText={setContentMarkdown} placeholder="Full lesson markdown explanation..." placeholderTextColor={colors.inputPlaceholder} />
          </View>

          <TouchableOpacity style={styles.publishBtn} onPress={handlePublishLesson} disabled={saving}>
            <Text style={styles.publishBtnText}>{saving ? 'Publishing...' : 'Publish Micro-Lesson →'}</Text>
          </TouchableOpacity>
        </GlassCard>
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
  scrollContent: { padding: rs(20), gap: rs(16), paddingBottom: rs(100) },
  formCard: { padding: rs(18), gap: rs(12) },
  cardHeading: { fontSize: rf(15), fontWeight: '900' },
  group: { gap: rs(6) },
  row: { flexDirection: 'row', gap: rs(10) },
  label: { fontSize: rf(11), fontWeight: '800' },
  input: { height: rs(44), borderRadius: rs(10), paddingHorizontal: rs(12), fontSize: rf(12.5), borderWidth: 1 },
  textArea: { height: rs(120), textAlignVertical: 'top', paddingTop: rs(10) },
  publishBtn: { backgroundColor: '#3B82F6', paddingVertical: rs(12), borderRadius: rs(10), alignItems: 'center', marginTop: rs(8) },
  publishBtnText: { color: '#FFF', fontSize: rf(13), fontWeight: '900' },
});
