import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/response/ResponseDisplay';
import ProfileInputs from '../components/ProfileInputs';
import JsonEditor from '../components/JsonEditor';
import { apiCall } from '../utils/api';
import { useErrorHandler } from '../hooks/useErrorHandler';

const ProfileConfigUpdateProfile: React.FC = () => {
  const { owner, profile } = useResource();
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

  // Fetch current config when component mounts or owner/profile changes
  useEffect(() => {
    const fetchConfig = async () => {
      if (owner && profile) {
        const details = {
          url: `https://admin.hlx.page/config/${owner}/profiles/${profile}.json`,
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
  }, [owner, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Get the latest value from the editor
    const latestConfig = jsonEditorRef.current?.getLatestValue() || config;

    const details = {
      url: `https://admin.hlx.page/config/${owner}/profiles/${profile}.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      queryParams: {},
      body: latestConfig
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Update Profile Config"
        description="Updates the profile level configuration."
        icon={TuneIcon}
        helpUrl="https://www.aem.live/docs/admin.html#postUpdate-Profile-Config"
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ProfileInputs />
            <JsonEditor
              ref={jsonEditorRef}
              value={config}
              onChange={setConfig}
              label="Profile Configuration"
              required
              placeholder="Enter profile configuration as JSON"
              helperText="Profile configuration in JSON format"
            />
            <ApiUrlDisplay
              method="POST"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/profiles/${profile || '{profile}'}.json`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Update Profile Config
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

export default ProfileConfigUpdateProfile; 