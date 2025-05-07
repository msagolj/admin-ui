import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from 'components/ResponseDisplay';
import SiteInputs from 'components/SiteInputs';
import JsonEditor from '../components/JsonEditor';
import { apiCall } from 'utils/api';
import { useErrorHandler } from '../hooks/useErrorHandler';

const SiteConfigUpdateSiteConfig: React.FC = () => {
  const { owner, site } = useResource();
  const [migrate, setMigrate] = useState(false);
  const [validate, setValidate] = useState(false);
  const [config, setConfig] = useState<any>({});
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const { error: jsonError, handleError, clearError } = useErrorHandler();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  // Fetch current config when component mounts or owner/site changes
  useEffect(() => {
    const fetchConfig = async () => {
      if (owner && site) {
        const details = {
          url: `https://admin.hlx.page/config/${owner}/sites/${site}.json`,
          method: 'GET',
          headers: {},
          queryParams: {},
        body: null
        };
        try {
          const { status , responseData } = await apiCall(details);
          if (status === 200) {
            setConfig(responseData);
          }
        } catch (error) {
          handleError(error, 'Error fetching config');
          setConfig({});
        }
      }
    };
    fetchConfig();
  }, [owner, site]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const queryParams: Record<string, string> = {};
    if (migrate) {
      queryParams.migrate = 'true';
      if (validate) {
        queryParams.validate = 'true';
      }
    }

    // Parse the config to ensure it's valid JSON
    let parsedConfig;
    try {
      parsedConfig = typeof config === 'string' ? JSON.parse(config) : config;
    } catch (error) {
      handleError(error, 'Invalid JSON configuration');
      return;
    }

    const details = {
      url: `https://admin.hlx.page/config/${owner}/sites/${site}.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      queryParams,
      body: parsedConfig
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Update Site Config"
        description="Updates the site configuration for a specific site. The configuration should be provided as a JSON object."
        helpUrl="https://www.aem.live/docs/admin.html#tag/site-config/operation/updateSiteConfig"
        icon={SettingsIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs />
            <JsonEditor
              value={config}
              onChange={setConfig}
              label="Site Configuration"
              required
              placeholder="Enter site configuration as JSON"
              helperText="Site configuration in JSON format"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={migrate}
                  onChange={(e) => setMigrate(e.target.checked)}
                />
              }
              label="Migrate to latest version"
            />
            {migrate && (
              <FormControlLabel
                control={
                  <Switch
                    checked={validate}
                    onChange={(e) => setValidate(e.target.checked)}
                  />
                }
                label="Validate migration"
              />
            )}
            <ApiUrlDisplay
              method="POST"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/sites/${site || '{site}'}.json`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Update Site Config
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error || jsonError} 
        onDismiss={() => {
          reset();
          clearError();
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

export default SiteConfigUpdateSiteConfig; 