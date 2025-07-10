import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/response/ResponseDisplay';
import ProfileInputs from '../components/ProfileInputs';
import JsonEditor from '../components/JsonEditor';
import { useErrorHandler } from '../hooks/useErrorHandler';
import TuneIcon from '@mui/icons-material/Tune';

const ProfileConfigCreateProfile: React.FC = () => {
  const { owner, profile } = useResource();
  const [config, setConfig] = useState<any>();
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const { error: jsonError, handleError, clearError } = useErrorHandler();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  // Check for copied config when component mounts
  useEffect(() => {
    const copiedConfig = sessionStorage.getItem('copiedProfileConfig');
    if (copiedConfig) {
      try {
        const parsedConfig = JSON.parse(copiedConfig);
        // Clear the name field to force user to enter a new one
        parsedConfig.name = '';
        setConfig(parsedConfig);
        // Clear the copied config from storage
        sessionStorage.removeItem('copiedProfileConfig');
      } catch (error) {
        handleError(error, 'Error parsing copied configuration');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Parse the config to ensure it's valid JSON
    let parsedConfig;
    try {
      parsedConfig = typeof config === 'string' ? JSON.parse(config) : config;
    } catch (error) {
      handleError(error, 'Invalid JSON configuration');
      return;
    }

    const details = {
      url: `https://admin.hlx.page/config/${owner}/profiles/${profile}.json`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      queryParams: {},
      body: parsedConfig
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Create Profile Config"
        description="Creates a new configuration profile."
        icon={TuneIcon}
        helpUrl="https://www.aem.live/docs/admin.html#tag/profileConfig/operation/createConfigProfile"
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ProfileInputs />
            <JsonEditor
              value={config}
              onChange={setConfig}
              label="Profile Configuration"
              required
              placeholder="Enter profile configuration as JSON"
              helperText="Profile configuration in JSON format"
            />
            <ApiUrlDisplay
              method="PUT"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/profiles/${profile || '{profile}'}.json`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Create Profile Config
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

export default ProfileConfigCreateProfile; 