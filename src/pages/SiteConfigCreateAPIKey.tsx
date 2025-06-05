import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/response/ResponseDisplay';
import SiteInputs from '../components/SiteInputs';
import { useErrorHandler } from '../hooks/useErrorHandler';

const AVAILABLE_ROLES = [
  'admin',
  'author', 
  'publish',
  'develop',
  'basic_author',
  'basic_publish',
  'config',
  'config_admin'
];

const SiteConfigCreateAPIKey: React.FC = () => {
  const { owner, site } = useResource();
  const [description, setDescription] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [jwt, setJwt] = useState('');
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const { error: formError, handleError, clearError } = useErrorHandler();
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  const handleRoleChange = (event: SelectChangeEvent<typeof roles>) => {
    const value = event.target.value;
    setRoles(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validate required fields
    if (!description.trim()) {
      handleError(new Error('Description is required'), 'Validation Error');
      return;
    }

    if (roles.length === 0) {
      handleError(new Error('At least one role must be selected'), 'Validation Error');
      return;
    }

    // Build the request body
    const requestBody: any = {
      description: description.trim(),
      roles: roles
    };

    // Add JWT if provided (optional for import)
    if (jwt.trim()) {
      requestBody.jwt = jwt.trim();
    }

    const details = {
      url: `https://admin.hlx.page/config/${owner}/sites/${site}/apiKeys.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      queryParams: {},
      body: requestBody
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Create Site Admin API Key"
        description="Creates or imports a new admin API key for the specified site."
        helpUrl="https://www.aem.live/docs/admin.html#tag/siteConfig/operation/createSiteApiKey"
        icon={WebIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs />
            
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter a description for this API key"
              helperText="A descriptive name or purpose for this API key"
            />

            <FormControl fullWidth required>
              <InputLabel>Roles</InputLabel>
              <Select
                multiple
                value={roles}
                onChange={handleRoleChange}
                input={<OutlinedInput label="Roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {AVAILABLE_ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="JWT (Optional)"
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
              placeholder="Enter JWT token to import existing key"
              helperText="Optional: Provide a JWT token to import an existing API key"
              multiline
              rows={3}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                },
              }}
            />

            <ApiUrlDisplay
              method="POST"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/sites/${site || '{site}'}/apiKeys.json`}
            />
            
            <Button
              variant="contained"
              type="submit"
              disabled={loading || !owner || !site}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Create API Key
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error || formError} 
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

export default SiteConfigCreateAPIKey; 