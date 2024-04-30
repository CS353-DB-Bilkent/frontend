import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Typography, Tabs, Tab } from '@mui/material';
import { useAuthStore } from '../stores/Store';
import { useLoadingStore } from '../stores/Loading';
import ROLES from '../constants/roles';
import { updateUser } from '../services/lib/user';
import { changePassword } from '../services/lib/password';
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';

export default function UserSettings({ user }) {
  const setLoading = useLoadingStore((s) => s.setLoading);
  const isOrganizer = user.role === ROLES.EVENT_ORGANIZER;
  // State for form fields
  const [formData, setFormData] = useState({ ...user });
  const [activeTab, setActiveTab] = useState(0);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handlePasswordDataChange = (prop) => (event) => {
    setPasswordData({ ...passwordData, [prop]: event.target.value });
  };
  const handleFormDataChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmitPersonalInfo = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      // Submit the updated settings to the server
      await updateUser(user.userId, formData);
      notify('Settings updated successfully!', NOTIFY_TYPES.SUCCESS);
    } catch (error) {
      // Handle errors appropriately
      notifyError(error.response.data);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleSubmitPasswordChange = async () => {
    try {
      setLoading(true);
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        notify('Passwords do not match!', NOTIFY_TYPES.ERROR);
        return;
      }

      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      notify('Password changed successfully!', NOTIFY_TYPES.SUCCESS);

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      notifyError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Personal Information" />
        <Tab label="Change Password" />
      </Tabs>

      {activeTab === 0 && (
        <Box component="form" noValidate onSubmit={handleSubmitPersonalInfo} sx={{ mt: 1 }}>
          <Typography variant="h6">Personal Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField margin="normal" required fullWidth id="name" label="Name Surname" name="name" value={formData.name} onChange={handleFormDataChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="normal" required fullWidth id="email" label="Email" name="email" value={formData.email} onChange={handleFormDataChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="normal" fullWidth id="phone" label="Phone Number" name="phone" value={formData.phone} onChange={handleFormDataChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                id="birthDate"
                label="Birth Date"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleFormDataChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {isOrganizer && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField margin="normal" required fullWidth id="iban" label="IBAN" name="iban" value={formData.iban} onChange={handleFormDataChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="companyName"
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormDataChange}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
            Update
          </Button>
        </Box>
      )}
      {activeTab === 1 && (
        <Box component="form" noValidate onSubmit={handleSubmitPasswordChange} sx={{ mt: 1 }}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="Current Password"
            type="password"
            id="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordDataChange('currentPassword')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordDataChange('newPassword')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            id="confirmNewPassword"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordDataChange('confirmNewPassword')}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
            Change Password
          </Button>
        </Box>
      )}
    </Box>
  );
}
