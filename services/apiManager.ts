import { cacheManager } from './cacheManager';

interface RequestOptions {
  timeoutMs?: number;
  retries?: number;
  useCache?: boolean;
  ttlMs?: number;
  cacheKey?: string;
}

export class ApiManager {
  private activeSubscriptions = new Set<string>();

  /**
   * Execute an async database query with timeout protection, request deduplication, and caching.
   */
  async execute<T>(
    operationKey: string,
    queryFn: () => Promise<T>,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeoutMs = 12000, retries = 2, useCache = true, ttlMs = 180000, cacheKey } = options;
    const key = cacheKey || operationKey;

    const fetchWithTimeout = async (): Promise<T> => {
      let attempt = 0;
      while (attempt <= retries) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Request timeout for ${operationKey}`)), timeoutMs)
          );
          return await Promise.race([queryFn(), timeoutPromise]);
        } catch (err: any) {
          attempt++;
          if (attempt > retries || err?.status === 401 || err?.status === 403) {
            throw err;
          }
          const backoff = 500 * Math.pow(2, attempt - 1);
          await new Promise((res) => setTimeout(res, backoff));
        }
      }
      throw new Error(`Execution failed after ${retries} retries.`);
    };

    if (useCache) {
      return cacheManager.getOrFetch<T>(key, fetchWithTimeout, ttlMs);
    }

    return fetchWithTimeout();
  }

  /**
   * Track realtime subscriptions to prevent memory leaks and duplicate handlers.
   */
  registerSubscription(id: string): boolean {
    if (this.activeSubscriptions.has(id)) {
      return false; // Already subscribed
    }
    this.activeSubscriptions.add(id);
    return true;
  }

  unregisterSubscription(id: string): void {
    this.activeSubscriptions.delete(id);
  }

  clearSubscriptions(): void {
    this.activeSubscriptions.clear();
  }
}

export const apiManager = new ApiManager();
