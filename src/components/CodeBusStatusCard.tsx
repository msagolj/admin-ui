import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Grid,
  Link,
  IconButton,
  Tooltip
} from '@mui/material';
import { formatDate } from '../utils/renderUtils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeIcon from '@mui/icons-material/Code';
import EditIcon from '@mui/icons-material/Edit';
import CloudIcon from '@mui/icons-material/Cloud';

interface CodeBusStatusCardProps {
  data: {
    webPath: string;
    resourcePath: string;
    live: {
      url: string;
    };
    preview: {
      url: string;
    };
    edit: {
      url: string;
    };
    code: {
      status: number;
      lastModified: string;
      sourceLastModified: string;
      codeBusId: string;
      permissions: string[];
    };
    links: {
      status: string;
      preview: string;
      live: string;
      code: string;
    };
  };
}

const CodeBusStatusCard: React.FC<CodeBusStatusCardProps> = ({ data }) => {
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
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: `${getStatusColor(data.code.status)}.main`,
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
              {data.code.status}
            </Typography>
          </Box>
          <Typography variant="h6" component="div">
            Code Bus Status
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
                Web Path
              </Typography>
              <Typography variant="body2">
                {data.webPath}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
                Resource Path
              </Typography>
              <Typography variant="body2">
                {data.resourcePath}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
                Code Bus ID
              </Typography>
              <Typography variant="body2">
                {data.code.codeBusId}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
                Last Modified
              </Typography>
              <Typography variant="body2">
                {formatDate(data.code.lastModified)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
                Source Last Modified
              </Typography>
              <Typography variant="body2">
                {formatDate(data.code.sourceLastModified)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
                Permissions
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {data.code.permissions.map((permission) => (
                  <Chip
                    key={permission}
                    label={permission}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25, color: 'text.secondary' }}>
                URLs
              </Typography>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EditIcon fontSize="small" color="action" />
                  <Link href={data.edit.url} target="_blank" rel="noopener noreferrer">
                    Edit
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VisibilityIcon fontSize="small" color="action" />
                  <Link href={data.preview.url} target="_blank" rel="noopener noreferrer">
                    Preview
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CloudIcon fontSize="small" color="action" />
                  <Link href={data.live.url} target="_blank" rel="noopener noreferrer">
                    Live
                  </Link>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CodeBusStatusCard; 