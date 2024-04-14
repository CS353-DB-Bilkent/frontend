import * as React from 'react';
import { Box, Button, Grid, Link, TextField, Typography, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signUpEventOrganizer, signUpUser } from '../services/lib/auth';
import { useState } from 'react';
import { useLoadingStore } from '../stores/Loading';
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';

export default function RegisterUser() {
  const navigate = useNavigate();
  const [isOrganizer, setIsOrganizer] = useState(false);
  const setLoading = useLoadingStore((s) => s.setLoading);

  const handleFormSwitch = (event) => {
    setIsOrganizer(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      phone: formData.get('phone'),
      birthDate: new Date(formData.get('birthDate')),
      companyName: isOrganizer ? formData.get('companyName') : '',
      salary: isOrganizer ? formData.get('salary') : 0,
      iban: isOrganizer ? formData.get('iban') : '',
    };

    try {
      setLoading(true);
      if (!isOrganizer) {
        await signUpUser(data.email, data.name, data.password, data.phone, data.birthDate, data.companyName, data.salary, data.iban);
      } else {
        await signUpEventOrganizer(data.email, data.name, data.password, data.phone, data.birthDate, data.companyName, data.salary, data.iban);
      }
      notify('Registration successful', NOTIFY_TYPES.SUCCESS);
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
          width: '100%', // Ensure the Grid item takes up the full width of its parent
          maxWidth: '500px', // Set a max-width to prevent the Grid item from being too wide on larger screens
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Typography component="div" sx={{ mt: 2 }}>
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>User</Grid>
            <Grid item>
              <Switch
                // Assuming you have a state variable 'isOrganizer' to track which form to show
                checked={isOrganizer}
                onChange={handleFormSwitch} // You will need to implement this handler
                name="isOrganizer"
              />
            </Grid>
            <Grid item>Event Organizer</Grid>
          </Grid>
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {/* Common fields always full width when in 'User' mode, half width in 'Event Organizer' mode */}
            <Grid item xs={12} sm={isOrganizer ? 6 : 12}>
              <TextField margin="normal" required fullWidth id="name" label="Name Surname" name="name" autoComplete="name" autoFocus />
              <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
              <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" />
              <TextField margin="normal" required fullWidth id="phone" label="Phone Number" name="phone" autoComplete="tel" />
              <TextField margin="normal" required fullWidth id="birthDate" label="Birth Date" name="birthDate" type="date" InputLabelProps={{ shrink: true, }} autoComplete="bday" />
            </Grid>

            {/* Event Organizer-specific fields only render when in 'Event Organizer' mode */}
            {isOrganizer && (
              <Grid item xs={12} sm={6}>
                <TextField margin="normal" required fullWidth id="companyName" label="Company Name" name="companyName" autoComplete="organization" />
                <TextField margin="normal" required fullWidth id="iban" label="IBAN" name="iban" autoComplete="iban" />
              </Grid>
            )}
          </Grid>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, bgcolor: 'primary.main' }}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
