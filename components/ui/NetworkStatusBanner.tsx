import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useNetworkStatus } from '@/services/networkManager';

export function NetworkStatusBanner() {
  const { quality, isConnected } = useNetworkStatus();

  if (isConnected && quality === 'ONLINE') {
    return null;
  }

  const isOffline = !isConnected || quality === 'OFFLINE';

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(300)}
      style={[
        styles.bannerContainer,
        { backgroundColor: isOffline ? '#EF4444' : '#F59E0B' },
      ]}
    >
      <Feather
        name={isOffline ? 'wifi-off' : 'alert-circle'}
        size={14}
        color="#FFFFFF"
      />
      <Text style={styles.bannerText}>
        {isOffline
          ? 'You are offline. Showing cached content.'
          : 'Slow internet connection detected. Content may take longer to load.'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    width: '100%',
    zIndex: 9999,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
