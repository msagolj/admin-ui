import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ConfirmDialog from '../components/ConfirmDialog';
import ResponseDisplay from '../components/response/ResponseDisplay';
import { RequestDetails, ADMIN_API_BASE } from '../types';

const CodeDelete: React.FC = () => {
  const { owner, site, ref, path } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset, requestDetails } = useFormState();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    const details = {
      url: `${ADMIN_API_BASE}/code/${owner}/${site}/${ref}/${path}`,
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
        title="Delete Code"
        description={
          <>
            Deletes a code resource from the code-bus It additionally purges the live cdn and the byo cdn, if configured.
            <br />
            <strong>Warning: This action cannot be undone. Please be certain before proceeding.</strong>
          </>
        }
        helpUrl="https://www.aem.live/docs/admin.html#tag/code/operation/deleteCode"
        icon={CodeIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs />
            <ApiUrlDisplay
              method="DELETE"
              url={`${ADMIN_API_BASE}/code/${owner || '{owner}'}/${site || '{site}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Delete Code
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

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Delete Code"
        message="Are you sure you want to proceed? This action cannot be undone."
        confirmLabel="Delete Code"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default CodeDelete; 