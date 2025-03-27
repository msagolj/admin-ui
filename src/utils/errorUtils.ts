export interface ErrorDetails {
  message: string;
  status?: number;
  details?: string;
  errorHeaders?: {
    errorCode?: string | null;
    error?: string | null;
  };
  type?: 'API' | 'NETWORK' | 'VALIDATION' | 'UNKNOWN';
}

export class ApiError extends Error {
  status: number;
  details?: string;
  errorHeaders?: {
    errorCode?: string | null;
    error?: string | null;
  };
  type: 'API' | 'NETWORK' | 'VALIDATION' | 'UNKNOWN';

  constructor(
    message: string, 
    status: number, 
    errorHeaders?: { errorCode?: string | null; error?: string | null },
    type: 'API' | 'NETWORK' | 'VALIDATION' | 'UNKNOWN' = 'API'
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorHeaders = errorHeaders;
    this.type = type;
  }
}

export function parseApiError(error: unknown): ErrorDetails {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
      details: error.details,
      errorHeaders: error.errorHeaders,
      type: error.type
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 0,
      details: error.stack,
      errorHeaders: undefined,
      type: 'UNKNOWN'
    };
  }
  return {
    message: 'An unknown error occurred',
    status: 0,
    details: undefined,
    errorHeaders: undefined,
    type: 'UNKNOWN'
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export function isAuthenticationError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401;
  }
  return false;
}

export function isRateLimitError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 429;
  }
  return false;
}

export function isNotFoundError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 404;
  }
  return false;
}

export function isServerError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status >= 500;
  }
  return false;
} 