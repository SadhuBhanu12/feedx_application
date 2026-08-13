import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface ErrorRetryViewProps {
  message?: string;
  onRetry: () => void;
  iconName?: keyof typeof Feather.glyphMap;
  isCompact?: boolean;
}

export function ErrorRetryView({
  message = 'Unable to load content right now. Please check your connection and try again.',
  onRetry,
  iconName = 'alert-triangle',
  isCompact = false,
}: ErrorRetryViewProps) {
  const { colors } = useTheme();

  if (isCompact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name={iconName} size={16} color="#EF4444" />
        <Text style={[styles.compactText, { color: colors.textMuted }]} numberOfLines={1}>
          {message}
        </Text>
        <TouchableOpacity style={styles.retryBtnCompact} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryTextCompact}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <View style={[styles.iconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
        <Feather name={iconName} size={28} color="#EF4444" />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Connection Error</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      <TouchableOpacity style={styles.retryBtnFull} onPress={onRetry} activeOpacity={0.85}>
        <Feather name="refresh-cw" size={16} color="#FFFFFF" />
        <Text style={styles.retryBtnText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 16,
    marginVertical: 12,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  message: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  retryBtnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
  },
  compactText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  retryBtnCompact: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryTextCompact: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
