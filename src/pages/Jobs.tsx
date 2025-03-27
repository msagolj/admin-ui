import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Jobs: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Jobs
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View and manage background jobs.
      </Typography>
      <Paper sx={{ p: 3 }}>
        {/* Jobs management form will go here */}
      </Paper>
    </Box>
  );
};

export default Jobs; 