import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';

export interface FeedxAppLogoProps {
  size?: number;
  borderWidth?: number;
  borderRadius?: number;
  shape?: 'box' | 'circle' | 'rounded';
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
  source?: ImageSourcePropType;
  padding?: number;
  backgroundColor?: string;
}

export function FeedxAppLogo({
  size = 42,
  borderWidth = 0,
  borderRadius: customRadius,
  shape = 'rounded',
  glow = false,
  style,
  source = require('../../assets/images/icon.png'),
  padding = 0,
  backgroundColor = '#FFFFFF',
}: FeedxAppLogoProps) {
  let isDark = true;
  try {
    const theme = useTheme();
    if (theme && theme.isDark !== undefined) {
      isDark = theme.isDark;
    }
  } catch (_) {}

  const radius =
    customRadius !== undefined
      ? customRadius
      : shape === 'circle'
      ? size / 2
      : shape === 'rounded'
      ? Math.round(size * 0.22)
      : Math.round(size * 0.16);

  const innerSize = Math.max(8, size - (borderWidth * 2) - (padding * 2));

  return (
    <View
      style={[
        styles.outerContainer,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor,
          padding,
        },
        borderWidth > 0 && {
          borderWidth,
          borderColor: isDark ? 'rgba(59, 130, 246, 0.45)' : 'rgba(59, 130, 246, 0.25)',
        },
        glow && styles.glowShadow,
        style,
      ]}
    >
      <Image
        source={source}
        style={[
          styles.logoImage,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: Math.max(0, radius - borderWidth - padding),
          },
        ]}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowShadow: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  logoImage: {
    overflow: 'hidden',
  },
});

export default FeedxAppLogo;

