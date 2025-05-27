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
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RequestDisplay from '../RequestDisplay';
import { useResource } from '../../context/ResourceContext';
import { apiCall } from '../../utils/api';

interface Site {
  name: string;
}

interface SiteListSitesDisplayProps {
  responseData: { sites: Site[] } | null;
  requestDetails: {
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null;
  responseStatus: number;
}

const SiteListSitesDisplay: React.FC<SiteListSitesDisplayProps> = ({ 
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const navigate = useNavigate();
  const { setSite, owner } = useResource();

  const handleViewConfig = (siteName: string) => {
    setSite(siteName);
    navigate('/site-config/read');
  };

  const handleEditConfig = (siteName: string) => {
    setSite(siteName);
    navigate('/site-config/update');
  };

  const handleDeleteConfig = (siteName: string) => {
    setSite(siteName);
    navigate('/site-config/delete');
  };

  const handleCopyConfig = async (siteName: string) => {
    try {
      const details = {
        url: `https://admin.hlx.page/config/${owner}/sites/${siteName}.json`,
        method: 'GET',
        headers: {},
        queryParams: {},
        body: null
      };
      
      const { responseData } = await apiCall(details);
      if (responseData) {
        // Store the config in sessionStorage
        sessionStorage.setItem('copiedSiteConfig', JSON.stringify(responseData));
        // Navigate to create page
        setSite('');
        navigate('/site-config/create');
      }
    } catch (error) {
      console.error('Error copying site config:', error);
    }
  };

  const sites = responseData?.sites || [];

  return (
    <Box>
      <RequestDisplay
        requestDetails={requestDetails}
      />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Response</Typography>
        {sites.length > 0 && (
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

      {sites.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No sites found for this organization.
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
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Site Name</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Config Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.name}>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteConfig(site.name)}
                      title="Delete Site Config"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleViewConfig(site.name)}
                      title="View Site Config"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditConfig(site.name)}
                      title="Edit Site Config"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleCopyConfig(site.name)}
                      title="Copy Site Config"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{`/config/${site.name}.json`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SiteListSitesDisplay; 