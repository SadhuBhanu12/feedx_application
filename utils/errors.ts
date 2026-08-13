export class AppError extends Error {
  public code: string;
  public status?: number;
  public details?: any;

  constructor(message: string, code: string, status?: number, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred. Please check your connection.', details?: any) {
    super(message, 'NETWORK_ERROR', 0, details);
    this.name = 'NetworkError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed. Please log in again.', details?: any) {
    super(message, 'AUTH_ERROR', 401, details);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found.', details?: any) {
    super(message, 'NOT_FOUND_ERROR', 404, details);
    this.name = 'NotFoundError';
  }
}

export function handleSupabaseError(error: any, context: string): never {
  console.error(`[Supabase Error] ${context}:`, error);

  if (error?.status === 401 || error?.code === 'PGRST301') {
    throw new AuthError('Session expired. Please log in again.', error);
  }

  if (error?.status === 406 || error?.code === 'PGRST116') {
    throw new NotFoundError('Requested data not found.', error);
  }

  if (error?.message?.toLowerCase().includes('network') || error?.message?.toLowerCase().includes('fetch')) {
    throw new NetworkError('Failed to connect to the server.', error);
  }

  throw new AppError(error?.message || 'An unexpected error occurred.', error?.code || 'UNKNOWN_ERROR', error?.status, error);
}
