import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@/constants/motion';

import { useUser } from '@/context/UserContext';
import { toggleBookmark, isBookmarked as checkIsBookmarked } from '@/services/supabaseService';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * @typedef {Object} BookmarkItem
 * @property {string} id
 * @property {string} [type]
 * @property {string} [title]
 * @property {string} [description]
 */

/**
 * @param {{
 *   isBookmarked?: boolean,
 *   onPress?: () => void,
 *   item?: BookmarkItem,
 *   size?: number,
 *   iconSize?: number,
 *   style?: any
 * }} props
 */
export function BookmarkButton({
  isBookmarked: controlledBookmarked,
  onPress,
  item = null,
  size = 40,
  iconSize = 18,
  style = null,
}) {
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const [internalBookmarked, setInternalBookmarked] = React.useState(false);

  const isBookmarked = controlledBookmarked !== undefined ? controlledBookmarked : internalBookmarked;

  useEffect(() => {
    if (item && item.id && controlledBookmarked === undefined && user?.id) {
      checkIsBookmarked(user.id, item.type || 'notice', item.id)
        .then((res) => {
          if (typeof res === 'boolean') setInternalBookmarked(res);
        })
        .catch(() => {});
    }
  }, [item?.id, controlledBookmarked, user?.id]);
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);
  const activeProgress = useSharedValue(isBookmarked ? 1 : 0);
  const initialRender = useRef(true);

  useEffect(() => {
    activeProgress.value = withTiming(isBookmarked ? 1 : 0, {
      duration: MOTION_DURATIONS.fast,
      easing: MOTION_EASINGS.standard,
    });

    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Micro scale pop when bookmark state toggles
    iconScale.value = withSequence(
      withTiming(0.88, { duration: 60, easing: MOTION_EASINGS.press }),
      withTiming(1.15, { duration: 100, easing: MOTION_EASINGS.standard }),
      withTiming(1, { duration: 80, easing: MOTION_EASINGS.standard })
    );
  }, [isBookmarked]);

  const handlePressIn = () => {
    scale.value = withTiming(0.92, {
      duration: MOTION_DURATIONS.micro,
      easing: MOTION_EASINGS.press,
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: MOTION_DURATIONS.micro,
      easing: MOTION_EASINGS.standard,
    });
  };

  const handlePress = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}
    if (onPress) {
      onPress();
    } else if (item && item.id && user?.id) {
      const nextVal = !internalBookmarked;
      setInternalBookmarked(nextVal);
      toggleBookmark(user.id, item.type || 'notice', item.id).catch(() => {
        setInternalBookmarked(!nextVal);
      });
    }
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

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
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
      <Animated.View style={animatedIconStyle}>
        {isBookmarked ? (
          <FontAwesome name="bookmark" size={iconSize} color="#FFFFFF" />
        ) : (
          <Feather name="bookmark" size={iconSize} color={colors.textSecondary} />
        )}
      </Animated.View>
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
