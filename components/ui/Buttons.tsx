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
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
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

  const gradientColors = isDanger
    ? ['#EF4444', '#DC2626']
    : isSecondary
    ? ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']
    : [COLORS.primary, '#D97706'];

  const content = (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" style={styles.spinner} />
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
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        styles.touchable,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
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
  );
};

const styles = StyleSheet.create({
  touchable: {
    minHeight: 48,
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
