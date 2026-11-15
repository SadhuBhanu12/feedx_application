import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SCALE } from '@/constants/motion';

export interface PressableCardProps {
  children: React.ReactNode;
  onPress?: (event?: GestureResponderEvent) => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  scaleTo?: number;
  haptic?: boolean;
  activeOpacity?: number;
  testID?: string;
  accessibilityLabel?: string;
}

export const PressableCard: React.FC<PressableCardProps> = ({
  children,
  onPress,
  onLongPress,
  style,
  contentStyle,
  disabled = false,
  scaleTo = MOTION_SCALE.cardPress,
  haptic = false,
  activeOpacity = 1,
  testID,
  accessibilityLabel,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    scale.value = withTiming(scaleTo, {
      duration: MOTION_DURATIONS.micro,
      easing: MOTION_EASINGS.press,
    });
    if (activeOpacity < 1) {
      opacity.value = withTiming(activeOpacity, {
        duration: MOTION_DURATIONS.micro,
      });
    }
  }, [disabled, scaleTo, activeOpacity]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;
    scale.value = withTiming(1, {
      duration: MOTION_DURATIONS.micro,
      easing: MOTION_EASINGS.standard,
    });
    if (activeOpacity < 1) {
      opacity.value = withTiming(1, {
        duration: MOTION_DURATIONS.micro,
      });
    }
  }, [disabled, activeOpacity]);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled) return;
      if (haptic) {
        try {
          Haptics.selectionAsync().catch(() => {});
        } catch {}
      }
      onPress?.(e);
    },
    [disabled, haptic, onPress]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPress={disabled ? undefined : handlePress}
      onLongPress={disabled ? undefined : onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      unstable_pressDelay={0}
      style={style}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      <Animated.View style={[styles.inner, contentStyle, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inner: {
    width: '100%',
    flexGrow: 1,
  },
});

export default PressableCard;
