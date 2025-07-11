import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Menu,
  MenuItem,
  CircularProgress,
  IconButton,
  Link
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import LoginIcon from '@mui/icons-material/Login';

interface TokenInputModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (token: string, aemToken: string) => void;
}

const TokenInputModal: React.FC<TokenInputModalProps> = ({ open, onClose, onSubmit }) => {
  const [token, setToken] = useState('');
  const [aemToken, setAemToken] = useState('');
  const [loginAnchorEl, setLoginAnchorEl] = useState<null | HTMLElement>(null);
  const [loadingLoginOptions, setLoadingLoginOptions] = useState(false);
  const { loginOptions, login, fetchLoginOptions } = useAuth();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (open) {
      fetchLoginOptions();
      if (!hasInitialized.current) {
        // Initialize tokens from localStorage only once per session
        const storedToken = localStorage.getItem('authToken');
        const storedAemToken = localStorage.getItem('aemToken');
        if (storedToken) setToken(storedToken);
        if (storedAemToken) setAemToken(storedAemToken);
        hasInitialized.current = true;
      }
    } else {
      // Reset initialization flag when modal closes
      hasInitialized.current = false;
    }
  }, [open, fetchLoginOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure AEM token starts with 'Bearer '
    const formattedAemToken = aemToken.trim() === '' 
      ? '' 
      : aemToken.trim().startsWith('Bearer ') 
        ? aemToken.trim() 
        : `Bearer ${aemToken.trim()}`;
    onSubmit(token, formattedAemToken);
    setToken('');
    setAemToken('');
  };

  const handleLoginClick = (event: React.MouseEvent<HTMLElement>) => {
    setLoginAnchorEl(event.currentTarget);
  };

  const handleLoginClose = () => {
    setLoginAnchorEl(null);
  };

  const handleLoginOptionClick = (url: string) => {
    handleLoginClose();
    login(url);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Authentication Settings</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="AEM Admin API Token"
              type="text"
              fullWidth
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <IconButton
              onClick={handleLoginClick}
              sx={{ mt: 1 }}
              title="Login Options"
            >
              <LoginIcon />
            </IconButton>
            <Menu
              anchorEl={loginAnchorEl}
              open={Boolean(loginAnchorEl)}
              onClose={handleLoginClose}
              PaperProps={{
                sx: {
                  minWidth: 200,
                },
              }}
            >
              {loadingLoginOptions ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                    <CircularProgress size={20} />
                  </Box>
                </MenuItem>
              ) : loginOptions.length > 0 ? (
                loginOptions.map((option) => (
                  <MenuItem 
                    key={option.url} 
                    onClick={() => handleLoginOptionClick(option.url)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.icon && (
                        <Box
                          component="img"
                          src={option.icon}
                          alt={`${option.name} icon`}
                          sx={{ width: 20, height: 20 }}
                        />
                      )}
                      {option.name}
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  No login options available
                </MenuItem>
              )}
            </Menu>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.75rem' }}>
            • click on<LoginIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mx: 0.5 }} />
            <br />
            • select a provider and log in
            <br />
            • on the response page, open developer console
            <br />
            • extract token from cookie, paste it in the input field
            <br/><br/>
            <hr/>
          </Typography>
          <TextField
            margin="dense"
            label="AEM Token (Optional)"
            type="text"
            fullWidth
            value={aemToken}
            onChange={(e) => setAemToken(e.target.value)}
  
          />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.75rem' }}>
            <br />
            For <Link href="#/preview/update" color="primary" underline="hover">Update Preview</Link> call (with AEM as a content source) you also require an AEM Token:
            <br />
            • open your AEMaaCS instance in separate window
            <br />
            • open developer console,on network tab, filter for 'token'
            <br />
            • extract the token from payload, paste it in the input field
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TokenInputModal; 