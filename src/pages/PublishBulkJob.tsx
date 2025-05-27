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
import PathSelector from '../components/PathSelector';
import StatusResponseDisplay from '../components/response/StatusResponseDisplay';
import JobPolling from '../components/JobPolling';
import Form, { useFormState } from '../components/Form';

const PublishBulkJob: React.FC = () => {
  const { owner, repo, ref, path } = useResource();
  const { status, responseData, jobLink, error, loading, executeSubmit, reset } = useFormState();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  // Additional parameters for the bulk publish job
  const [paths, setPaths] = useState<string[]>(['']);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [deleteResources, setDeleteResources] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `https://admin.hlx.page/live/${owner}/${repo}/${ref}/*`,
      method: 'POST',
      headers: {},
      queryParams: {},
      body: {
        paths: paths.filter(p => p.trim() !== ''),
        forceUpdate,
        delete: deleteResources
      }
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Bulk Publish Job"
        description={
          <>
            Updates live resources specified in the paths property. If a path ends with /*, it is assumed to be a folder and is recursively published.
            <br />
            <strong>Note: Configuration files, like /.helix/config or redirects.json, are always ignored during bulk publish.</strong>
          </>
        }
        helpUrl="https://www.aem.live/docs/admin.html#tag/publish/operation/bulkPublish"
        icon={CloudUploadIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs
              defaultPath="*"
              readOnlyPath={true}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={forceUpdate}
                  onChange={(e) => setForceUpdate(e.target.checked)}
                />
              }
              label="Force update of resources (by default, only new and modified resources are updated)"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={deleteResources}
                  onChange={(e) => setDeleteResources(e.target.checked)}
                />
              }
              label="Delete resources from live"
            />
            <PathSelector
              paths={paths}
              onPathsChange={setPaths}
              title="Paths"
              placeholder="Enter path (e.g., /en, /en/*, /blog/)"
              helperText="Paths to filter the bulk publish. If a path ends with /*, it is assumed to be a folder and is recursively published."
            />
            <ApiUrlDisplay
              method="POST"
              url={`https://admin.hlx.page/live/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/*`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading || paths[0].trim() === ''}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Run Bulk Publish Job
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={() => {
          reset();
          setRequestDetails(null);
        }}
        requestDetails={requestDetails}
      />

      {status && (
        <StatusResponseDisplay
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

export default PublishBulkJob; 