import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path, G } from 'react-native-svg';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS, COLORS } from '@/constants/theme';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SCALE } from '@/constants/motion';

interface QuickActionItem {
  id: string;
  label: string;
  iconName: string;
  iconColor: string;
  route: string;
  action?: () => void;
}

function ActionItem({ item, cols = 4 }: { item: QuickActionItem; cols?: number }) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const scale = useSharedValue(1);
  const { width } = useWindowDimensions();

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sidePadding = SPACING.md * 2;
  const itemWidth = Math.floor((width - sidePadding - 32) / cols);

  const handlePress = () => {
    if (item.action) {
      item.action();
    } else if (item.route.includes('explore')) {
      const tabParam = item.route.split('?tab=')[1] || 'quick';
      router.push({ pathname: '/(tabs)/explore' as any, params: { tab: tabParam } });
    } else {
      router.push(item.route as any);
    }
  };

  const getTileColors = (id: string, defaultColor: string) => {
    switch (id) {
      case 'events':
        return {
          gradient: isDark ? ['rgba(255, 46, 99, 0.24)', 'rgba(255, 46, 99, 0.08)'] : ['#FFE4EC', '#FFF0F5'],
          border: isDark ? 'rgba(255, 46, 99, 0.4)' : 'rgba(255, 46, 99, 0.22)',
          iconColor: '#FF2E63',
        };
      case 'opportunities':
        return {
          gradient: isDark ? ['rgba(255, 159, 28, 0.24)', 'rgba(255, 159, 28, 0.08)'] : ['#FFF3E0', '#FFF8E1'],
          border: isDark ? 'rgba(255, 159, 28, 0.4)' : 'rgba(255, 159, 28, 0.22)',
          iconColor: '#FF9F1C',
        };
      case 'resources':
        return {
          gradient: isDark ? ['rgba(59, 130, 246, 0.24)', 'rgba(59, 130, 246, 0.08)'] : ['#EFF6FF', '#DBEAFE'],
          border: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.22)',
          iconColor: '#3B82F6',
        };
      case 'roadmap':
        return {
          gradient: isDark ? ['rgba(6, 182, 212, 0.24)', 'rgba(6, 182, 212, 0.08)'] : ['#ECFEFF', '#CFFAFE'],
          border: isDark ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.22)',
          iconColor: '#06B6D4',
        };
      default:
        return {
          gradient: isDark ? ['rgba(168, 85, 247, 0.24)', 'rgba(168, 85, 247, 0.08)'] : ['#F3E8FF', '#FAF5FF'],
          border: isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.22)',
          iconColor: defaultColor || '#8B5CF6',
        };
    }
  };

  const tileTheme = getTileColors(item.id, item.iconColor);

  return (
    <View style={{ width: itemWidth, alignItems: 'center', marginBottom: SPACING.xs }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={() => {
          scale.value = withTiming(MOTION_SCALE.cardPress, {
            duration: MOTION_DURATIONS.micro,
            easing: MOTION_EASINGS.press,
          });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, {
            duration: MOTION_DURATIONS.micro,
            easing: MOTION_EASINGS.standard,
          });
        }}
        delayPressIn={0}
        activeOpacity={0.7}
        style={{ alignItems: 'center' }}
      >
        <Animated.View style={[styles.actionWrap, animStyle]}>
          <LinearGradient
            colors={tileTheme.gradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.iconBox,
              {
                borderColor: tileTheme.border,
              },
            ]}
          >
            {item.id === 'roadmap' ? (
              <Svg width={32} height={32} viewBox="0 0 48 48" fill="none">
                <Path
                  d="M 8 40 C 20 40 18 20 36 20"
                  stroke="#FFFFFF"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                />
                <Path
                  d="M 8 40 C 20 40 18 20 36 20"
                  stroke="#0891B2"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                />
                <G transform="translate(32, 4)">
                  <Path d="M 0 0 L 0 16" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                  <Path d="M 1 1 L 14 5 L 1 10 Z" fill="#00B2FE" stroke="#38BDF8" strokeWidth="0.8" />
                </G>
                <Path d="M 18 10 L 22 14 L 18 18 L 14 14 Z" fill="#06B6D4" />
                <Path d="M 36 32 L 39 35 L 36 38 L 33 35 Z" fill="#06B6D4" />
              </Svg>
            ) : (
              <MaterialCommunityIcons name={item.iconName as any} size={26} color={tileTheme.iconColor} />
            )}
          </LinearGradient>
          <Text style={[styles.actionLabel, { color: colors.textPrimary }]} numberOfLines={1}>
            {item.label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

export function QuickActionsGrid({ isAdmin = false, onCustomAction }: { isAdmin?: boolean; onCustomAction?: (key: string) => void }) {
  const { colors, isDark } = useTheme();

  const studentActions: QuickActionItem[] = [
    {
      id: 'events',
      label: 'Events',
      iconName: 'calendar-star',
      iconColor: '#FF2E63',
      route: '/(tabs)/events',
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      iconName: 'briefcase-outline',
      iconColor: '#FF9F1C',
      route: '/(tabs)/opportunities',
    },
    {
      id: 'resources',
      label: 'Resources',
      iconName: 'book-open-page-variant-outline',
      iconColor: '#3B82F6',
      route: '/(tabs)/explore?tab=resources',
    },
    {
      id: 'roadmap',
      label: 'Roadmaps',
      iconName: 'map-marker-path',
      iconColor: '#38BDF8',
      route: '/roadmap',
    },
  ];

  const adminActions: QuickActionItem[] = [
    { id: 'registry', label: 'Registry', iconName: 'account-group-outline', iconColor: '#A855F7', route: '/(tabs)/admin/students' },
    { id: 'control', label: 'Control', iconName: 'cog-outline', iconColor: '#06B6D4', route: '/(tabs)/admin/' },
    { id: 'broadcast', label: 'Broadcast', iconName: 'send-outline', iconColor: '#EC4899', route: '/(tabs)/admin/notifications' },
    { id: 'support', label: 'Support Desk', iconName: 'forum-outline', iconColor: '#F59E0B', route: '/(tabs)/admin/issues' },
  ];

  const actions = isAdmin ? adminActions : studentActions;

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(300).springify()} style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#131E3A', '#0B132B'] : ['#FFFFFF', '#F8FAFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.cardWrapper,
          {
            borderColor: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(0, 0, 0, 0.08)',
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={styles.accentBar} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Access</Text>
          </View>
          <View style={[styles.badgePill, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.16)' : '#EFF6FF' }]}>
            <Text style={styles.badgeText}>SHORTCUTS</Text>
          </View>
        </View>
        <View style={styles.singleRow}>
          {actions.map((item) => (
            <ActionItem key={item.id} item={item} cols={4} />
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardWrapper: {
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  accentBar: {
    width: 3.5,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
  sectionTitle: {
    fontSize: FONT.size.md,
    fontWeight: '800',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  singleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionWrap: {
    alignItems: 'center',
    gap: 7,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 1,
  },
});

export default QuickActionsGrid;
