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
import StatusResponseDisplay from '../components/response/StatusResponseDisplay';
import Form, { useFormState } from '../components/Form';
import JobPolling from 'components/JobPolling';
import ResponseDisplay from '../components/response/ResponseDisplay';
import { RequestDetails, ADMIN_API_BASE } from '../types';

const IndexReindex: React.FC = () => {
  const { owner, site, ref, path } = useResource();
  const { status, responseData, jobLink, error, loading, executeSubmit, reset, requestDetails } = useFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `${ADMIN_API_BASE}/index/${owner}/${site}/${ref}/${path}`,
      method: 'POST',
      headers: {},
      queryParams: {},
      body: {}
    };
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Re-index Resource"
        description={
          <>
            Re-indexes a resource in the search index.
            <br />
            <strong>Note: If the last path segment is a *, it will recursively reindex all published resources below that sub tree.</strong>
          </>
        }
        helpUrl="https://www.aem.live/docs/admin.html#tag/index/operation/indexResource"
        icon={SearchIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs />
            <ApiUrlDisplay
              method="POST"
              url={`${ADMIN_API_BASE}/index/${owner || '{owner}'}/${site || '{site}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Re-index Resource
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

export default IndexReindex; 