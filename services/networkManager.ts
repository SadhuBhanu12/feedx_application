import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export type NetworkQuality = 'ONLINE' | 'SLOW_NETWORK' | 'OFFLINE';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  quality: NetworkQuality;
}

class NetworkManager {
  private listeners: Set<(state: NetworkState) => void> = new Set();
  private currentState: NetworkState = {
    isConnected: true,
    isInternetReachable: true,
    quality: 'ONLINE',
  };

  constructor() {
    NetInfo.addEventListener(this.handleNetInfoChange);
  }

  private handleNetInfoChange = (state: NetInfoState) => {
    const isConnected = !!state.isConnected;
    const isInternetReachable = state.isInternetReachable;

    let quality: NetworkQuality = 'ONLINE';
    if (!isConnected || isInternetReachable === false) {
      quality = 'OFFLINE';
    } else if (state.details && 'linkDownstreamBandwidthKbps' in state.details) {
      const kbps = (state.details as any).linkDownstreamBandwidthKbps;
      if (kbps && kbps < 150) {
        quality = 'SLOW_NETWORK';
      }
    }

    this.currentState = {
      isConnected,
      isInternetReachable,
      quality,
    };

    this.listeners.forEach((listener) => listener(this.currentState));
  };

  public getStatus(): NetworkState {
    return this.currentState;
  }

  public subscribe(listener: (state: NetworkState) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const networkManager = new NetworkManager();

export function useNetworkStatus(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>(
    networkManager.getStatus()
  );

  useEffect(() => {
    return networkManager.subscribe(setNetworkState);
  }, []);

  return networkState;
}
