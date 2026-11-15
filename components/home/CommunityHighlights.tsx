import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface CommunityHighlightsProps {
  communityHighlight: any;
}

export function CommunityHighlights({ communityHighlight }: CommunityHighlightsProps) {
  const { colors } = useTheme();
  const router = useRouter();

  if (!communityHighlight) {
    return (
      <Animated.View entering={FadeInUp.duration(400).delay(400).springify()} style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Community Highlights</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/community')}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>View Community →</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="users" size={22} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Connect with fellow students</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Join discussions, ask academic doubts, and share campus updates in Community.
          </Text>
        </View>
      </Animated.View>
    );
  }

  const authorName = communityHighlight.author_name || 'FEEDX Student';
  const postTitle = communityHighlight.title || communityHighlight.caption || 'Community Post';
  const postDesc = communityHighlight.caption || communityHighlight.description || '';
  const timeText = communityHighlight.created_at
    ? new Date(communityHighlight.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : 'Recent';

  const commentsCount = communityHighlight.comments_count || 0;
  const likesCount = communityHighlight.likes_count || 0;

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(400).springify()} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Feather name="users" size={18} color="#10B981" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Community Highlights</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/community')}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>View Community →</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        onPress={() => router.push('/(tabs)/community')}
        activeOpacity={0.8}
      >
        <View style={styles.authorRow}>
          <UserAvatar
            user={{ full_name: authorName, profile_picture: communityHighlight.author_avatar } as any}
            size={36}
          />
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: colors.textPrimary }]} numberOfLines={1}>
              {authorName}
            </Text>
            <Text style={[styles.postTime, { color: colors.textMuted }]}>{timeText}</Text>
          </View>

          {communityHighlight.category && (
            <View style={styles.catTag}>
              <Text style={styles.catTagText}>{communityHighlight.category}</Text>
            </View>
          )}
        </View>

        {(communityHighlight.post_type === 'poll' || communityHighlight.poll) && (
          <View style={styles.pollBadgeRow}>
            <MaterialCommunityIcons name="poll" size={14} color="#3B82F6" />
            <Text style={styles.pollBadgeText}>COMMUNITY POLL • TAP TO VOTE</Text>
          </View>
        )}

        <Text style={[styles.postTitle, { color: colors.textPrimary }]} numberOfLines={2}>
          {postTitle}
        </Text>

        {postDesc && postDesc !== postTitle ? (
          <Text style={[styles.postDesc, { color: colors.textSecondary }]} numberOfLines={2}>
            {postDesc}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <View style={styles.engagementGroup}>
            <View style={styles.metaItem}>
              <Feather name="message-circle" size={13} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.textMuted }]}>{commentsCount} comments</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="heart" size={13} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.textMuted }]}>{likesCount} likes</Text>
            </View>
          </View>

          <View style={styles.linkGroup}>
            <Text style={[styles.linkText, { color: colors.primary }]}>Join Discussion</Text>
            <Feather name="chevron-right" size={14} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
  },
  viewAll: {
    fontSize: FONT.size.xs,
    fontWeight: '700',
  },
  emptyCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '700',
    marginTop: 2,
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 8,
    ...SHADOWS.small,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
  },
  postTime: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  catTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10B981',
  },
  pollBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  pollBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  postDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
    marginTop: 2,
  },
  engagementGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  linkGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reactionCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 6,
  },
  reactionCountText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
