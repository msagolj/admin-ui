import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Divider,
  Link
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

interface TokenInputModalProps {
  open: boolean;
  onClose: () => void;
}

const TokenInputModal: React.FC<TokenInputModalProps> = ({ open, onClose }) => {
  const {
    isAuthenticated,
    loginOptions,
    loginError,
    login,
    logout,
    fetchLoginOptions,
    authToken,
    setAuthToken,
    aemToken,
    setAemToken,
  } = useAuth();

  const [localAuthToken, setLocalAuthToken] = useState('');
  const [localAemToken, setLocalAemToken] = useState('');

  useEffect(() => {
    if (open) {
      fetchLoginOptions();
      setLocalAuthToken(authToken);
      setLocalAemToken(aemToken);
    }
  }, [open, fetchLoginOptions, authToken, aemToken]);

  const handleSave = () => {
    setAuthToken(localAuthToken);
    setAemToken(localAemToken);
    onClose();
  };

  const handleLogout = () => {
    logout();
    setLocalAuthToken('');
    setLocalAemToken('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Authentication Settings</DialogTitle>
      <DialogContent>
        {/* Auth status */}
        <Box sx={{ mb: 2 }}>
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<CheckCircleIcon />}
                label="Logged in"
                color="success"
                variant="outlined"
              />
              <Button
                size="small"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                color="inherit"
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Chip
              icon={<ErrorOutlineIcon />}
              label="Not logged in"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>

        {/* Login providers */}
        {!isAuthenticated && (
          <Box sx={{ mb: 2 }}>
            {loginError ? (
              <Typography variant="body2" color="error">{loginError}</Typography>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {loginOptions.map((option) => (
                  <Button
                    key={option.url}
                    variant="outlined"
                    size="small"
                    onClick={() => login(option.url)}
                    startIcon={
                      option.icon ? (
                        <Box
                          component="img"
                          src={option.icon}
                          alt=""
                          sx={{ width: 16, height: 16 }}
                        />
                      ) : undefined
                    }
                  >
                    {option.name}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Admin API Token */}
        <TextField
          margin="dense"
          label="Admin API Token"
          type="password"
          fullWidth
          value={localAuthToken}
          onChange={(e) => setLocalAuthToken(e.target.value)}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1, fontSize: '0.75rem' }}>
          {'\u2022'} click a provider above to log in
          <br />
          {'\u2022'} on the response page, open developer console
          <br />
          {'\u2022'} extract <code>auth_token</code> from cookies and paste above
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* AEM Token */}
        <TextField
          margin="dense"
          label="AEM Token (Optional)"
          type="password"
          fullWidth
          value={localAemToken}
          onChange={(e) => setLocalAemToken(e.target.value)}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
          Only needed for <Link href="#/preview/update" color="primary" underline="hover">Update Preview</Link> with AEM as content source:
          <br />
          {'\u2022'} open your AEMaaCS instance in a separate window
          <br />
          {'\u2022'} open developer console, on network tab, filter for 'token'
          <br />
          {'\u2022'} extract the token from the payload and paste above
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TokenInputModal;
