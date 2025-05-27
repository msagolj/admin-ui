import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Typography
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import OrgListUsersDisplay from '../components/response/OrgListUsersDisplay';
import SiteInputs from 'components/SiteInputs';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

const OrgConfigListUsers: React.FC = () => {
  const { owner, setOwner } = useResource();
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
      url: `https://admin.hlx.page/config/${owner}/users.json`,
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
        title="List Users"
        description="Returns the list of users for the specified organization."
        helpUrl="https://www.aem.live/docs/admin.html#tag/orgConfig/operation/listOrgUsers"
        icon={BusinessIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs
              hideSite={true}
             />
            <ApiUrlDisplay
              method="GET"
              url={`https://admin.hlx.page/config/${owner || '{org}'}/users.json`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              List Users
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

      {status && 
        <OrgListUsersDisplay 
          users={responseData} 
          requestDetails={requestDetails}
          responseStatus={status}
        />
      }

    </Box>
  );
};

export default OrgConfigListUsers; 