import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Box, Grid, Typography, Button, Link, Divider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/Store';
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';
import { useLoadingStore } from '../stores/Loading';

export default function Login() {
  const navigate = useNavigate();
  const loginFunction = useAuthStore((s) => s.login);
  const setLoading = useLoadingStore((s) => s.setLoading);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get('email');
    const password = formData.get('password');
    const data = { email, password };

    if (!email || !password) {
      notify('Text fields cannot be left blank!', NOTIFY_TYPES.ERROR);
      throw new Error('Text fields cannot be left blank!');
    }

    setLoading(true);

    try {
      console.log(data);
      await loginFunction(data);
      navigate('/');
    } catch (err) {
      console.log('sa', err);
      notifyError(err.response.data);
    }

    setLoading(false);
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 6,
      }}
    >
      <CssBaseline />
      <Typography fontSize={'24px'} mt="16px">
        Ticket Seller Application
      </Typography>
      <Grid
        container
        rowSpacing={4}
        component={Paper}
        sx={{ minWidth: '400px', width: '530px', borderRadius: '16px', mt: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography fontSize={'24px'} mt="16px" mb={'16px'}>
          Welcome!
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 5, width: '60%' }}>
          <TextField required name="email" id="email" label="Email" variant="outlined" fullWidth sx={{ mb: 3 }} color="primary" />
          <TextField required name="password" id="password" label="Password" variant="outlined" fullWidth type="password" sx={{ mb: 3, color: 'primary.light' }} />
          <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: 'primary.main' }}>
            Sign In
          </Button>

          <Link sx={{ mt: 1, textDecoration: 'none' }} href="/forgot" variant="body2">
            Forgot password?
          </Link>
        </Box>
        <Divider style={{ width: '60%', background: 'primary.dark' }} />
        <Typography sx={{ color: 'secondary.main' }} mr="10px" fontSize={'12px'}>
          Session is valid for 1 hour
        </Typography>
        <Link sx={{ fontSize: '14px', textDecoration: 'none', mb: '10px' }} href="/about-us" variant="body2">
          About Us
        </Link>
      </Grid>
    </Grid>
  );
}
