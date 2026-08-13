import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { getBookmarkedItems, toggleBookmark } from '@/services/supabaseService';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { useTheme } from '@/context/ThemeContext';

type BookmarkCategory = 'all' | 'opportunities' | 'resources' | 'events' | 'posts' | 'innovations';

export default function BookmarksScreen() {
  const router = useRouter();
  const { listRef, handleScroll } = useScrollRestoration('bookmarks');
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<BookmarkCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Fetch resolved bookmark data from Supabase
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ['bookmarks_resolved', user?.id],
    queryFn: () => getBookmarkedItems(user?.id),
    enabled: !!user?.id,
    staleTime: 0,
  });

  const handleRemoveBookmark = async (entityType: string, entityId: string) => {
    if (!user?.id) return;
    try {
      await toggleBookmark(user.id, entityType, entityId);
      queryClient.invalidateQueries({ queryKey: ['bookmarks_resolved', user.id] });
      queryClient.invalidateQueries({ queryKey: ['raw_bookmarks', user.id] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user.id] });
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to remove bookmark.');
    }
  };

  const getActiveList = (): any[] => {
    if (!data) return [];
    const opps = (data.opportunities || []).map((i: any) => ({ ...i, _entityType: 'opportunities' }));
    const res = (data.resources || []).map((i: any) => ({ ...i, _entityType: 'resources' }));
    const evts = (data.events || []).map((i: any) => ({ ...i, _entityType: 'events' }));
    const psts = (data.posts || []).map((i: any) => ({ ...i, _entityType: 'posts' }));
    const inns = (data.innovations || []).map((i: any) => ({ ...i, _entityType: 'innovations' }));

    switch (activeTab) {
      case 'all': return [...opps, ...res, ...evts, ...psts, ...inns];
      case 'opportunities': return opps;
      case 'resources': return res;
      case 'events': return evts;
      case 'posts': return psts;
      case 'innovations': return inns;
      default: return [];
    }
  };

  const filteredAndSortedList = useMemo(() => {
    const list = getActiveList();
    const q = searchQuery.toLowerCase().trim();
    
    let result = list;
    if (q) {
      result = list.filter((item: any) => {
        const title = (item.title || item.name || item.caption || '').toLowerCase();
        const subtitle = (item.company || item.subject || item.venue || item.location || item.category || '').toLowerCase();
        return title.includes(q) || subtitle.includes(q);
      });
    }

    return [...result].sort((a: any, b: any) => {
      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [data, activeTab, searchQuery, sortBy]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    let title = '';
    let subtitle = '';
    let meta = '';
    let iconName: any = 'bookmark';
    let route = '';
    const itemType = item._entityType || activeTab;

    if (itemType === 'opportunities') {
      title = item.title || 'Opportunity';
      subtitle = item.company || 'Company';
      meta = `${item.type || 'Full Time'} • ${item.stipend || 'Unpaid'}`;
      iconName = 'briefcase';
      route = `/opportunity-detail?id=${item.id}`;
    } else if (itemType === 'resources') {
      title = item.title || 'Resource';
      subtitle = item.subject || 'Subject';
      meta = item.type || 'Document';
      iconName = 'book';
      route = '/(tabs)/academics';
    } else if (itemType === 'events') {
      title = item.title || 'Event';
      subtitle = item.venue || 'Venue';
      meta = new Date(item.event_date || item.date || Date.now()).toDateString();
      iconName = 'calendar';
      route = `/event-detail?id=${item.id}`;
    } else if (itemType === 'posts') {
      title = item.title || item.caption || 'Community Post';
      subtitle = item.author_name || 'Student Post';
      meta = `${item.likes_count || 0} Likes • ${item.comments_count || 0} Comments`;
      iconName = 'comment-quote-outline';
      route = '/community';
    } else if (itemType === 'innovations') {
      title = item.title || 'Project';
      subtitle = item.category || 'Innovation';
      meta = `Upvotes: ${item.upvotes || 0}`;
      iconName = 'lightbulb-outline';
      route = '/innovation';
    }

    const getDbEntityType = () => {
      if (itemType === 'posts') return 'community_post';
      if (itemType === 'innovations') return 'innovation';
      if (itemType === 'opportunities') return 'opportunity';
      if (itemType === 'resources') return 'resource';
      return 'event';
    };

    return (
      <Animated.View entering={FadeInDown.delay(index * 50).springify()} layout={Layout.springify()}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => {
            if (route) {
              router.push(route as any);
            }
          }}
        >
          {isDark && <LinearGradient colors={['rgba(96, 165, 250, 0.1)', 'rgba(96, 165, 250, 0.02)']} style={styles.cardGradient} />}
          <View style={styles.cardInner}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.inputBg }]}>
              <MaterialCommunityIcons name={iconName} size={22} color={colors.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>{title}</Text>
              {subtitle ? <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text> : null}
              <Text style={[styles.cardMeta, { color: colors.textMuted }]} numberOfLines={1}>{meta}</Text>
            </View>
            <BookmarkButton
              isBookmarked={true}
              onPress={() => handleRemoveBookmark(getDbEntityType(), item.id)}
              size={38}
              iconSize={16}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const tabs: { key: BookmarkCategory; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'grid' },
    { key: 'opportunities', label: 'Jobs', icon: 'briefcase' },
    { key: 'resources', label: 'Notes', icon: 'book' },
    { key: 'events', label: 'Events', icon: 'calendar' },
    { key: 'posts', label: 'Community', icon: 'message-square' },
    { key: 'innovations', label: 'Ideas', icon: 'lightbulb' },
  ];


  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />}

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Bookmarks</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Feather name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search bookmarks..."
          placeholderTextColor={colors.inputPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.tabsScroll}
          renderItem={({ item }) => {
            const active = activeTab === item.key;
            return (
              <TouchableOpacity
                onPress={() => setActiveTab(item.key)}
                style={[
                  styles.tab, 
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  active && styles.tabActive
                ]}
              >
                <Feather name={item.icon as any} size={14} color={active ? '#FFF' : colors.textMuted} />
                <Text style={[
                  styles.tabLabel, 
                  { color: colors.textSecondary },
                  active && styles.tabLabelActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching saved items...</Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-triangle" size={48} color={COLORS.danger} />
          <Text style={styles.errorText}>Unable to sync bookmarks</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      ) : filteredAndSortedList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="bookmark" size={64} color="rgba(255,255,255,0.15)" />
          <Text style={styles.emptyTitle}>Nothing saved here</Text>
          <Text style={styles.emptySub}>
            {searchQuery ? 'Try adjusting your search query' : `Save items to view them here.`}
          </Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          data={filteredAndSortedList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 16,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 14 },
  tabsContainer: { height: 44, marginBottom: 16 },
  tabsScroll: { paddingHorizontal: 24, gap: 8 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 6,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  tabLabelActive: { color: '#FFF', fontWeight: '700' },
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(96, 165, 250, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  cardMeta: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  loadingText: { color: 'rgba(255,255,255,0.5)', marginTop: 12, fontSize: 14 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 60 },
  errorText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginTop: 16, textAlign: 'center' },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  retryText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginTop: 16, marginBottom: 6 },
  emptySub: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 20 },
});
