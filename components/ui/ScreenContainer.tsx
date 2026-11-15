import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  gradientColors?: string[];
  statusBarStyle?: 'light' | 'dark' | 'auto';
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  style,
  contentStyle,
  gradientColors = ['#070A12', '#0F172A', '#131C31'],
  statusBarStyle = 'light',
}) => {
  const insets = useSafeAreaInsets();

  const containerPadding = {
    paddingTop: Math.max(insets.top, 12),
    paddingBottom: Math.max(insets.bottom, 16),
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient colors={gradientColors as any} style={StyleSheet.absoluteFill} />
      <StatusBar style={statusBarStyle} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scrollable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.scrollContent,
              containerPadding,
              contentStyle,
            ]}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.staticContent, containerPadding, contentStyle]}>
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070A12',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default ScreenContainer;
