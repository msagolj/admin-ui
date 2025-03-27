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
  Chip,
  Stack
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
import ErrorDisplay from '../components/ErrorDisplay';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface PublishStatusResponse {
  webPath: string;
  resourcePath: string;
  live: {
    status: number;
    url: string;
    lastModified: string;
    lastModifiedBy: string;
    contentBusId: string;
    permissions: string[];
  };
  links: {
    status: string;
    preview: string;
    live: string;
    code: string;
  };
}

interface RequestDetails {
  url: string;
  method: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
}

interface ErrorDetails {
  message: string;
  status?: number;
  details?: string;
  errorHeaders?: Record<string, string>;
}

const PublishStatus: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef, path, setPath } = useResource();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PublishStatusResponse | null>(null);
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { error, handleError, clearError, getErrorDisplay } = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setRequestDetails(null);

    try {
      const url = `https://admin.hlx.page/live/${owner}/${repo}/${ref}/${path}`;
      
      // Store request details with auth token
      const token = localStorage.getItem('authToken');
      setRequestDetails({
        url,
        method: 'GET',
        headers: token ? { 'x-auth-token': token } : {},
        queryParams: {},
      });

      const response = await apiCall<PublishStatusResponse>(url, {
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
      handleError(errorDetails, 'Publish status check');
      console.error('Publish status check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    const url = `https://admin.hlx.page/live/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const formattedContent = status && (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ flex: 1 }}>
        <StatusCard
          title="Live Status"
          status={status.live.status}
          url={status.live.url}
          lastModified={status.live.lastModified}
          lastModifiedBy={status.live.lastModifiedBy}
          permissions={status.live.permissions}
        />
      </Box>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUploadIcon fontSize="large" />
          Publish Status
        </Typography>
        <Tooltip title="View API Documentation">
          <IconButton
            component="a"
            href="https://www.aem.live/docs/admin.html#publish-status"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <HelpIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Returns the publish status of the respective resource.
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
              url={`https://admin.hlx.page/live/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}`}
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
        </form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={clearError}
      />

      {status && (
        <ResponseDisplay
          data={status}
          formattedContent={formattedContent}
          apiUrl={`https://admin.hlx.page/live/${owner}/${repo}/${ref}/${path}`}
          method="GET"
          headers={requestDetails?.headers}
          queryParams={requestDetails?.queryParams}
        />
      )}
    </Box>
  );
};

export default PublishStatus; 