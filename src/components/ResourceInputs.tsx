import React from 'react';
import { Box, TextField } from '@mui/material';
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
}) => {
  const { 
    owner, setOwner, 
    repo, setRepo, 
    ref, setRef, 
    path, setPath
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
        <TextField
          fullWidth
          label="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          required
          placeholder="Repository owner"
          helperText="Repository owner (e.g., organization or user name)"
          InputProps={{ readOnly: readOnlyOwner }}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <TextField
          fullWidth
          label="Repository"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          required
          placeholder="Repository name"
          helperText="Name of the repository"
          InputProps={{ readOnly: readOnlyRepo }}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <TextField
          fullWidth
          label="Reference"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          required
          placeholder="Branch or ref"
          helperText="Ref (branch) of repository"
          InputProps={{ readOnly: readOnlyRef }}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <TextField
          fullWidth
          label="Path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          required
          placeholder="Resource path"
          helperText="Relative path of the resource"
          InputProps={{ readOnly: readOnlyPath }}
        />
      </Box>
    </Box>
  );
};

export default ResourceInputs; 