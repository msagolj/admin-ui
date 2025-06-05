import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Divider,
  ButtonGroup,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RequestDisplay from '../RequestDisplay';
import { useResource } from '../../context/ResourceContext';

interface APIKey {
  pathId: string;
  id: string;
  description?: string;
  roles?: string[];
  created?: string;
  expiration?: string;
  status?: string;
}

interface SiteListAPIKeysDisplayProps {
  responseData: any; // Made flexible to handle different response formats
  requestDetails: {
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null;
  responseStatus: number;
}

const SiteListAPIKeysDisplay: React.FC<SiteListAPIKeysDisplayProps> = ({ 
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const navigate = useNavigate();
  const { owner, site, setApiKeyId } = useResource();


  const handleDeleteAPIKey = (apiKeyId: any) => {
    setApiKeyId(apiKeyId);
    navigate(`/site-config/delete-api-key`);
  };

  const handleCreateAPIKey = () => {
    navigate('/site-config/create-api-key');
  };

  // Handle API response format: object with API key IDs as properties
  let apiKeys: APIKey[] = [];
  
  if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
    // Extract API keys from object properties
    apiKeys = Object.entries(responseData).map(([keyId, keyData]) => {
      const apiKeyData = keyData as any;
      return {
        pathId: keyId,
        id: apiKeyData.id,
        description: apiKeyData.description,
        roles: apiKeyData.roles,
        created: apiKeyData.created,
        expiration: apiKeyData.expiration,
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

  return (
    <Box>
      <RequestDisplay
        requestDetails={requestDetails}
      />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ 
        position: 'sticky', 
        top: '64px', // Account for AppBar height
        zIndex: 1, 
        bgcolor: 'background.paper',
        pb: 2,
        pt: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Response</Typography>
          {responseData && (
            <Box>
              <ButtonGroup size="small">
                <Button
                  startIcon={<VisibilityIcon />}
                  onClick={() => setShowRaw(!showRaw)}
                  variant={showRaw ? 'contained' : 'outlined'}
                >
                  {showRaw ? 'Show Formatted' : 'Show Raw'}
                </Button>
              </ButtonGroup>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Create API Key">
            <IconButton onClick={handleCreateAPIKey} size="small">
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {sortedAPIKeys.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No API keys found for this site.
        </Typography>
      ) : showRaw ? (
        <Paper sx={{ p: 2, mt: 2 }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </Paper>
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
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAPIKey(apiKey.pathId)}
                      title="Delete API Key"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {apiKey.id}
                    </Typography>
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
    </Box>
  );
};

export default SiteListAPIKeysDisplay; 