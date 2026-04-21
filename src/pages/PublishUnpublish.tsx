import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ConfirmDialog from '../components/ConfirmDialog';
import ResponseDisplay from '../components/response/ResponseDisplay';
import { RequestDetails, ADMIN_API_BASE } from '../types';

const PublishUnpublish: React.FC = () => {
  const { owner, site, ref, path } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset, requestDetails } = useFormState();

  const [disableNotifications, setDisableNotifications] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    const details = {
      url: `${ADMIN_API_BASE}/live/${owner}/${site}/${ref}/${path}`,
      method: 'DELETE',
      headers: {},
      queryParams: {
        ...(disableNotifications && { disableNotifications: 'true' })
      },
      body: null,
    };
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Un-publish Resource"
        description="Un-publishes a resource by deleting the content from the live content-bus partition. It additionally purges the live cdn and the byo cdn, if configured."
        helpUrl="https://www.aem.live/docs/admin.html#tag/publish/operation/unpublishResource"
        icon={CloudUploadIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs />
            <FormControlLabel
              control={
                <Switch
                  checked={disableNotifications}
                  onChange={(e) => setDisableNotifications(e.target.checked)}
                />
              }
              label="Disable notifications for affected resources"
            />
            <ApiUrlDisplay
              method="DELETE"
              url={`${ADMIN_API_BASE}/live/${owner || '{owner}'}/${site || '{site}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Un-publish Resource
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
        title="Confirm Un-publish"
        message="Are you sure you want to un-publish this resource? This action cannot be undone."
        confirmLabel="Un-publish"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default PublishUnpublish; 