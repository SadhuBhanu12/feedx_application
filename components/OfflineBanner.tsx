import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUIStore, NetworkQuality } from '@/store/useUIStore';

export function OfflineBanner() {
  const setNetworkStatus = useUIStore(state => state.setNetworkStatus);
  
  const [bannerConfig, setBannerConfig] = useState<{
    visible: boolean;
    type: 'offline' | 'slow' | 'restored';
    message: string;
    subMessage?: string;
    color: string;
    icon: any;
  }>({
    visible: false,
    type: 'offline',
    message: '',
    color: '#EF4444',
    icon: 'wifi-off'
  });

  const translateY = useSharedValue(-150);
  const insets = useSafeAreaInsets();
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      let quality: NetworkQuality = 'Excellent';
      let isOffline = state.isConnected === false || state.isInternetReachable === false;

      if (!isOffline && state.details) {
        // @ts-ignore (downlink exists on cellular and wifi in modern RN netinfo)
        const speedMbps = state.details.downlink;
        if (speedMbps !== undefined) {
          if (speedMbps < 0.5) quality = 'Very Slow';
          else if (speedMbps < 2) quality = 'Slow';
          else if (speedMbps < 10) quality = 'Good';
          else quality = 'Excellent';
        } else if (state.type === 'cellular') {
          // @ts-ignore
          const cellularType = state.details.cellularGeneration;
          if (cellularType === '2g') quality = 'Very Slow';
          else if (cellularType === '3g') quality = 'Slow';
        }
      }

      if (isOffline) quality = 'Offline';
      
      setNetworkStatus(isOffline, quality);
      handleNetworkChange(isOffline, quality);
    });

    return () => unsubscribe();
  }, []);

  const handleNetworkChange = (isOffline: boolean, quality: NetworkQuality) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    if (isOffline) {
      setBannerConfig({
        visible: true,
        type: 'offline',
        message: 'No internet connection.',
        subMessage: 'Showing cached data.',
        color: '#EF4444',
        icon: 'wifi-off'
      });
      showBanner();
    } else if (quality === 'Slow' || quality === 'Very Slow') {
      setBannerConfig({
        visible: true,
        type: 'slow',
        message: '⚠ Slow Internet Connection',
        subMessage: "We're still fetching your data. Please wait...",
        color: '#F59E0B',
        icon: 'alert-triangle'
      });
      showBanner();
    } else if (bannerConfig.visible && (quality === 'Good' || quality === 'Excellent')) {
      // It was showing offline/slow, now restored
      setBannerConfig(prev => ({
        ...prev,
        type: 'restored',
        message: 'Back online!',
        subMessage: undefined,
        color: '#10B981',
        icon: 'wifi'
      }));
      showBanner();
      
      // Auto hide after 3 seconds
      hideTimeoutRef.current = setTimeout(() => {
        hideBanner();
      }, 3000);
    } else {
      hideBanner();
    }
  };

  const showBanner = () => {
    translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  };

  const hideBanner = () => {
    translateY.value = withTiming(-150, { duration: 300, easing: Easing.inOut(Easing.ease) }, (finished) => {
      if (finished) {
        runOnJS(setBannerConfig)(prev => ({ ...prev, visible: false }));
      }
    });
  };

  const bannerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!bannerConfig.visible) return null;

  return (
    <Animated.View style={[
      styles.container, 
      bannerStyle,
      { 
        backgroundColor: bannerConfig.color,
        paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 40 : 20) 
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name={bannerConfig.icon} size={20} color="#FFF" />
          {bannerConfig.type === 'slow' && (
            <ActivityIndicator size="small" color="#FFF" style={styles.spinner} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.message}>{bannerConfig.message}</Text>
          {bannerConfig.subMessage && (
            <Text style={styles.subMessage}>{bannerConfig.subMessage}</Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingBottom: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    position: 'absolute',
    right: -24,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  message: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  subMessage: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  }
});
