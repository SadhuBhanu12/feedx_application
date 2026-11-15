import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface FeedxTokenProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customSize?: number;
  showGlow?: boolean;
}

const SIZES = {
  sm: { diameter: 18, iconSize: 11, borderWidth: 1 },
  md: { diameter: 26, iconSize: 15, borderWidth: 1.5 },
  lg: { diameter: 44, iconSize: 24, borderWidth: 2 },
  xl: { diameter: 72, iconSize: 38, borderWidth: 3 },
};

export function FeedxToken({ size = 'md', customSize, showGlow = false }: FeedxTokenProps) {
  const config = SIZES[size] || SIZES.md;
  const diameter = customSize || config.diameter;
  const iconSize = customSize ? Math.round(customSize * 0.55) : config.iconSize;
  const borderWidth = customSize ? Math.max(1, Math.round(customSize * 0.06)) : config.borderWidth;

  return (
    <View
      style={[
        styles.tokenContainer,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
        },
        showGlow && styles.glowShadow,
      ]}
    >
      <LinearGradient
        colors={['#FCD34D', '#F59E0B', '#D97706']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[
          styles.outerRing,
          {
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
            borderWidth: borderWidth,
            borderColor: '#FEF3C7',
          },
        ]}
      >
        <LinearGradient
          colors={['#F59E0B', '#B45309']}
          start={{ x: 0.3, y: 0.1 }}
          end={{ x: 0.8, y: 0.9 }}
          style={[
            styles.innerCore,
            {
              width: diameter - borderWidth * 3.5,
              height: diameter - borderWidth * 3.5,
              borderRadius: (diameter - borderWidth * 3.5) / 2,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="alpha-f-circle"
            size={iconSize}
            color="#FEF3C7"
          />
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  tokenContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowShadow: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 4,
  },
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCore: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(254, 243, 199, 0.4)',
  },
});

export default FeedxToken;
