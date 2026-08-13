import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function BookmarkButton({
  isBookmarked,
  onPress,
  size = 40,
  iconSize = 18,
  style = null,
}) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const activeProgress = useSharedValue(isBookmarked ? 1 : 0);

  useEffect(() => {
    activeProgress.value = withTiming(isBookmarked ? 1 : 0, { duration: 250 });
  }, [isBookmarked]);

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const defaultBg = isDark ? 'rgba(255, 255, 255, 0.06)' : colors.inputBg;
  const defaultBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : colors.inputBorder;
  const primaryColor = colors.primary || COLORS.primary;

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      activeProgress.value,
      [0, 1],
      [defaultBg, primaryColor]
    );

    const borderColor = interpolateColor(
      activeProgress.value,
      [0, 1],
      [defaultBorder, primaryColor]
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
      borderColor,
    };
  });

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={isBookmarked ? 'Remove Bookmark' : 'Save Item'}
      accessibilityState={{ selected: isBookmarked }}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        isBookmarked && SHADOWS.glow(primaryColor),
        animatedStyle,
        style,
      ]}
    >
      {isBookmarked ? (
        <FontAwesome name="bookmark" size={iconSize} color="#FFFFFF" style={{ zIndex: 10 }} />
      ) : (
        <Feather name="bookmark" size={iconSize} color={colors.textSecondary} />
      )}
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export default BookmarkButton;
