import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const OrgConfig: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Organization Configuration
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage organization settings and configurations.
      </Typography>
      <Paper sx={{ p: 3 }}>
        {/* Organization configuration form will go here */}
      </Paper>
    </Box>
  );
};

export default OrgConfig; 