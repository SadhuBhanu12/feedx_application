import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_SCALE,
  MOTION_SPRING_CONFIG,
} from '@/constants/motion';

/**
 * Custom hook for motion system tokens with reduced-motion support.
 */
export function useMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Check initial reduced motion accessibility setting
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isMounted) setReduceMotion(enabled);
      })
      .catch(() => {});

    // Listen for reduced motion changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        if (isMounted) setReduceMotion(enabled);
      }
    );

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  return {
    reduceMotion,
    durations: reduceMotion
      ? {
          micro: 0,
          fast: 0,
          normal: 0,
          page: 0,
          flip: 0,
          countUp: 0,
        }
      : MOTION_DURATIONS,
    easings: MOTION_EASINGS,
    scale: reduceMotion
      ? {
          cardPress: 1,
          buttonPress: 1,
          tabActive: 1,
          iconPop: 1,
        }
      : MOTION_SCALE,
    spring: MOTION_SPRING_CONFIG,
  };
}

export default useMotion;
