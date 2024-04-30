import React from 'react';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createAdmin } from '../services/lib/superAdmin';
import { useLoadingStore } from '../stores/Loading';
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';

export default function CreateAdmin() {
  const navigate = useNavigate();
  const setLoading = useLoadingStore((s) => s.setLoading);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
      phone: formData.get('phone'),
      birthDate: new Date(),
      companyName: '',
      salary: 0,
      iban: '',
    };

    try {
      setLoading(true);
      const response = await createAdmin(data);
      notify('Admin created successfully', NOTIFY_TYPES.SUCCESS);
      navigate('/login');
    } catch (error) {
      notifyError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 3,
          p: 2,
          borderRadius: '16px',
          backgroundColor: 'background.paper',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        <Typography component="h1" variant="h5">
          Create Admin
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name Surname"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="tel"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: 'primary.main' }}
          >
            Create Admin
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
