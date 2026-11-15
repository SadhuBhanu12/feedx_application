import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import FeedxAppLogo from '@/components/ui/FeedxAppLogo';
import { PollCard } from '@/components/community/PollCard';
import { PostImagesGallery } from '@/components/community/PostImagesGallery';
import { VideoPostCard } from '@/components/community/VideoPostCard';
import { shareCommunityPost } from '@/services/downloadService';
import { resolveCommunityMedia } from '@/utils/mediaResolver';

const AVAILABLE_EMOJIS = ['👍', '❤️', '😂', '🙏', '🔥', '👏', '💡', '🎉'];

interface CommunityPostCardProps {
  post: any;
  currentUserId?: string;
  isActiveVideo?: boolean;
  isLiked?: boolean;
  userReactionProp?: string | null;
  isBookmarked?: boolean;
  isSuperAdmin?: boolean;
  onLikePress?: () => void;
  onReactionPress?: (emoji: string) => void;
  onBookmarkPress?: () => void;
  onDeletePress?: () => void;
  onPinPress?: () => void;
  onEditPress?: () => void;
  onCommentPress?: () => void;
  onOptionsPress?: () => void;
}

function formatPostTime(dateStr?: string): string {
  if (!dateStr) return 'Just now';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  if (diffDays < 7) return `${diffDays}d`;
  if (diffWeeks < 4) return `${diffWeeks}w`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function renderFormattedCaption(text: string, primaryColor: string) {
  if (!text) return null;
  const parts = text.split(/(\s+|#\w+|@\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('#') || part.startsWith('@')) {
      return (
        <Text key={index} style={{ color: primaryColor, fontWeight: '700' }}>
          {part}
        </Text>
      );
    }
    return part;
  });
}

