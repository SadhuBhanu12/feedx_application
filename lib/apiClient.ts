import NetInfo from '@react-native-community/netinfo';

interface FetchOptions extends RequestInit {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  dedupe?: boolean;
}

const IN_FLIGHT_REQUESTS = new Map<string, Promise<Response>>();

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchWithRetry(url: string, options: FetchOptions = {}): Promise<Response> {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const {
    timeout = 12000,
    retry = 2,
    retryDelay = 1000,
    dedupe = false, // Disable aggressive global deduping to avoid stale cached promises in standalone native builds
    ...fetchOptions
  } = options;

  const isAuthRequest = url.includes('/auth/v1/');
  const maxRetries = isAuthRequest ? 0 : retry;

  const executeFetch = async (attempt: number): Promise<Response> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(id);
      
      // Don't retry on 4xx client errors, retry on 5xx server errors
      if (!response.ok && response.status >= 500 && attempt < maxRetries) {
        await sleep(retryDelay * Math.pow(2, attempt));
        return executeFetch(attempt + 1);
      }
      return response;
    } catch (error: any) {
      clearTimeout(id);
      
      const isAbortError = error.name === 'AbortError';
      if (attempt < maxRetries && (!isAbortError || retry > 0)) {
        await sleep(retryDelay * Math.pow(2, attempt));
        return executeFetch(attempt + 1);
      }
      throw error;
    }
  };

  return executeFetch(0);
}
