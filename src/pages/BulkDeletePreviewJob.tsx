import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  ButtonGroup,
  Link,
  AlertTitle,
  IconButton,
  Tooltip,
  Chip,
  Stack
} from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ErrorIcon from '@mui/icons-material/Error';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpIcon from '@mui/icons-material/Help';
import { useResource } from '../context/ResourceContext';
import MethodBadge from '../components/MethodBadge';
import { formatDate } from '../utils/dateUtils';
import { apiCall } from '../utils/api';
import ResponseDisplay from '../components/ResponseDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface BulkDeletePreviewResponse {
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
  links: {
    self: string;
    job: string;
    list: string;
  };
}

interface ErrorDetails {
  message: string;
  status?: number;
  details?: string;
  errorHeaders?: Record<string, string>;
}

interface RequestDetails {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: any;
  queryParams?: Record<string, string>;
}

const BulkDeletePreviewJob: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef } = useResource();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<BulkDeletePreviewResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [paths, setPaths] = useState<string[]>(['']);
  const [newPath, setNewPath] = useState('');
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
  const { error, handleError, clearError, getErrorDisplay } = useErrorHandler();

  const handleAddPath = () => {
    if (newPath && !paths.includes(newPath)) {
      setPaths([...paths, newPath]);
      setNewPath('');
    }
  };

  const handleRemovePath = (pathToRemove: string) => {
    setPaths(paths.filter(path => path !== pathToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setRequestDetails(null);

    try {
      const url = `https://admin.hlx.page/preview/${owner}/${repo}/${ref}/*`;
      const requestBody = {
        paths: paths.filter((p: string) => p.trim())
      };

      // Store request details with auth token
      const token = localStorage.getItem('authToken');
      setRequestDetails({
        url,
        method: 'DELETE',
        headers: token ? { 'x-auth-token': token } : {},
        body: requestBody,
      });

      const response = await apiCall<BulkDeletePreviewResponse>(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
      handleError(errorDetails, 'Bulk delete preview job');
      console.error('Bulk delete preview job error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    const url = `https://admin.hlx.page/preview/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/*`;
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
          <DeleteSweepIcon fontSize="large" />
          Bulk Delete Preview Job
        </Typography>
        <Tooltip title="View API Documentation">
          <IconButton
            component="a"
            href="https://www.aem.live/docs/admin.html#start-a-bulk-preview-job"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <HelpIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Start a bulk delete preview job to remove multiple resources from the preview content-bus partition.
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
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Paths to Delete
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Path"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  placeholder="e.g., /blog/* or /en/2021/article.md"
                  helperText="Enter a path or glob pattern"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddPath}
                  disabled={!newPath}
                  sx={{ minWidth: '100px' }}
                >
                  Add Path
                </Button>
              </Box>
              {paths.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {paths.map((path) => (
                    <Chip
                      key={path}
                      label={path}
                      onDelete={() => handleRemovePath(path)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
            </Box>
            <Box sx={{ 
              mt: 1, 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              wordBreak: 'break-all',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MethodBadge method="DELETE" />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  API URL:
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                https://admin.hlx.page/preview/{owner || '{owner}'}/{repo || '{repo}'}/{ref || '{ref}'}/*
              </Box>
              <Tooltip title={copySuccess ? "Copied!" : "Copy URL"}>
                <IconButton 
                  size="small" 
                  onClick={handleCopyUrl}
                  color={copySuccess ? "success" : "default"}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Button
              variant="contained"
              type="submit"
              disabled={loading || paths.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              color="error"
            >
              Start Bulk Delete Preview Job
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">Job Details</Typography>
                    <Chip 
                      label={status.state} 
                      color={status.state === 'completed' ? 'success' : status.state === 'failed' ? 'error' : 'primary'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2">
                    <strong>Topic:</strong> {status.topic}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {status.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Start Time:</strong> {formatDate(status.startTime)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Progress:</strong> {status.progress.processed} / {status.progress.total} ({status.progress.failed} failed)
                  </Typography>
                  {status.data.paths && status.data.paths.length > 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Paths:</strong>
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {status.data.paths.map((path) => (
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
            apiUrl={`https://admin.hlx.page/preview/${owner}/${repo}/${ref}/*`}
            method="DELETE"
            headers={requestDetails?.headers}
            queryParams={requestDetails?.queryParams}
            body={requestDetails?.body}
          />
        </Box>
      )}
    </Box>
  );
};

export default BulkDeletePreviewJob; 