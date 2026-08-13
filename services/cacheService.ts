/**
 * Centralized High-Performance In-Memory Cache & Request Deduplicator
 * Designed for 10,000+ Concurrent Users on FEEDX
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();

  /**
   * Fetch with automatic deduplication & TTL caching
   */
  async fetchWithCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs: number = 60000 // Default 1 minute TTL
  ): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && cached.expiry > now) {
      return cached.data;
    }

    // Deduplicate in-flight promises
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    const requestPromise = (async () => {
      try {
        const data = await fetchFn();
        if (data !== null && data !== undefined) {
          this.cache.set(key, { data, expiry: Date.now() + ttlMs });
        }
        return data;
      } finally {
        this.pendingRequests.delete(key);
      }
    })();

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }

  /**
   * Invalidate specific cache key or wildcard prefix
   */
  invalidate(keyOrPrefix: string): void {
    for (const key of this.cache.keys()) {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire memory cache
   */
  clearAll(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export const memoryCache = new CacheService();
