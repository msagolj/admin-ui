import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Divider,
  ButtonGroup,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RequestDisplay from '../RequestDisplay';
import { useResource } from '../../context/ResourceContext';
import { apiCall } from '../../utils/api';

interface Profile {
  name: string;
}

interface ProfileListProfilesDisplayProps {
  responseData: { profiles: Profile[] } | null;
  requestDetails: {
    url: string;
    method: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: any;
  } | null;
  responseStatus: number;
}

const ProfileListProfilesDisplay: React.FC<ProfileListProfilesDisplayProps> = ({ 
  responseData,
  requestDetails,
  responseStatus,
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const navigate = useNavigate();
  const { setProfile, owner } = useResource();

  const handleViewConfig = (profileName: string) => {
    setProfile(profileName);
    navigate('/profile-config/read');
  };

  const handleEditConfig = (profileName: string) => {
    setProfile(profileName);
    navigate('/profile-config/update');
  };

  const handleDeleteConfig = (profileName: string) => {
    setProfile(profileName);
    navigate('/profile-config/delete');
  };

  const handleCopyConfig = async (profileName: string) => {
    try {
      const details = {
        url: `https://admin.hlx.page/config/${owner}/profiles/${profileName}.json`,
        method: 'GET',
        headers: {},
        queryParams: {},
        body: null
      };
      
      const { responseData } = await apiCall(details);
      if (responseData) {
        // Store the config in sessionStorage
        sessionStorage.setItem('copiedProfileConfig', JSON.stringify(responseData));
        // Navigate to create page
        setProfile('');
        navigate('/profile-config/create');
      }
    } catch (error) {
      console.error('Error copying profile config:', error);
    }
  };

  const profiles = responseData?.profiles || [];
  const sortedProfiles = [...profiles].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Box>
      <RequestDisplay
        requestDetails={requestDetails}
      />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Response</Typography>
        {sortedProfiles.length > 0 && (
          <Box>
            <ButtonGroup size="small">
              <Button
                startIcon={<VisibilityIcon />}
                onClick={() => setShowRaw(!showRaw)}
                variant={showRaw ? 'contained' : 'outlined'}
              >
                {showRaw ? 'Show Formatted' : 'Show Raw'}
              </Button>
            </ButtonGroup>
          </Box>
        )}
      </Box>

      {sortedProfiles.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No profiles found for this organization.
        </Typography>
      ) : showRaw ? (
        <Paper sx={{ p: 2, mt: 2 }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify({ ...responseData, profiles: sortedProfiles }, null, 2)}
          </pre>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, border: 1, borderColor: 'grey.300' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Actions</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Profile Name</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Config Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProfiles.map((profile) => (
                <TableRow key={profile.name}>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteConfig(profile.name)}
                      title="Delete Profile Config"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleViewConfig(profile.name)}
                      title="View Profile Config"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditConfig(profile.name)}
                      title="Edit Profile Config"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleCopyConfig(profile.name)}
                      title="Copy Profile Config"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{`/config/profiles/${profile.name}.json`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ProfileListProfilesDisplay; 