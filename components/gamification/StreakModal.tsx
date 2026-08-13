import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Share, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useGamification } from '@/context/GamificationContext';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';

interface StreakModalProps {
  visible: boolean;
  onClose: () => void;
}

interface MilestoneItem {
  day: number;
  reward: string;
  title: string;
  badgeType: string;
  icon: string;
  accentColor: string;
  image: any;
}

const BADGE_IMAGES = {
  flame: require('@/assets/images/streak_flame_badge.png'),
  knight: require('@/assets/images/streak_knight_badge.png'),
  titan: require('@/assets/images/streak_titan_badge.png'),
  gold: require('@/assets/images/streak_gold_badge.png'),
};

const MILESTONES: MilestoneItem[] = [
  { day: 1, reward: '1 Gold Coin', title: 'Beginner Flame', badgeType: 'flame_starter', icon: '🔥', accentColor: '#F59E0B', image: BADGE_IMAGES.flame },
  { day: 2, reward: '1 Gold Coin', title: 'Spark Scholar', badgeType: 'iron_streak', icon: '⚡', accentColor: '#06B6D4', image: BADGE_IMAGES.flame },
  { day: 3, reward: '2 Gold Coins', title: 'Blaze Champion', badgeType: 'blaze_scholar', icon: '💥', accentColor: '#EF4444', image: BADGE_IMAGES.flame },
  { day: 7, reward: '5 Coins + Bonus Badge', title: 'Weekly Knight', badgeType: 'weekly_champ', icon: '🏆', accentColor: '#8B5CF6', image: BADGE_IMAGES.knight },
  { day: 15, reward: 'Bronze Learner Badge', title: 'Bronze Guardian', badgeType: 'bronze_shield', icon: '🛡️', accentColor: '#D97706', image: BADGE_IMAGES.knight },
  { day: 30, reward: 'Silver Learner Badge + 15 Coins', title: 'Silver Titan', badgeType: 'silver_shield', icon: '⚔️', accentColor: '#38BDF8', image: BADGE_IMAGES.titan },
  { day: 50, reward: 'Gold Learner Badge', title: 'Gold Master', badgeType: 'gold_crown', icon: '👑', accentColor: '#EAB308', image: BADGE_IMAGES.gold },
  { day: 100, reward: 'Platinum Learner Badge', title: 'Platinum Genius', badgeType: 'platinum_diamond', icon: '💎', accentColor: '#A855F7', image: BADGE_IMAGES.gold },
  { day: 365, reward: 'FEEDX Legend Status', title: 'FEEDX Legend', badgeType: 'legend_star', icon: '🌟', accentColor: '#EC4899', image: BADGE_IMAGES.gold },
];

