export type FeedXCategoryColor = 'green' | 'blue' | 'purple' | 'pink' | 'orange' | 'yellow' | 'cyan';

export interface FeedXColorPalette {
  primary: string;
  secondary: string;
  glow: string;
}

export const FEEDX_COLOR_PALETTE: Record<FeedXCategoryColor, FeedXColorPalette> = {
  green: { primary: '#18D68C', secondary: '#20E59A', glow: 'rgba(24, 214, 140, 0.45)' },
  blue: { primary: '#168BFF', secondary: '#36A3FF', glow: 'rgba(22, 139, 255, 0.45)' },
  purple: { primary: '#9B5CFF', secondary: '#B06CFF', glow: 'rgba(155, 92, 255, 0.45)' },
  pink: { primary: '#FF3F9F', secondary: '#FF5CAD', glow: 'rgba(255, 63, 159, 0.45)' },
  orange: { primary: '#FF8A18', secondary: '#FF9D2E', glow: 'rgba(255, 138, 24, 0.45)' },
  yellow: { primary: '#FFD42A', secondary: '#FFE169', glow: 'rgba(255, 212, 42, 0.45)' },
  cyan: { primary: '#18D8E8', secondary: '#50E6F2', glow: 'rgba(24, 216, 232, 0.45)' },
};

export const FEEDX_ICON_TOKENS = {
  strokeCap: 'round' as const,
  strokeJoin: 'round' as const,
  defaultStrokeWidth: 2.2,
  thickStrokeWidth: 2.6,
  glowBlurRadius: 2.5,
  defaultContainerRadiusRatio: 0.28,
  activeOpacity: 0.95,
  disabledOpacity: 0.4,
};
