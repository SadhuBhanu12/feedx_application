import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  success?: boolean;
  successTitle?: string;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SCALE } from '@/constants/motion';

export const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  success = false,
  successTitle,
  disabled = false,
  icon,
  variant = 'primary',
  style,
  textStyle,
  fullWidth = true,
  accessibilityLabel,
}) => {
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';
  const isSecondary = variant === 'secondary';

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled || loading || success) return;
    scale.value = withTiming(MOTION_SCALE.buttonPress, {
      duration: MOTION_DURATIONS.micro,
      easing: MOTION_EASINGS.press,
    });
  };

  const handlePressOut = () => {
    if (disabled || loading || success) return;
    scale.value = withTiming(1, {
      duration: MOTION_DURATIONS.micro,
      easing: MOTION_EASINGS.standard,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gradientColors = success
    ? ['#10B981', '#059669']
    : isDanger
    ? ['#EF4444', '#DC2626']
    : isSecondary
    ? ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']
    : [COLORS.primary, '#D97706'];

  const displayTitle = success ? (successTitle || `${title} ✓`) : title;

  const content = (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" style={styles.spinner} />
      ) : success ? (
        <>
          <Feather name="check-circle" size={18} color="#FFFFFF" style={styles.icon} />
          <Text
            style={[styles.btnText, textStyle]}
            numberOfLines={1}
            allowFontScaling={true}
          >
            {displayTitle}
          </Text>
        </>
      ) : (
        <>
          {icon && <Feather name={icon} size={18} color="#FFFFFF" style={styles.icon} />}
          <Text
            style={[styles.btnText, isGhost && styles.ghostText, textStyle]}
            numberOfLines={1}
            allowFontScaling={true}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.touchable,
        fullWidth && styles.fullWidth,
        (disabled || loading) && !success && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading || success}
        activeOpacity={0.7}
        delayPressIn={0}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || displayTitle}
        accessibilityState={{ disabled: disabled || loading }}
        style={styles.touchableInner}
      >
        {isGhost || isSecondary ? (
          <View style={[styles.gradientBtn, isGhost ? styles.ghostContainer : styles.secondaryContainer]}>
            {content}
          </View>
        ) : (
          <LinearGradient
            colors={gradientColors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            {content}
          </LinearGradient>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    minHeight: 48,
    borderRadius: 14,
    overflow: 'hidden',
  },
  touchableInner: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  gradientBtn: {
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  secondaryContainer: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  spinner: {
    marginRight: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  ghostText: {
    color: COLORS.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default PrimaryButton;
