import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  ButtonGroup,
  Button,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RequestDisplay from '../RequestDisplay';
import StatusCard from '../StatusCard';
import { useResource } from '../../context/ResourceContext';
import { apiCall } from '../../utils/api';

interface SiteReadDisplayProps {
  responseData: any;
  requestDetails: {
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null;
  responseStatus: number;
}

const SiteReadDisplay: React.FC<SiteReadDisplayProps> = ({
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const navigate = useNavigate();
  const { owner, site, setSite } = useResource();

  const handleEditConfig = () => {
    navigate('/site-config/update');
  };

  const handleDeleteConfig = () => {
    navigate('/site-config/delete');
  };

  const handleCopyConfig = async () => {
    try {
      // Store the config in sessionStorage
      sessionStorage.setItem('copiedSiteConfig', JSON.stringify(responseData));
      // Navigate to create page
      setSite('');
      navigate('/site-config/create');
    } catch (error) {
      console.error('Error copying site config:', error);
    }
  };

  const renderResponse = (data: any): React.ReactNode => {
    // if the response has no data e.g. 204 No Content
    if (Object.keys(data).length === 0) return (
      <StatusCard
        title="No Content"
        status={responseStatus}
        data={{}}
      />
    );
    return (
      <StatusCard
        title=""
        status={responseStatus}
        data={data}
      />
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
        pt: 1,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Response</Typography>
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
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Site Config">
            <IconButton onClick={handleEditConfig} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Site Config">
            <IconButton onClick={handleDeleteConfig} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy Site Config">
            <IconButton onClick={handleCopyConfig} size="small">
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {showRaw ? (
        <Paper sx={{ p: 2, mt: 2 }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </Paper>
      ) : (
        renderResponse(responseData)
      )}
    </Box>
  );
};

export default SiteReadDisplay; 