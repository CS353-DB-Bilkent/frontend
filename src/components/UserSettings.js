import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Typography, Tabs, Tab  } from '@mui/material';
import { useAuthStore } from '../stores/Store';
import axiosInstance from '../services/axiosInterceptor'; // Assuming useAuthStore is a custom hook for auth
import { useLoadingStore } from '../stores/Loading';
export default function UserSettings({user}) {
  const { setUser } = useAuthStore(); // Retrieve user data and update function
  const setLoading = useLoadingStore((s) => s.setLoading);
  // State for form fields
  const [formData, setFormData] = useState({...user});
  const [activeTab,setActiveTab] = useState(0);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    // Fetch user data from backend when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/user/${user.userId}`);
        setFormData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user.userId]);
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
      const response = await axiosInstance.post(`/user/${user.userId}/updateInfo`, formData);
      // Update the user state with the response
      setUser(response.data.data);

      alert('User settings updated successfully!');
    } catch (error) {
      // Handle errors appropriately
      alert('An error occurred while updating settings.');
      console.error('Error updating user settings:', error);
    }
    finally{
      setLoading(false);
    }
  };
  const handleSubmitPasswordChange = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        throw new Error('Passwords do not match!');
      }
      // Add the password change request logic here
      const response = await axiosInstance.post(`/user/${user.userId}/changePassword`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (error) {
      alert('An error occurred while changing the password.');
      console.error('Error changing password:', error);
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
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name Surname"
                name="name"
                value={formData.name}
                onChange={handleFormDataChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleFormDataChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleFormDataChange}
              />
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
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update
          </Button>
        </Box>
      )}
      {activeTab === 1 && (
        <Box component="form" noValidate onSubmit={handleSubmitPasswordChange} sx={{ mt: 1 }}>
          <Typography variant="h6" gutterBottom>Change Password</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="Current Password"
            type="password"
            id="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordDataChange}
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
            onChange={handlePasswordDataChange}
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
            onChange={handlePasswordDataChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
          >
            Change Password
          </Button>
        </Box>  )}
    </Box>
  );
}

