import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AppLoader from './AppLoader';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { Feather } from '@expo/vector-icons';

interface AsyncBoundaryProps {
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  isEmpty?: boolean;
  data?: any;
  onRetry?: () => void;
  loadingFallback?: React.ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: keyof typeof Feather.glyphMap;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  timeoutMs?: number;
  children: React.ReactNode;
}

export const AsyncBoundary: React.FC<AsyncBoundaryProps> = ({
  isLoading = false,
  isError = false,
  error = null,
  isEmpty,
  data,
  onRetry,
  loadingFallback,
  emptyTitle = 'No Items Found',
  emptyMessage = 'There are no records to display right now.',
  emptyIcon = 'inbox',
  emptyActionLabel,
  onEmptyAction,
  timeoutMs = 10000,
  children,
}) => {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimedOut(true);
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [isLoading, timeoutMs]);

  // Handle timeout or explicit error
  if (isError || timedOut) {
    const errorMsg = timedOut
      ? 'Request timed out. Please check your internet connection and retry.'
      : (typeof error === 'string' ? error : error?.message || 'Unable to fetch data from server.');

    return (
      <View style={styles.flexContainer}>
        <ErrorState
          title={timedOut ? 'Network Timeout' : 'Service Notice'}
          message={errorMsg}
          onRetry={() => {
            setTimedOut(false);
            if (onRetry) onRetry();
          }}
        />
      </View>
    );
  }

  // Handle loading
  if (isLoading) {
    return (
      <View style={styles.flexContainer}>
        {loadingFallback || <AppLoader />}
      </View>
    );
  }

  // Determine if data is empty
  const computedIsEmpty =
    isEmpty !== undefined
      ? isEmpty
      : (Array.isArray(data) && data.length === 0) ||
        (data && typeof data === 'object' && Object.keys(data).length === 0);

  if (computedIsEmpty) {
    return (
      <View style={styles.flexContainer}>
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          message={emptyMessage}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});

export default AsyncBoundary;
