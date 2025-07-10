import React, { useState } from 'react';
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
import ProfileListProfilesDisplay from '../components/response/ProfileListProfilesDisplay';
import SiteInputs from '../components/SiteInputs';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface Profile {
  name: string;
}

const ProfileConfigListProfiles: React.FC = () => {
  const { owner } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const { error: jsonError, handleError, clearError } = useErrorHandler();
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
      url: `https://admin.hlx.page/config/${owner}/profiles.json`,
      method: 'GET',
      headers: {},
      queryParams: {},
      body: null
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="List Profiles"
        description="Returns a list of all configuration profiles in the organization."
        icon={TuneIcon}
        helpUrl="https://www.aem.live/docs/admin.html#getList-Profile-Config"
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs
              hideSite={true}
             />
            <ApiUrlDisplay
              method="GET"
              url={`https://admin.hlx.page/config/${owner || '{org}'}/profiles.json`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              List Profiles
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
        <ProfileListProfilesDisplay
          responseData={responseData}
          requestDetails={requestDetails}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default ProfileConfigListProfiles; 