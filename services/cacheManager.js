import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'feedx:cache:';

export async function getCachedData(key, fetcher, ttlMs = 5 * 60 * 1000) {
  const cacheKey = CACHE_PREFIX + key;
  try {
    const raw = await AsyncStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      const age = Date.now() - parsed.timestamp;
      if (age < ttlMs) {
        // Cache is fresh, return it immediately
        return parsed.data;
      }
      
      // Cache is stale, launch fetcher in background to update cache silently
      // and return the stale data immediately for zero loading wait!
      fetcher()
        .then(async (freshData) => {
          if (freshData !== null && freshData !== undefined) {
            await AsyncStorage.setItem(
              cacheKey,
              JSON.stringify({ data: freshData, timestamp: Date.now() })
            );
          }
        })
        .catch((err) => {
          console.warn(`[CacheManager] Background refresh failed for key ${key}:`, err);
        });
        
      return parsed.data;
    }
  } catch (err) {
    console.warn(`[CacheManager] Error reading cache for key ${key}:`, err);
  }

  // Cache miss or read failed, perform synchronous fetch
  const freshData = await fetcher();
  try {
    if (freshData !== null && freshData !== undefined) {
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({ data: freshData, timestamp: Date.now() })
      );
    }
  } catch (err) {
    console.warn(`[CacheManager] Error writing cache for key ${key}:`, err);
  }
  return freshData;
}

export async function forceRefresh(key, fetcher) {
  const cacheKey = CACHE_PREFIX + key;
  const freshData = await fetcher();
  try {
    if (freshData !== null && freshData !== undefined) {
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({ data: freshData, timestamp: Date.now() })
      );
    }
  } catch (err) {
    console.warn(`[CacheManager] Error force-refreshing cache for key ${key}:`, err);
  }
  return freshData;
}

export async function clearCache(key) {
  const cacheKey = CACHE_PREFIX + key;
  try {
    await AsyncStorage.removeItem(cacheKey);
  } catch (err) {
    console.warn(`[CacheManager] Error clearing cache for key ${key}:`, err);
  }
}

export async function clearAllCaches() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch (err) {
    console.warn('[CacheManager] Error clearing all caches:', err);
  }
}
