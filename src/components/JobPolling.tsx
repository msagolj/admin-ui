import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { apiCall } from '../utils/api';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ResponseDisplay from './response/ResponseDisplay';
import { RequestDetails } from '../types';

interface JobPollingProps {
  jobLink: string | null;
  onJobComplete?: (results: any) => void;
}

const JobPolling: React.FC<JobPollingProps> = ({ jobLink, onJobComplete }) => {
  const [pollingRequestDetails, setPollingRequestDetails] = useState<RequestDetails | null>(null);
  const [jobResultsRequestDetails, setJobResultsRequestDetails] = useState<RequestDetails | null>(null);
  const [pollingResponse, setPollingResponse] = useState<any>(null);
  const [pollingStatus, setPollingStatus] = useState<number | null>(null);
  const [jobResults, setJobResults] = useState<any>(null);
  const [jobResultsStatus, setJobResultsStatus] = useState<number | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { error, handleError, clearError } = useErrorHandler();

  const makePollingApiCall = useCallback(async (details: RequestDetails) => {
    try {
      const { status, responseData } = await apiCall(details);
      setPollingStatus(status);
      setPollingResponse(responseData);
      setPollingCount(prev => prev + 1);

      if (responseData?.state !== 'stopped' && pollingCount < 60) {
        pollingTimeoutRef.current = setTimeout(() => {
          makePollingApiCall(details);
        }, 1000);
      } else {
        setIsPolling(false);
        if (responseData?.state === 'stopped' && responseData?.links?.details) {
          fetchJobResults(responseData.links.details);
        }
      }
    } catch (err) {
      handleError(err, 'Job Status Polling');
      setIsPolling(false);
    }
  }, [pollingCount, handleError]);

  const pollJobStatus = useCallback(() => {
    if (!jobLink) return;
    setIsPolling(true);
    const details: RequestDetails = {
      url: jobLink,
      method: 'GET',
      headers: {},
      queryParams: {},
      body: null
    };
    setPollingRequestDetails(details);
    makePollingApiCall(details);
  }, [jobLink, makePollingApiCall]);

  useEffect(() => {
    if (jobLink) {
      setPollingCount(0);
      setIsPolling(false);
      pollJobStatus();
    }
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [jobLink]);

  const fetchJobResults = (detailsUrl: string) => {
    const details: RequestDetails = {
      url: detailsUrl,
      method: 'GET',
      headers: {},
      queryParams: {},
      body: null
    };
    setJobResultsRequestDetails(details);
  };

  useEffect(() => {
    if (jobResultsRequestDetails) {
      const makeCall = async () => {
        try {
          const { status, responseData } = await apiCall(jobResultsRequestDetails);
          setJobResultsStatus(status);
          setJobResults(responseData);
          if (onJobComplete) {
            onJobComplete(responseData);
          }
        } catch (err) {
          handleError(err, 'Fetching Job Results');
        }
      };
      makeCall();
    }
  }, [jobResultsRequestDetails]);

  const handleContinuePolling = () => {
    setPollingCount(0);
    pollJobStatus();
  };

  if (!jobLink) return null;

  return (
    <Box>
      {pollingStatus && (
        <Box sx={{ mt: 2 }}>
          <Paper sx={{ p: 1, mb: 2, bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" gutterBottom>Polling Job</Typography>
              {isPolling && (
                <>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    (Poll {pollingCount}/60)
                  </Typography>
                </>
              )}
              {!isPolling && pollingCount >= 60 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleContinuePolling}
                  startIcon={<RefreshIcon />}
                >
                  Continue Polling
                </Button>
              )}
            </Box>
          </Paper>
          <ResponseDisplay
            requestDetails={pollingRequestDetails}
            responseData={pollingResponse}
            responseStatus={pollingStatus}
          />
        </Box>
      )}

      {jobResults && (
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 1, mb: 2, bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
            <Typography variant="h5" gutterBottom>Job Results</Typography>
          </Paper>
          <ResponseDisplay
            requestDetails={jobResultsRequestDetails}
            responseData={jobResults}
            responseStatus={jobResultsStatus || 200}
          />
        </Box>
      )}
    </Box>
  );
};

export default JobPolling;
