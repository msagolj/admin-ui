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
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from 'components/ResponseDisplay';
import SiteInputs from 'components/SiteInputs';

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
            {showDefault ? 'List View' : 'Default View'}
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
                    aria-label="view config"
                    onClick={() => handleViewConfig(site.name)}
                    title="View Site Config"
                    sx={{ mr: 2 }}
                  >
                    <VisibilityIcon />
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
        description="Returns the site level configuration names."
        helpUrl="https://www.aem.live/docs/admin.html#tag/siteConfig/operation/getConfigSites"
        icon={SettingsIcon}
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