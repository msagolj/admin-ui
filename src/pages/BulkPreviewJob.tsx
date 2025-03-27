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
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ErrorIcon from '@mui/icons-material/Error';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpIcon from '@mui/icons-material/Help';
import { useResource } from '../context/ResourceContext';
import MethodBadge from '../components/MethodBadge';
import { formatDate } from '../utils/dateUtils';
import ApiUrlDisplay from '../components/ApiUrlDisplay';

interface BulkPreviewResponse {
  jobId: string;
  status: string;
  message: string;
  timestamp: string;
  details?: {
    paths?: string[];
    errors?: Array<{
      path: string;
      error: string;
    }>;
  };
}

interface ErrorDetails {
  message: string;
  status?: number;
  details?: string;
}

const BulkPreviewJob: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef } = useResource();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [status, setStatus] = useState<BulkPreviewResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [forceUpdateRedirects, setForceUpdateRedirects] = useState(false);
  const [word2mdVersion, setWord2mdVersion] = useState('');
  const [gdocs2mdVersion, setGdocs2mdVersion] = useState('');
  const [html2mdVersion, setHtml2mdVersion] = useState('');
  const [paths, setPaths] = useState<string[]>([]);
  const [newPath, setNewPath] = useState('');

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
    if (paths.length === 0) {
      setError({
        message: 'Please add at least one path to process',
        status: 400
      });
      return;
    }

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const queryParams = new URLSearchParams();
      if (forceUpdateRedirects) queryParams.append('forceUpdateRedirects', 'true');
      if (word2mdVersion) queryParams.append('hlx-word2md-version', word2mdVersion);
      if (gdocs2mdVersion) queryParams.append('hlx-gdocs2md-version', gdocs2mdVersion);
      if (html2mdVersion) queryParams.append('hlx-html2md-version', html2mdVersion);

      const response = await fetch(
        `https://admin.hlx.page/preview/${owner}/${repo}/${ref}/*${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paths
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      const errorDetails: ErrorDetails = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        status: err instanceof Error && err.message.includes('status:') 
          ? parseInt(err.message.match(/status: (\d+)/)?.[1] || '0')
          : undefined,
        details: err instanceof Error ? err.stack : undefined
      };
      setError(errorDetails);
      console.error('Bulk preview error:', err);
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

    const url = `https://admin.hlx.page/preview/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/*${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
          <PlaylistAddCheckIcon fontSize="large" />
          Bulk Preview Job
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
        Start a bulk preview job to update multiple resources in the preview content-bus partition.
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Paths to Process
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
                <MethodBadge method="POST" />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  API URL:
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                https://admin.hlx.page/preview/{owner || '{owner}'}/{repo || '{repo}'}/{ref || '{ref}'}/*
                {forceUpdateRedirects ? '?forceUpdateRedirects=true' : ''}
                {word2mdVersion ? `${forceUpdateRedirects ? '&' : '?'}hlx-word2md-version=${word2mdVersion}` : ''}
                {gdocs2mdVersion ? `${forceUpdateRedirects || word2mdVersion ? '&' : '?'}hlx-gdocs2md-version=${gdocs2mdVersion}` : ''}
                {html2mdVersion ? `${forceUpdateRedirects || word2mdVersion || gdocs2mdVersion ? '&' : '?'}hlx-html2md-version=${html2mdVersion}` : ''}
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
            >
              Start Bulk Preview Job
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
            </ButtonGroup>
          </Box>

          {showRaw ? (
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Raw API Response:
              </Typography>
              <Box
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  m: 0,
                  maxHeight: '600px',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                    '&:hover': {
                      background: '#666',
                    },
                  },
                }}
              >
                {JSON.stringify(status, null, 2)}
              </Box>
            </Paper>
          ) : (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">Job Status</Typography>
                    <Chip
                      label={status.status}
                      color={status.status === 'scheduled' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body1">{status.message}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Job ID: {status.jobId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Timestamp: {formatDate(status.timestamp)}
                  </Typography>
                  {status.details?.paths && status.details.paths.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Paths to Process:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {status.details.paths.map((path) => (
                          <Chip
                            key={path}
                            label={path}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                  {status.details?.errors && status.details.errors.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="error" gutterBottom>
                        Errors:
                      </Typography>
                      {status.details.errors.map((error, index) => (
                        <Alert severity="error" key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            Path: {error.path}
                          </Typography>
                          <Typography variant="body2">
                            Error: {error.error}
                          </Typography>
                        </Alert>
                      ))}
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BulkPreviewJob;

