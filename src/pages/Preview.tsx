import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Preview: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Preview
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Update preview resources by fetching the latest content from content providers.
      </Typography>
      <Paper sx={{ p: 3 }}>
        {/* Preview form will go here */}
      </Paper>
    </Box>
  );
};

export default Preview; 