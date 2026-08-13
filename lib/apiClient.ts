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
    timeout = 10000,
    retry = 2,
    retryDelay = 1000,
    dedupe = isGet,
    ...fetchOptions
  } = options;

  // Deduplication logic for GET requests
  const requestKey = dedupe && isGet ? `${url}-${JSON.stringify(fetchOptions.headers)}` : null;

  if (requestKey && IN_FLIGHT_REQUESTS.has(requestKey)) {
    return IN_FLIGHT_REQUESTS.get(requestKey)!.then(res => res.clone());
  }

  const isAuthRequest = url.includes('/auth/v1/');
  const maxRetries = isAuthRequest ? 0 : retry;

  const executeFetch = async (attempt: number): Promise<Response> => {
    // Check network status before fetching
    const netState = await NetInfo.fetch();
    if (netState.isConnected === false) {
      throw new Error('Network request failed: Offline');
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(id);
      
      // Don't retry on 4xx errors
      if (!response.ok && response.status >= 500) {
        throw new Error(`Server Error: ${response.status}`);
      }
      return response;
    } catch (error: any) {
      clearTimeout(id);
      
      const isAbortError = error.name === 'AbortError';
      if (attempt < maxRetries && (!isAbortError || retry > 0)) {
        // Exponential backoff
        await sleep(retryDelay * Math.pow(2, attempt));
        return executeFetch(attempt + 1);
      }
      throw error;
    }
  };

  const promise = executeFetch(0);

  if (requestKey) {
    IN_FLIGHT_REQUESTS.set(requestKey, promise);
    promise.finally(() => IN_FLIGHT_REQUESTS.delete(requestKey));
  }

  return promise;
}
