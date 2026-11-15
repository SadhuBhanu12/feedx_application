import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Modal, useWindowDimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, RADIUS, SHADOWS } from '@/constants/theme';

export interface HomeBannerItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  gradient: [string, string];
  route: string;
  iconName: string;
  noticeData?: any;
  actionText?: string;
}

const OFFICIAL_FEEDX_BANNER: HomeBannerItem = {
  id: 'feedx-official',
  badge: 'FEEDX CAMPUS HUB',
  title: 'Official Polytechnic Platform',
  subtitle: 'Access verified academic notices, real-time department stream & placement drives.',
  gradient: ['#1E3A8A', '#2563EB'],
  route: '/(tabs)/college',
  iconName: 'school',
  actionText: 'Campus Hub',
};

const CURATED_CAMPUS_BANNERS: HomeBannerItem[] = [
  {
    id: 'feedx-daily-quiz',
    badge: 'DAILY CHALLENGE',
    title: 'Daily Technical Quiz & Streak',
    subtitle: 'Solve today’s challenge questions, keep your streak alive & earn Gold Coins.',
    gradient: ['#7C3AED', '#4F46E5'],
    route: '/daily-challenges',
    iconName: 'fire',
    actionText: 'Start Quiz',
  },
  {
    id: 'feedx-career-roadmap',
    badge: 'CAREER BLUEPRINT',
    title: 'Smart Polytechnic Roadmap',
    subtitle: 'Personalized step-by-step milestones to land top core engineering placements.',
    gradient: ['#0D9488', '#0284C7'],
    route: '/(tabs)/explore',
    iconName: 'compass-outline',
    actionText: 'View Blueprint',
  },
];

interface HomeBannerProps {
  banners?: HomeBannerItem[];
}

