import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StatusCard from '../StatusCard';
import ResponseLayout from './ResponseLayout';
import { useResource } from '../../context/ResourceContext';
import { RequestDetails } from '../../types';

interface SiteReadDisplayProps {
  responseData: any;
  requestDetails: RequestDetails | null;
  responseStatus: number;
}

const SiteReadDisplay: React.FC<SiteReadDisplayProps> = ({
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const navigate = useNavigate();
  const { setSite } = useResource();
  const data = responseData ?? {};

  const handleEditConfig = () => navigate('/site-config/update');
  const handleDeleteConfig = () => navigate('/site-config/delete');

  const handleCopyConfig = async () => {
    try {
      sessionStorage.setItem('copiedSiteConfig', JSON.stringify(responseData));
      setSite('');
      navigate('/site-config/create');
    } catch (error) {
      console.error('Error copying site config:', error);
    }
  };

  const toolbar = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="Edit Site Config">
        <IconButton onClick={handleEditConfig} size="small"><EditIcon /></IconButton>
      </Tooltip>
      <Tooltip title="Delete Site Config">
        <IconButton onClick={handleDeleteConfig} size="small"><DeleteIcon /></IconButton>
      </Tooltip>
      <Tooltip title="Copy Site Config">
        <IconButton onClick={handleCopyConfig} size="small"><ContentCopyIcon /></IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <ResponseLayout
      requestDetails={requestDetails}
      responseData={responseData}
      responseStatus={responseStatus}
      toolbar={toolbar}
      sticky
    >
      {Object.keys(data).length === 0 ? (
        <StatusCard title="No Content" status={responseStatus} data={{}} />
      ) : (
        <StatusCard title="" status={responseStatus} data={data} />
      )}
    </ResponseLayout>
  );
};

export default SiteReadDisplay;
