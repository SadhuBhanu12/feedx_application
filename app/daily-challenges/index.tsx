import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useUser } from '@/context/UserContext';
import { useGamification } from '@/context/GamificationContext';
import { useTheme } from '@/context/ThemeContext';
import {
  getTodayChallenge,
  getAvailableChallenges,
  getStudentProgressStats,
  DailyChallenge,
  StudentProgressStats,
} from '@/services/dailyChallengeService';
import GlassCard from '@/components/ui/GlassCard';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { name: 'Programming', icon: 'code-tags', color: '#3B82F6' },
  { name: 'Aptitude', icon: 'calculator', color: '#F59E0B' },
  { name: 'Career', icon: 'briefcase-outline', color: '#8B5CF6' },
  { name: 'Communication', icon: 'forum-outline', color: '#EC4899' },
  { name: 'Gen Knowledge', icon: 'earth', color: '#06B6D4' },
  { name: 'Academic', icon: 'school-outline', color: '#10B981' },
];

export default function DailyChallengesDashboardScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { streak: gamificationStreak } = useGamification();
  const { colors, isDark } = useTheme();

  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);
  const [moreChallenges, setMoreChallenges] = useState<DailyChallenge[]>([]);
  const [stats, setStats] = useState<StudentProgressStats>({
    currentStreak: gamificationStreak?.current_streak ?? user?.streak_count ?? user?.streak ?? 1,
    longestStreak: gamificationStreak?.longest_streak ?? user?.max_streak ?? user?.longest_streak ?? user?.streak_count ?? 1,
    totalXp: gamificationStreak?.xp_points ?? user?.xp_points ?? 0,
    completedCount: 0,
    userLevel: Math.max(1, Math.floor((user?.xp_points || 0) / 500) + 1),
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadDashboardData = async () => {
    try {
      const [todayData, availableData, statsData] = await Promise.all([
        getTodayChallenge(user?.id),
        getAvailableChallenges(user?.id),
        getStudentProgressStats(user?.id),
      ]);

      setTodayChallenge(todayData);
      setMoreChallenges(availableData);
      setStats(statsData);
    } catch (e) {
      console.warn('Daily challenges load exception:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (gamificationStreak) {
      setStats((prev) => ({
        ...prev,
        currentStreak: gamificationStreak.current_streak ?? prev.currentStreak,
        longestStreak: gamificationStreak.longest_streak ?? prev.longestStreak,
        totalXp: gamificationStreak.xp_points ?? prev.totalXp,
      }));
    }
  }, [gamificationStreak]);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const filteredMoreChallenges = moreChallenges.filter((c) => {
    if (selectedCategory === 'All') return true;
    return c.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Daily Challenges</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>Build your skills, one challenge at a time.</Text>
        </View>
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => router.push('/daily-challenges/history' as any)}
        >
          <Ionicons name="time-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
      >
        {/* Compact Stat Cards (Streak, XP, Completed, Level) */}
        <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7', borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
            <MaterialCommunityIcons name="fire" size={22} color="#F59E0B" />
            <Text style={[styles.statVal, { color: '#F59E0B' }]}>{stats.currentStreak} Days</Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Streak 🔥</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
            <FontAwesome5 name="star" size={18} color="#3B82F6" />
            <Text style={[styles.statVal, { color: '#3B82F6' }]}>{stats.totalXp} XP</Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Total XP ⭐</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
            <Ionicons name="checkmark-done-circle-outline" size={22} color="#10B981" />
            <Text style={[styles.statVal, { color: '#10B981' }]}>{stats.completedCount}</Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Completed ✓</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#F5F3FF', borderColor: 'rgba(139, 92, 246, 0.3)' }]}>
            <FontAwesome5 name="trophy" size={18} color="#8B5CF6" />
            <Text style={[styles.statVal, { color: '#8B5CF6' }]}>Lvl {stats.userLevel}</Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Level</Text>
          </View>
        </Animated.View>

        {/* TODAY'S FEATURED CHALLENGE */}
        <Animated.View entering={FadeInDown.delay(150).springify()} style={{ marginTop: 16 }}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>TODAY&apos;S FEATURED CHALLENGE</Text>
            <View style={styles.liveTag}>
              <View style={styles.liveDot} />
              <Text style={styles.liveTagText}>LIVE</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 30 }} />
          ) : todayChallenge ? (
            <GlassCard style={styles.featuredCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{todayChallenge.category}</Text>
                </View>
                <View style={styles.diffBadge}>
                  <Text style={styles.diffBadgeText}>{todayChallenge.difficulty}</Text>
                </View>
                <View style={styles.xpTag}>
                  <Text style={styles.xpTagText}>+{todayChallenge.xp_reward} Tokens</Text>
                </View>
              </View>

              <Text style={[styles.challengeTitle, { color: colors.textPrimary }]}>{todayChallenge.title}</Text>
              <Text style={[styles.challengeDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                {todayChallenge.description}
              </Text>

              <View style={styles.metaInfoRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>{todayChallenge.estimated_minutes} min</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="help-circle-outline" size={14} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>{todayChallenge.challenge_type.toUpperCase()}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryCtaBtn,
                  todayChallenge.completed_today && { backgroundColor: '#10B981' }
                ]}
                onPress={() => router.push({ pathname: `/daily-challenges/${todayChallenge.id}` as any })}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryCtaText}>
                  {todayChallenge.completed_today ? 'View Result & Explanation ✓' : 'Start Challenge →'}
                </Text>
              </TouchableOpacity>
            </GlassCard>
          ) : null}
        </Animated.View>

        {/* Dynamic Category Selector */}
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.sectionHeading, { color: colors.textMuted, marginBottom: 10 }]}>BROWSE CATEGORIES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            <TouchableOpacity
              style={[styles.catPill, selectedCategory === 'All' && { backgroundColor: '#3B82F6', borderColor: '#3B82F6' }]}
              onPress={() => setSelectedCategory('All')}
            >
              <Text style={[styles.catPillText, selectedCategory === 'All' && { color: '#FFF' }]}>🌟 All Topics</Text>
            </TouchableOpacity>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[styles.catPill, selectedCategory === cat.name && { backgroundColor: '#3B82F6', borderColor: '#3B82F6' }]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <MaterialCommunityIcons name={cat.icon as any} size={14} color={selectedCategory === cat.name ? '#FFF' : cat.color} />
                <Text style={[styles.catPillText, selectedCategory === cat.name && { color: '#FFF' }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Keep Learning Section */}
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.sectionHeading, { color: colors.textMuted, marginBottom: 10 }]}>MORE CHALLENGES</Text>
          <View style={{ gap: 10 }}>
            {filteredMoreChallenges.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => router.push({ pathname: `/daily-challenges/${item.id}` as any })}
                activeOpacity={0.8}
              >
                <View style={styles.listCardLeft}>
                  <Text style={[styles.listTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.listSub, { color: colors.textMuted }]}>{item.category} • {item.difficulty}</Text>
                </View>
                <View style={styles.listXpTag}>
                  <Text style={styles.listXpText}>+{item.xp_reward} Tokens</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900' },
  headerSub: { fontSize: 11, fontWeight: '600' },
  historyBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: { flex: 1, padding: 10, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  statVal: { fontSize: 13, fontWeight: '900', marginTop: 4 },
  statLbl: { fontSize: 9, fontWeight: '700', marginTop: 1 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionHeading: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  liveTagText: { fontSize: 9, fontWeight: '900', color: '#EF4444' },
  featuredCard: { padding: 18, gap: 10 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryBadge: { backgroundColor: 'rgba(59, 130, 246, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryBadgeText: { fontSize: 10, fontWeight: '900', color: '#3B82F6' },
  diffBadge: { backgroundColor: 'rgba(245, 158, 11, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  diffBadgeText: { fontSize: 10, fontWeight: '800', color: '#F59E0B' },
  xpTag: { marginLeft: 'auto', backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  xpTagText: { fontSize: 11, fontWeight: '900', color: '#10B981' },
  challengeTitle: { fontSize: 16, fontWeight: '900' },
  challengeDesc: { fontSize: 12, lineHeight: 18 },
  metaInfoRow: { flexDirection: 'row', gap: 16, marginVertical: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, fontWeight: '600' },
  primaryCtaBtn: { backgroundColor: '#3B82F6', paddingVertical: 12, borderRadius: 14, alignItems: 'center', marginTop: 6 },
  primaryCtaText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  catPillText: { fontSize: 11, fontWeight: '800', color: '#94A3B8' },
  listCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 16, borderWidth: 1 },
  listCardLeft: { flex: 1 },
  listTitle: { fontSize: 13, fontWeight: '800' },
  listSub: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  listXpTag: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  listXpText: { fontSize: 11, fontWeight: '900', color: '#10B981' },
});
