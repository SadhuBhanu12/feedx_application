import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticTabProps {
  accessibilityState?: { selected?: boolean };
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: any;
}

const HapticTab: React.FC<HapticTabProps> = ({
  accessibilityState,
  children,
  onPress,
  onLongPress,
  style,
}) => {
  const isSelected = accessibilityState?.selected ?? false;

  const handlePress = () => {
    onPress?.();
    setTimeout(() => {
      try {
        Haptics.selectionAsync().catch(() => {});
      } catch (_) {}
    }, 0);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      style={[styles.container, style]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { HapticTab };
export default HapticTab;
