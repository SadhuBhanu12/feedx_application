import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '@/store/storage';
import GlassCard from '@/components/ui/GlassCard';
import FeedXIcon from '@/components/ui/FeedXIcon';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { useGamification } from '@/context/GamificationContext';
import { rf, rs } from '@/constants/responsive';
import { exploreService, QuickLearnLesson, ExploreQuiz } from '@/services/exploreService';
import AIRoadmapScreen from '@/screens/AIRoadmapScreen';

const { width } = Dimensions.get('window');
const EXPLORE_CATEGORIES = [
  { name: 'Scholarships', icon: 'school-outline', route: '/(tabs)/opportunities' },
  { name: 'Internships', icon: 'briefcase-outline', route: '/(tabs)/opportunities' },
  { name: 'Jobs', icon: 'account-cash-outline', route: '/(tabs)/opportunities' },
  { name: 'Events', icon: 'calendar-range-outline', route: '/(tabs)/events' },
  { name: 'Competitions', icon: 'trophy-outline', route: '/(tabs)/events' },
  { name: 'Resources', icon: 'book-open-variant-outline', route: '/(tabs)/academics' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const { transactions, refreshGamification } = useGamification();

  const [localCompletedQuizzes, setLocalCompletedQuizzes] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      refreshGamification();

      (async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const completedIds = new Set<string>();

          for (const key of keys) {
            if (key.startsWith('@completed_quiz_')) {
              const parts = key.replace('@completed_quiz_', '');
              if (parts) {
                const subParts = parts.split('_');
                const last = subParts[subParts.length - 1];
                if (last) completedIds.add(last);
                completedIds.add(parts);
              }
            } else if (key.startsWith('@quiz_attempt_')) {
              try {
                const val = await AsyncStorage.getItem(key);
                if (val) {
                  const parsed = JSON.parse(val);
                  if (parsed.status === 'COMPLETED' && parsed.quiz_id) {
                    completedIds.add(parsed.quiz_id);
                  }
                }
              } catch (err) {}
            }
          }

          setLocalCompletedQuizzes(Array.from(completedIds));
        } catch (e) {
          console.warn('[ExploreScreen] Error loading local quiz completions:', e);
        }
      })();
    }, [user?.id, refreshGamification])
  );

  // Helper check for lesson completion
  const checkIsLessonCompleted = useCallback((lessonId: string) => {
    try {
      const keysToCheck = [
        `lesson_completed_${user?.id || 'guest'}_${lessonId}`,
        `lesson_completed__${lessonId}`,
        `lesson_completed_${lessonId}`,
        `lesson_completed_guest_${lessonId}`,
      ];
      for (const k of keysToCheck) {
        if (storage.getBoolean(k)) return true;
      }
    } catch (e) {}

    return transactions.some(t => {
      const type = (t.activity_type || '').toLowerCase();
      const isResourceRead = type === 'resource_read' || type === 'quick_learn';
      const matchesId = t.reference_id === lessonId || 
                        (t.reference_id && String(t.reference_id).includes(lessonId)) ||
                        (t.description && String(t.description).includes(lessonId));
      return isResourceRead && matchesId;
    });
  }, [user?.id, transactions]);

  // Helper check for quiz completion
  const checkIsQuizCompleted = useCallback((quizId: string) => {
    const isLocallyDone = localCompletedQuizzes.includes(quizId) || 
                          localCompletedQuizzes.some(id => id.includes(quizId) || quizId.includes(id));
    const isTxDone = transactions.some(t => {
      const type = (t.activity_type || '').toLowerCase();
      const isQuizCompleted = type === 'quiz_completed' || type === 'explore_quiz' || type === 'daily_quiz';
      const matchesId = t.reference_id === quizId ||
                        (t.reference_id && String(t.reference_id).includes(quizId)) ||
                        (t.description && String(t.description).includes(quizId));
      return isQuizCompleted && matchesId;
    });
    return isLocallyDone || isTxDone;
  }, [localCompletedQuizzes, transactions]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  const [quickLessons, setQuickLessons] = useState<QuickLearnLesson[]>([]);
  const [quizzes, setQuizzes] = useState<ExploreQuiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Debouncing effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    loadExploreData();
  }, [debouncedQuery]);

  const loadExploreData = async () => {
    setLoading(true);
    try {
      const [lessonsData, quizData] = await Promise.all([
        exploreService.getQuickLearnLessons('All', debouncedQuery),
        exploreService.getQuizzes('All'),
      ]);
      setQuickLessons(lessonsData);
      setQuizzes(quizData);
    } catch (e) {
      console.warn('Load explore data error:', e);
    } finally {
      setLoading(false);
    }
  };

  const params = useLocalSearchParams<{ tab?: 'quick' | 'quiz' | 'roadmap' }>();
  const [activeSection, setActiveSection] = useState<'quick' | 'quiz' | 'roadmap'>('quick');
  const [quickFilter, setQuickFilter] = useState<'active' | 'completed'>('active');
  const [quizFilter, setQuizFilter] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    if (params.tab && ['quick', 'quiz', 'roadmap'].includes(params.tab)) {
      setActiveSection(params.tab);
    }
  }, [params.tab]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />}

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.brandBadge, { color: colors.primary }]}>EXPLORE SYSTEM</Text>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>Discover & Learn 👋</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Global Explore Search bar */}
        {activeSection !== 'roadmap' && (
          <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Feather name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search topics, scholarships, internships..."
              placeholderTextColor={colors.inputPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {loading && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />}
          </View>
        )}

        {/* Featured Hubs cards layout */}
        <View style={styles.topActionsGrid}>
          <TouchableOpacity style={[styles.topActionCard, { marginRight: 8 }]} onPress={() => setActiveSection('quick')}>
            <GlassCard style={[styles.topActionInner, activeSection === 'quick' && { borderColor: colors.primary, borderWidth: 2 }]}>
              <FeedXIcon name="resources" size={26} containerSize={44} glow={activeSection === 'quick'} />
              <Text style={[styles.topActionTitle, { color: colors.textPrimary }]}>Quick Learn</Text>
              <Text style={[styles.topActionSub, { color: colors.textMuted }]}>Short micro lessons</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.topActionCard, { marginRight: 8 }]} onPress={() => router.push('/roadmap')}>
            <GlassCard style={[styles.topActionInner, activeSection === 'roadmap' && { borderColor: colors.primary, borderWidth: 2 }]}>
              <FeedXIcon name="roadmap" size={26} containerSize={44} glow={activeSection === 'roadmap'} />
              <Text style={[styles.topActionTitle, { color: colors.textPrimary }]}>Roadmaps</Text>
              <Text style={[styles.topActionSub, { color: colors.textMuted }]}>Structured curriculum</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topActionCard} onPress={() => setActiveSection('quiz')}>
            <GlassCard style={[styles.topActionInner, activeSection === 'quiz' && { borderColor: colors.primary, borderWidth: 2 }]}>
              <FeedXIcon name="quiz" size={26} containerSize={44} glow={activeSection === 'quiz'} />
              <Text style={[styles.topActionTitle, { color: colors.textPrimary }]}>Quiz Zone</Text>
              <Text style={[styles.topActionSub, { color: colors.textMuted }]}>Practice & earn FX</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* SECTION 1: QUICK LEARN */}
        {activeSection === 'quick' && (() => {
          const completedLessons = quickLessons.filter(lesson => checkIsLessonCompleted(lesson.id));
          const activeLessons = quickLessons.filter(lesson => !checkIsLessonCompleted(lesson.id));

          const displayedLessons = quickFilter === 'active' ? activeLessons : completedLessons;

          return (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <FeedXIcon name="resources" size={20} glow={false} />
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Learn</Text>
                </View>
              </View>

              {/* Sub Filter Switcher */}
              <View style={styles.subFilterRow}>
                <TouchableOpacity
                  style={[
                    styles.subFilterPill,
                    { backgroundColor: quickFilter === 'active' ? colors.primary : isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9' },
                    quickFilter === 'active' && { borderColor: colors.primary }
                  ]}
                  onPress={() => setQuickFilter('active')}
                >
                  <Text style={[styles.subFilterText, { color: quickFilter === 'active' ? '#FFF' : colors.textSecondary }]}>
                    Active ({activeLessons.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.subFilterPill,
                    { backgroundColor: quickFilter === 'completed' ? colors.primary : isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9' },
                    quickFilter === 'completed' && { borderColor: colors.primary }
                  ]}
                  onPress={() => setQuickFilter('completed')}
                >
                  <Text style={[styles.subFilterText, { color: quickFilter === 'completed' ? '#FFF' : colors.textSecondary }]}>
                    Completed ({completedLessons.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {displayedLessons.length > 0 ? (
                displayedLessons.map((item, idx) => (
                  <Animated.View key={item.id} entering={FadeInDown.delay(idx * 40).springify()}>
                    <GlassCard style={styles.lessonCard}>
                      <View style={styles.lessonMetaRow}>
                        <Text style={styles.branchTag}>{item.branch}</Text>
                        <Text style={[styles.metaText, { color: colors.textMuted }]}>{item.difficulty} • {item.estimated_minutes} min</Text>
                      </View>

                      <Text style={[styles.lessonTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                      <Text style={[styles.lessonDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                        {item.short_description}
                      </Text>

                      <View style={styles.lessonFooter}>
                        <View style={styles.fxRewardTag}>
                          <Text style={styles.fxRewardText}>+{item.fx_reward} FX</Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.readBtn, { backgroundColor: colors.primary }]}
                          onPress={() => router.push({ pathname: '/quick-learn-detail' as any, params: { id: item.id } })}
                        >
                          <Text style={styles.readBtnText}>{quickFilter === 'active' ? 'Read Lesson →' : 'Review Lesson'}</Text>
                        </TouchableOpacity>
                      </View>
                    </GlassCard>
                  </Animated.View>
                ))
              ) : (
                <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600' }}>
                    No {quickFilter} lessons available.
                  </Text>
                </View>
              )}
            </View>
          );
        })()}

        {/* SECTION 3: QUIZ ZONE */}
        {activeSection === 'quiz' && (() => {
          const completedQuizzes = quizzes.filter(quiz => checkIsQuizCompleted(quiz.id));
          const activeQuizzes = quizzes.filter(quiz => !checkIsQuizCompleted(quiz.id));

          const displayedQuizzes = quizFilter === 'active' ? activeQuizzes : completedQuizzes;

          return (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <FeedXIcon name="quiz" size={20} glow={false} />
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quiz Zone</Text>
                </View>
              </View>

              {/* Sub Filter Switcher */}
              <View style={styles.subFilterRow}>
                <TouchableOpacity
                  style={[
                    styles.subFilterPill,
                    { backgroundColor: quizFilter === 'active' ? colors.primary : isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9' },
                    quizFilter === 'active' && { borderColor: colors.primary }
                  ]}
                  onPress={() => setQuizFilter('active')}
                >
                  <Text style={[styles.subFilterText, { color: quizFilter === 'active' ? '#FFF' : colors.textSecondary }]}>
                    Active ({activeQuizzes.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.subFilterPill,
                    { backgroundColor: quizFilter === 'completed' ? colors.primary : isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9' },
                    quizFilter === 'completed' && { borderColor: colors.primary }
                  ]}
                  onPress={() => setQuizFilter('completed')}
                >
                  <Text style={[styles.subFilterText, { color: quizFilter === 'completed' ? '#FFF' : colors.textSecondary }]}>
                    Completed ({completedQuizzes.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {displayedQuizzes.length > 0 ? (
                displayedQuizzes.map((quiz, idx) => (
                  <Animated.View key={quiz.id} entering={FadeInDown.delay(idx * 40).springify()}>
                    <GlassCard style={styles.quizCard}>
                      <View style={styles.lessonMetaRow}>
                        <Text style={[styles.branchTag, { color: colors.primary, backgroundColor: colors.primaryLight }]}>{quiz.category}</Text>
                        <Text style={[styles.metaText, { color: colors.textMuted }]}>{quiz.question_count} Questions • ~{quiz.estimated_minutes} min</Text>
                      </View>

                      <Text style={[styles.lessonTitle, { color: colors.textPrimary }]}>{quiz.title}</Text>
                      <Text style={[styles.lessonDesc, { color: colors.textSecondary }]}>{quiz.description}</Text>

                      <View style={styles.lessonFooter}>
                        <View style={styles.fxRewardTag}>
                          <Text style={styles.fxRewardText}>+{quiz.fx_reward} FX</Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.readBtn, { backgroundColor: colors.primary }]}
                          onPress={() => router.push({ pathname: '/daily-quiz' as any, params: { quizId: quiz.id } })}
                        >
                          <Text style={styles.readBtnText}>{quizFilter === 'active' ? 'Start Quiz →' : 'Retake Quiz'}</Text>
                        </TouchableOpacity>
                      </View>
                    </GlassCard>
                  </Animated.View>
                ))
              ) : (
                <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600' }}>
                    No {quizFilter} quizzes available.
                  </Text>
                </View>
              )}
            </View>
          );
        })()}

        {/* SECTION 4: AI CAREER ROADMAP GENERATOR */}
        {activeSection === 'roadmap' && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <FeedXIcon name="roadmap" size={20} glow={false} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>AI Career Roadmap Generator</Text>
              </View>
            </View>
            <AIRoadmapScreen />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingTop: rs(54), paddingHorizontal: rs(20), paddingBottom: rs(14), flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  brandBadge: { fontSize: rf(10), fontWeight: '900', letterSpacing: 1 },
  greeting: { fontSize: rf(18), fontWeight: '900', marginTop: 2 },
  scrollContent: { padding: rs(20), gap: rs(16), paddingBottom: rs(120) },
  searchBox: { height: rs(46), borderRadius: rs(14), flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(14), borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: rs(10), fontSize: rf(12.5) },
  topActionsGrid: { flexDirection: 'row', gap: rs(10) },
  topActionCard: { flex: 1 },
  topActionInner: { padding: rs(12), alignItems: 'center', gap: rs(6) },
  topActionTitle: { fontSize: rf(12), fontWeight: '900' },
  topActionSub: { fontSize: rf(9.5), fontWeight: '600' },
  section: { gap: rs(12), marginTop: rs(6) },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: rf(15), fontWeight: '900' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: { width: (width - 50) / 3, paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1 },
  categoryLabel: { fontSize: 10, fontWeight: '800', marginTop: 6 },
  lessonCard: { padding: rs(16), gap: rs(8) },
  lessonMetaRow: { flexDirection: 'row', alignItems: 'center', gap: rs(8) },
  branchTag: { fontSize: rf(9.5), fontWeight: '900', color: '#60A5FA', backgroundColor: 'rgba(96, 165, 250, 0.12)', paddingHorizontal: rs(8), paddingVertical: rs(3), borderRadius: rs(6) },
  metaText: { fontSize: rf(10.5), fontWeight: '600' },
  lessonTitle: { fontSize: rf(15), fontWeight: '900' },
  lessonDesc: { fontSize: rf(12), lineHeight: 18 },
  lessonFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: rs(6) },
  fxRewardTag: { backgroundColor: 'rgba(255, 212, 42, 0.15)', paddingHorizontal: rs(10), paddingVertical: rs(4), borderRadius: rs(6) },
  fxRewardText: { fontSize: rf(11), fontWeight: '900', color: '#F59E0B' },
  readBtn: { paddingHorizontal: rs(14), paddingVertical: rs(7), borderRadius: rs(8) },
  readBtnText: { color: '#FFF', fontSize: rf(11), fontWeight: '900' },
  quizCard: { padding: rs(16), gap: rs(8) },
  emptyBox: { padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  subFilterRow: { flexDirection: 'row', gap: rs(8), marginBottom: rs(6) },
  subFilterPill: { paddingHorizontal: rs(12), paddingVertical: rs(6), borderRadius: rs(20), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  subFilterText: { fontSize: rf(11), fontWeight: '800' },
});
