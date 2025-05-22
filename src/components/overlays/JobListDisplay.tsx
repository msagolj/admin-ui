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
  Divider,
  ButtonGroup
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RequestDisplay from '../RequestDisplay';

interface Job {
  name: string;
  state: string;
}

interface JobListDisplayProps {
  responseData: { jobs: Job[] } | null;
  requestDetails: {
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null;
  responseStatus: number;
}

const JobListDisplay: React.FC<JobListDisplayProps> = ({ 
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const jobs = responseData?.jobs || [];

  return (
    <Box>
      <RequestDisplay
        requestDetails={requestDetails}
      />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Response</Typography>
        {jobs.length > 0 && (
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

      {jobs.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No jobs found for this repository and topic.
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
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>State</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.name}>
                  <TableCell>{job.name}</TableCell>
                  <TableCell>{job.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default JobListDisplay; 