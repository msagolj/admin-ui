import React from 'react';
import { Box, TextField, Autocomplete } from '@mui/material';
import { useResource } from '../context/ResourceContext';

interface JobResourceInputsProps {
  defaultOwner?: string;
  defaultSite?: string;
  defaultRef?: string;
  defaultTopic?: string;
  readOnlyOwner?: boolean;
  readOnlySite?: boolean;
  readOnlyRef?: boolean;
  readOnlyTopic?: boolean;
}

const JobResourceInputs: React.FC<JobResourceInputsProps> = ({
  defaultOwner = '',
  defaultSite = '',
  defaultRef = '',
  defaultTopic = '',
  readOnlyOwner = false,
  readOnlySite = false,
  readOnlyRef = false,
  readOnlyTopic = false,
}) => {
  const {
    owner, setOwner,
    site, setSite,
    ref, setRef,
    topic, setTopic,
    ownerHistory,
    siteHistory,
    refHistory,
    topicHistory
  } = useResource();

  React.useEffect(() => {
    if (defaultOwner) setOwner(defaultOwner);
    if (defaultSite) setSite(defaultSite);
    if (defaultRef) setRef(defaultRef);
    if (defaultTopic) setTopic(defaultTopic);
  }, [defaultOwner, defaultSite, defaultRef, defaultTopic]);

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
              helperText="Organization or GitHub owner"
              InputProps={{ ...params.InputProps, readOnly: readOnlyOwner }}
            />
          )}
        />
      </Box>

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
              helperText="Site (repository) name"
              InputProps={{ ...params.InputProps, readOnly: readOnlySite }}
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
              helperText="Branch reference (e.g., main)"
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
