import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Cache: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cache
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage and purge live cache.
      </Typography>
      <Paper sx={{ p: 3 }}>
        {/* Cache management form will go here */}
      </Paper>
    </Box>
  );
};

export default Cache; 