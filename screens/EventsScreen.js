import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, RefreshControl } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { FlashList } from '@shopify/flash-list';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { useQuery } from '@tanstack/react-query';
import { getEvents, getMyEventRegistrations, getUserRegisteredEventIds } from '@/services/supabaseService';
import { useUser } from '@/context/UserContext';
import { safeNavigate } from '@/utils/navigationGuard';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import GlassCard from '@/components/ui/GlassCard';
import { ErrorState } from '@/components/ui/ErrorState';
import { COLORS } from '@/constants/theme';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { useTheme } from '@/context/ThemeContext';

const CATEGORIES = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Fest'];
const MODES = ['All', 'Online', 'Offline'];

const EventCard = React.memo(function EventCard({ item, index, router, isRegistered }) {
  const pct = item.capacity ? Math.round((item.registered / item.capacity) * 100) : 0;
  const isOnline = !!item.meeting_link;

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 40).springify()} style={styles.cardContainer}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => safeNavigate(router, '/event-detail', { id: item.id })}
        style={styles.card}
      >
        <OptimizedImage 
          source={item.image_url || `https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?q=80&w=1000&auto=format&fit=crop`} 
          style={styles.poster}
          contentFit="cover"
        />
        <LinearGradient colors={['transparent', 'rgba(15, 23, 42, 0.98)']} style={styles.cardOverlay} />
        
        {isRegistered && (
          <View style={styles.registeredBadge}>
            <Feather name="check-circle" size={12} color="#10B981" />
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        )}

        <View style={styles.cardContent}>
           <View style={styles.dateBadge}>
              <Text style={styles.dateDay}>{(item.event_date || item.date)?.split('-')[2] || '20'}</Text>
              <Text style={styles.dateMonth}>{(item.event_date || item.date)?.split('-')[1]?.toUpperCase() || 'MAY'}</Text>
           </View>

           <View style={styles.mainInfo}>
              <View style={styles.badgeRow}>
                <View style={styles.typeTag}>
                   <Text style={styles.typeText}>{item.category?.toUpperCase() || 'EVENT'}</Text>
                </View>
                <View style={[styles.modeTag, { backgroundColor: isOnline ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)' }]}>
                   <Text style={[styles.modeText, { color: isOnline ? '#3B82F6' : '#10B981' }]}>
                     {isOnline ? 'ONLINE' : 'OFFLINE'}
                   </Text>
                </View>
              </View>
              
              <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
              
              <View style={styles.metaRow}>
                 <View style={styles.metaItem}>
                    <Feather name="map-pin" size={12} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.metaText} numberOfLines={1}>{item.venue || 'Main Block'}</Text>
                 </View>
                 <View style={styles.metaItem}>
                    <Feather name="users" size={12} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.metaText}>{item.registered || 0} Joined</Text>
                 </View>
              </View>
           </View>

           <View style={styles.progressSection}>
              <View style={styles.barContainer}>
                 <View style={[styles.barFill, { width: `${Math.min(100, pct)}%`, backgroundColor: pct > 80 ? '#EF4444' : '#3B82F6' }]} />
              </View>
              <Text style={styles.capacityText}>{pct}% Booked</Text>
           </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function EventsScreen() {
  const { user } = useUser();
  const { listRef, handleScroll } = useScrollRestoration('events');
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const { data: events, isLoading: eventsLoading, isError: isEventsError, refetch: refetchEvents } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: regsData, isLoading: regsLoading, refetch: refetchRegs } = useQuery({
    queryKey: ['event_registrations', user?.id],
    queryFn: async () => {
      const [regs, ids] = await Promise.all([
        getMyEventRegistrations(user.id),
        getUserRegisteredEventIds(user.id),
      ]);
      return { myEvents: regs.map((r) => r.events).filter(Boolean), registeredIds: ids };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const loading = eventsLoading || (!!user?.id && regsLoading);
  const myEvents = regsData?.myEvents || [];
  const registeredIds = regsData?.registeredIds || [];

  useFocusEffect(
    useCallback(() => {
      refetchEvents();
      if (user?.id) refetchRegs();
      setTab('all');
      setSearch('');
      setSelectedCategory('All');
      setSelectedMode('All');
    }, [refetchEvents, refetchRegs, user?.id])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchEvents(), refetchRegs()]);
    setRefreshing(false);
  };

  const filteredEvents = useMemo(() => {
    let list = events || [];
    if (tab === 'mine') {
      list = myEvents;
    } else if (tab === 'college') {
      list = (events || []).filter(item => 
        (user?.college_id && (String(item.college_id) === String(user.college_id) || String(item.institution_id) === String(user.college_id))) ||
        (user?.college_name && item.college_name && String(item.college_name).toLowerCase() === String(user.college_name).toLowerCase())
      );
    }
    
    return list.filter((item) => {
      const term = search.toLowerCase();
      const matchesSearch = 
        (item.title || '').toLowerCase().includes(term) ||
        (item.description || '').toLowerCase().includes(term) ||
        (item.venue || '').toLowerCase().includes(term) ||
        (item.category || '').toLowerCase().includes(term);

      const matchesCategory = selectedCategory === 'All' || 
        (item.category || '').toLowerCase() === selectedCategory.toLowerCase();

      let matchesMode = true;
      if (selectedMode === 'Online') {
        matchesMode = !!item.meeting_link;
      } else if (selectedMode === 'Offline') {
        matchesMode = !item.meeting_link;
      }

      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [tab, events, myEvents, search, selectedCategory, selectedMode, user]);

  const renderEventItem = useCallback(({ item, index }) => (
    <EventCard item={item} index={index} router={router} isRegistered={registeredIds.includes(item.id)} />
  ), [router, registeredIds]);

  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#070A13', '#0F172A', '#131C31']} style={StyleSheet.absoluteFillObject} />}
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Events</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>Events, Fests & Workshops</Text>
        </View>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]} onPress={handleRefresh} activeOpacity={0.8}>
           <Feather name="refresh-cw" size={16} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[styles.tabBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }, tab === 'all' && styles.tabBtnActive]} 
          onPress={() => setTab('all')} 
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, tab === 'all' && styles.tabTextActive]}>All Events</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }, tab === 'college' && styles.tabBtnActive]} 
          onPress={() => setTab('college')} 
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, tab === 'college' && styles.tabTextActive]}>My College</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }, tab === 'mine' && styles.tabBtnActive]} 
          onPress={() => setTab('mine')} 
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, tab === 'mine' && styles.tabTextActive]}>My Events ({myEvents.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Feather name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search name, speaker, venue..."
          placeholderTextColor={colors.inputPlaceholder}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Feather name="x" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filters */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, { backgroundColor: colors.card, borderColor: colors.cardBorder }, selectedCategory === cat && styles.filterChipActive]}
              onPress={() => setSelectedCategory(prev => prev === cat ? 'All' : cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, { color: colors.textSecondary }, selectedCategory === cat && styles.filterChipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {MODES.map((md) => (
            <TouchableOpacity
              key={md}
              style={[styles.filterChip, { backgroundColor: colors.card, borderColor: colors.cardBorder }, selectedMode === md && styles.filterChipActive]}
              onPress={() => setSelectedMode(prev => prev === md ? 'All' : md)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, selectedMode === md && styles.filterChipTextActive]}>{md}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isEventsError && !events ? (
        <ErrorState onRetry={refetchEvents} message="Failed to load events. Please try again." />
      ) : loading && !events ? (
        <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
          <SkeletonLoader height={200} borderRadius={24} style={{ marginBottom: 20 }} />
          <SkeletonLoader height={200} borderRadius={24} style={{ marginBottom: 20 }} />
          <SkeletonLoader height={200} borderRadius={24} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlashList
            ref={listRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            data={filteredEvents}
            keyExtractor={item => item.id}
            estimatedItemSize={350}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFF" />}
            renderItem={renderEventItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="calendar-blank" size={64} color="rgba(255,255,255,0.1)" />
                <Text style={styles.emptyText}>
                  {tab === 'mine' ? 'You have not registered for any events matching your filters.' : 'No upcoming events found.'}
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070A13' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 10, marginBottom: 12 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tabBtnActive: { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)' },
  tabText: { color: 'rgba(255,255,255,0.45)', fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: '#3B82F6', fontWeight: '800' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 8, marginHorizontal: 24, marginBottom: 10 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 13, fontWeight: '600' },
  filterSection: { marginBottom: 10 },
  filterScroll: { paddingHorizontal: 24, gap: 8, alignItems: 'center' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  filterChipActive: { backgroundColor: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.3)' },
  filterChipText: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '700' },
  filterChipTextActive: { color: '#3B82F6', fontWeight: '800' },
  divider: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 4 },
  listContent: { paddingHorizontal: 24, paddingBottom: 120 },
  cardContainer: { marginBottom: 20, height: 350 },
  card: { flex: 1, borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.01)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  poster: { ...StyleSheet.absoluteFillObject },
  cardOverlay: { ...StyleSheet.absoluteFillObject },
  registeredBadge: { position: 'absolute', top: 16, left: 16, zIndex: 2, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
  registeredText: { color: '#10B981', fontSize: 10, fontWeight: '800' },
  cardContent: { flex: 1, padding: 20, justifyContent: 'flex-end' },
  dateBadge: { position: 'absolute', top: 16, right: 16, width: 50, height: 56, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  dateMonth: { fontSize: 9, fontWeight: '800', color: '#3B82F6', marginTop: 1 },
  mainInfo: { marginBottom: 16 },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  typeTag: { backgroundColor: 'rgba(245, 158, 11, 0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typeText: { color: '#F59E0B', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  modeTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  modeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  eventTitle: { fontSize: 18, fontWeight: '900', color: '#FFF', lineHeight: 24, marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  metaText: { fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: '600' },
  progressSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barContainer: { flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  capacityText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },
  emptyState: { marginTop: 80, alignItems: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.3)', marginTop: 16, fontSize: 14, textAlign: 'center', paddingHorizontal: 24 }
});
