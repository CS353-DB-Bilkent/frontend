import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Box, Grid, Typography, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';
import { changePassword } from '../services/lib/password';
import { useNavigate } from 'react-router-dom';
import { useLoadingStore } from '../stores/Loading';

export default function ChangePassword() {
  const navigate = useNavigate();
  const setLoading = useLoadingStore((s) => s.setLoading);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const userOldPassword = formData.get('oldPassword');
    const userNewPassword = formData.get('newPassword');
    const userNewPasswordAgain = formData.get('newPasswordAgain');

    if (!userOldPassword || !userNewPassword || !userNewPasswordAgain) {
      notify('Passwords cannot be left blank!', NOTIFY_TYPES.ERROR);
      throw new Error('Passwords cannot be left blank!');
    }

    if (userNewPassword !== userNewPasswordAgain) {
      notify('Please confirm your password!', NOTIFY_TYPES.ERROR);
      throw new Error('Please confirm your password!');
    }

    setLoading(true);
    try {
      await changePassword(userOldPassword, userNewPassword);
      notify('Your password was changed!', NOTIFY_TYPES.SUCCESS);
      navigate('/');
    } catch (err) {
      notifyError(err.response.data);
    }
    setLoading(false);
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CssBaseline />
      <Grid container rowSpacing={4} component={Paper} sx={{ width: '60vh', borderRadius: '16px', mt: 30 }}>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ color: 'secondary.dark' }} fontSize={'20px'} fontWeight={'bold'}>
            Enter your old & new password
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 5 }}>
              <TextField required name="oldPassword" id="oldPassword" label="Old Password" variant="outlined" fullWidth sx={{ mb: 3 }} color="primary" type="password" />
              <TextField required name="newPassword" id="newPassword" label="New Password" variant="outlined" fullWidth sx={{ mb: 3 }} color="primary" type="password" />
              <TextField
                required
                name="newPasswordAgain"
                id="newPasswordAgain"
                label="Confirm Your Password"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
                color="primary"
                type="password"
              />
              <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: 'primary.main' }}>
                Change Password
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
