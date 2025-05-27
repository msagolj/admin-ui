import React, { useState, useEffect, useRef } from 'react';
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

interface JobPollingProps {
  jobLink: string | null;
  onJobComplete?: (results: any) => void;
}

const JobPolling: React.FC<JobPollingProps> = ({ jobLink, onJobComplete }) => {
  const [pollingRequestDetails, setPollingRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);
  const [jobResultsRequestDetails, setJobResultsRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);
  const [pollingResponse, setPollingResponse] = useState<any>(null);
  const [pollingStatus, setPollingStatus] = useState<number | null>(null);
  const [jobResults, setJobResults] = useState<any>(null);
  const [jobResultsStatus, setJobResultsStatus] = useState<number | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingCountRef = useRef<number>(0);
  const { error, handleError, clearError } = useErrorHandler();

  // Start polling when jobLink changes
  useEffect(() => {
    if (jobLink) {
      pollJobStatus();
    }
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [jobLink]);

  const pollJobStatus = () => {
    if (!jobLink) return;
    setIsPolling(true);
    const details = {
      url: jobLink,
      method: 'GET',
      headers: {},
      queryParams: {},
      body: null
    };
    setPollingRequestDetails(details);
    makePollingApiCall(details);
  };

  const makePollingApiCall = async (pollingRequestDetails: any) => {
    try {
      if (!pollingRequestDetails) return;
      const {status, responseData} = await apiCall(pollingRequestDetails);
      setPollingStatus(status);
      setPollingResponse(responseData);
      
      // Increment polling count
      pollingCountRef.current += 1;
      
      // If job is not stopped and we haven't reached max polls, keep polling
      if (responseData?.state !== 'stopped' && pollingCountRef.current < 60) {
        pollingTimeoutRef.current = setTimeout(pollJobStatus, 1000); // Poll every 1 second
      } else {
        setIsPolling(false);
        // If job is stopped, fetch the results
        if (responseData?.state === 'stopped' && responseData?.links?.details) {
          fetchJobResults(responseData.links.details);
        }
      }
    } catch (err) {
      handleError(err, 'Job Status Polling');
      setIsPolling(false);
    }
  };

  const fetchJobResults = (detailsUrl: string) => {
    setJobResultsRequestDetails({
      url: detailsUrl,
      method: 'GET',
      headers: {},
      queryParams: {},
      body: null
    });
  };

  useEffect(() => {
    if (jobResultsRequestDetails) {
      makeJobResultsApiCall();
    }
  }, [jobResultsRequestDetails]);

  const makeJobResultsApiCall = async () => {
    try {
      if (!jobResultsRequestDetails) return;
      const {status, responseData} = await apiCall(jobResultsRequestDetails);
      setJobResultsStatus(status);
      setJobResults(responseData);
      if (onJobComplete) {
        onJobComplete(responseData);
      }
    } catch (err) {
      handleError(err, 'Fetching Job Results');
    }
  };

  // Reset polling count and state when job link changes
  useEffect(() => {
    pollingCountRef.current = 0;
    setIsPolling(false);
  }, [jobLink]);

  const handleContinuePolling = () => {
    pollingCountRef.current = 0;
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
                    (Poll {pollingCountRef.current}/60)
                  </Typography>
                </>
              )}
              {!isPolling && pollingCountRef.current >= 60 && (
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