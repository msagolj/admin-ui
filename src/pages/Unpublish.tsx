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
  Switch,
  Chip,
  Stack
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
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
import { useErrorHandler } from '../hooks/useErrorHandler';
import ErrorDisplay from '../components/ErrorDisplay';

interface UnpublishResponse {
  status: number;
  messageId: string;
  job: {
    topic: string;
    name: string;
    state: string;
    startTime: string;
    progress: {
      total: number;
      processed: number;
      failed: number;
    };
    data: {
      paths: string[];
    };
  };
  links: {
    self: string;
    list: string;
  };
}

interface ErrorDetails {
  message: string;
  status?: number;
  details?: string;
  errorHeaders?: Record<string, string>;
}

const Unpublish: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef, path, setPath } = useResource();
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError, getErrorDisplay } = useErrorHandler();
  const [status, setStatus] = useState<UnpublishResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [forceUpdateRedirects, setForceUpdateRedirects] = useState(false);
  const [disableNotifications, setDisableNotifications] = useState(false);
  const [requestDetails, setRequestDetails] = useState<{ url: string; method: string; headers: Record<string, string>; queryParams: Record<string, string>; body: any } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setLoading(true);
    clearError();
    setStatus(null);
    setRequestDetails(null);

    try {
      const queryParams = new URLSearchParams();
      if (forceUpdateRedirects) queryParams.append('forceUpdateRedirects', 'true');
      if (disableNotifications) queryParams.append('disableNotifications', 'true');

      const url = `https://admin.hlx.page/live/${owner}/${repo}/${ref}/${path}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // Store request details with auth token
      const token = localStorage.getItem('authToken');
      setRequestDetails({
        url,
        method: 'DELETE',
        headers: token ? { 'x-auth-token': token } : {},
        queryParams: Object.fromEntries(queryParams.entries()),
        body: {}
      });

      const response = await apiCall<UnpublishResponse>(url, {
        method: 'DELETE',
        headers: token ? { 'x-auth-token': token } : {},
      });
      
      if (response.data) {
        setStatus(response.data);
        setShowRaw(false);
      }
    } catch (err) {
      const errorDetails: ErrorDetails = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        status: err instanceof Error && err.message.includes('status:') 
          ? parseInt(err.message.match(/status: (\d+)/)?.[1] || '0')
          : undefined,
        details: err instanceof Error ? err.stack : undefined,
        errorHeaders: err instanceof Error && 'errorHeaders' in err ? (err as any).errorHeaders : undefined
      };
      handleError(errorDetails, 'Unpublish');
      setStatus(null);
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

  const handleUnpublish = async () => {
    try {
      setLoading(true);
      clearError();
      setStatus(null);
      setRequestDetails(null);

      const queryParams = new URLSearchParams();
      if (forceUpdateRedirects) queryParams.append('forceUpdateRedirects', 'true');
      if (disableNotifications) queryParams.append('disableNotifications', 'true');

      const url = `https://admin.hlx.page/live/${owner}/${repo}/${ref}/${path}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // Store request details with auth token
      const token = localStorage.getItem('authToken');
      setRequestDetails({
        url,
        method: 'DELETE',
        headers: token ? { 'x-auth-token': token } : {},
        queryParams: Object.fromEntries(queryParams.entries()),
        body: {}
      });

      const response = await apiCall<UnpublishResponse>(url, {
        method: 'DELETE',
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
      handleError(errorDetails, 'Unpublish');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudDownloadIcon fontSize="large" />
          Un-publish Resource
        </Typography>
        <Tooltip title="View API Documentation">
          <IconButton
            component="a"
            href="https://www.aem.live/docs/admin.html#un-publish-a-resource"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <HelpIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Un-publish a resource by removing it from the live content-bus partition.
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
              method="DELETE"
              url={`https://admin.hlx.page/unpublish/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}`}
              queryParams={{
                ...(forceUpdateRedirects && { forceUpdateRedirects: 'true' }),
                ...(disableNotifications && { disableNotifications: 'true' })
              }}
              body={{}}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Un-publish Resource
            </Button>
          </Box>
        </form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={clearError}
      />

      {status && !error && requestDetails && (
        <Box>
          <ResponseDisplay
            data={status}
            formattedContent={
              status && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">Job Details</Typography>
                    <Chip 
                      label={status.job.state} 
                      color={status.job.state === 'completed' ? 'success' : status.job.state === 'failed' ? 'error' : 'primary'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2">
                    <strong>Topic:</strong> {status.job.topic}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {status.job.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Start Time:</strong> {formatDate(status.job.startTime)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Progress:</strong> {status.job.progress.processed} / {status.job.progress.total} ({status.job.progress.failed} failed)
                  </Typography>
                  {status.job.data.paths && status.job.data.paths.length > 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Paths:</strong>
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {status.job.data.paths.map((path: string) => (
                          <Chip
                            key={path}
                            label={path}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                  {status.links && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Links:</strong>
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {Object.entries(status.links).map(([key, url]) => (
                          <Chip
                            key={key}
                            label={`${key}: ${url}`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              )
            }
            apiUrl={requestDetails.url}
            method={requestDetails.method}
            headers={requestDetails.headers}
            queryParams={requestDetails.queryParams}
            body={requestDetails.body}
          />
        </Box>
      )}
    </Box>
  );
};

export default Unpublish; 