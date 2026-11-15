import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Linking, Modal, ScrollView, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, Layout, SlideInRight, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { markNotificationRead, markAllNotificationsRead, getNotifications } from '@/services/supabaseService';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

const getGradient = (type) => {
  const t = String(type || '').toLowerCase();
  if (t.includes('exam')) return ['#F43F5E', '#E11D48'];
  if (t.includes('event')) return ['#8B5CF6', '#D946EF'];
  if (t.includes('job') || t.includes('opportunity') || t.includes('placement')) return ['#10B981', '#059669'];
  if (t.includes('admin') || t.includes('announcement')) return ['#F59E0B', '#D97706'];
  return ['#3B82F6', '#06B6D4'];
};

const getIcon = (type) => {
  const t = String(type || '').toLowerCase();
  if (t.includes('exam')) return 'file-document';
  if (t.includes('event')) return 'calendar';
  if (t.includes('job') || t.includes('opportunity') || t.includes('placement')) return 'briefcase';
  if (t.includes('admin') || t.includes('announcement')) return 'bullhorn';
  return 'bell';
};

function NotificationCard({ item, index, onOpen }) {
  const { colors, isDark } = useTheme();
  const isCampus = Boolean(item.college_id || String(item.type || '').toLowerCase().includes('college') || String(item.type || '').toLowerCase().includes('campus'));
  const isUnread = !item.is_read;

  return (
    <Animated.View entering={FadeInDown.duration(280).delay(Math.min(index * 25, 250))} layout={Layout.springify()}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => onOpen(item)}>
        <View
          style={[
            styles.card,
            isUnread
              ? {
                  backgroundColor: isDark ? 'rgba(30, 58, 138, 0.28)' : '#EFF6FF',
                  borderColor: '#3B82F6',
                  borderWidth: 1.5,
                  shadowColor: '#3B82F6',
                  shadowOpacity: isDark ? 0.25 : 0.12,
                  shadowRadius: 8,
                }
              : {
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.65)' : '#F8FAFC',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                  borderWidth: 1,
                  opacity: 0.9,
                },
          ]}
        >
          <LinearGradient
            colors={getGradient(item.type)}
            style={[styles.iconBox, !isUnread && { opacity: 0.85 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name={getIcon(item.type)} size={20} color="#fff" />
          </LinearGradient>
          
          <View style={styles.content}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              {isCampus ? (
                <View style={styles.campusBadge}>
                  <Text style={styles.campusBadgeText}>🏛️ CAMPUS</Text>
                </View>
              ) : (
                <View style={styles.stateBadge}>
                  <Text style={styles.stateBadgeText}>🌐 OVERALL</Text>
                </View>
              )}

              {isUnread ? (
                <View style={styles.newPillBadge}>
                  <Text style={styles.newPillBadgeText}>🔴 NEW</Text>
                </View>
              ) : (
                <View style={styles.readPillBadge}>
                  <Text style={styles.readPillBadgeText}>✓ READ</Text>
                </View>
              )}

              <Text
                style={[
                  styles.notifTitle,
                  { color: isUnread ? colors.textPrimary : colors.textSecondary, flex: 1 },
                  isUnread && { fontWeight: '900' },
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </View>

            <Text
              style={[
                styles.notifMessage,
                { color: isUnread ? colors.textSecondary : colors.textMuted },
                isUnread && { fontWeight: '600' },
              ]}
              numberOfLines={2}
            >
              {item.message || item.body}
            </Text>

            <View style={styles.cardFooterRow}>
              <Text style={[styles.notifTime, { color: colors.textMuted }]}>
                {new Date(item.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <TouchableOpacity style={styles.viewBadgeBtn} onPress={() => onOpen(item)}>
                <Text style={styles.viewBadgeText}>{isUnread ? 'Read' : 'View'}</Text>
                <Feather name="chevron-right" size={14} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>
          
          {isUnread && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}


export default function UpdatesScreen() {
  const insets = useSafeAreaInsets();
  const { 
    notifications: ctxNotifications, 
    setNotifications: setCtxNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    refreshDashboard, 
    user 
  } = useUser();
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
  const params = useLocalSearchParams();
  const targetNotifId = params?.notificationId || params?.id;

  const bellRotation = useSharedValue(0);
  const inFlightRef = React.useRef(false);
  const deepLinkHandledRef = React.useRef(null);

  const loadUpdates = React.useCallback(async (pageNum = 1, shouldAppend = false) => {
    if (inFlightRef.current && !shouldAppend && pageNum === 1) return;
    inFlightRef.current = true;
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const collegeId = user?.college_id || user?.institution_id || user?.user_metadata?.college_id;

      // Fetch fresh notifications from database or fallback
      const data = await getNotifications(user?.id, collegeId, true, pageNum, 20);
      
      const newList = data || [];
      if (newList.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setNotifications((prev) => {
        const combined = shouldAppend ? [...prev, ...newList] : newList;
        // Deduplicate by normalized ID
        const unique = Array.from(new Map(combined.map((n) => [String(n.id), n])).values());
        // Sort by created_at DESC
        return unique.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      });

      // Synchronize first page with global context if available
      if (pageNum === 1 && setCtxNotifications && newList.length > 0) {
        setCtxNotifications(newList.slice(0, 25));
      }
    } catch (e) {
      console.warn('UpdatesScreen load error:', e);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user?.id, user?.college_id, user?.institution_id, user?.user_metadata?.college_id, setCtxNotifications]);

  // Initial authoritative single load on mount / user change
  useEffect(() => {
    loadUpdates(1, false);
  }, [user?.id, loadUpdates]);

  // Deep-link auto-open specific notification (guarded to run only once per targetNotifId)
  useEffect(() => {
    if (targetNotifId && notifications && notifications.length > 0 && deepLinkHandledRef.current !== targetNotifId) {
      const match = notifications.find(n => String(n.id) === String(targetNotifId));
      if (match) {
        deepLinkHandledRef.current = targetNotifId;
        setSelected(match);
        if (!match.is_read) {
          setNotifications((prev) =>
            prev.map((n) => (String(n.id) === String(match.id) ? { ...n, is_read: true } : n))
          );
          markNotificationRead(user?.id || 'anonymous', match).catch(() => {});
          if (markNotificationAsRead) markNotificationAsRead(match.id);
        }
      }
    }
  }, [targetNotifId, notifications, user?.id, markNotificationAsRead]);

  useEffect(() => {
    if (notifications?.some(n => !n.is_read)) {
      try {
        if (typeof withRepeat === 'function' && typeof withSequence === 'function' && typeof withTiming === 'function') {
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
      } catch (_) {}
    }
  }, [notifications]);

  const handleRefresh = async () => {
    setPage(1);
    await loadUpdates(1, false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !inFlightRef.current) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadUpdates(nextPage, true);
    }
  };

  const handleOpen = async (item) => {
    // 1. Instant optimistic state update: immediately change border and background
    if (!item.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (String(n.id) === String(item.id) ? { ...n, is_read: true } : n))
      );
      markNotificationRead(user?.id || 'anonymous', item).catch(() => {});
      if (markNotificationAsRead) markNotificationAsRead(item.id);
    }
    
    // 2. Navigate based on type
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
    { key: 'Unread', label: '🔴 Unread' },
    { key: 'All', label: 'All Notices' },
    { key: 'College', label: '🏛️ Campus Notices' },
    { key: 'Statewide', label: '🌐 State-wide Updates' },
    { key: 'Academic', label: 'Academic' },
    { key: 'Placements', label: 'Placements' },
    { key: 'Innovation', label: 'Innovation' },
    { key: 'Scholarships', label: 'Scholarships' },
    { key: 'Events', label: 'Events' },
    { key: 'Resources', label: 'Resources' },
    { key: 'Announcements', label: 'Announcements' },
  ];

  const getFilterUnreadCount = (filterKey) => {
    return (notifications || []).filter((n) => {
      if (n.is_read) return false;
      if (filterKey === 'Unread' || filterKey === 'All') return true;
      const typeStr = String(n.type || '').toLowerCase().trim();
      const isCampus = Boolean(n.college_id || typeStr.includes('college') || typeStr.includes('campus'));
      if (filterKey === 'College') return isCampus;
      if (filterKey === 'Statewide') return !isCampus;
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

  const filteredNotifications = (notifications || [])
    .filter((n) => {
      if (filter === 'Unread') return !n.is_read;
      if (filter === 'All') return true;
      const typeStr = String(n.type || '').toLowerCase().trim();
      const isCampus = Boolean(n.college_id || typeStr.includes('college') || typeStr.includes('campus'));
      if (filter === 'College') return isCampus;
      if (filter === 'Statewide') return !isCampus;
      if (filter === 'Academic') return typeStr.includes('academic') || typeStr.includes('exam') || typeStr.includes('timetable');
      if (filter === 'Placements') return typeStr.includes('placement') || typeStr.includes('job') || typeStr.includes('opportunity');
      if (filter === 'Innovation') return typeStr.includes('innovation');
      if (filter === 'Scholarships') return typeStr.includes('scholarship');
      if (filter === 'Events') return typeStr.includes('event');
      if (filter === 'Resources') return typeStr.includes('resource');
      if (filter === 'Announcements') return ['admin', 'general', 'announcement', 'system', ''].includes(typeStr);
      return true;
    })
    .sort((a, b) => {
      if (filter !== 'Unread') {
        const unreadA = !a.is_read;
        const unreadB = !b.is_read;
        if (unreadA !== unreadB) return unreadA ? -1 : 1; // Unread notices come first!
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFill} />}

      {/* Top Header */}
      <Animated.View entering={FadeInDown.duration(400).springify()} style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 14) }]}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Updates</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Alerts, announcements & broadcasts</Text>
        </View>
        
        <View style={styles.bellContainer}>
          <Animated.View style={bellAnimStyle}>
            <Feather name="bell" size={26} color={colors.textPrimary} />
          </Animated.View>
          {unreadCount > 0 && (
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Filter Chips Bar (Point 29: category unread count display) */}
      <View style={styles.filterBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTERS.map((f) => {
            const unreadInCat = getFilterUnreadCount(f.key);
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
                {unreadInCat > 0 && (
                  <View style={[styles.countPill, { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(239, 68, 68, 0.15)' }]}>
                    <Text style={[styles.countText, { color: isActive ? '#FFF' : '#EF4444', fontWeight: '900' }]}>{unreadInCat}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllBtn}
              onPress={async () => {
                setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
                if (markAllNotificationsAsRead) markAllNotificationsAsRead();
                await markAllNotificationsRead(user?.id || 'anonymous', notifications);
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

      {/* Executive Details Modal */}
      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <BlurView intensity={25} tint="dark" style={styles.modalOverlay}>
          <Animated.View entering={FadeInDown.duration(300).springify()} style={[styles.modalContent, { backgroundColor: isDark ? '#0B0F19' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}>
            {/* Modal Top Header */}
            <View style={styles.modalHeaderRow}>
              <View style={[styles.modalBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#DBEAFE', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
                <MaterialCommunityIcons name={getIcon(selected?.type)} size={14} color="#3B82F6" />
                <Text style={styles.modalBadgeText}>
                  {String(selected?.type || 'CAMPUS NOTICE').toUpperCase()}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.modalCloseBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]}
                onPress={() => setSelected(null)}
                activeOpacity={0.7}
              >
                <Feather name="x" size={18} color={isDark ? '#FFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content Body */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBodyScroll} contentContainerStyle={{ paddingBottom: 10 }}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>
                {selected?.title}
              </Text>

              <View style={styles.modalMetaRow}>
                <Feather name="clock" size={12} color={isDark ? 'rgba(255,255,255,0.5)' : '#64748B'} />
                <Text style={[styles.modalTime, { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }]}>
                  {selected?.created_at ? new Date(selected.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : 'Official Circular'}
                </Text>
              </View>

              <View style={[styles.modalDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]} />

              <Text style={[styles.modalMessage, { color: isDark ? 'rgba(255,255,255,0.85)' : '#334155' }]}>
                {selected?.message || selected?.body || 'No additional details provided for this bulletin.'}
              </Text>
            </ScrollView>

            {/* Action Footer */}
            <View style={styles.modalFooter}>
              {selected?.apply_url && (
                <TouchableOpacity
                  style={styles.modalAction}
                  onPress={() => Linking.openURL(sanitizeUrl(selected.apply_url))}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.modalActionGradient}>
                    <Text style={styles.modalActionText}>Open Attached Resource</Text>
                    <Feather name="external-link" size={15} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.modalDismissBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}
                onPress={() => setSelected(null)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalDismissText, { color: isDark ? '#94A3B8' : '#64748B' }]}>Close Bulletin</Text>
              </TouchableOpacity>
            </View>
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
  campusBadge: { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  campusBadgeText: { fontSize: 9, fontWeight: '900', color: '#F59E0B', textTransform: 'uppercase' },
  stateBadge: { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  stateBadgeText: { fontSize: 9, fontWeight: '900', color: '#3B82F6', textTransform: 'uppercase' },
  newPillBadge: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderWidth: 1, borderColor: '#3B82F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  newPillBadgeText: { fontSize: 9, fontWeight: '900', color: '#3B82F6', letterSpacing: 0.5 },
  readPillBadge: { backgroundColor: 'rgba(100, 116, 139, 0.15)', borderWidth: 1, borderColor: 'rgba(100, 116, 139, 0.3)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  readPillBadgeText: { fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginLeft: 8, marginTop: 4 },

  emptyBox: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIconBox: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', ...SHADOWS.medium },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textSecondary },
  emptyHint: { fontSize: 12, color: COLORS.textMuted },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 16 },
  modalContent: { width: '100%', maxHeight: '82%', borderRadius: 24, padding: 20, borderWidth: 1.5, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  modalBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  modalBadgeText: { fontSize: 10, fontWeight: '900', color: '#3B82F6', letterSpacing: 0.5 },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modalBodyScroll: { maxHeight: 340 },
  modalTitle: { fontSize: 18, fontWeight: '900', lineHeight: 24, marginTop: 4 },
  modalMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  modalTime: { fontSize: 11.5, fontWeight: '600' },
  modalDivider: { height: 1, marginVertical: 14 },
  modalMessage: { fontSize: 14, lineHeight: 22, fontWeight: '500' },
  modalFooter: { marginTop: 16, gap: 8 },
  modalAction: { borderRadius: 14, overflow: 'hidden' },
  modalActionGradient: { height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16 },
  modalActionText: { color: '#FFF', fontWeight: '800', fontSize: 13.5 },
  modalDismissBtn: { height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalDismissText: { fontSize: 13, fontWeight: '700' },
  skeletonContainer: { paddingHorizontal: 20, marginTop: 8 },
  skeletonCard: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, gap: 14 },
  skeletonIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)' },
  skeletonContent: { flex: 1, gap: 8 },
  skeletonTitle: { height: 14, width: '40%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 7 },
  skeletonMessage: { height: 12, width: '85%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6 },
  skeletonTime: { height: 10, width: '25%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 5 }
});