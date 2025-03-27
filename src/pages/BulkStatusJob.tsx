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
  Link,
  AlertTitle,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Chip,
  Stack
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
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

interface BulkStatusResponse {
  status: number;
  messageId: string;
  job: {
    topic: string;
    name: string;
    state: string;
    startTime: string;
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
  details?: string;
  status?: number;
  errorHeaders?: Record<string, string>;
}

const BulkStatusJob: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef } = useResource();
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError, getErrorDisplay } = useErrorHandler();
  const [status, setStatus] = useState<BulkStatusResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [paths, setPaths] = useState<string[]>(['']);
  const [newPath, setNewPath] = useState('');
  const [select, setSelect] = useState<string[]>(['edit', 'preview', 'live']);
  const [requestDetails, setRequestDetails] = useState<{ url: string; method: string; headers: Record<string, string>; queryParams: Record<string, string>; body: any } | null>(null);

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
    clearError();
    setStatus(null);
    setRequestDetails(null);

    try {
      const url = `https://admin.hlx.page/status/${owner}/${repo}/${ref}/*`;
      const requestBody = {
        paths: paths.filter(p => p.trim())
      };

      // Store request details with auth token
      const token = localStorage.getItem('authToken');
      setRequestDetails({
        url,
        method: 'POST',
        headers: token ? { 'x-auth-token': token } : {},
        body: requestBody,
        queryParams: {}
      });

      const response = await apiCall<BulkStatusResponse>(url, {
        method: 'POST',
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
      handleError(errorDetails, 'Bulk status job');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    const url = `https://admin.hlx.page/status/${owner}/${repo}/${ref}/*`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Bulk Status Job
        </Typography>
        <MethodBadge method="POST" />
      </Box>

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
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Select Status Types
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {['edit', 'preview', 'live'].map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Switch
                        checked={select.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelect([...select, type]);
                          } else {
                            setSelect(select.filter(t => t !== type));
                          }
                        }}
                      />
                    }
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Paths to Check
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  placeholder="Enter path (e.g., /en/blog/*)"
                  helperText="Use /* at the end to check all resources in a folder"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddPath}
                  disabled={!newPath}
                >
                  Add
                </Button>
              </Box>
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
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyUrl}
                color={copySuccess ? "success" : "primary"}
              >
                {copySuccess ? "Copied!" : "Copy API URL"}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<PlaylistAddCheckIcon />}
                disabled={loading || paths.length === 0}
              >
                {loading ? <CircularProgress size={24} /> : "Start Bulk Status Job"}
              </Button>
            </Box>
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
                    <strong>Progress:</strong> {status.job.data.paths.length} / {status.job.data.paths.length} ({status.job.data.paths.length - status.job.data.paths.length} failed)
                  </Typography>
                  {status.job.data.paths && status.job.data.paths.length > 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Paths:</strong>
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {status.job.data.paths.map((path) => (
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
            apiUrl={`https://admin.hlx.page/status/${owner}/${repo}/${ref}/*`}
            method="POST"
            headers={requestDetails?.headers}
            queryParams={requestDetails?.queryParams}
            body={requestDetails?.body}
          />
        </Box>
      )}
    </Box>
  );
};

export default BulkStatusJob; 