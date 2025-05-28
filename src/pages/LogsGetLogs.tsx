import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Typography,
  FormControlLabel,
  Switch
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import LogsDisplay from '../components/response/LogsDisplay';

const LogsGetLogs: React.FC = () => {
  const { owner, repo, ref } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  // Time range selection
  const [useTimeRange, setUseTimeRange] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [since, setSince] = useState('15m');
  const [nextToken, setNextToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams: Record<string, string> = {};
    
    if (useTimeRange) {
      if (fromDate) queryParams.from = fromDate;
      if (toDate) queryParams.to = toDate;
    } else {
      queryParams.since = since;
    }
    
    if (nextToken) {
      queryParams.nextToken = nextToken;
    }

    const details = {
      url: `https://admin.hlx.page/log/${owner}/${repo}/${ref}`,
      method: 'GET',
      headers: {},
      queryParams,
      body: null,
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  const handleLoadMore = () => {
    if (responseData?.links?.next) {
      setNextToken(responseData.nextToken || '');
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Get Logs"
        description="Returns logs for a project. If there are more logs for the timespan specified, there will be a next link in the response to load the next batch."
        helpUrl="https://www.aem.live/docs/admin.html#tag/log/operation/getLogs"
        icon={HistoryIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs hidePath={true} />
            
            <FormControlLabel
              control={
                <Switch
                  checked={useTimeRange}
                  onChange={(e) => setUseTimeRange(e.target.checked)}
                />
              }
              label="Use time range"
            />

            {useTimeRange ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="From"
                  type="datetime-local"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="To"
                  type="datetime-local"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            ) : (
              <TextField
                label="Since"
                value={since}
                onChange={(e) => setSince(e.target.value)}
                helperText="Time span to retrieve logs for (e.g., 5m, 1h, 1d)"
                fullWidth
              />
            )}

            <ApiUrlDisplay
              method="GET"
              url={`https://admin.hlx.page/log/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}`}
            />

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Get Logs
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={() => {
          reset();
          setRequestDetails(null);
        }}
        requestDetails={requestDetails}
      />

      {status && (
        <LogsDisplay
          responseData={responseData}
          requestDetails={requestDetails}
          responseStatus={status}
        />
      )}

      {responseData?.links?.next && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default LogsGetLogs;
