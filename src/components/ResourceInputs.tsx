import React from 'react';
import { Box, TextField, Autocomplete } from '@mui/material';
import { useResource } from '../context/ResourceContext';

interface ResourceInputsProps {
  defaultOwner?: string;
  defaultRepo?: string;
  defaultRef?: string;
  defaultPath?: string;
  readOnlyOwner?: boolean;
  readOnlyRepo?: boolean;
  readOnlyRef?: boolean;
  readOnlyPath?: boolean;
  hidePath?: boolean;
}

const ResourceInputs: React.FC<ResourceInputsProps> = ({
  defaultOwner = '',
  defaultRepo = '',
  defaultRef = '',
  defaultPath = '',
  readOnlyOwner = false,
  readOnlyRepo = false,
  readOnlyRef = false,
  readOnlyPath = false,
  hidePath = false,
}) => {
  const { 
    owner, setOwner, 
    repo, setRepo, 
    ref, setRef, 
    path, setPath,
    ownerHistory,
    repoHistory,
    refHistory,
    pathHistory
  } = useResource();

  // Set default values when component mounts
  React.useEffect(() => {
    if (defaultOwner) {
      setOwner(defaultOwner);
    }
    if (defaultRepo) {
      setRepo(defaultRepo);
    }
    if (defaultRef) {
      setRef(defaultRef);
    }
    if (defaultPath) {
      setPath(defaultPath);
    }
  }, [defaultOwner, defaultRepo, defaultRef, defaultPath]);

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
              label="Owner"
              required
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Repository owner"
              helperText="Repository owner (e.g., organization or user name)"
              InputProps={{ ...params.InputProps, readOnly: readOnlyOwner }}
            />
          )}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Autocomplete
          freeSolo
          options={repoHistory}
          value={repo}
          onChange={(_, newValue) => setRepo(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Repository"
              required
              onChange={(e) => setRepo(e.target.value)}
              placeholder="Repository name"
              helperText="Name of the repository"
              InputProps={{ ...params.InputProps, readOnly: readOnlyRepo }}
            />
          )}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Autocomplete
          freeSolo
          options={refHistory}
          value={ref}
          onChange={(_, newValue) => setRef(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Reference"
              required
              onChange={(e) => setRef(e.target.value)}
              placeholder="Branch or ref"
              helperText="Ref (branch) of repository"
              InputProps={{ ...params.InputProps, readOnly: readOnlyRef }}
            />
          )}
        />
      </Box>

      {!hidePath && (
        <Box sx={{ flex: 1 }}>
          <Autocomplete
            freeSolo
            options={pathHistory}
            value={path}
            onChange={(_, newValue) => setPath(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Path"
                required
                onChange={(e) => setPath(e.target.value)}
                placeholder="Resource path"
                helperText="Relative path of the resource"
                InputProps={{ ...params.InputProps, readOnly: readOnlyPath }}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default ResourceInputs; 