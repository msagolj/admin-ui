import React from 'react';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useLocation } from 'react-router-dom';
import ResponseLayout from './ResponseLayout';
import { RequestDetails } from '../../types';

const RobotsDisplay: React.FC<{
  requestDetails: RequestDetails | null;
  responseData: string;
  responseStatus: number;
}> = ({ requestDetails, responseData, responseStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = () => navigate('/site-config/update-robots-txt');

  const formatRobotsTxt = (content: string): React.ReactNode => {
    if (!content) return null;

    const lines = content.split('\n');
    return (
      <Box sx={{
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        '& .directive': { color: '#2196f3', fontWeight: 'bold' },
        '& .comment': { color: '#757575', fontStyle: 'italic' },
        '& .value': { color: '#4caf50' },
      }}>
        {lines.map((line, index) => {
          if (!line.trim()) return <br key={index} />;
          if (line.trim().startsWith('#')) {
            return <div key={index} className="comment">{line}</div>;
          }
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
          return <div key={index}>{line}</div>;
        })}
      </Box>
    );
  };

  const toolbar = location.pathname === '/site-config/read-robots-txt' ? (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="Edit Robots.txt">
        <IconButton onClick={handleEdit} size="small"><EditIcon /></IconButton>
      </Tooltip>
    </Box>
  ) : undefined;

  return (
    <ResponseLayout
      requestDetails={requestDetails}
      responseData={responseData}
      responseStatus={responseStatus}
      toolbar={toolbar}
    >
      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        {formatRobotsTxt(responseData)}
      </Paper>
    </ResponseLayout>
  );
};

export default RobotsDisplay;
