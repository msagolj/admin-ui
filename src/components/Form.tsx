import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { apiCall } from '../utils/api';
import { useResource } from '../context/ResourceContext';
import { useResponseCache } from '../context/ResponseCacheContext';
import { useSnackbar } from '../context/SnackbarContext';
import { RequestDetails } from '../types';
import { isAuthenticationError } from '../utils/errorUtils';

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const useFormState = () => {
  const { pathname } = useLocation();
  const cache = useResponseCache();
  const { showSuccess, showWarning } = useSnackbar();
  const cached = cache.get(pathname);

  const [status, setStatus] = useState<number | null>(cached?.status ?? null);
  const [responseData, setResponseData] = useState<any>(cached?.responseData ?? null);
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(cached?.requestDetails ?? null);
  const [jobLink, setJobLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  const { updateHistory } = useResource();

  const executeSubmit = async (details: RequestDetails) => {
    setRequestDetails(details);
    setLoading(true);
    clearError();
    setStatus(null);
    setResponseData(null);
    setJobLink(null);
    try {
      if (!details) return;
      const { status, responseData } = await apiCall(details);
      setStatus(status);
      setResponseData(responseData);

      // Cache the successful response
      cache.set(pathname, { status, responseData, requestDetails: details });

      // Handle 202 response with job state
      if (status === 202 && responseData?.job?.state === 'created' && responseData?.links?.self) {
        setJobLink(responseData.links.self);
      } else {
        setJobLink(null);
      }

      // Update history only on successful API call
      if (status >= 200 && status < 300) {
        updateHistory();
        // Show success toast for mutating operations
        const method = details.method.toUpperCase();
        if (method !== 'GET') {
          showSuccess(`${method} request completed successfully`);
        }
      }
    } catch (err) {
      // Show auth prompt for 401 errors
      if (isAuthenticationError(err)) {
        showWarning('Session expired \u2014 please re-authenticate in Settings');
      }
      handleError(err, 'Form Submission');
      setStatus(null);
      setResponseData(null);
      setJobLink(null);
      cache.remove(pathname);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStatus(null);
    setResponseData(null);
    setRequestDetails(null);
    setJobLink(null);
    clearError();
    cache.remove(pathname);
  };

  return {
    status,
    responseData,
    requestDetails,
    jobLink,
    error,
    loading,
    executeSubmit,
    reset
  };
};

const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return (
    <Box component="form" onSubmit={onSubmit}>
      {children}
    </Box>
  );
};

export { useFormState };
export default Form;
