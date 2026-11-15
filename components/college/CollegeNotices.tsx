import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { markNotificationRead, getNotifications } from '@/services/supabaseService';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

export interface CollegeNoticeItem {
  id: string;
  title: string;
  message?: string;
  body?: string;
  category: string;
  department?: string;
  priority?: string;
  created_at: string;
  is_read?: boolean;
}

interface CollegeNoticesProps {
  notices?: CollegeNoticeItem[];
  onNoticeRead?: (id: string) => void;
}

export function CollegeNotices({ notices = [], onNoticeRead }: CollegeNoticesProps) {
  const { colors, isDark } = useTheme();
  const { user } = useUser();

  const [liveNotices, setLiveNotices] = useState<CollegeNoticeItem[]>(notices);
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<CollegeNoticeItem | null>(null);
  const [localReadIds, setLocalReadIds] = useState<Set<string>>(new Set());

  const fetchLiveNotices = () => {
    if (user?.id) {
      getNotifications(user.id, (user as any)?.college_id, true)
        .then((data) => {
          if (data && data.length > 0) setLiveNotices(data as any);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (notices && notices.length > 0) {
      setLiveNotices(notices);
    } else {
      fetchLiveNotices();
    }

    const channel = supabase
      .channel(`college_notices_live_${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchLiveNotices();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [notices, user?.id]);

  const handleOpenNotice = async (notice: CollegeNoticeItem) => {
    setSelectedNotice(notice);
    if (!notice.is_read && !localReadIds.has(notice.id)) {
      setLocalReadIds((prev) => new Set(prev).add(notice.id));
      if (user?.id) {
        try {
          await markNotificationRead(notice.id, user.id);
        } catch (e) {
          console.warn('[CollegeNotices] Error marking read:', e);
        }
      }
      if (onNoticeRead) onNoticeRead(notice.id);
    }
  };

  const activeList = liveNotices && liveNotices.length > 0 ? liveNotices : notices;

  const unreadCount = (activeList || []).filter(
    (n) => !n.is_read && !localReadIds.has(n.id)
  ).length;

  // Filtering & Ordering Notices based on Search Query and Unread mode
  const filteredNotices = (activeList || [])
    .filter((item) => {
      const isUnread = !item.is_read && !localReadIds.has(item.id);
      if (filterMode === 'unread' && !isUnread) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const title = String(item.title || '').toLowerCase();
        const body = String(item.message || item.body || '').toLowerCase();
        if (!title.includes(q) && !body.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const isUnreadA = !a.is_read && !localReadIds.has(a.id);
      const isUnreadB = !b.is_read && !localReadIds.has(b.id);
      if (isUnreadA !== isUnreadB) {
        return isUnreadA ? -1 : 1; // Unread notices come FIRST!
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const getPriorityColor = (priority?: string) => {
    const p = String(priority || '').toUpperCase();
    if (p === 'HIGH' || p === 'CRITICAL') return '#EF4444';
    if (p === 'MEDIUM') return '#F59E0B';
    return colors.primary;
  };

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(200).springify()} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="bullhorn-outline" size={22} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>College Notices & Circulars</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {unreadCount > 0 && (
            <View style={[styles.unreadCountBadge, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.unreadCountText}>{unreadCount} Unread</Text>
            </View>
          )}
          <View style={[styles.countBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)' }]}>
            <Text style={[styles.countBadgeText, { color: colors.primary }]}>{filteredNotices.length} Total</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs: Unread First, then All Notices */}
      <View style={styles.filterPillRow}>
        <TouchableOpacity
          style={[
            styles.filterPill,
            { backgroundColor: filterMode === 'unread' ? '#EF4444' : colors.card, borderColor: filterMode === 'unread' ? '#EF4444' : colors.cardBorder },
          ]}
          onPress={() => setFilterMode('unread')}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={[styles.unreadDot, { backgroundColor: filterMode === 'unread' ? '#FFF' : '#EF4444' }]} />
            <Text style={[styles.filterPillText, { color: filterMode === 'unread' ? '#FFF' : colors.textSecondary }]}>
              Unread ({unreadCount})
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            { backgroundColor: filterMode === 'all' ? colors.primary : colors.card, borderColor: filterMode === 'all' ? colors.primary : colors.cardBorder },
          ]}
          onPress={() => setFilterMode('all')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterPillText, { color: filterMode === 'all' ? '#FFF' : colors.textSecondary }]}>
            All Notices ({activeList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Box */}
      <View style={[styles.searchBox, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : colors.card, borderColor: colors.cardBorder }]}>
        <Feather name="search" size={16} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search official college notices..."
          placeholderTextColor={colors.inputPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="check-circle" size={26} color="#10B981" />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No notices found</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            All official notices and circulars have been retrieved.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {(() => {
            const unreadItems = filteredNotices.filter((n) => !n.is_read && !localReadIds.has(n.id));
            const readItems = filteredNotices.filter((n) => n.is_read || localReadIds.has(n.id));

            return (
              <>
                {/* 1. Unread Notices Header & Cards (First Priority) */}
                {unreadItems.length > 0 && filterMode === 'all' && (
                  <View style={styles.sectionDividerHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[styles.unreadDot, { width: 8, height: 8, backgroundColor: '#EF4444' }]} />
                      <Text style={[styles.sectionDividerTitle, { color: colors.textPrimary }]}>
                        Unread Notices ({unreadItems.length})
                      </Text>
                    </View>
                    <Text style={[styles.sectionDividerSub, { color: colors.textMuted }]}>New Circulars</Text>
                  </View>
                )}

                {unreadItems.map((item) => {
                  const priorityColor = getPriorityColor(item.priority);
                  const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.noticeCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: '#3B82F6',
                          borderWidth: 1.5,
                        },
                      ]}
                      onPress={() => handleOpenNotice(item)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.noticeTopRow}>
                        <View style={styles.deptGroup}>
                          <View style={styles.unreadBadgeContainer}>
                            <View style={styles.unreadDot} />
                            <Text style={styles.unreadText}>● Unread</Text>
                          </View>

                          <View style={[styles.priorityTag, { backgroundColor: priorityColor + '18' }]}>
                            <Text style={[styles.priorityTagText, { color: priorityColor }]}>
                              {(item.priority || 'OFFICIAL').toUpperCase()}
                            </Text>
                          </View>
                        </View>

                        <Text style={[styles.dateText, { color: colors.textMuted }]}>{formattedDate}</Text>
                      </View>

                      <Text style={[styles.noticeTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                        {item.title}
                      </Text>

                      <Text style={[styles.noticeDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                        {item.message || item.body}
                      </Text>

                      <View style={styles.noticeFooter}>
                        <Text style={[styles.readLink, { color: colors.primary }]}>Read Full Notice →</Text>
                        <View style={[styles.newTag, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)' }]}>
                          <Text style={[styles.newTagText, { color: colors.primary }]}>NEW</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {/* 2. All / Earlier Notices Section Header */}
                {readItems.length > 0 && unreadItems.length > 0 && filterMode === 'all' && (
                  <View style={[styles.sectionDividerHeader, { marginTop: 14 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Feather name="archive" size={14} color={colors.textMuted} />
                      <Text style={[styles.sectionDividerTitle, { color: colors.textSecondary }]}>
                        Earlier Notices ({readItems.length})
                      </Text>
                    </View>
                  </View>
                )}

                {/* Read Notices List */}
                {filterMode === 'all' && readItems.map((item) => {
                  const priorityColor = getPriorityColor(item.priority);
                  const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.noticeCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.cardBorder,
                          borderWidth: 1,
                        },
                      ]}
                      onPress={() => handleOpenNotice(item)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.noticeTopRow}>
                        <View style={styles.deptGroup}>
                          <View style={styles.readBadgeContainer}>
                            <Feather name="check" size={10} color={colors.textMuted} />
                            <Text style={[styles.readText, { color: colors.textMuted }]}>Read</Text>
                          </View>

                          <View style={[styles.priorityTag, { backgroundColor: priorityColor + '18' }]}>
                            <Text style={[styles.priorityTagText, { color: priorityColor }]}>
                              {(item.priority || 'OFFICIAL').toUpperCase()}
                            </Text>
                          </View>
                        </View>

                        <Text style={[styles.dateText, { color: colors.textMuted }]}>{formattedDate}</Text>
                      </View>

                      <Text style={[styles.noticeTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                        {item.title}
                      </Text>

                      <Text style={[styles.noticeDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                        {item.message || item.body}
                      </Text>

                      <View style={styles.noticeFooter}>
                        <Text style={[styles.readLink, { color: colors.primary }]}>Read Full Notice →</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            );
          })()}
        </View>
      )}

      {/* Notice Detail Modal */}
      <Modal visible={Boolean(selectedNotice)} transparent animationType="slide" onRequestClose={() => setSelectedNotice(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.catPillModal, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)' }]}>
                <Text style={[styles.catPillModalText, { color: colors.primary }]}>{selectedNotice?.category || 'Notice'}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedNotice(null)}>
                <Feather name="x" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{selectedNotice?.title}</Text>
              <Text style={[styles.modalMeta, { color: colors.textMuted }]}>
                Issued by: <Text style={{ color: colors.textSecondary, fontWeight: '700' }}>{selectedNotice?.department || 'College Authority'}</Text>
              </Text>
              <View style={styles.divider} />
              <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
                {selectedNotice?.message || selectedNotice?.body}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeModalBtn, { backgroundColor: colors.primary }]}
              onPress={() => setSelectedNotice(null)}
            >
              <Text style={styles.closeModalBtnText}>Acknowledge & Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  unreadCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  unreadCountText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF',
  },
  filterPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  searchBox: {
    height: 40,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12.5,
    padding: 0,
  },
  filterSection: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  catRow: {
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '800',
    marginTop: 4,
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
  },
  list: {
    gap: 10,
    marginTop: 8,
  },
  noticeCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 8,
    ...SHADOWS.small,
  },
  noticeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deptGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  priorityTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityTagText: {
    fontSize: 8,
    fontWeight: '900',
  },
  deptText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 10,
    fontWeight: '500',
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  noticeDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  noticeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
  },
  readLink: {
    fontSize: 11,
    fontWeight: '800',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06B6D4',
  },
  unreadBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#06B6D4',
  },
  readBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(100, 116, 139, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  readText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  newTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newTagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  modalContent: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '80%',
    borderWidth: 1,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catPillModal: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catPillModalText: {
    fontSize: 10,
    fontWeight: '900',
  },
  modalBody: {
    maxHeight: 300,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 6,
  },
  modalMeta: {
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 10,
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  closeModalBtn: {
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  sectionDividerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 6,
    marginBottom: 4,
  },
  sectionDividerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  sectionDividerSub: {
    fontSize: 10.5,
    fontWeight: '600',
  },
});
