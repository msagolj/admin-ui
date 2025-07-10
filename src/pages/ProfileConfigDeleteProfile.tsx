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
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TuneIcon from '@mui/icons-material/Tune';
import { useResource } from '../context/ResourceContext';
import ApiUrlDisplay from '../components/ApiUrlDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import Form, { useFormState } from '../components/Form';
import ResponseDisplay from '../components/response/ResponseDisplay';
import ProfileInputs from '../components/ProfileInputs';
import { useErrorHandler } from '../hooks/useErrorHandler';

const ProfileConfigDeleteProfile: React.FC = () => {
  const { owner, profile } = useResource();
  const { status, responseData, error, loading, executeSubmit, reset } = useFormState();
  const { error: jsonError, handleError, clearError } = useErrorHandler();
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
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    const details = {
      url: `https://admin.hlx.page/config/${owner}/profiles/${profile}.json`,
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
        title="Delete Profile Config"
        description="Deletes the profile configuration for a specific profile."
        icon={TuneIcon}
        helpUrl="https://www.aem.live/docs/admin.html#deleteDelete-Profile-Config"
      />

      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.300' }}>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ProfileInputs />
            <ApiUrlDisplay
              method="DELETE"
              url={`https://admin.hlx.page/config/${owner || '{owner}'}/profiles/${profile || '{profile}'}.json`}
            />
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Delete Profile Config
            </Button>
          </Box>
        </Form>
      </Paper>

      <ErrorDisplay 
        error={error || jsonError} 
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
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the profile configuration for profile "{profile}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileConfigDeleteProfile; 