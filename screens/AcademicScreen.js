import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { getResourcesForStudent, toggleBookmark, getBookmarks } from '@/services/supabaseService';
import { getOpenedResources, markResourceAsOpened, isItemNew } from '@/services/openedItemsService';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Linking, Dimensions, Alert, TextInput, Share, RefreshControl } from 'react-native';
import { convertDriveUrlToPdfViewerUrl, sanitizeUrl } from '@/utils/googleDrive';
import * as WebBrowser from 'expo-web-browser';
import { InlineLoader } from '@/components/ui/Loaders';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '@/constants/theme';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useResourcesInfiniteQuery, useRawBookmarksQuery } from '@/hooks/useQueries';
import { requestQueue } from '@/lib/requestQueue';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useFocusEffect } from 'expo-router';
import FeedbackModal from '@/components/ui/FeedbackModal';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const CATEGORIES = ['All', 'Notes', 'Previous Year Papers', 'Syllabus'];

const ResourceCard = React.memo(function ResourceCard({ item, index, isBookmarked, isNew, onOpen, onBookmark, onShare, onDownload, downloading }) {
  const getIconAndColor = (type) => {
    const t = String(type || '').toLowerCase();
    if (t.includes('note')) return { icon: 'notebook-outline', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' };
    if (t.includes('paper') || t.includes('exam')) return { icon: 'file-clock-outline', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' };
    if (t.includes('lab') || t.includes('manual')) return { icon: 'flask-outline', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' };
    if (t.includes('syllabus')) return { icon: 'format-list-bulleted', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' };
    return { icon: 'file-document-outline', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.12)' };
  };

  const { colors, isDark } = useTheme();
  const { icon, color, bg } = getIconAndColor(item.type);

  const displayType = (type) => {
    const t = String(type || 'Material').toLowerCase();
    if (t.includes('paper') || t.includes('exam') || t.includes('question')) return 'PREVIOUS YEAR PAPERS';
    return String(type || 'Material').toUpperCase();
  };

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 30)} style={styles.cardWrapper}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        activeOpacity={0.8}
        onPress={() => onOpen(item)}
      >
        {/* Header section with icon, title */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: bg }]}>
            <MaterialCommunityIcons name={icon} size={24} color={color} />
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={[styles.resourceTitle, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text>
          </View>
          <TouchableOpacity onPress={(e) => { e?.stopPropagation?.(); onBookmark(item.id); }}>
            <BookmarkButton isBookmarked={isBookmarked} onPress={() => onBookmark(item.id)} size={38} iconSize={16} />
          </TouchableOpacity>
        </View>

        {/* Badges row */}
        <View style={styles.badgesRow}>
          {isNew && (
            <View style={[styles.badge, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444', borderWidth: 1 }]}>
              <Text style={[styles.badgeText, { color: '#EF4444', fontWeight: '900' }]}>NEW</Text>
            </View>
          )}
          <View style={[styles.badge, { backgroundColor: bg }]}>
            <Text style={[styles.badgeText, { color, fontWeight: '800' }]}>
              {displayType(item.type)}
            </Text>
          </View>
        </View>

        {/* Action button row */}
        <View style={styles.cardFooter}>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.circleBtn, { backgroundColor: colors.inputBg, borderColor: colors.border, borderWidth: 1 }]} onPress={(e) => { e?.stopPropagation?.(); onShare(item); }}>
              <Feather name="share-2" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.circleBtn, { backgroundColor: COLORS.primary }]} onPress={() => onOpen(item)}>
              <Feather name="eye" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});


import { useGamification } from '@/context/GamificationContext';

