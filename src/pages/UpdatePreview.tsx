import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  ButtonGroup,
  Grid,
  Link,
  AlertTitle,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpIcon from '@mui/icons-material/Help';
import CheckIcon from '@mui/icons-material/Check';
import { useResource } from '../context/ResourceContext';
import MethodBadge from '../components/MethodBadge';
import { formatDate } from '../utils/dateUtils';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResponseDisplay from '../components/ResponseDisplay';
import StatusCard from '../components/StatusCard';
import { apiCall } from '../utils/api';

interface PreviewResponse {
  webPath: string;
  resourcePath: string;
  preview: {
    status: number;
    url: string;
    lastModified: string;
    contentBusId: string;
    sourceLocation: string;
    sourceLastModified: string;
    permissions: string[];
  };
  links: {
    status: string;
    preview: string;
    live: string;
    code: string;
  };
}

interface ErrorDetails {
  message: string;
  status?: number;
  details?: string;
}

const UpdatePreview: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef, path, setPath } = useResource();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [status, setStatus] = useState<PreviewResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [forceUpdateRedirects, setForceUpdateRedirects] = useState(false);
  const [word2mdVersion, setWord2mdVersion] = useState('');
  const [gdocs2mdVersion, setGdocs2mdVersion] = useState('');
  const [html2mdVersion, setHtml2mdVersion] = useState('');
  const [requestDetails, setRequestDetails] = useState<{ url: string; method: string; headers: Record<string, string>; queryParams: Record<string, string> } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);
    setRequestDetails(null);

    try {
      const queryParams = new URLSearchParams();
      if (forceUpdateRedirects) queryParams.append('forceUpdateRedirects', 'true');
      if (word2mdVersion) queryParams.append('hlx-word2md-version', word2mdVersion);
      if (gdocs2mdVersion) queryParams.append('hlx-gdocs2md-version', gdocs2mdVersion);
      if (html2mdVersion) queryParams.append('hlx-html2md-version', html2mdVersion);

      const url = `https://admin.hlx.page/preview/${owner}/${repo}/${ref}/${path}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // Store request details with auth token
      const token = localStorage.getItem('authToken');
      setRequestDetails({
        url,
        method: 'POST',
        headers: token ? { 'x-auth-token': token } : {},
        queryParams: Object.fromEntries(queryParams.entries()),
      });

      const response = await apiCall<PreviewResponse>(url, {
        method: 'POST',
        headers: token ? { 'x-auth-token': token } : {},
      });
      setStatus(response.data);
    } catch (err) {
      const errorDetails: ErrorDetails = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        status: err instanceof Error && err.message.includes('status:') 
          ? parseInt(err.message.match(/status: (\d+)/)?.[1] || '0')
          : undefined,
        details: err instanceof Error ? err.stack : undefined
      };
      setError(errorDetails);
      console.error('Update preview error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    const queryParams = new URLSearchParams();
    if (forceUpdateRedirects) queryParams.append('forceUpdateRedirects', 'true');
    if (word2mdVersion) queryParams.append('hlx-word2md-version', word2mdVersion);
    if (gdocs2mdVersion) queryParams.append('hlx-gdocs2md-version', gdocs2mdVersion);
    if (html2mdVersion) queryParams.append('hlx-html2md-version', html2mdVersion);

    const url = `https://admin.hlx.page/preview/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RefreshIcon fontSize="large" />
          Update Preview
        </Typography>
        <Tooltip title="View API Documentation">
          <IconButton
            component="a"
            href="https://www.aem.live/docs/admin.html#update-preview"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <HelpIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Updates the preview resource by fetching the latest content from the content providers and storing it in preview.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2 
            }}>
              <TextField
                fullWidth
                label="Owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
                placeholder="Repository owner"
                helperText="Repository owner (e.g., organization or user name)"
              />
              <TextField
                fullWidth
                label="Repository"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                required
                placeholder="Repository name"
                helperText="Name of the repository"
              />
              <TextField
                fullWidth
                label="Reference"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                required
                placeholder="Branch or ref"
                helperText="Ref (branch) of repository"
              />
              <TextField
                fullWidth
                label="Path"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                required
                placeholder="Resource path"
                helperText="Relative path of the resource"
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={forceUpdateRedirects}
                      onChange={(e) => setForceUpdateRedirects(e.target.checked)}
                    />
                  }
                  label="Force Update Redirects"
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                  Forces an update of the redirects (only applies when updating/publishing redirects.json)
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Service Versions (Optional)
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2 
              }}>
                <TextField
                  fullWidth
                  label="Word2MD Version"
                  value={word2mdVersion}
                  onChange={(e) => setWord2mdVersion(e.target.value)}
                  placeholder="e.g., v1.0.0"
                  helperText="Version to use when invoking the word2md service"
                />
                <TextField
                  fullWidth
                  label="GDocs2MD Version"
                  value={gdocs2mdVersion}
                  onChange={(e) => setGdocs2mdVersion(e.target.value)}
                  placeholder="e.g., v1.0.0"
                  helperText="Version to use when invoking the gdocs2md service"
                />
                <TextField
                  fullWidth
                  label="HTML2MD Version"
                  value={html2mdVersion}
                  onChange={(e) => setHtml2mdVersion(e.target.value)}
                  placeholder="e.g., v1.0.0"
                  helperText="Version to use when invoking the html2md service"
                />
              </Box>
            </Box>
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
        </form>
      </Paper>

      {(status || requestDetails) && (
        <Box>
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              }
            >
              <AlertTitle>Error</AlertTitle>
              <Typography variant="body1" gutterBottom>
                {error.message}
              </Typography>
              {error.status && (
                <Typography variant="body2" color="text.secondary">
                  Status Code: {error.status}
                </Typography>
              )}
              {error.details && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Technical Details:
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    {error.details}
                  </Box>
                </Box>
              )}
            </Alert>
          )}

          <ResponseDisplay
            data={status}
            formattedContent={
              status && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {status.webPath && (
                    <Typography variant="body2">
                      <strong>Web Path:</strong> {status.webPath}
                    </Typography>
                  )}
                  {status.resourcePath && (
                    <Typography variant="body2">
                      <strong>Resource Path:</strong> {status.resourcePath}
                    </Typography>
                  )}
                  {status.preview && (
                    <StatusCard
                      title="Preview Status"
                      status={status.preview.status}
                      url={status.preview.url}
                      lastModified={status.preview.lastModified}
                      contentBusId={status.preview.contentBusId}
                      sourceLocation={status.preview.sourceLocation}
                      sourceLastModified={status.preview.sourceLastModified}
                      permissions={status.preview.permissions}
                    />
                  )}
                </Box>
              )
            }
            apiUrl={`https://admin.hlx.page/preview/${owner}/${repo}/${ref}/${path}`}
            method="POST"
            headers={requestDetails?.headers}
            queryParams={requestDetails?.queryParams}
          />
        </Box>
      )}
    </Box>
  );
};

export default UpdatePreview;

