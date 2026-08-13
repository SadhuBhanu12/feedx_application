import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
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
}

const NOTICE_CATEGORIES = ['All', 'Academic', 'Exams', 'Events', 'Important'];
const NOTICE_DEPARTMENTS = ['All', 'CSE', 'ECE', 'MECH', 'CIVIL', 'Admin', 'Exams'];

export function CollegeNotices({ notices = [] }: CollegeNoticesProps) {
  const { colors, isDark } = useTheme();

  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<CollegeNoticeItem | null>(null);

  // Filtering Notices based on Search Query, Selected Category, and Selected Department
  const filteredNotices = (notices || []).filter((item) => {
    // 1. Category Filter
    if (selectedCat !== 'All') {
      const cat = String(item.category || '').toLowerCase();
      const targetCat = selectedCat.toLowerCase();
      if (!cat.includes(targetCat)) return false;
    }

    // 2. Department Filter
    if (selectedDept !== 'All') {
      const dept = String(item.department || '').toLowerCase();
      const targetDept = selectedDept.toLowerCase();
      if (!dept.includes(targetDept)) return false;
    }

    // 3. Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const title = String(item.title || '').toLowerCase();
      const body = String(item.message || item.body || '').toLowerCase();
      if (!title.includes(q) && !body.includes(q)) return false;
    }

    return true;
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
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>College Notices</Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)' }]}>
          <Text style={[styles.countBadgeText, { color: colors.primary }]}>{filteredNotices.length} Notices</Text>
        </View>
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

      {/* Category Filter Label & Pills */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {NOTICE_CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: isActive ? colors.primary : isDark ? 'rgba(255,255,255,0.04)' : colors.card,
                    borderColor: isActive ? colors.primary : colors.cardBorder,
                  },
                ]}
                onPress={() => setSelectedCat(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.catPillText, { color: isActive ? '#FFF' : colors.textSecondary }, isActive && { fontWeight: '900' }]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Department Filter Label & Pills */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Department</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {NOTICE_DEPARTMENTS.map((dept) => {
            const isActive = selectedDept === dept;
            return (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: isActive ? colors.primary : isDark ? 'rgba(255,255,255,0.04)' : colors.card,
                    borderColor: isActive ? colors.primary : colors.cardBorder,
                  },
                ]}
                onPress={() => setSelectedDept(dept)}
                activeOpacity={0.8}
              >
                <Text style={[styles.catPillText, { color: isActive ? '#FFF' : colors.textSecondary }, isActive && { fontWeight: '900' }]}>{dept}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="check-circle" size={26} color="#10B981" />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No matches found</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Try adjusting your search query or department filters to locate college updates.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filteredNotices.map((item) => {
            const priorityColor = getPriorityColor(item.priority);
            const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.noticeCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => setSelectedNotice(item)}
                activeOpacity={0.85}
              >
                <View style={styles.noticeTopRow}>
                  <View style={styles.deptGroup}>
                    <View style={[styles.priorityTag, { backgroundColor: priorityColor + '18' }]}>
                      <Text style={[styles.priorityTagText, { color: priorityColor }]}>
                        {(item.priority || 'OFFICIAL').toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.deptText, { color: colors.textMuted }]} numberOfLines={1}>
                      {item.department || 'All Departments'} • {item.category || 'General'}
                    </Text>
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
  },
  readLink: {
    fontSize: 11,
    fontWeight: '800',
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
});
