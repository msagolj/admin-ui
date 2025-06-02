import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RequestDisplay from '../RequestDisplay';

interface SitemapGenerateDisplayProps {
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

const SitemapGenerateDisplay: React.FC<SitemapGenerateDisplayProps> = ({
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <Box>
      <RequestDisplay
        requestDetails={requestDetails}
      />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Response</Typography>
        <Box>
          <ButtonGroup size="small">
            <Button
              startIcon={showRaw ? <VisibilityOffIcon /> : <VisibilityIcon />}
              onClick={() => setShowRaw(!showRaw)}
              variant={showRaw ? 'contained' : 'outlined'}
            >
              {showRaw ? 'Show Formatted' : 'Show Raw'}
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      {responseStatus === 204 ? (
        <Paper sx={{ p: 2, mt: 2, border: 1, borderColor: 'grey.300' }}>
          <Typography variant="body1" color="text.secondary">
            Path specified is no destination for any sitemap configured
          </Typography>
        </Paper>
      ) : showRaw ? (
        <Paper sx={{ p: 2, mt: 2, border: 1, borderColor: 'grey.300' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, mt: 2, border: 1, borderColor: 'grey.300' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Generated sitemap paths:
          </Typography>
          {responseData?.paths?.map((path: string, index: number) => (
            <Typography key={index} variant="body2" sx={{ ml: 2 }}>
              • {path}
            </Typography>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default SitemapGenerateDisplay; 