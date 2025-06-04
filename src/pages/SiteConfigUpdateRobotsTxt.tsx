import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import RobotsDisplay from '../components/response/RobotsDisplay';
import SiteInputs from 'components/SiteInputs';
import { apiCall } from 'utils/api';
import { useErrorHandler } from '../hooks/useErrorHandler';

const SiteConfigUpdateRobotsTxt: React.FC = () => {
  const { owner, site } = useResource();
  const [robotsTxt, setRobotsTxt] = useState('');
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const { error: textError, handleError, clearError } = useErrorHandler();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  // Fetch current robots.txt when component mounts or owner/site changes
  useEffect(() => {
    const fetchRobotsTxt = async () => {
      if (owner && site) {
        const details = {
          url: `https://admin.hlx.page/config/${owner}/sites/${site}/robots.txt`,
          method: 'GET',
          headers: {
            'Accept': 'text/plain'
          },
          queryParams: {},
          body: null
        };
        try {
          const { status, responseData } = await apiCall(details);
          if (status === 200) {
            setRobotsTxt(responseData);
          }
        } catch (error) {
          handleError(error, 'Error fetching robots.txt');
          setRobotsTxt('');
        }
      }
    };
    fetchRobotsTxt();
  }, [owner, site]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const details = {
      url: `https://admin.hlx.page/config/${owner}/sites/${site}/robots.txt`,
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
        'accept': 'text/plain'
      },
      queryParams: {},
      body: robotsTxt
    };
    setRequestDetails(details);
    await executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Update Site robots.txt Config"
        description="Updates the site level robots.txt configuration."
        icon={WebIcon}
        helpUrl="https://www.aem.live/docs/admin.html#tag/siteConfig/operation/updateConfigSiteRobots"
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs />
            <TextField
              multiline
              rows={10}
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              label="robots.txt Content"
              required
              placeholder="Enter robots.txt content"
              helperText="robots.txt content in plain text format"
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                },
              }}
            />
            <ApiUrlDisplay
              method="POST"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/sites/${site || '{site}'}/robots.txt`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Update robots.txt Config
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error || textError} 
        onDismiss={() => {
          reset();
          clearError();
          setRequestDetails(null);
        }}
        requestDetails={requestDetails}
      />

      {status && (
        <RobotsDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default SiteConfigUpdateRobotsTxt; 