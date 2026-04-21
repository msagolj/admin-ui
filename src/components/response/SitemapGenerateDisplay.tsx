import React from 'react';
import { Paper, Typography } from '@mui/material';
import ResponseLayout from './ResponseLayout';
import { RequestDetails } from '../../types';

interface SitemapGenerateDisplayProps {
  responseData: { paths?: string[] } | null;
  requestDetails: RequestDetails | null;
  responseStatus: number;
}

const SitemapGenerateDisplay: React.FC<SitemapGenerateDisplayProps> = ({
  responseData,
  requestDetails,
  responseStatus,
}) => {
  return (
    <ResponseLayout
      requestDetails={requestDetails}
      responseData={responseData}
      responseStatus={responseStatus}
    >
      {responseStatus === 204 ? (
        <Paper sx={{ p: 2, mt: 2, border: 1, borderColor: 'grey.300' }}>
          <Typography variant="body1" color="text.secondary">
            Path specified is no destination for any sitemap configured
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, mt: 2, border: 1, borderColor: 'grey.300' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Generated sitemap paths:
          </Typography>
          {responseData?.paths?.map((path: string, index: number) => (
            <Typography key={index} variant="body2" sx={{ ml: 2 }}>
              {'\u2022'} {path}
            </Typography>
          ))}
        </Paper>
      )}
    </ResponseLayout>
  );
};

export default SitemapGenerateDisplay;
