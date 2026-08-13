import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/theme';

interface HapticTabProps {
  accessibilityState?: { selected?: boolean };
  children: React.ReactElement;
  onPress?: () => void;
}

const HapticTab = ({ accessibilityState, children, onPress }: HapticTabProps) => {
  const isSelected = accessibilityState?.selected ?? false;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isSelected ? 1.2 : 1) }],
      backgroundColor: isSelected ? COLORS.primary : 'transparent',
    };
  });

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Haptics unavailable on emulator / environment
    }
    onPress?.();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {React.cloneElement(children, children.type !== React.Fragment ? { color: isSelected ? COLORS.white : COLORS.gray } as any : {})}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HapticTab;

