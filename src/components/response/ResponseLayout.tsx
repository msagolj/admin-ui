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
import RequestDisplay from '../RequestDisplay';
import { RequestDetails } from '../../types';

interface ResponseLayoutProps {
  requestDetails: RequestDetails | null;
  responseData: any;
  responseStatus: number;
  /** Optional extra controls rendered next to the raw/formatted toggle */
  headerActions?: React.ReactNode;
  /** Optional content rendered between the header and the response body (e.g. action buttons) */
  toolbar?: React.ReactNode;
  /** Whether to show the raw/formatted toggle. Defaults to true. */
  showToggle?: boolean;
  /** Whether to make the header sticky */
  sticky?: boolean;
  /** Render the formatted view */
  children: React.ReactNode;
}

const ResponseLayout: React.FC<ResponseLayoutProps> = ({
  requestDetails,
  responseData,
  responseStatus,
  headerActions,
  toolbar,
  showToggle = true,
  sticky = false,
  children,
}) => {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <Box>
      <RequestDisplay requestDetails={requestDetails} />

      <Divider sx={{ my: 2 }} />

      <Box sx={{
        ...(sticky && {
          position: 'sticky',
          top: '64px',
          zIndex: 1,
          bgcolor: 'background.paper',
          pb: 2,
          pt: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }),
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Response</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {headerActions}
            {showToggle && (
              <ButtonGroup size="small">
                <Button
                  startIcon={<VisibilityIcon />}
                  onClick={() => setShowRaw(!showRaw)}
                  variant={showRaw ? 'contained' : 'outlined'}
                >
                  {showRaw ? 'Show Formatted' : 'Show Raw'}
                </Button>
              </ButtonGroup>
            )}
          </Box>
        </Box>
        {toolbar}
      </Box>

      {showRaw ? (
        <Paper sx={{ p: 2, mt: 2 }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {typeof responseData === 'string' ? responseData : JSON.stringify(responseData, null, 2)}
          </pre>
        </Paper>
      ) : (
        children
      )}
    </Box>
  );
};

export default ResponseLayout;
