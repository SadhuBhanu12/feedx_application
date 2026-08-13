import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

export interface OfficialUpdateItem {
  id: string;
  title: string;
  description: string;
  category: string;
  source: string;
  is_official: boolean;
  is_verified: boolean;
  timestamp: string | Date;
  contentType: string;
  actionLabel: string;
  apply_url?: string;
  route?: string;
}

interface OfficialUpdatesSectionProps {
  updates: OfficialUpdateItem[];
  selectedCategory: string;
}

export function OfficialUpdatesSection({ updates = [], selectedCategory = 'All' }: OfficialUpdatesSectionProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [selectedUpdate, setSelectedUpdate] = useState<OfficialUpdateItem | null>(null);

  // Filter updates based on category filter
  const filteredUpdates = (updates || []).filter((item) => {
    if (selectedCategory === 'All') return true;
    const cat = String(item.category || '').toLowerCase();
    const targetCat = String(selectedCategory).toLowerCase();
    if (targetCat === 'important') {
      return cat.includes('important') || cat.includes('critical') || cat.includes('exam');
    }
    return cat.includes(targetCat);
  });

  const getCategoryColor = (cat: string) => {
    const c = String(cat).toLowerCase();
    if (c.includes('important') || c.includes('exam')) return '#EF4444';
    if (c.includes('academic')) return '#3B82F6';
    if (c.includes('event')) return '#8B5CF6';
    if (c.includes('placement') || c.includes('opp')) return '#10B981';
    return '#F59E0B';
  };

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(300).springify()} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="bullhorn-outline" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>OFFICIAL COLLEGE UPDATES</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{filteredUpdates.length} Updates</Text>
        </View>
      </View>

      {filteredUpdates.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="check-circle" size={24} color="#10B981" />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No new official updates</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            You&apos;re all caught up for {selectedCategory === 'All' ? 'all categories' : selectedCategory}.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filteredUpdates.map((item) => {
            const catColor = getCategoryColor(item.category);
            const formattedTime = item.timestamp
              ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              : 'Recent';

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => setSelectedUpdate(item)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={styles.sourceGroup}>
                    {item.is_verified && (
                      <View style={styles.officialPill}>
                        <Feather name="shield" size={10} color="#3B82F6" />
                        <Text style={styles.officialPillText}>Official</Text>
                      </View>
                    )}
                    <Text style={[styles.sourceText, { color: colors.textMuted }]} numberOfLines={1}>
                      {item.source}
                    </Text>
                  </View>

                  <Text style={[styles.timeText, { color: colors.textMuted }]}>{formattedTime}</Text>
                </View>

                <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                  {item.title}
                </Text>

                <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.cardFooterRow}>
                  <View style={[styles.catBadge, { backgroundColor: catColor + '15' }]}>
                    <Text style={[styles.catBadgeText, { color: catColor }]}>
                      {item.category || item.contentType}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.actionLink}
                    onPress={() => {
                      if (item.route) router.push(item.route as any);
                      else setSelectedUpdate(item);
                    }}
                  >
                    <Text style={[styles.actionLinkText, { color: colors.primary }]}>{item.actionLabel}</Text>
                    <Feather name="chevron-right" size={14} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Detail Modal */}
      <Modal
        visible={Boolean(selectedUpdate)}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedUpdate(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalCategoryBadge}>
                <Text style={styles.modalCategoryText}>{selectedUpdate?.category}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedUpdate(null)}>
                <Feather name="x" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{selectedUpdate?.title}</Text>

              <View style={styles.modalMetaRow}>
                <Text style={[styles.modalMetaText, { color: colors.textMuted }]}>
                  Published by: <Text style={{ color: colors.textSecondary, fontWeight: '700' }}>{selectedUpdate?.source}</Text>
                </Text>
              </View>

              <View style={styles.divider} />

              <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
                {selectedUpdate?.description}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalActionBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                const target = selectedUpdate;
                setSelectedUpdate(null);
                if (target?.route) router.push(target.route as any);
                else router.push('/(tabs)/updates');
              }}
            >
              <Text style={styles.modalActionBtnText}>{selectedUpdate?.actionLabel || 'Acknowledge & Close'}</Text>
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
    letterSpacing: 0.8,
  },
  countBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
  },
  emptyCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '700',
    marginTop: 4,
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
  },
  list: {
    gap: 10,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 8,
    ...SHADOWS.small,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sourceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  officialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  officialPillText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#3B82F6',
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
    marginTop: 2,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionLinkText: {
    fontSize: 11,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: SPACING.md,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalCategoryBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalCategoryText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#3B82F6',
  },
  modalBody: {
    maxHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  modalMetaRow: {
    marginBottom: 10,
  },
  modalMetaText: {
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
  modalActionBtn: {
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
