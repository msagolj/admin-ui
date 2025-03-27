import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TerminalIcon from '@mui/icons-material/Terminal';
import MethodBadge from './MethodBadge';

interface ApiUrlDisplayProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  queryParams?: Record<string, string>;
  body?: any;
}

const ApiUrlDisplay: React.FC<ApiUrlDisplayProps> = ({ method, url, queryParams, body }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyCurlSuccess, setCopyCurlSuccess] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const copyCurl = async () => {
    const token = localStorage.getItem('authToken');
    const headers = token ? `-H 'x-auth-token: ${token}'` : '';
    const queryString = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : '';
    const bodyString = body ? `-d '${JSON.stringify(body)}'` : '';
    const curlCommand = `curl -X ${method} ${headers} '${url}${queryString}' ${bodyString}`;
    
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopyCurlSuccess(true);
      setTimeout(() => setCopyCurlSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy curl command:', err);
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
        <Tooltip title={copyCurlSuccess ? "Copied!" : "Copy as cURL"}>
          <IconButton 
            size="small" 
            onClick={copyCurl}
            color={copyCurlSuccess ? "success" : "default"}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <TerminalIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ApiUrlDisplay; 