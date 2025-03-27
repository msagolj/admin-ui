import React from 'react';
import { Chip } from '@mui/material';

interface MethodBadgeProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => {
  return (
    <Chip
      label={method === 'DELETE' ? 'DEL' : method}
      size="small"
      sx={{
        height: '18px',
        width: '48px',
        borderRadius: '4px',
        mr: 1,
        '& .MuiChip-label': {
          px: 1,
          fontSize: '0.7rem',
          fontWeight: 600,
          color: 'white',
          width: '100%',
          textAlign: 'center'
        },
        backgroundColor: method === 'GET' ? 'success.main' :
          method === 'POST' ? 'primary.main' :
          method === 'DELETE' ? 'error.main' :
          'warning.main',
      }}
    />
  );
};

export default MethodBadge; 