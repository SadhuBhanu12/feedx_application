import React, { useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface DoubleTapLikeWrapperProps {
  children: React.ReactNode;
  onDoubleTap: () => void;
  onSingleTap?: () => void;
  showHeartOnLike?: boolean;
  style?: any;
}

export function DoubleTapLikeWrapper({
  children,
  onDoubleTap,
  onSingleTap,
  showHeartOnLike = true,
  style,
}: DoubleTapLikeWrapperProps) {
  const lastTapRef = useRef<number>(0);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const timerRef = useRef<any>(null);

  const triggerHeartAnimation = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}

    heartOpacity.value = 1;
    heartScale.value = 0;
    heartScale.value = withSequence(
      withSpring(1.35, { damping: 10, stiffness: 300 }),
      withTiming(1.0, { duration: 160 }),
      withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }, () => {
        heartOpacity.value = 0;
      })
    );
  };

  const handlePress = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 280;

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      lastTapRef.current = 0;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (showHeartOnLike) {
        triggerHeartAnimation();
      }
      if (onDoubleTap) {
        onDoubleTap();
      }
    } else {
      lastTapRef.current = now;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        if (onSingleTap) {
          onSingleTap();
        }
        timerRef.current = null;
      }, 240);
    }
  };

  const animatedHeartStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.value,
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, style]}>
        {children}
        <View style={styles.heartOverlay} pointerEvents="none">
          <Animated.View style={[styles.heartWrap, animatedHeartStyle]}>
            <Ionicons name="heart" size={96} color="#FFFFFF" style={styles.heartShadow} />
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heartOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 35,
  },
  heartWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 14,
  },
});