export default function StreakModal({ visible, onClose }: StreakModalProps) {
  const { streak } = useGamification();
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const [shareBadge, setShareBadge] = useState<MilestoneItem | null>(null);

  const currentStreak = streak?.current_streak || 1;
  const longestStreak = streak?.longest_streak || currentStreak;
  const freezeCount = streak?.streak_freeze_count || 1;

  // Generate 30 days history dots
  const historyDots = Array.from({ length: 30 }, (_, i) => {
    const isCompleted = i < currentStreak;
    return { dayNum: i + 1, active: isCompleted };
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>🔥 Daily Streak Engine</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hero Flame Section */}
            <View style={styles.heroSection}>
              <View style={styles.flameCircle}>
                <Text style={styles.bigFlame}>🔥</Text>
              </View>
              <Text style={[styles.heroCount, { color: colors.textPrimary }]}>{currentStreak} Days</Text>
              <Text style={styles.heroSub}>Keep learning daily to maintain your multiplier!</Text>

              {/* Share Streak Badge Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.shareStreakBtn}
                onPress={() => {
                  const activeMilestone = MILESTONES.slice().reverse().find((m) => currentStreak >= m.day) || MILESTONES[0];
                  setShareBadge(activeMilestone);
                }}
              >
                <Ionicons name="share-social" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.shareStreakBtnText}>Share Streak Badge 🏆</Text>
              </TouchableOpacity>

              {/* Stats Bar */}
              <View style={[styles.statsBar, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{longestStreak}</Text>
                  <Text style={styles.statLbl}>Best Streak</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome5 name="shield-alt" size={14} color="#3B82F6" style={{ marginRight: 4 }} />
                    <Text style={styles.statVal}>{freezeCount}</Text>
                  </View>
                  <Text style={styles.statLbl}>Streak Shields</Text>
                </View>
              </View>
            </View>

            {/* 30 Day Heatmap Grid */}
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>30-Day Activity Grid</Text>
            <View style={styles.heatmapGrid}>
              {historyDots.map((dot) => (
                <View
                  key={dot.dayNum}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: dot.active
                        ? '#F59E0B'
                        : isDark
                        ? '#334155'
                        : '#E2E8F0',
                    },
                  ]}
                >
                  <Text style={[styles.dotText, { color: dot.active ? '#FFFFFF' : colors.textSecondary }]}>
                    {dot.dayNum}
                  </Text>
                </View>
              ))}
            </View>

            {/* Milestone Ladder */}
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Streak Milestones</Text>
            <View style={styles.milestoneList}>
              {MILESTONES.map((m) => {
                const reached = currentStreak >= m.day;
                return (
                  <TouchableOpacity
                    key={m.day}
                    activeOpacity={reached ? 0.7 : 1}
                    disabled={!reached}
                    onPress={() => reached && setShareBadge(m)}
                    style={[
                      styles.milestoneItem,
                      {
                        backgroundColor: reached
                          ? isDark
                            ? 'rgba(245, 158, 11, 0.12)'
                            : '#FEF3C7'
                          : isDark
                          ? '#1E293B'
                          : '#F8FAFC',
                        borderColor: reached ? m.accentColor : 'transparent',
                      },
                    ]}
                  >
                    <View style={styles.milestoneLeft}>
                      <View style={[styles.milestoneBadgeCircle, { backgroundColor: reached ? m.accentColor + '25' : 'rgba(255,255,255,0.05)' }]}>
                        {reached ? (
                          <Image source={m.image} style={{ width: 28, height: 28, borderRadius: 14 }} resizeMode="contain" />
                        ) : (
                          <Text style={styles.milestoneIcon}>🔒</Text>
                        )}
                      </View>
                      <View>
                        <Text style={[styles.milestoneTitle, { color: colors.textPrimary }]}>
                          Day {m.day} — {m.title}
                        </Text>
                        <Text style={[styles.milestoneReward, { color: reached ? m.accentColor : '#94A3B8' }]}>{m.reward}</Text>
                      </View>
                    </View>
                    {reached && (
                      <View style={[styles.unlockedBadge, { backgroundColor: m.accentColor }]}>
                        <Text style={styles.unlockedText}>SHARE BADGE 🚀</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* LeetCode-Style Shareable Streak Badge Modal Overlay */}
      {shareBadge && (
        <Modal visible animationType="fade" transparent onRequestClose={() => setShareBadge(null)}>
          <View style={styles.badgeOverlay}>
            <View style={[styles.badgeCard, { backgroundColor: isDark ? '#0B0F19' : '#0F172A', borderColor: shareBadge.accentColor }]}>
              {/* Outer Accent Frame Line */}
              <View style={[styles.goldInnerFrame, { borderColor: shareBadge.accentColor + '50' }]}>
                <TouchableOpacity style={styles.badgeCloseBtn} onPress={() => setShareBadge(null)}>
                  <Ionicons name="close" size={22} color={shareBadge.accentColor} />
                </TouchableOpacity>

                {/* 3D Badge Image Artwork Emblem Circle */}
                <View style={[styles.badgeHeaderEmblem, { backgroundColor: shareBadge.accentColor + '20', borderColor: shareBadge.accentColor }]}>
                  <Image source={shareBadge.image} style={{ width: 72, height: 72, borderRadius: 36 }} resizeMode="contain" />
                </View>

                <Text style={[styles.badgeHonorTag, { color: shareBadge.accentColor }]}>🏆 FEEDX STREAK HONORS</Text>
                <Text style={styles.badgeCertSub}>DAY {shareBadge.day} STREAK BADGE</Text>
                <Text style={[styles.badgeCertTitle, { color: shareBadge.accentColor }]}>{shareBadge.title.toUpperCase()}</Text>

                <View style={styles.badgeRecipientBox}>
                  <Text style={styles.badgeRecipientLabel}>THIS CERTIFIES THAT</Text>
                  <Text style={styles.badgeRecipientName}>{(user?.full_name || 'STUDENT').toUpperCase()}</Text>
                </View>

                <Text style={styles.badgeDescText}>
                  Has unlocked the <Text style={{ fontWeight: '900', color: shareBadge.accentColor }}>{shareBadge.title}</Text> badge for completing{' '}
                  <Text style={{ fontWeight: '900', color: '#FFFFFF' }}>{shareBadge.day} Consecutive Days</Text> of daily active learning & skill building on FEEDX.
                </Text>

                {/* Verification Row */}
                <View style={styles.badgeMetaRow}>
                  <View style={styles.badgeMetaItem}>
                    <Text style={styles.badgeMetaLabel}>BADGE ID</Text>
                    <Text style={styles.badgeMetaVal}>FX-STRK-0{shareBadge.day}</Text>
                  </View>
                  <View style={styles.badgeMetaItem}>
                    <Text style={styles.badgeMetaLabel}>VERIFIED</Text>
                    <Text style={[styles.badgeMetaVal, { color: '#10B981' }]}>✓ UNLOCKED</Text>
                  </View>
                  <View style={styles.badgeMetaItem}>
                    <Text style={styles.badgeMetaLabel}>PLATFORM</Text>
                    <Text style={[styles.badgeMetaVal, { color: shareBadge.accentColor }]}>FEEDX</Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.badgeShareActionBtn, { backgroundColor: shareBadge.accentColor }]}
                  onPress={async () => {
                    try {
                      await Share.share({
                        title: `FEEDX ${shareBadge.title} Streak Badge`,
                        message: `📜 Official FEEDX Streak Badge awarded to ${user?.full_name || 'Student'}!\n\n${shareBadge.icon} ${shareBadge.title} (${shareBadge.day}-Day Streak)\nBadge ID: FX-STRK-0${shareBadge.day}\nVerify online on FEEDX App.`,
                      });
                    } catch (_) {}
                  }}
                >
                  <Ionicons name="share-social" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.badgeShareActionBtnText}>Share Streak Badge 🚀</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  flameCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  bigFlame: {
    fontSize: 36,
  },
  heroCount: {
    fontSize: 26,
    fontWeight: '900',
  },
  heroSub: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F59E0B',
  },
  statLbl: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 8,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: {
    fontSize: 10,
    fontWeight: '800',
  },
  milestoneList: {
    gap: 8,
    marginBottom: 20,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  milestoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  milestoneBadgeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneIcon: {
    fontSize: 18,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  milestoneReward: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
  },
  unlockedBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unlockedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  shareStreakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 10,
  },
  shareStreakBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  badgeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  badgeCard: {
    width: '100%',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
    position: 'relative',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  goldInnerFrame: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    padding: 16,
    alignItems: 'center',
  },
  badgeCloseBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 10,
  },
  badgeHeaderEmblem: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
    marginBottom: 8,
  },
  badgeHonorTag: {
    fontSize: 9,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  badgeCertSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  badgeCertTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  badgeRecipientBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  badgeRecipientLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  badgeRecipientName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  badgeDescText: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  badgeMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  badgeMetaItem: {
    alignItems: 'center',
  },
  badgeMetaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
  },
  badgeMetaVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  badgeShareActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
  },
  badgeShareActionBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
