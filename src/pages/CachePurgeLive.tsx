import React from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/response/ResponseDisplay';
import { RequestDetails, ADMIN_API_BASE } from '../types';

const CachePurgeLive: React.FC = () => {
  const { owner, site, ref, path } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset, requestDetails } = useFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `${ADMIN_API_BASE}/cache/${owner}/${site}/${ref}/${path}`,
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
        title="Purge Live Cache"
        description={
          <>
            Purges the resource from the respective live CDN. It optionally invokes the BYO CDN purging hook, if configured.
          </>
        }
        helpUrl="https://www.aem.live/docs/admin.html#tag/cache/operation/purgeCache"
        icon={CachedIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs />
            <ApiUrlDisplay
              method="POST"
              url={`${ADMIN_API_BASE}/cache/${owner || '{owner}'}/${site || '{site}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              color="warning"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Purge Live Cache
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
    </Box>
  );
};

export default CachePurgeLive; 