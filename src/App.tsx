import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Status from './pages/Status';
import PublishStatus from './pages/PublishStatus';
import Publish from './pages/Publish';
import Unpublish from './pages/Unpublish';
import PreviewStatus from './pages/PreviewStatus';
import UpdatePreview from './pages/UpdatePreview';
import DeletePreview from './pages/DeletePreview';
import BulkPreviewJob from './pages/BulkPreviewJob';
import BulkPublishJob from './pages/BulkPublishJob';
import BulkUnpublishJob from './pages/BulkUnpublishJob';
import BulkStatusJob from './pages/BulkStatusJob';
import Code from './pages/Code';
import Cache from './pages/Cache';
import Index from './pages/Index';
import Sitemap from './pages/Sitemap';
import Snapshot from './pages/Snapshot';
import Login from './pages/Login';
import Logs from './pages/Logs';
import Jobs from './pages/Jobs';
import OrgConfig from './pages/OrgConfig';
import SiteConfig from './pages/SiteConfig';
import { ResourceProvider } from './context/ResourceContext';
import { AuthProvider } from './context/AuthContext';

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
                <Route path="/" element={<Navigate to="/status" replace />} />
                <Route path="/status" element={<Status />} />
                <Route path="/status/bulk" element={<BulkStatusJob />} />
                <Route path="/publish/status" element={<PublishStatus />} />
                <Route path="/publish" element={<Publish />} />
                <Route path="/unpublish" element={<Unpublish />} />
                <Route path="/publish/bulk" element={<BulkPublishJob />} />
                <Route path="/preview/status" element={<PreviewStatus />} />
                <Route path="/preview/update" element={<UpdatePreview />} />
                <Route path="/preview/delete" element={<DeletePreview />} />
                <Route path="/preview/bulk" element={<BulkPreviewJob />} />
                <Route path="/code/status" element={<Code />} />
                <Route path="/code/update" element={<Code />} />
                <Route path="/code/delete" element={<Code />} />
                <Route path="/code/batch" element={<Code />} />
                <Route path="/cache/purge" element={<Cache />} />
                <Route path="/index/status" element={<Index />} />
                <Route path="/index/reindex" element={<Index />} />
                <Route path="/index/remove" element={<Index />} />
                <Route path="/sitemap/generate" element={<Sitemap />} />
                <Route path="/snapshot/list" element={<Snapshot />} />
                <Route path="/snapshot/manifest" element={<Snapshot />} />
                <Route path="/snapshot/manifest/update" element={<Snapshot />} />
                <Route path="/snapshot/status" element={<Snapshot />} />
                <Route path="/snapshot/add" element={<Snapshot />} />
                <Route path="/snapshot/delete" element={<Snapshot />} />
                <Route path="/snapshot/bulk" element={<Snapshot />} />
                <Route path="/snapshot/publish/resource" element={<Snapshot />} />
                <Route path="/snapshot/publish" element={<Snapshot />} />
                <Route path="/snapshot/review" element={<Snapshot />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/auto" element={<Login />} />
                <Route path="/auth/logout" element={<Login />} />
                <Route path="/auth/profile" element={<Login />} />
                <Route path="/logs/get" element={<Logs />} />
                <Route path="/logs/add" element={<Logs />} />
                <Route path="/jobs/list" element={<Jobs />} />
                <Route path="/jobs/status" element={<Jobs />} />
                <Route path="/jobs/stop" element={<Jobs />} />
                <Route path="/jobs/details" element={<Jobs />} />
                <Route path="/org-config/read" element={<OrgConfig />} />
                <Route path="/org-config/update" element={<OrgConfig />} />
                <Route path="/org-config/create" element={<OrgConfig />} />
                <Route path="/org-config/delete" element={<OrgConfig />} />
                <Route path="/org-config/users/list" element={<OrgConfig />} />
                <Route path="/org-config/users/create" element={<OrgConfig />} />
                <Route path="/org-config/users/read" element={<OrgConfig />} />
                <Route path="/org-config/users/delete" element={<OrgConfig />} />
                <Route path="/org-config/secrets/list" element={<OrgConfig />} />
                <Route path="/org-config/secrets/create" element={<OrgConfig />} />
                <Route path="/org-config/secrets/read" element={<OrgConfig />} />
                <Route path="/org-config/secrets/delete" element={<OrgConfig />} />
                <Route path="/site-config/list" element={<SiteConfig />} />
                <Route path="/site-config/read" element={<SiteConfig />} />
                <Route path="/site-config/update" element={<SiteConfig />} />
                <Route path="/site-config/create" element={<SiteConfig />} />
                <Route path="/site-config/delete" element={<SiteConfig />} />
                <Route path="/site-config/robots/read" element={<SiteConfig />} />
                <Route path="/site-config/robots/update" element={<SiteConfig />} />
                <Route path="/site-config/tokens/list" element={<SiteConfig />} />
                <Route path="/site-config/tokens/create" element={<SiteConfig />} />
                <Route path="/site-config/tokens/read" element={<SiteConfig />} />
                <Route path="/site-config/tokens/delete" element={<SiteConfig />} />
                <Route path="/site-config/secrets/list" element={<SiteConfig />} />
              </Routes>
            </Layout>
          </Router>
        </ResourceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
