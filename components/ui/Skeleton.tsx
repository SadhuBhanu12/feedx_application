import React, { useEffect } from 'react';
import { View, StyleSheet, DimensionValue, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

const SHIMMER_COLORS: readonly [string, string, ...string[]] = ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)'];

const BaseSkeleton = ({ width, height, borderRadius = 8, style }: SkeletonProps) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.skeletonBase, { width, height, borderRadius }, style, animatedStyle]}>
      <LinearGradient
        colors={SHIMMER_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
};

export const Skeleton = {
  Card: ({ height = 150, style }: SkeletonProps) => (
    <BaseSkeleton width="100%" height={height} borderRadius={16} style={style} />
  ),
  Avatar: ({ size = 40, style }: { size?: number, style?: ViewStyle | ViewStyle[] }) => (
    <BaseSkeleton width={size} height={size} borderRadius={size / 2} style={style} />
  ),
  Text: ({ width = '100%', lines = 1, style }: SkeletonProps & { lines?: number }) => (
    <View style={[{ gap: 8 }, style]}>
      {Array.from({ length: lines }).map((_, i) => (
        <BaseSkeleton 
          key={i} 
          width={lines > 1 && i === lines - 1 ? '70%' : width} 
          height={14} 
          borderRadius={4} 
        />
      ))}
    </View>
  ),
  Box: BaseSkeleton
};

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
  }
});
