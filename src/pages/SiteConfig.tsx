import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SiteConfig: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Site Configuration
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage site-specific settings and configurations.
      </Typography>
      <Paper sx={{ p: 3 }}>
        {/* Site configuration form will go here */}
      </Paper>
    </Box>
  );
};

export default SiteConfig; 