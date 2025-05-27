import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import PathSelector from '../components/PathSelector';
import StatusResponseDisplay from '../components/response/StatusResponseDisplay';
import JobPolling from '../components/JobPolling';
import Form, { useFormState } from '../components/Form';

const PreviewBulkJob: React.FC = () => {
  const { owner, repo, ref, path } = useResource();
  const { status, responseData, jobLink, error, loading, executeSubmit, reset } = useFormState();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  // additional parameters for the bulk preview job
  const [paths, setPaths] = useState<string[]>(['']);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [deleteResources, setDeleteResources] = useState(false);
  const [forceAsync, setForceAsync] = useState(false);
  const [word2mdVersion, setWord2mdVersion] = useState('');
  const [gdocs2mdVersion, setGdocs2mdVersion] = useState('');
  const [html2mdVersion, setHtml2mdVersion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `https://admin.hlx.page/preview/${owner}/${repo}/${ref}/*`,
      method: 'POST',
      headers: {},
      queryParams: {},
      body: {
        paths: paths.filter(p => p.trim() !== ''),
        forceUpdate,
        delete: deleteResources,
        forceAsync,
        'hlx-word2md-version': word2mdVersion || undefined,
        'hlx-gdocs2md-version': gdocs2mdVersion || undefined,
        'hlx-html2md-version': html2mdVersion || undefined
      }
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Bulk Preview Job"
        description={
          <>
            Updates preview resources specified in the paths property. If a path ends with /*, it is assumed to be a folder and is recursively previewed.
            <br />
            <strong>Note: Does not work for AEM or other BYOM content sources</strong>
          </>
        }
        helpUrl="https://www.aem.live/docs/admin.html#tag/preview/operation/bulkPreview"
        icon={PreviewIcon}
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
              label="Delete resources from preview"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={forceAsync}
                  onChange={(e) => setForceAsync(e.target.checked)}
                />
              }
              label="Force asynchronous execution (even for a small number of paths)"
            />
            <TextField
              label="Word to MD Version"
              value={word2mdVersion}
              onChange={(e) => setWord2mdVersion(e.target.value)}
              placeholder="e.g., 1.0.0"
              fullWidth
            />
            <TextField
              label="Google Docs to MD Version"
              value={gdocs2mdVersion}
              onChange={(e) => setGdocs2mdVersion(e.target.value)}
              placeholder="e.g., 1.0.0"
              fullWidth
            />
            <TextField
              label="HTML to MD Version"
              value={html2mdVersion}
              onChange={(e) => setHtml2mdVersion(e.target.value)}
              placeholder="e.g., 1.0.0"
              fullWidth
            />
            <PathSelector
              paths={paths}
              onPathsChange={setPaths}
              title="Paths"
              placeholder="Enter path (e.g., /en, /en/*, /blog/)"
              helperText="Paths to filter the bulk preview. If a path ends with /*, it is assumed to be a folder and is recursively previewed."
            />
            <ApiUrlDisplay
              method="POST"
              url={`https://admin.hlx.page/preview/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/*`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading || paths[0].trim() === ''}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Run Bulk Preview Job
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

export default PreviewBulkJob; 