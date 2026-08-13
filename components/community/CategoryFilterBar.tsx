import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, RADIUS } from '@/constants/theme';

export const COMMUNITY_CATEGORIES = [
  'All',
  'Announcements',
  'Events',
  'Opportunities',
  'Internships',
  'Placements',
  'Workshops',
  'Hackathons',
  'Technical',
  'Academic',
  'Student Activities',
  'Polls',
];

interface CategoryFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export function CategoryFilterBar({ selectedCategory, onSelectCategory }: CategoryFilterBarProps) {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInUp.duration(350).springify()} style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {COMMUNITY_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.pill,
                {
                  backgroundColor: isActive
                    ? colors.primary
                    : isDark
                    ? 'rgba(255,255,255,0.04)'
                    : colors.card,
                  borderColor: isActive ? colors.primary : colors.cardBorder,
                },
              ]}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: isActive ? '#FFF' : colors.textSecondary },
                  isActive && { fontWeight: '900' },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
  },
  scrollList: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
