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
import StatusCard from '../StatusCard';

const StatusResponseDisplay: React.FC<{
  requestDetails: any;
  responseData: any;
  responseStatus: number;
}> = (props) => {
  const { requestDetails, responseData, responseStatus } = props;
  const [showRaw, setShowRaw] = useState(false);

  const statusCards = ["live", "preview", "code", "edit", "job"];

  const renderStatusCards = (data: any): React.ReactNode => {

    return Object.entries(data).map(([key, value]) => {
      // Check if the value is a non-null object and its 
      // key exists in statusCards array and has properties
      if (typeof value === 'object' && value !== null && 
          statusCards.includes(key) && Object.keys(value).length > 0) {
        return (
          <StatusCard
            key={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            status={data[key].status ? data[key].status : responseStatus}
            data={data[key]}
          />
        );
      }
      return null;
    });
  };

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
              startIcon={<VisibilityIcon />}
              onClick={() => setShowRaw(!showRaw)}
              variant={showRaw ? 'contained' : 'outlined'}
            >
              {showRaw ? 'Show Formatted' : 'Show Raw'}
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      {showRaw ? (
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(responseData, null, 2)}
        </pre>
      ) : (
        renderStatusCards(responseData)
      )}
    </Box>
  );
};

export default StatusResponseDisplay; 