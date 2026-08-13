import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Share,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import {
  fetchPostDetail,
  fetchCommunityComments,
  createCommunityComment,
  togglePostLike,
  toggleBookmark,
} from '@/services/supabaseService';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { PollCard } from '@/components/community/PollCard';
import { PostImagesGallery } from '@/components/community/PostImagesGallery';
import { VideoPostCard } from '@/components/community/VideoPostCard';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const loadData = async () => {
    if (!id) return;
    try {
      const data = await fetchPostDetail(id as string);
      if (data) {
        setPost(data);
        setLikesCount(data.likes_count || 0);
      }
      const commentData = await fetchCommunityComments(id as string);
      setComments(commentData || []);
    } catch (err) {
      console.warn('[PostDetailScreen] load error:', err);
    } finally {
      setLoading(false);
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleLike = async () => {
    if (!user?.id || !id) return;
    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      await togglePostLike(id as string, user.id);
    } catch (e) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleBookmark = async () => {
    if (!user?.id || !id) return;
    const prev = isBookmarked;
    setIsBookmarked(!prev);
    try {
      await toggleBookmark(user.id, id as string, 'community_post');
    } catch (e) {
      setIsBookmarked(prev);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !user?.id || !id) return;
    const text = commentText.trim();
    setSendingComment(true);

    try {
      await createCommunityComment(id as string, user.id, text);
      setCommentText('');
      const updated = await fetchCommunityComments(id as string);
      setComments(updated || []);
    } catch (err: any) {
      Alert.alert('Comment Failed', err?.message || 'Unable to post comment.');
    } finally {
      setSendingComment(false);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    try {
      await Share.share({
        message: `${post.title || 'FEEDX Post'}\n\n${post.caption || ''}\n\nShared via FEEDX App`,
        title: post.title,
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>Post not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.primary, fontWeight: '800' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const category = post.category || 'General';
  const postType = post.post_type || 'text';
  const title = post.title || 'Community Update';
  const caption = post.caption || post.description || '';
  const authorName = post.created_by_name || post.author_name || post.users?.full_name || 'FEEDX Official';
  const authorRole = post.users?.role || 'Campus Official';
  const formattedTime = post.created_at
    ? new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity onPress={handleShare}>
          <Feather name="share-2" size={19} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Author Header */}
        <View style={styles.authorRow}>
          <UserAvatar user={{ full_name: authorName } as any} size={42} />
          <View style={styles.authorTextWrap}>
            <Text style={[styles.authorName, { color: colors.textPrimary }]}>{authorName}</Text>
            <Text style={[styles.authorMeta, { color: colors.textMuted }]}>
              {authorRole} • {formattedTime}
            </Text>
          </View>
          <View style={styles.catBadge}>
            <Text style={styles.catBadgeText}>{category.toUpperCase()}</Text>
          </View>
        </View>

        {/* Complete Title */}
        <Text style={[styles.fullTitle, { color: colors.textPrimary }]}>{title}</Text>

        {/* Media Content */}
        <View style={styles.mediaWrap}>
          {post.poll || postType === 'poll' ? (
            <PollCard poll={post.poll || post} studentId={user?.id} />
          ) : postType === 'video' || post.video_url ? (
            <VideoPostCard videoUrl={post.video_url} thumbnailUrl={post.image_url} title={title} />
          ) : Array.isArray(post.images) && post.images.length > 0 ? (
            <PostImagesGallery images={post.images} />
          ) : null}
        </View>

        {/* Complete Body Text */}
        {caption ? (
          <Text style={[styles.fullBodyText, { color: colors.textSecondary }]}>{caption}</Text>
        ) : null}

        {/* Engagement Action Bar */}
        <View style={[styles.engagementBar, { borderColor: colors.cardBorder }]}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <MaterialCommunityIcons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={isLiked ? '#EF4444' : colors.textSecondary}
            />
            <Text style={[styles.actionText, { color: isLiked ? '#EF4444' : colors.textSecondary }]}>
              {likesCount} Likes
            </Text>
          </TouchableOpacity>

          <View style={styles.actionBtn}>
            <Feather name="message-circle" size={19} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>{comments.length} Comments</Text>
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={handleBookmark}>
            <Feather
              name={isBookmarked ? 'bookmark' : 'bookmark'}
              size={19}
              color={isBookmarked ? '#F59E0B' : colors.textSecondary}
            />
            <Text style={[styles.actionText, { color: isBookmarked ? '#F59E0B' : colors.textSecondary }]}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Comments ({comments.length})</Text>

          {commentsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 12 }} />
          ) : comments.length === 0 ? (
            <Text style={[styles.noCommentsText, { color: colors.textMuted }]}>
              No comments yet. Be the first to comment!
            </Text>
          ) : (
            comments.map((item) => (
              <View key={item.id} style={[styles.commentItem, { borderColor: colors.cardBorder }]}>
                <UserAvatar user={item.users || { full_name: item.student_id }} size={32} />
                <View style={styles.commentContent}>
                  <View style={styles.commentTopRow}>
                    <Text style={[styles.commentAuthor, { color: colors.textPrimary }]}>
                      {item.users?.full_name || 'Student'}
                    </Text>
                    <Text style={[styles.commentTime, { color: colors.textMuted }]}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[styles.commentBody, { color: colors.textSecondary }]}>{item.comment}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Comment Input Bar */}
      <View style={[styles.inputBar, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TextInput
          style={[styles.textInput, { color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Write a comment..."
          placeholderTextColor={colors.textMuted}
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.primary }, (!commentText.trim() || sendingComment) && { opacity: 0.5 }]}
          onPress={handleSendComment}
          disabled={!commentText.trim() || sendingComment}
        >
          {sendingComment ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Feather name="send" size={16} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: 52,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FONT.size.md,
    fontWeight: '800',
    flex: 1,
    marginHorizontal: 12,
  },
  scrollBody: {
    padding: SPACING.md,
    paddingBottom: 40,
    gap: 14,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorTextWrap: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '800',
  },
  authorMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  catBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#3B82F6',
  },
  fullTitle: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  mediaWrap: {
    marginVertical: 4,
  },
  fullBodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  engagementBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  commentsSection: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
  },
  noCommentsText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  commentItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  commentContent: {
    flex: 1,
  },
  commentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '800',
  },
  commentTime: {
    fontSize: 10,
  },
  commentBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
