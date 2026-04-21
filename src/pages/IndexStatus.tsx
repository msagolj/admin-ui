import React from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/response/ResponseDisplay';
import JobPolling from 'components/JobPolling';
import StatusResponseDisplay from '../components/response/StatusResponseDisplay';
import { RequestDetails, ADMIN_API_BASE } from '../types';

const StatusIndex: React.FC = () => {
  const { owner, site, ref, path } = useResource();
  const { status, responseData, jobLink, error, loading, executeSubmit, reset, requestDetails } = useFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `${ADMIN_API_BASE}/index/${owner}/${site}/${ref}/${path}`,
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
        title="Index Status"
        description="Returns the index status of the respective resource."
        helpUrl="https://www.aem.live/docs/admin.html#tag/index/operation/getIndexStatus"
        icon={SearchIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs />
            <ApiUrlDisplay
              method="GET"
              url={`${ADMIN_API_BASE}/index/${owner || '{owner}'}/${site || '{site}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Check Index Status
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
        <ResponseDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}

      {jobLink && (
        <JobPolling jobLink={jobLink} />
      )}
    </Box>
  );
};

export default StatusIndex; 