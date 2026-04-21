import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ResponseLayout from './ResponseLayout';
import { useResource } from '../../context/ResourceContext';
import { RequestDetails } from '../../types';

interface APIKey {
  pathId: string;
  id: string;
  description?: string;
  roles?: string[];
  created?: string;
  expiration?: string;
}

interface SiteListAPIKeysDisplayProps {
  responseData: any;
  requestDetails: RequestDetails | null;
  responseStatus: number;
}

const SiteListAPIKeysDisplay: React.FC<SiteListAPIKeysDisplayProps> = ({
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const navigate = useNavigate();
  const { setApiKeyId } = useResource();

  const handleDeleteAPIKey = (apiKeyId: string) => {
    setApiKeyId(apiKeyId);
    navigate('/site-config/delete-api-key');
  };

  const handleCreateAPIKey = () => navigate('/site-config/create-api-key');

  let apiKeys: APIKey[] = [];
  if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
    apiKeys = Object.entries(responseData).map(([keyId, keyData]) => {
      const d = keyData as Record<string, any>;
      return {
        pathId: keyId,
        id: d.id,
        description: d.description,
        roles: d.roles,
        created: d.created,
        expiration: d.expiration,
      };
    });
  }

  const sortedAPIKeys = [...apiKeys].sort((a, b) => {
    const aDesc = a.description || a.id || '';
    const bDesc = b.description || b.id || '';
    return aDesc.localeCompare(bDesc);
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatRoles = (roles?: string[]) => {
    if (!roles || roles.length === 0) return 'N/A';
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {roles.map((role) => (
          <Chip key={role} label={role} size="small" variant="outlined" />
        ))}
      </Box>
    );
  };

  const toolbar = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="Create API Key">
        <IconButton onClick={handleCreateAPIKey} size="small"><AddIcon /></IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <ResponseLayout
      requestDetails={requestDetails}
      responseData={responseData}
      responseStatus={responseStatus}
      showToggle={!!responseData}
      toolbar={toolbar}
      sticky
    >
      {sortedAPIKeys.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No API keys found for this site.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, border: 1, borderColor: 'grey.300' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Actions</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>API Key ID</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Roles</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Created</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Expiration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAPIKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleDeleteAPIKey(apiKey.pathId)} title="Delete API Key">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{apiKey.id}</Typography>
                  </TableCell>
                  <TableCell>{apiKey.description || 'N/A'}</TableCell>
                  <TableCell>{formatRoles(apiKey.roles)}</TableCell>
                  <TableCell>{formatDate(apiKey.created)}</TableCell>
                  <TableCell>{formatDate(apiKey.expiration)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </ResponseLayout>
  );
};

export default SiteListAPIKeysDisplay;
