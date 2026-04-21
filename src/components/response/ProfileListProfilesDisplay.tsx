import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ResponseLayout from './ResponseLayout';
import { useResource } from '../../context/ResourceContext';
import { apiCall } from '../../utils/api';
import { RequestDetails, ADMIN_API_BASE } from '../../types';

interface Profile {
  name: string;
}

interface ProfileListProfilesDisplayProps {
  responseData: { profiles: Profile[] } | null;
  requestDetails: RequestDetails | null;
  responseStatus: number;
}

const ProfileListProfilesDisplay: React.FC<ProfileListProfilesDisplayProps> = ({
  responseData,
  requestDetails,
  responseStatus,
}) => {
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
      const details: RequestDetails = {
        url: `${ADMIN_API_BASE}/config/${owner}/profiles/${profileName}.json`,
        method: 'GET',
        headers: {},
        queryParams: {},
        body: null
      };

      const { responseData } = await apiCall(details);
      if (responseData) {
        sessionStorage.setItem('copiedProfileConfig', JSON.stringify(responseData));
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
    <ResponseLayout
      requestDetails={requestDetails}
      responseData={responseData}
      responseStatus={responseStatus}
      showToggle={sortedProfiles.length > 0}
    >
      {sortedProfiles.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No profiles found for this organization.
        </Typography>
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
                    <IconButton size="small" onClick={() => handleDeleteConfig(profile.name)} title="Delete Profile Config">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleViewConfig(profile.name)} title="View Profile Config">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEditConfig(profile.name)} title="Edit Profile Config">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleCopyConfig(profile.name)} title="Copy Profile Config">
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
    </ResponseLayout>
  );
};

export default ProfileListProfilesDisplay;
