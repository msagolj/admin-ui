import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  TextField,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WebIcon from '@mui/icons-material/Web';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/response/ResponseDisplay';
import SiteInputs from '../components/SiteInputs';
import { useErrorHandler } from '../hooks/useErrorHandler';

const SiteConfigDeleteAPIKey: React.FC = () => {
  const { owner, site, apiKeyId } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const { error: formError, handleError, clearError } = useErrorHandler();
  const [apiKeyIdInput, setApiKeyIdInput] = useState(apiKeyId || '');
  const [requestDetails, setRequestDetails] = useState<{
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!apiKeyIdInput.trim()) {
      handleError(new Error('API Key ID is required'), 'Validation Error');
      return;
    }
    
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!apiKeyIdInput.trim()) return;
    
    const details = {
      url: `https://admin.hlx.page/config/${owner}/sites/${site}/apiKeys/${apiKeyIdInput.trim()}.json`,
      method: 'DELETE',
      headers: {},
      queryParams: {},
      body: null
    };
    setRequestDetails(details);
    executeSubmit(details);
    setOpenDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      <PageHeader
        title="Delete Site Admin API Key"
        description="Deletes a specific admin API key for the site."
        helpUrl="https://www.aem.live/docs/admin.html#tag/siteConfig/operation/deleteSiteAdminApiKey"
        icon={WebIcon}
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SiteInputs />
            
            <TextField
              fullWidth
              label="API Key ID"
              value={apiKeyIdInput}
              onChange={(e) => setApiKeyIdInput(e.target.value)}
              required
              placeholder="Enter the API Key ID to delete"
              helperText="Enter the API Key ID that you want to delete"
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                },
              }}
            />

            <ApiUrlDisplay
              method="DELETE"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/sites/${site || '{site}'}/apiKeys/${apiKeyIdInput || '{apiKeyId}'}.json`}
            />
            
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={loading || !owner || !site || !apiKeyIdInput.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            >
              Delete API Key
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error || formError} 
        onDismiss={() => {
          reset();
          clearError();
          setRequestDetails(null);
        }}
        requestDetails={requestDetails}
      />

      {status && (
        <ResponseDisplay
          requestDetails={requestDetails}
          responseData={responseData}
          responseStatus={status}
        />
      )}

      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          Confirm Delete API Key
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke access for any applications using this key.
          </DialogContentText>
          {apiKeyIdInput && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                API Key ID:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {apiKeyIdInput}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete API Key
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SiteConfigDeleteAPIKey; 