import { useQuery , useInfiniteQuery } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getDashboard, getAdminStats, getAdminAnalyticsDetail, getBookmarkedItems, getStudentTimetable, getBookmarks , getResourcesForStudent } from '@/services/supabaseService';

export function useRefreshOnFocus<T>(refetch: () => Promise<T> | any, _isStale?: boolean) {
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
}

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes fresh data cache

export const useDashboardQuery = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => getDashboard(userId),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME,
  });
  useRefreshOnFocus(query.refetch, query.isStale);
  return query;
};

export const useAdminStatsQuery = (isAdmin: boolean) => {
  const query = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => getAdminStats(),
    enabled: !!isAdmin,
    staleTime: DEFAULT_STALE_TIME,
  });
  useRefreshOnFocus(query.refetch, query.isStale);
  return query;
};

export const useAdminAnalyticsQuery = (isAdmin: boolean) => {
  const query = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: () => getAdminAnalyticsDetail(),
    enabled: !!isAdmin,
    staleTime: DEFAULT_STALE_TIME,
  });
  useRefreshOnFocus(query.refetch, query.isStale);
  return query;
};

export const useBookmarksQuery = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: () => getBookmarkedItems(userId),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME,
  });
  useRefreshOnFocus(query.refetch, query.isStale);
  return query;
};

export const useRawBookmarksQuery = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['raw_bookmarks', userId],
    queryFn: () => getBookmarks(userId),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME,
  });
  useRefreshOnFocus(query.refetch, query.isStale);
  return query;
};

export const useSupabaseList = (table: string, select = '*', options: any = {}) => {
  return useQuery({
    queryKey: [table, options],
    queryFn: async () => {
      let query = supabase.from(table).select(select);
      
      if (options.eq) {
        Object.entries(options.eq).forEach(([key, val]) => {
          query = query.eq(key, val);
        });
      }
      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending });
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: DEFAULT_STALE_TIME,
    ...options.queryOptions,
  });
};

export const useResourcesInfiniteQuery = (user: any, search: string, filters: any) => {
  const query = useInfiniteQuery({
    queryKey: ['resources', user?.id, search, filters.resource_type],
    queryFn: async ({ pageParam = 1 }) => {
      return getResourcesForStudent(user, pageParam, 20, search, filters);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    enabled: !!user?.id,
    staleTime: DEFAULT_STALE_TIME,
  });
  useRefreshOnFocus(query.refetch, query.isStale);
  return query;
};

export const useTasksQuery = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['tasks', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, user_id, title, status, priority, due_date, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME,
  });
  useRefreshOnFocus(query.refetch, query.isStale);
  return query;
};


export const useStudentTimetableQuery = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['student_timetable', userId],
    queryFn: () => getStudentTimetable(userId),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME,
  });
  useRefreshOnFocus(query.refetch, query.isStale);
  return query;
};
