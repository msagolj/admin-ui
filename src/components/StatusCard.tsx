import { Card, CardContent, Typography, Box, Link } from '@mui/material';
import { renderValue, formatLabel } from '../utils/renderUtils';

interface StatusCardProps {
  title: string;
  status: number;
  data: Record<string, any>;
}

const StatusCard = ({
  title,
  status,
  data
}: StatusCardProps) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'warning';
    if (status >= 400 && status < 500) return 'error';
    if (status >= 500) return 'error';
    return 'default';
  };

  return (
    <Card sx={{ mb: 2, border: 1, borderColor: 'grey.300' }}>
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
        {Object.entries(data).map(([key, value]) => {
          if (key === 'status') return null;
          if (key === 'links' && typeof value === 'object' && value !== null) {
            return (
              <Box key={key} sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
                  Links
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                  {Object.entries(value as Record<string, string>).map(([linkKey, url]) => (
                    <Link
                      key={linkKey}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {formatLabel(linkKey)}
                    </Link>
                  ))}
                </Box>
              </Box>
            );
          }
          return (
            <Box key={key} sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
                {formatLabel(key)}
              </Typography>
              <Typography variant="body2">
                {renderValue(key, value)}
              </Typography>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default StatusCard; 