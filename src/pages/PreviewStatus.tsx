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
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpIcon from '@mui/icons-material/Help';
import CheckIcon from '@mui/icons-material/Check';
import { useResource } from '../context/ResourceContext';
import MethodBadge from '../components/MethodBadge';
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

const PreviewStatus: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef, path, setPath } = useResource();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [status, setStatus] = useState<PreviewResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const response = await apiCall<PreviewResponse>(`https://admin.hlx.page/preview/${owner}/${repo}/${ref}/${path}`, {
        method: 'GET',
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
      console.error('Preview status error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    const url = `https://admin.hlx.page/preview/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/${path || '{path}'}`;
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
          <VisibilityIcon fontSize="large" />
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
        Check the preview status of a resource in the preview content-bus partition.
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

          <ResponseDisplay
            data={status}
            formattedContent={
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {status.preview.status !== undefined && (
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
            }
            apiUrl={`https://admin.hlx.page/preview/${owner}/${repo}/${ref}/${path}`}
            method="GET"
          />
        </Box>
      )}
    </Box>
  );
};

export default PreviewStatus;

