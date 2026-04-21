import React from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import JobListDisplay from '../components/response/JobListDisplay';
import JobResourceInputs from '../components/JobResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import { RequestDetails, ADMIN_API_BASE } from '../types';

const JobList: React.FC = () => {
  const { owner, site, ref, topic } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset, requestDetails } = useFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `${ADMIN_API_BASE}/job/${owner}/${site}/${ref}/${topic}`,
      method: 'GET',
      headers: {},
      queryParams: {},
      body: null,
    };
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Job List"
        description="Returns the job list of jobs for the specified repository and topic."
        helpUrl="https://www.aem.live/docs/admin.html#tag/job/operation/getJobList"
        icon={WorkIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <JobResourceInputs />
            <ApiUrlDisplay
              method="GET"
              url={`${ADMIN_API_BASE}/job/${owner || '{owner}'}/${site || '{site}'}/${ref || '{ref}'}/${topic || '{topic}'}`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Get Job List
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={reset}
        requestDetails={requestDetails}
      />

      {status && (
        <JobListDisplay
          responseData={responseData}
          requestDetails={requestDetails}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default JobList; 