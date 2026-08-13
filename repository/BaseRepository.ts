import { handleSupabaseError, NetworkError } from '@/utils/errors';

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  baseDelayMs?: number;
}

// HARD REQUIREMENT: 10 seconds maximum timeout
const DEFAULT_TIMEOUT = 10000; 
const DEFAULT_RETRIES = 2;
const DEFAULT_DELAY = 1000;

export class BaseRepository {
  /**
   * Executes a promise with a strict timeout and AbortController for network cancellation.
   */
  protected static async withTimeout<T>(
    operation: (signal: AbortSignal) => Promise<T>, 
    ms: number = DEFAULT_TIMEOUT
  ): Promise<T> {
    const abortController = new AbortController();
    const id = setTimeout(() => abortController.abort(), ms);
    
    try {
      const result = await operation(abortController.signal);
      clearTimeout(id);
      return result;
    } catch (err: any) {
      clearTimeout(id);
      if (err.name === 'AbortError') {
        throw new NetworkError(`Request timed out after ${ms}ms`);
      }
      throw err;
    }
  }

  /**
   * Executes an operation with exponential backoff retries and timeout enforcement.
   */
  protected static async withRetry<T>(
    operation: (signal: AbortSignal) => Promise<T>,
    options: RequestOptions = {}
  ): Promise<T> {
    const { retries = DEFAULT_RETRIES, baseDelayMs = DEFAULT_DELAY, timeout = DEFAULT_TIMEOUT } = options;
    // Enforce absolute maximum of 10 seconds
    const actualTimeout = Math.min(timeout, 10000); 
    
    let attempt = 0;

    while (attempt <= retries) {
      try {
        const result = await this.withTimeout(operation, actualTimeout);
        return result;
      } catch (err: any) {
        attempt++;
        const isAuthError = err?.status === 401 || err?.status === 403 || err?.message?.toLowerCase().includes('jwt');
        
        // Do not retry auth errors or client validation errors
        if (isAuthError || attempt > retries || (err?.status >= 400 && err?.status < 500 && err?.status !== 429)) {
          handleSupabaseError(err, 'Repository Request');
        }

        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        console.warn(`[Retry] Attempt ${attempt} failed. Retrying in ${delay}ms...`, err);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new NetworkError('Max retries reached.');
  }

  /**
   * Safe execution wrapper that strictly enforces the Loading -> Success -> Error -> finally pipeline.
   */
  protected static async execute<T>(
    operation: (signal: AbortSignal) => Promise<any>, // Assume Supabase response { data, error }
    context: string,
    options?: RequestOptions
  ): Promise<T> {
    return this.withRetry(async (signal) => {
      // Supabase JS allows passing an abortSignal to .abortSignal(signal) on the query builder.
      const { data, error } = await operation(signal);
      if (error) throw error;
      return data as T;
    }, options);
  }
}
