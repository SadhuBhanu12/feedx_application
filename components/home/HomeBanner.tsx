import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, RADIUS, SHADOWS } from '@/constants/theme';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - SPACING.md * 2;

export interface HomeBannerItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  gradient: [string, string];
  route: string;
  iconName: string;
}

const OFFICIAL_FEEDX_BANNER: HomeBannerItem = {
  id: 'feedx-official',
  badge: 'FEEDX CAMPUS HUB',
  title: 'Government Institute of Electronics Portal',
  subtitle: 'Access verified academic notices, real-time department stream, placement drives & student support.',
  gradient: ['#1E3A8A', '#0D9488'],
  route: '/(tabs)/college',
  iconName: 'school',
};

interface HomeBannerProps {
  banners?: HomeBannerItem[];
}

export function HomeBanner({ banners = [] }: HomeBannerProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = React.useRef<ScrollView>(null);

  // Always prepend FeedX Official Banner as Card 1, followed by all dynamic notices & campus updates
  const activeBanners = React.useMemo(() => {
    const customList = Array.isArray(banners) ? banners : [];
    // Filter out any duplicate official banner if passed
    const filteredCustom = customList.filter(b => b.id !== 'feedx-official');
    return [OFFICIAL_FEEDX_BANNER, ...filteredCustom];
  }, [banners]);

  // Dynamic Smooth Banner Scrolling Timer (FeedX Polytechnic Official Card stays 9s)
  React.useEffect(() => {
    if (activeBanners.length <= 1) return;

    const stayTime = activeIdx === 0 ? 9000 : 4500;

    const timer = setTimeout(() => {
      const nextIdx = (activeIdx + 1) % activeBanners.length;
      scrollRef.current?.scrollTo({
        x: nextIdx * (BANNER_WIDTH + 12),
        animated: true,
      });
      setActiveIdx(nextIdx);
    }, stayTime);

    return () => clearTimeout(timer);
  }, [activeIdx, activeBanners.length]);

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slide = Math.round(e.nativeEvent.contentOffset.x / (BANNER_WIDTH + 12));
          if (slide !== activeIdx && slide >= 0 && slide < activeBanners.length) {
            setActiveIdx(slide);
          }
        }}
        scrollEventThrottle={16}
        snapToInterval={BANNER_WIDTH + 12}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {activeBanners.map((banner) => {
          if (banner.id === 'feedx-official') {
            return (
              <TouchableOpacity
                key={banner.id}
                activeOpacity={0.9}
                onPress={() => router.push('/(tabs)/college' as any)}
                style={styles.bannerTouch}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F0F7FF', '#E0F2FE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.officialBannerCard}
                >
                  {/* Top Pill Badge */}
                  <View style={styles.officialBadgePill}>
                    <MaterialCommunityIcons name="shield-check" size={13} color="#2563EB" />
                    <Text style={styles.officialBadgeText}>OFFICIAL COMMUNITY PLATFORM</Text>
                  </View>

                  {/* Main Headline */}
                  <View style={styles.officialTitleRow}>
                    <Text style={styles.officialFeedxTitle}>FEEDX </Text>
                    <Text style={styles.officialPolyTitle}>POLYTECHNIC</Text>
                  </View>

                  {/* Divider line */}
                  <View style={styles.officialHeadlineLine} />

                  {/* Subtitle */}
                  <Text style={styles.officialSubText}>
                    Empowering Polytechnic Students in a <Text style={{ color: '#2563EB', fontWeight: '800' }}>Professional</Text> Way
                  </Text>

                  {/* Bottom Feature Glass Bar */}
                  <View style={styles.officialBottomBar}>
                    <TouchableOpacity
                      style={styles.officialFeatureItem}
                      onPress={() => router.push('/(tabs)/academics' as any)}
                    >
                      <View style={styles.featureIconBox}>
                        <MaterialCommunityIcons name="school" size={14} color="#2563EB" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.featureTitle}>Academics</Text>
                        <Text style={styles.featureSub} numberOfLines={1}>Learn. Grow. Succeed.</Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.featureDivider} />

                    <TouchableOpacity
                      style={styles.officialFeatureItem}
                      onPress={() => router.push('/innovation' as any)}
                    >
                      <View style={styles.featureIconBox}>
                        <MaterialCommunityIcons name="lightbulb-on" size={14} color="#2563EB" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.featureTitle}>Innovations</Text>
                        <Text style={styles.featureSub} numberOfLines={1}>Explore. Create. Inspire.</Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.featureDivider} />

                    <TouchableOpacity
                      style={styles.officialFeatureItem}
                      onPress={() => router.push('/(tabs)/opportunities' as any)}
                    >
                      <View style={styles.featureIconBox}>
                        <MaterialCommunityIcons name="briefcase" size={14} color="#2563EB" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.featureTitle}>Placements</Text>
                        <Text style={styles.featureSub} numberOfLines={1}>Connect. Prepare. Achieve.</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={banner.id}
              activeOpacity={0.9}
              onPress={() => router.push(banner.route as any)}
              style={styles.bannerTouch}
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
                  <Text style={styles.actionBtnText}>Explore Now</Text>
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
    width: BANNER_WIDTH,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  officialBannerCard: {
    padding: 14,
    borderRadius: RADIUS.xl,
    minHeight: 185,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.25)',
  },
  officialBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  officialBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 0.8,
  },
  officialTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  officialFeedxTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  officialPolyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  officialHeadlineLine: {
    width: 24,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 2,
    marginVertical: 4,
  },
  officialSubText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 17,
  },
  officialBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.15)',
    ...SHADOWS.small,
  },
  officialFeatureItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  featureSub: {
    fontSize: 7.5,
    color: '#64748B',
  },
  featureDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    marginHorizontal: 4,
  },
  bannerCard: {
    padding: 16,
    borderRadius: RADIUS.xl,
    minHeight: 146,
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
});
