import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Sitemap: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sitemap
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate and manage sitemaps.
      </Typography>
      <Paper sx={{ p: 3 }}>
        {/* Sitemap generation form will go here */}
      </Paper>
    </Box>
  );
};

export default Sitemap; 