import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@/constants/motion';

export interface SuccessCheckmarkProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
  onAnimationComplete?: () => void;
}

export const SuccessCheckmark: React.FC<SuccessCheckmarkProps> = ({
  size = 64,
  color = '#10B981',
  backgroundColor = 'rgba(16, 185, 129, 0.12)',
  onAnimationComplete,
}) => {
  const ringScale = useSharedValue(0.6);
  const ringOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    // 1. Expand ring smoothly
    ringOpacity.value = withTiming(1, {
      duration: MOTION_DURATIONS.normal,
      easing: MOTION_EASINGS.decelerate,
    });
    ringScale.value = withTiming(1, {
      duration: MOTION_DURATIONS.normal,
      easing: MOTION_EASINGS.decelerate,
    });

    // 2. Scale in checkmark smoothly with micro-accent
    checkScale.value = withDelay(
      80,
      withSequence(
        withTiming(1.1, {
          duration: MOTION_DURATIONS.fast,
          easing: MOTION_EASINGS.standard,
        }),
        withTiming(1, {
          duration: MOTION_DURATIONS.micro,
          easing: MOTION_EASINGS.standard,
        })
      )
    );

    if (onAnimationComplete) {
      const timer = setTimeout(onAnimationComplete, MOTION_DURATIONS.normal + 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const iconSize = Math.round(size * 0.55);

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor: color,
        },
        ringAnimatedStyle,
      ]}
    >
      <Animated.View style={checkAnimatedStyle}>
        <Feather name="check" size={iconSize} color={color} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ring: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SuccessCheckmark;
