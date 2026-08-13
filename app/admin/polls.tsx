import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { fetchAdminPolls, closePollAdmin, deletePollAdmin } from '@/services/supabaseService';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { CreatePollModal } from '@/components/community/CreatePollModal';

export default function AdminPollsScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const loadPolls = async () => {
    try {
      const data = await fetchAdminPolls();
      setPolls(data || []);
    } catch (err) {
      console.warn('[AdminPollsScreen] load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPolls();
  }, []);

  const handleClosePoll = async (pollId: string) => {
    Alert.alert('Close Poll', 'Are you sure you want to close this poll? Students will no longer be able to vote.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Close Poll',
        style: 'destructive',
        onPress: async () => {
          try {
            await closePollAdmin(pollId);
            loadPolls();
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Failed to close poll.');
          }
        },
      },
    ]);
  };

  const handleDeletePoll = async (pollId: string) => {
    Alert.alert('Delete Poll', 'Are you sure you want to permanently delete this poll?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePollAdmin(pollId);
            loadPolls();
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Failed to delete poll.');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Poll Management</Text>
            <Text style={[styles.headerSub, { color: colors.textMuted }]}>Superadmin Poll Control Dashboard</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: colors.primary }]}
          onPress={() => setCreateModalVisible(true)}
        >
          <Feather name="plus" size={16} color="#FFF" />
          <Text style={styles.createBtnText}>Create Poll</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadPolls(); }} tintColor={colors.primary} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : polls.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <MaterialCommunityIcons name="poll" size={32} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Polls Created</Text>
            <Text style={[styles.emptySub, { color: colors.textMuted }]}>
              Create your first official community poll to gather student preferences.
            </Text>
          </View>
        ) : (
          polls.map((poll, idx) => {
            const isClosed = poll.status === 'CLOSED' || (poll.ends_at && new Date(poll.ends_at) < new Date());
            const totalVotes = poll.poll_votes?.length || 0;
            const options = poll.poll_options || [];

            return (
              <Animated.View
                key={poll.id || idx}
                entering={FadeInDown.duration(300).delay(idx * 50)}
                style={[styles.pollCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              >
                <View style={styles.cardTop}>
                  <View style={[styles.statusBadge, { backgroundColor: isClosed ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)' }]}>
                    <Text style={[styles.statusBadgeText, { color: isClosed ? '#EF4444' : '#10B981' }]}>
                      {isClosed ? 'CLOSED' : 'ACTIVE'}
                    </Text>
                  </View>
                  <Text style={[styles.dateText, { color: colors.textMuted }]}>
                    {new Date(poll.created_at).toLocaleDateString()}
                  </Text>
                </View>

                <Text style={[styles.questionText, { color: colors.textPrimary }]}>
                  {poll.question}
                </Text>

                <View style={styles.statsRow}>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                    Total Votes: <Text style={{ color: colors.textPrimary, fontWeight: '800' }}>{totalVotes}</Text>
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                    Options: <Text style={{ color: colors.textPrimary, fontWeight: '800' }}>{options.length}</Text>
                  </Text>
                </View>

                <View style={styles.actionsRow}>
                  {!isClosed && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}
                      onPress={() => handleClosePoll(poll.id)}
                    >
                      <Feather name="slash" size={14} color="#EF4444" />
                      <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Close Poll</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.08)' }]}
                    onPress={() => handleDeletePoll(poll.id)}
                  >
                    <Feather name="trash-2" size={14} color="#EF4444" />
                    <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      <CreatePollModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        userId={user?.id}
        onPostCreated={() => loadPolls()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: 52,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FONT.size.md,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 11,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  createBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
  },
  scrollList: {
    padding: SPACING.md,
    gap: 12,
  },
  emptyCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: FONT.size.md,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
  pollCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 10,
    ...SHADOWS.small,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  dateText: {
    fontSize: 10,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statLabel: {
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
