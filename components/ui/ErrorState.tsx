import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  style?: ViewStyle | ViewStyle[];
}

export const ErrorState = ({ 
  title = 'Something went wrong', 
  message = 'We encountered an error while loading this data. Please check your connection and try again.', 
  onRetry,
  style 
}: ErrorStateProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }, style]}>
      <View style={styles.iconContainer}>
        <Feather name="alert-triangle" size={32} color="#EF4444" />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
        <Feather name="refresh-cw" size={16} color={COLORS.white} style={styles.retryIcon} />
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.cardElevated,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)', // Red tint border
    margin: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red tint background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  }
});
