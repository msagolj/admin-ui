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
import StatusResponseDisplay from '../components/overlays/StatusResponseDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';

const PublishResource: React.FC = () => {
  const { owner, repo, ref, path } = useResource();
  const { status, responseData, error, loading, executeSubmit } = useFormState();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  // Additional parameters for the request
  const [forceUpdateRedirects, setForceUpdateRedirects] = useState(false);
  const [disableNotifications, setDisableNotifications] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `https://admin.hlx.page/live/${owner}/${repo}/${ref}/${path}`,
      method: 'POST',
      headers: {},
      queryParams: {},
      body: {
        forceUpdateRedirects,
        disableNotifications
      }
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Publish Resource"
        description="Publishes a resource by copying the resource content from the preview content-bus partition to the live content-bus partition. It additionally purges the live cdn and the byo cdn, if configured."
        helpUrl="https://www.aem.live/docs/admin.html#tag/publish/operation/publishResource"
        icon={CloudUploadIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs />
            <FormControlLabel
              control={
                <Switch
                  checked={forceUpdateRedirects}
                  onChange={(e) => setForceUpdateRedirects(e.target.checked)}
                />
              }
              label="Force update of redirects (only applies when publishing redirects.json)"
            />
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
              method="POST"
              url={`https://admin.hlx.page/live/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Publish Resource
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={() => {}}
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

export default PublishResource; 