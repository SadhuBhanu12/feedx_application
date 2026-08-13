import { supabase } from '@/lib/supabase';

// 15 seconds default timeout
const DEFAULT_TIMEOUT_MS = 15000;

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  status: number | null;
}

/**
 * Wraps a Supabase query with a strict timeout and standardized response format.
 * Ensures the app never hangs infinitely on a loading spinner.
 */
export async function withTimeoutAndResponse<T>(
  queryPromise: PromiseLike<any>,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<ApiResponse<T>> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out. Please check your connection and try again.')), timeoutMs);
    });

    const response = await Promise.race([queryPromise, timeoutPromise]);
    
    if (response.error) {
      console.error('[API Error]:', response.error.message || response.error);
      return {
        success: false,
        data: null,
        error: response.error.message || 'An error occurred while fetching data.',
        status: response.status || 500,
      };
    }

    return {
      success: true,
      data: response.data as T,
      error: null,
      status: response.status || 200,
    };
  } catch (err: any) {
    console.error('[API Exception]:', err.message || err);
    return {
      success: false,
      data: null,
      error: err.message || 'A network exception occurred.',
      status: 0, // 0 usually implies network failure or timeout
    };
  }
}
