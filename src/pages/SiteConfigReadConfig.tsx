import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/overlays/ResponseDisplay';
import SiteInputs from 'components/SiteInputs';

const SiteConfigReadConfig: React.FC = () => {
  const { owner, site } = useResource();
  const [migrate, setMigrate] = useState(false);
  const [validate, setValidate] = useState(false);
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
    const queryParams: Record<string, string> = {};
    if (migrate) {
      queryParams.migrate = 'true';
      if (validate) {
        queryParams.validate = 'true';
      }
    }

    const details = {
      url: `https://admin.hlx.page/config/${owner}/sites/${site}.json`,
      method: 'GET',
      headers: {},
      queryParams,
      body: null
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Read Site Config"
        description="Returns the site level configuration. If migrate is set to true, the configuration will be aggregated based on the legacy config (fstab, .helix/config.xlsx, etc)."
        helpUrl="https://www.aem.live/docs/admin.html#tag/siteConfig/operation/getConfigSite"
        icon={WebIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs />
            <FormControlLabel
              control={
                <Switch
                  checked={migrate}
                  onChange={(e) => setMigrate(e.target.checked)}
                />
              }
              label="Migrate config"
            />
            {migrate && (
              <FormControlLabel
                control={
                  <Switch
                    checked={validate}
                    onChange={(e) => setValidate(e.target.checked)}
                  />
                }
                label="Validate config"
              />
            )}
            <ApiUrlDisplay
              method="GET"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/sites/${site || '{site}'}.json`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Read Site Config
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
        <ResponseDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default SiteConfigReadConfig; 