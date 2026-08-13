/**
 * FeedX Polytechnic — Global Design System
 * Strict 8pt spacing, premium dark palette, consistent tokens.
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Standard design baseline scale helper (base layout width: 375dp)
const scale = SCREEN_WIDTH / 375;

import { rf, rs } from './responsive';

export function normalize(size: number) {
  return rf(size);
}

export const COLORS = {
  // Backgrounds
  background: '#0F172A',
  surface: '#111827',
  card: '#1E293B',
  cardElevated: '#243047',
  backgroundDark: '#0F172A',
  white: '#FFFFFF',
  gray: '#64748B',
  accent: '#4F46E5',

  // Accents
  primary: '#4F46E5',
  primaryLight: 'rgba(79,70,229,0.15)',
  primaryGlow: 'rgba(79,70,229,0.35)',
  secondary: '#3B82F6',
  secondaryLight: 'rgba(59,130,246,0.15)',

  // Semantic
  success: '#22C55E',
  successLight: 'rgba(34,197,94,0.15)',
  warning: '#F59E0B',
  warningLight: 'rgba(245,158,11,0.15)',
  danger: '#EF4444',
  dangerLight: 'rgba(239,68,68,0.15)',
  info: '#06B6D4',
  infoLight: 'rgba(6,182,212,0.15)',

  // Category colours
  purple: '#8B5CF6',
  purpleLight: 'rgba(139,92,246,0.15)',
  pink: '#EC4899',
  pinkLight: 'rgba(236,72,153,0.15)',
  orange: '#F97316',
  orangeLight: 'rgba(249,115,22,0.15)',
  teal: '#14B8A6',
  tealLight: 'rgba(20,184,166,0.15)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  textDisabled: '#334155',

  // Border / Dividers
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.12)',

  // Gradients (tuple arrays for LinearGradient)
  gradientHome: ['#0F172A', '#1a2744'] as const,
  gradientCard: ['#1E293B', '#243047'] as const,
  gradientPrimary: ['#4F46E5', '#3B82F6'] as const,
  gradientSecondary: ['#3B82F6', '#06B6D4'] as const,
  gradientSuccess: ['#22C55E', '#16A34A'] as const,
  gradientWarning: ['#F59E0B', '#D97706'] as const,
  gradientDanger: ['#EF4444', '#DC2626'] as const,
  gradientPurple: ['#8B5CF6', '#7C3AED'] as const,
  gradientPink: ['#EC4899', '#DB2777'] as const,
  gradientTeal: ['#14B8A6', '#0D9488'] as const,
};

export const SPACING = {
  xs: rs(4),
  sm: rs(8),
  md: rs(16),
  lg: rs(24),
  xl: rs(32),
  xxl: rs(48),
};

export const RADIUS = {
  sm: rs(8),
  md: rs(12),
  lg: rs(16),
  xl: rs(20),
  xxl: rs(28),
  full: 999,
};

export const FONT = {
  size: {
    xs: rf(11),
    sm: rf(13),
    md: rf(15),
    lg: rf(17),
    xl: rf(20),
    xxl: rf(24),
    display: rf(30),
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
};



export const SHADOWS = {
  small: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  medium: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  large: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  }),
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#4F46E5',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#4F46E5',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0F172A',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

