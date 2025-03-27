import { useAuth } from '../context/AuthContext';
import { ApiError } from './errorUtils';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T }> {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'x-auth-token': token }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.log(response.headers.get('x-error-code'))
      const errorHeaders = {
        errorCode: response.headers.get('x-error-code'),
        error: response.headers.get('x-error'),
      };
      throw new ApiError(errorMessage, response.status, errorHeaders);
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    if (err instanceof Error) {
      throw new ApiError(err.message, 0);
    }
    throw new ApiError('An unknown error occurred', 0);
  }
} 