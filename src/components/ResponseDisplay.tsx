import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Divider
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';

interface ResponseDisplayProps {
  data: any;
  formattedContent: React.ReactNode;
  apiUrl: string;
  method?: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: any;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  data,
  formattedContent,
  apiUrl,
  method = 'GET',
  headers,
  queryParams,
  body
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  const formatQueryString = (params: Record<string, string> | undefined) => {
    if (!params || Object.keys(params).length === 0) return '';
    return '?' + Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  };

  const formatBody = (body: any) => {
    if (!body) return '';
    return typeof body === 'string' ? body : JSON.stringify(body, null, 2);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant={showRaw ? "contained" : "outlined"}
          onClick={() => setShowRaw(!showRaw)}
          startIcon={showRaw ? <VisibilityIcon /> : <CodeIcon />}
        >
          {showRaw ? "Show Formatted" : "Show Raw"}
        </Button>
        <Button
          variant={showRequest ? "contained" : "outlined"}
          onClick={() => setShowRequest(!showRequest)}
          startIcon={<SendIcon />}
        >
          {showRequest ? "Hide Request" : "Show Request"}
        </Button>
      </Box>

      {showRequest && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            API Request
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
                Method
              </Typography>
              <Typography variant="body2">
                {method}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
                URL
              </Typography>
              <Typography variant="body2">
                {apiUrl}{formatQueryString(queryParams)}
              </Typography>
            </Box>
          </Box>

          {headers && Object.keys(headers).length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Headers
              </Typography>
              <Box component="pre" sx={{ 
                bgcolor: 'grey.100', 
                p: 1, 
                borderRadius: 1, 
                overflow: 'auto',
                fontSize: '0.875rem'
              }}>
                {Object.entries(headers)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n')}
              </Box>
            </>
          )}

          {body && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Request Body
              </Typography>
              <Box component="pre" sx={{ 
                bgcolor: 'grey.100', 
                p: 1, 
                borderRadius: 1, 
                overflow: 'auto',
                fontSize: '0.875rem'
              }}>
                {formatBody(body)}
              </Box>
            </>
          )}
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          API Response
        </Typography>
        {showRaw ? (
          <Box component="pre" sx={{ 
            bgcolor: 'grey.100', 
            p: 1, 
            borderRadius: 1, 
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            {JSON.stringify(data, null, 2)}
          </Box>
        ) : (
          formattedContent
        )}
      </Paper>
    </Box>
  );
};

export default ResponseDisplay; 