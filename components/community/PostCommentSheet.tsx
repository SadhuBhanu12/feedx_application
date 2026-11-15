import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import FeedxAppLogo from '@/components/ui/FeedxAppLogo';
import {
  fetchCommunityComments,
  createCommunityComment,
  deleteCommunityComment,
  toggleCommentLike,
} from '@/services/supabaseService';
import { SPACING, FONT, RADIUS } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PostCommentSheetProps {
  visible: boolean;
  postId: string | null;
  postTitle?: string;
  onClose: () => void;
  onCommentCountChange?: (count: number) => void;
}

function formatRelativeTime(dateStr?: string): string {
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

export function PostCommentSheet({
  visible,
  postId,
  postTitle,
  onClose,
  onCommentCountChange,
}: PostCommentSheetProps) {
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const inputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [commentText, setCommentText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const loadComments = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const data = await fetchCommunityComments(postId);
      setComments(data || []);
      if (onCommentCountChange) {
        onCommentCountChange(data?.length || 0);
      }
    } catch (e) {
      console.warn('[PostCommentSheet] Load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && postId) {
      loadComments();
    } else {
      setReplyingTo(null);
      setCommentText('');
    }
  }, [visible, postId]);

  const handleSend = async () => {
    if (!commentText.trim() || !postId || !user?.id) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    setSubmitting(true);
    try {
      const payload: any = {
        post_id: postId,
        student_id: user.id,
        user_id: user.id,
        content: commentText.trim(),
      };

      if (replyingTo) {
        payload.parent_id = replyingTo.id;
      }

      const res = await createCommunityComment(payload);
      if (res) {
        setCommentText('');
        setReplyingTo(null);
        await loadComments();
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 150);
      }
    } catch (err: any) {
      const msg = err?.message || 'Could not post comment. Please try again.';
      if (msg.includes('is_deleted') || msg.includes('fix_community_comments_is_deleted')) {
        Alert.alert(
          'Database Setup Required',
          'Please execute the script "supabase/fix_community_comments_is_deleted.sql" in your Supabase SQL Editor to enable comments.'
        );
      } else {
        Alert.alert('Notice', msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string, currentLiked: boolean, currentLikes: number) => {
    if (!user?.id) return;
    try {
      Haptics.selectionAsync();
    } catch (_) {}

    setLikedComments((prev) => ({ ...prev, [commentId]: !currentLiked }));
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likes_count: currentLiked ? Math.max(0, (c.likes_count || 1) - 1) : (c.likes_count || 0) + 1,
            hasLiked: !currentLiked,
          };
        }
        return c;
      })
    );

    try {
      await toggleCommentLike(commentId, user.id);
    } catch (e) {
      console.warn('[PostCommentSheet] Like comment error:', e);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCommunityComment(commentId);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
          } catch (e) {
            Alert.alert('Error', 'Could not delete comment.');
          }
        },
      },
    ]);
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // Group top-level comments and replies
  const topLevelComments = comments.filter((c) => !c.parent_id);
  const repliesMap: Record<string, any[]> = {};
  comments.forEach((c) => {
    if (c.parent_id) {
      if (!repliesMap[c.parent_id]) repliesMap[c.parent_id] = [];
      repliesMap[c.parent_id].push(c);
    }
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={[styles.sheetContainer, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
          {/* Grab Handle */}
          <View style={styles.grabHandleWrap}>
            <View style={[styles.grabHandle, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />
          </View>

          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
            <View style={{ width: 32 }} />
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Comments {comments.length > 0 ? `(${comments.length})` : ''}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.centerContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={44} color={colors.textMuted} style={{ marginBottom: 8 }} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No comments yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                Start the conversation with FEEDX!
              </Text>
            </View>
          ) : (
            <ScrollView
              ref={scrollRef}
              style={styles.commentList}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            >
              {topLevelComments.map((c) => {
                const rawAuthor = c.users?.full_name || c.author_name || 'Student';
                const authorRole = c.users?.role || '';
                const isOfficial = authorRole === 'super_admin' || authorRole === 'admin' || String(rawAuthor).toLowerCase().includes('feedx');
                const authorName = isOfficial ? 'FEEDX Official' : rawAuthor;
                const isAuthorSelf = c.user_id === user?.id || c.student_id === user?.id;
                const isLiked = Boolean(c.hasLiked || likedComments[c.id]);
                const commentLikesCount = c.likes_count || 0;
                const replies = repliesMap[c.id] || [];
                const showReplies = expandedReplies[c.id];

                const isFeedxComment = isOfficial;

                return (
                  <View key={c.id} style={styles.commentItem}>
                    {/* Avatar */}
                    {isFeedxComment ? (
                      <FeedxAppLogo size={36} shape="circle" borderWidth={1.5} glow />
                    ) : (
                      <UserAvatar
                        size={36}
                        avatarUrl={c.users?.avatar_url}
                        fullName={authorName}
                      />
                    )}

                    {/* Comment Content */}
                    <View style={styles.commentBody}>
                      <View style={styles.authorRow}>
                        <Text style={[styles.authorName, { color: colors.textPrimary }]}>
                          {authorName}
                        </Text>
                        {isOfficial && (
                          <MaterialCommunityIcons name="check-decagram" size={14} color="#3B82F6" style={{ marginLeft: 4 }} />
                        )}
                        <Text style={[styles.timeAgo, { color: colors.textMuted }]}>
                          • {formatRelativeTime(c.created_at)}
                        </Text>
                      </View>

                      <Text style={[styles.commentText, { color: isDark ? '#E2E8F0' : '#1E293B' }]}>
                        {c.content || c.comment_text}
                      </Text>

                      {/* Comment Action Links */}
                      <View style={styles.commentActions}>
                        <TouchableOpacity
                          onPress={() => {
                            setReplyingTo({ id: c.id, author: authorName });
                            setCommentText(`@${authorName} `);
                            inputRef.current?.focus();
                          }}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                        >
                          <Feather name="corner-up-left" size={13} color={colors.textMuted} />
                          <Text style={[styles.actionLink, { color: colors.textMuted }]}>Reply</Text>
                        </TouchableOpacity>

                        {isAuthorSelf && (
                          <TouchableOpacity
                            onPress={() => handleDeleteComment(c.id)}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 16 }}
                          >
                            <Feather name="trash-2" size={13} color="#EF4444" />
                            <Text style={[styles.actionLink, { color: '#EF4444' }]}>Delete</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Nested Replies Section */}
                      {replies.length > 0 && (
                        <View style={{ marginTop: 10 }}>
                          <TouchableOpacity
                            style={styles.viewRepliesBtn}
                            onPress={() => toggleReplies(c.id)}
                          >
                            <View style={styles.repliesLine} />
                            <Text style={[styles.viewRepliesText, { color: colors.primary }]}>
                              {showReplies
                                ? 'Hide replies'
                                : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
                            </Text>
                          </TouchableOpacity>

                          {showReplies && (
                            <View style={styles.repliesContainer}>
                              {replies.map((rep) => {
                                const rawRepAuthor = rep.users?.full_name || rep.author_name || 'Student';
                                const repRole = rep.users?.role || '';
                                const isRepOfficial = repRole === 'super_admin' || repRole === 'admin' || String(rawRepAuthor).toLowerCase().includes('feedx');
                                const repAuthor = isRepOfficial ? 'FEEDX Official' : rawRepAuthor;
                                const repIsSelf = rep.user_id === user?.id || rep.student_id === user?.id;

                                return (
                                  <View key={rep.id} style={styles.replyItem}>
                                    {isRepOfficial ? (
                                      <FeedxAppLogo size={28} shape="circle" borderWidth={1} />
                                    ) : (
                                      <UserAvatar
                                        size={28}
                                        avatarUrl={rep.users?.avatar_url}
                                        fullName={repAuthor}
                                      />
                                    )}
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                      <View style={styles.authorRow}>
                                        <Text style={[styles.authorName, { fontSize: 12, color: colors.textPrimary }]}>
                                          {repAuthor}
                                        </Text>
                                        {isRepOfficial && (
                                          <MaterialCommunityIcons name="check-decagram" size={12} color="#3B82F6" style={{ marginLeft: 3 }} />
                                        )}
                                        <Text style={[styles.timeAgo, { color: colors.textMuted }]}>
                                          • {formatRelativeTime(rep.created_at)}
                                        </Text>
                                      </View>
                                      <Text style={[styles.commentText, { fontSize: 13, color: isDark ? '#E2E8F0' : '#1E293B' }]}>
                                        {rep.content || rep.comment_text}
                                      </Text>
                                      {repIsSelf && (
                                        <TouchableOpacity
                                          onPress={() => handleDeleteComment(rep.id)}
                                          style={{ marginTop: 4 }}
                                        >
                                          <Text style={[styles.actionLink, { color: '#EF4444' }]}>Delete</Text>
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  </View>
                                );
                              })}
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    {/* Like Comment Heart Button */}
                    <TouchableOpacity
                      style={styles.likeCommentBtn}
                      onPress={() => handleLikeComment(c.id, isLiked, commentLikesCount)}
                    >
                      <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={16}
                        color={isLiked ? '#EF4444' : colors.textMuted}
                      />
                      {commentLikesCount > 0 && (
                        <Text style={[styles.commentLikesCount, { color: colors.textMuted }]}>
                          {commentLikesCount}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          )}

          {/* Replying Banner */}
          {replyingTo && (
            <View style={[styles.replyingBanner, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
              <Text style={[styles.replyingText, { color: colors.textMuted }]}>
                Replying to <Text style={{ fontWeight: '800', color: colors.primary }}>@{replyingTo.author}</Text>
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          )}

          {/* Sticky Composer */}
          <View style={[styles.composerWrap, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopColor: isDark ? '#334155' : '#E2E8F0' }]}>
            <UserAvatar
              size={34}
              avatarUrl={user?.avatar_url}
              fullName={user?.full_name || 'Student'}
            />
            <TextInput
              ref={inputRef}
              value={commentText}
              onChangeText={setCommentText}
              placeholder={`Add a comment as ${user?.full_name?.split(' ')[0] || 'student'}...`}
              placeholderTextColor={colors.textMuted}
              style={[styles.inputField, { color: colors.textPrimary }]}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                { opacity: commentText.trim() && !submitting ? 1 : 0.4 },
              ]}
              disabled={!commentText.trim() || submitting}
              onPress={handleSend}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={[styles.sendBtnText, { color: colors.primary }]}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    height: SCREEN_HEIGHT * 0.72,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  grabHandleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  grabHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  commentList: {
    flex: 1,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  commentBody: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '800',
  },
  timeAgo: {
    fontSize: 11,
    marginLeft: 6,
  },
  commentText: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  actionLink: {
    fontSize: 12,
    fontWeight: '700',
  },
  likeCommentBtn: {
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 6,
  },
  commentLikesCount: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  viewRepliesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  repliesLine: {
    width: 24,
    height: 1,
    marginRight: 8,
  },
  viewRepliesText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  repliesContainer: {
    marginTop: 10,
    marginLeft: 8,
    borderLeftWidth: 1.5,
    borderLeftColor: 'rgba(100, 116, 139, 0.2)',
    paddingLeft: 10,
  },
  replyItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  replyingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  replyingText: {
    fontSize: 12,
  },
  composerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  inputField: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 80,
    fontSize: 13.5,
    paddingVertical: 6,
  },
  sendBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  sendBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