export function HomeBanner({ banners = [] }: HomeBannerProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const bannerWidth = Math.max(280, width - SPACING.md * 2);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState<HomeBannerItem | null>(null);
  const scrollRef = React.useRef<ScrollView>(null);

  // Always prepend FEEDX Official Banner as Card 1, followed by dynamic notices or curated banners
  const activeBanners = React.useMemo(() => {
    const customList = Array.isArray(banners) ? banners : [];
    const filteredCustom = customList.filter(b => b.id !== 'feedx-official');
    if (filteredCustom.length > 0) {
      return [OFFICIAL_FEEDX_BANNER, ...filteredCustom];
    }
    return [OFFICIAL_FEEDX_BANNER, ...CURATED_CAMPUS_BANNERS];
  }, [banners]);

  // Dynamic Smooth Banner Scrolling Timer (FEEDX Polytechnic Official Card stays 9s)
  React.useEffect(() => {
    if (activeBanners.length <= 1) return;

    const stayTime = activeIdx === 0 ? 9000 : 4500;

    const timer = setTimeout(() => {
      const nextIdx = (activeIdx + 1) % activeBanners.length;
      scrollRef.current?.scrollTo({
        x: nextIdx * (bannerWidth + 12),
        animated: true,
      });
      setActiveIdx(nextIdx);
    }, stayTime);

    return () => clearTimeout(timer);
  }, [activeIdx, activeBanners.length, bannerWidth]);

  const handleBannerPress = (banner: HomeBannerItem) => {
    if (banner.id === 'feedx-official') {
      router.push('/(tabs)/college' as any);
      return;
    }

    if (banner.route && (banner.route.startsWith('/daily-challenges') || banner.route.startsWith('/(tabs)/explore'))) {
      router.push(banner.route as any);
      return;
    }

    const nData = banner.noticeData || {};
    if (nData.eventId || (banner.route && banner.route.startsWith('/event-detail'))) {
      router.push(banner.route as any);
      return;
    }
    if (nData.oppId || (banner.route && banner.route.startsWith('/opportunity-detail'))) {
      router.push(banner.route as any);
      return;
    }

    if (banner.noticeData) {
      setSelectedNotice(banner);
      return;
    }

    if (banner.route) {
      router.push(banner.route as any);
    }
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slide = Math.round(e.nativeEvent.contentOffset.x / (bannerWidth + 12));
          if (slide !== activeIdx && slide >= 0 && slide < activeBanners.length) {
            setActiveIdx(slide);
          }
        }}
        scrollEventThrottle={16}
        snapToInterval={bannerWidth + 12}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {activeBanners.map((banner) => {
          if (banner.id === 'feedx-official') {
            return (
              <View
                key={banner.id}
                style={[styles.bannerTouch, { width: bannerWidth }]}
              >
                <LinearGradient
                  colors={
                    isDark
                      ? ['#1E3A8A', '#1D4ED8', '#0D9488']
                      : ['#1E40AF', '#2563EB', '#0284C7']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.officialBannerCard}
                >
                  {/* Top Row: Badge + Campus Hub CTA Pill */}
                  <View style={styles.officialTopRow}>
                    <View style={styles.officialBadgePill}>
                      <MaterialCommunityIcons
                        name="shield-check"
                        size={12}
                        color="#93C5FD"
                      />
                      <Text style={styles.officialBadgeText}>
                        FEEDX CAMPUS HUB
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => router.push('/(tabs)/college' as any)}
                      style={styles.officialCtaPill}
                    >
                      <Text style={styles.officialCtaPillText}>Campus Hub</Text>
                      <Feather
                        name="arrow-right"
                        size={11}
                        color="#FFF"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Middle Headline Section (Tapping navigates to Campus Hub) */}
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={() => router.push('/(tabs)/college' as any)}
                    style={styles.officialMiddleWrap}
                  >
                    <View style={styles.officialTitleRow}>
                      <Text style={styles.officialFeedxTitle}>FEEDX </Text>
                      <Text style={styles.officialPolyTitle}>POLYTECHNIC</Text>
                    </View>
                    <Text style={styles.officialSubText} numberOfLines={2}>
                      Empowering Polytechnic Students with Academics, Innovations & Placements
                    </Text>
                  </TouchableOpacity>

                  {/* Bottom Quick Action Pills */}
                  <View style={styles.officialBottomPillsRow}>
                    <TouchableOpacity
                      style={styles.quickPillBtn}
                      onPress={() => router.push('/(tabs)/academics' as any)}
                      activeOpacity={0.75}
                    >
                      <MaterialCommunityIcons name="school" size={13} color="#93C5FD" />
                      <Text style={styles.quickPillText}>Academics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.quickPillBtn}
                      onPress={() => router.push('/innovation' as any)}
                      activeOpacity={0.75}
                    >
                      <MaterialCommunityIcons name="lightbulb-on" size={13} color="#FDE047" />
                      <Text style={styles.quickPillText}>Innovations</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.quickPillBtn}
                      onPress={() => router.push('/(tabs)/opportunities' as any)}
                      activeOpacity={0.75}
                    >
                      <MaterialCommunityIcons name="briefcase" size={13} color="#6EE7B7" />
                      <Text style={styles.quickPillText}>Placements</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={banner.id}
              activeOpacity={0.9}
              onPress={() => handleBannerPress(banner)}
              style={[styles.bannerTouch, { width: bannerWidth }]}
            >
              <LinearGradient
                colors={banner.gradient || ['#2563EB', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bannerCard}
              >
                <View style={styles.badgeRow}>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>{banner.badge || 'FEEDX'}</Text>
                  </View>
                  <MaterialCommunityIcons name={(banner.iconName as any) || 'bullhorn-outline'} size={22} color="rgba(255,255,255,0.8)" />
                </View>

                <View style={styles.textWrap}>
                  <Text style={styles.titleText} numberOfLines={2}>
                    {banner.title}
                  </Text>
                  <Text style={styles.subText} numberOfLines={2}>
                    {banner.subtitle}
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <Text style={styles.actionBtnText}>{banner.actionText || 'Read Notice'}</Text>
                  <Feather name="arrow-right" size={14} color="#FFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {activeBanners.length > 1 && (
        <View style={styles.dotsRow}>
          {activeBanners.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === activeIdx ? colors.primary : 'rgba(100,116,139,0.3)', width: i === activeIdx ? 18 : 6 },
              ]}
            />
          ))}
        </View>
      )}

      {/* Particular Notice / Notification Detail Modal */}
      <Modal
        visible={!!selectedNotice}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedNotice(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalBadgeRow}>
                <View style={[styles.modalBadgePill, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <MaterialCommunityIcons name="bullhorn" size={13} color="#3B82F6" />
                  <Text style={[styles.modalBadgeText, { color: '#3B82F6' }]}>
                    {selectedNotice?.badge || 'CAMPUS NOTICE'}
                  </Text>
                </View>
                <Text style={styles.modalDateText}>
                  {selectedNotice?.noticeData?.created_at
                    ? new Date(selectedNotice.noticeData.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Recent Notice'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedNotice(null)}
                style={styles.modalCloseBtn}
              >
                <Feather name="x" size={20} color={isDark ? '#FFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            {/* Notice Title */}
            <Text style={[styles.modalNoticeTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>
              {selectedNotice?.title}
            </Text>

            {/* Notice Full Content */}
            <ScrollView style={styles.modalBodyScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalNoticeBody, { color: isDark ? '#CBD5E1' : '#334155' }]}>
                {selectedNotice?.noticeData?.message ||
                  selectedNotice?.noticeData?.body ||
                  selectedNotice?.noticeData?.description ||
                  selectedNotice?.subtitle ||
                  'No additional details provided.'}
              </Text>

              {/* Department / Category Meta */}
              {selectedNotice?.noticeData?.department && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Department:</Text>
                  <Text style={[styles.metaVal, { color: isDark ? '#FFF' : '#0F172A' }]}>
                    {selectedNotice.noticeData.department}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActionGroup}>
              {selectedNotice?.noticeData?.link && (
                <TouchableOpacity
                  style={[styles.primaryModalBtn, { backgroundColor: '#3B82F6' }]}
                  onPress={() => {
                    if (selectedNotice?.noticeData?.link) {
                      Linking.openURL(selectedNotice.noticeData.link).catch(() => {});
                    }
                  }}
                >
                  <Feather name="external-link" size={15} color="#FFF" />
                  <Text style={styles.primaryModalBtnText}>Open Attachment / Link</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.secondaryModalBtn,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
                ]}
                onPress={() => {
                  const target = selectedNotice?.route || '/(tabs)/updates';
                  setSelectedNotice(null);
                  router.push(target as any);
                }}
              >
                <Feather name="list" size={15} color={isDark ? '#FFF' : '#0F172A'} />
                <Text style={[styles.secondaryModalBtnText, { color: isDark ? '#FFF' : '#0F172A' }]}>
                  View in Updates Hub
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: 12,
  },
  bannerTouch: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  officialBannerCard: {
    padding: 16,
    borderRadius: RADIUS.xl,
    minHeight: 185,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  officialTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  officialBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  officialBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.8,
  },
  officialCtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  officialCtaPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFF',
  },
  officialMiddleWrap: {
    marginVertical: 4,
  },
  officialTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  officialFeedxTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.3,
  },
  officialPolyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  officialSubText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 3,
    lineHeight: 16,
  },
  officialBottomPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickPillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  quickPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
  bannerCard: {
    padding: 16,
    borderRadius: RADIUS.xl,
    minHeight: 185,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.8,
  },
  textWrap: {
    marginVertical: 8,
  },
  titleText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  subText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: RADIUS.xl,
    padding: 20,
    borderWidth: 1,
    gap: 12,
    maxHeight: '80%',
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  modalBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modalBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalDateText: {
    fontSize: 11,
    color: 'rgba(148, 163, 184, 0.9)',
    fontWeight: '600',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalNoticeTitle: {
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 23,
  },
  modalBodyScroll: {
    maxHeight: 240,
    marginVertical: 4,
  },
  modalNoticeBody: {
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(148, 163, 184, 0.8)',
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  modalActionGroup: {
    gap: 8,
    marginTop: 8,
  },
  primaryModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  primaryModalBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  secondaryModalBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
