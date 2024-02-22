import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Box, Grid, Typography, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { emailPasswordChangeCode } from '../services/lib/password';
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const successTitle = 'Please check your inbox';
  const successMessage = 'If you have provided a valid mail adress, the reset code will be sent soon!';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const userEmail = formData.get('email');
    if (!userEmail) {
      notify('Email cannot be left blank!', NOTIFY_TYPES.ERROR);
      throw new Error('Email cannot be left blank!');
    }

    try {
      await emailPasswordChangeCode(userEmail);
      notify(successTitle, NOTIFY_TYPES.SUCCESS, successMessage);
      navigate('/login');
    } catch (err) {
      notifyError(err.response.data);
    }
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
            Enter your email to receive a code
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
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 5 }}>
              <TextField required name="email" id="email" label="Email" variant="outlined" fullWidth sx={{ mb: 3 }} color="primary" />
              <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: 'primary.main' }}>
                Send Code
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
