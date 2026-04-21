import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResponseDisplay from '../components/response/ResponseDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ConfirmDialog from '../components/ConfirmDialog';
import { RequestDetails, ADMIN_API_BASE } from '../types';

const PreviewDelete: React.FC = () => {
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
      url: `${ADMIN_API_BASE}/preview/${owner}/${site}/${ref}/${path}`,
      method: 'DELETE',
      headers: {},
      queryParams: {},
      body: null,
    };
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Delete Preview"
        description="Deletes a preview resource from the preview partition in the content-bus."
        helpUrl="https://www.aem.live/docs/admin.html#tag/preview/operation/deletePreview"
        icon={PreviewIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs />
            <ApiUrlDisplay
              method="DELETE"
              url={`${ADMIN_API_BASE}/preview/${owner || '{owner}'}/${site || '{site}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Delete Preview
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
        title="Confirm Delete Preview"
        message="Are you sure you want to proceed? This action cannot be undone."
        confirmLabel="Delete Preview"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default PreviewDelete;

