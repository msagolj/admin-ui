import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';

interface TokenInputModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (token: string) => void;
}

const TokenInputModal: React.FC<TokenInputModalProps> = ({ open, onClose, onSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(token);
    setToken('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Enter Authentication Token</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Please paste your authentication token below after completing the login process in the new window.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Auth Token"
            type="text"
            fullWidth
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TokenInputModal; 