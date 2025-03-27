import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
  ButtonGroup,
  Link,
  Chip,
  Stack
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ErrorIcon from '@mui/icons-material/Error';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpIcon from '@mui/icons-material/Help';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResponseDisplay from '../components/ResponseDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import { apiCall } from '../utils/api';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface PreviewResponse {
  webPath: string;
  resourcePath: string;
  preview: {
    status: number;
    url: string;
    lastModified: string;
    contentBusId: string;
    sourceLocation?: string;
    sourceLastModified?: string;
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
  errorHeaders?: Record<string, string>;
}

const PreviewStatus: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef, path, setPath } = useResource();
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError, getErrorDisplay } = useErrorHandler();
  const [status, setStatus] = useState<PreviewResponse | null>(null);
  const [requestDetails, setRequestDetails] = useState<{ url: string; method: string; headers: Record<string, string>; queryParams: Record<string, string>; body: any } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    setStatus(null);
    setRequestDetails(null);

    try {
      const url = `https://admin.hlx.page/preview/${owner}/${repo}/${ref}/${path}`;
      
      // Store request details with auth token
      const token = localStorage.getItem('authToken');
      setRequestDetails({
        url,
        method: 'GET',
        headers: token ? { 'x-auth-token': token } : {},
        queryParams: {},
        body: {}
      });

      const response = await apiCall<PreviewResponse>(url, {
        method: 'GET',
        headers: token ? { 'x-auth-token': token } : {},
      });
      setStatus(response.data);
    } catch (err) {
      const errorDetails: ErrorDetails = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        status: err instanceof Error && err.message.includes('status:') 
          ? parseInt(err.message.match(/status: (\d+)/)?.[1] || '0')
          : undefined,
        details: err instanceof Error ? err.stack : undefined,
        errorHeaders: err instanceof Error && 'errorHeaders' in err ? (err as any).errorHeaders : undefined
      };
      handleError(errorDetails, 'Preview status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudDownloadIcon fontSize="large" />
          Preview Status
        </Typography>
        <Tooltip title="View API Documentation">
          <IconButton
            component="a"
            href="https://www.aem.live/docs/admin.html#preview-status"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <HelpIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Check the status of a preview resource.
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
            <ApiUrlDisplay
              method="GET"
              url={`https://admin.hlx.page/preview/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}`}
              queryParams={{}}
              body={{}}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Check Preview Status
            </Button>
          </Box>
        </form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={clearError}
      />

      {(status || requestDetails) && (
        <Box>
          <ResponseDisplay
            data={status}
            formattedContent={
              status && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="subtitle1">Preview Details</Typography>
                  <Typography variant="body2">
                    <strong>Web Path:</strong> {status.webPath}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Resource Path:</strong> {status.resourcePath}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {status.preview.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>URL:</strong> {status.preview.url}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Last Modified:</strong> {new Date(status.preview.lastModified).toLocaleString()}
                  </Typography>
                  {status.preview.sourceLocation && (
                    <Typography variant="body2">
                      <strong>Source Location:</strong> {status.preview.sourceLocation}
                    </Typography>
                  )}
                  {status.preview.sourceLastModified && (
                    <Typography variant="body2">
                      <strong>Source Last Modified:</strong> {new Date(status.preview.sourceLastModified).toLocaleString()}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Permissions:</strong> {status.preview.permissions.join(', ')}
                  </Typography>
                  <Typography variant="subtitle1">Links</Typography>
                  {Object.entries(status.links).map(([key, url]) => (
                    <Typography key={key} variant="body2">
                      <strong>{key}:</strong> {url}
                    </Typography>
                  ))}
                </Box>
              )
            }
            apiUrl={`https://admin.hlx.page/preview/${owner}/${repo}/${ref}/${path}`}
            method="GET"
            headers={requestDetails?.headers}
            queryParams={requestDetails?.queryParams}
            body={requestDetails?.body}
          />
        </Box>
      )}
    </Box>
  );
};

export default PreviewStatus;

