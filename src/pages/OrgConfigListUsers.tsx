import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from 'components/ResponseDisplay';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

const OrgConfigListUsers: React.FC = () => {
  const { owner, setOwner } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const [showDefault, setShowDefault] = useState(false);
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

  const renderUsersTable = (users: User[]) => {
    if (!users || users.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No users found for this organization.
        </Typography>
      );
    }

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowDefault(!showDefault)}
          >
            {showDefault ? 'List View' : 'Default View'}
          </Button>
        </Box>
        {showDefault ? (
          <ResponseDisplay
            requestDetails={requestDetails}
            responseData={responseData}
            responseStatus={status || 0}
          />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.roles.join(', ')}</TableCell>
                    <TableCell>{user.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
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
            <TextField
              fullWidth
              label="Organization"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              required
              placeholder="Organization name"
              helperText="Name of the organization"
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

      {status === 200 && responseData && Array.isArray(responseData) && (
        renderUsersTable(responseData)
      )}

      {status && status !== 200 && (
        <ResponseDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default OrgConfigListUsers; 