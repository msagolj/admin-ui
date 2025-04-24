import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { apiCall } from '../utils/api';
import { useResource } from '../context/ResourceContext';

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const useFormState = () => {
  const [status, setStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [jobLink, setJobLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  const { updateHistory } = useResource();

  const executeSubmit = async (requestDetails: any) => {
    setLoading(true);
    clearError();
    setStatus(null);
    setResponseData(null);
    setJobLink(null);
    try {
      if (!requestDetails) return;
      const { status, responseData } = await apiCall(requestDetails);
      setStatus(status);
      setResponseData(responseData);
      
      // Handle 202 response with job state
      if (status === 202 && responseData?.job?.state === 'created' && responseData?.links?.self) {
        setJobLink(responseData.links.self);
      } else {
        setJobLink(null);
      }

      // Update history only on successful API call
      if (status >= 200 && status < 300) {
        updateHistory();
      }
    } catch (err) {
      handleError(err, 'Form Submission');
      setStatus(null);
      setResponseData(null);
      setJobLink(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStatus(null);
    setResponseData(null);
    setJobLink(null);
    clearError();
  };

  return {
    status,
    responseData,
    jobLink,
    error,
    loading,
    executeSubmit,
    reset
  };
};

const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  const formState = useFormState();

  return (
    <Box component="form" onSubmit={onSubmit}>
      {children}
    </Box>
  );
};

export { useFormState };
export default Form; 