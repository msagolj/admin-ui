import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import SiteInputs from 'components/SiteInputs';
import RobotsDisplay from '../components/response/RobotsDisplay';

const SiteConfigReadRobotsTxt: React.FC = () => {
  const { owner, site } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `https://admin.hlx.page/config/${owner}/sites/${site}/robots.txt`,
      method: 'GET',
      headers: {
        'Accept': 'text/plain'
      },
      queryParams: {},
      body: null
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Read Site robots.txt Config"
        description="Returns the site level robots.txt configuration."
        helpUrl="https://www.aem.live/docs/admin.html#tag/siteConfig/operation/getConfigSiteRobots"
        icon={WebIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs />
            <ApiUrlDisplay
              method="GET"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/sites/${site || '{site}'}/robots.txt`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Read robots.txt Config
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={() => {
          reset();
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

export default SiteConfigReadRobotsTxt; 