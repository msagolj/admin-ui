import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import JobResourceInputs from '../components/JobResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/overlays/ResponseDisplay';

const JobStop: React.FC = () => {
  const { owner, repo, ref, topic, jobName, setJobName } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `https://admin.hlx.page/job/${owner}/${repo}/${ref}/${topic}/${jobName}`,
      method: 'DELETE',
      headers: {},
      queryParams: {},
      body: null,
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Stop Job"
        description="Stops a running job. Returns 204 if successful, 409 if the job cannot be stopped in its current state."
        helpUrl="https://www.aem.live/docs/admin.html#tag/job/operation/stopJob"
        icon={WorkIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <JobResourceInputs />
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Job Name"
                required
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="Job name"
                helperText="Name of the job to stop"
              />
            </Box>
            <ApiUrlDisplay
              method="DELETE"
              url={`https://admin.hlx.page/job/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${topic || '{topic}'}/${jobName || '{jobName}'}`}
            />
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={loading || !jobName}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Stop Job
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
        <ResponseDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default JobStop; 