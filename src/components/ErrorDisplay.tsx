import React from 'react';
import RequestDisplay from './RequestDisplay';
import {
  Alert,
  AlertTitle,
  Button,
  Typography,
  Box
} from '@mui/material';
import { ErrorDetails } from '../utils/errorUtils';

interface ErrorDisplayProps {
  error: ErrorDetails | null;
  onDismiss: () => void;
  requestDetails: any;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss, requestDetails }) => {
  if (!error) return null;

  return (
    <Box>
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          <Button color="inherit" size="small" onClick={onDismiss}>
            Dismiss
          </Button>
        }
      >
        <AlertTitle>Error</AlertTitle>
        <Typography variant="body1" gutterBottom>
          {error.message}
        </Typography>
        {error.status && (
          <Typography variant="body2" color="text.secondary">
            Status Code: {error.status}
          </Typography>
        )}
        {error.errorHeaders && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="error" gutterBottom>
              Error Headers:
            </Typography>
            <Box component="pre" sx={{ 
              bgcolor: 'error.light',
              color: 'error.contrastText',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {error.errorHeaders.errorCode && (
                <div>X-Error-Code: {error.errorHeaders.errorCode}</div>
              )}
              {error.errorHeaders.error && (
                <div>X-Error: {error.errorHeaders.error}</div>
              )}
            </Box>
          </Box>
        )}
        {error.details && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Technical Details:
            </Typography>
            <Box
              component="pre"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                p: 1,
                borderRadius: 1
              }}
            >
              {error.details}
            </Box>
          </Box>
        )}
      </Alert>
      {requestDetails && (
        <RequestDisplay requestDetails={requestDetails} />
      )}
    </Box>
  );
};

export default ErrorDisplay; 