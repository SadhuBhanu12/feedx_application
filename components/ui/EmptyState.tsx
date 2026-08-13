import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export const EmptyState = ({ 
  icon = 'inbox', 
  title, 
  message, 
  actionLabel, 
  onAction,
  style 
}: EmptyStateProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={32} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.1)', // primary color with 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: COLORS.cardElevated,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  }
});
