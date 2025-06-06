import React, { useState, useEffect, useRef } from 'react';
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
import ResponseDisplay from '../components/response/ResponseDisplay';
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
  const jsonEditorRef = useRef<any>(null);

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
          const { status, responseData } = await apiCall(details);
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

    // Get the latest value from the editor
    const latestConfig = jsonEditorRef.current?.getLatestValue() || config;

    const details = {
      url: `https://admin.hlx.page/config/${owner}/sites/${site}.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      queryParams,
      body: latestConfig
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Update Site Config"
        description="Updates the site level configuration."
        icon={WebIcon}
        helpUrl="https://www.aem.live/docs/admin.html#postUpdate-Site-Config"
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs />
            <JsonEditor
              ref={jsonEditorRef}
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