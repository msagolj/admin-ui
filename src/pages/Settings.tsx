import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

interface Settings {
  defaultUrl: string;
  apiKey: string;
  apiSecret: string;
  autoSave: boolean;
  notifications: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    defaultUrl: '',
    apiKey: '',
    apiSecret: '',
    autoSave: false,
    notifications: true
  });
  const [showSecret, setShowSecret] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('aemAdminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('aemAdminSettings', JSON.stringify(settings));
      setSaveSuccess(true);
      setSaveError(null);
    } catch (err) {
      setSaveError('Failed to save settings. Please try again.');
      setSaveSuccess(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              API Configuration
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Default AEM Instance URL"
                name="defaultUrl"
                value={settings.defaultUrl}
                onChange={handleChange}
                placeholder="https://your-aem-instance.com"
              />
              <TextField
                fullWidth
                label="API Key"
                name="apiKey"
                value={settings.apiKey}
                onChange={handleChange}
                placeholder="Enter your API key"
              />
              <TextField
                fullWidth
                label="API Secret"
                name="apiSecret"
                type={showSecret ? 'text' : 'password'}
                value={settings.apiSecret}
                onChange={handleChange}
                placeholder="Enter your API secret"
                InputProps={{
                  endAdornment: (
                    <Button
                      size="small"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? 'Hide' : 'Show'}
                    </Button>
                  )
                }}
              />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoSave}
                    onChange={handleChange}
                    name="autoSave"
                  />
                }
                label="Auto-save settings"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={handleChange}
                    name="notifications"
                  />
                }
                label="Enable notifications"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Settings
            </Button>
          </Box>
        </Box>
      </Paper>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      {saveError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {saveError}
        </Alert>
      )}
    </Box>
  );
};

export default Settings; 