import { useAuth } from '../context/AuthContext';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Accept': 'application/json',
    ...(token ? { 'x-auth-token': token } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
    statusText: response.statusText,
  };
} 