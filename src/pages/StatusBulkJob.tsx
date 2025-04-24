import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ResourceInputs from '../components/ResourceInputs';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import PathSelector from '../components/PathSelector';
import StatusResponseDisplay from '../components/StatusResponseDisplay';
import JobPolling from '../components/JobPolling';
import Form, { useFormState } from '../components/Form';

const StatusBulkJob: React.FC = () => {
  const { owner, repo, ref, path } = useResource();
  const { status, responseData, jobLink, error, loading, executeSubmit, reset } = useFormState();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  // additional parameters for the bulk status job
  const [paths, setPaths] = useState<string[]>(['']);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['preview', 'live']);
  const [pathsOnly, setPathsOnly] = useState(false);
  const [forceAsync, setForceAsync] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `https://admin.hlx.page/status/${owner}/${repo}/${ref}/*`,
      method: 'POST',
      headers: {},
      queryParams: {},
      body: {
        select: selectedTypes,
        paths: paths.filter(p => p.trim() !== ''),
        pathsOnly,
        forceAsync
      }
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <Box>
      <PageHeader
        title="Bulk Status Job"
        description="Returns the status of multiple resources."
        helpUrl="https://www.aem.live/docs/admin.html#tag/status/operation/bulkStatus"
        icon={CheckCircleIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs
              defaultPath="*"
              readOnlyPath={true}
            />
            <Box>
              <Typography variant="subtitle1" gutterBottom>Resource Types</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['edit', 'preview', 'live'].map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    color={selectedTypes.includes(type) ? 'primary' : 'default'}
                    onClick={() => toggleType(type)}
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={pathsOnly}
                  onChange={(e) => setPathsOnly(e.target.checked)}
                />
              }
              label="Only return paths (without status information)"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={forceAsync}
                  onChange={(e) => setForceAsync(e.target.checked)}
                />
              }
              label="Force asynchronous execution"
            />
            <PathSelector
              paths={paths}
              onPathsChange={setPaths}
              title="Paths"
              placeholder="Enter path (e.g., /en, /en/*, /blog/)"
              helperText="Paths to filter the bulk status"
            />
            <ApiUrlDisplay
              method="POST"
              url={`https://admin.hlx.page/status/${owner || '{owner}'}/${repo || '{repo}'}/${ref || '{ref}'}/*`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading || paths[0].trim() === ''}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Run Bulk Status Job
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={() => {}}
        requestDetails={requestDetails}
      />

      {status && (
        <StatusResponseDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}

      {jobLink && (
        <JobPolling jobLink={jobLink} />
      )}
    </Box>
  );
};

export default StatusBulkJob; 