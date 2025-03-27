import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Index: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Index
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage and re-index resources.
      </Typography>
      <Paper sx={{ p: 3 }}>
        {/* Index management form will go here */}
      </Paper>
    </Box>
  );
};

export default Index; 