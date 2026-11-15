import React, { useState, useEffect, useRef } from 'react';
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
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import {
  fetchPostDetail,
  fetchCommunityComments,
  createCommunityComment,
  deleteCommunityComment,
  reportCommunityItem,
  togglePostLike,
  toggleCommentLike,
  toggleBookmark,
} from '@/services/supabaseService';
import { UserAvatar } from '@/components/ui/UserAvatar';
import FeedxAppLogo from '@/components/ui/FeedxAppLogo';
import { PollCard } from '@/components/community/PollCard';
import { PostImagesGallery } from '@/components/community/PostImagesGallery';
import { downloadOrOpenFile } from '@/services/downloadService';
import { VideoPostCard } from '@/components/community/VideoPostCard';
import { resolveCommunityMedia } from '@/utils/mediaResolver';
import PressableCard from '@/components/ui/PressableCard';
import BookmarkButton from '@/components/ui/BookmarkButton';
import FeedxEmptyState from '@/components/ui/FeedxEmptyState';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likedCommentsMap, setLikedCommentsMap] = useState<Record<string, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const loadData = async () => {
    if (!id) return;
    try {
      const data = await fetchPostDetail(id as string, user?.id);
      if (data) {
        setPost(data);
        setLikesCount(data.likes_count || 0);
        setIsLiked(Boolean(data.hasLiked));
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

    if (!id) return;
    const channelName = `post_detail_rt_${id}_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_comments', filter: `post_id=eq.${id}` }, () => {
        fetchCommunityComments(id as string).then(data => {
          if (data) setComments(data);
        }).catch(() => {});
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_likes', filter: `post_id=eq.${id}` }, () => {
        fetchPostDetail(id as string, user?.id).then(data => {
          if (data) {
            setLikesCount(data.likes_count || 0);
          }
        }).catch(() => {});
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts', filter: `id=eq.${id}` }, () => {
        fetchPostDetail(id as string, user?.id).then(data => {
          if (data) {
            setPost(data);
            setLikesCount(data.likes_count || 0);
            setIsLiked(Boolean(data.hasLiked));
          }
        }).catch(() => {});
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user?.id]);

  const handleLike = async () => {
    if (!user?.id || !id) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await togglePostLike(id as string, user.id, prevLiked as any);
      if (res) {
        setIsLiked(res.hasLiked);
        setLikesCount(res.likes);
      }
    } catch (e) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleBookmark = async () => {
    if (!user?.id || !id) return;
    Haptics.selectionAsync();
    const prev = isBookmarked;
    setIsBookmarked(!prev);
    try {
      await toggleBookmark(user.id, 'community_post', id as string);
    } catch (e) {
      setIsBookmarked(prev);
    }
  };

  const handleStartReply = (commentId: string, authorName: string) => {
    Haptics.selectionAsync();
    const cleanAuthor = authorName.replace(/\s+/g, '');
    setReplyingTo({ id: commentId, author: cleanAuthor });
    setCommentText(`@${cleanAuthor} `);
  };

  const handleCancelReply = () => {
    Haptics.selectionAsync();
    setReplyingTo(null);
    setCommentText('');
  };

  const handleToggleReplies = (parentId: string) => {
    Haptics.selectionAsync();
    setExpandedReplies((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !user?.id || !id) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const text = commentText.trim();
    const parentId = replyingTo?.id || null;
    setSendingComment(true);

    try {
      await createCommunityComment(id as string, user.id, text, parentId as any);
      setCommentText('');
      setReplyingTo(null);
      if (parentId) {
        setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
      }
      const updated = await fetchCommunityComments(id as string);
      setComments(updated || []);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    } catch (err: any) {
      const msg = err?.message || 'Unable to post comment.';
      if (msg.includes('is_deleted') || msg.includes('fix_community_comments_is_deleted')) {
        Alert.alert(
          'Database Setup Required',
          'Please execute the script "supabase/fix_community_comments_is_deleted.sql" in your Supabase SQL Editor to enable comments.'
        );
      } else {
        Alert.alert('Comment Failed', msg);
      }
    } finally {
      setSendingComment(false);
    }
  };

  const handleToggleCommentLike = async (commentId: string) => {
    if (!user?.id) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isCurrentlyLiked = !!likedCommentsMap[commentId];

    setLikedCommentsMap((prev) => ({ ...prev, [commentId]: !isCurrentlyLiked }));
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const count = c.likes_count || 0;
          return { ...c, likes_count: isCurrentlyLiked ? Math.max(0, count - 1) : count + 1 };
        }
        return c;
      })
    );

    try {
      const res = await toggleCommentLike(commentId, user.id);
      if (res) {
        setLikedCommentsMap((prev) => ({ ...prev, [commentId]: res.liked }));
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, likes_count: res.likes_count } : c))
        );
      }
    } catch (e) {
      console.warn('Comment like error:', e);
    }
  };

  const handleDownloadMedia = async () => {
    if (!post) return;
    const mediaUrl = post.image_url || (Array.isArray(post.images) && post.images[0]);
    if (!mediaUrl) {
      Alert.alert('No Media', 'This post does not contain any downloadable images.');
      return;
    }
    const filename = mediaUrl.split('/').pop()?.split('?')[0] || 'feedx_community_post.jpg';
    await downloadOrOpenFile(mediaUrl, filename, 'Post Media');
  };

  const handleShare = async () => {
    if (!post) return;
    try {
      await Share.share({
        message: `${post.title || 'FEEDX Post'}\n\n${post.caption || ''}\n\nShared via FEEDX Polytechnic App`,
        title: post.title,
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCommunityComment(commentId, id as string);
            setComments((prev) => prev.filter((c) => c.id !== commentId && c.parent_id !== commentId));
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to delete comment.');
          }
        },
      },
    ]);
  };

  const handleReportComment = (commentId: string) => {
    Alert.alert('Report Comment', 'Select reason for reporting this comment to Superadmin:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Inappropriate Content',
        onPress: async () => {
          await reportCommunityItem({ commentId, userId: user?.id, reason: 'Inappropriate Content' });
          Alert.alert('Reported', 'Thank you. The Superadmin moderation team will review this comment.');
        },
      },
      {
        text: 'Spam or Harassment',
        onPress: async () => {
          await reportCommunityItem({ commentId, userId: user?.id, reason: 'Spam / Harassment' });
          Alert.alert('Reported', 'Thank you. The Superadmin moderation team will review this comment.');
        },
      },
    ]);
  };

  const handleReportPost = () => {
    Alert.alert('Report Post', 'Select reason for reporting this post to Superadmin:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Misinformation / Outdated',
        onPress: async () => {
          await reportCommunityItem({ postId: id as string, userId: user?.id, reason: 'Misinformation / Outdated' });
          Alert.alert('Reported', 'Thank you. The Superadmin team will review this report.');
        },
      },
      {
        text: 'Other Issue',
        onPress: async () => {
          await reportCommunityItem({ postId: id as string, userId: user?.id, reason: 'General report' });
          Alert.alert('Reported', 'Thank you. The Superadmin team will review this report.');
        },
      },
    ]);
  };

  const handleInsertTag = (username: string) => {
    Haptics.selectionAsync();
    setCommentText((prev) => `${prev}@${username} `);
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
        <FeedxEmptyState
          icon="info"
          title="Post Not Found"
          subtitle="This post may have been removed or is temporarily unavailable."
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const category = post.category || 'General';
  const postType = post.post_type || 'text';
  const title = post.title || 'Community Update';
  const caption = post.caption || post.description || '';
  const rawAuthor = String(post.created_by_name || post.author_name || post.users?.full_name || '').trim();
  const isAuthorSuperAdmin = post.users?.role === 'super_admin' || post.role === 'super_admin' || post.users?.role === 'admin' || post.role === 'admin' || post.author_role === 'super_admin' || post.author_role === 'admin';
  const isExplicitStudent = rawAuthor !== '' && rawAuthor !== 'Student' && rawAuthor !== 'User' && !rawAuthor.toLowerCase().includes('feedx') && post.users?.role === 'student';
  
  const isOfficial = !isExplicitStudent || isAuthorSuperAdmin || Boolean(post.is_official) || rawAuthor.toLowerCase().includes('feedx') || !rawAuthor;
  const isFeedxOfficial = isOfficial;
  const authorName = isFeedxOfficial ? 'FEEDX Official' : rawAuthor;
  const authorRole = post.users?.role || (isFeedxOfficial ? 'Campus Official' : 'Student');
  const formattedTime = post.created_at
    ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 1. Header Bar */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity onPress={handleReportPost} style={styles.headerBtn} activeOpacity={0.7}>
            <Feather name="flag" size={17} color={colors.textMuted} />
          </TouchableOpacity>
          {(post.image_url || (Array.isArray(post.images) && post.images.length > 0)) && (
            <TouchableOpacity onPress={handleDownloadMedia} style={styles.headerBtn} activeOpacity={0.7}>
              <Feather name="download" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleShare} style={styles.headerBtn} activeOpacity={0.7}>
            <Feather name="share-2" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Scrollable Post Content & Comments */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Post Card Container */}
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          {/* Post Author Header Row */}
          <View style={styles.authorRow}>
            {isFeedxOfficial ? (
              <FeedxAppLogo size={44} shape="circle" borderWidth={2} glow />
            ) : (
              <UserAvatar
                size={44}
                user={post.users || { full_name: authorName, avatar_url: post.users?.avatar_url }}
              />
            )}
            <View style={styles.authorTextWrap}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.authorName, { color: colors.textPrimary }]}>{authorName}</Text>
                {isFeedxOfficial && (
                  <MaterialCommunityIcons name="check-decagram" size={16} color="#00B2FE" />
                )}
              </View>
              <Text style={[styles.authorMeta, { color: colors.textMuted }]}>
                {isFeedxOfficial ? 'Official FEEDX Community' : (post.users?.college_name || 'Student Post')} • {formattedTime}
              </Text>
            </View>

            <View style={[styles.catBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)' }]}>
              <Text style={styles.catBadgeText}>{category.toUpperCase()}</Text>
            </View>
          </View>

          {/* Post Title & Description */}
          <Text style={[styles.fullTitle, { color: colors.textPrimary }]}>{title}</Text>

          {/* Media Player / Gallery / Poll */}
          {(() => {
            const resolved = resolveCommunityMedia(post);
            if (resolved.type === 'poll' && (post?.poll || post?.polls)) {
              return (
                <View style={styles.mediaWrap}>
                  <PollCard poll={post.poll || post.polls} studentId={user?.id} />
                </View>
              );
            }
            if (resolved.type === 'video') {
              return (
                <View style={styles.mediaWrap}>
                  <VideoPostCard
                    videoUrl={resolved.streamUrl || resolved.rawUrl}
                    thumbnailUrl={resolved.thumbnailUrl || post.image_url}
                    title={title}
                    isActive={true}
                    onLike={handleLike}
                  />
                </View>
              );
            }
            if (resolved.type === 'image' && (resolved.mediaUrls.length > 0 || Boolean(resolved.displayUrl || post.image_url))) {
              return (
                <View style={styles.mediaWrap}>
                  <PostImagesGallery
                    images={
                      resolved.mediaUrls.length > 0
                        ? resolved.mediaUrls
                        : ([resolved.displayUrl || post.image_url].filter(Boolean) as string[])
                    }
                    onLike={handleLike}
                  />
                </View>
              );
            }
            return null;
          })()}

          {caption ? (
            <Text style={[styles.fullBodyText, { color: colors.textSecondary }]}>{caption}</Text>
          ) : null}

          {/* Action Engagement Bar */}
          <View style={[styles.engagementBar, { borderColor: colors.border }]}>
            <PressableCard scaleTo={0.96} haptic onPress={handleLike} style={styles.actionBtn}>
              <MaterialCommunityIcons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked ? '#EF4444' : colors.textSecondary}
              />
              <Text style={[styles.actionText, { color: isLiked ? '#EF4444' : colors.textSecondary }]}>
                {likesCount} Likes
              </Text>
            </PressableCard>

            <View style={styles.actionBtn}>
              <Feather name="message-circle" size={19} color={colors.textSecondary} />
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>{comments.length} Comments</Text>
            </View>

            <BookmarkButton isBookmarked={isBookmarked} onPress={handleBookmark} size={36} iconSize={17} />
          </View>
        </Animated.View>

        {/* 3. Professional Comments Section */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(80).springify()}
          style={[styles.commentsContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          {/* Section Heading & Tag Pills */}
          <View style={styles.commentsHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Feather name="message-square" size={16} color={colors.primary} />
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                Discussion ({comments.length})
              </Text>
            </View>
          </View>

          {/* Tag Quick Action Bar */}
          <View style={styles.tagPillBar}>
            <Text style={[styles.tagBarLabel, { color: colors.textMuted }]}>Quick Tag:</Text>
            {['Faculty', 'Admin', 'PlacementCell', 'StudentRep'].map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.tagPill, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.08)' }]}
                onPress={() => handleInsertTag(tag)}
                activeOpacity={0.7}
              >
                <Text style={styles.tagPillText}>@{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.commentsDivider, { backgroundColor: colors.border }]} />

          {/* Comments List */}
          {commentsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : comments.length === 0 ? (
            <FeedxEmptyState
              icon="info"
              title="No Comments Yet"
              subtitle="Be the first student or faculty member to start the conversation!"
              style={{ marginVertical: 10 }}
            />
          ) : (
            (() => {
              const topLevelComments = comments.filter((c) => !c.parent_id);
              const repliesByParent: Record<string, any[]> = {};
              comments.forEach((c) => {
                if (c.parent_id) {
                  if (!repliesByParent[c.parent_id]) {
                    repliesByParent[c.parent_id] = [];
                  }
                  repliesByParent[c.parent_id].push(c);
                }
              });

              const renderFormattedComment = (content: string) => {
                if (!content) return null;
                const parts = content.split(/(@\w+|#\w+)/g);
                return (
                  <Text style={[styles.commentBody, { color: colors.textSecondary }]}>
                    {parts.map((part, index) => {
                      if (part.startsWith('@')) {
                        return (
                          <Text key={index} style={{ color: '#3B82F6', fontWeight: '700' }}>
                            {part}
                          </Text>
                        );
                      }
                      if (part.startsWith('#')) {
                        return (
                          <Text key={index} style={{ color: '#10B981', fontWeight: '700' }}>
                            {part}
                          </Text>
                        );
                      }
                      return part;
                    })}
                  </Text>
                );
              };

              return topLevelComments.map((item, idx) => {
                const isCommentLiked = !!likedCommentsMap[item.id];
                const commentLikes = item.likes_count || 0;
                const childReplies = repliesByParent[item.id] || [];
                const isExpanded = !!expandedReplies[item.id];

                return (
                  <Animated.View
                    key={item.id}
                    layout={Layout.springify()}
                    entering={FadeInDown.duration(240).delay(idx * 30)}
                    style={[styles.commentItemWrap, { borderColor: colors.border }]}
                  >
                    {/* Main Parent Comment */}
                    <View style={styles.commentItem}>
                      <UserAvatar user={item.users || { full_name: item.student_id }} size={36} />
                      <View style={styles.commentContent}>
                        <View style={styles.commentTopRow}>
                          <Text style={[styles.commentAuthor, { color: colors.textPrimary }]}>
                            {item.users?.full_name || 'Student'}
                          </Text>
                          <Text style={[styles.commentTime, { color: colors.textMuted }]}>
                            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Text>
                        </View>

                        {renderFormattedComment(item.comment)}

                        {/* Comment Action Bar */}
                        <View style={styles.commentActionRow}>
                          <TouchableOpacity
                            style={styles.commentActionBtn}
                            onPress={() => handleToggleCommentLike(item.id)}
                            activeOpacity={0.7}
                          >
                            <MaterialCommunityIcons
                              name={isCommentLiked ? 'heart' : 'heart-outline'}
                              size={14}
                              color={isCommentLiked ? '#EF4444' : colors.textMuted}
                            />
                            <Text style={[styles.commentActionText, { color: isCommentLiked ? '#EF4444' : colors.textMuted }]}>
                              {commentLikes > 0 ? commentLikes : 'Like'}
                            </Text>
                          </TouchableOpacity>

                          {post.comments_enabled !== false && (
                            <TouchableOpacity
                              style={styles.commentActionBtn}
                              onPress={() => handleStartReply(item.id, item.users?.full_name || 'Student')}
                              activeOpacity={0.7}
                            >
                              <Feather name="corner-up-left" size={13} color={colors.primary} />
                              <Text style={[styles.commentActionText, { color: colors.primary, fontWeight: '700' }]}>Reply</Text>
                            </TouchableOpacity>
                          )}

                          <TouchableOpacity
                            style={styles.commentActionBtn}
                            onPress={() => handleReportComment(item.id)}
                            activeOpacity={0.7}
                          >
                            <Feather name="flag" size={12} color={colors.textMuted} />
                          </TouchableOpacity>

                          {(item.student_id === user?.id || user?.role === 'super_admin' || user?.role === 'admin') && (
                            <TouchableOpacity
                              style={styles.commentActionBtn}
                              onPress={() => handleDeleteComment(item.id)}
                              activeOpacity={0.7}
                            >
                              <Feather name="trash-2" size={12} color="#EF4444" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Threaded Replies Expand Trigger */}
                    {childReplies.length > 0 && (
                      <TouchableOpacity
                        style={styles.viewRepliesBtn}
                        onPress={() => handleToggleReplies(item.id)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.viewRepliesLine, { backgroundColor: colors.border }]} />
                        <Text style={[styles.viewRepliesText, { color: colors.primary }]}>
                          {isExpanded ? 'Hide replies' : `View ${childReplies.length} ${childReplies.length === 1 ? 'reply' : 'replies'}`}
                        </Text>
                        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={12} color={colors.primary} />
                      </TouchableOpacity>
                    )}

                    {/* Threaded Replies List */}
                    {childReplies.length > 0 && isExpanded && (
                      <View style={[styles.repliesThreadContainer, { borderLeftColor: colors.primary }]}>
                        {childReplies.map((reply) => {
                          const isReplyLiked = !!likedCommentsMap[reply.id];
                          const replyLikes = reply.likes_count || 0;

                          return (
                            <View key={reply.id} style={styles.replyItem}>
                              <UserAvatar user={reply.users || { full_name: reply.student_id }} size={28} />
                              <View style={styles.commentContent}>
                                <View style={styles.commentTopRow}>
                                  <Text style={[styles.replyAuthor, { color: colors.textPrimary }]}>
                                    {reply.users?.full_name || 'Student'}
                                  </Text>
                                  <Text style={[styles.commentTime, { color: colors.textMuted }]}>
                                    {new Date(reply.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </Text>
                                </View>

                                {renderFormattedComment(reply.comment)}

                                <View style={styles.commentActionRow}>
                                  <TouchableOpacity
                                    style={styles.commentActionBtn}
                                    onPress={() => handleToggleCommentLike(reply.id)}
                                    activeOpacity={0.7}
                                  >
                                    <MaterialCommunityIcons
                                      name={isReplyLiked ? 'heart' : 'heart-outline'}
                                      size={13}
                                      color={isReplyLiked ? '#EF4444' : colors.textMuted}
                                    />
                                    <Text style={[styles.commentActionText, { color: isReplyLiked ? '#EF4444' : colors.textMuted }]}>
                                      {replyLikes > 0 ? replyLikes : 'Like'}
                                    </Text>
                                  </TouchableOpacity>

                                  {post.comments_enabled !== false && (
                                    <TouchableOpacity
                                      style={styles.commentActionBtn}
                                      onPress={() => handleStartReply(item.id, reply.users?.full_name || 'Student')}
                                      activeOpacity={0.7}
                                    >
                                      <Feather name="corner-up-left" size={12} color={colors.primary} />
                                      <Text style={[styles.commentActionText, { color: colors.primary, fontWeight: '700' }]}>Reply</Text>
                                    </TouchableOpacity>
                                  )}

                                  <TouchableOpacity
                                    style={styles.commentActionBtn}
                                    onPress={() => handleReportComment(reply.id)}
                                    activeOpacity={0.7}
                                  >
                                    <Feather name="flag" size={11} color={colors.textMuted} />
                                  </TouchableOpacity>

                                  {(reply.student_id === user?.id || user?.role === 'super_admin' || user?.role === 'admin') && (
                                    <TouchableOpacity
                                      style={styles.commentActionBtn}
                                      onPress={() => handleDeleteComment(reply.id)}
                                      activeOpacity={0.7}
                                    >
                                      <Feather name="trash-2" size={11} color="#EF4444" />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </Animated.View>
                );
              });
            })()
          )}
        </Animated.View>
      </ScrollView>

      {/* 4. Replying Indicator Pill Banner */}
      {replyingTo && post.comments_enabled !== false && (
        <Animated.View
          entering={FadeInUp.duration(180).springify()}
          style={[styles.replyingBar, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF', borderTopColor: colors.cardBorder }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Feather name="corner-down-right" size={14} color={colors.primary} />
            <Text style={[styles.replyingText, { color: colors.textSecondary }]}>
              Replying to <Text style={{ color: colors.primary, fontWeight: '800' }}>@{replyingTo.author}</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={handleCancelReply} style={styles.cancelReplyBtn} activeOpacity={0.7}>
            <Feather name="x" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* 5. Professional Bottom Input Floating Bar or Disabled Comments Notice */}
      {post.comments_enabled === false ? (
        <View style={[styles.inputBar, { backgroundColor: colors.card, borderColor: colors.cardBorder, justifyContent: 'center', paddingVertical: 14 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Feather name="lock" size={16} color={colors.textMuted} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted }}>
              Comments are disabled for this official announcement.
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.inputBar, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <TextInput
            style={[styles.textInput, { color: colors.textPrimary, backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}
            placeholder={replyingTo ? `Reply to @${replyingTo.author}...` : "Write a comment... (use @name to tag)"}
            placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(15, 23, 42, 0.4)"}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <PressableCard
            scaleTo={0.92}
            haptic
            style={[styles.sendBtn, { backgroundColor: colors.primary }, (!commentText.trim() || sendingComment) && { opacity: 0.5 }]}
            onPress={handleSendComment}
            disabled={!commentText.trim() || sendingComment}
          >
            {sendingComment ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Feather name="send" size={16} color="#FFF" />
            )}
          </PressableCard>
        </View>
      )}
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
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginHorizontal: 10,
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  postCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  fullTitle: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
    marginTop: 4,
  },
  mediaWrap: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  fullBodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  engagementBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  commentsContainer: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  commentsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '900',
  },
  tagPillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  tagBarLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3B82F6',
  },
  commentsDivider: {
    height: 1,
    marginVertical: 4,
  },
  commentItemWrap: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  commentContent: {
    flex: 1,
    gap: 4,
  },
  commentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '800',
  },
  commentTime: {
    fontSize: 11,
  },
  commentBody: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  commentActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  commentActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  viewRepliesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 48,
    gap: 8,
    paddingVertical: 4,
  },
  viewRepliesLine: {
    width: 20,
    height: 1,
  },
  viewRepliesText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  repliesThreadContainer: {
    marginLeft: 48,
    borderLeftWidth: 2,
    paddingLeft: 12,
    gap: 10,
    marginTop: 4,
  },
  replyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  replyAuthor: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  replyingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  replyingText: {
    fontSize: 12,
  },
  cancelReplyBtn: {
    padding: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 13.5,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
