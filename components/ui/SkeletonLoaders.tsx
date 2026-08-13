import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

export function SkeletonItem({ width = '100%', height = 20, borderRadius = 8, style }: any) {
  const { colors, isDark } = useTheme();
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeletonBase,
        {
          width,
          height,
          borderRadius,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <SkeletonItem width={44} height={44} borderRadius={22} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonItem width="60%" height={14} />
          <SkeletonItem width="40%" height={10} />
        </View>
      </View>
      <SkeletonItem width="100%" height={140} borderRadius={12} style={{ marginVertical: 12 }} />
      <SkeletonItem width="85%" height={12} />
    </View>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={{ gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonBase: {
    overflow: 'hidden',
  },
  cardContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
