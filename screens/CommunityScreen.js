import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
  toggleBookmark,
} from '@/services/supabaseService';
import { SPACING, RADIUS, FONT } from '@/constants/theme';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { CategoryFilterBar } from '@/components/community/CategoryFilterBar';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { CreatePollModal } from '@/components/community/CreatePollModal';

export default function CommunityScreen() {
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const role = String(user?.role || '').trim().toLowerCase();
  const isSuperAdmin = role === 'super_admin' || role === 'admin' || role === 'inst_admin';

  // Infinite Query for Community Posts
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['communityPosts', selectedCategory, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const posts = await getCommunityPosts(pageParam, 20, selectedCategory, searchQuery);
      return posts || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length : undefined;
    },
    staleTime: 1000 * 60 * 2,
  });

  const posts = data?.pages?.flat() || [];

  // User engagement status
  const fetchUserEngagement = async () => {
    if (!user?.id) return;
    try {
      const [likesRes, bookmarksRes] = await Promise.all([
        supabase.from('community_likes').select('post_id').eq('student_id', user.id),
        supabase.from('bookmarks').select('entity_id').eq('user_id', user.id).eq('entity_type', 'community_post'),
      ]);

      const likesMap = {};
      (likesRes.data || []).forEach((l) => { likesMap[l.post_id] = true; });
      setLikedPosts(likesMap);

      const bookmarksMap = {};
      (bookmarksRes.data || []).forEach((b) => { bookmarksMap[b.entity_id] = true; });
      setBookmarkedPosts(bookmarksMap);
    } catch (e) {
      console.warn('[CommunityScreen] Engagement fetch warning:', e);
    }
  };

  useEffect(() => {
    fetchUserEngagement();

    // Supabase Realtime Channels for Live Updates
    const postsChannel = supabase
      .channel('community_posts_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
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

  useFocusEffect(
    useCallback(() => {
      refetch();
      fetchUserEngagement();
    }, [refetch])
  );

  const onRefresh = useCallback(() => {
    refetch();
    fetchUserEngagement();
  }, [refetch]);

  const handleLikeToggle = async (postId) => {
    if (!user?.id) return;
    const wasLiked = Boolean(likedPosts[postId]);
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));

    try {
      await togglePostLike(postId, user.id);
      refetch();
    } catch (e) {
      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
    }
  };

  const handleBookmarkToggle = async (postId) => {
    if (!user?.id) return;
    const wasBookmarked = Boolean(bookmarkedPosts[postId]);
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !wasBookmarked }));

    try {
      await toggleBookmark(user.id, postId, 'community_post');
      refetch();
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.headerTitleGroup}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
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
          data={posts}
          keyExtractor={(item) => item.id}
          estimatedItemSize={240}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
              isLiked={Boolean(likedPosts[item.id])}
              isBookmarked={Boolean(bookmarkedPosts[item.id])}
              isSuperAdmin={isSuperAdmin}
              onLikePress={() => handleLikeToggle(item.id)}
              onBookmarkPress={() => handleBookmarkToggle(item.id)}
              onPinPress={() => handlePinToggle(item.id, Boolean(item.pinned))}
              onDeletePress={() => handleDeletePost(item.id)}
              onCommentPress={() => router.push('/community/post/' + item.id)}
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
    paddingTop: 52,
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
});
