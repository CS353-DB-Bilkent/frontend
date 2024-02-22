import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Box, Grid, Typography, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { changePasswordCode } from '../services/lib/password';
import { useNavigate } from 'react-router-dom';
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';
import { useLoadingStore } from '../stores/Loading';

export default function ResetPassword() {
  const navigate = useNavigate();
  const setLoading = useLoadingStore((s) => s.setLoading);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const code = window.location.pathname.split('/').length >= 3 ? window.location.pathname.split('/')[2] : null;

    const formData = new FormData(event.currentTarget);
    const userNewPassword = formData.get('newPassword');
    const userNewPasswordAgain = formData.get('newPasswordAgain');

    if (!userNewPassword) {
      notify('Password cannot be blank!', NOTIFY_TYPES.ERROR);
      throw new Error('Password cannot be blank!');
    }

    if (userNewPassword !== userNewPasswordAgain) {
      notify('Please confirm your password!', NOTIFY_TYPES.ERROR);
      throw new Error('Please confirm your password!');
    }

    try {
      setLoading(true);
      await changePasswordCode(code, userNewPassword);
      notify('Your password was changed!', NOTIFY_TYPES.SUCCESS);
      navigate('/login');
    } catch (err) {
      notifyError(err.response.data);
      navigate('/login');
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
            Enter your new password
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
              minWidth: '400px',
              width: '630px',
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 5, width: '60%' }}>
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
