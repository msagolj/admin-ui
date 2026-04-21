import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material';
import ResponseLayout from './ResponseLayout';
import { RequestDetails } from '../../types';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface OrgListUsersDisplayProps {
  users: User[];
  requestDetails: RequestDetails | null;
  responseStatus: number;
}

const OrgListUsersDisplay: React.FC<OrgListUsersDisplayProps> = ({
  users,
  requestDetails,
  responseStatus,
}) => {
  return (
    <ResponseLayout
      requestDetails={requestDetails}
      responseData={users}
      responseStatus={responseStatus}
      showToggle={users && users.length > 0}
    >
      {!users || users.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No users found for this organization.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, border: 1, borderColor: 'grey.300' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Roles</TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.roles.join(', ')}</TableCell>
                  <TableCell>{user.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </ResponseLayout>
  );
};

export default OrgListUsersDisplay;
