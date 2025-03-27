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
}

const BulkStatusJob: React.FC = () => {
  const { owner, setOwner, repo, setRepo, ref, setRef } = useResource();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [status, setStatus] = useState<BulkStatusResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);
  const [newPath, setNewPath] = useState('');
  const [select, setSelect] = useState<string[]>(['edit', 'preview', 'live']);

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
    setError(null);
    setStatus(null);

    try {
      const response = await fetch(`https://admin.hlx.page/status/${owner}/${repo}/${ref}/*`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          select,
          paths
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start bulk status job');
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An error occurred',
        details: err instanceof Error ? err.stack : undefined
      });
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error.message}
          {error.details && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Details:
              </Typography>
              <Box
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  m: 0,
                  mt: 1,
                  p: 1,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
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
                      label={status.job.state}
                      color={status.job.state === 'created' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body1">Message ID: {status.messageId}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Job Name: {status.job.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start Time: {formatDate(status.job.startTime)}
                  </Typography>
                  {status.job.data.paths && status.job.data.paths.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Paths to Process:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {status.job.data.paths.map((path) => (
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
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Links:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        label="View Job"
                        color="primary"
                        variant="outlined"
                        size="small"
                        component="a"
                        href={status.links.self}
                        target="_blank"
                        rel="noopener noreferrer"
                        clickable
                      />
                      <Chip
                        label="Job List"
                        color="primary"
                        variant="outlined"
                        size="small"
                        component="a"
                        href={status.links.list}
                        target="_blank"
                        rel="noopener noreferrer"
                        clickable
                      />
                    </Stack>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BulkStatusJob; 