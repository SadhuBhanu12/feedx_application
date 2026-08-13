import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path, G, Rect } from 'react-native-svg';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS, COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface QuickActionItem {
  id: string;
  label: string;
  iconName: string;
  iconColor: string;
  tileBg?: string;
  isQuestionTile?: boolean;
  route: string;
  action?: () => void;
}

function ActionItem({ item, cols = 3 }: { item: QuickActionItem; cols?: number }) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sidePadding = SPACING.md * 2;
  const itemWidth = Math.floor((width - sidePadding) / cols);

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

  return (
    <View style={{ width: itemWidth, alignItems: 'center', marginBottom: SPACING.md }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={() => { scale.value = withSpring(0.92); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        activeOpacity={0.88}
        style={{ alignItems: 'center' }}
      >
        <Animated.View style={[styles.actionWrap, animStyle]}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: item.tileBg || (isDark ? '#0F172A' : '#1E293B'),
                borderColor: item.tileBg ? 'transparent' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
              },
            ]}
          >
            {item.id === 'quiz' ? (
              <MaterialCommunityIcons name="help-box" size={30} color="#8B5CF6" />
            ) : item.id === 'roadmap' ? (
              <Svg width={36} height={36} viewBox="0 0 48 48" fill="none">
                {/* S-curve road */}
                <Path
                  d="M 8 40 C 20 40 18 20 36 20"
                  stroke="#FFFFFF"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Dashed Center line */}
                <Path
                  d="M 8 40 C 20 40 18 20 36 20"
                  stroke="#0F172A"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                />
                {/* Cyan Flag at top */}
                <G transform="translate(32, 4)">
                  <Path d="M 0 0 L 0 16" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                  <Path d="M 1 1 L 14 5 L 1 10 Z" fill="#00B2FE" stroke="#38BDF8" strokeWidth="0.8" />
                  <Path d="M 4 5.5 L 9 5.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                </G>
                {/* Diamond Node 1 */}
                <Path
                  d="M 18 10 L 22 14 L 18 18 L 14 14 Z"
                  fill="#38BDF8"
                />
                {/* Diamond Node 2 */}
                <Path
                  d="M 36 32 L 39 35 L 36 38 L 33 35 Z"
                  fill="#38BDF8"
                />
              </Svg>
            ) : (
              <MaterialCommunityIcons name={item.iconName as any} size={28} color={item.iconColor} />
            )}
          </View>
          <Text style={[styles.actionLabel, { color: colors.textPrimary }]} numberOfLines={1}>
            {item.label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

export function QuickActionsGrid({ isAdmin = false, onCustomAction }: { isAdmin?: boolean; onCustomAction?: (key: string) => void }) {
  const { colors } = useTheme();

  const studentActions: QuickActionItem[] = [
    {
      id: 'innovation',
      label: 'Innovation Hub',
      iconName: 'lightbulb-on-outline',
      iconColor: '#FACC15', // Bright Yellow
      route: '/innovation',
    },
    {
      id: 'events',
      label: 'Events',
      iconName: 'calendar-star',
      iconColor: '#FF2E63', // Vibrant Pink / Magenta
      route: '/(tabs)/events',
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      iconName: 'briefcase',
      iconColor: '#FF9F1C', // Golden Orange
      route: '/(tabs)/opportunities',
    },
    {
      id: 'colleges',
      label: 'Colleges',
      iconName: 'town-hall',
      iconColor: '#A855F7', // Bright Purple
      route: '/colleges',
    },
    {
      id: 'roadmap',
      label: 'AI Roadmap',
      iconName: 'map-marker-path',
      iconColor: '#38BDF8', // Cyan Winding Road
      route: '/roadmap',
    },
    {
      id: 'resources',
      label: 'Resources',
      iconName: 'file-document',
      iconColor: '#3B82F6', // Vivid Blue Paper
      route: '/(tabs)/academics',
    },
    {
      id: 'quiz',
      label: 'Quiz Zone',
      iconName: 'help-box',
      iconColor: '#8B5CF6', // Vivid Purple Tile Icon
      route: '/daily-quiz',
    },
    {
      id: 'quick_learn',
      label: 'Quick Learn',
      iconName: 'book-open-variant',
      iconColor: '#10B981', // Emerald Green Book
      route: '/(tabs)/explore?tab=quick',
    },
  ];

  const adminActions: QuickActionItem[] = [
    { id: 'registry', label: 'Registry', iconName: 'account-group', iconColor: '#A855F7', route: '/(tabs)/admin/students' },
    { id: 'control', label: 'Control', iconName: 'cog', iconColor: '#06B6D4', route: '/(tabs)/admin/' },
    { id: 'broadcast', label: 'Broadcast', iconName: 'send', iconColor: '#EC4899', route: '/(tabs)/admin/notifications' },
    { id: 'support', label: 'Support Desk', iconName: 'forum', iconColor: '#F59E0B', route: '/(tabs)/admin/issues' },
  ];

  const actions = isAdmin ? adminActions : studentActions;

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(300).springify()} style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((item) => (
          <ActionItem key={item.id} item={item} cols={4} />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT.size.md,
    fontWeight: '800',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionWrap: {
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  questionSquare: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  roadmapBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionMarkText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
});
