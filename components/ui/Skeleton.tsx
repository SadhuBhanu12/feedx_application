import React, { useEffect } from 'react';
import { View, StyleSheet, DimensionValue, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@/constants/motion';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

const SHIMMER_COLORS: readonly [string, string, ...string[]] = [
  'rgba(255,255,255,0.02)',
  'rgba(255,255,255,0.07)',
  'rgba(255,255,255,0.02)',
];

export const BaseSkeleton = ({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 750, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.35, { duration: 750, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(MOTION_DURATIONS.fast)}
      exiting={FadeOut.duration(MOTION_DURATIONS.micro)}
      style={[styles.skeletonBase, { width, height, borderRadius }, style, animatedStyle]}
    >
      <LinearGradient
        colors={SHIMMER_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

export const SkeletonContainer = ({
  loading,
  skeleton,
  children,
}: {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}) => {
  if (loading) {
    return (
      <Animated.View entering={FadeIn.duration(MOTION_DURATIONS.fast)} exiting={FadeOut.duration(MOTION_DURATIONS.micro)}>
        {skeleton}
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(MOTION_DURATIONS.normal)}>
      {children}
    </Animated.View>
  );
};

export const Skeleton = {
  Card: ({ height = 140, borderRadius = 18, style }: SkeletonProps) => (
    <BaseSkeleton width="100%" height={height} borderRadius={borderRadius} style={style} />
  ),
  Avatar: ({ size = 44, style }: { size?: number; style?: ViewStyle | ViewStyle[] }) => (
    <BaseSkeleton width={size} height={size} borderRadius={size / 2} style={style} />
  ),
  Text: ({ width = '100%', lines = 1, style }: SkeletonProps & { lines?: number }) => (
    <View style={[{ gap: 8 }, style]}>
      {Array.from({ length: lines }).map((_, i) => (
        <BaseSkeleton 
          key={i} 
          width={lines > 1 && i === lines - 1 ? '60%' : width} 
          height={14} 
          borderRadius={6} 
        />
      ))}
    </View>
  ),
  Box: BaseSkeleton,
  Container: SkeletonContainer,
};

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
});

export default Skeleton;
