import React from 'react';
import { Box, TextField, Autocomplete } from '@mui/material';
import { useResource } from '../context/ResourceContext';

interface JobResourceInputsProps {
  defaultOwner?: string;
  defaultRepo?: string;
  defaultRef?: string;
  defaultTopic?: string;
  readOnlyOwner?: boolean;
  readOnlyRepo?: boolean;
  readOnlyRef?: boolean;
  readOnlyTopic?: boolean;
}

const JobResourceInputs: React.FC<JobResourceInputsProps> = ({
  defaultOwner = '',
  defaultRepo = '',
  defaultRef = '',
  defaultTopic = '',
  readOnlyOwner = false,
  readOnlyRepo = false,
  readOnlyRef = false,
  readOnlyTopic = false,
}) => {
  const { 
    owner, setOwner, 
    repo, setRepo, 
    ref, setRef, 
    topic, setTopic,
    ownerHistory,
    repoHistory,
    refHistory,
    topicHistory
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
    if (defaultTopic) {
      setTopic(defaultTopic);
    }
  }, [defaultOwner, defaultRepo, defaultRef, defaultTopic]);

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

      <Box sx={{ flex: 1 }}>
        <Autocomplete
          freeSolo
          options={topicHistory}
          value={topic}
          onChange={(_, newValue) => setTopic(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Topic"
              required
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Job topic"
              helperText="Topic of the job (e.g., preview, publish, status)"
              InputProps={{ ...params.InputProps, readOnly: readOnlyTopic }}
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default JobResourceInputs; 