import { BlurView } from 'expo-blur';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { toggleBookmark, getBookmarks, getUserAppliedOpportunityIds } from '@/services/supabaseService';
import { getOpenedOpportunities, markOpportunityAsOpened, isItemNew } from '@/services/openedItemsService';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  Alert,
  ScrollView
, Share } from 'react-native';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { FlashList } from '@shopify/flash-list';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { useSupabaseList, useRawBookmarksQuery } from '@/hooks/useQueries';
import { safeNavigate } from '@/utils/navigationGuard';
import { requestQueue } from '@/lib/requestQueue';
import { ErrorState } from '@/components/ui/ErrorState';
import BookmarkButton from '@/components/ui/BookmarkButton';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { cacheData, getCachedData } from '@/services/cacheService';

import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const CATEGORIES = ['All', 'Applied', 'Internships', 'Jobs', 'Campus Drives', 'Scholarships'];

function OpportunitiesSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonTop}>
            <SkeletonLoader width="70%" height={14} borderRadius={4} />
            <SkeletonLoader width={20} height={20} borderRadius={10} />
          </View>
          <View style={{ marginBottom: 16 }}>
             <SkeletonLoader width="45%" height={24} borderRadius={8} />
          </View>
          <View style={styles.skeletonCompanyRow}>
            <SkeletonLoader width={44} height={44} borderRadius={22} />
            <View style={{ flex: 1, gap: 6, marginLeft: 12 }}>
              <SkeletonLoader width="40%" height={14} borderRadius={4} />
              <SkeletonLoader width="25%" height={14} borderRadius={4} />
            </View>
          </View>
          <View style={styles.skeletonDivider} />
          <SkeletonLoader width="100%" height={24} borderRadius={8} />
        </View>
      ))}
    </View>
  );
}

