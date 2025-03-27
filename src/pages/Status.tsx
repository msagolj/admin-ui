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
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Switch,
  Chip,
  Stack
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
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

interface StatusResponse {
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
  preview: {
    status: number;
    url: string;
    lastModified: string;
    lastModifiedBy: string;
    contentBusId: string;
    permissions: string[];
  };
  edit: {
    status: number;
    url: string;
    sourceLocation: string;
    lastModified: string;
  };
  code: {
    status: number;
    codeBusId: string;
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

const Status: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef, path, setPath } = useResource();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
  } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const { error, handleError, clearError, getErrorDisplay } = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setRequestDetails(null);

    try {
      const queryParams = new URLSearchParams();
      if (editUrl) queryParams.append('editUrl', editUrl);

      const url = `https://admin.hlx.page/status/${owner}/${repo}/${ref}/${path}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // Store request details with auth token
      const token = localStorage.getItem('authToken');
      setRequestDetails({
        url,
        method: 'GET',
        headers: token ? { 'x-auth-token': token } : {},
        queryParams: Object.fromEntries(queryParams.entries()),
      });

      const response = await apiCall<StatusResponse>(url, {
        method: 'GET',
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
      handleError(errorDetails, 'Status check');
      console.error('Status check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    const url = `https://admin.hlx.page/status/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}`;
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
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
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
        <Box sx={{ flex: 1 }}>
          <StatusCard
            title="Preview Status"
            status={status.preview.status}
            url={status.preview.url}
            lastModified={status.preview.lastModified}
            lastModifiedBy={status.preview.lastModifiedBy}
            permissions={status.preview.permissions}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <StatusCard
            title="Edit Status"
            status={status.edit.status}
            url={status.edit.url}
            sourceLocation={status.edit.sourceLocation}
            lastModified={status.edit.lastModified}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatusCard
            title="Code Status"
            status={status.code.status}
            permissions={status.code.permissions}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon fontSize="large" />
          General Status
        </Typography>
        <Tooltip title="View API Documentation">
          <IconButton
            component="a"
            href="https://www.aem.live/docs/admin.html#general-status"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <HelpIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Returns the overall status of the respective resource, including live, preview, edit, and code status.
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
              url={`https://admin.hlx.page/status/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Check Status
            </Button>
          </Box>
        </form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={clearError}
      />

      {status && (
        <Box>
          <ResponseDisplay
            data={status}
            formattedContent={formattedContent}
            apiUrl={`https://admin.hlx.page/status/${owner}/${repo}/${ref}/${path}`}
            method="GET"
            headers={requestDetails?.headers}
            queryParams={requestDetails?.queryParams}
          />
        </Box>
      )}
    </Box>
  );
};

export default Status; 