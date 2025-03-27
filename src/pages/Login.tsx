import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Login: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage authentication and login settings.
      </Typography>
      <Paper sx={{ p: 3 }}>
        {/* Login management form will go here */}
      </Paper>
    </Box>
  );
};

export default Login; 