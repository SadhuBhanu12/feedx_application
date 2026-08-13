import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { PollCard } from '@/components/community/PollCard';
import { PostImagesGallery } from '@/components/community/PostImagesGallery';
import { VideoPostCard } from '@/components/community/VideoPostCard';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface CommunityPostCardProps {
  post: any;
  currentUserId: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isSuperAdmin?: boolean;
  onLikePress?: () => void;
  onBookmarkPress?: () => void;
  onDeletePress?: () => void;
  onPinPress?: () => void;
  onCommentPress?: () => void;
}

export function CommunityPostCard({
  post,
  currentUserId,
  isLiked = false,
  isBookmarked = false,
  isSuperAdmin = false,
  onLikePress,
  onBookmarkPress,
  onDeletePress,
  onPinPress,
  onCommentPress,
}: CommunityPostCardProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);

  const category = post.category || 'General';
  const postType = post.post_type || 'text';
  const isPinned = Boolean(post.pinned);
  const title = post.title || post.caption?.slice(0, 60) || 'Community Update';
  const caption = post.caption || post.description || '';
  const authorName = post.created_by_name || post.author_name || post.users?.full_name || 'FEEDX Official';
  const authorRole = post.users?.role || 'Campus Official';
  const likesCount = post.likes_count || 0;
  const commentsCount = post.comments_count || 0;

  const formattedTime = post.created_at
    ? new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : 'Recent';

  // Category Badge Colors
  const getCategoryBadgeStyle = (cat: string) => {
    const c = String(cat).toLowerCase();
    if (c.includes('important') || c.includes('announcement')) return { bg: 'rgba(239, 68, 68, 0.12)', text: '#EF4444' };
    if (c.includes('event')) return { bg: 'rgba(139, 92, 246, 0.12)', text: '#8B5CF6' };
    if (c.includes('opportunity') || c.includes('placement') || c.includes('internship'))
      return { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981' };
    if (c.includes('poll')) return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6' };
    if (c.includes('hackathon') || c.includes('workshop')) return { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B' };
    return { bg: 'rgba(20, 184, 166, 0.12)', text: '#14B8A6' };
  };

  const badgeStyle = getCategoryBadgeStyle(category);

  const handleShare = async () => {
    try {
      const shareMsg = `${title}\n\n${caption.slice(0, 150)}...\n\nRead more on FEEDX Community!`;
      await Share.share({ message: shareMsg, title });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  const isLongCaption = caption.length > 140;

  return (
    <Animated.View entering={FadeInDown.duration(350).springify()} style={styles.container}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        onPress={() => router.push(`/community/post/${post.id}` as any)}
        activeOpacity={0.92}
      >
        {/* Card Header: Category Badges + Pinned Tag + Timestamp */}
        <View style={styles.headerRow}>
          <View style={styles.badgeGroup}>
            <View style={[styles.catPill, { backgroundColor: badgeStyle.bg }]}>
              <Text style={[styles.catPillText, { color: badgeStyle.text }]}>{category.toUpperCase()}</Text>
            </View>

            {postType !== 'text' && postType !== 'image' && (
              <View style={[styles.catPill, { backgroundColor: 'rgba(100, 116, 139, 0.12)' }]}>
                <Text style={[styles.catPillText, { color: colors.textMuted }]}>{postType.toUpperCase()}</Text>
              </View>
            )}
          </View>

          <View style={styles.headerRight}>
            {isPinned && (
              <View style={styles.pinnedPill}>
                <MaterialCommunityIcons name="pin" size={12} color="#F59E0B" />
                <Text style={styles.pinnedText}>PINNED</Text>
              </View>
            )}
            <Text style={[styles.timeText, { color: colors.textMuted }]}>{formattedTime}</Text>

            {isSuperAdmin && (
              <TouchableOpacity onPress={onPinPress} style={{ padding: 2, marginLeft: 4 }}>
                <MaterialCommunityIcons name={isPinned ? 'pin-off' : 'pin-outline'} size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.titleText, { color: colors.textPrimary }]} numberOfLines={2}>
          {title}
        </Text>

        {/* Description Preview */}
        {caption ? (
          <View style={styles.descWrap}>
            <Text style={[styles.descText, { color: colors.textSecondary }]} numberOfLines={expanded ? undefined : 3}>
              {caption}
            </Text>
            {isLongCaption && !expanded && (
              <TouchableOpacity onPress={() => setExpanded(true)}>
                <Text style={[styles.readMoreText, { color: colors.primary }]}>Read more</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {/* Dynamic Media Section */}
        <View style={styles.mediaContainer}>
          {post.poll || postType === 'poll' ? (
            <PollCard poll={post.poll || post} studentId={currentUserId} />
          ) : postType === 'video' || post.video_url ? (
            <VideoPostCard videoUrl={post.video_url} thumbnailUrl={post.image_url} title={title} />
          ) : Array.isArray(post.images) && post.images.length > 0 ? (
            <PostImagesGallery images={post.images} />
          ) : null}
        </View>

        {/* Author / Source Row */}
        <View style={styles.authorRow}>
          <UserAvatar user={{ full_name: authorName } as any} size={28} />
          <View style={styles.authorTextWrap}>
            <Text style={[styles.authorName, { color: colors.textPrimary }]} numberOfLines={1}>
              {authorName}
            </Text>
            <Text style={[styles.authorRole, { color: colors.textMuted }]}>{authorRole}</Text>
          </View>

          {isSuperAdmin && (
            <TouchableOpacity onPress={onDeletePress} style={{ padding: 4 }}>
              <Feather name="trash-2" size={15} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>

        {/* Engagement Footer Bar */}
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.actionItem} onPress={onLikePress} activeOpacity={0.7}>
            <MaterialCommunityIcons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={18}
              color={isLiked ? '#EF4444' : colors.textSecondary}
            />
            <Text style={[styles.actionText, { color: isLiked ? '#EF4444' : colors.textSecondary }]}>
              {likesCount} Like
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={onCommentPress} activeOpacity={0.7}>
            <Feather name="message-circle" size={17} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>{commentsCount} Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleShare} activeOpacity={0.7}>
            <Feather name="share-2" size={16} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={onBookmarkPress} activeOpacity={0.7}>
            <Feather
              name={isBookmarked ? 'bookmark' : 'bookmark'}
              size={17}
              color={isBookmarked ? '#F59E0B' : colors.textSecondary}
            />
            <Text style={[styles.actionText, { color: isBookmarked ? '#F59E0B' : colors.textSecondary }]}>Save</Text>
          </TouchableOpacity>
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
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 10,
    ...SHADOWS.small,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  catPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catPillText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinnedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pinnedText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#F59E0B',
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  descWrap: {
    gap: 2,
  },
  descText: {
    fontSize: 12,
    lineHeight: 18,
  },
  readMoreText: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  mediaContainer: {
    marginVertical: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  authorTextWrap: {
    flex: 1,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '800',
  },
  authorRole: {
    fontSize: 10,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
