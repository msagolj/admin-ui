import { ApiError } from './errorUtils';

export async function apiCall(
  requestDetails: any
): Promise<{ status: number, responseData: any}> {
  const token = localStorage.getItem('authToken');

  // Add tokens to requestDetails.headers
  requestDetails.headers = {
    'content-type': 'application/json',
    ...(token && { 
      'x-auth-token': token
    }),
    ...requestDetails.headers,
  };
  
  // Extract just the path part from the URL
  const urlPath = requestDetails.url.replace('https://admin.hlx.page', '');
  
  // Always use proxy URL
  const baseUrl = '/api';
  // Ensure we have a single leading slash
  const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  const fullUrl = `${baseUrl}${cleanPath}`;

  try {
    const response = await fetch(fullUrl, {
      method: requestDetails.method,
      headers: requestDetails.headers,
      credentials: 'include',
      mode: 'cors',
      ...(requestDetails.body && { body: JSON.stringify(requestDetails.body) })
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      const errorHeaders = {
        errorCode: response.headers.get('x-error-code'),
        error: response.headers.get('x-error'),
      };
      throw new ApiError(errorMessage, response.status, errorHeaders);
    }

    // For 204 responses, return empty data
    if (response.status === 204) {
      return { status: 204, responseData: {} };
    }
    // some api calls return no data (eg. purge live cache), so we need to handle that
    let data = {};
    try {
      data = await response.json();
    } catch (e) {
      console.warn('Response could not be parsed as JSON:', e);
    }
    return { status: response.status, responseData: data};
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