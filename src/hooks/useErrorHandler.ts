import { useState } from 'react';
import { ErrorDetails, parseApiError, getErrorMessage } from '../utils/errorUtils';

export function useErrorHandler() {
  const [error, setError] = useState<ErrorDetails | null>(null);

  const handleError = (err: unknown, context: string) => {
    const errorDetails = parseApiError(err);
    console.error(`${context} error:`, err);
    setError(errorDetails);
  };

  const clearError = () => {
    setError(null);
  };

  const getErrorDisplay = () => {
    if (!error) return null;

    return {
      message: getErrorMessage(error),
      status: error.status,
      details: error.details,
      type: error.type,
      errorHeaders: error.errorHeaders
    };
  };

  return {
    error,
    handleError,
    clearError,
    getErrorDisplay
  };
} 