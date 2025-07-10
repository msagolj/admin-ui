import React from 'react';
import { Box, TextField, Autocomplete } from '@mui/material';
import { useResource } from '../context/ResourceContext';

interface ProfileInputsProps {
  defaultOwner?: string;
  defaultProfile?: string;
  readOnlyOwner?: boolean;
  readOnlyProfile?: boolean;
  hideProfile?: boolean;
}

const ProfileInputs: React.FC<ProfileInputsProps> = ({
  defaultOwner = '',
  defaultProfile = '',
  readOnlyOwner = false,
  readOnlyProfile = false,
  hideProfile = false,
}) => {
  const { 
    owner, setOwner,
    profile, setProfile,
    ownerHistory,
    profileHistory
  } = useResource();

  // Set default values when component mounts
  React.useEffect(() => {
    if (defaultOwner) {
      setOwner(defaultOwner);
    }
    if (defaultProfile) {
      setProfile(defaultProfile);
    }
  }, [defaultOwner, defaultProfile]);

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

      {!hideProfile && (
        <Box sx={{ flex: 1 }}>
          <Autocomplete
            freeSolo
            options={profileHistory}
            value={profile}
            onChange={(_, newValue) => setProfile(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Profile"
                required
                onChange={(e) => setProfile(e.target.value)}
                placeholder="Profile name"
                helperText="Name of the configuration profile"
                InputProps={{ ...params.InputProps, readOnly: readOnlyProfile }}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProfileInputs; 