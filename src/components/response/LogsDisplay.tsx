import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ResponseLayout from './ResponseLayout';
import { RequestDetails } from '../../types';

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
    links?: { next: string };
  } | null;
  requestDetails: RequestDetails | null;
  responseStatus: number;
}

const LogsDisplay: React.FC<LogsDisplayProps> = ({
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const entries = responseData?.entries || [];

  return (
    <ResponseLayout
      requestDetails={requestDetails}
      responseData={responseData}
      responseStatus={responseStatus}
      showToggle={entries.length > 0}
    >
      {entries.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No logs found for the specified time range.
        </Typography>
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
              {entries.map((entry, index) => (
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
    </ResponseLayout>
  );
};

export default LogsDisplay;