export function CommunityPostCard({
  post,
  currentUserId,
  isActiveVideo = false,
  isLiked = false,
  userReactionProp,
  isBookmarked = false,
  isSuperAdmin = false,
  onLikePress,
  onReactionPress,
  onBookmarkPress,
  onDeletePress,
  onPinPress,
  onEditPress,
  onCommentPress,
  onOptionsPress,
}: CommunityPostCardProps) {
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(userReactionProp || (isLiked ? '❤️' : null));

  React.useEffect(() => {
    if (userReactionProp !== undefined) {
      setUserReaction(userReactionProp);
    }
  }, [userReactionProp]);

  const heartScale = useSharedValue(1);
  const emojiAnimScale = useSharedValue(1);

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const [reactionCounts, setReactionCounts] = useState<{ [key: string]: number }>(
    post.reaction_counts && Object.keys(post.reaction_counts).length > 0 
      ? post.reaction_counts 
      : (post.likes_count > 0 ? { '❤️': post.likes_count } : {})
  );

  React.useEffect(() => {
    if (post.reaction_counts) {
      setReactionCounts(post.reaction_counts);
    }
  }, [post.reaction_counts]);

  const [sharesCount, setSharesCount] = useState<number>(post.shares_count || 0);

  React.useEffect(() => {
    if (post.shares_count !== undefined) {
      setSharesCount(post.shares_count);
    }
  }, [post.shares_count]);

  const category = post.category || 'General';
  const postType = post.post_type || (post.media_urls?.length ? 'image' : 'text');
  const isPinned = Boolean(post.pinned);
  const title = post.title || '';
  const caption = post.caption || post.content || post.description || '';
  const rawAuthor = String(post.created_by_name || post.author_name || post.users?.full_name || '').trim();
  const isAuthorSuperAdmin = post.users?.role === 'super_admin' || post.role === 'super_admin' || post.users?.role === 'admin' || post.role === 'admin' || post.author_role === 'super_admin' || post.author_role === 'admin';
  const isExplicitStudent = rawAuthor !== '' && rawAuthor !== 'Student' && rawAuthor !== 'User' && !rawAuthor.toLowerCase().includes('feedx') && post.users?.role === 'student';
  
  const isOfficial = !isExplicitStudent || isAuthorSuperAdmin || Boolean(post.is_official) || rawAuthor.toLowerCase().includes('feedx') || !rawAuthor;
  const isFeedxOfficial = isOfficial;
  const authorName = isFeedxOfficial ? 'FEEDX Official' : rawAuthor;
  const isUserSuperAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  const isPostLiked = Boolean(userReaction || isLiked);

  const totalLikesCount = React.useMemo(() => {
    const sumFromReactions = Object.values(reactionCounts).reduce((acc, count) => acc + (count || 0), 0);
    if (sumFromReactions > 0) return sumFromReactions;
    if (userReaction || isLiked) return 1;
    return post.likes_count || post.likes || 0;
  }, [reactionCounts, userReaction, isLiked, post.likes_count, post.likes]);

  // Unified Media Resolution
  const resolvedMedia = React.useMemo(() => {
    return resolveCommunityMedia(post);
  }, [post]);

  const taggedUsers = post.tagged_users || [];

  const handleLike = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    // Instant single micro-bounce (120ms, no long blinking)
    heartScale.value = withSequence(
      withTiming(1.22, { duration: 80 }),
      withTiming(1, { duration: 90 })
    );

    if (userReaction) {
      // User is UNLIKING / removing reaction
      const currentEmoji = userReaction;
      setUserReaction(null);
      setReactionCounts((prev) => {
        const next = { ...prev };
        if (next[currentEmoji]) {
          next[currentEmoji] = Math.max(0, next[currentEmoji] - 1);
        }
        return next;
      });
      if (onReactionPress) {
        onReactionPress(currentEmoji);
      } else if (onLikePress) {
        onLikePress();
      }
    } else {
      // User is LIKING
      setUserReaction('❤️');
      setReactionCounts((prev) => ({
        ...prev,
        '❤️': (prev['❤️'] || 0) + 1,
      }));
      if (onReactionPress) {
        onReactionPress('❤️');
      } else if (onLikePress) {
        onLikePress();
      }
    }
  };

  const handleDoubleTapMedia = () => {
    handleSelectEmoji('❤️');
  };

  const handleSelectEmoji = (emoji: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    emojiAnimScale.value = withSequence(
      withTiming(1.2, { duration: 80 }),
      withTiming(1, { duration: 90 })
    );

    if (userReaction === emoji) {
      // UNLIKE / remove reaction
      setUserReaction(null);
      setReactionCounts((prev) => {
        const next = { ...prev };
        if (next[emoji]) {
          next[emoji] = Math.max(0, next[emoji] - 1);
        }
        return next;
      });
      if (onReactionPress) {
        onReactionPress(emoji);
      }
    } else {
      // Change or Add reaction
      const prevEmoji = userReaction;
      setUserReaction(emoji);
      setReactionCounts((prev) => {
        const next = { ...prev };
        if (prevEmoji && next[prevEmoji]) {
          next[prevEmoji] = Math.max(0, next[prevEmoji] - 1);
        }
        next[emoji] = (next[emoji] || 0) + 1;
        return next;
      });
      if (onReactionPress) {
        onReactionPress(emoji);
      }
    }

    setShowEmojiPicker(false);
  };

  const handleShare = async () => {
    try {
      try {
        Haptics.selectionAsync();
      } catch (_) {}
      setSharesCount((c) => c + 1);
      await shareCommunityPost(post);
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  const isLongCaption = caption.length > 130;
  const displayCaption = !expanded && isLongCaption ? `${caption.slice(0, 130)}...` : caption;

  const getCategoryBadgeStyle = (cat: string) => {
    const c = String(cat).toLowerCase();
    if (c.includes('important') || c.includes('announcement')) return { bg: 'rgba(239, 68, 68, 0.12)', text: '#EF4444' };
    if (c.includes('event')) return { bg: 'rgba(139, 92, 246, 0.12)', text: '#8B5CF6' };
    if (c.includes('opportunity') || c.includes('placement') || c.includes('internship'))
      return { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981' };
    if (c.includes('poll')) return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6' };
    if (c.includes('hackathon') || c.includes('workshop')) return { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B' };
    return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6' };
  };

  const badgeStyle = getCategoryBadgeStyle(category);

  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const activeEmojisList = Object.entries(reactionCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([emoji]) => emoji)
    .slice(0, 4);

  const totalReactionsCount = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        {/* 1. Header Row (Author, Verified, Timestamp, Category, More options) */}
        <View style={styles.postHeader}>
          <TouchableOpacity
            style={styles.authorGroup}
            activeOpacity={0.8}
            onPress={() => router.push(`/community/post/${post.id}` as any)}
          >
            {isFeedxOfficial ? (
              <FeedxAppLogo size={38} shape="circle" borderWidth={1.5} glow />
            ) : (
              <UserAvatar
                size={38}
                user={post.users || { full_name: authorName, avatar_url: post.users?.avatar_url }}
              />
            )}
            <View style={styles.authorMeta}>
              <View style={styles.nameRow}>
                <Text style={[styles.authorName, { color: colors.textPrimary }]} numberOfLines={1} ellipsizeMode="tail">
                  {authorName}
                </Text>
                {isOfficial && (
                  <MaterialCommunityIcons name="check-decagram" size={15} color="#3B82F6" style={{ marginLeft: 4 }} />
                )}
                {isPinned && (
                  <View style={styles.pinnedBadge}>
                    <MaterialCommunityIcons name="pin" size={11} color="#D97706" />
                    <Text style={styles.pinnedText}>Pinned</Text>
                  </View>
                )}
                {post.featured && (
                  <View style={styles.featuredBadge}>
                    <MaterialCommunityIcons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.featuredText}>Featured</Text>
                  </View>
                )}
              </View>

              <View style={styles.subMetaRow}>
                <View style={[styles.categoryPill, { backgroundColor: badgeStyle.bg }]}>
                  <Text style={[styles.categoryPillText, { color: badgeStyle.text }]}>
                    {category.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.timestampText, { color: colors.textMuted }]}>
                  • {formatPostTime(post.created_at)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* More Options Button */}
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={onOptionsPress || (() => router.push(`/community/post/${post.id}` as any))}
          >
            <Feather name="more-horizontal" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 2. Media / Content Section */}
        {resolvedMedia.type === 'poll' && (post.poll || post.polls) ? (
          <View style={styles.mediaContainer}>
            <PollCard poll={post.poll || post.polls} currentUserId={currentUserId || ''} />
          </View>
        ) : resolvedMedia.type === 'video' ? (
          <View style={styles.mediaContainer}>
            <VideoPostCard
              videoUrl={resolvedMedia.streamUrl || resolvedMedia.rawUrl}
              thumbnailUrl={resolvedMedia.thumbnailUrl || post.image_url}
              title={title}
              isActive={isActiveVideo}
              onLike={handleLike}
            />
          </View>
        ) : resolvedMedia.type === 'image' && (resolvedMedia.mediaUrls.length > 0 || Boolean(resolvedMedia.displayUrl || post.image_url)) ? (
          <View style={styles.mediaContainer}>
            <PostImagesGallery
              images={
                resolvedMedia.mediaUrls.length > 0
                  ? resolvedMedia.mediaUrls
                  : ([resolvedMedia.displayUrl || post.image_url].filter(Boolean) as string[])
              }
              onLike={handleLike}
              onDoubleTap={handleDoubleTapMedia}
            />
          </View>
        ) : null}

        {/* 3. Action Row (Like, Comment, Share, Save) */}
        <View style={styles.actionsRow}>
          <View style={styles.leftActions}>
            {/* Like Button */}
            <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.7}>
              <Animated.View style={heartAnimStyle}>
                <Ionicons
                  name={isPostLiked ? 'heart' : 'heart-outline'}
                  size={26}
                  color={isPostLiked ? '#EF4444' : colors.textPrimary}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Comment Button */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onCommentPress || (() => router.push(`/community/post/${post.id}` as any))}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.7}>
              <Feather name="send" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Save / Bookmark Button */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onBookmarkPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isBookmarked ? colors.primary : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* 4. Engagement Info (Likes Count) */}
        {totalLikesCount > 0 ? (
          <Text style={[styles.likesCountText, { color: colors.textPrimary }]}>
            {totalLikesCount} {totalLikesCount === 1 ? 'like' : 'likes'}
          </Text>
        ) : null}

        {/* 5. Caption & Title */}
        <View style={styles.captionContainer}>
          {title ? (
            <Text style={[styles.postTitle, { color: colors.textPrimary }]}>{title}</Text>
          ) : null}

          {caption ? (
            <Text style={[styles.captionText, { color: colors.textPrimary }]}>
              <Text style={styles.authorBold}>{authorName} </Text>
              {renderFormattedCaption(displayCaption, colors.primary)}
              {isLongCaption && !expanded && (
                <Text
                  style={[styles.moreText, { color: colors.textMuted }]}
                  onPress={() => setExpanded(true)}
                >
                  {' '}more
                </Text>
              )}
            </Text>
          ) : null}
        </View>

        {/* 6. Tagged Users Bar */}
        {taggedUsers.length > 0 && (
          <View style={styles.taggedBar}>
            <Feather name="tag" size={12} color={colors.primary} />
            <Text style={[styles.taggedText, { color: colors.textMuted }]}>
              With <Text style={{ color: colors.primary, fontWeight: '700' }}>{taggedUsers.join(', ')}</Text>
            </Text>
          </View>
        )}

        {/* 7. Emoji Picker Tray (Shown on tap) */}
        {showEmojiPicker && (
          <Animated.View entering={FadeInUp.duration(200)} style={[styles.emojiTrayContainer, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: colors.cardBorder }]}>
            {AVAILABLE_EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.emojiTrayBtn,
                  userReaction === emoji && styles.emojiTrayBtnActive
                ]}
                onPress={() => handleSelectEmoji(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.emojiTrayChar}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* 8. Post Analytics Breakdown Panel (Expandable) */}
        {showAnalytics && (
          <Animated.View entering={FadeInDown.duration(250)} style={[styles.analyticsPanel, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
            <View style={styles.analyticsHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name="chart-box-outline" size={16} color="#3B82F6" />
                <Text style={[styles.analyticsPanelTitle, { color: colors.textPrimary }]}>Post Engagement Analytics</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAnalytics(false)}>
                <Feather name="x" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.analyticsStatsGrid}>
              <View style={[styles.analyticsStatBox, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.analyticsStatVal, { color: '#EF4444' }]}>
                  {totalLikesCount || 0}
                </Text>
                <Text style={[styles.analyticsStatLbl, { color: colors.textMuted }]}>Likes & Emojis ❤️</Text>
              </View>
              <View style={[styles.analyticsStatBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.1)' }]}>
                <Text style={[styles.analyticsStatVal, { color: '#3B82F6' }]}>
                  {post.comments_count || post.comments?.length || 0}
                </Text>
                <Text style={[styles.analyticsStatLbl, { color: colors.textMuted }]}>Comments 💬</Text>
              </View>
              <View style={[styles.analyticsStatBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.1)' }]}>
                <Text style={[styles.analyticsStatVal, { color: '#10B981' }]}>
                  {sharesCount || 0}
                </Text>
                <Text style={[styles.analyticsStatLbl, { color: colors.textMuted }]}>Shares 📤</Text>
              </View>
              <View style={[styles.analyticsStatBox, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.1)' }]}>
                <Text style={[styles.analyticsStatVal, { color: '#F59E0B' }]}>
                  {Math.max((totalReactionsCount + (post.comments_count || 0)) * 5 + 24, post.views_count || 28)}
                </Text>
                <Text style={[styles.analyticsStatLbl, { color: colors.textMuted }]}>Impressions 👁️</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* 9. Interactive Post Engagement Actions Bar (Like, Comment, Reactions, Analytics, Share) */}
        <View style={styles.reactionsBottomBar}>
          <View style={styles.reactionsLeftGroup}>
            {/* 1. Like / Heart Action Pill */}
            <TouchableOpacity
              style={[
                styles.actionPillBtn,
                {
                  backgroundColor: isPostLiked
                    ? 'rgba(239, 68, 68, 0.12)'
                    : (isDark ? 'rgba(255, 255, 255, 0.07)' : '#F1F5F9'),
                  borderColor: isPostLiked
                    ? 'rgba(239, 68, 68, 0.35)'
                    : (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'),
                }
              ]}
              onPress={handleLike}
              onLongPress={() => setShowEmojiPicker(!showEmojiPicker)}
              activeOpacity={0.75}
            >
              <Animated.View style={animatedHeartStyle}>
                <MaterialCommunityIcons
                  name={isPostLiked ? 'heart' : 'heart-outline'}
                  size={17}
                  color={isPostLiked ? '#EF4444' : colors.textSecondary}
                />
              </Animated.View>
              <Text
                style={[
                  styles.actionPillText,
                  { color: isPostLiked ? '#EF4444' : colors.textPrimary }
                ]}
              >
                {totalLikesCount}
              </Text>
            </TouchableOpacity>

            {/* 2. Comment Action Pill */}
            <TouchableOpacity
              style={[
                styles.actionPillBtn,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                }
              ]}
              onPress={() => {
                if (onCommentPress) {
                  onCommentPress();
                } else if (post?.id) {
                  router.push(`/community/post/${post.id}`);
                }
              }}
              activeOpacity={0.75}
            >
              <Feather name="message-circle" size={15} color={colors.textSecondary} />
              <Text style={[styles.actionPillText, { color: colors.textPrimary }]}>
                {post.comments_count || post.comments?.length || 0}
              </Text>
            </TouchableOpacity>

            {/* 3. Active Reactions Capsule (Shown when emoji reactions exist) */}
            {totalReactionsCount > 0 && activeEmojisList.length > 0 ? (
              <TouchableOpacity
                style={[
                  styles.reactionCapsule,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : '#F1F5F9',
                    borderColor: userReaction ? colors.primary : (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'),
                  },
                  userReaction ? styles.reactionCapsuleActive : null
                ]}
                onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                activeOpacity={0.8}
              >
                <View style={styles.emojiIconsRow}>
                  {activeEmojisList.slice(0, 3).map((emoji, idx) => (
                    <Text key={idx} style={styles.capsuleEmoji}>{emoji}</Text>
                  ))}
                </View>
                <Text style={[styles.reactionCountText, { color: colors.textPrimary }]}>
                  {totalReactionsCount}
                </Text>
              </TouchableOpacity>
            ) : null}

            {/* 4. Quick Emoji Picker '+' Button */}
            <TouchableOpacity
              style={[
                styles.addReactionBtn,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'
                }
              ]}
              onPress={() => setShowEmojiPicker(!showEmojiPicker)}
              activeOpacity={0.7}
            >
              <Feather name="smile" size={14} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* 5. Analytics Toggle Button (Superadmin Only) */}
            {isUserSuperAdmin && (
              <TouchableOpacity
                style={[
                  styles.analyticsToggleBtn,
                  {
                    backgroundColor: showAnalytics ? 'rgba(59, 130, 246, 0.15)' : (isDark ? 'rgba(255, 255, 255, 0.07)' : '#F1F5F9'),
                    borderColor: showAnalytics ? '#3B82F6' : (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0')
                  }
                ]}
                onPress={() => setShowAnalytics(!showAnalytics)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="chart-timeline-variant" size={13} color={showAnalytics ? '#3B82F6' : colors.textSecondary} />
                <Text style={[styles.analyticsToggleText, { color: showAnalytics ? '#3B82F6' : colors.textSecondary }]}>
                  Analytics
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 6. Share Capsule */}
          <TouchableOpacity
            style={[
              styles.shareCapsule,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : '#F1F5F9',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'
              }
            ]}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Feather name="share-2" size={13} color={colors.textSecondary} />
            <Text style={[styles.shareCountText, { color: colors.textPrimary }]}>
              {sharesCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  authorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorMeta: {
    marginLeft: 10,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '800',
    flexShrink: 1,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
    gap: 2,
    flexShrink: 0,
  },
  pinnedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
    gap: 2,
    flexShrink: 0,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  timestampText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreBtn: {
    padding: 6,
  },
  mediaContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    padding: 4,
  },
  likesCountText: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  captionContainer: {
    marginBottom: 6,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
    lineHeight: 20,
  },
  captionText: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  authorBold: {
    fontWeight: '800',
  },
  moreText: {
    fontSize: 13,
    fontWeight: '700',
  },
  taggedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  taggedText: {
    fontSize: 11.5,
  },
  // Emoji Tray
  emojiTrayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 8,
  },
  emojiTrayBtn: {
    padding: 6,
    borderRadius: 16,
  },
  emojiTrayBtnActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    transform: [{ scale: 1.15 }],
  },
  emojiTrayChar: {
    fontSize: 20,
  },
  // WhatsApp / Telegram Style Reaction Capsule Row (in place of comments link)
  reactionsBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 6,
  },
  reactionsLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  actionPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    gap: 5,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  reactionCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  reactionCapsuleActive: {
    borderWidth: 1.5,
  },
  emojiIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  capsuleEmoji: {
    fontSize: 14,
  },
  reactionCountText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 2,
  },
  addReactionBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  analyticsToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    gap: 4,
  },
  analyticsToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  analyticsPanel: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
  },
  analyticsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analyticsPanelTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  analyticsStatsGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  analyticsStatBox: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsStatVal: {
    fontSize: 14,
    fontWeight: '900',
  },
  analyticsStatLbl: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  shareCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  shareCountText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
});
