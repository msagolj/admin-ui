import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { SvgIconComponent } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  description: string | React.ReactNode;
  helpUrl: string;
  icon: SvgIconComponent;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, helpUrl, icon: Icon }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon sx={{ fontSize: 32, color: 'black' }} />
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
        </Box>
        <Tooltip title="View documentation">
          <IconButton
            component="a"
            href={helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <HelpIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        {description}
      </Typography>
    </Box>
  );
};

export default PageHeader; 