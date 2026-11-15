import { Platform } from 'react-native';
import { Easing } from 'react-native-reanimated';

/**
 * FEEDX Premium Motion System Tokens
 * Fast, Smooth, Responsive, and Professional
 */

export const MOTION_DURATIONS = {
  // Micro-interactions (Button press, Card tap, Checkbox, Bookmark pop)
  micro: 70,
  // Fast state changes (Tab indicators, Tooltips, Badge reveals)
  fast: 120,
  // Standard transitions (Skeletons, Progress bars, Card expands)
  normal: 200,
  // Page / Modal transitions
  page: 220,
  // Complex multi-phase interactions (3D Card flip, QR verification step)
  flip: 450,
  // Progress bar filling duration (smooth, slow and cinematic fill)
  progressBar: 2200,
  // Progress count-up duration (smooth & noticeable count up from 0)
  countUp: 2000,
} as const;

export const MOTION_EASINGS = {
  // Standard cubic easing for smooth UI transitions (clean, fast start, soft stop)
  standard: Easing.bezier(0.25, 0.1, 0.25, 1),
  // Decelerate curve for entering elements
  decelerate: Easing.out(Easing.cubic),
  // Accelerate curve for exiting elements
  accelerate: Easing.in(Easing.cubic),
  // Gentle curve for card press compression
  press: Easing.out(Easing.quad),
  // Card flip 3D rotation curve
  flip: Easing.bezier(0.2, 0.0, 0.2, 1),
};

export const MOTION_SCALE = {
  // Card press compression (subtle 98% scale)
  cardPress: 0.98,
  // Button press compression (subtle 97% scale)
  buttonPress: 0.97,
  // Tab active pill subtle scale
  tabActive: 1.04,
  // Bookmark / Like pop scale peak
  iconPop: 1.15,
} as const;

export const MOTION_SPRING_CONFIG = {
  // Gentle, non-bouncy spring for responsive tactile feel
  subtle: {
    damping: 24,
    stiffness: 300,
    mass: 0.8,
  },
  // Snappy spring for quick icon state changes
  snappy: {
    damping: 18,
    stiffness: 380,
    mass: 0.6,
  },
};
