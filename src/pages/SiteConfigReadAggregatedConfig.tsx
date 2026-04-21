import React from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import SiteReadDisplay from '../components/response/SiteReadDisplay';
import SiteInputs from 'components/SiteInputs';
import { ADMIN_API_BASE } from '../types';

const SiteConfigReadAggregatedConfig: React.FC = () => {
  const { owner, site } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset, requestDetails } = useFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const details = {
      url: `${ADMIN_API_BASE}/config/${owner}/aggregated/${site}.json`,
      method: 'GET',
      headers: {},
      queryParams: {},
      body: null
    };
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Read Aggregated Site Config"
        description="Returns the aggregated site level configuration. This includes the inherited values from the profile."
        helpUrl="https://www.aem.live/docs/admin.html#tag/siteConfig/operation/getAggregatedConfigSite"
        icon={WebIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs />
            <ApiUrlDisplay
              method="GET"
              url={`${ADMIN_API_BASE}/config/${owner || '{owner}'}/aggregated/${site || '{site}'}.json`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Read Aggregated Site Config
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay
        error={error}
        onDismiss={reset}
        requestDetails={requestDetails}
      />

      {status && (
        <SiteReadDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default SiteConfigReadAggregatedConfig;
