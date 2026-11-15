import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { fetchLeaderboard, LeaderboardUser } from '@/services/gamificationService';

export default function LeaderboardScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Overall'>('Overall');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const data = await fetchLeaderboard(filter);
      if (isMounted) {
        setUsers(data);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [filter]);

  const top3 = users.slice(0, 3);
  const remaining = users.slice(3);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Top Student Achievers</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Time Filter Tabs */}
      <View style={styles.filterRow}>
        {(['Daily', 'Weekly', 'Monthly', 'Overall'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              {
                backgroundColor: filter === tab
                  ? '#F59E0B'
                  : isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
            onPress={() => setFilter(tab)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === tab ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      ) : users.length === 0 ? (
        <View style={[styles.center, { padding: 32 }]}>
          <Ionicons name="trophy-outline" size={48} color="#94A3B8" />
          <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 12 }}>No rankings yet</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 6 }}>Complete daily tasks and quizzes to earn points and appear on the leaderboard!</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Top 3 Podium Section */}
          {top3.length > 0 && (
            <View style={styles.podiumContainer}>
              {/* 2nd Place */}
              {top3[1] && (
                <View style={[styles.podiumCard, styles.podium2nd, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                  <Text style={styles.podiumRankEmoji}>🥈</Text>
                  <Text style={[styles.podiumName, { color: colors.textPrimary }]} numberOfLines={1}>{top3[1].full_name}</Text>
                  <Text style={styles.podiumBranch}>{top3[1].branch}</Text>
                  <View style={styles.coinPill}>
                    <FontAwesome5 name="coins" size={10} color="#D97706" style={{ marginRight: 4 }} />
                    <Text style={styles.coinPillText}>{top3[1].gold_coins}</Text>
                  </View>
                </View>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <View style={[styles.podiumCard, styles.podium1st, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                  <Text style={styles.podiumRankEmoji}>👑</Text>
                  <Text style={[styles.podiumName, { color: colors.textPrimary, fontSize: 14 }]} numberOfLines={1}>{top3[0].full_name}</Text>
                  <Text style={styles.podiumBranch}>{top3[0].branch}</Text>
                  <View style={[styles.coinPill, { backgroundColor: '#FEF08A' }]}>
                    <FontAwesome5 name="coins" size={12} color="#D97706" style={{ marginRight: 4 }} />
                    <Text style={[styles.coinPillText, { fontSize: 13 }]}>{top3[0].gold_coins}</Text>
                  </View>
                </View>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <View style={[styles.podiumCard, styles.podium3rd, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                  <Text style={styles.podiumRankEmoji}>🥉</Text>
                  <Text style={[styles.podiumName, { color: colors.textPrimary }]} numberOfLines={1}>{top3[2].full_name}</Text>
                  <Text style={styles.podiumBranch}>{top3[2].branch}</Text>
                  <View style={styles.coinPill}>
                    <FontAwesome5 name="coins" size={10} color="#D97706" style={{ marginRight: 4 }} />
                    <Text style={styles.coinPillText}>{top3[2].gold_coins}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Remaining Ranks List */}
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            {remaining.map((user) => (
              <View
                key={user.student_id}
                style={[
                  styles.rankRow,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
              >
                <Text style={styles.rankNum}>#{user.rank}</Text>
                <View style={styles.rankAvatar}>
                  <Text style={styles.avatarLetter}>{user.full_name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rankName, { color: colors.textPrimary }]}>{user.full_name}</Text>
                  <Text style={styles.rankBranch}>{user.branch}</Text>
                </View>
                <View style={styles.rankCoins}>
                  <FontAwesome5 name="coins" size={12} color="#D97706" style={{ marginRight: 4 }} />
                  <Text style={styles.rankCoinsText}>{user.gold_coins} Coins</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  filterText: { fontSize: 12, fontWeight: '800' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 10,
    gap: 10,
  },
  podiumCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    elevation: 3,
  },
  podium1st: { height: 160, borderWidth: 2, borderColor: '#F59E0B' },
  podium2nd: { height: 140, borderWidth: 1, borderColor: '#94A3B8' },
  podium3rd: { height: 130, borderWidth: 1, borderColor: '#D97706' },
  podiumRankEmoji: { fontSize: 24, marginBottom: 4 },
  podiumName: { fontSize: 12, fontWeight: '800', textAlign: 'center' },
  podiumBranch: { fontSize: 10, color: '#64748B', marginBottom: 8 },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  coinPillText: { fontSize: 11, fontWeight: '800', color: '#B45309' },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  rankNum: { fontSize: 14, fontWeight: '800', color: '#94A3B8', width: 30 },
  rankAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarLetter: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  rankName: { fontSize: 13, fontWeight: '700' },
  rankBranch: { fontSize: 11, color: '#64748B' },
  rankCoins: { flexDirection: 'row', alignItems: 'center' },
  rankCoinsText: { fontSize: 12, fontWeight: '800', color: '#D97706' },
});
