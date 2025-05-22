import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Divider,
  Link
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RequestDisplay from '../RequestDisplay';
import StatusCard from '../StatusCard';

const ResponseDisplay: React.FC<{
  requestDetails: any;
  responseData: any;
  responseStatus: number;
}> = (props) => {
  const { requestDetails, responseData, responseStatus } = props;
  const [showRaw, setShowRaw] = useState(false);

  const ignoreKeys = ["links"];

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
          status= {responseStatus}
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
          renderResponse(responseData)
        )}

    </Box>
  );
};

export default ResponseDisplay; 