const OpportunityCard = React.memo(function OpportunityCard({ item, index, isBookmarked, isApplied, isNew, onBookmark, onShare, onPress }) {
  const { colors, isDark } = useTheme();

  const getGradient = (type) => {
    const t = String(type || '').toLowerCase();
    if (t.includes('intern')) return COLORS.gradientPrimary;
    if (t.includes('job') || t.includes('full')) return COLORS.gradientSuccess;
    if (t.includes('campus') || t.includes('drive')) return COLORS.gradientPurple;
    return COLORS.gradientSecondary;
  };

  const formattedStipend = item.stipend 
    ? (item.stipend.includes('₹') ? item.stipend : `₹ ${item.stipend}`)
    : 'Competitive';

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 30).springify()} layout={Layout.springify()} style={styles.cardWrapper}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]} 
        activeOpacity={0.8}
        onPress={onPress}
      >
          {/* Top Row: Title and save */}
          <View style={styles.cardTopRow}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={styles.saveBtn} onPress={(e) => { e?.stopPropagation?.(); onShare(item); }}>
                <Feather 
                  name="share-2" 
                  size={20} 
                  color={colors.textMuted} 
                />
              </TouchableOpacity>
              <BookmarkButton isBookmarked={isBookmarked} onPress={() => onBookmark(item.id)} size={38} iconSize={16} />
            </View>
          </View>

          {/* Badges section */}
          <View style={styles.badgesRow}>
            {isNew && (
              <View style={[styles.badge, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444', borderWidth: 1 }]}>
                <Text style={[styles.badgeText, { color: '#EF4444', fontWeight: '900' }]}>NEW</Text>
              </View>
            )}
            {item.location && (
               <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }]}>
                 <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{item.location}</Text>
               </View>
            )}
            {item.duration && (
               <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }]}>
                 <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{item.duration}</Text>
               </View>
            )}
            <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }]}>
               <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{item.type || 'Internship'}</Text>
            </View>
            {isApplied && (
               <View style={[styles.badge, { backgroundColor: COLORS.successLight }]}>
                 <Text style={[styles.badgeText, { color: COLORS.success, fontWeight: '800' }]}>APPLIED</Text>
               </View>
            )}
          </View>

          {/* Company details row */}
          <TouchableOpacity
            style={styles.companyRow}
            activeOpacity={0.7}
            onPress={(e) => {
              e?.stopPropagation?.();
              const url = item.company_website || item.website || item.apply_url;
              if (url) {
                Linking.openURL(url).catch(() => onPress());
              } else {
                onPress();
              }
            }}
          >
             <LinearGradient colors={getGradient(item.type)} style={styles.companyLogo}>
                {item.company_logo ? (
                    <OptimizedImage source={item.company_logo} style={styles.companyLogoImg} contentFit="cover" />
                ) : (
                   <Text style={styles.logoText}>{item.company?.charAt(0) || 'C'}</Text>
                )}
             </LinearGradient>
             <View style={styles.companyInfo}>
                <Text style={[styles.companyName, { color: colors.textPrimary }]}>{item.company}</Text>
                <Text style={[styles.companyLocation, { color: colors.textMuted }]}>{item.location || 'Remote'}</Text>
             </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Footer: stipend & deadline */}
          <View style={styles.cardFooter}>
             <View>
                <Text style={[styles.stipendLabel, { color: colors.textMuted }]}>STIPEND / SALARY</Text>
                <Text style={[styles.stipendText, { color: colors.textPrimary }]}>{formattedStipend}</Text>
             </View>
             <View style={styles.actionBlock}>
                {item.deadline && (
                  <Text style={[styles.deadlineText, { color: colors.textMuted }]}>Apply by {new Date(item.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
                )}
                <View style={styles.applyBtnMini}>
                  <Text style={styles.applyBtnText}>Details</Text>
                  <Feather name="arrow-right" size={14} color="#FFF" />
                </View>
             </View>
          </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function OpportunitiesScreen() {
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const { listRef, handleScroll } = useScrollRestoration('opportunities');
  const queryClient = useQueryClient();
  const { data: rawOpportunities, isLoading, isFetching, isError, refetch } = useSupabaseList('opportunities', 'id, title, company, company_logo, type, location, stipend, duration, deadline, created_at, eligible_branches, eligible_years', {
    order: { column: 'created_at', ascending: false }
  });
  const { data: userBookmarks, refetch: refetchBookmarks } = useRawBookmarksQuery(user?.id);

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkIds, setBookmarkIds] = useState(new Set());
  const [openedOpportunityIds, setOpenedOpportunityIds] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const router = useRouter();

  const [activeFilters, setActiveFilters] = useState({
    jobType: 'All', // 'All', 'Internship', 'Full Time', 'Government', 'Private'
    location: 'All', // 'All', 'Remote', 'On-site'
    sortBy: 'Latest' // 'Latest', 'Highest Salary'
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
      if (user?.id) refetchBookmarks();
      setSelectedCategory('All');
      setActiveFilters({
        jobType: 'All',
        location: 'All',
        sortBy: 'Latest'
      });
      setSearch('');
      getOpenedOpportunities().then(ids => {
        setOpenedOpportunityIds(ids || []);
      });
    }, [refetch, refetchBookmarks, user?.id])
  );

  useEffect(() => {
    if (userBookmarks && Array.isArray(userBookmarks)) {
      setBookmarkIds(new Set(userBookmarks.filter((b) => b && b.entity_type === 'opportunity').map((b) => b.entity_id)));
    }
  }, [userBookmarks]);

  useEffect(() => {
    const fetchApplied = async () => {
      if (user?.id) {
        const applied = await getUserAppliedOpportunityIds(user.id);
        setAppliedIds(new Set(applied));
      }
    };
    fetchApplied();
  }, [user?.id]);

  useEffect(() => {
    if (rawOpportunities) {
      const todayStr = new Date().toISOString().split('T')[0];
      const unexpired = rawOpportunities.filter((o) => !o.deadline || o.deadline >= todayStr);

      const filtered = unexpired.filter(item => {
        if (!user?.branch) return true;
        const userBranch = user.branch.toLowerCase();
        const branchMatch = !item.eligible_branches || 
                           item.eligible_branches.length === 0 ||
                           item.eligible_branches.includes('All') || 
                           item.eligible_branches.some(b => {
                             const tb = b.toLowerCase();
                             return tb === userBranch || tb.includes(userBranch) || userBranch.includes(tb);
                           });
        return branchMatch;
      });
      setOpportunities(filtered);
      setLoading(false);
    }
  }, [rawOpportunities, user?.branch]);



  const handleBookmark = async (itemId) => {
    if (!user?.id) return;
    
    // Optimistic Update
    setBookmarkIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });

    try {
      await requestQueue.enqueue('TOGGLE_BOOKMARK', { userId: user.id, entityType: 'opportunity', entityId: itemId });
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
    } catch (e) {
      console.warn("Bookmark failed/queued", e);
    }
  };

  const handleShare = async (item) => {
    try {
      const shareUrl = item.company_website || item.apply_url || item.apply_link || 'https://feedxpolytechnic.com';
      const stipendMsg = item.stipend ? `\n💰 Stipend/Salary: ${item.stipend}` : '';
      const locationMsg = item.location ? `\n📍 Location: ${item.location}` : '';
      const typeMsg = item.type ? `\n💼 Type: ${item.type}` : '';

      let deadlineMsg = '';
      let availabilityMsg = '';

      if (item.deadline) {
        const deadlineDate = new Date(item.deadline);
        const isValidDate = !isNaN(deadlineDate.getTime());
        const formattedDeadline = isValidDate
          ? deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : item.deadline;

        deadlineMsg = `\n⏳ Last Date to Apply: ${formattedDeadline}`;

        if (isValidDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          deadlineDate.setHours(0, 0, 0, 0);

          const diffTime = deadlineDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 0) {
            availabilityMsg = `\n🟢 Status: Active & Available (${diffDays} day${diffDays === 1 ? '' : 's'} left)`;
          } else if (diffDays === 0) {
            availabilityMsg = `\n⚠️ Status: Available (Last Day Today!)`;
          } else {
            availabilityMsg = `\n🔴 Status: Expired (Deadline Passed)`;
          }
        } else {
          availabilityMsg = `\n🟢 Status: Available`;
        }
      } else {
        deadlineMsg = `\n⏳ Last Date to Apply: Open / Apply Soon`;
        availabilityMsg = `\n🟢 Status: Available`;
      }

      const message = `🚀 ${item.title} at ${item.company || item.company_name || 'FEEDX'}${typeMsg}${stipendMsg}${locationMsg}${deadlineMsg}${availabilityMsg}\n\n👉 Apply directly on FEEDX: ${shareUrl}`;

      await Share.share({
        message,
        title: item.title,
        url: shareUrl,
      });
    } catch (error) {
      console.warn("Sharing failed", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchBookmarks()]);
    setRefreshing(false);
  };

  // Salary parser to sort by highest salary client-side
  const parseSalary = (stipendText) => {
    if (!stipendText) return 0;
    const digits = String(stipendText).replace(/[^0-9]/g, '');
    return parseInt(digits, 10) || 0;
  };

  // Helper search function to check matches
  const searchQuery = (item, queryText) => {
    if (!queryText || queryText.trim() === '') return true;
    const text = queryText.toLowerCase();
    return (item.title || '').toLowerCase().includes(text) || 
           (item.company || '').toLowerCase().includes(text) ||
           (item.location || '').toLowerCase().includes(text) ||
           (item.eligible_branches || []).some(b => String(b).toLowerCase().includes(text));
  };

  const filteredData = opportunities.filter(item => {
    const isApplied = appliedIds.has(item.id);

    // 1. Search Query Match
    const matchesSearch = searchQuery(item, search);

    // 2. Category Match
    let matchesCategory = false;
    if (selectedCategory === 'All') {
      matchesCategory = !isApplied; // Hide applied opportunities from All tab
    } else if (selectedCategory === 'Applied') {
      matchesCategory = isApplied; // Show ONLY applied opportunities in Applied tab
    } else {
      matchesCategory = !isApplied && (
        (selectedCategory === 'Internships' && String(item.type).toLowerCase().includes('intern')) ||
        (selectedCategory === 'Jobs' && String(item.type).toLowerCase().includes('job')) ||
        (selectedCategory === 'Campus Drives' && String(item.type).toLowerCase().includes('drive')) ||
        (selectedCategory === 'Scholarships' && String(item.type).toLowerCase().includes('scholar'))
      );
    }

    // 3. Advanced Job Type Filter
    const matchesJobType = activeFilters.jobType === 'All' ||
      (activeFilters.jobType === 'Internship' && String(item.type).toLowerCase().includes('intern')) ||
      (activeFilters.jobType === 'Full Time' && String(item.type).toLowerCase().includes('job')) ||
      (activeFilters.jobType === 'Government' && String(item.type).toLowerCase().includes('govt')) ||
      (activeFilters.jobType === 'Private' && !String(item.type).toLowerCase().includes('govt'));

    // 4. Advanced Location Filter
    const matchesLocation = activeFilters.location === 'All' ||
      (activeFilters.location === 'Remote' && String(item.location).toLowerCase().includes('remote')) ||
      (activeFilters.location === 'On-site' && !String(item.location).toLowerCase().includes('remote'));

    return matchesSearch && matchesCategory && matchesJobType && matchesLocation;
  });

  // Handle Sorts
  const sortedData = [...filteredData].sort((a, b) => {
    if (activeFilters.sortBy === 'Highest Salary') {
      return parseSalary(b.stipend) - parseSalary(a.stipend);
    }
    // Default is 'Latest'
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const clearFilters = () => {
    setActiveFilters({
      jobType: 'All',
      location: 'All',
      sortBy: 'Latest'
    });
    setSelectedCategory('All');
    setSearch('');
  };

  const handleOpenOpportunity = useCallback(async (item) => {
    try {
      const nextIds = await markOpportunityAsOpened(item.id);
      setOpenedOpportunityIds(nextIds || []);
    } catch (e) {
      console.warn('Failed to mark opportunity as opened:', e);
    }
    safeNavigate(router, '/opportunity-detail', { id: item.id });
  }, [router]);

  const renderOpportunityItem = useCallback(({ item, index }) => (
    <OpportunityCard 
      item={item} 
      index={index} 
      isBookmarked={bookmarkIds.has(item.id)}
      isApplied={appliedIds.has(item.id)}
      isNew={isItemNew(item.created_at, openedOpportunityIds)}
      onBookmark={handleBookmark}
      onShare={handleShare}
      onPress={() => handleOpenOpportunity(item)}
    />
  ), [bookmarkIds, appliedIds, openedOpportunityIds, handleOpenOpportunity, handleBookmark, handleShare]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <AnimatedBackground />}

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleBox}>
           <View style={[styles.iconCircle, { borderColor: colors.border }]}>
              <MaterialCommunityIcons name="briefcase-variant-outline" size={22} color={colors.primary} />
           </View>
           <View>
             <Text style={[styles.title, { color: colors.textPrimary }]}>Opportunities</Text>
             <Text style={[styles.subtitle, { color: colors.textMuted }]}>Placements, Internships & Jobs</Text>
           </View>
        </View>

        {(activeFilters.jobType !== 'All' || activeFilters.location !== 'All' || activeFilters.sortBy !== 'Latest' || selectedCategory !== 'All' || search !== '') && (
          <TouchableOpacity style={[styles.clearBtn, { backgroundColor: colors.inputBg }]} onPress={clearFilters}>
             <Feather name="refresh-cw" size={16} color={colors.primary} />
             <Text style={[styles.clearText, { color: colors.textSecondary }]}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Input Row */}
      <View style={styles.searchRow}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="search" size={18} color={colors.textMuted} style={{ marginRight: 6 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search company, job titles, locations..."
            placeholderTextColor={colors.inputPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
          {search.trim() !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.filterToggleBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }, showFilters && styles.filterToggleBtnActive]} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <Feather name="sliders" size={20} color={showFilters ? '#FFF' : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Collapsible Filter Panel */}
      {showFilters && (
        <Animated.View entering={FadeInDown.duration(300)} style={[styles.filtersPanel, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Job Type Filter */}
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Position Type:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipRow}>
              {['All', 'Internship', 'Full Time', 'Government', 'Private'].map(t => (
                <TouchableOpacity 
                  key={t}
                  style={[styles.filterChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderColor: colors.border }, activeFilters.jobType === t && styles.filterChipActive]}
                  onPress={() => setActiveFilters(prev => ({ ...prev, jobType: t }))}
                >
                  <Text style={[styles.filterChipText, { color: colors.textSecondary }, activeFilters.jobType === t && styles.filterChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Location Filter */}
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Location:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipRow}>
              {['All', 'Remote', 'On-site'].map(l => (
                <TouchableOpacity 
                  key={l}
                  style={[styles.filterChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderColor: colors.border }, activeFilters.location === l && styles.filterChipActive]}
                  onPress={() => setActiveFilters(prev => ({ ...prev, location: l }))}
                >
                  <Text style={[styles.filterChipText, { color: colors.textSecondary }, activeFilters.location === l && styles.filterChipTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      )}

      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {CATEGORIES.map((item) => {
            const isSelected = selectedCategory === item;

            return (
              <TouchableOpacity 
                key={item}
                onPress={() => setSelectedCategory(prev => prev === item ? 'All' : item)}
                activeOpacity={0.8}
                style={[styles.chip, { backgroundColor: isSelected ? colors.primary : colors.card, borderColor: isSelected ? colors.primary : colors.cardBorder }, isSelected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, { color: isSelected ? '#FFF' : colors.textSecondary }, isSelected && styles.chipTextSelected]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main content list */}
      {isError && opportunities.length === 0 ? (
        <ErrorState onRetry={refetch} message="Failed to load opportunities. Please check your network." />
      ) : isLoading && opportunities.length === 0 ? (
        <OpportunitiesSkeleton />
      ) : (
        <View style={{ flex: 1 }}>
          <FlashList
            ref={listRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            data={sortedData}
            keyExtractor={(item) => item.id}
            estimatedItemSize={175}
            renderItem={renderOpportunityItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} tintColor={isDark ? '#FFF' : '#0F172A'} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="briefcase-search" size={64} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Opportunities Found</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>We couldn&apos;t find any job or internship match. Try modifying your criteria.</Text>
              </View>
            }
          />
        </View>
      )}
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
  iconCircle: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(34, 197, 94, 0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
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
  card: { borderRadius: RADIUS.xl, backgroundColor: COLORS.card, padding: 18, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  itemTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, lineHeight: 22, paddingRight: 12 },
  saveBtn: { padding: 4 },
  badgesRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)' },
  badgeText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  companyLogo: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  companyLogoImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  logoText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  companyInfo: { flex: 1, justifyContent: 'center' },
  companyName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  companyLocation: { fontSize: 12, color: COLORS.textMuted, marginTop: 1, fontWeight: '600' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stipendLabel: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: 2 },
  stipendText: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  actionBlock: { alignItems: 'flex-end', gap: 4 },
  deadlineText: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  applyBtnMini: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', gap: 6 },
  applyBtnText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  emptyState: { marginTop: 80, alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8, marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  skeletonContainer: { paddingHorizontal: 16, marginTop: 10 },
  skeletonCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  skeletonTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  skeletonTitle: { height: 16, width: '70%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 8 },
  skeletonIconMini: { height: 20, width: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10 },
  skeletonBadges: { height: 24, width: '45%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 16 },
  skeletonCompanyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  skeletonLogo: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.04)' },
  skeletonCompanyName: { height: 14, width: '40%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 7 },
  skeletonCompanyLoc: { height: 10, width: '25%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 5 },
  skeletonDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 12 },
  skeletonFooter: { height: 24, width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8 }
});