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
import ProfileReadDisplay from '../components/response/ProfileReadDisplay';
import ProfileInputs from '../components/ProfileInputs';

const ProfileConfigReadProfile: React.FC = () => {
  const { owner, profile } = useResource();
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
      url: `https://admin.hlx.page/config/${owner}/profiles/${profile}.json`,
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
        title="Read Profile Config"
        description="Returns the profile level configuration."
        icon={TuneIcon}
        helpUrl="https://www.aem.live/docs/admin.html#getRead-Profile-Config"
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ProfileInputs />
            <ApiUrlDisplay
              method="GET"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/profiles/${profile || '{profile}'}.json`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Read Profile Config
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
        <ProfileReadDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default ProfileConfigReadProfile; 