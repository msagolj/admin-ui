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
import StatusResponseDisplay from '../components/StatusResponseDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';

const PreviewUpdate: React.FC = () => {
  const { owner, repo, ref, path } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  // Additional parameters for the request body
  const [forceUpdateRedirects, setForceUpdateRedirects] = useState(false);
  const [word2mdVersion, setWord2mdVersion] = useState('');
  const [gdocs2mdVersion, setGdocs2mdVersion] = useState('');
  const [html2mdVersion, setHtml2mdVersion] = useState('');
  const requiresAemToken = true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: Record<string, any> = {};
    if (forceUpdateRedirects) {
      body.forceUpdateRedirects = true;
    }
    if (word2mdVersion) {
      body['hlx-word2md-version'] = word2mdVersion;
    }
    if (gdocs2mdVersion) {
      body['hlx-gdocs2md-version'] = gdocs2mdVersion;
    }
    if (html2mdVersion) {
      body['hlx-html2md-version'] = html2mdVersion;
    }

    const headers: Record<string, string> = {};
    const aemToken = localStorage.getItem('aemToken');
    if (requiresAemToken && aemToken) {
      headers['x-content-source-authorization'] = aemToken;
    }

    const details = {
      url: `https://admin.hlx.page/preview/${owner}/${repo}/${ref}/${path}`,
      method: 'POST',
      headers,
      queryParams: {},
      body: Object.keys(body).length > 0 ? body : {},
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Update Preview"
        description={
          <>
            Updates the preview resource by fetching the latest content from the content providers.
            <br />
            <strong>Note: If content source is AEM the operation requires an AEM token (see Settings)</strong>
          </>
        }
        helpUrl="https://www.aem.live/docs/admin.html#tag/preview/operation/updatePreview"
        icon={PreviewIcon}
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
              label="Force Update Redirects"
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

            <ApiUrlDisplay
              method="POST"
              url={`https://admin.hlx.page/preview/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Update Preview
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
    </Box>
  );
};

export default PreviewUpdate; 