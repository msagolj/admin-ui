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
import StatusResponseDisplay from '../components/response/StatusResponseDisplay';
import JobResourceInputs from '../components/JobResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/response/ResponseDisplay';

const JobStatusDetails: React.FC = () => {
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
      url: `https://admin.hlx.page/job/${owner}/${repo}/${ref}/${topic}/${jobName}/details`,
      method: 'GET',
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
        title="Job Status Details"
        description="Returns detailed status information for a specific job, including progress and data."
        helpUrl="https://www.aem.live/docs/admin.html#tag/job/operation/getJobDetails"
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
                helperText="Name of the job to get detailed status for"
              />
            </Box>
            <ApiUrlDisplay
              method="GET"
              url={`https://admin.hlx.page/job/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${topic || '{topic}'}/${jobName || '{jobName}'}/details`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading || !jobName}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Get Job Status Details
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

export default JobStatusDetails; 