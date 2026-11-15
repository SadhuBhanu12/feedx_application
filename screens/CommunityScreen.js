import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  ScrollView,
  Share,
  ActivityIndicator,
  InteractionManager,
  AppState,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter, useFocusEffect } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import {
  getCommunityPosts,
  deleteCommunityPostAdmin,
  togglePinPostAdmin,
  togglePostLike,
  togglePostReaction,
  toggleBookmark,
} from '@/services/supabaseService';
import { SPACING, RADIUS, FONT } from '@/constants/theme';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { CategoryFilterBar } from '@/components/community/CategoryFilterBar';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { CreatePollModal } from '@/components/community/CreatePollModal';
import { PostCommentSheet } from '@/components/community/PostCommentSheet';
import { PostOptionsSheet } from '@/components/community/PostOptionsSheet';
import { resolveCommunityMedia } from '@/utils/mediaResolver';
import { Image as ExpoImage } from 'expo-image';
import { safeBack } from '@/utils/navigation';

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [userReactions, setUserReactions] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeOptionsPost, setActiveOptionsPost] = useState(null);
  const [activeVisiblePostId, setActiveVisiblePostId] = useState(null);
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  const role = String(user?.role || '').trim().toLowerCase();
  const isSuperAdmin = role === 'super_admin' || role === 'admin' || role === 'inst_admin';

  // Infinite Query for Community Posts with real-time user reactions
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['communityPosts', selectedCategory, searchQuery, user?.id],
    queryFn: async ({ pageParam = 0 }) => {
      const posts = await getCommunityPosts(pageParam, 20, selectedCategory, searchQuery, 'Newest', user?.id);
      return posts || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length : undefined;
    },
    staleTime: 1000 * 60 * 2,
  });

  const posts = data?.pages?.flat() || [];

  // Instant Media Acceleration: Prefetch first batch of post images into disk-memory cache
  useEffect(() => {
    if (!posts || posts.length === 0) return;
    const urlsToPrefetch = [];
    posts.slice(0, 8).forEach((p) => {
      try {
        const resolved = resolveCommunityMedia(p);
        if (resolved?.type === 'image' && resolved.mediaUrls?.length) {
          resolved.mediaUrls.slice(0, 2).forEach((u) => {
            if (u && typeof u === 'string') urlsToPrefetch.push(u);
          });
        } else if (resolved?.thumbnailUrl) {
          urlsToPrefetch.push(resolved.thumbnailUrl);
        }
      } catch (_) {}
    });
    if (urlsToPrefetch.length > 0) {
      ExpoImage.prefetch(urlsToPrefetch, 'memory-disk').catch(() => {});
    }
  }, [posts]);

  // User engagement status
  const fetchUserEngagement = async () => {
    if (!user?.id) return;
    try {
      const [likesRes, bookmarksRes] = await Promise.all([
        supabase.from('community_likes').select('post_id, reaction_emoji, student_id, user_id').or(`student_id.eq.${user.id},user_id.eq.${user.id}`),
        supabase.from('bookmarks').select('entity_id').eq('user_id', user.id).eq('entity_type', 'community_post'),
      ]);

      const likesMap = {};
      const reactionsMap = {};
      (likesRes.data || []).forEach((l) => {
        likesMap[l.post_id] = true;
        if (l.reaction_emoji) {
          reactionsMap[l.post_id] = l.reaction_emoji;
        }
      });
      setLikedPosts((prev) => ({ ...prev, ...likesMap }));
      setUserReactions((prev) => ({ ...prev, ...reactionsMap }));

      const bookmarksMap = {};
      (bookmarksRes.data || []).forEach((b) => { bookmarksMap[b.entity_id] = true; });
      setBookmarkedPosts((prev) => ({ ...prev, ...bookmarksMap }));
    } catch (e) {
      console.warn('[CommunityScreen] Engagement fetch warning:', e);
    }
  };

  useEffect(() => {
    fetchUserEngagement();

    // Supabase Realtime Channels for Live Post Updates, Reactions & Comments with unique channel identifier
    const channelName = `community_posts_realtime_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const postsChannel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_likes' }, () => {
        refetch();
        fetchUserEngagement();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_comments' }, () => {
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, () => {
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [user?.id]);

  // Pause all video playback when navigating away from Community screen
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      const task = InteractionManager.runAfterInteractions(() => {
        fetchUserEngagement();
      });
      return () => {
        setIsScreenFocused(false);
        setActiveVisiblePostId(null);
        task.cancel();
      };
    }, [user?.id])
  );

  // Pause video playback when app goes to background / minimized
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        setActiveVisiblePostId(null);
      }
    });
    return () => sub.remove();
  }, []);

  // Helper to identify video posts reliably via unified media resolver
  const isVideoPost = (p) => {
    if (!p) return false;
    const resolved = resolveCommunityMedia(p);
    return resolved.type === 'video';
  };

  // Viewability config: Video must be at least 60% visible to autoplay
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 120, // Smooth responsive autoplay
  }).current;

  // Viewable items handler: Guarantees ONLY ONE video post plays at any time (highest visibility item >= 60%)
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const qualifyingVideos = viewableItems.filter((vi) => vi.isViewable && isVideoPost(vi.item));
      if (qualifyingVideos.length > 0) {
        // Pick the top/most visible qualifying video post
        const activeVideo = qualifyingVideos[0];
        setActiveVisiblePostId(activeVideo.item.id);
      } else {
        setActiveVisiblePostId(null);
      }
    } else {
      setActiveVisiblePostId(null);
    }
  }).current;

  const onRefresh = useCallback(() => {
    refetch();
    fetchUserEngagement();
  }, [refetch]);

  const handleLikeToggle = async (postId) => {
    if (!user?.id) return;
    const postItem = posts.find(p => p.id === postId);
    const wasLiked = likedPosts[postId] !== undefined ? Boolean(likedPosts[postId]) : Boolean(postItem?.hasLiked);
    const prevReaction = userReactions[postId] !== undefined ? userReactions[postId] : (postItem?.user_reaction || '❤️');

    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));
    setUserReactions((prev) => ({ ...prev, [postId]: !wasLiked ? (prevReaction || '❤️') : null }));

    try {
      const res = await togglePostLike(postId, user.id, wasLiked);
      if (res) {
        setLikedPosts((prev) => ({ ...prev, [postId]: res.hasLiked }));
        if (!res.hasLiked) {
          setUserReactions((prev) => ({ ...prev, [postId]: null }));
        }
      }
    } catch (e) {
      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
      setUserReactions((prev) => ({ ...prev, [postId]: wasLiked ? prevReaction : null }));
    }
  };

  const handleReactionToggle = async (postId, emoji) => {
    if (!user?.id) return;
    const postItem = posts.find(p => p.id === postId);
    const prevEmoji = userReactions[postId] !== undefined ? userReactions[postId] : (postItem?.user_reaction || null);
    const newEmoji = prevEmoji === emoji ? null : emoji;

    setUserReactions((prev) => ({ ...prev, [postId]: newEmoji }));
    setLikedPosts((prev) => ({ ...prev, [postId]: Boolean(newEmoji) }));

    try {
      await togglePostReaction(postId, user.id, emoji);
    } catch (e) {
      setUserReactions((prev) => ({ ...prev, [postId]: prevEmoji }));
      setLikedPosts((prev) => ({ ...prev, [postId]: Boolean(prevEmoji) }));
    }
  };

  const handleBookmarkToggle = async (postId) => {
    if (!user?.id) return;
    const postItem = posts.find(p => p.id === postId);
    const wasBookmarked = bookmarkedPosts[postId] !== undefined ? Boolean(bookmarkedPosts[postId]) : Boolean(postItem?.isBookmarked);
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !wasBookmarked }));

    try {
      await toggleBookmark(user.id, 'community_post', postId);
    } catch (e) {
      setBookmarkedPosts((prev) => ({ ...prev, [postId]: wasBookmarked }));
    }
  };

  const handlePinToggle = async (postId, currentPinned) => {
    try {
      await togglePinPostAdmin(postId, currentPinned);
      Alert.alert('Post Pin Status Updated', currentPinned ? 'Post unpinned.' : 'Post pinned to top of feed!');
      refetch();
    } catch (e) {
      Alert.alert('Pin Toggle Failed', e?.message || 'Error toggling pin status.');
    }
  };

  const handleDeletePost = async (postId) => {
    Alert.alert('Delete Community Post', 'Are you sure you want to remove this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCommunityPostAdmin(postId);
            refetch();
          } catch (e) {
            Alert.alert('Error', e?.message || 'Failed to delete post.');
          }
        },
      },
    ]);
  };

  const listRef = useRef(null);
  const [isTopRefreshing, setIsTopRefreshing] = useState(false);

  const handleScrollToTopAndRefresh = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}

    setIsTopRefreshing(true);

    // Scroll to the very first item/page
    listRef.current?.scrollToOffset({ offset: 0, animated: true });

    try {
      await refetch();
      await fetchUserEngagement();
    } finally {
      setIsTopRefreshing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.cardBorder, paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 14) }]}>
        <View style={styles.headerTitleGroup}>
          <TouchableOpacity style={styles.backBtn} onPress={() => safeBack('/(tabs)')}>
            <Feather name="arrow-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Community</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Campus Updates & Student Engagement
            </Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={styles.headerIconBtn}>
            <Feather name="search" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {isSuperAdmin && (
            <TouchableOpacity onPress={() => router.push('/admin/polls')} style={styles.headerIconBtn}>
              <MaterialCommunityIcons name="poll" size={20} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Optional Search Bar */}
      {showSearch && (
        <View style={[styles.searchBarRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search titles, descriptions, categories..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {/* Horizontal Category Filters */}
      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Feed List */}
      {isLoading && posts.length === 0 ? (
        <View style={styles.skeletonContainer}>
          <SkeletonLoader height={180} borderRadius={16} />
          <SkeletonLoader height={220} borderRadius={16} />
          <SkeletonLoader height={200} borderRadius={16} />
        </View>
      ) : (
        <FlashList
          ref={listRef}
          data={posts}
          keyExtractor={(item) => item.id}
          estimatedItemSize={380}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          onEndReached={() => {
            if (hasNextPage && !isFetching && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <CommunityPostCard
              post={item}
              currentUserId={user?.id || ''}
              isActiveVideo={isScreenFocused && activeVisiblePostId === item.id}
              isLiked={likedPosts[item.id] !== undefined ? Boolean(likedPosts[item.id]) : Boolean(item.hasLiked)}
              userReactionProp={userReactions[item.id] !== undefined ? userReactions[item.id] : (item.user_reaction || (item.hasLiked ? '❤️' : null))}
              isBookmarked={bookmarkedPosts[item.id] !== undefined ? Boolean(bookmarkedPosts[item.id]) : Boolean(item.isBookmarked)}
              isSuperAdmin={isSuperAdmin}
              onLikePress={() => handleLikeToggle(item.id)}
              onReactionPress={(emoji) => handleReactionToggle(item.id, emoji)}
              onBookmarkPress={() => handleBookmarkToggle(item.id)}
              onPinPress={() => handlePinToggle(item.id, Boolean(item.pinned))}
              onDeletePress={() => handleDeletePost(item.id)}
              onCommentPress={() => setActiveCommentPost({ id: item.id, title: item.title })}
              onOptionsPress={() => setActiveOptionsPost(item)}
            />
          )}
          ListEmptyComponent={() => (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Feather name="info" size={32} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No community updates yet</Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                New announcements, opportunities, and student updates for {selectedCategory} will appear here.
              </Text>
            </View>
          )}
        />
      )}

      {/* Sticky Floating Refresh & Scroll-to-Top Pill Button */}
      <TouchableOpacity
        style={[styles.stickyRefreshPill, { backgroundColor: '#2563EB' }]}
        onPress={handleScrollToTopAndRefresh}
        activeOpacity={0.85}
      >
        {isTopRefreshing ? (
          <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 6 }} />
        ) : (
          <Ionicons name="arrow-up-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
        )}
        <Text style={styles.stickyRefreshText}>
          {isTopRefreshing ? 'Refreshing Feed...' : 'Scroll to Top & Refresh'}
        </Text>
        <Feather name="refresh-cw" size={13} color="rgba(255,255,255,0.85)" style={{ marginLeft: 6 }} />
      </TouchableOpacity>

      {/* Instagram-Style In-Feed Comment Bottom Sheet */}
      <PostCommentSheet
        visible={Boolean(activeCommentPost)}
        postId={activeCommentPost?.id || null}
        postTitle={activeCommentPost?.title}
        onClose={() => setActiveCommentPost(null)}
        onCommentCountChange={(newCount) => {
          if (activeCommentPost?.id && typeof newCount === 'number') {
            queryClient.setQueriesData({ queryKey: ['communityPosts'] }, (oldData) => {
              if (!oldData || !oldData.pages) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page) =>
                  page.map((p) =>
                    p.id === activeCommentPost.id
                      ? { ...p, comments_count: newCount }
                      : p
                  )
                ),
              };
            });
          }
          refetch();
        }}
      />

      {/* Post Options Sheet */}
      <PostOptionsSheet
        visible={Boolean(activeOptionsPost)}
        post={activeOptionsPost}
        currentUserId={user?.id}
        isSuperAdmin={isSuperAdmin}
        onClose={() => setActiveOptionsPost(null)}
        onPinPress={() => {
          if (activeOptionsPost) {
            handlePinToggle(activeOptionsPost.id, Boolean(activeOptionsPost.pinned));
          }
        }}
        onDeletePress={() => {
          if (activeOptionsPost) {
            handleDeletePost(activeOptionsPost.id);
          }
        }}
      />

      {/* Superadmin Post & Poll Creator Modal */}
      <CreatePollModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        userId={user?.id || ''}
        onPostCreated={() => refetch()}
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
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FONT.size.md,
    fontWeight: '900',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '600',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    padding: 6,
  },
  createPostBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: SPACING.md,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  skeletonContainer: {
    padding: SPACING.md,
    gap: 12,
  },
  listContent: {
    paddingBottom: 110,
  },
  emptyCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: FONT.size.md,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
  stickyRefreshPill: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99,
  },
  stickyRefreshText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
