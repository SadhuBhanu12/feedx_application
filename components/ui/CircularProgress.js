import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({ percentage = 0, size = 150, strokeWidth = 15 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percentage / 100, { duration: 1000 });
  }, [percentage, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const getAttendanceColor = (p) => {
    if (p < 75) return COLORS.danger;
    if (p < 85) return COLORS.warning;
    return COLORS.success;
  };
  const color = getAttendanceColor(percentage);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          stroke={COLORS.cardDark}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.percentageText, { color }]}>
          {`${Math.round(percentage)}%`}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CircularProgress;
