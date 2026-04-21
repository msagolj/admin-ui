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
  keyframes,
  IconButton,
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ResponseLayout from './ResponseLayout';
import { useNavigate } from 'react-router-dom';
import { useResource } from '../../context/ResourceContext';
import { RequestDetails } from '../../types';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

interface Job {
  name: string;
  state: string;
  time: string;
}

interface JobListDisplayProps {
  responseData: { jobs: Job[] } | null;
  requestDetails: RequestDetails | null;
  responseStatus: number;
}

const JobListDisplay: React.FC<JobListDisplayProps> = ({
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const jobs = responseData?.jobs || [];
  const navigate = useNavigate();
  const { setJobName } = useResource();

  const handleStatusClick = (jobName: string, state: string) => {
    setJobName(jobName);
    if (state.toLowerCase() === 'running') {
      navigate('/jobs/status');
    } else if (state.toLowerCase() === 'stopped') {
      navigate('/jobs/details');
    }
  };

  const getStateIcon = (state: string) => {
    switch (state.toLowerCase()) {
      case 'running':
        return <AutorenewIcon color="primary" sx={{ animation: `${spin} 2s linear infinite` }} />;
      case 'stopped':
        return <CheckCircleIcon color="success" />;
      default:
        return null;
    }
  };

  return (
    <ResponseLayout
      requestDetails={requestDetails}
      responseData={responseData}
      responseStatus={responseStatus}
      showToggle={jobs.length > 0}
    >
      {jobs.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No jobs found for this repository and topic.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, border: 1, borderColor: 'grey.300' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Actions</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>State</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.name}>
                  <TableCell>
                    <Tooltip title={job.state.toLowerCase() === 'running' ? 'View Job Status' : 'View Job Results'}>
                      <IconButton size="small" onClick={() => handleStatusClick(job.name, job.state)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{job.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStateIcon(job.state)}
                      {job.state}
                    </Box>
                  </TableCell>
                  <TableCell>{job.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </ResponseLayout>
  );
};

export default JobListDisplay;
