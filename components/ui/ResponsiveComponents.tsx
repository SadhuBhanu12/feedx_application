import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  TextProps,
  TouchableOpacityProps,
  ViewProps,
  TextInputProps,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { rf, rs, wp, MIN_TOUCH_SIZE } from '@/constants/responsive';
import { COLORS } from '@/constants/theme';

export interface ResponsiveTextProps extends TextProps {
  size?: number;
  weight?: '400' | '500' | '600' | '700' | '800' | '900';
  color?: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export function ResponsiveText({
  size = 14,
  weight = '400',
  color = '#FFF',
  align = 'left',
  style,
  children,
  numberOfLines,
  adjustsFontSizeToFit = true,
  minimumFontScale = 0.75,
  ...rest
}: ResponsiveTextProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      style={[
        {
          fontSize: rf(size),
          fontWeight: weight,
          color,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export interface ResponsiveButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: React.ReactNode;
}

export function ResponsiveButton({
  title,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
  style,
  onPress,
  ...rest
}: ResponsiveButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return 'rgba(255,255,255,0.1)';
    if (variant === 'secondary') return COLORS.secondary || '#3B82F6';
    if (variant === 'danger') return COLORS.danger || '#EF4444';
    if (variant === 'outline') return 'transparent';
    return COLORS.primary || '#4F46E5';
  };

  const getBorderColor = () => {
    if (variant === 'outline') return COLORS.primary || '#4F46E5';
    return 'transparent';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          minHeight: MIN_TOUCH_SIZE,
          paddingHorizontal: rs(16),
          paddingVertical: rs(10),
          borderRadius: rs(14),
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon ? <View style={{ marginRight: rs(8) }}>{icon}</View> : null}
          <ResponsiveText
            size={14}
            weight="800"
            color={disabled ? 'rgba(255,255,255,0.4)' : '#FFF'}
            align="center"
          >
            {title}
          </ResponsiveText>
        </View>
      )}
    </TouchableOpacity>
  );
}

export interface ResponsiveCardProps extends ViewProps {
  children: React.ReactNode;
}

export function ResponsiveCard({ children, style, ...rest }: ResponsiveCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          padding: rs(16),
          borderRadius: rs(20),
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export interface ResponsiveInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function ResponsiveInput({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: ResponsiveInputProps) {
  return (
    <View style={styles.inputContainer}>
      {label ? (
        <ResponsiveText size={11} weight="800" color="rgba(255,255,255,0.6)" style={{ marginBottom: rs(6) }}>
          {label}
        </ResponsiveText>
      ) : null}
      <View style={[styles.inputWrapper, { height: Math.max(MIN_TOUCH_SIZE, rs(46)), borderRadius: rs(14) }]}>
        {leftIcon ? <View style={{ marginLeft: rs(12) }}>{leftIcon}</View> : null}
        <TextInput
          placeholderTextColor="rgba(255,255,255,0.3)"
          style={[
            styles.input,
            {
              fontSize: rf(14),
              paddingHorizontal: rs(12),
            },
            style,
          ]}
          {...rest}
        />
        {rightIcon ? <View style={{ marginRight: rs(12) }}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <ResponsiveText size={10} weight="700" color="#EF4444" style={{ marginTop: rs(4) }}>
          {error}
        </ResponsiveText>
      ) : null}
    </View>
  );
}

export interface ResponsiveScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: any;
}

export function ResponsiveScreen({ children, scrollable = true, style }: ResponsiveScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F172A' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[{ padding: rs(16) }, style]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1, padding: rs(16) }, style]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputContainer: {
    marginBottom: rs(14),
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    color: '#FFF',
  },
});
