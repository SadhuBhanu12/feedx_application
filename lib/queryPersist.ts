import { storage, storageReady } from '@/store/storage';
import { dehydrate, hydrate, QueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';

function getCacheKey(userId?: string | null): string {
  const uid = userId || useAuthStore.getState().user?.id || 'anonymous';
  return `REACT_QUERY_CACHE_V3_${uid}`;
}

let persistTimeout: ReturnType<typeof setTimeout> | null = null;

export async function persistQueryClient(queryClient: QueryClient, userId?: string | null) {
  try {
    await storageReady;
    const currentUserId = userId || useAuthStore.getState().user?.id;
    if (!currentUserId) return; // Don't persist sensitive queries if no authenticated user
    const dehydratedState = dehydrate(queryClient, {
      shouldDehydrateQuery: (query) => {
        // Only dehydrate successful queries that are not explicitly marked as private/temporary
        return query.state.status === 'success';
      },
    });
    storage.set(getCacheKey(currentUserId), JSON.stringify(dehydratedState));
  } catch (error) {
    console.warn('[QueryPersist] Failed to persist query client:', error);
  }
}

export async function restoreQueryClient(queryClient: QueryClient, userId?: string | null) {
  try {
    await storageReady;
    const currentUserId = userId || useAuthStore.getState().user?.id;
    if (!currentUserId) return;
    const cachedString = storage.getString(getCacheKey(currentUserId));
    if (cachedString) {
      const dehydratedState = JSON.parse(cachedString);
      hydrate(queryClient, dehydratedState);
      console.log(`[QueryPersist] Cache successfully restored for user: ${currentUserId}`);
    }
  } catch (error) {
    console.warn('[QueryPersist] Failed to restore query client:', error);
  }
}

export function clearUserQueryCache(userId?: string | null) {
  try {
    const currentUserId = userId || useAuthStore.getState().user?.id;
    if (currentUserId) {
      storage.remove(getCacheKey(currentUserId));
    }
    // Also remove global legacy keys
    storage.remove('REACT_QUERY_OFFLINE_CACHE');
    storage.remove('REACT_QUERY_OFFLINE_CACHE_V2');
  } catch (_) {}
}

export function setupQueryPersistence(queryClient: QueryClient) {
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

