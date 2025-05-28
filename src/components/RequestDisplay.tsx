import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Tooltip,
  Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TerminalIcon from '@mui/icons-material/Terminal';
import { renderValue } from '../utils/renderUtils';

const RequestDisplay: React.FC<{
  requestDetails: any;
}> = (props) => {
  const { headers, method, url, body, queryParams } = props.requestDetails;
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [copyCurlSuccess, setCopyCurlSuccess] = useState(false);

  const copyCurl = async () => {
    // Add query parameters to URL if they exist
    let fullUrl = url;
    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          params.append(key, value as string);
        }
      });
      const queryString = params.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
      }
    }

    const curlCommand = `curl -v -X ${method} "${fullUrl}" \\
  ${Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' \\\n  ')} \\
  ${body ? `-d '${JSON.stringify(body)}'` : ''}`;

    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopyCurlSuccess(true);
      setTimeout(() => setCopyCurlSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy cURL command:', err);
    }
  };

  return (
    <Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Request</Typography>
        <Box>
          <ButtonGroup size="small">
            <Button
              startIcon={showRequestDetails ? <VisibilityOffIcon /> : <VisibilityIcon />}
              onClick={() => setShowRequestDetails(!showRequestDetails)}
              variant={showRequestDetails ? 'contained' : 'outlined'}
            >
              {showRequestDetails ? 'Hide Request' : 'Show Request'}
            </Button>
            <Tooltip title={copyCurlSuccess ? "Copied!" : "Copy as cURL"}>
              <Button
                startIcon={<TerminalIcon />}
                onClick={copyCurl}
                color={copyCurlSuccess ? "success" : "primary"}
                variant="outlined"
              >
                cURL
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Box>
      </Box>

      {showRequestDetails && (
        <Paper sx={{ p: 2, mb: 2, border: 1, borderColor: 'grey.300' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>Method</Typography>
              <Typography variant="body2">{renderValue('method', method)}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>URL</Typography>
              <Typography variant="body2">{renderValue('url', url)}</Typography>
            </Box>
            {headers && Object.keys(headers).length > 0 && (
              <Box>
                <Typography variant="body2" color="text.primary" sx={{ mb: 0.5, fontWeight: 'bold' }}>Headers</Typography>
                <Box sx={{ pl: 2 }}>
                  {Object.entries(headers).map(([key, value]) => (
                    <Box key={key}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>{key}</Typography>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
                        {renderValue(key, value)}
                      </pre>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            {queryParams && Object.keys(queryParams).length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 'bold' }}>Query Parameters</Typography>
                <Box sx={{ pl: 2 }}>
                  {Object.entries(queryParams).map(([key, value]) => (
                    <Box key={key}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>{key}</Typography>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
                        {renderValue(key, value)}
                      </pre>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            {body && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 'bold' }}>Body</Typography>
                <Box sx={{ pl: 2 }}>
                  <pre style={{ 
                    margin: 0, 
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-all', 
                    backgroundColor: '#f5f5f5', 
                    padding: '1rem', 
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>
                    {JSON.stringify(body, null, 2)}
                  </pre>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default RequestDisplay; 