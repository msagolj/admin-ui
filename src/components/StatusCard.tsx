import { Card, CardContent, Typography, Box } from '@mui/material';
import { formatDate } from '../utils/dateUtils';

interface StatusCardProps {
  title: string;
  status: number;
  url?: string;
  lastModified?: string;
  lastModifiedBy?: string;
  contentBusId?: string;
  sourceLocation?: string;
  sourceLastModified?: string;
  permissions?: string[];
}

const StatusCard = ({
  title,
  status,
  url,
  lastModified,
  lastModifiedBy,
  contentBusId,
  sourceLocation,
  sourceLastModified,
  permissions,
}: StatusCardProps) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'warning';
    if (status >= 400 && status < 500) return 'error';
    if (status >= 500) return 'error';
    return 'default';
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              bgcolor: `${getStatusColor(status)}.main`,
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              minWidth: '2.5rem',
              textAlign: 'center',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {status}
          </Typography>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        {url && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
              URL
            </Typography>
            <Typography variant="body2">
              {url}
            </Typography>
          </Box>
        )}
        {lastModified && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
              Last Modified
            </Typography>
            <Typography variant="body2">
              {formatDate(lastModified)}
            </Typography>
          </Box>
        )}
        {lastModifiedBy && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
              Last Modified By
            </Typography>
            <Typography variant="body2">
              {lastModifiedBy}
            </Typography>
          </Box>
        )}
        {contentBusId && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
              Content Bus ID
            </Typography>
            <Typography variant="body2">
              {contentBusId}
            </Typography>
          </Box>
        )}
        {sourceLocation && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
              Source Location
            </Typography>
            <Typography variant="body2">
              {sourceLocation}
            </Typography>
          </Box>
        )}
        {sourceLastModified && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
              Source Last Modified
            </Typography>
            <Typography variant="body2">
              {formatDate(sourceLastModified)}
            </Typography>
          </Box>
        )}
        {permissions && permissions.length > 0 && (
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
              Permissions
            </Typography>
            <Typography variant="body2">
              {permissions.join(', ')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard; 