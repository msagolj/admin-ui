import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ConfirmDialog from '../components/ConfirmDialog';
import ResponseDisplay from '../components/response/ResponseDisplay';
import JobPolling from 'components/JobPolling';
import { RequestDetails, ADMIN_API_BASE } from '../types';

const IndexRemoveResource: React.FC = () => {
  const { owner, site, ref, path } = useResource();
  const { status, responseData, jobLink, error, loading, executeSubmit, reset, requestDetails } = useFormState();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    const details = {
      url: `${ADMIN_API_BASE}/index/${owner}/${site}/${ref}/${path}`,
      method: 'DELETE',
      headers: {},
      queryParams: {},
      body: {}
    };
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Remove from Index"
        description={
          <>
            Removes a resource from the search index.
          </>
        }
        helpUrl="https://www.aem.live/docs/admin.html#tag/index/operation/indexRemovePage"
        icon={SearchIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs />
            <ApiUrlDisplay
              method="DELETE"
              url={`${ADMIN_API_BASE}/index/${owner || '{owner}'}/${site || '{site}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Remove from Index
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

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Remove from Index"
        message="Are you sure you want to proceed? This action cannot be undone."
        confirmLabel="Remove from Index"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default IndexRemoveResource; 