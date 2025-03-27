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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

interface PublishResponse {
  webPath: string;
  resourcePath: string;
  live: {
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

const Publish: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef, path, setPath } = useResource();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [status, setStatus] = useState<PublishResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body?: any;
  } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [forceUpdateRedirects, setForceUpdateRedirects] = useState(false);
  const [disableNotifications, setDisableNotifications] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);
    setRequestDetails(null);

    try {
      const queryParams = new URLSearchParams();
      if (forceUpdateRedirects) queryParams.append('forceUpdateRedirects', 'true');
      if (disableNotifications) queryParams.append('disableNotifications', 'true');

      const url = `https://admin.hlx.page/live/${owner}/${repo}/${ref}/${path}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // Store request details
      setRequestDetails({
        url,
        method: 'POST',
        headers: {},
        queryParams: Object.fromEntries(queryParams.entries()),
      });

      const response = await apiCall<PublishResponse>(url, {
        method: 'POST',
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
      console.error('Publish error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    const queryParams = new URLSearchParams();
    if (forceUpdateRedirects) queryParams.append('forceUpdateRedirects', 'true');
    if (disableNotifications) queryParams.append('disableNotifications', 'true');

    const url = `https://admin.hlx.page/live/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
          <CloudUploadIcon fontSize="large" />
          Publish Resource
        </Typography>
        <Tooltip title="View API Documentation">
          <IconButton
            component="a"
            href="https://www.aem.live/docs/admin.html#publish-a-resource"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <HelpIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Publish a resource by copying the resource content from the preview content-bus partition to the live content-bus partition.
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
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={disableNotifications}
                      onChange={(e) => setDisableNotifications(e.target.checked)}
                    />
                  }
                  label="Disable Notifications"
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                  Disables notifications for affected resources
                </Typography>
              </Box>
            </Box>
            <ApiUrlDisplay
              method="POST"
              url={`https://admin.hlx.page/publish/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}`}
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
        </form>
      </Paper>

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

      {status && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <ButtonGroup variant="outlined">
              <Button
                startIcon={<VisibilityIcon />}
                onClick={() => setShowRaw(false)}
                color={!showRaw ? "primary" : "inherit"}
              >
                Formatted
              </Button>
              <Button
                startIcon={<CodeIcon />}
                onClick={() => setShowRaw(true)}
                color={showRaw ? "primary" : "inherit"}
              >
                Raw Response
              </Button>
              <Button
                startIcon={<CodeIcon />}
                onClick={() => setShowRequestDetails(!showRequestDetails)}
                color={showRequestDetails ? "primary" : "inherit"}
              >
                {showRequestDetails ? "Hide Request" : "Show Request"}
              </Button>
            </ButtonGroup>
          </Box>

          {requestDetails && showRequestDetails && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>Request Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">URL</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {requestDetails.url}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Method</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {requestDetails.method}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Headers</Typography>
                  <Box sx={{ 
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    p: 1,
                    borderRadius: 1
                  }}>
                    {JSON.stringify(requestDetails.headers, null, 2)}
                  </Box>
                </Box>
                {Object.keys(requestDetails.queryParams).length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Query Parameters</Typography>
                    <Box sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                      p: 1,
                      borderRadius: 1
                    }}>
                      {JSON.stringify(requestDetails.queryParams, null, 2)}
                    </Box>
                  </Box>
                )}
                {requestDetails.body && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Request Body</Typography>
                    <Box sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                      p: 1,
                      borderRadius: 1
                    }}>
                      {JSON.stringify(requestDetails.body, null, 2)}
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          )}

          <ResponseDisplay
            data={status}
            formattedContent={
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {status.live.status !== undefined && (
                  <StatusCard
                    title="Live Status"
                    status={status.live.status}
                    url={status.live.url}
                    lastModified={status.live.lastModified}
                    contentBusId={status.live.contentBusId}
                    sourceLocation={status.live.sourceLocation}
                    sourceLastModified={status.live.sourceLastModified}
                    permissions={status.live.permissions}
                  />
                )}
              </Box>
            }
            apiUrl={`https://admin.hlx.page/live/${owner}/${repo}/${ref}/${path}`}
            method="POST"
          />
        </Box>
      )}
    </Box>
  );
};

export default Publish; 