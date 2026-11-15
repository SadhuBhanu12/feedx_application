
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

let nativeStorage: any = null;
let isMMKVAvailable = false;

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  (Constants as any).appOwnership === 'expo';

if (!isExpoGo && Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MMKV } = require('react-native-mmkv');
    nativeStorage = new MMKV();
    isMMKVAvailable = true;
  } catch (e) {
    // Graceful fallback to AsyncStorage
  }
}

// Memory cache for synchronous fallback (Expo Go / Web)
const memoryCache: Record<string, string> = {};

export let isStorageReady = false;
export const storageReady = isMMKVAvailable
  ? Promise.resolve()
  : AsyncStorage.getAllKeys().then(async (keys) => {
      try {
        const pairs = await AsyncStorage.multiGet(keys);
        pairs.forEach(([key, val]) => {
          if (val !== null) {
            memoryCache[key] = val;
          }
        });
      } catch (err) {
        console.warn('[Storage] Failed to load AsyncStorage keys:', err);
      }
      isStorageReady = true;
    }).catch(err => {
      console.warn('[Storage] AsyncStorage getAllKeys error:', err);
      isStorageReady = true;
    });

export const storage = {
  set: (key: string, value: string | boolean | number) => {
    const stringValue = String(value);
    if (isMMKVAvailable && nativeStorage) {
      nativeStorage.set(key, value);
    } else {
      memoryCache[key] = stringValue;
      AsyncStorage.setItem(key, stringValue).catch(err => console.warn('[Storage] Fallback save failed:', err));
    }
  },
  getString: (key: string): string | undefined => {
    if (isMMKVAvailable && nativeStorage) {
      return nativeStorage.getString(key);
    }
    return memoryCache[key];
  },
  getNumber: (key: string): number | undefined => {
    if (isMMKVAvailable && nativeStorage) {
      return nativeStorage.getNumber(key);
    }
    const val = memoryCache[key];
    return val !== undefined ? Number(val) : undefined;
  },
  getBoolean: (key: string): boolean | undefined => {
    if (isMMKVAvailable && nativeStorage) {
      return nativeStorage.getBoolean(key);
    }
    const val = memoryCache[key];
    return val !== undefined ? val === 'true' : undefined;
  },
  remove: (key: string) => {
    if (isMMKVAvailable && nativeStorage) {
      nativeStorage.delete(key);
    } else {
      delete memoryCache[key];
      AsyncStorage.removeItem(key).catch(err => console.warn('[Storage] Fallback delete failed:', err));
    }
  },
  clearAll: () => {
    if (isMMKVAvailable && nativeStorage) {
      nativeStorage.clearAll();
    } else {
      Object.keys(memoryCache).forEach(k => delete memoryCache[k]);
      AsyncStorage.clear().catch(err => console.warn('[Storage] Fallback clear failed:', err));
    }
  }
};

export const mmkvStorage = {
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  getItem: async (name: string) => {
    await storageReady;
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};


