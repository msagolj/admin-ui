import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import { ResourceProvider } from './context/ResourceContext';
import { AuthProvider } from './context/AuthContext';
import StatusGeneralStatus from './pages/StatusGeneralStatus';
import StatusBulkJob from './pages/StatusBulkJob';
import StatusIndex from './pages/IndexStatus';
import IndexReindex from './pages/IndexReindex';
import IndexRemoveResource from './pages/IndexRemoveResource';
import OrgConfigReadConfig from './pages/OrgConfigReadConfig';
import OrgConfigListUsers from './pages/OrgConfigListUsers';
import SiteConfigListConfig from './pages/SiteConfigListSites';
import SiteConfigReadConfig from './pages/SiteConfigReadConfig';
import SiteConfigUpdateSiteConfig from './pages/SiteConfigUpdateConfig';
import SiteConfigCreateConfig from './pages/SiteConfigCreateConfig';
import SiteConfigDeleteConfig from './pages/SiteConfigDeleteConfig';
import SiteConfigReadRobotsTxt from './pages/SiteConfigReadRobotsTxt';
import SiteConfigUpdateRobotsTxt from './pages/SiteConfigUpdateRobotsTxt';
import PreviewStatus from './pages/PreviewStatus';
import PreviewUpdate from './pages/PreviewUpdate';
import PreviewDelete from './pages/PreviewDelete';
import PreviewBulkJob from './pages/PreviewBulkJob';
import PublishStatus from './pages/PublishStatus';
import PublishResource from './pages/PublishResource';
import PublishUnpublish from './pages/PublishUnpublish';
import PublishBulkJob from './pages/PublishBulkJob';
import CodeStatus from './pages/CodeStatus';
import CodeUpdate from './pages/CodeUpdate';
import CodeDelete from './pages/CodeDelete';
import CachePurgeLive from './pages/CachePurgeLive';
import JobList from './pages/JobList';
import JobStatus from './pages/JobStatus';
import JobStatusDetails from './pages/JobStatusDetails';
import JobStop from './pages/JobStop';
import LogsGetLogs from './pages/LogsGetLogs';
import SitemapGenerate from './pages/SitemapGenerate';
import SiteConfigListAPIKeys from './pages/SiteConfigListAPIKeys';
import SiteConfigCreateAPIKey from './pages/SiteConfigCreateAPIKey';
import SiteConfigDeleteAPIKey from './pages/SiteConfigDeleteAPIKey';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ResourceProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/status/general" replace />} />
                <Route path="/status/general" element={<StatusGeneralStatus />} />
                <Route path="/status/bulk" element={<StatusBulkJob />} />
                <Route path="/index/status" element={<StatusIndex />} />
                <Route path="/index/reindex" element={<IndexReindex />} />
                <Route path="/index/remove" element={<IndexRemoveResource />} />
                <Route path="/org-config/read" element={<OrgConfigReadConfig />} />
                <Route path="/org-config/users" element={<OrgConfigListUsers />} />
                <Route path="/site-config/list" element={<SiteConfigListConfig />} />
                <Route path="/site-config/read" element={<SiteConfigReadConfig />} />
                <Route path="/site-config/create" element={<SiteConfigCreateConfig />} />
                <Route path="/site-config/update" element={<SiteConfigUpdateSiteConfig />} />
                <Route path="/site-config/delete" element={<SiteConfigDeleteConfig />} />
                <Route path="/site-config/read-robots-txt" element={<SiteConfigReadRobotsTxt />} />
                <Route path="/site-config/update-robots-txt" element={<SiteConfigUpdateRobotsTxt />} />
                <Route path="/site-config/list-api-keys" element={<SiteConfigListAPIKeys />} />
                <Route path="/site-config/create-api-key" element={<SiteConfigCreateAPIKey />} />
                <Route path="/site-config/delete-api-key" element={<SiteConfigDeleteAPIKey />} />
                <Route path="/logs/get" element={<LogsGetLogs />} />
                <Route path="/preview/status" element={<PreviewStatus />} />
                <Route path="/preview/update" element={<PreviewUpdate />} />
                <Route path="/preview/delete" element={<PreviewDelete />} />
                <Route path="/preview/bulk" element={<PreviewBulkJob />} />
                <Route path="/publish/status" element={<PublishStatus />} />
                <Route path="/publish/resource" element={<PublishResource />} />
                <Route path="/publish/unpublish" element={<PublishUnpublish />} />
                <Route path="/publish/bulk" element={<PublishBulkJob />} />
                <Route path="/code/status" element={<CodeStatus />} />
                <Route path="/code/update" element={<CodeUpdate />} />
                <Route path="/code/delete" element={<CodeDelete />} />
                <Route path="/cache/purge" element={<CachePurgeLive />} />
                <Route path="/jobs/list" element={<JobList />} />
                <Route path="/jobs/status" element={<JobStatus />} />
                <Route path="/jobs/details" element={<JobStatusDetails />} />
                <Route path="/jobs/stop" element={<JobStop />} />
                <Route path="/sitemap/generate" element={<SitemapGenerate />} />
              </Routes>
            </Layout>
          </Router>
        </ResourceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
