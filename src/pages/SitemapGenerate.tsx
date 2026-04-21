import React from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import SitemapGenerateDisplay from '../components/response/SitemapGenerateDisplay';
import ResourceInputs from 'components/ResourceInputs';
import { RequestDetails, ADMIN_API_BASE } from '../types';

const SitemapGenerate: React.FC = () => {
  const { owner, site, ref, path } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset, requestDetails } = useFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      url: `${ADMIN_API_BASE}/sitemap/${owner}/${site}/${ref}/${path}`,
      method: 'POST',
      headers: {},
      queryParams: {},
      body: {}
    };
    executeSubmit(details);
  };

  return (
    <Box>
      <PageHeader
        title="Generate Sitemap"
        description="The path specified should be the destination path of a sitemap."
        helpUrl="https://www.aem.live/docs/admin.html#tag/sitemap/operation/generateSitemap"
        icon={MapIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ResourceInputs />
            <ApiUrlDisplay
              method="POST"
              url={`${ADMIN_API_BASE}/sitemap/${owner || '{owner}'}/${site || '{site}'}/${ref || '{ref}'}/${path || '{path}'}`}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Generate Sitemap
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error} 
        onDismiss={reset}
        requestDetails={requestDetails}
      />

      {status && (
        <SitemapGenerateDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}
    </Box>
  );
};

export default SitemapGenerate; 