import { storage, storageReady } from '@/store/storage';
import { dehydrate, hydrate, QueryClient } from '@tanstack/react-query';

const CACHE_KEY = 'REACT_QUERY_OFFLINE_CACHE';
let persistTimeout: ReturnType<typeof setTimeout> | null = null;

export async function persistQueryClient(queryClient: QueryClient) {
  try {
    await storageReady;
    const dehydratedState = dehydrate(queryClient);
    storage.set(CACHE_KEY, JSON.stringify(dehydratedState));
  } catch (error) {
    console.warn('[QueryPersist] Failed to persist query client:', error);
  }
}

export async function restoreQueryClient(queryClient: QueryClient) {
  try {
    await storageReady;
    const cachedString = storage.getString(CACHE_KEY);
    if (cachedString) {
      const dehydratedState = JSON.parse(cachedString);
      hydrate(queryClient, dehydratedState);
      console.log('[QueryPersist] Cache successfully restored offline.');
    }
  } catch (error) {
    console.warn('[QueryPersist] Failed to restore query client:', error);
  }
}

export function setupQueryPersistence(queryClient: QueryClient) {
  // Restore cache on launch
  restoreQueryClient(queryClient);

  // Subscribe to updates to persist changes (debounced by 2 seconds)
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'updated' && event.query.state.status === 'success') {
      if (persistTimeout) clearTimeout(persistTimeout);
      persistTimeout = setTimeout(() => {
        persistQueryClient(queryClient);
      }, 2000);
    }
  });
}
