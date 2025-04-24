import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MethodBadge from './MethodBadge';


const ApiUrlDisplay: React.FC<{ method: 'GET' | 'POST' | 'PUT' | 'DELETE'; url: string }> = ({ method, url }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <Box sx={{ 
      mt: 1, 
      p: 2, 
      bgcolor: 'grey.100', 
      borderRadius: 1,
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      wordBreak: 'break-all',
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MethodBadge method={method} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          API URL:
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {url}
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title={copySuccess ? "Copied!" : "Copy URL"}>
          <IconButton 
            size="small" 
            onClick={handleCopyUrl}
            color={copySuccess ? "success" : "default"}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ApiUrlDisplay; 