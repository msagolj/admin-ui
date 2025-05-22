import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/overlays/ResponseDisplay';
import SiteInputs from 'components/SiteInputs';
import { apiCall } from 'utils/api';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface Site {
  name: string;
}

interface SiteConfigListResponse {
  sites: Site[];
}

const SiteConfigListConfig: React.FC = () => {
  const navigate = useNavigate();
  const { owner, setOwner, setSite } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const { error: jsonError, handleError, clearError } = useErrorHandler();
  const [showDefault, setShowDefault] = useState(false);
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `https://admin.hlx.page/config/${owner}/sites.json`,
      method: 'GET',
      headers: {},
      queryParams: {},
      body: null
    };
    setRequestDetails(details);
    executeSubmit(details);
  };

  const handleViewConfig = (siteName: string) => {
    setSite(siteName);
    navigate('/site-config/read');
  };

  const handleEditConfig = (siteName: string) => {
    setSite(siteName);
    navigate('/site-config/update');
  };

  const handleCopyConfig = async (siteName: string) => {
    try {
      const details = {
        url: `https://admin.hlx.page/config/${owner}/sites/${siteName}.json`,
        method: 'GET',
        headers: {},
        queryParams: {},
        body: null
      };
      
      const { responseData } = await apiCall(details);
      
      // Store the config in sessionStorage
      sessionStorage.setItem('copiedSiteConfig', JSON.stringify(responseData));
      
      // Navigate to create page with empty site
      setSite('');
      navigate('/site-config/create');
    } catch (error) {
      handleError(error, 'Error copying site configuration');
    }
  };

  const handleDeleteConfig = (siteName: string) => {
    setSite(siteName);
    navigate('/site-config/delete');
  };

  const renderSitesList = () => {
    if (!responseData) return null;

    const data = responseData as SiteConfigListResponse;
    if (!data.sites || data.sites.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No sites found for this organization.
        </Typography>
      );
    }

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowDefault(!showDefault)}
          >
            {showDefault ? 'UI View' : 'HTTP View'}
          </Button>
        </Box>
        {showDefault ? (
          <ResponseDisplay
            requestDetails={requestDetails}
            responseData={responseData}
            responseStatus={status || 0}
          />
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {data.sites.map((site, index) => (
              <React.Fragment key={site.name}>
                <ListItem>
                <IconButton
                    edge="start"
                    aria-label="delete config"
                    onClick={() => handleDeleteConfig(site.name)}
                    title="Delete Site Config"
                    sx={{ mr: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
{/*                  <IconButton
                    edge="start"
                    aria-label="copy config"
                    onClick={() => handleCopyConfig(site.name)}
                    title="Copy Site Config for new Site"
                    sx={{ mr: 1 }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                  */}
                  <IconButton
                    edge="start"
                    aria-label="view config"
                    onClick={() => handleViewConfig(site.name)}
                    title="View Site Config"
                    sx={{ mr: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    edge="start"
                    aria-label="edit config"
                    onClick={() => handleEditConfig(site.name)}
                    title="Edit Site Config"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <ListItemText 
                    primary={site.name}
                    secondary={`/config/${owner}/sites/${site.name}.json`}
                    primaryTypographyProps={{
                      variant: 'body1',
                      fontWeight: 'medium'
                    }}
                    secondaryTypographyProps={{
                      variant: 'body2',
                      color: 'text.secondary'
                    }}
                  />
                </ListItem>
                {index < data.sites.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <PageHeader
        title="List Sites"
        description="Returns a list of all sites in the organization."
        icon={WebIcon}
        helpUrl="https://www.aem.live/docs/admin.html#getList-Site-Config"
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs
              hideSite={true}
             />
            <ApiUrlDisplay
              method="GET"
              url={`https://admin.hlx.page/config/${owner || '{org}'}/sites.json`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              List Sites
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={() => {
          reset();
          setRequestDetails(null);
        }}
        requestDetails={requestDetails}
      />

      {status === 200 && renderSitesList()}
      
      {status && status !== 200 && (
        <ResponseDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status || 0}
        />
      )}
    </Box>
  );
};

export default SiteConfigListConfig; 