import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Linking, Modal, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInDown, Layout, SlideInRight, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { markNotificationRead, markAllNotificationsRead, getNotifications } from '@/services/supabaseService';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { SkeletonLoader, InlineLoader } from '@/components/ui/Loaders';
import { useTheme } from '@/context/ThemeContext';
const { width } = Dimensions.get('window');

const sanitizeUrl = (url) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    return url.replace('/view', '/preview').split('?')[0];
  }
  return url;
};

function NotificationCard({ item, index, onOpen }) {
  const { colors, isDark } = useTheme();

  const getGradient = (type) => {
    const t = String(type || '').toLowerCase();
    if (t.includes('exam')) return ['#F43F5E', '#E11D48'];
    if (t.includes('event')) return ['#8B5CF6', '#D946EF'];
    if (t.includes('job') || t.includes('opportunity')) return ['#10B981', '#059669'];
    if (t.includes('admin') || t.includes('announcement')) return ['#F59E0B', '#D97706'];
    return ['#3B82F6', '#06B6D4'];
  };

  const getIcon = (type) => {
    const t = String(type || '').toLowerCase();
    if (t.includes('exam')) return 'file-document';
    if (t.includes('event')) return 'calendar';
    if (t.includes('job') || t.includes('opportunity')) return 'briefcase';
    if (t.includes('admin') || t.includes('announcement')) return 'bullhorn';
    return 'bell';
  };

  return (
    <Animated.View entering={SlideInRight.delay(index * 60).springify()} layout={Layout.springify()}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => onOpen(item)}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, !item.is_read && { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.04)' }]}>
          <LinearGradient colors={getGradient(item.type)} style={styles.iconBox} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <MaterialCommunityIcons name={getIcon(item.type)} size={20} color="#fff" />
          </LinearGradient>
          
          <View style={styles.content}>
            <Text style={[styles.notifTitle, { color: colors.textPrimary }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.notifMessage, { color: colors.textSecondary }]} numberOfLines={2}>{item.message || item.body}</Text>
            <View style={styles.cardFooterRow}>
              <Text style={[styles.notifTime, { color: colors.textMuted }]}>
                {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </Text>
              <TouchableOpacity style={styles.viewBadgeBtn} onPress={() => onOpen(item)}>
                <Text style={styles.viewBadgeText}>View</Text>
                <Feather name="chevron-right" size={14} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>
          
          {!item.is_read && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}


export default function UpdatesScreen() {
  const { notifications: ctxNotifications, refreshDashboard, user } = useUser();
  const { colors, isDark } = useTheme();
  const { listRef, handleScroll } = useScrollRestoration('updates');
  const [notifications, setNotifications] = useState(() => ctxNotifications || []);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const router = useRouter();

  const bellRotation = useSharedValue(0);

  const loadUpdates = async (pageNum = 1, shouldAppend = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Fetch fresh notifications from database or fallback
      const data = await getNotifications(user?.id, user?.college_id, true, pageNum, 20);
      
      const newList = data || [];
      if (newList.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setNotifications((prev) => {
        const combined = shouldAppend ? [...prev, ...newList] : newList;
        // Deduplicate by ID
        const unique = Array.from(new Map(combined.map((n) => [n.id, n])).values());
        // Sort by created_at DESC
        return unique.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      });
    } catch (e) {
      console.warn('UpdatesScreen load error:', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadUpdates(1, false);
    refreshDashboard();
  }, [user?.id]);

  useEffect(() => {
    if (ctxNotifications) {
      setNotifications(ctxNotifications);
    }
  }, [ctxNotifications]);

  useEffect(() => {
    if (notifications?.some(n => !n.is_read)) {
      bellRotation.value = withRepeat(
        withSequence(
          withTiming(-15, { duration: 100 }),
          withTiming(15, { duration: 100 }),
          withTiming(0, { duration: 100 })
        ),
        4,
        true
      );
    }
  }, [notifications]);

  const handleRefresh = async () => {
    setPage(1);
    await Promise.all([loadUpdates(1, false), refreshDashboard()]);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadUpdates(nextPage, true);
    }
  };

  const handleOpen = async (item) => {
    if (!item.is_read && user?.id) {
      await markNotificationRead(user.id, item);
      loadUpdates(1, false);
      refreshDashboard();
    }
    
    // Navigate based on type
    const t = String(item.type || '').toLowerCase();
    if (t.includes('event') && item.entity_id) {
      router.push(`/event-detail?id=${item.entity_id}`);
    } else if ((t.includes('job') || t.includes('opportunity')) && item.entity_id) {
      router.push(`/opportunity-detail?id=${item.entity_id}`);
    } else if (t.includes('exam')) {
      router.push('/(tabs)/academics');
    } else {
      setSelected(item); // Fallback to modal for general announcements
    }
  };

  const bellAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${bellRotation.value}deg` }]
  }));

  const unreadCount = (notifications || []).filter(n => !n.is_read).length;

  const FILTERS = [
    { key: 'All', label: 'All' },
    { key: 'Academic', label: 'Academic' },
    { key: 'Placements', label: 'Placements' },
    { key: 'Innovation', label: 'Innovation' },
    { key: 'Scholarships', label: 'Scholarships' },
    { key: 'Events', label: 'Events' },
    { key: 'Resources', label: 'Resources' },
    { key: 'Announcements', label: 'Announcements' },
  ];

  const getFilterCount = (filterKey) => {
    return (notifications || []).filter((n) => {
      if (filterKey === 'All') return true;
      const typeStr = String(n.type || '').toLowerCase().trim();
      if (filterKey === 'Academic') return typeStr.includes('academic') || typeStr.includes('exam') || typeStr.includes('timetable');
      if (filterKey === 'Placements') return typeStr.includes('placement') || typeStr.includes('job') || typeStr.includes('opportunity');
      if (filterKey === 'Innovation') return typeStr.includes('innovation');
      if (filterKey === 'Scholarships') return typeStr.includes('scholarship');
      if (filterKey === 'Events') return typeStr.includes('event');
      if (filterKey === 'Resources') return typeStr.includes('resource');
      if (filterKey === 'Announcements') return ['admin', 'general', 'announcement', 'system', ''].includes(typeStr);
      return true;
    }).length;
  };

  const filteredNotifications = (notifications || []).filter((n) => {
    if (filter === 'All') return true;
    const typeStr = String(n.type || '').toLowerCase().trim();
    if (filter === 'Academic') return typeStr.includes('academic') || typeStr.includes('exam') || typeStr.includes('timetable');
    if (filter === 'Placements') return typeStr.includes('placement') || typeStr.includes('job') || typeStr.includes('opportunity');
    if (filter === 'Innovation') return typeStr.includes('innovation');
    if (filter === 'Scholarships') return typeStr.includes('scholarship');
    if (filter === 'Events') return typeStr.includes('event');
    if (filter === 'Resources') return typeStr.includes('resource');
    if (filter === 'Announcements') return ['admin', 'general', 'announcement', 'system', ''].includes(typeStr);
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFillObject} />}

      {/* Top Header */}
      <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Updates</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Alerts, announcements & broadcasts</Text>
        </View>
        
        <View style={styles.bellContainer}>
          <Animated.View style={bellAnimStyle}>
            <Feather name="bell" size={26} color={colors.textPrimary} />
          </Animated.View>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Filter Chips Bar */}
      <View style={styles.filterBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTERS.map((f) => {
            const count = getFilterCount(f.key);
            const isActive = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip, 
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  isActive && styles.filterChipActive
                ]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterText, 
                  { color: colors.textSecondary },
                  isActive && styles.filterTextActive
                ]}>
                  {f.label}
                </Text>
                <View style={[styles.countPill, { backgroundColor: colors.inputBg }, isActive && styles.countPillActive]}>
                  <Text style={[styles.countText, { color: colors.textMuted }, isActive && styles.countTextActive]}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllBtn}
              onPress={async () => {
                await markAllNotificationsRead(user.id, notifications);
                loadUpdates(1, false);
                refreshDashboard();
              }}
              activeOpacity={0.8}
            >
              <Feather name="check-circle" size={14} color="#3B82F6" />
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <FlatList
          ref={listRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          renderItem={({ item, index }) => <NotificationCard item={item} index={index} onOpen={handleOpen} />}
          ListEmptyComponent={
            loading && notifications.length === 0 ? (
              <View style={{ paddingHorizontal: 20 }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <View key={i} style={styles.skeletonCard}>
                    <View style={styles.skeletonIcon}>
                      <SkeletonLoader width={48} height={48} borderRadius={24} />
                    </View>
                    <View style={styles.skeletonContent}>
                      <SkeletonLoader width="80%" height={16} style={{ marginBottom: 8 }} />
                      <SkeletonLoader width="60%" height={12} style={{ marginBottom: 12 }} />
                      <SkeletonLoader width="30%" height={10} />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyBox}>
                <LinearGradient colors={COLORS.gradientPrimary} style={styles.emptyIconBox}>
                  <Feather name="check-circle" size={28} color="#fff" />
                </LinearGradient>
                <Text style={styles.emptyTitle}>All Caught Up!</Text>
                <Text style={styles.emptyHint}>No updates found in this category.</Text>
              </View>
            )
          }
          ListFooterComponent={
            loadingMore ? (
              <InlineLoader color={COLORS.primary} message="Loading more updates..." />
            ) : null
          }
        />

      {/* Details Modal */}
      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <BlurView intensity={20} tint="dark" style={styles.modalOverlay}>
           <Animated.View entering={FadeInDown} style={styles.modalContent}>
             <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
               <Feather name="x" size={22} color="#FFF" />
             </TouchableOpacity>
             
             <ScrollView showsVerticalScrollIndicator={false}>
               <Text style={styles.modalTitle}>{selected?.title}</Text>
               <Text style={styles.modalTime}>{new Date(selected?.created_at).toLocaleString()}</Text>
               <View style={styles.modalDivider} />
               <Text style={styles.modalMessage}>{selected?.message || selected?.body}</Text>
               
               {selected?.apply_url && (
                 <TouchableOpacity 
                   style={styles.modalAction} 
                   onPress={() => Linking.openURL(sanitizeUrl(selected.apply_url))}
                 >
                   <Text style={styles.modalActionText}>Visit Attached Link</Text>
                   <Feather name="external-link" size={18} color="#FFF" />
                 </TouchableOpacity>
               )}
             </ScrollView>
           </Animated.View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  title: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary },
  subtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2, fontWeight: '600' },
  bellContainer: { position: 'relative', width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  filterBarContainer: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  filterTextActive: {
    color: '#FFF',
  },
  countPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  countPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  countTextActive: {
    color: '#FFF',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    gap: 6,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3B82F6',
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  cardUnread: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  content: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  notifMessage: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  notifTime: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  viewBadgeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(59, 130, 246, 0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.25)' },
  viewBadgeText: { fontSize: 11, fontWeight: '800', color: '#3B82F6' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginLeft: 8, marginTop: 4 },

  emptyBox: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIconBox: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', ...SHADOWS.medium },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textSecondary },
  emptyHint: { fontSize: 12, color: COLORS.textMuted },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { width: width * 0.88, maxHeight: '80%', backgroundColor: '#0F172A', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  closeBtn: { alignSelf: 'flex-end', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  modalTime: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  modalDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 14 },
  modalMessage: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 22 },
  modalAction: { marginTop: 20, backgroundColor: '#3B82F6', height: 48, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  modalActionText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  skeletonContainer: { paddingHorizontal: 20, marginTop: 8 },
  skeletonCard: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, gap: 14 },
  skeletonIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)' },
  skeletonContent: { flex: 1, gap: 8 },
  skeletonTitle: { height: 14, width: '40%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 7 },
  skeletonMessage: { height: 12, width: '85%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6 },
  skeletonTime: { height: 10, width: '25%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 5 }
});