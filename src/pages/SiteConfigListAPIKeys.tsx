import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import WebIcon from '@mui/icons-material/Web'; // Using VpnKeyIcon for API Keys
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import SiteListAPIKeysDisplay from '../components/response/SiteListAPIKeysDisplay';
import SiteInputs from '../components/SiteInputs';

const SiteConfigListAPIKeys: React.FC = () => {
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
      url: `https://admin.hlx.page/config/${owner}/sites/${site}/apiKeys.json`,
      method: 'GET',
      headers: {}, // Add Auth headers if needed via useFormState or apiCall utility
      queryParams: {},
      body: null
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="List Site Admin API Keys"
        description="Returns a list of admin API keys for the specified site."
        helpUrl="https://www.aem.live/docs/admin.html#tag/siteConfig/operation/listSiteApiKeys"
        icon={WebIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs />
            <ApiUrlDisplay
              method="GET"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/sites/${site || '{site}'}/apiKeys.json`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading || !owner || !site}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              List API Keys
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

      {status && responseData && (
        <SiteListAPIKeysDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default SiteConfigListAPIKeys; 