export default function AcademicScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { listRef, handleScroll } = useScrollRestoration('academics');
  const { user } = useUser();
  const { triggerActivity } = useGamification();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkIds, setBookmarkIds] = useState(new Set());
  const [openedResourceIds, setOpenedResourceIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [activeFilters, setActiveFilters] = useState({
    resource_type: 'All',
    sortBy: 'Latest'
  });

  const { data: bookmarksData, refetch: refetchBookmarks } = useRawBookmarksQuery(user?.id);
  const {
    data: resourcesData,
    isLoading: loading,
    isFetchingNextPage: loadingMore,
    hasNextPage: hasMore,
    isError,
    fetchNextPage,
    refetch: refetchResources
  } = useResourcesInfiniteQuery(user, searchQuery, activeFilters);

  const resources = resourcesData?.pages.flat() || [];

  const sortedResources = [...resources].sort((a, b) => {
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  useEffect(() => {
    if (bookmarksData && Array.isArray(bookmarksData)) {
      const resIds = bookmarksData.filter((b) => b && b.entity_type === 'resource').map((b) => b.entity_id);
      setBookmarkIds(new Set(resIds));
    }
  }, [bookmarksData]);

  useFocusEffect(
    useCallback(() => {
      refetchResources();
      if (user?.id) refetchBookmarks();
      setSelectedCategory('All');
      setActiveFilters({
        resource_type: 'All',
        sortBy: 'Latest'
      });
      setSearchQuery('');
      getOpenedResources().then(ids => {
        setOpenedResourceIds(ids || []);
      });
    }, [refetchResources, refetchBookmarks, user?.id])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    const ids = await getOpenedResources();
    setOpenedResourceIds(ids || []);
    await Promise.all([refetchResources(), refetchBookmarks()]);
    setRefreshing(false);
  };



  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchNextPage();
    }
  };

  const handleBookmark = async (resourceId) => {
    if (!user?.id) return;

    // Optimistic toggle
    setBookmarkIds(prev => {
      const next = new Set(prev);
      if (next.has(resourceId)) next.delete(resourceId);
      else next.add(resourceId);
      return next;
    });

    try {
      await requestQueue.enqueue('TOGGLE_BOOKMARK', { userId: user.id, entityType: 'resource', entityId: resourceId });
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
    } catch (e) {
      console.warn("Bookmark toggle queued/failed", e);
    }
  };

  const handleShare = async (resource) => {
    try {
      await Share.share({
        message: `Check out this resource on FeedX: ${resource.title}\nSubject: ${resource.subject}\nDownload link: ${resource.file_url}`,
      });
    } catch (error) {
      console.warn("Sharing failed", error);
    }
  };

  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadModal, setDownloadModal] = useState({ visible: false, title: '', message: '' });

  const handleDownload = async (resource) => {
    if (!resource?.file_url) {
      Alert.alert('Download Error', 'Resource file URL is not available.');
      return;
    }

    setDownloadingId(resource.id);
    try {
      const targetUrl = sanitizeUrl(resource.file_url);

      // 1. Get safe file extension from URL
      let ext = '.pdf';
      const cleanUrl = targetUrl.split('?')[0].toLowerCase();
      if (cleanUrl.endsWith('.png')) ext = '.png';
      else if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) ext = '.jpg';
      else if (cleanUrl.endsWith('.docx')) ext = '.docx';
      else if (cleanUrl.endsWith('.xlsx')) ext = '.xlsx';
      else if (cleanUrl.endsWith('.pptx')) ext = '.pptx';
      else if (cleanUrl.endsWith('.zip')) ext = '.zip';

      // 2. Generate clean filename
      const safeTitle = resource.title.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${safeTitle}${ext}`;
      const localUri = FileSystem.documentDirectory + filename;

      // 3. Download the file locally to device storage
      const downloadResult = await FileSystem.downloadAsync(targetUrl, localUri);
      setDownloadingId(null);

      // 4. Prompt the user to save to Downloads/File Manager
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType: downloadResult.mimeType || 'application/pdf',
          dialogTitle: `Save ${resource.title}`,
        });
      } else {
        await Linking.openURL(targetUrl);
      }

      setDownloadModal({
        visible: true,
        title: 'Resource Downloaded 🎉',
        message: `"${resource.title}" has been saved. You earned +2 Gold Coins for reading this resource!`,
      });

      // Award +2 Gold Coins on Resource Read Completion
      try {
        await triggerActivity('resource_read', 2, 20, resource.id);
      } catch (e) {}
    } catch (err) {
      setDownloadingId(null);
      console.warn('Download error:', err);
      // Fallback: open link in browser if direct local save fails
      try {
        const targetUrl = sanitizeUrl(resource.file_url);
        await Linking.openURL(targetUrl);
      } catch (linkErr) {
        Alert.alert('Download Error', 'Could not open or download resource link.');
      }
    }
  };

  const handleCategoryPress = (category) => {
    const nextCat = selectedCategory === category ? 'All' : category;
    setSelectedCategory(nextCat);
    setActiveFilters(prev => ({
      ...prev,
      resource_type: nextCat === 'All' ? 'All' : nextCat
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      resource_type: 'All'
    });
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const handleOpenResource = useCallback(async (item) => {
    if (item.file_url) {
      try {
        const viewerUrl = convertDriveUrlToPdfViewerUrl(item.file_url);
        await WebBrowser.openBrowserAsync(viewerUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
          toolbarColor: '#0F172A',
          controlsColor: '#3B82F6',
          showTitle: true,
          enableBarCollapsing: true,
        });
      } catch (err) {
        Linking.openURL(sanitizeUrl(item.file_url)).catch(() => {
          Alert.alert('Error', 'Unable to open document URL.');
        });
      }
    }
    try {
      const nextIds = await markResourceAsOpened(item.id);
      setOpenedResourceIds(nextIds || []);
    } catch (e) {
      console.warn('Failed to mark resource as opened:', e);
    }
  }, []);

  const renderResourceItem = useCallback(({ item, index }) => (
    <ResourceCard
      item={item}
      index={index}
      isBookmarked={bookmarkIds.has(item.id)}
      isNew={isItemNew(item.created_at, openedResourceIds)}
      onOpen={handleOpenResource}
      onBookmark={handleBookmark}
      onShare={handleShare}
      onDownload={handleDownload}
      downloading={downloadingId === item.id}
    />
  ), [bookmarkIds, openedResourceIds, handleOpenResource, handleBookmark, handleShare, handleDownload, downloadingId]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedBackground />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleBox}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="book-open-page-variant" size={22} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Resources</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>Academic materials & libraries</Text>
          </View>
        </View>
      </View>

      {/* Search and Filter trigger row */}
      <View style={styles.searchRow}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search academic materials..."
            placeholderTextColor={colors.inputPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.trim() !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Categories Bar */}
      <View style={styles.categoryBar}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;

            return (
              <TouchableOpacity
                onPress={() => {
                  handleCategoryPress(item);
                }}
                activeOpacity={0.8}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                  isSelected && styles.chipSelected
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: isSelected ? '#FFF' : colors.textSecondary },
                    isSelected && styles.chipTextSelected
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Skeleton loaders or Error State */}
      {isError && resources.length === 0 ? (
        <ErrorState
          onRetry={refetchResources}
          message="Failed to retrieve academic resources. Check your internet connection."
        />
      ) : loading && resources.length === 0 ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={styles.card}>
              <View style={styles.skeletonHeader}>
                <Skeleton.Box width={44} height={44} borderRadius={14} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Skeleton.Text width="70%" lines={1} style={{ marginBottom: 4 }} />
                  <Skeleton.Text width="40%" lines={1} />
                </View>
              </View>
              <View style={{ marginTop: 12 }}>
                <Skeleton.Text width={60} height={20} borderRadius={6} lines={1} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlashList
            ref={listRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            data={sortedResources}
            keyExtractor={item => item.id}
            estimatedItemSize={180}
            renderItem={renderResourceItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
            }
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <MaterialCommunityIcons name="folder-search-outline" size={64} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Details not found</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>We couldn&apos;t find any materials matching your search or filters.</Text>
              </View>
            }
            ListFooterComponent={
              loadingMore ? (
                <InlineLoader color={COLORS.primary} message="Loading more resources..." />
              ) : null
            }
          />
        </View>
      )}

      {/* Download Confirmation Success Popup */}
      <FeedbackModal
        visible={downloadModal.visible}
        type="success"
        title={downloadModal.title}
        message={downloadModal.message}
        confirmText="Awesome"
        onConfirm={() => setDownloadModal(prev => ({ ...prev, visible: false }))}
        onRequestClose={() => setDownloadModal(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundDark },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitleBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.textPrimary },
  subtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 1, fontWeight: '600' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.04)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 },
  clearText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  searchRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    height: 50,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '500',
  },
  filterToggleBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filtersPanel: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    gap: 12,
  },
  filterGroup: {
    gap: 6,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  filterChipRow: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  categoryBar: { marginBottom: 16 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8
  },
  chipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 13 },
  chipTextSelected: { color: '#FFF', fontWeight: '800' },
  listContent: { paddingHorizontal: 16, paddingBottom: 110 },
  cardWrapper: { marginBottom: 12 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 16, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardHeaderInfo: { flex: 1 },
  resourceTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  resourceMeta: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  bookmarkBtn: { padding: 4 },
  badgesRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 16 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.04)' },
  badgeText: { fontSize: 10, fontWeight: '800', color: COLORS.textSecondary },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10B981', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  downloadBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  circleBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },

  emptyBox: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8, marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  skeletonContainer: { paddingHorizontal: 16, marginTop: 10 },
  skeletonCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  skeletonHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  skeletonIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.04)' },
  skeletonTextTitle: { height: 14, width: '70%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 7 },
  skeletonTextSub: { height: 10, width: '40%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 5 }
});