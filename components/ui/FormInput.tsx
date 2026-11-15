import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@/constants/motion';

export interface FormInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string | null;
  min?: number;
  max?: number;
  showCharCount?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  helperText?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  required = false,
  error,
  min,
  max,
  showCharCount = false,
  containerStyle,
  inputStyle,
  labelStyle,
  rightIcon,
  onRightIconPress,
  helperText,
  value = '',
  onChangeText,
  onFocus,
  onBlur,
  ...props
}) => {
  const currentLength = (value || '').length;
  const { colors, isDark } = useTheme();
  const focusProgress = useSharedValue(0);

  const handleFocus = (e: any) => {
    focusProgress.value = withTiming(1, { duration: MOTION_DURATIONS.fast, easing: MOTION_EASINGS.standard });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    focusProgress.value = withTiming(0, { duration: MOTION_DURATIONS.fast, easing: MOTION_EASINGS.standard });
    onBlur?.(e);
  };

  const animatedWrapperStyle = useAnimatedStyle(() => {
    const isFocused = focusProgress.value > 0.5;
    return {
      borderColor: error
        ? '#EF4444'
        : isFocused
        ? colors.primary
        : colors.inputBorder,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: focusProgress.value * 0.25,
      shadowRadius: 6,
      elevation: isFocused ? 2 : 0,
    };
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textSecondary }, labelStyle]}>
            {label} {required && <Text style={styles.asterisk}>*</Text>}
          </Text>
          {showCharCount && max ? (
            <Text
              style={[
                styles.charCount,
                { color: colors.textMuted },
                min && currentLength < min ? styles.charCountWarning : null,
                currentLength > max ? styles.charCountError : null,
              ]}
            >
              {currentLength}/{max} {min ? `(min ${min})` : ''}
            </Text>
          ) : null}
        </View>
      )}

      <Animated.View style={[styles.inputWrapper, { backgroundColor: colors.inputBg }, animatedWrapperStyle]}>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(15, 23, 42, 0.4)"}
          {...props}
        />
        {rightIcon ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </Animated.View>

      {!!error ? (
        <View style={styles.errorRow}>
          <Feather name="alert-circle" size={12} color="#EF4444" style={styles.errorIcon} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : !!helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  asterisk: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  charCount: {
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '600',
  },
  charCountWarning: {
    color: '#F59E0B',
  },
  charCountError: {
    color: '#EF4444',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    height: 52,
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14.5,
    height: '100%',
    fontWeight: '500',
  },
  iconBtn: {
    paddingLeft: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingLeft: 2,
  },
  errorIcon: {
    marginRight: 4,
  },
  errorText: {
    fontSize: 11.5,
    color: '#EF4444',
    fontWeight: '700',
  },
  helperText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 4,
    paddingLeft: 2,
  },
});
