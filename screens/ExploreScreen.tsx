import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Share,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

import { storage } from '@/store/storage';
import BookmarkButton from '@/components/ui/BookmarkButton';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { useGamification } from '@/context/GamificationContext';
import { rf, rs } from '@/constants/responsive';
import { exploreService, QuickLearnLesson, ExploreQuiz } from '@/services/exploreService';
import { supabase } from '@/lib/supabase';
import { resolveResourceCategory, toggleBookmark, getBookmarks } from '@/services/supabaseService';
import { convertDriveUrlToPdfViewerUrl } from '@/utils/googleDrive';
import AIRoadmapScreen from '@/screens/AIRoadmapScreen';

const { width } = Dimensions.get('window');

const RESOURCE_CATEGORIES = ['All', 'Notes', 'Previous Year Question Papers', 'Syllabus', 'Lab Manual'];

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const { wallet, streak, transactions, refreshGamification } = useGamification();

  const params = useLocalSearchParams<{ tab?: 'quick' | 'quiz' | 'roadmap' | 'resources' }>();
  const [activeSection, setActiveSection] = useState<'quick' | 'quiz' | 'roadmap' | 'resources'>('quick');

  const [localCompletedQuizzes, setLocalCompletedQuizzes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  // Quick Learn & Quiz data
  const [quickLessons, setQuickLessons] = useState<QuickLearnLesson[]>([]);
  const [quizzes, setQuizzes] = useState<ExploreQuiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [quickFilter, setQuickFilter] = useState<'active' | 'completed'>('active');
  const [quizFilter, setQuizFilter] = useState<'active' | 'completed'>('active');

  // Academic Resources data
  const [resources, setResources] = useState<any[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState<boolean>(false);
  const [selectedResourceCategory, setSelectedResourceCategory] = useState<string>('All');
  const [bookmarkedResourceIds, setBookmarkedResourceIds] = useState<Set<string>>(new Set());

  // Listen to router params for tab switching
  useEffect(() => {
    if (params.tab && ['quick', 'quiz', 'roadmap', 'resources'].includes(params.tab)) {
      setActiveSection(params.tab as any);
    }
  }, [params.tab]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load Quick Learn & Quiz on debounced query change
  useEffect(() => {
    loadExploreData();
  }, [debouncedQuery]);

  // Load Resources when resources section is active or query changes
  useEffect(() => {
    if (activeSection === 'resources') {
      loadAcademicResources();
    }
  }, [activeSection, debouncedQuery]);

  useFocusEffect(
    useCallback(() => {
      refreshGamification();
      loadUserBookmarks();

      if (user?.id) {
        exploreService.getUserLessonProgress(user.id).catch(() => {});
      }

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

  const loadUserBookmarks = async () => {
    if (!user?.id) return;
    try {
      const bmarks = await getBookmarks(user.id);
      if (bmarks && Array.isArray(bmarks)) {
        const resIds = new Set(
          bmarks
            .filter((b) => b && (b.entity_type === 'resource' || b.type === 'resource'))
            .map((b) => b.entity_id || b.id)
        );
        setBookmarkedResourceIds(resIds);
      }
    } catch (e) {
      console.warn('[ExploreScreen] Error loading bookmarks:', e);
    }
  };

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

  const loadAcademicResources = async () => {
    setResourcesLoading(true);
    try {
      let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(40);

      if (debouncedQuery.trim()) {
        query = query.ilike('title', `%${debouncedQuery.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.warn('Load academic resources error:', err);
    } finally {
      setResourcesLoading(false);
    }
  };

  // Helper check for lesson completion
  const checkIsLessonCompleted = useCallback(
    (lessonId: string) => {
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

      return transactions.some((t) => {
        const type = (t.activity_type || '').toLowerCase();
        const isResourceRead =
          type === 'resource_read' ||
          type === 'quick_learn' ||
          type.includes('quick_learn') ||
          type.includes('resource_read');
        const matchesId =
          t.reference_id === lessonId ||
          (t.reference_id && String(t.reference_id).includes(lessonId)) ||
          (t.description && String(t.description).includes(lessonId));
        return isResourceRead && matchesId;
      });
    },
    [user?.id, transactions]
  );

  // Helper check for quiz completion
  const checkIsQuizCompleted = useCallback(
    (quizId: string) => {
      const isLocallyDone =
        localCompletedQuizzes.includes(quizId) ||
        localCompletedQuizzes.some((id) => id.includes(quizId) || quizId.includes(id));
      const isTxDone = transactions.some((t) => {
        const type = (t.activity_type || '').toLowerCase();
        const isQuizCompleted = type === 'quiz_completed' || type === 'explore_quiz' || type === 'daily_quiz';
        const matchesId =
          t.reference_id === quizId ||
          (t.reference_id && String(t.reference_id).includes(quizId)) ||
          (t.description && String(t.description).includes(quizId));
        return isQuizCompleted && matchesId;
      });
      return isLocallyDone || isTxDone;
    },
    [localCompletedQuizzes, transactions]
  );

  // Resource bookmark toggle
  const handleToggleBookmark = async (resourceId: string) => {
    if (!user?.id) {
      Alert.alert('Sign In Required', 'Please log in to bookmark resources.');
      return;
    }

    setBookmarkedResourceIds((prev) => {
      const next = new Set(prev);
      if (next.has(resourceId)) next.delete(resourceId);
      else next.add(resourceId);
      return next;
    });

    try {
      await toggleBookmark(user.id, 'resource', resourceId);
    } catch (e) {
      console.warn('Toggle bookmark error:', e);
    }
  };

  // Open resource document
  const handleOpenResource = async (item: any) => {
    if (!item?.file_url) {
      Alert.alert('Resource Unavailable', 'This resource does not have an attached document.');
      return;
    }
    const targetUrl = convertDriveUrlToPdfViewerUrl(item.file_url);
    try {
      await WebBrowser.openBrowserAsync(targetUrl);
    } catch (err) {
      Linking.openURL(targetUrl);
    }
  };

  // Share resource document
  const handleShareResource = async (item: any) => {
    try {
      await Share.share({
        message: `Check out this resource on FEEDX: ${item.title}\n${item.file_url || ''}`,
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  // Filtered academic resources
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      if (selectedResourceCategory === 'All') return true;
      const cat = String(resolveResourceCategory(item));
      const isPYQFilter =
        selectedResourceCategory === 'Previous Year Question Papers' ||
        selectedResourceCategory === 'Previous Year Papers' ||
        selectedResourceCategory.includes('Question') ||
        selectedResourceCategory.includes('Paper');

      if (isPYQFilter) {
        return (
          cat === 'Previous Year Question Papers' ||
          cat === 'Previous Year Papers' ||
          cat.includes('Paper') ||
          cat.includes('PYQ') ||
          cat.includes('Question')
        );
      }
      if (selectedResourceCategory === 'Notes') {
        return (
          cat === 'Notes' &&
          !cat.includes('Paper') &&
          !cat.includes('PYQ') &&
          !cat.includes('Question')
        );
      }
      return cat === selectedResourceCategory;
    });
  }, [resources, selectedResourceCategory]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0A0F1D' : '#F8FAFC' }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}

      {/* Header Matching Screenshot #1 */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 14) }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.systemBadge}>EXPLORE SYSTEM</Text>
          <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>Discover & Learn</Text>
        </View>
        <TouchableOpacity
          style={styles.headerTokenBadge}
          onPress={() => router.push('/rewards')}
          activeOpacity={0.8}
        >
          <Feather name="star" size={13} color="#3B82F6" />
          <Text style={styles.headerTokenText}>
            {wallet?.tokens !== undefined ? wallet.tokens : (user?.tokens ?? 0)}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar Matching Screenshot #1 */}
        {activeSection !== 'roadmap' && (
          <View style={[styles.searchBox, { backgroundColor: isDark ? '#101726' : '#FFFFFF', borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,0.06)' }]}>
            <Feather name="search" size={rs(16)} color="#3B82F6" />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder={
                activeSection === 'resources'
                  ? 'Search notes, PYQs, syllabus...'
                  : 'Search micro lessons & topics...'
              }
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: rs(4) }}>
                <Ionicons name="close-circle" size={rs(16)} color={colors.textMuted} />
              </TouchableOpacity>
            )}
            {(loading || resourcesLoading) && (
              <ActivityIndicator size="small" color="#3B82F6" style={{ marginLeft: rs(8) }} />
            )}
          </View>
        )}

        {/* 2x2 Hub Grid Matching Reference Screenshot #1 */}
        <View style={styles.hubsGrid}>
          {/* Row 1: Quick Learn (Left) & Resources (Right) */}
          <View style={styles.hubsRow}>
            {/* 1. Quick Learn */}
            <TouchableOpacity
              style={[
                styles.hubCard,
                activeSection === 'quick' ? styles.hubCardActive : styles.hubCardInactive,
              ]}
              onPress={() => setActiveSection('quick')}
              activeOpacity={0.8}
            >
              <View style={styles.hubTopRow}>
                <View style={[styles.hubIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Ionicons name="flash" size={rs(16)} color="#10B981" />
                </View>
                <View style={[styles.hubBadgePill, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Text style={[styles.hubBadgeText, { color: '#10B981' }]}>NEW</Text>
                </View>
              </View>
              <Text style={[styles.hubTitle, activeSection === 'quick' && styles.hubTitleActive]}>
                Quick Learn
              </Text>
              <Text style={styles.hubSubtitle}>Micro lessons</Text>
            </TouchableOpacity>

            {/* 2. Resources */}
            <TouchableOpacity
              style={[
                styles.hubCard,
                activeSection === 'resources' ? styles.hubCardActive : styles.hubCardInactive,
              ]}
              onPress={() => setActiveSection('resources')}
              activeOpacity={0.8}
            >
              <View style={styles.hubTopRow}>
                <View style={[styles.hubIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <Ionicons name="book" size={rs(16)} color="#3B82F6" />
                </View>
                <View style={[styles.hubBadgePill, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <Text style={[styles.hubBadgeText, { color: '#3B82F6' }]}>PDF</Text>
                </View>
              </View>
              <Text style={[styles.hubTitle, activeSection === 'resources' && styles.hubTitleActive]}>
                Resources
              </Text>
              <Text style={styles.hubSubtitle}>Notes & papers</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: Quiz Zone (Left) & Roadmaps (Right) */}
          <View style={styles.hubsRow}>
            {/* 3. Quiz Zone */}
            <TouchableOpacity
              style={[
                styles.hubCard,
                activeSection === 'quiz' ? styles.hubCardActive : styles.hubCardInactive,
              ]}
              onPress={() => setActiveSection('quiz')}
              activeOpacity={0.8}
            >
              <View style={styles.hubTopRow}>
                <View style={[styles.hubIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                  <MaterialCommunityIcons name="help-box" size={rs(18)} color="#A855F7" />
                </View>
                <View style={[styles.hubBadgePill, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Text style={[styles.hubBadgeText, { color: '#F59E0B' }]}>+FX</Text>
                </View>
              </View>
              <Text style={[styles.hubTitle, activeSection === 'quiz' && styles.hubTitleActive]}>
                Quiz Zone
              </Text>
              <Text style={styles.hubSubtitle}>Test skills</Text>
            </TouchableOpacity>

            {/* 4. Roadmaps */}
            <TouchableOpacity
              style={[
                styles.hubCard,
                activeSection === 'roadmap' ? styles.hubCardActive : styles.hubCardInactive,
              ]}
              onPress={() => setActiveSection('roadmap')}
              activeOpacity={0.8}
            >
              <View style={styles.hubTopRow}>
                <View style={[styles.hubIconBox, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
                  <MaterialCommunityIcons name="map-marker-path" size={rs(18)} color="#06B6D4" />
                </View>
                <View style={[styles.hubBadgePill, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                  <Text style={[styles.hubBadgeText, { color: '#A855F7' }]}>AI</Text>
                </View>
              </View>
              <Text style={[styles.hubTitle, activeSection === 'roadmap' && styles.hubTitleActive]}>
                Roadmaps
              </Text>
              <Text style={styles.hubSubtitle}>AI Blueprints</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 1: QUICK LEARN (Default) */}
        {activeSection === 'quick' && (() => {
          const completedLessons = quickLessons.filter((lesson) => checkIsLessonCompleted(lesson.id));
          const activeLessons = quickLessons.filter((lesson) => !checkIsLessonCompleted(lesson.id));
          const displayedLessons = quickFilter === 'active' ? activeLessons : completedLessons;

          return (
            <View style={styles.sectionContainer}>
              {/* Section Header with Book Icon */}
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleGroup}>
                  <Ionicons name="book-outline" size={rs(17)} color="#3B82F6" style={{ marginRight: rs(6) }} />
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Learn</Text>
                </View>
              </View>

              {/* Sub-Filter Pills: Active (38) & Completed (11) */}
              <View style={styles.filterTabsRow}>
                <TouchableOpacity
                  style={[
                    styles.filterTabPill,
                    quickFilter === 'active' ? styles.filterTabActive : styles.filterTabInactive,
                  ]}
                  onPress={() => setQuickFilter('active')}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      quickFilter === 'active' && styles.filterTabTextActive,
                    ]}
                  >
                    Active ({activeLessons.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterTabPill,
                    quickFilter === 'completed' ? styles.filterTabActive : styles.filterTabInactive,
                  ]}
                  onPress={() => setQuickFilter('completed')}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      quickFilter === 'completed' && styles.filterTabTextActive,
                    ]}
                  >
                    Completed ({completedLessons.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Lesson Cards Matching Screenshot #1 */}
              {displayedLessons.length > 0 ? (
                displayedLessons.map((item, idx) => (
                  <Animated.View key={item.id} entering={FadeInDown.delay(idx * 30).springify()}>
                    <View
                      style={[
                        styles.lessonCard,
                        {
                          backgroundColor: isDark ? '#111827' : '#FFFFFF',
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                        },
                      ]}
                    >
                      {/* Top Meta: CSE Pill + Reading Time */}
                      <View style={styles.lessonMetaRow}>
                        <View style={styles.deptPill}>
                          <Text style={styles.deptPillText}>{item.branch || 'CSE'}</Text>
                        </View>
                        <Text style={styles.lessonMetaText}>
                          {item.difficulty || 'Beginner'} • {item.estimated_minutes || 3} min
                        </Text>
                      </View>

                      {/* Lesson Title */}
                      <Text style={[styles.lessonTitle, { color: colors.textPrimary }]}>
                        {item.title}
                      </Text>

                      {/* Description */}
                      <Text style={styles.lessonDesc} numberOfLines={2}>
                        {item.short_description || `Master ${item.title} fundamentals with quick reading and 15 practice MCQs on FEEDX.`}
                      </Text>

                      {/* Bottom Row: +10 FX Pill & Read Lesson Button */}
                      <View style={styles.lessonBottomRow}>
                        <View style={styles.fxBadgePill}>
                          <Text style={styles.fxBadgeText}>+10 Tokens</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.readLessonBtn}
                          onPress={() =>
                            router.push({
                              pathname: '/quick-learn-detail' as any,
                              params: { id: item.id, source: 'explore' },
                            })
                          }
                          activeOpacity={0.8}
                        >
                          <Text style={styles.readLessonBtnText}>
                            {quickFilter === 'active' ? 'Read Lesson →' : 'Review Lesson'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Animated.View>
                ))
              ) : (
                <View style={[styles.emptyBox, { backgroundColor: isDark ? '#111827' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                  <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '600' }}>
                    No {quickFilter} lessons found.
                  </Text>
                </View>
              )}
            </View>
          );
        })()}

        {/* SECTION 2: ACADEMIC RESOURCES */}
        {activeSection === 'resources' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons name="folder-open-outline" size={rs(17)} color="#3B82F6" style={{ marginRight: rs(6) }} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Academic Resources</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/academics' as any)}>
                <Text style={styles.fullHubLink}>Academics Hub →</Text>
              </TouchableOpacity>
            </View>

            {/* Category Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {RESOURCE_CATEGORIES.map((cat) => {
                const isSelected = selectedResourceCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryPill,
                      isSelected ? styles.categoryPillActive : styles.categoryPillInactive,
                    ]}
                    onPress={() => setSelectedResourceCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        isSelected && styles.categoryPillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Resources List */}
            {resourcesLoading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading academic resources...</Text>
              </View>
            ) : filteredResources.length > 0 ? (
              filteredResources.map((res, idx) => {
                const category = resolveResourceCategory(res);
                const isBookmarked = bookmarkedResourceIds.has(res.id);

                return (
                  <Animated.View key={res.id} entering={FadeInDown.delay(idx * 30).springify()}>
                    <View
                      style={[
                        styles.resourceCard,
                        {
                          backgroundColor: isDark ? '#111827' : '#FFFFFF',
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                        },
                      ]}
                    >
                      <View style={styles.resourceHeaderRow}>
                        <View style={styles.resourceBadge}>
                          <Text style={styles.resourceBadgeText}>{category}</Text>
                        </View>
                        <BookmarkButton
                          isBookmarked={isBookmarked}
                          onPress={() => handleToggleBookmark(res.id)}
                          size={28}
                          iconSize={15}
                        />
                      </View>

                      <Text style={[styles.resourceTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                        {res.title}
                      </Text>
                      {res.subject && (
                        <Text style={styles.resourceSubject} numberOfLines={1}>
                          {res.subject}
                        </Text>
                      )}

                      <View style={styles.resourceFooter}>
                        <View style={styles.pdfBadge}>
                          <Text style={styles.pdfBadgeText}>PDF Document</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.openDocBtn}
                          onPress={() => handleOpenResource(res)}
                          activeOpacity={0.8}
                        >
                          <Feather name="eye" size={rs(12)} color="#FFFFFF" style={{ marginRight: rs(4) }} />
                          <Text style={styles.openDocText}>View Document</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Animated.View>
                );
              })
            ) : (
              <View style={[styles.emptyBox, { backgroundColor: isDark ? '#111827' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                <Ionicons name="folder-outline" size={rs(32)} color="#64748B" />
                <Text style={styles.emptyTitle}>No Resources Found</Text>
                <Text style={styles.emptySub}>
                  {searchQuery ? `No resources matching "${searchQuery}"` : 'No study materials in this category.'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* SECTION 3: QUIZ ZONE */}
        {activeSection === 'quiz' && (() => {
          const completedQuizzes = quizzes.filter((quiz) => checkIsQuizCompleted(quiz.id));
          const activeQuizzes = quizzes.filter((quiz) => !checkIsQuizCompleted(quiz.id));
          const displayedQuizzes = quizFilter === 'active' ? activeQuizzes : completedQuizzes;

          return (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleGroup}>
                  <MaterialCommunityIcons name="help-box" size={rs(17)} color="#A855F7" style={{ marginRight: rs(6) }} />
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quiz Zone</Text>
                </View>
              </View>

              {/* Sub-Filter Pills */}
              <View style={styles.filterTabsRow}>
                <TouchableOpacity
                  style={[
                    styles.filterTabPill,
                    quizFilter === 'active' ? styles.filterTabActive : styles.filterTabInactive,
                  ]}
                  onPress={() => setQuizFilter('active')}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      quizFilter === 'active' && styles.filterTabTextActive,
                    ]}
                  >
                    Active ({activeQuizzes.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterTabPill,
                    quizFilter === 'completed' ? styles.filterTabActive : styles.filterTabInactive,
                  ]}
                  onPress={() => setQuizFilter('completed')}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      quizFilter === 'completed' && styles.filterTabTextActive,
                    ]}
                  >
                    Completed ({completedQuizzes.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {displayedQuizzes.length > 0 ? (
                displayedQuizzes.map((quiz, idx) => (
                  <Animated.View key={quiz.id} entering={FadeInDown.delay(idx * 30).springify()}>
                    <View
                      style={[
                        styles.lessonCard,
                        {
                          backgroundColor: isDark ? '#111827' : '#FFFFFF',
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                        },
                      ]}
                    >
                      <View style={styles.lessonMetaRow}>
                        <View style={[styles.deptPill, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                          <Text style={[styles.deptPillText, { color: '#C084FC' }]}>{quiz.category || 'Tech Quiz'}</Text>
                        </View>
                        <Text style={styles.lessonMetaText}>
                          {quiz.question_count || 10} MCQs • ~{quiz.estimated_minutes || 5} min
                        </Text>
                      </View>

                      <Text style={[styles.lessonTitle, { color: colors.textPrimary }]}>
                        {quiz.title}
                      </Text>
                      <Text style={styles.lessonDesc} numberOfLines={2}>
                        {quiz.description || 'Test your tech skills and earn FX Tokens for completed answers.'}
                      </Text>

                      <View style={styles.lessonBottomRow}>
                        <View style={styles.fxBadgePill}>
                          <Text style={styles.fxBadgeText}>+15 Tokens</Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.readLessonBtn, { backgroundColor: '#7C3AED' }]}
                          onPress={() =>
                            router.push({
                              pathname: '/daily-quiz' as any,
                              params: { quizId: quiz.id, source: 'explore', isDaily: 'false' },
                            })
                          }
                          activeOpacity={0.8}
                        >
                          <Text style={styles.readLessonBtnText}>
                            {quizFilter === 'active' ? 'Start Quiz →' : 'Retake Quiz'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Animated.View>
                ))
              ) : (
                <View style={[styles.emptyBox, { backgroundColor: isDark ? '#111827' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                  <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '600' }}>
                    No {quizFilter} quizzes available.
                  </Text>
                </View>
              )}
            </View>
          );
        })()}

        {/* SECTION 4: AI CAREER ROADMAPS */}
        {activeSection === 'roadmap' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleGroup}>
                <MaterialCommunityIcons name="routes" size={rs(17)} color="#06B6D4" style={{ marginRight: rs(6) }} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>AI Career Blueprints</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/roadmap' as any)}>
                <Text style={styles.fullHubLink}>Full View →</Text>
              </TouchableOpacity>
            </View>
            <AIRoadmapScreen />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: rs(16),
    paddingBottom: rs(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(5),
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: rs(10),
    paddingVertical: rs(6),
    borderRadius: rs(20),
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  headerTokenText: {
    color: '#3B82F6',
    fontSize: rf(13),
    fontWeight: '800',
  },
  systemBadge: {
    color: '#3B82F6',
    fontSize: rf(10.5),
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: rs(3),
  },
  mainTitle: {
    fontSize: rf(18),
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: rs(16),
    paddingBottom: rs(120),
    gap: rs(14),
  },
  searchBox: {
    height: rs(44),
    borderRadius: rs(12),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rs(12),
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: rs(8),
    fontSize: rf(12.5),
    fontWeight: '500',
  },
  hubsGrid: {
    gap: rs(10),
  },
  hubsRow: {
    flexDirection: 'row',
    gap: rs(10),
  },
  hubCard: {
    flex: 1,
    borderRadius: rs(14),
    padding: rs(12),
    borderWidth: 1.5,
  },
  hubCardActive: {
    backgroundColor: '#0F1E36',
    borderColor: '#2563EB',
  },
  hubCardInactive: {
    backgroundColor: '#111827',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  hubTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs(10),
  },
  hubIconBox: {
    width: rs(32),
    height: rs(32),
    borderRadius: rs(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubBadgePill: {
    paddingHorizontal: rs(6),
    paddingVertical: rs(2),
    borderRadius: rs(5),
  },
  hubBadgeText: {
    fontSize: rf(9.5),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  hubTitle: {
    fontSize: rf(13.5),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  hubTitleActive: {
    color: '#38BDF8',
  },
  hubSubtitle: {
    fontSize: rf(10.5),
    color: '#94A3B8',
    marginTop: rs(2),
  },
  sectionContainer: {
    marginTop: rs(4),
    gap: rs(12),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: rf(15),
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  fullHubLink: {
    color: '#3B82F6',
    fontSize: rf(11.5),
    fontWeight: '700',
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: rs(8),
  },
  filterTabPill: {
    paddingHorizontal: rs(12),
    paddingVertical: rs(6),
    borderRadius: rs(16),
    borderWidth: 1,
  },
  filterTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterTabInactive: {
    backgroundColor: '#111827',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterTabText: {
    fontSize: rf(11.5),
    fontWeight: '600',
    color: '#94A3B8',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  lessonCard: {
    borderRadius: rs(14),
    padding: rs(12),
    borderWidth: 1,
    gap: rs(7),
  },
  lessonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deptPill: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    paddingHorizontal: rs(7),
    paddingVertical: rs(2.5),
    borderRadius: rs(5),
    marginRight: rs(6),
  },
  deptPillText: {
    color: '#60A5FA',
    fontSize: rf(10),
    fontWeight: '800',
  },
  lessonMetaText: {
    color: '#94A3B8',
    fontSize: rf(10.5),
    fontWeight: '500',
  },
  lessonTitle: {
    fontSize: rf(13.5),
    fontWeight: '700',
    letterSpacing: 0.1,
    marginTop: rs(2),
  },
  lessonDesc: {
    color: '#94A3B8',
    fontSize: rf(11.5),
    lineHeight: rf(16),
  },
  lessonBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: rs(4),
  },
  fxBadgePill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: rs(8),
    paddingVertical: rs(4),
    borderRadius: rs(6),
  },
  fxBadgeText: {
    color: '#F59E0B',
    fontSize: rf(10.5),
    fontWeight: '700',
  },
  readLessonBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: rs(12),
    paddingVertical: rs(7),
    borderRadius: rs(8),
  },
  readLessonBtnText: {
    color: '#FFFFFF',
    fontSize: rf(11.5),
    fontWeight: '600',
  },
  categoryScroll: {
    gap: rs(6),
    paddingVertical: rs(2),
  },
  categoryPill: {
    paddingHorizontal: rs(11),
    paddingVertical: rs(5.5),
    borderRadius: rs(16),
    borderWidth: 1,
  },
  categoryPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryPillInactive: {
    backgroundColor: '#111827',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryPillText: {
    fontSize: rf(11),
    fontWeight: '600',
    color: '#94A3B8',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resourceCard: {
    borderRadius: rs(14),
    padding: rs(12),
    borderWidth: 1,
    gap: rs(7),
  },
  resourceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: rs(7),
    paddingVertical: rs(2.5),
    borderRadius: rs(5),
  },
  resourceBadgeText: {
    color: '#60A5FA',
    fontSize: rf(10),
    fontWeight: '700',
  },
  resourceTitle: {
    fontSize: rf(13.5),
    fontWeight: '700',
    lineHeight: rf(17),
  },
  resourceSubject: {
    fontSize: rf(10.5),
    color: '#94A3B8',
    fontWeight: '500',
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: rs(4),
  },
  pdfBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: rs(8),
    paddingVertical: rs(4),
    borderRadius: rs(6),
  },
  pdfBadgeText: {
    color: '#94A3B8',
    fontSize: rf(10.5),
    fontWeight: '600',
  },
  openDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: rs(11),
    paddingVertical: rs(6.5),
    borderRadius: rs(8),
  },
  openDocText: {
    color: '#FFFFFF',
    fontSize: rf(11),
    fontWeight: '700',
  },
  loadingBox: {
    padding: rs(20),
    alignItems: 'center',
    gap: rs(6),
  },
  loadingText: {
    fontSize: rf(11),
    color: '#94A3B8',
    fontWeight: '500',
  },
  emptyBox: {
    padding: rs(20),
    borderRadius: rs(14),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs(6),
  },
  emptyTitle: {
    fontSize: rf(13),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptySub: {
    fontSize: rf(11),
    color: '#94A3B8',
    textAlign: 'center',
  },
});
