import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RequestDisplay from '../RequestDisplay';

interface LogEntry {
  timestamp: number;
  duration?: number;
  status?: number;
  method?: string;
  route?: string;
  path?: string;
  contentBusId?: string;
  owner?: string;
  repo?: string;
  ref?: string;
  event?: string;
  user?: string;
  paths?: string[];
  snapshotId?: string;
  details?: string;
}

interface LogsDisplayProps {
  responseData: {
    from: string;
    to: string;
    entries: LogEntry[];
    nextToken?: string;
    links?: {
      next: string;
    };
  } | null;
  requestDetails: {
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null;
  responseStatus: number;
}

const LogsDisplay: React.FC<LogsDisplayProps> = ({
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const [showRaw, setShowRaw] = useState(false);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box>
      <RequestDisplay
        requestDetails={requestDetails}
      />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Response</Typography>
        {responseData?.entries && responseData.entries.length > 0 && (
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
        )}
      </Box>

      {!responseData?.entries || responseData.entries.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No logs found for the specified time range.
        </Typography>
      ) : showRaw ? (
        <Paper sx={{ p: 2, mt: 2 }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, border: 1, borderColor: 'grey.300' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'grey.100', width: '50px' }}></TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Timestamp</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Method</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Route</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Path</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Details</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responseData.entries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Tooltip 
                      title={
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {JSON.stringify(entry, null, 2)}
                        </pre>
                      }
                      arrow
                    >
                      <IconButton size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{formatTimestamp(entry.timestamp)}</TableCell>
                  <TableCell>{entry.method || '-'}</TableCell>
                  <TableCell>{entry.status || '-'}</TableCell>
                  <TableCell>{entry.route || '-'}</TableCell>
                  <TableCell>
                    {entry.paths ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {entry.paths.map((path, i) => (
                          <Typography key={i} variant="body2">{path}</Typography>
                        ))}
                      </Box>
                    ) : entry.path || '-'}
                  </TableCell>
                  <TableCell>{entry.details || '-'}</TableCell>
                  <TableCell>{entry.user || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default LogsDisplay; 