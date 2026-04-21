import React from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import StatusResponseDisplay from '../components/response/StatusResponseDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import { RequestDetails, ADMIN_API_BASE } from '../types';

const PublishStatus: React.FC = () => {
  const { owner, site, ref, path } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset, requestDetails } = useFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `${ADMIN_API_BASE}/live/${owner}/${site}/${ref}/${path}`,
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
        title="Publish Status"
        description="Returns the publish status of the respective resource."
        helpUrl="https://www.aem.live/docs/admin.html#tag/publish"
        icon={CloudUploadIcon}    
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs />
            <ApiUrlDisplay
              method="GET"
              url={`${ADMIN_API_BASE}/live/${owner || '{owner}'}/${site || '{site}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Check Publish Status
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
        <StatusResponseDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default PublishStatus; 