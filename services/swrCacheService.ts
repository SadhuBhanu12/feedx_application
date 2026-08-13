/**
 * Stale-While-Revalidate (SWR) Caching & Request Deduplication Engine
 * Renders cached data instantly (< 10ms), revalidates in the background, and updates UI safely.
 */

interface CacheRecord<T> {
  data: T;
  timestamp: number;
}

class SWRCacheService {
  private cache: Map<string, CacheRecord<any>> = new Map();
  private inFlightPromises: Map<string, Promise<any>> = new Map();

  /**
   * Execute query with Stale-While-Revalidate pattern
   */
  async executeSWR<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: {
      onRevalidated?: (freshData: T) => void;
      maxAgeMs?: number; // e.g. 5 minutes
    }
  ): Promise<{ data: T | null; isStale: boolean }> {
    const cached = this.cache.get(key);
    const now = Date.now();
    const maxAge = options?.maxAgeMs || 300000; // 5 minutes default

    if (cached) {
      const isStale = now - cached.timestamp > maxAge;

      // Trigger background revalidation if stale or missing
      this.revalidateInBackground(key, fetcher, options?.onRevalidated);

      return { data: cached.data, isStale };
    }

    // No cached data: execute fetcher synchronously
    const freshData = await this.revalidateInBackground(key, fetcher, options?.onRevalidated);
    return { data: freshData, isStale: false };
  }

  /**
   * Deduplicated background revalidation
   */
  private async revalidateInBackground<T>(
    key: string,
    fetcher: () => Promise<T>,
    onRevalidated?: (data: T) => void
  ): Promise<T> {
    if (this.inFlightPromises.has(key)) {
      return this.inFlightPromises.get(key) as Promise<T>;
    }

    const promise = (async () => {
      try {
        const freshData = await fetcher();
        if (freshData !== null && freshData !== undefined) {
          this.cache.set(key, { data: freshData, timestamp: Date.now() });
          if (onRevalidated) {
            onRevalidated(freshData);
          }
        }
        return freshData;
      } finally {
        this.inFlightPromises.delete(key);
      }
    })();

    this.inFlightPromises.set(key, promise);
    return promise;
  }

  /**
   * Invalidate cache entry or prefix
   */
  invalidate(keyOrPrefix: string): void {
    for (const key of this.cache.keys()) {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all SWR cache
   */
  clear(): void {
    this.cache.clear();
    this.inFlightPromises.clear();
  }
}

export const swrCache = new SWRCacheService();
