import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Standard design baseline scale helper (base layout width: 375dp, height: 812dp)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;
const scaleHeight = SCREEN_HEIGHT / BASE_HEIGHT;
const scale = Math.min(scaleWidth, scaleHeight);

/**
 * Responsive Width: Returns width calculated as percentage of screen width (e.g. wp(50) = 50% width)
 */
export function wp(percentage: number): number {
  return Math.round((percentage * SCREEN_WIDTH) / 100);
}

/**
 * Responsive Height: Returns height calculated as percentage of screen height (e.g. hp(20) = 20% height)
 */
export function hp(percentage: number): number {
  return Math.round((percentage * SCREEN_HEIGHT) / 100);
}

/**
 * Responsive Font Size: Scales font size based on screen pixel density & width baseline.
 * Enforces safe minimum/maximum limits so text never clips or overflows.
 */
export function rf(size: number): number {
  const newSize = size * scaleWidth;
  const clampedSize = Math.max(size * 0.85, Math.min(newSize, size * 1.25));
  const rounded = Math.round(PixelRatio.roundToNearestPixel(clampedSize));
  return Platform.OS === 'ios' ? rounded : rounded - 1;
}

/**
 * Responsive Scale: General sizing helper for padding, margin, icon sizes, and component dimensions.
 */
export function rs(size: number): number {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// Device Characteristics
export const SCREEN_SPECS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 360,
  isMediumDevice: SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 600,
  isTablet: SCREEN_WIDTH >= 600,
  isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT,
};

/**
 * Dynamic Grid Helper: Returns column count according to screen size
 */
export function getGridColumns(smallCols = 1, mediumCols = 2, tabletCols = 3): number {
  if (SCREEN_SPECS.isTablet) return tabletCols;
  if (SCREEN_SPECS.isSmallDevice) return smallCols;
  return mediumCols;
}

/**
 * Safe Touch Target Guard: Ensures button height/width satisfies Android 48dp touch guidelines
 */
export const MIN_TOUCH_SIZE = Math.max(48, rs(48));
