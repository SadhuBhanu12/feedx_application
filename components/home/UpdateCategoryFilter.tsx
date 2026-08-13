import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, RADIUS } from '@/constants/theme';

export const UPDATE_CATEGORIES = [
  'All',
  'Important',
  'Academics',
  'Events',
  'Placements',
  'Announcements',
];

interface UpdateCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export function UpdateCategoryFilter({ selectedCategory, onSelectCategory }: UpdateCategoryFilterProps) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(250).springify()} style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {UPDATE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.pill,
                { backgroundColor: isActive ? colors.primary : colors.card, borderColor: isActive ? colors.primary : colors.cardBorder },
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
    marginBottom: SPACING.md,
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
