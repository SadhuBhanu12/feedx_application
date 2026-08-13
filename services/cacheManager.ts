import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs: number = 300000 // 5 minutes default TTL
  ): Promise<T> {
    const now = Date.now();

    // 1. Check Memory Cache
    const memItem = this.memoryCache.get(key);
    if (memItem && now - memItem.timestamp < ttlMs) {
      return memItem.data;
    }

    // 2. Request Deduplication (reuse pending fetch if already in flight)
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // 3. Execute Fetch
    const promise = (async () => {
      try {
        const freshData = await fetchFn();
        this.memoryCache.set(key, { data: freshData, timestamp: Date.now() });

        // Save asynchronously to AsyncStorage for warm starts
        AsyncStorage.setItem(`@feedx_cache_${key}`, JSON.stringify({ data: freshData, timestamp: Date.now() })).catch(
          () => {}
        );

        return freshData;
      } finally {
        this.pendingRequests.delete(key);
      }
    })();

    this.pendingRequests.set(key, promise);

    // If stale memory cache exists, return stale data immediately & trigger background fetch
    if (memItem) {
      promise.catch((err) => console.warn(`[CacheManager] Background revalidation failed for ${key}:`, err));
      return memItem.data;
    }

    return promise;
  }

  set<T>(key: string, data: T): void {
    this.memoryCache.set(key, { data, timestamp: Date.now() });
    AsyncStorage.setItem(`@feedx_cache_${key}`, JSON.stringify({ data, timestamp: Date.now() })).catch(() => {});
  }

  invalidate(key: string): void {
    this.memoryCache.delete(key);
    AsyncStorage.removeItem(`@feedx_cache_${key}`).catch(() => {});
  }

  invalidatePattern(pattern: RegExp): void {
    for (const key of this.memoryCache.keys()) {
      if (pattern.test(key)) {
        this.memoryCache.delete(key);
        AsyncStorage.removeItem(`@feedx_cache_${key}`).catch(() => {});
      }
    }
  }

  clear(): void {
    this.memoryCache.clear();
    this.pendingRequests.clear();
  }
}

export const cacheManager = new CacheManager();
