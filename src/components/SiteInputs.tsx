import React from 'react';
import { Box, TextField, Autocomplete } from '@mui/material';
import { useResource } from '../context/ResourceContext';

interface SiteInputsProps {
  defaultOwner?: string;
  defaultSite?: string;
  readOnlyOwner?: boolean;
  readOnlySite?: boolean;
  hideSite?: boolean;
}

const SiteInputs: React.FC<SiteInputsProps> = ({
  defaultOwner = '',
  defaultSite = '',
  readOnlyOwner = false,
  readOnlySite = false,
  hideSite = false,
}) => {
  const { 
    owner, setOwner,
    site, setSite,
    ownerHistory,
    siteHistory
  } = useResource();

  // Set default values when component mounts
  React.useEffect(() => {
    if (defaultOwner) {
      setOwner(defaultOwner);
    }
    if (defaultSite) {
      setSite(defaultSite);
    }
  }, [defaultOwner, defaultSite]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2 
    }}>
      <Box sx={{ flex: 1 }}>
        <Autocomplete
          freeSolo
          options={ownerHistory}
          value={owner}
          onChange={(_, newValue) => setOwner(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Organization"
              required
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Organization name"
              helperText="Name of the organization"
              InputProps={{ ...params.InputProps, readOnly: readOnlyOwner }}
            />
          )}
        />
      </Box>

      {!hideSite && (
        <Box sx={{ flex: 1 }}>
          <Autocomplete
            freeSolo
            options={siteHistory}
            value={site}
            onChange={(_, newValue) => setSite(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Site"
                required
                onChange={(e) => setSite(e.target.value)}
                placeholder="Site name"
                helperText="Name of the site"
                InputProps={{ ...params.InputProps, readOnly: readOnlySite }}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default SiteInputs; 