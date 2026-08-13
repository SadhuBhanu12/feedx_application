import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Blob = ({ color, size, delay, duration }) => {
  const moveX = useSharedValue(0);
  const moveY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    moveX.value = withDelay(delay, withRepeat(withTiming(width - size, { duration }), -1, true));
    moveY.value = withDelay(delay, withRepeat(withTiming(height - size, { duration: duration * 1.5 }), -1, true));
    scale.value = withRepeat(withTiming(1.2, { duration: duration * 0.8 }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: moveX.value },
      { translateY: moveY.value },
      { scale: scale.value }
    ]
  }));

  return (
    <Animated.View style={[styles.blob, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }, style]} />
  );
};

import { useTheme } from '@/context/ThemeContext';

export default function AnimatedBackground() {
  const { colors, isDark } = useTheme();

  return (
    <View style={StyleSheet.absoluteFill}>
      {isDark ? (
        <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    opacity: 0.6,
  }
});
