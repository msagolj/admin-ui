import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useLocation } from 'react-router-dom';
import RequestDisplay from '../RequestDisplay';

const RobotsDisplay: React.FC<{
  requestDetails: any;
  responseData: string;
  responseStatus: number;
}> = (props) => {
  const { requestDetails, responseData, responseStatus } = props;
  const [showRaw, setShowRaw] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = () => {
    navigate('/site-config/update-robots-txt');
  };

  const formatRobotsTxt = (content: string): React.ReactNode => {
    if (!content) return null;

    const lines = content.split('\n');
    return (
      <Box sx={{ 
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        '& .directive': {
          color: '#2196f3', // blue
          fontWeight: 'bold',
        },
        '& .comment': {
          color: '#757575', // grey
          fontStyle: 'italic',
        },
        '& .value': {
          color: '#4caf50', // green
        },
      }}>
        {lines.map((line, index) => {
          // Skip empty lines
          if (!line.trim()) {
            return <br key={index} />;
          }

          // Handle comments
          if (line.trim().startsWith('#')) {
            return (
              <div key={index} className="comment">
                {line}
              </div>
            );
          }

          // Handle directives
          const parts = line.split(':');
          if (parts.length >= 2) {
            const directive = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            return (
              <div key={index}>
                <span className="directive">{directive}:</span>
                <span className="value">{value}</span>
              </div>
            );
          }

          // Handle other lines
          return <div key={index}>{line}</div>;
        })}
      </Box>
    );
  };

  return (
    <Box>
      <RequestDisplay
        requestDetails={requestDetails}
      />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">Response</Typography>
          <ButtonGroup size="small">
            <Button
              startIcon={<VisibilityIcon />}
              onClick={() => setShowRaw(!showRaw)}
              variant={showRaw ? 'contained' : 'outlined'}
            >
              {showRaw ? 'Show Formatted' : 'Show Raw'}
            </Button>
          </ButtonGroup>
        </Box>
        {location.pathname === '/site-config/read-robots-txt' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit Robots.txt">
              <IconButton onClick={handleEdit} size="small">
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Box sx={{ mb: 2 }}>
          {showRaw ? (
            <Box
              component="pre"
              sx={{
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                m: 0,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
              }}
            >
              {responseData}
            </Box>
          ) : (
            formatRobotsTxt(responseData)
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default RobotsDisplay; 