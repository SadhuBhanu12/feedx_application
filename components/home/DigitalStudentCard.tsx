import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import StudentIdCardFlip from '@/components/ui/StudentIdCardFlip';
import { SPACING } from '@/constants/theme';

interface DigitalStudentCardProps {
  user: any;
  dashboard: any;
}

export function DigitalStudentCard({ user, dashboard }: DigitalStudentCardProps) {
  return (
    <Animated.View entering={FadeInUp.duration(300).delay(80)} style={styles.container}>
      <StudentIdCardFlip user={user} dashboard={dashboard} showTapHint={true} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
});

export default DigitalStudentCard;
